import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "HYROX Competitor",
      rating: 5,
      text: "The structured programs and expert coaching at Athleland transformed my performance. I shaved 8 minutes off my HYROX time in just 12 weeks!",
    },
    {
      name: "Maria Garcia",
      role: "CrossFit Athlete",
      rating: 5,
      text: "Best conditioning program I've ever followed. The AI-powered workout descriptions help me understand every movement and the reasoning behind it.",
    },
    {
      name: "James Wilson",
      role: "Marathon Runner",
      rating: 5,
      text: "The community here is incredible. Everyone pushes each other to be better, and the coaches genuinely care about your progress.",
    },
    {
      name: "Sarah Chen",
      role: "Triathlete",
      rating: 5,
      text: "The transparency in class scheduling and workout previews is a game-changer. I always know what I'm getting into before I join a session.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Athlete <span className="text-primary">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from real athletes. See how our community is achieving their goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all hover-scale">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-primary fill-primary" size={20} />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-card border border-primary/30 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of athletes who are transforming their performance with structured, expert-led training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-4 rounded-md shadow-xl hover:shadow-primary/60 transition-all hover:scale-105">
              Get Started Today
            </button>
            <button className="border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all px-8 py-4 rounded-md text-lg">
              Schedule a Tour
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
