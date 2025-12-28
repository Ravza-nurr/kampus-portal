import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';

const GalleryList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      setImages(res.data);
    } catch (error) {
      console.error("Error", error);
      toast.error("Galeri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/gallery/${deleteId}`);
      setImages(images.filter(i => i._id !== deleteId));
      setDeleteId(null);
      toast.success('Fotoğraf başarıyla silindi.');
    } catch (error) {
      console.error("Delete error", error);
      toast.error('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Galeri Yönetimi</h1>
        <Link to="/admin/gallery/upload">
          <Button><Plus size={18} className="mr-2" /> Fotoğraf Yükle</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((item) => (
          <div key={item._id} className="group relative rounded-lg overflow-hidden aspect-square shadow-sm">
            <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="danger" size="sm" onClick={() => setDeleteId(item._id)}>
                <Trash2 size={16} /> Sil
              </Button>
            </div>
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs truncate">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Fotoğrafı Sil"
        message="Bu fotoğrafı silmek istediğinizden emin misiniz?"
      />
    </div>
  );
};

export default GalleryList;
