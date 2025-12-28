import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Megaphone, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const AnnouncementCard = ({ announcement }) => {
  const isImportant = String(announcement.isImportant) === 'true';

  return (
    <motion.div
      role="article"
      aria-label={isImportant ? "important announcement" : "announcement"}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900/50 group overflow-hidden`}
    >
      {/* Important Indicator Strip */}
      {isImportant && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
      )}

      {/* Important Badge */}
      {isImportant && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium group-hover:animate-pulse">
            <AlertCircle size={12} className="mr-1" />
            Önemli
          </span>
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`p-3 rounded-full flex-shrink-0 transition-colors ${
          isImportant 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-500' 
            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        }`}>
          {isImportant ? <AlertCircle size={24} /> : <Megaphone size={24} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 pr-16 leading-tight line-clamp-2 h-12 overflow-hidden break-all">
            {announcement.title}
          </h4>
          
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2 leading-relaxed h-10 overflow-hidden break-all">
            {announcement.description}
          </p>
          
          <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <Calendar size={14} className="mr-1.5" />
            {formatDate(announcement.date)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementCard;
