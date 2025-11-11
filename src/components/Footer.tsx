import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">
                AC
              </div>
              <span className="text-xl font-bold">
                Athleland<span className="text-primary"> Conditioning</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Elite performance training for athletes who demand excellence.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#classes" className="hover:text-primary transition-colors">Classes</a></li>
              <li><a href="#programs" className="hover:text-primary transition-colors">Programs</a></li>
              <li><a href="#events" className="hover:text-primary transition-colors">Events</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover-scale">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover-scale">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover-scale">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover-scale">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Athleland Conditioning Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
