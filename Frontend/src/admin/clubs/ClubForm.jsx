import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const ClubForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: '',
    leaderEmails: []
  });
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchClub = async () => {
        try {
          const res = await api.get(`/clubs/${id}`);
          setFormData({
            name: res.data.name,
            description: res.data.description,
            coverImage: res.data.coverImage,
            leaderEmails: res.data.leaders.map(l => l.email)
          });
        } catch (error) {
          console.error("Error", error);
          toast.error("Topluluk bilgileri yüklenemedi");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchClub();
    }
  }, [id, isEdit]);

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (currentEmail && !formData.leaderEmails.includes(currentEmail)) {
      if (formData.leaderEmails.length >= 3) {
        toast.error("En fazla 3 lider ekleyebilirsiniz");
        return;
      }
      setFormData({
        ...formData,
        leaderEmails: [...formData.leaderEmails, currentEmail]
      });
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (email) => {
    setFormData({
      ...formData,
      leaderEmails: formData.leaderEmails.filter(e => e !== email)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/clubs/${id}`, formData);
        toast.success("Topluluk güncellendi");
      } else {
        await api.post('/clubs', formData);
        toast.success("Topluluk oluşturuldu");
      }
      navigate('/admin/clubs');
    } catch (error) {
      console.error("Save error", error);
      toast.error(error.response?.data?.message || "Kaydetme başarısız");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/clubs')} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? 'Topluluğu Düzenle' : 'Yeni Topluluk Ekle'}
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Topluluk Adı" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          
          <Textarea 
            label="Açıklama" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            rows={4}
            required 
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Kapak Görseli
            </label>
            <div className="flex flex-col gap-3">
              <Input 
                placeholder="Görsel URL (https://...)" 
                value={formData.coverImage} 
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})} 
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
                      setFormData({...formData, coverImage: reader.result});
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
            {formData.coverImage && (
              <div className="mt-2">
                <img src={formData.coverImage} alt="Preview" className="h-40 w-full object-cover rounded-md border border-slate-200 dark:border-slate-700" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Lider E-postaları (Max 3)
            </label>
            <div className="flex gap-2">
              <Input 
                placeholder="ornek@email.com" 
                value={currentEmail} 
                onChange={(e) => setCurrentEmail(e.target.value)} 
                className="flex-grow"
              />
              <Button type="button" onClick={handleAddEmail} variant="outline">
                <Plus size={18} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.leaderEmails.map(email => (
                <div key={email} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center">
                  <span>{email}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveEmail(email)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">Not: Eklediğiniz e-postalar sistemde kayıtlı kullanıcılar olmalıdır.</p>
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

export default ClubForm;
