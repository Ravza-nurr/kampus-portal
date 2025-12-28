import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import { toast } from 'react-hot-toast';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/users/me/profile');
        setFavorites(res.data.favorites);
      } catch (error) {
        console.error("Error fetching favorites", error);
        toast.error("Favoriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (newsId) => {
    try {
      await api.delete(`/users/me/favorites/${newsId}`);
      setFavorites(favorites.filter(f => f._id !== newsId));
      toast.success("Favorilerden çıkarıldı");
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
        <Heart size={24} className="mr-3 text-red-500" /> Favorilerim
      </h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(news => (
            <div key={news._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col">
              <Link to={`/news/${news.slug}`} className="block mb-2 flex-grow">
                <h3 className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-3">{news.summary}</p>
              </Link>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-500">{formatDate(news.date)}</span>
                <button 
                  onClick={() => handleRemoveFavorite(news._id)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Favorilerden Çıkar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-xl text-center text-slate-500 dark:text-slate-400">
          <Heart size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2">Henüz favori haberiniz yok.</p>
          <Link to="/news" className="text-blue-600 hover:underline">Haberleri keşfedin</Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
