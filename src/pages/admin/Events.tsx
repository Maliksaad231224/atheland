import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Calendar, Clock, MapPin, Users, Tag, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  event_date: string;
  event_time: string;
  duration_minutes: number;
  price: number;
  max_participants: number;
  instructor_name: string;
  location: string;
  registration_deadline: string;
  status: string;
  short_description: string;
  full_description: string;
  is_sponsored: boolean;
  is_featured: boolean;
  tags: string;
  requirements: string;
  what_to_bring: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-500/10 text-gray-700 border-gray-200";
      case "published":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events Management</h1>
          <p className="text-muted-foreground">
            Create, schedule, and manage events
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2" size={18} />
          Create Event
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in all event details below</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formEl = e.currentTarget as HTMLFormElement;
              const formData = new FormData(formEl);

              const payload = {
                title: formData.get("title") as string,
                category: formData.get("category") as string,
                difficulty: formData.get("difficulty") as string,
                event_date: formData.get("event_date") as string,
                event_time: formData.get("event_time") as string,
                duration_minutes: Number(formData.get("duration_minutes")) || 60,
                price: Number(formData.get("price")) || 0,
                max_participants: Number(formData.get("max_participants")) || 20,
                instructor_name: formData.get("instructor_name") as string,
                location: formData.get("location") as string,
                registration_deadline: formData.get("registration_deadline") as string,
                status: formData.get("status") as string,
                short_description: formData.get("short_description") as string,
                full_description: formData.get("full_description") as string,
                is_sponsored: formData.get("is_sponsored") === "on",
                is_featured: formData.get("is_featured") === "on",
                tags: formData.get("tags") as string,
                requirements: formData.get("requirements") as string,
                what_to_bring: formData.get("what_to_bring") as string,
              };

              try {
                await supabase.from("events").insert(payload);
                toast({ title: "Success", description: "Event created successfully" });
                setCreateOpen(false);
                fetchEvents();
              } catch (err) {
                console.error("Create event error", err);
                toast({ title: "Error", description: "Failed to create event", variant: "destructive" });
              }
            }}
            className="space-y-4"
          >
            {/* Event Title */}
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" name="title" placeholder="Enter event title" required />
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category *</Label>
                <input type="hidden" name="category" id="category" defaultValue="Workshop" />
                <Select defaultValue="Workshop" onValueChange={(v) => {
                  const input = document.getElementById("category") as HTMLInputElement;
                  if (input) input.value = v;
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Masterclass">Masterclass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Difficulty *</Label>
                <input type="hidden" name="difficulty" id="difficulty" defaultValue="Intermediate" />
                <Select defaultValue="Intermediate" onValueChange={(v) => {
                  const input = document.getElementById("difficulty") as HTMLInputElement;
                  if (input) input.value = v;
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="event_date">Date *</Label>
                <Input id="event_date" name="event_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="event_time">Time *</Label>
                <Input id="event_time" name="event_time" type="time" required />
              </div>
            </div>

            {/* Duration and Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input id="duration_minutes" name="duration_minutes" type="number" defaultValue="60" min="5" max="480" />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" defaultValue="0" min="0" step="0.01" />
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input id="max_participants" name="max_participants" type="number" defaultValue="20" min="1" max="1000" />
            </div>

            {/* Instructor and Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="instructor_name">Instructor *</Label>
                <Input id="instructor_name" name="instructor_name" placeholder="Instructor name" required />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" name="location" placeholder="ATHLELAND Main Facility" required />
              </div>
            </div>

            {/* Registration Deadline and Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="registration_deadline">Registration Deadline *</Label>
                <Input id="registration_deadline" name="registration_deadline" type="date" required />
              </div>
              <div>
                <Label>Status *</Label>
                <input type="hidden" name="status" id="status" defaultValue="Draft" />
                <Select defaultValue="Draft" onValueChange={(v) => {
                  const input = document.getElementById("status") as HTMLInputElement;
                  if (input) input.value = v;
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Input id="short_description" name="short_description" placeholder="Brief description for event cards" />
            </div>

            {/* Full Description */}
            <div>
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea id="full_description" name="full_description" placeholder="Detailed description for event page" rows={3} />
            </div>

            {/* Sponsored and Featured */}
            <div className="space-y-3 bg-muted/30 p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox id="is_sponsored" name="is_sponsored" />
                <Label htmlFor="is_sponsored" className="font-normal cursor-pointer">
                  This event is sponsored
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="is_featured" name="is_featured" />
                <Label htmlFor="is_featured" className="font-normal cursor-pointer">
                  Featured Event
                </Label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" placeholder="e.g., HYROX, Competition, Strategy" />
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea id="requirements" name="requirements" placeholder="List event requirements" rows={2} />
            </div>

            {/* What to Bring */}
            <div>
              <Label htmlFor="what_to_bring">What to Bring (one per line)</Label>
              <Textarea id="what_to_bring" name="what_to_bring" placeholder="List items to bring" rows={2} />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12">Loading events...</div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No events found</p>
              <p className="text-sm">Create your first event to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="hover-scale flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  {event.is_featured && (
                    <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 shrink-0">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{event.category}</Badge>
                  <Badge className={getDifficultyColor(event.difficulty)}>
                    {event.difficulty}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {event.short_description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-primary shrink-0" size={16} />
                  <span>{new Date(event.event_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-primary shrink-0" size={16} />
                  <span>{event.event_time} ({event.duration_minutes} min)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="text-primary shrink-0" size={16} />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="text-primary shrink-0" size={16} />
                  <span>Max: {event.max_participants}</span>
                </div>
                {event.price > 0 && (
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <AlertCircle className="text-primary shrink-0" size={16} />
                    <span>${event.price.toFixed(2)}</span>
                  </div>
                )}
                {event.tags && (
                  <div className="flex gap-1 flex-wrap pt-2">
                    {event.tags.split(",").map((tag) => (
                      <Badge key={tag.trim()} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
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

export default Events;
