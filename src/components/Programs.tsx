import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Award } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      name: "HYROX Race Ready",
      duration: "8 Weeks",
      level: "Advanced",
      sessions: "4 sessions/week",
      icon: Target,
      description: "Comprehensive program to prepare for HYROX competitions. Combines running, rowing, and functional movements.",
      highlights: ["Race-specific workouts", "Progressive overload", "Performance testing"],
    },
    {
      name: "Sprint Power Development",
      duration: "6 Weeks",
      level: "Intermediate",
      sessions: "3 sessions/week",
      icon: TrendingUp,
      description: "Develop explosive power and speed with structured sprint training and strength work.",
      highlights: ["Speed techniques", "Plyometric training", "Power building"],
    },
    {
      name: "Foundation Builder",
      duration: "12 Weeks",
      level: "Beginner",
      sessions: "3 sessions/week",
      icon: Award,
      description: "Build a solid fitness foundation with progressive strength and conditioning work.",
      highlights: ["Movement fundamentals", "Gradual progression", "Habit formation"],
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-intensity-high text-white";
      case "Intermediate":
        return "bg-intensity-medium text-white";
      case "Beginner":
        return "bg-intensity-low text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <section id="programs" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Training <span className="text-primary">Programs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Multi-week structured programs designed to help you achieve specific athletic goals with progressive training.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all hover-scale group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {program.name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getLevelColor(program.level)}>
                      {program.level}
                    </Badge>
                    <Badge variant="outline">{program.duration}</Badge>
                    <Badge variant="outline">{program.sessions}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{program.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Program Highlights:</div>
                    <ul className="space-y-1">
                      {program.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="default" className="w-full mt-4">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Not sure which program fits you?</h3>
              <p className="text-muted-foreground">
                Our expert coaches will help you find the perfect program based on your goals, experience level, and schedule.
              </p>
              <Button variant="hero">
                Schedule a Consultation
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Program Completion Rate</div>
              </div>
              <div className="bg-secondary/50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
