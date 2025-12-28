import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import LoadingSpinner from '../../components/LoadingSpinner';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    imageUrl: '',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchNews = async () => {
        try {
          const res = await api.get('/news');
          const item = res.data.find(n => n._id === id);
          if (item) {
             setFormData({
                ...item,
                date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
             });
          }
        } catch (error) {
          console.error("Error fetching news", error);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchNews();
    }
  }, [id, isEdit]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/news/${formData.slug}`, formData);
        toast.success("Haber başarıyla güncellendi");
      } else {
        await api.post('/news', formData);
        toast.success("Haber başarıyla eklendi");
      }
      navigate('/admin/news');
    } catch (error) {
       console.error("Error saving news", error);
       toast.error(error.response?.data?.message || "Haber kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/news')} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Başlık" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Tarih" 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
              required 
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Görsel
              </label>
              <div className="flex flex-col gap-3">
                <Input 
                  placeholder="Görsel URL (https://...)" 
                  value={formData.imageUrl} 
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                />
                <div className="text-center text-sm text-slate-500 dark:text-slate-400">- VEYA -</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({...formData, imageUrl: reader.result});
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
                  "
                />
              </div>
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Preview" className="h-20 w-auto object-cover rounded-md border border-slate-200 dark:border-slate-700" />
                </div>
              )}
            </div>
          </div>

          <Textarea 
            label="Kısa Açıklama (Özet)" 
            value={formData.summary} 
            onChange={(e) => setFormData({...formData, summary: e.target.value})} 
            rows={3}
            required 
          />

          <Textarea 
            label="İçerik" 
            value={formData.content} 
            onChange={(e) => setFormData({...formData, content: e.target.value})} 
            rows={10}
            required 
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={loading}>
              <Save size={18} className="mr-2" /> Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;
