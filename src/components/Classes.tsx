import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Zap } from "lucide-react";
import classImage from "@/assets/class-training.jpg";

const Classes = () => {
  const classes = [
    {
      name: "HYROX Preparation",
      instructor: "Coach Sarah Mitchell",
      time: "Mon, Wed, Fri - 6:00 AM",
      duration: "60 min",
      intensity: "High",
      focus: "Endurance & Strength",
      maxParticipants: 20,
      enrolled: 18,
      description: "Prepare for HYROX competitions with specialized training combining running and functional fitness.",
    },
    {
      name: "Sprint Conditioning",
      instructor: "Coach Marcus Lee",
      time: "Tue, Thu - 7:00 PM",
      duration: "45 min",
      intensity: "High",
      focus: "Speed & Power",
      maxParticipants: 15,
      enrolled: 12,
      description: "High-intensity interval training focused on explosive power and sprint performance.",
    },
    {
      name: "Strength Endurance",
      instructor: "Coach Emma Rodriguez",
      time: "Mon, Wed - 5:30 PM",
      duration: "75 min",
      intensity: "Medium",
      focus: "Strength Building",
      maxParticipants: 25,
      enrolled: 20,
      description: "Build lasting strength with structured lifting programs and endurance work.",
    },
    {
      name: "General Conditioning",
      instructor: "Coach James Carter",
      time: "Sat - 9:00 AM",
      duration: "60 min",
      intensity: "Medium",
      focus: "Full Body",
      maxParticipants: 30,
      enrolled: 28,
      description: "Well-rounded conditioning class suitable for all fitness levels.",
    },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "High":
        return "bg-intensity-high text-white";
      case "Medium":
        return "bg-intensity-medium text-white";
      case "Low":
        return "bg-intensity-low text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <section id="classes" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Upcoming <span className="text-primary">Classes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent scheduling with AI-powered workout descriptions. Know exactly what you're getting into before you join.
          </p>
        </div>

        {/* Featured Class Image */}
        <div className="relative mb-16 rounded-2xl overflow-hidden h-64 group hover-scale">
          <img
            src={classImage}
            alt="Group training class"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Join a Class Today</h3>
              <p className="text-muted-foreground">Experience the difference with structured, expert-led training</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {classes.map((classItem, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all hover-scale group">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {classItem.name}
                  </CardTitle>
                  <Badge className={getIntensityColor(classItem.intensity)}>
                    {classItem.intensity}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  {classItem.instructor}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{classItem.description}</p>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-primary" size={16} />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-primary" size={16} />
                    <span>{classItem.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="text-primary" size={16} />
                    <span>{classItem.focus}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="text-primary" size={16} />
                    <span>{classItem.enrolled}/{classItem.maxParticipants}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="default" className="flex-1">
                    Enroll Now
                  </Button>
                  <Button variant="outline">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View Full Schedule
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Classes;
