import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDate } from '../../utils/formatDate';

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Error fetching announcements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/announcements/${deleteItem.slug}`);
      setAnnouncements(announcements.filter(a => a._id !== deleteItem._id));
      setDeleteItem(null);
      toast.success("Duyuru başarıyla silindi");
    } catch (error) {
      console.error("Delete error", error);
      toast.error(error.response?.data?.message || "Duyuru silinirken bir hata oluştu");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Duyuru Yönetimi</h1>
        <Link to="/admin/announcements/new">
          <Button><Plus size={18} className="mr-2" /> Duyuru Ekle</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((item) => (
          <div key={item._id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{item.description}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(item.date)}</p>
            </div>
            <div className="flex space-x-2 ml-4">
              <Link to={`/admin/announcements/edit/${item._id}`}>
                <Button variant="ghost" size="sm" className="p-2"><Edit size={16} /></Button>
              </Link>
              <Button variant="ghost" size="sm" className="p-2 text-red-500 hover:text-red-600" onClick={() => setDeleteItem(item)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteItem} 
        onClose={() => setDeleteItem(null)} 
        onConfirm={handleDelete}
        title="Duyuruyu Sil"
        message="Bu duyuruyu silmek istediğinizden emin misiniz?"
      />
    </div>
  );
};

export default AnnouncementsList;
