import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get('/clubs');
        setClubs(res.data);
      } catch (error) {
        console.error("Error fetching clubs", error);
        toast.error("Topluluklar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/clubs/${deleteItem._id}`);
      setClubs(clubs.filter(c => c._id !== deleteItem._id));
      setDeleteItem(null);
      toast.success("Topluluk başarıyla kaldırıldı");
    } catch (error) {
      console.error("Delete error", error);
      toast.error(error.response?.data?.message || "Topluluk silinirken bir hata oluştu");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Topluluk Yönetimi</h1>
        <Link to="/admin/clubs/new">
          <Button><Plus size={18} className="mr-2" /> Topluluk Ekle</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div key={club._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{club.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{club.description}</p>
              
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
                <Users size={16} className="mr-2" />
                <span>{club.memberCount} Üye</span>
              </div>
              
              <div className="text-xs text-slate-400 dark:text-slate-500">
                Liderler: {club.leaders.map(l => l.name).join(', ')}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-2 bg-slate-50 dark:bg-slate-900/50">
              <Link to={`/admin/clubs/edit/${club._id}`}>
                <Button variant="outline" size="sm"><Edit size={16} /></Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => setDeleteItem(club)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteItem} 
        onClose={() => setDeleteItem(null)} 
        onConfirm={handleDelete}
        title="Topluluğu Sil"
        message="Bu topluluğu silmek istediğinizden emin misiniz? Tüm üyelikler ve etkinlikler de silinecektir."
      />
    </div>
  );
};

export default ClubList;
