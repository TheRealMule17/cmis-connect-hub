import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Menu, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SearchResult {
  id: string;
  title: string;
  type: "page";
  subtitle?: string;
  path?: string;
}

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const searchSuggestions = () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = searchQuery.toLowerCase();

      // Static page suggestions
      const pages = [
        { path: "/", title: "Home", keywords: ["home", "main", "index"] },
        { path: "/about", title: "About Us", keywords: ["about", "info", "information"] },
        { path: "/gallery", title: "Gallery", keywords: ["gallery", "photos", "images", "pictures"] },
        { path: "/contact", title: "Contact Us", keywords: ["contact", "reach", "email", "message"] },
        { path: "/student", title: "Student Portal", keywords: ["student", "students"] },
        { path: "/alumni", title: "Alumni Portal", keywords: ["alumni", "graduates"] },
        { path: "/sponsor", title: "Sponsor Portal", keywords: ["sponsor", "sponsors", "industry"] },
        { path: "/dashboard", title: "Faculty Dashboard", keywords: ["faculty", "admin", "dashboard"] },
      ];

      const pageResults = pages
        .filter(page => 
          page.title.toLowerCase().includes(query) || 
          page.keywords.some(keyword => keyword.includes(query))
        )
        .map(page => ({
          id: page.path,
          title: page.title,
          type: "page" as const,
          subtitle: "Navigate to page",
          path: page.path,
        }));

      setSuggestions(pageResults);
      setShowSuggestions(pageResults.length > 0);
      setIsSearching(false);
    };

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(searchSuggestions, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleSuggestionClick = (result: SearchResult) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(result.path || "/");
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
              <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                <PopoverTrigger asChild>
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/70 z-10" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      className="pl-9 pr-3 py-1.5 w-[200px] bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-primary-foreground/50"
                    />
                  </form>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[400px] p-0" 
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="max-h-[400px] overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        Searching...
                      </div>
                    ) : (
                      <div className="py-2">
                        {suggestions.map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleSuggestionClick(result)}
                            className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate">{result.title}</p>
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  Page
                                </Badge>
                              </div>
                              {result.subtitle && (
                                <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
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
