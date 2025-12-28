import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight, ChevronLeft, Search, Newspaper, Bell } from 'lucide-react';

// ... (existing code)


import useEmblaCarousel from 'embla-carousel-react';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import AnnouncementCard from '../components/AnnouncementCard';
import StatsBar from '../components/StatsBar';
import Button from '../components/Button';

const Home = () => {
  const [data, setData] = useState({
    news: [],
    announcements: [],
    gallery: [],
    homeText: ''
  });
  const [loading, setLoading] = useState(true);
  
  // Embla Carousel Refs & APIs
  const [announcementRef, announcementApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [newsRef, newsApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [galleryRef, galleryApi] = useEmblaCarousel({ loop: true, align: 'start' });

  // Parallax Mouse State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const x = useTransform(mouseX, [-0.5, 0.5], ["-2%", "2%"]);
  const y = useTransform(mouseY, [-0.5, 0.5], ["-2%", "2%"]);

  // Slider Navigation Handlers
  const scrollPrev = useCallback((api) => {
    if (api) api.scrollPrev();
  }, []);

  const scrollNext = useCallback((api) => {
    if (api) api.scrollNext();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Track visitor
        api.post('/visitors/track').catch(err => console.error("Visitor track error", err));

        const [newsRes, annRes, galleryRes, pagesRes] = await Promise.all([
          api.get('/news'),
          api.get('/announcements'),
          api.get('/gallery'),
          api.get('/pages')
        ]);

        setData({
          news: newsRes.data.slice(0, 6),
          announcements: annRes.data.slice(0, 8),
          gallery: galleryRes.data.slice(0, 8),
          homeText: pagesRes.data.homeText
        });
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Parallax */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            style={{ x, y, scale: 1.1 }}
            className="w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Campus" 
              className="w-full h-full object-cover filter blur-sm"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6"
          >
            Kampüs Haber & Duyuru Portalı
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-slate-200"
          >
            {data.homeText || "Üniversitemizden en güncel haberler, etkinlikler ve duyurulara anında ulaşın."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/news">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-blue-900 hover:bg-primary hover:text-white border-none shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Newspaper size={20} className="mr-2" /> Haberleri Gör <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/announcements">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary hover:border-white shadow-lg hover:shadow-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Bell size={20} className="mr-2" /> Duyuruları Gör
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16">
        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <StatsBar />
        </motion.div>

        {/* Announcements Slider */}
        <section className="relative group/slider">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Son Duyurular</h2>
            <Link to="/announcements" className="text-primary dark:text-blue-400 font-medium flex items-center group">
              <span className="bg-gradient-to-r from-primary to-primary dark:from-blue-400 dark:to-blue-400 bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-300">
                Tümünü Gör
              </span>
              <ChevronRight size={20} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden" ref={announcementRef}>
              <div className="flex -ml-4">
                {data.announcements.map((announcement) => (
                  <div className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4" key={announcement._id}>
                    <AnnouncementCard announcement={announcement} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button 
              onClick={() => scrollPrev(announcementApi)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 disabled:opacity-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scrollNext(announcementApi)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 disabled:opacity-0"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

        {/* Latest News Slider */}
        <section className="relative group/slider">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Güncel Haberler</h2>
            <Link to="/news" className="text-primary dark:text-blue-400 font-medium flex items-center group">
              <span className="bg-gradient-to-r from-primary to-primary dark:from-blue-400 dark:to-blue-400 bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-300">
                Tümünü Gör
              </span>
              <ChevronRight size={20} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden" ref={newsRef}>
              <div className="flex -ml-4">
                {data.news.map((item) => (
                  <div className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4" key={item._id}>
                    <NewsCard news={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={() => scrollPrev(newsApi)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 disabled:opacity-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scrollNext(newsApi)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 disabled:opacity-0"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="relative group/slider">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Galeri</h2>
            <Link to="/gallery" className="text-primary dark:text-blue-400 font-medium flex items-center group">
              <span className="bg-gradient-to-r from-primary to-primary dark:from-blue-400 dark:to-blue-400 bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-300">
                Tümünü Gör
              </span>
              <ChevronRight size={20} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden" ref={galleryRef}>
              <div className="flex -ml-4">
                {data.gallery.map((item) => (
                  <div className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4" key={item._id}>
                    <Link to="/gallery" className="group relative overflow-hidden rounded-xl aspect-square block">
                      <img 
                        src={item.url} 
                        alt={item.caption} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2">
                        <Search className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100" />
                        <span className="text-white font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">İncele</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={() => scrollPrev(galleryApi)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 disabled:opacity-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scrollNext(galleryApi)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 disabled:opacity-0"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
