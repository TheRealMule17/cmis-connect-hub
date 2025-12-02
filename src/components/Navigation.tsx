import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Menu, Search } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to appropriate page based on search query or implement search logic
      console.log("Searching for:", searchQuery);
      // Example: navigate to a search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-background">
      {/* Top maroon bar matching Texas A&M style */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and title section */}
            <Link to="/" className="flex items-center gap-2 md:gap-4">
              <img 
                src="/texas-am-logo.png" 
                alt="Texas A&M Mays Business School" 
                className="h-8 md:h-12 w-auto"
              />
              <div className="hidden sm:block border-l border-primary-foreground/30 pl-2 md:pl-4">
                <span className="text-sm md:text-lg font-semibold tracking-wide">Council for the Management of Information Systems</span>
              </div>
              <div className="sm:hidden">
                <span className="text-xs font-semibold">CMIS</span>
              </div>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm font-normal" asChild>
                <Link to="/about">About Us</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm font-normal" asChild>
                <Link to="/gallery">Gallery</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm font-normal" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/70" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 w-[200px] bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-primary-foreground/50"
                />
              </form>
            </div>

            {/* Mobile menu button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <h3 className="font-semibold text-lg mb-2">Navigation</h3>
                  <Button variant="ghost" className="justify-start" asChild onClick={() => setOpen(false)}>
                    <Link to="/about">About Us</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild onClick={() => setOpen(false)}>
                    <Link to="/gallery">Gallery</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild onClick={() => setOpen(false)}>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg mb-2">Portals</h3>
                    <Button variant="ghost" className="justify-start w-full" asChild onClick={() => setOpen(false)}>
                      <Link to="/student">Students</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start w-full" asChild onClick={() => setOpen(false)}>
                      <Link to="/dashboard">Faculty/Administrators</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start w-full" asChild onClick={() => setOpen(false)}>
                      <Link to="/sponsor">Industry Sponsors</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start w-full" asChild onClick={() => setOpen(false)}>
                      <Link to="/alumni">Alumni</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Secondary navigation bar - desktop only */}
      <div className="hidden lg:block bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-3">
            <Button
              variant="ghost"
              className={`text-xs lg:text-sm ${isActive("/student") ? "bg-accent" : "hover:bg-accent"}`}
              asChild
            >
              <Link to="/student">
                <span className="font-normal">Students</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={`text-xs lg:text-sm ${isActive("/dashboard") ? "bg-accent" : "hover:bg-accent"}`}
              asChild
            >
              <Link to="/dashboard">
                <span className="font-normal">Faculty/Administrators</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={`text-xs lg:text-sm ${isActive("/sponsor") ? "bg-accent" : "hover:bg-accent"}`}
              asChild
            >
              <Link to="/sponsor">
                <span className="font-normal">Industry Sponsors</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={`text-xs lg:text-sm ${isActive("/alumni") ? "bg-accent" : "hover:bg-accent"}`}
              asChild
            >
              <Link to="/alumni">
                <span className="font-normal">Alumni</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
