import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Haberler', path: '/news' },
    { name: 'Duyurular', path: '/announcements' },
    { name: 'Topluluklar', path: '/clubs' },
    { name: 'Galeri', path: '/gallery' },
    { name: 'Hakkımızda', path: '/about' },
    { name: 'İletişim', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <span className="text-xl font-heading font-bold text-slate-800 dark:text-white hidden sm:block">Kampüs Portal</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  "relative text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-light",
                  location.pathname === link.path ? "text-primary dark:text-primary-light" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 top-full h-0.5 w-full bg-primary dark:bg-primary-light mt-1"
                  />
                )}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to={user?.role === "admin" ? "/admin" : "/profile"}>
                  <Button size="sm" variant="outline" className="flex items-center">
                    {user?.role === "admin" ? <Shield size={16} className="mr-2" /> : <User size={16} className="mr-2" />}
                    {user?.role === "admin" ? "Admin Panel" : "Profilim"}
                  </Button>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-500 transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors">Giriş Yap</span>
                </Link>
                <Link to="/register">
                  <Button size="sm">Kayıt Ol</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "block text-base font-medium transition-colors",
                    location.pathname === link.path 
                      ? "text-primary dark:text-primary-light" 
                      : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{user?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                      </div>
                    </div>
                    
                    <Link 
                      to={user?.role === "admin" ? "/admin" : "/profile"}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-primary"
                    >
                      {user?.role === "admin" ? <Shield size={18} /> : <User size={18} />}
                      <span>{user?.role === "admin" ? "Admin Panel" : "Profilim"}</span>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-600 w-full text-left"
                    >
                      <LogOut size={18} />
                      <span>Çıkış Yap</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Giriş Yap</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Kayıt Ol</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
