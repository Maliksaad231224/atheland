import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Program {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  skill_level: string;
  sessions_per_week: number;
  is_active: boolean;
}

interface Phase {
  id: string;
  phase_name: string;
  duration_weeks: number;
  focus: string;
  goals: string;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [phases, setPhases] = useState<Phase[]>([{ id: `phase-0`, phase_name: "", duration_weeks: 4, focus: "", goals: "" }]);
  const { toast } = useToast();

  const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  
  const addPhase = () => {
    setPhases([...phases, { id: genId(), phase_name: "", duration_weeks: 4, focus: "", goals: "" }]);
  };

  const removePhase = (id: string) => {
    setPhases(phases.filter((p) => p.id !== id));
  };

  const updatePhase = (id: string, field: keyof Phase, value: any) => {
    setPhases(phases.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch programs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "advanced":
        return "bg-intensity-high text-white";
      case "intermediate":
        return "bg-intensity-medium text-white";
      case "beginner":
        return "bg-intensity-low text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Programs Management</h1>
          <p className="text-muted-foreground">
            Create and manage multi-week training programs
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2" size={18} />
          Create Program
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Program</DialogTitle>
            <DialogDescription>Create a new training program with multiple phases</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formEl = e.currentTarget as HTMLFormElement;
              const formData = new FormData(formEl);

              const payload = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                duration_weeks: phases.reduce((sum, p) => sum + p.duration_weeks, 0),
                skill_level: (formData.get("skill_level") as string) || "Intermediate",
                sessions_per_week: Number(formData.get("sessions_per_week")) || 3,
                is_active: true,
              };

              try {
                await supabase.from("programs").insert(payload);
                toast({ title: "Success", description: "Program created successfully" });
                setCreateOpen(false);
                setPhases([{ id: `phase-0`, phase_name: "", duration_weeks: 4, focus: "", goals: "" }]);
                fetchPrograms();
              } catch (err) {
                console.error("Create program error", err);
                toast({ title: "Error", description: "Failed to create program", variant: "destructive" });
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Program Name</Label>
              <Input id="name" name="name" placeholder="e.g., 8-Week HYROX Training" required />
            </div>

            <div>
              <Label htmlFor="description">Subtitle / Description</Label>
              <Textarea id="description" name="description" placeholder="Brief program description" rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="skill_level">Skill Level</Label>
                <input type="hidden" name="skill_level" id="skill_level" defaultValue="Intermediate" />
                <select
                  onChange={(e) => {
                    (document.getElementById("skill_level") as HTMLInputElement).value = e.target.value;
                  }}
                  defaultValue="Intermediate"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sessions_per_week">Sessions Per Week</Label>
                <Input id="sessions_per_week" name="sessions_per_week" type="number" defaultValue="3" min="1" max="7" />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Program Phases</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPhase}>
                  Add Phase
                </Button>
              </div>

              <div className="space-y-3">
                {phases.map((phase, idx) => (
                  <div key={phase.id} className="p-3 border rounded-md space-y-2 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Phase {idx + 1}</span>
                      {phases.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhase(phase.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm">Phase Name</Label>
                      <Input
                        placeholder="e.g., Base Building"
                        value={phase.phase_name}
                        onChange={(e) => updatePhase(phase.id, "phase_name", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Duration (weeks)</Label>
                        <Input
                          type="number"
                          value={phase.duration_weeks}
                          onChange={(e) => updatePhase(phase.id, "duration_weeks", Number(e.target.value))}
                          min="1"
                          max="52"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Focus</Label>
                        <Input
                          placeholder="e.g., Strength"
                          value={phase.focus}
                          onChange={(e) => updatePhase(phase.id, "focus", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Goals</Label>
                      <Textarea
                        placeholder="Phase goals and outcomes"
                        value={phase.goals}
                        onChange={(e) => updatePhase(phase.id, "goals", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Program
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12">Loading programs...</div>
      ) : programs.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No programs found</p>
              <p className="text-sm">Create your first program to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.id} className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{program.name}</CardTitle>
                  {program.is_active && (
                    <Badge className="bg-primary text-primary-foreground">Active</Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {program.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getLevelColor(program.skill_level)}>
                    {program.skill_level}
                  </Badge>
                  <Badge variant="outline">{program.duration_weeks} weeks</Badge>
                  <Badge variant="outline">{program.sessions_per_week} sessions/week</Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
