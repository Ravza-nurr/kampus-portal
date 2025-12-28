import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const GalleryGrid = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

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
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {images.map((image) => (
          <motion.div
            key={image._id}
            variants={itemVariants}
            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md aspect-square"
            onClick={() => setSelectedImage(image)}
          >
            <img 
              src={image.url} 
              alt={image.caption} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white" size={32} />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-medium truncate">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage.url}
              alt={selectedImage.caption}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.caption && (
              <div className="absolute bottom-8 left-0 right-0 text-center text-white">
                <p className="text-lg font-medium">{selectedImage.caption}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryGrid;
