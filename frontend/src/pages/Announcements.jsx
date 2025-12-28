import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import api from '../utils/api';
import AnnouncementCard from '../components/AnnouncementCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, important, other

  // Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Data
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        setAnnouncements(res.data);
        setFilteredAnnouncements(res.data);
      } catch (error) {
        console.error("Announcements fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Filter Logic
  useEffect(() => {
    let results = announcements;

    // Filter by search term
    if (debouncedSearchTerm) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter by category/type
    if (filter === 'important') {
      results = results.filter(item => item.isImportant === true);
    } else if (filter === 'other') {
      results = results.filter(item => item.isImportant !== true);
    }

    setFilteredAnnouncements(results);
  }, [debouncedSearchTerm, filter, announcements]);

  // Handlers
  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const filterOptions = [
    { id: 'all', label: 'Tümü' },
    { id: 'important', label: 'Önemli' },
    { id: 'other', label: 'Diğer' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4"
        >
          Duyurular
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8"
        >
          Akademik takvim, etkinlikler ve önemli bilgilendirmeler.
        </motion.p>

        {/* Search and Filter Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center"
        >
          {/* Search Input */}
          <div className="w-full md:w-1/2 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              aria-label="Duyuru arama kutusu"
              placeholder="Duyuru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:scale-[1.01] outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:transition-opacity focus:placeholder:opacity-70"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            {filterOptions.map((option) => (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
                role="button"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === option.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Announcements List */}
      {console.log("Rendered filtered count:", filteredAnnouncements.length)}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto space-y-4"
      >
        <AnimatePresence mode="sync">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                layout
              >
                <AnnouncementCard announcement={item} />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                Aradığınız kriterlere uygun bir duyuru bulunamadı.
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Filtreleri değiştirerek yeniden deneyebilirsiniz.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Announcements;
