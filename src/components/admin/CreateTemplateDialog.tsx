import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const templateSchema = z.object({
  template_type: z.enum(["HIIT", "STRENGTH", "CARDIO", "HYROX"], {
    required_error: "Please select a workout type",
  }),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  category: z.enum(["Hyrox Preparation", "Sprint Conditioning", "Strength Endurance", "General Endurance"], {
    required_error: "Please select a category",
  }),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  // If provided, dialog will load and edit this template id
  editingTemplateId?: string | null;
}

export function CreateTemplateDialog({ open, onOpenChange, onSuccess, editingTemplateId }: CreateTemplateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  type Exercise = {
    id: string;
    exercise_name: string;
    weight?: string;
    value?: string;
    unit: string;
  };

  type Block = {
    id: string;
    block_name?: string;
    rounds?: number;
    ai_description?: string;
    exercises: Exercise[];
  };

  const emptyExercise = (): Exercise => ({ id: genId(), exercise_name: "", weight: "", value: "", unit: "reps" });
  const emptyBlock = (): Block => ({ id: genId(), block_name: "", rounds: 1, ai_description: "", exercises: [emptyExercise()] });

  const [blocks, setBlocks] = useState<Block[]>([emptyBlock()]);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open && editingTemplateId) {
      loadTemplate(editingTemplateId).catch((err) => console.error(err));
    }
    if (!open) {
      // reset when dialog closed (keep a single empty block)
      form.reset();
      setBlocks([emptyBlock()]);
    }
  }, [open, editingTemplateId]);

  // Load existing template when editing
  const loadTemplate = async (templateId: string) => {
    try {
      const { data: tdata, error: tErr } = await supabase.from("workout_templates").select("*").eq("id", templateId).single();
      if (tErr) throw tErr;

      form.reset({
        name: tdata.name,
        description: tdata.description || "",
        template_type: tdata.template_type,
        category: tdata.category,
      });

      // load blocks
      const { data: blocksData, error: blocksErr } = await supabase
        .from("template_blocks")
        .select("*")
        .eq("template_id", templateId)
        .order("block_order", { ascending: true });
      if (blocksErr) throw blocksErr;

      const loadedBlocks: Block[] = [];
      for (const b of blocksData || []) {
        const { data: exercisesData, error: exErr } = await supabase
          .from("template_exercises")
          .select("*")
          .eq("block_id", b.id)
          .order("exercise_order", { ascending: true });
        if (exErr) throw exErr;

        const exercises: Exercise[] = (exercisesData || []).map((ex: any) => ({
          id: genId(),
          exercise_name: ex.exercise_name || "",
          weight: ex.weight != null ? String(ex.weight) : "",
          value: ex.reps != null ? String(ex.reps) : "",
          unit: ex.reps != null ? "reps" : (ex.notes ? JSON.parse(ex.notes).unit || "reps" : "reps"),
        }));

        loadedBlocks.push({ id: genId(), block_name: b.block_name || "", rounds: b.rounds || 1, ai_description: b.ai_description || "", exercises });
      }

      if (loadedBlocks.length) setBlocks(loadedBlocks);
    } catch (err) {
      console.error("Error loading template for edit", err);
    }
  };

  const addBlock = () => setBlocks((s) => [...s, emptyBlock()]);
  const removeBlock = (id: string) => setBlocks((s) => s.filter((b) => b.id !== id));

  const addExercise = (blockId: string) =>
    setBlocks((s) => s.map((b) => (b.id === blockId ? { ...b, exercises: [...b.exercises, emptyExercise()] } : b)));

  const removeExercise = (blockId: string, exerciseId: string) =>
    setBlocks((s) => s.map((b) => (b.id === blockId ? { ...b, exercises: b.exercises.filter((e) => e.id !== exerciseId) } : b)));

  const updateBlock = (blockId: string, data: Partial<Block>) =>
    setBlocks((s) => s.map((b) => (b.id === blockId ? { ...b, ...data } : b)));

  const updateExercise = (blockId: string, exerciseId: string, data: Partial<Exercise>) =>
    setBlocks((s) =>
      s.map((b) =>
        b.id === blockId
          ? { ...b, exercises: b.exercises.map((e) => (e.id === exerciseId ? { ...e, ...data } : e)) }
          : b
      )
    );

  const onSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true);
    try {
      // Insert template first and get id
      const { data: insertData, error: insertError } = await supabase
        .from("workout_templates")
        .insert({
          name: data.name,
          description: data.description,
          template_type: data.template_type,
          category: data.category,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      const templateId = insertData.id as string;

      // If editing, update template and clear existing blocks so we can re-insert
      if (editingTemplateId) {
        const { error: updateErr } = await supabase.from("workout_templates").update({
          name: data.name,
          description: data.description,
          template_type: data.template_type,
          category: data.category,
        }).eq("id", editingTemplateId);
        if (updateErr) throw updateErr;

        // delete existing blocks (cascade deletes exercises)
        const { error: delErr } = await supabase.from("template_blocks").delete().eq("template_id", editingTemplateId);
        if (delErr) throw delErr;
      }

      // Insert blocks and exercises
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const { data: blockData, error: blockError } = await supabase
          .from("template_blocks")
          .insert({
            template_id: editingTemplateId || templateId,
            block_order: i,
            block_name: b.block_name || null,
            rounds: b.rounds || 1,
            ai_description: b.ai_description || null,
          })
          .select("id")
          .single();

        if (blockError) throw blockError;

        const blockId = blockData.id as string;

        for (let j = 0; j < b.exercises.length; j++) {
          const e = b.exercises[j];

          // Map value/unit appropriately: if unit is reps/rounds/laps use reps column, else store in notes
          let reps: number | null = null;
          let notes: string | null = null;

          const parsedValue = e.value ? Number(e.value) : null;
          if (e.unit === "reps" || e.unit === "rounds" || e.unit === "laps") {
            reps = parsedValue ? Math.floor(parsedValue) : null;
          } else {
            notes = JSON.stringify({ unit: e.unit, value: parsedValue });
          }

          const weight = e.weight ? Number(e.weight) : null;

          const { error: exerciseError } = await supabase.from("template_exercises").insert({
            block_id: blockId,
            exercise_order: j,
            exercise_name: e.exercise_name || "",
            reps: reps,
            weight: weight,
            is_bodyweight: weight === null || weight === 0,
            notes: notes,
          });

          if (exerciseError) throw exerciseError;
        }
      }

      toast({
        title: "Success",
        description: "Workout template created successfully",
      });

      form.reset();
      setBlocks([emptyBlock()]);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workout Template</DialogTitle>
          <DialogDescription>
            Step 1: Choose workout type and basic info
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="template_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quick Start - Choose Workout Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="HIIT" id="hiit" />
                            <FormLabel htmlFor="hiit" className="font-normal cursor-pointer">
                              HIIT
                            </FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="STRENGTH" id="strength" />
                            <FormLabel htmlFor="strength" className="font-normal cursor-pointer">
                              Strength
                            </FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="CARDIO" id="cardio" />
                            <FormLabel htmlFor="cardio" className="font-normal cursor-pointer">
                              Cardio
                            </FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="HYROX" id="hyrox" />
                            <FormLabel htmlFor="hyrox" className="font-normal cursor-pointer">
                              HYROX
                            </FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., HIIT Cardio Blast" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the workout template"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hyrox Preparation">Hyrox Preparation</SelectItem>
                      <SelectItem value="Sprint Conditioning">Sprint Conditioning</SelectItem>
                      <SelectItem value="Strength Endurance">Strength Endurance</SelectItem>
                      <SelectItem value="General Endurance">General Endurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 2 - Workout Blocks */}
            <div>
              <h3 className="text-lg font-semibold">Step 2: Workout Blocks</h3>
              <p className="text-sm text-muted-foreground mb-3">Add blocks and exercises. Each exercise has a name, optional weight, value and unit.</p>

              <div className="space-y-4">
                {blocks.map((block, bi) => (
                  <div key={block.id} className="p-4 border rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Input
                          placeholder={`Block ${bi + 1} name (optional)`}
                          value={block.block_name}
                          onChange={(e) => updateBlock(block.id, { block_name: e.target.value })}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={block.rounds}
                            onChange={(e) => updateBlock(block.id, { rounds: Number(e.target.value) || 1 })}
                            className="w-28"
                            placeholder="Rounds"
                          />
                          <Input
                            value={block.ai_description}
                            onChange={(e) => updateBlock(block.id, { ai_description: e.target.value })}
                            placeholder="Runtime / AI description (optional)"
                          />
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <Button variant="ghost" onClick={() => removeBlock(block.id)}>
                          Remove Block
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {block.exercises.map((ex) => (
                        <div key={ex.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <Input
                              placeholder="Exercise name"
                              value={ex.exercise_name}
                              onChange={(e) => updateExercise(block.id, ex.id, { exercise_name: e.target.value })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              placeholder="Weight"
                              type="number"
                              value={ex.weight}
                              onChange={(e) => updateExercise(block.id, ex.id, { weight: e.target.value })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              placeholder="Value"
                              type="number"
                              value={ex.value}
                              onChange={(e) => updateExercise(block.id, ex.id, { value: e.target.value })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Select value={ex.unit} onValueChange={(val) => updateExercise(block.id, ex.id, { unit: val })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="reps">reps</SelectItem>
                                <SelectItem value="secs">secs</SelectItem>
                                <SelectItem value="mins">mins</SelectItem>
                                <SelectItem value="rounds">rounds</SelectItem>
                                <SelectItem value="laps">laps</SelectItem>
                                <SelectItem value="calories">calories</SelectItem>
                                <SelectItem value="meters">meters</SelectItem>
                                <SelectItem value="km">km</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-1">
                            <Button variant="ghost" onClick={() => removeExercise(block.id, ex.id)}>
                              Del
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div>
                        <Button variant="outline" size="sm" onClick={() => addExercise(block.id)}>
                          Add Exercise
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <Button onClick={addBlock} variant="ghost">Add Block</Button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Template
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
