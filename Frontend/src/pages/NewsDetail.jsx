import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Heart } from 'lucide-react';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await api.get(`/news/${slug}`);
        setNews(res.data);
        
        if (isAuthenticated) {
          try {
            const favRes = await api.get('/users/me/favorites');
            const favorites = favRes.data;
            setIsFavorite(favorites.some(f => f._id === res.data._id));
          } catch (err) {
            console.error("Error checking favorites", err);
          }
        }
      } catch (error) {
        setError("Haber bulunamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [slug, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/users/me/favorites/${news._id}`);
        setIsFavorite(false);
        toast.success("Favorilerden çıkarıldı");
      } else {
        await api.post(`/users/me/favorites/${news._id}`);
        setIsFavorite(true);
        toast.success("Favorilere eklendi");
      }
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/news" className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Tüm Haberlere Dön
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
      >
        <div className="h-[400px] relative">
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center space-x-2 mb-3 opacity-90">
                  <Calendar size={18} />
                  <span>{formatDate(news.date)}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold">{news.title}</h1>
              </div>
              
              <button 
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
                title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <p className="text-xl text-slate-600 dark:text-slate-300 font-medium mb-8 leading-relaxed">
            {news.summary}
          </p>
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            {news.content}
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default NewsDetail;
