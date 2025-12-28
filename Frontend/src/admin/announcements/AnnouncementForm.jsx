import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';

const AnnouncementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isImportant: 'false'
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchAnnouncement = async () => {
        try {
          const res = await api.get('/announcements');
          const item = res.data.find(a => a._id === id);
          if (item) {
            setFormData({ 
              ...item, 
              isImportant: item.isImportant ? 'true' : 'false',
              date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
          }
        } catch (error) {
          console.error("Error", error);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchAnnouncement();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, isImportant: formData.isImportant === 'true' };
      if (isEdit) {
        await api.put(`/announcements/${formData.slug}`, payload);
        toast.success("Duyuru başarıyla güncellendi");
      } else {
        await api.post('/announcements', payload);
        toast.success("Duyuru başarıyla eklendi");
      }
      navigate('/admin/announcements');
    } catch (error) {
      console.error("Save error", error);
      toast.error(error.response?.data?.message || "Duyuru kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/announcements')} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Ekle'}
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
          
          <Textarea 
            label="Açıklama" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            rows={4}
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
            <Select 
              label="Önem Derecesi" 
              value={formData.isImportant} 
              onChange={(e) => setFormData({...formData, isImportant: e.target.value})}
              options={[
                { value: 'false', label: 'Normal' },
                { value: 'true', label: 'Önemli' }
              ]}
            />
          </div>

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

export default AnnouncementForm;
