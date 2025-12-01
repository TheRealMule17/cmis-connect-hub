import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50">
      {/* Top maroon bar matching Texas A&M style */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and title section */}
            <Link to="/" className="flex items-center gap-4">
              <img 
                src="/texas-am-logo.png" 
                alt="Texas A&M Mays Business School" 
                className="h-12 w-auto"
              />
              <div className="border-l border-primary-foreground/30 pl-4">
                <span className="text-lg font-semibold tracking-wide">Council for the Management of Information Systems</span>
              </div>
            </Link>
            
            {/* Right side navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm font-normal" asChild>
                <Link to="/gallery">Gallery</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm font-normal" asChild>
                <Link to="/about">About Us</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm font-normal" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
              <div className="flex items-center gap-2 border border-primary-foreground/30 rounded px-3 py-1.5">
                <Search className="h-4 w-4" />
                <span className="text-sm">Search...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary navigation bar */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${isActive("/student") ? "bg-accent" : "hover:bg-accent"} flex items-center gap-1`}
                >
                  <span className="text-sm font-normal">Students</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/student" className="cursor-pointer">Student Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student#events" className="cursor-pointer">Events & Workshops</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student#career" className="cursor-pointer">Career Resources</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student#mentorship" className="cursor-pointer">Mentorship Program</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${isActive("/dashboard") ? "bg-accent" : "hover:bg-accent"} flex items-center gap-1`}
                >
                  <span className="text-sm font-normal">Faculty/Administrators</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Faculty Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard#events" className="cursor-pointer">Event Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard#analytics" className="cursor-pointer">Student Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard#competitions" className="cursor-pointer">Case Competitions</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${isActive("/sponsor") ? "bg-accent" : "hover:bg-accent"} flex items-center gap-1`}
                >
                  <span className="text-sm font-normal">Industry Sponsors</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/sponsor" className="cursor-pointer">Sponsor Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sponsor#speaking" className="cursor-pointer">Speaking Opportunities</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sponsor#sponsorship" className="cursor-pointer">Event Sponsorship</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sponsor#analytics" className="cursor-pointer">Analytics Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${isActive("/alumni") ? "bg-accent" : "hover:bg-accent"} flex items-center gap-1`}
                >
                  <span className="text-sm font-normal">Alumni</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/alumni" className="cursor-pointer">Alumni Network</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/alumni#mentorship" className="cursor-pointer">Mentorship</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/alumni#career" className="cursor-pointer">Career History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/alumni#stories" className="cursor-pointer">Success Stories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              className={isActive("/gallery") ? "bg-accent" : "hover:bg-accent"}
              asChild
            >
              <Link to="/gallery">
                <span className="text-sm font-normal">Gallery</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={isActive("/about") ? "bg-accent" : "hover:bg-accent"}
              asChild
            >
              <Link to="/about">
                <span className="text-sm font-normal">About Us</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={isActive("/contact") ? "bg-accent" : "hover:bg-accent"}
              asChild
            >
              <Link to="/contact">
                <span className="text-sm font-normal">Contact Us</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
