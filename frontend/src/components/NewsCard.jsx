import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const NewsCard = ({ news }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          <Calendar size={14} className="mr-1" />
          {formatDate(news.date)}
        </div>
        <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 h-14 max-h-14 overflow-hidden break-all">
          {news.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3 h-16 max-h-16 overflow-hidden break-all">
          {news.summary}
        </p>
        <Link 
          to={`/news/${news.slug}`} 
          className="inline-flex items-center text-primary dark:text-blue-400 font-medium hover:underline mt-auto"
        >
          Devamını Oku <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default NewsCard;
