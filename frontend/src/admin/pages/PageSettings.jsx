import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';

const PageSettings = () => {
  const [formData, setFormData] = useState({
    homeText: '',
    aboutText: '',
    contactText: '',
    footerText: '',
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await api.get('/pages');
        setFormData(res.data);
      } catch (error) {
        console.error("Error", error);
        toast.error("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/pages', formData);
      toast.success('Ayarlar başarıyla kaydedildi.');
    } catch (error) {
      console.error("Save error", error);
      toast.error(error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Sayfa Ayarları</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Textarea 
            label="Ana Sayfa Metni" 
            value={formData.homeText} 
            onChange={(e) => setFormData({...formData, homeText: e.target.value})} 
            rows={3}
          />
          
          <Textarea 
            label="Hakkımızda Sayfası Metni" 
            value={formData.aboutText} 
            onChange={(e) => setFormData({...formData, aboutText: e.target.value})} 
            rows={6}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="E-posta Adresi" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            <Input 
              label="Telefon Numarası" 
              value={formData.phoneNumber} 
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
            />
          </div>

          <Textarea 
            label="İletişim Bilgileri (Adres)" 
            value={formData.contactText} 
            onChange={(e) => setFormData({...formData, contactText: e.target.value})} 
            rows={3}
          />

          <Textarea 
            label="Footer Metni" 
            value={formData.footerText} 
            onChange={(e) => setFormData({...formData, footerText: e.target.value})} 
            rows={2}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={saving}>
              <Save size={18} className="mr-2" /> Değişiklikleri Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageSettings;
