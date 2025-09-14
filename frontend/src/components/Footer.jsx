import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FilmFlix
            </span>
          </div>

          {/* Center - Copyright */}
          <div className="text-gray-400 text-sm">
            © {currentYear} FilmFlix. All rights reserved.
          </div>

          {/* Right side - Links */}
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
              Privacy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
              Terms
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;