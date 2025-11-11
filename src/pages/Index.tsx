import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Classes from "@/components/Classes";
import Programs from "@/components/Programs";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Classes />
      <Programs />
      <Events />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
