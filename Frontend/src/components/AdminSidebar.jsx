import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Megaphone, Image, Settings, LogOut, X, Users } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Haberler', path: '/admin/news', icon: Newspaper },
    { name: 'Duyurular', path: '/admin/announcements', icon: Megaphone },
    { name: 'Topluluklar', path: '/admin/clubs', icon: Users },
    { name: 'Galeri', path: '/admin/gallery', icon: Image },
    { name: 'Sayfa Ayarları', path: '/admin/pages', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <Link to="/admin/dashboard" className="text-xl font-heading font-bold">Admin Panel</Link>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors mt-8"
          >
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
