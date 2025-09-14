import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActivePage = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200 no-underline"
              onClick={closeMobileMenu}
            >
              FilmFlix
            </Link>
          </div>

          {/* Desktop Navigation - Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Movies Link */}
                <Link
                  to="/movies"
                  className={`px-3 py-2  text-sm border-gray-900 font-medium border transition-all duration-200 no-underline ${
                    isActivePage('/movies')
                      ? 'bg-gray-900 text-white  hover:bg-white hover:text-gray-900'
                      : 'text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  Movies
                </Link>

                {/* User Profile */}
                <Link
                  to="/profile" 
                  className="flex items-center space-x-2 px-3 py-2  hover:bg-blue-50 transition-colors duration-200 no-underline"
                >
                  <div 
                    className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium rounded-full shadow-sm"
                  >
                    {user?.username?.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <span className="text-blue-600 font-medium">{user?.username}</span>
                </Link>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium  border transition-all duration-200 no-underline ${
                    isActivePage('/login')
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Login
                </Link>

                {/* Register Button */}
                <Link
                  to="/register"
                  className={`px-4 py-2 text-sm font-medium  border transition-all duration-200 no-underline ${
                    isActivePage('/register')
                      ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                      : 'text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2  text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-expanded="false"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {/* User Profile Mobile */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-3  hover:bg-blue-50 transition-colors duration-200 no-underline"
                    onClick={closeMobileMenu}
                  >
                    <div 
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-base font-medium rounded-full shadow-sm"
                    >
                      {user?.username?.charAt(0).toUpperCase() || <User size={20} />}
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium text-base">{user?.username}</span>
                      <p className="text-gray-500 text-sm">View Profile</p>
                    </div>
                  </Link>

                  {/* Movies Link Mobile */}
                  <Link
                    to="/movies"
                    className={`block px-3 py-3  text-base font-medium transition-all duration-200 no-underline ${
                      isActivePage('/movies')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Movies
                  </Link>
                </>
              ) : (
                <>
                  {/* Login Button Mobile */}
                  <Link
                    to="/login"
                    className={`block px-3 py-3  text-base font-medium transition-all duration-200 no-underline ${
                      isActivePage('/login')
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>

                  {/* Register Button Mobile */}
                  <Link
                    to="/register"
                    className={`block px-3 py-3  text-base font-medium transition-all duration-200 no-underline ${
                      isActivePage('/register')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;