import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Building2, BarChart3 } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b bg-card shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <GraduationCap className="h-8 w-8" />
            <span>CMIS</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={isActive("/about") ? "default" : "ghost"}
              asChild
            >
              <Link to="/about">About Us</Link>
            </Button>
            
            <Button
              variant={isActive("/student") ? "default" : "ghost"}
              asChild
            >
              <Link to="/student">Students</Link>
            </Button>
            
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              asChild
            >
              <Link to="/dashboard">Faculty/Administrators</Link>
            </Button>
            
            <Button
              variant={isActive("/sponsor") ? "default" : "ghost"}
              asChild
            >
              <Link to="/sponsor">Industry Sponsors</Link>
            </Button>
            
            <Button
              variant={isActive("/alumni") ? "default" : "ghost"}
              asChild
            >
              <Link to="/alumni">Alumni</Link>
            </Button>
            
            <Button
              variant={isActive("/contact") ? "default" : "ghost"}
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
