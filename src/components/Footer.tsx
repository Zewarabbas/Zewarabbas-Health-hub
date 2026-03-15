import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg text-white">
                <HeartPulse size={24} />
              </div>
              <span className="text-xl font-display font-bold text-white">Healthy Life Hub</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your ultimate destination for health, fitness, and wellness. We provide science-backed advice to help you live your best life.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog Articles</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/admin" className="text-slate-500 hover:text-primary transition-colors text-xs mt-4 block">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-6">Categories</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/blog?category=weight-loss" className="hover:text-primary transition-colors">Weight Loss</Link></li>
              <li><Link to="/blog?category=home-workout" className="hover:text-primary transition-colors">Home Workout</Link></li>
              <li><Link to="/blog?category=diet-plans" className="hover:text-primary transition-colors">Healthy Diet</Link></li>
              <li><Link to="/blog?category=wellness" className="hover:text-primary transition-colors">Mental Wellness</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to get the latest health tips directly in your inbox.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Healthy Life Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
