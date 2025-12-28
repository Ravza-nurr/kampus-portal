import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ExternalLink } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const AdminTopbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mr-4"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white hidden sm:block">
          Yönetim Paneli
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/')}
          className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <ExternalLink size={16} className="mr-2" />
          Siteye Dön
        </button>

        <ThemeToggle />
        
        <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'Admin'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Yönetici</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
