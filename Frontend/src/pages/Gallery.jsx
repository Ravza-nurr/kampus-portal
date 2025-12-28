import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import GalleryGrid from '../components/GalleryGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        setImages(res.data);
      } catch (error) {
        console.error("Gallery fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4"
        >
          Fotoğraf Galerisi
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Kampüsümüzden kareler ve etkinlik fotoğrafları.
        </motion.p>
      </div>

      <GalleryGrid images={images} />
    </div>
  );
};

export default Gallery;
