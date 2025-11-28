import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About CMIS</h3>
            <p className="text-sm text-primary-foreground/90 leading-relaxed">
              The Council for the Management of Information Systems brings together students, faculty, and industry members in active partnerships.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/student" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Students
                </Link>
              </li>
              <li>
                <Link to="/alumni" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Alumni
                </Link>
              </li>
              <li>
                <Link to="/sponsor" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Industry Sponsors
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Faculty/Administrators
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="https://mays.tamu.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Mays Business School
                </a>
              </li>
              <li>
                <a href="https://www.tamu.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Texas A&M University
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/90">
                  Mays Business School<br />
                  Texas A&M University<br />
                  College Station, TX 77843
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:cmis@mays.tamu.edu" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  cmis@mays.tamu.edu
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+19798456060" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  (979) 845-6060
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/80">
              © {new Date().getFullYear()} Council for the Management of Information Systems. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
