import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import equipmentImage from "@/assets/equipment.jpg";

const Events = () => {
  const events = [
    {
      name: "HYROX Competition Prep Camp",
      date: "March 15-17, 2025",
      location: "Athleland HQ",
      participants: "40 Athletes",
      description: "Intensive 3-day camp focused on race strategies, pacing, and transition efficiency for upcoming HYROX events.",
    },
    {
      name: "Community Fitness Challenge",
      date: "April 8, 2025",
      location: "Central Park",
      participants: "100+ Athletes",
      description: "Team-based fitness challenge featuring various stations and movements. Open to all fitness levels.",
    },
    {
      name: "Nutrition & Recovery Workshop",
      date: "April 22, 2025",
      location: "Virtual + In-Person",
      participants: "Unlimited",
      description: "Learn from sports nutritionists and recovery experts about optimizing your performance through diet and rest.",
    },
  ];

  const sponsors = [
    { name: "PowerFuel", type: "Nutrition Partner" },
    { name: "TechGear", type: "Equipment Sponsor" },
    { name: "RecoveryPro", type: "Recovery Partner" },
    { name: "AthleteWear", type: "Apparel Partner" },
  ];

  return (
    <section id="events" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Events & <span className="text-primary">Community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our community events, competitions, and workshops. Connect with fellow athletes and push your limits together.
          </p>
        </div>

        {/* Events */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {events.map((event, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all hover-scale">
              <CardHeader>
                <CardTitle className="text-xl">{event.name}</CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-primary" size={16} />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-primary" size={16} />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="text-primary" size={16} />
                    {event.participants}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <Button variant="outline" className="w-full">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sponsors Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={equipmentImage}
              alt="Training equipment"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Our <span className="text-primary">Partners</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-all hover-scale"
                >
                  <div className="text-xl font-bold mb-2">{sponsor.name}</div>
                  <div className="text-xs text-primary">{sponsor.type}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline">
                Become a Sponsor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
