import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Calendar, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Class {
  id: string;
  name: string;
  class_date: string;
  class_time: string;
  duration_minutes: number;
  intensity: string;
  max_participants: number;
  current_enrolled: number;
  coaches: { name: string } | null;
}

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
    fetchTemplatesAndCoaches();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          coaches (name)
        `)
        .order("class_date", { ascending: true })
        .order("class_time", { ascending: true });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplatesAndCoaches = async () => {
    try {
      const { data: tdata } = await supabase.from("workout_templates").select("*");
      setTemplates((tdata || []).map((t: any) => ({ id: t.id, name: t.name })));

      const { data: cdata } = await supabase.from("coaches").select("*");
      setCoaches((cdata || []).map((c: any) => ({ id: c.id, name: c.name })));
    } catch (err) {
      console.error("Error fetching templates/coaches", err);
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case "high":
        return "bg-intensity-high text-white";
      case "medium":
        return "bg-intensity-medium text-white";
      case "low":
        return "bg-intensity-low text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Classes Management</h1>
          <p className="text-muted-foreground">
            Create, schedule, and manage fitness classes
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2" size={18} />
          Create Class
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Class</DialogTitle>
            <DialogDescription>Schedule a new class using a template and assign an instructor</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formEl = e.currentTarget as HTMLFormElement;
              const formData = new FormData(formEl);

              const payload = {
                name: formData.get("name") as string,
                template_id: (formData.get("template_id") as string) || null,
                coach_id: (formData.get("coach_id") as string) || null,
                intensity: (formData.get("intensity") as string) || "Medium",
                class_date: formData.get("class_date") as string,
                class_time: formData.get("class_time") as string,
                duration_minutes: Number(formData.get("duration_minutes")) || 60,
                max_participants: Number(formData.get("max_participants")) || 20,
                current_enrolled: 0,
              };

              try {
                await supabase.from("classes").insert(payload);
                toast({ title: "Success", description: "Class created successfully" });
                setCreateOpen(false);
                fetchClasses();
              } catch (err) {
                console.error("Create class error", err);
                toast({ title: "Error", description: "Failed to create class", variant: "destructive" });
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Class Name</Label>
              <Input id="name" name="name" placeholder="e.g., HIIT Boot Camp" required />
            </div>

            <div>
              <Label>Workout Template</Label>
              <input type="hidden" name="template_id" id="template_id" />
              <Select onValueChange={(v) => {
                const input = document.getElementById("template_id") as HTMLInputElement;
                if (input) input.value = v;
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.length > 0 ? (
                    templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No templates available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Instructor Name</Label>
              <input type="hidden" name="coach_id" id="coach_id" />
              <Select onValueChange={(v) => {
                const input = document.getElementById("coach_id") as HTMLInputElement;
                if (input) input.value = v;
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {coaches.length > 0 ? (
                    coaches.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No instructors available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Intensity</Label>
              <input type="hidden" name="intensity" id="intensity" defaultValue="Medium" />
              <Select defaultValue="Medium" onValueChange={(v) => {
                const input = document.getElementById("intensity") as HTMLInputElement;
                if (input) input.value = v;
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="class_date">Date</Label>
                <Input id="class_date" name="class_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="class_time">Time</Label>
                <Input id="class_time" name="class_time" type="time" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input id="duration_minutes" name="duration_minutes" type="number" defaultValue="60" min="5" max="180" />
              </div>
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input id="max_participants" name="max_participants" type="number" defaultValue="20" min="1" max="100" />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Class
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12">Loading classes...</div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No classes found</p>
              <p className="text-sm">Create your first class to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{classItem.name}</CardTitle>
                  <Badge className={getIntensityColor(classItem.intensity)}>
                    {classItem.intensity}
                  </Badge>
                </div>
                <CardDescription>
                  {classItem.coaches?.name || "No instructor assigned"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-primary" size={16} />
                  <span>{new Date(classItem.class_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-primary" size={16} />
                  <span>{classItem.class_time} ({classItem.duration_minutes} min)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="text-primary" size={16} />
                  <span>{classItem.current_enrolled}/{classItem.max_participants} enrolled</span>
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

export default Classes;
