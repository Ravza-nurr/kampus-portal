import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        setNews(res.data);
        setFilteredNews(res.data);
      } catch (error) {
        console.error("News fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const results = news.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(results);
  }, [searchTerm, news]);

  if (loading) return <LoadingSpinner />;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4"
        >
          Haberler
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8"
        >
          Kampüsümüzden en son gelişmeler, akademik başarılar ve etkinlik haberleri.
        </motion.p>
        
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="max-w-md mx-auto relative"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Haber ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-slate-400"
          />
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredNews.map((item) => (
          <motion.div key={item._id} variants={itemVariants}>
            <NewsCard news={item} />
          </motion.div>
        ))}
      </motion.div>
      
      {filteredNews.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center text-slate-500 dark:text-slate-400 py-12"
        >
          Aradığınız kriterlere uygun haber bulunamadı.
        </motion.div>
      )}
    </div>
  );
};

export default News;
