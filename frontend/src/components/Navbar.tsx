import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { useState } from "react";
// import ThemeToggle from "./ThemeToggle";
import { useUser } from "../pages/UserContext"; // import the context
import vjLogo from "@/assets/vj-logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // get user and setUser from context
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Smart name truncation for better UX
  const truncateName = (name: string, maxLength: number = 15) => {
    if (!name || name.length <= maxLength) return name;
    
    // Try to keep the first name if possible
    const words = name.split(' ');
    if (words.length > 1 && words[0].length <= maxLength - 3) {
      return `${words[0]} ${words[1].charAt(0)}.`;
    }
    
    // Otherwise, truncate and add ellipsis
    return `${name.substring(0, maxLength - 1)}…`;
  };

  // logout function
  const handleLogout = () => {
    setUser(null); // clears context and localStorage
    navigate("/login"); // redirect to login page
    setIsOpen(false); // close mobile menu
  };

  // Function to handle navigation link clicks
  const handleNavClick = () => {
    setIsOpen(false); // close mobile menu when nav link is clicked
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-vj-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={vjLogo} 
              alt="VJ Startups" 
              className="h-8 md:h-10 transition-transform hover:scale-105"
            />
            <div className="font-playfair text-xl md:text-2xl font-bold text-vj-primary">
              VJ Startups
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/problems"
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive("/problems") ? "text-vj-primary" : "text-vj-muted"
              }`}
            >
              Problems
            </Link>
            <Link
              to="/ideas"
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive("/ideas") ? "text-vj-primary" : "text-vj-muted"
              }`}
            >
              Ideas
            </Link>
            <Link
              to="/startups"
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive("/startups") ? "text-vj-primary" : "text-vj-muted"
              }`}
            >
              Startups
            </Link>
            <Link
              to="/programs"
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive("/programs") ? "text-vj-primary" : "text-vj-muted"
              }`}
            >
              Programs
            </Link>
            <Link
              to="/club"
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive("/club") ? "text-vj-primary" : "text-vj-muted"
              }`}
            >
              Club
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* <ThemeToggle /> */}

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`} 
                      alt={user.name || 'User'} 
                      className="w-8 h-8 rounded-full border-2 border-vj-accent/20 object-cover"
                    />
                    <span 
                      className="text-sm font-medium text-vj-primary max-w-[120px] truncate"
                      title={user.name}
                    >
                      {truncateName(user.name, 15)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-vj-muted hover:text-vj-primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-vj-muted hover:text-vj-primary"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-3">
              {/* User Profile Picture (Mobile) */}
              {user && (
                <img 
                  src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`} 
                  alt={user.name || 'User'} 
                  className="w-8 h-8 rounded-full border-2 border-vj-accent/20 object-cover"
                  title={user.name || 'User Profile'}
                />
              )}
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                      isActive("/") ? "text-vj-primary" : "text-vj-muted"
                    }`}
                    onClick={handleNavClick}
                  >
                    Home
                  </Link>
                  <Link
                    to="/problems"
                    className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                      isActive("/problems") ? "text-vj-primary" : "text-vj-muted"
                    }`}
                    onClick={handleNavClick}
                  >
                    Problems
                  </Link>
                  <Link
                    to="/ideas"
                    className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                      isActive("/ideas") ? "text-vj-primary" : "text-vj-muted"
                    }`}
                    onClick={handleNavClick}
                  >
                    Ideas
                  </Link>
                  <Link
                    to="/startups"
                    className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                      isActive("/startups") ? "text-vj-primary" : "text-vj-muted"
                    }`}
                    onClick={handleNavClick}
                  >
                    Startups
                  </Link>
                  <Link
                    to="/programs"
                    className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                      isActive("/programs") ? "text-vj-primary" : "text-vj-muted"
                    }`}
                    onClick={handleNavClick}
                  >
                    Programs
                  </Link>
                  <Link
                    to="/club"
                    className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                      isActive("/club") ? "text-vj-primary" : "text-vj-muted"
                    }`}
                    onClick={handleNavClick}
                  >
                    Club
                  </Link>
                  
                  {/* Mobile Actions */}
                  <div className="pt-4 border-t border-border">
                    {user ? (
                      <>
                        <div className="flex items-center space-x-3 mb-4">
                          <img 
                            src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`} 
                            alt={user.name || 'User'} 
                            className="w-10 h-10 rounded-full border-2 border-vj-accent/20 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p 
                              className="font-medium text-sm truncate"
                              title={user.name}
                            >
                              {truncateName(user.name, 20)}
                            </p>
                            <p 
                              className="text-xs text-muted-foreground truncate"
                              title={user.email}
                            >
                              {user.email.length > 25 ? `${user.email.substring(0, 22)}...` : user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-vj-muted hover:text-vj-primary"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" onClick={handleNavClick}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-vj-muted hover:text-vj-primary"
                        >
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            </div>

            {/* <Link to="/submit">
              <Button size="sm" className="btn-primary">
                Submit Problem
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </header>
    </TooltipProvider>
  );
};

export default Navbar;
