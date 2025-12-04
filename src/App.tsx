import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chatbot } from "@/components/Chatbot";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Student from "./pages/Student";
import Alumni from "./pages/Alumni";
import Sponsor from "./pages/Sponsor";
import Dashboard from "./pages/Dashboard";
import FacultyAuth from "./pages/FacultyAuth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import SearchResults from "./pages/SearchResults";
import CMIS from "./pages/CMIS";
import NotFound from "./pages/NotFound";
import TalentPipeline from "./pages/TalentPipeline";
import ResearchPartnerships from "./pages/ResearchPartnerships";
import BrandRecognition from "./pages/BrandRecognition";
import CampusEvents from "./pages/CampusEvents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/student" element={<Student />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faculty-auth" element={<FacultyAuth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cmis" element={<CMIS />} />
          <Route path="/talent-pipeline" element={<TalentPipeline />} />
          <Route path="/research-partnerships" element={<ResearchPartnerships />} />
          <Route path="/brand-recognition" element={<BrandRecognition />} />
          <Route path="/campus-events" element={<CampusEvents />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
