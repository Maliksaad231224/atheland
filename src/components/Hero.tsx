import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="High-intensity training session"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="text-primary font-bold text-sm uppercase tracking-wider px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              Elite Performance Training
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Transform Your
            <span className="block text-primary">Athletic Performance</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Structured, transparent, and expert-led group training designed for athletes who demand excellence. Join Athleland Conditioning Club and unlock your full potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="group" onClick={() => window.location.href = '/auth'}>
              Start Your Journey
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Play className="mr-2" size={20} />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
            <div>
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Active Athletes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Weekly Classes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Expert Coaches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
