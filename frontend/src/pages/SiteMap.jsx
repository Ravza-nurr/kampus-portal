import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const SiteMap = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const links = {
    general: [
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Haberler', path: '/news' },
      { name: 'Haber Detay (Örnek)', path: '/news/1' },
      { name: 'Duyurular', path: '/announcements' },
      { name: 'Galeri', path: '/gallery' },
      { name: 'Hakkımızda', path: '/about' },
      { name: 'İletişim', path: '/contact' },
    ],
    admin: [
      { name: 'Admin Giriş', path: '/admin/login' },
      { name: 'Admin Dashboard', path: '/admin/dashboard' },
      { name: 'Admin Haber Yönetimi', path: '/admin/news' },
      { name: 'Admin Duyuru Yönetimi', path: '/admin/announcements' },
      { name: 'Admin Galeri Yönetimi', path: '/admin/gallery' },
      { name: 'Admin Sayfa Ayarları', path: '/admin/pages' },
      { name: 'Admin Sayfa Ayarları', path: '/admin/pages' },
    ],
    user: [
      { name: 'Profilim', path: '/profile' },
      { name: 'Katıldığım Topluluklar', path: '/communities/joined' },
      { name: 'Oluşturduğum Topluluklar', path: '/communities/my-clubs' },
      { name: 'Topluluk Listesi', path: '/communities' },
      { name: 'Favorilerim', path: '/favorites' },
      { name: 'Hesap Ayarları', path: '/profile/settings' },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-12 text-center">
          Site Haritası
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* General Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
              Genel
            </h2>
            <ul className="space-y-3">
              {links.general.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:underline group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-200 rounded-full mr-3 group-hover:bg-blue-600 transition-colors"></span>
                    {link.name}
                    <span className="ml-auto text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {link.path}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-2 h-8 bg-slate-600 rounded-full mr-3"></span>
                Yönetici Paneli
              </div>
              {isAuthenticated && isAdmin && (
                <span className="text-xs font-normal bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                  Giriş Yapıldı
                </span>
              )}
            </h2>
            <ul className="space-y-3">
              {links.admin.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:underline group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full mr-3 group-hover:bg-slate-600 transition-colors"></span>
                    {link.name}
                    <span className="ml-auto text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {link.path}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-purple-600 rounded-full mr-3"></span>
              Kullanıcı Paneli
            </h2>
            <ul className="space-y-3">
              {links.user.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:underline group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-200 rounded-full mr-3 group-hover:bg-purple-600 transition-colors"></span>
                    {link.name}
                    <span className="ml-auto text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {link.path}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SiteMap;
