import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    footerText: '',
    contactText: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/pages');
        setFooterData(res.data);
      } catch (error) {
        console.error("Footer fetch error", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-heading font-bold text-white mb-4 block">
              Kampüs Portal
            </Link>
            <p className="text-sm text-slate-400">
              {footerData.footerText || "Üniversitemizden en güncel haberler, duyurular ve etkinlikler tek bir noktada."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/news" className="hover:text-primary-light transition-colors">Haberler</Link></li>
              <li><Link to="/announcements" className="hover:text-primary-light transition-colors">Duyurular</Link></li>
              <li><Link to="/gallery" className="hover:text-primary-light transition-colors">Galeri</Link></li>
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary-light transition-colors">Hakkımızda</Link></li>
              <li><Link to="/contact" className="hover:text-primary-light transition-colors">İletişim</Link></li>
              <li><Link to="/site-map" className="hover:text-primary-light transition-colors">Site Haritası</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary-light transition-colors">Yönetici Girişi</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <p className="text-sm text-slate-400 mb-2">{footerData.contactText || "Kampüs Mah. Üniversite Cad. No:1"}</p>
            <p className="text-sm text-slate-400 mb-2">{footerData.email || "info@campus.edu.tr"}</p>
            <p className="text-sm text-slate-400">{footerData.phoneNumber || "+90 212 123 45 67"}</p>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Kampüs Haber Portalı. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
