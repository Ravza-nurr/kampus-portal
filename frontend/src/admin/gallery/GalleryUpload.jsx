import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';

const GalleryUpload = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/gallery', { url, caption });
      toast.success('Fotoğraf başarıyla yüklendi.');
      navigate('/admin/gallery');
    } catch (error) {
      console.error("Upload error", error);
      toast.error('Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/gallery')} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fotoğraf Yükle</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <ImageIcon size={24} />
            </div>
            <div className="space-y-4">
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="Görsel URL (https://...)" 
              />
              <div className="text-sm text-slate-500 dark:text-slate-400">- VEYA -</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setUrl(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="block w-full text-sm text-slate-500 dark:text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-blue-400
                  mx-auto max-w-xs
                "
              />
            </div>
          </div>

          <Input 
            label="Açıklama (Opsiyonel)" 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            placeholder="Fotoğraf açıklaması..." 
          />

          {url && (
            <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">Önizleme</p>
              <img src={url} alt="Preview" className="w-full h-48 object-cover" />
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={loading}>
              <Upload size={18} className="mr-2" /> Yükle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryUpload;
