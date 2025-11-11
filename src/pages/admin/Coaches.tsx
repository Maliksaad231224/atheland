import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Users, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Coach {
  id: string;
  name: string;
  title: string;
  specialties: string;
  bio: string;
  experience: string;
  email: string;
  phone?: string;
  certifications: string;
}

const Coaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from("coaches")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoaches(data || []);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast({
        title: "Error",
        description: "Failed to fetch coaches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coach Management</h1>
          <p className="text-muted-foreground">
            Add and manage coaching staff
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2" size={18} />
          Add New Coach
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Coach</DialogTitle>
            <DialogDescription>Add a new coach to your team</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formEl = e.currentTarget as HTMLFormElement;
              const formData = new FormData(formEl);

              const payload = {
                name: formData.get("name") as string,
                title: formData.get("title") as string,
                specialties: formData.get("specialties") as string,
                bio: formData.get("bio") as string,
                experience: formData.get("experience") as string,
                email: formData.get("email") as string,
                phone: (formData.get("phone") as string) || null,
                certifications: formData.get("certifications") as string,
              };

              try {
                await supabase.from("coaches").insert(payload);
                toast({ title: "Success", description: "Coach added successfully" });
                setCreateOpen(false);
                fetchCoaches();
              } catch (err) {
                console.error("Create coach error", err);
                toast({ title: "Error", description: "Failed to add coach", variant: "destructive" });
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="e.g., Sarah Mitchell" required />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g., Head Performance Coach" required />
            </div>

            <div>
              <Label htmlFor="specialties">Specialties (comma separated)</Label>
              <Input
                id="specialties"
                name="specialties"
                placeholder="e.g., HYROX Training, Functional Fitness"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Coach biography and background..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input id="experience" name="experience" placeholder="e.g., 5+ years" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="coach@athleland.com" required />
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>

            <div>
              <Label htmlFor="certifications">Certifications (comma separated)</Label>
              <Input
                id="certifications"
                name="certifications"
                placeholder="e.g., NASM-CPT, CrossFit Level 1, ISSA"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Coach
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12">Loading coaches...</div>
      ) : coaches.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No coaches found</p>
              <p className="text-sm">Add your first coach to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <Card key={coach.id} className="hover-scale">
              <CardHeader>
                <CardTitle className="text-xl">{coach.name}</CardTitle>
                <CardDescription>{coach.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {coach.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{coach.bio}</p>
                )}

                {coach.specialties && (
                  <div className="flex gap-1 flex-wrap">
                    {coach.specialties.split(",").map((spec, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {spec.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                {coach.experience && (
                  <p className="text-sm font-semibold">
                    Experience: <span className="font-normal">{coach.experience}</span>
                  </p>
                )}

                <div className="space-y-1 text-sm">
                  {coach.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <a href={`mailto:${coach.email}`} className="text-primary hover:underline">
                        {coach.email}
                      </a>
                    </div>
                  )}
                  {coach.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <a href={`tel:${coach.phone}`} className="text-primary hover:underline">
                        {coach.phone}
                      </a>
                    </div>
                  )}
                </div>

                {coach.certifications && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Certifications:</strong> {coach.certifications}
                  </div>
                )}

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

export default Coaches;
