import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDate } from '../../utils/formatDate';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        setNews(res.data);
      } catch (error) {
        console.error("Error fetching news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/news/${deleteItem.slug}`);
      setNews(news.filter(n => n._id !== deleteItem._id));
      setDeleteItem(null);
      toast.success("Haber başarıyla silindi");
    } catch (error) {
      console.error("Delete error", error);
      toast.error(error.response?.data?.message || "Haber silinirken bir hata oluştu");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Haber Yönetimi</h1>
        <Link to="/admin/news/new">
          <Button><Plus size={18} className="mr-2" /> Haber Ekle</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{formatDate(item.date)}</p>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-2 bg-slate-50 dark:bg-slate-900/50">
              <Link to={`/admin/news/edit/${item._id}`}>
                <Button variant="outline" size="sm"><Edit size={16} /></Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => setDeleteItem(item)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteItem} 
        onClose={() => setDeleteItem(null)} 
        onConfirm={handleDelete}
        title="Haberi Sil"
        message="Bu haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
};

export default NewsList;
