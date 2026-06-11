import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-vj-neutral border-t border-vj-border ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="font-playfair text-2xl font-bold text-vj-primary">
              VJ Startups
            </div>
            <p className="text-sm text-vj-muted leading-relaxed">
              Empowering college entrepreneurs to build the future, five great startups every year.
            </p>
          </div>
          
          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vj-primary">Community</h3>
            <div className="space-y-2">
              <Link to="/problems" className="block text-sm text-vj-muted hover:text-vj-primary transition-colors">
                Problems
              </Link>
              <Link to="/ideas" className="block text-sm text-vj-muted hover:text-vj-primary transition-colors">
                Ideas
              </Link>
              <Link to="/startups" className="block text-sm text-vj-muted hover:text-vj-primary transition-colors">
                Startups
              </Link>
            </div>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vj-primary">Resources</h3>
            <div className="space-y-2">
              <Link to="/programs/mentorship-program-1?tab=mentors#faculty-mentor-panel" className="block text-sm text-vj-muted hover:text-vj-primary transition-colors">
                Mentor Network
              </Link>
              <span className="block text-sm text-vj-muted">
                Funding Guide
              </span>
              <span className="block text-sm text-vj-muted">
                Success Stories
              </span>
            </div>
          </div>
          
          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vj-primary">Connect</h3>
            <div className="flex space-x-4">
              {/* <a href="#" className="text-vj-muted hover:text-vj-accent transition-colors">
                <Github size={20} />
              </a> */}
              <a href="https://www.instagram.com/vj.startups?igsh=dW04OTdvczNxM3Jh" className="text-vj-muted hover:text-vj-accent transition-colors">
                <Instagram size={20} />
              </a> 
              <a href="https://www.linkedin.com/company/vj-startups/" className="text-vj-muted hover:text-vj-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="head.iie@vnrvjiet.in" className="text-vj-muted hover:text-vj-accent transition-colors">
                <Mail size={20} />
              </a>
            </div>
            <div className="text-sm text-vj-muted">
              <p>VJ Startups</p>
              <p>Hyderabad. IN 500090</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-vj-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-vj-muted">
            © 2026 VJ Startups. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-sm text-vj-muted hover:text-vj-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-vj-muted hover:text-vj-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
