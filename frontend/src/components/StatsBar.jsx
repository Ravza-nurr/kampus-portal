import React, { useEffect, useState, useRef } from 'react';
import { Users, Eye } from 'lucide-react';
import { animate, useInView } from 'framer-motion';
import api from '../utils/api';

const Counter = ({ from, to }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    const node = nodeRef.current;
    if (inView) {
      const controls = animate(from, to, {
        duration: 1.5,
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView]);

  return <span ref={nodeRef} />;
};

const StatsBar = () => {
  const [stats, setStats] = useState({ onlineUsers: 0, totalVisitors: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [onlineRes, totalRes] = await Promise.all([
          api.get('/visitors/online'),
          api.get('/visitors/total')
        ]);
        
        setStats({
          onlineUsers: onlineRes.data.online,
          totalVisitors: totalRes.data.total
        });
      } catch (error) {
        console.error("Stats fetch error", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-around">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <Users className="text-slate-400 dark:text-slate-500" size={24} />
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Online</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            <Counter from={0} to={stats.onlineUsers} />
          </p>
        </div>
      </div>
      
      <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>

      <div className="flex items-center space-x-3">
        <Eye className="text-slate-400 dark:text-slate-500" size={24} />
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Ziyaretçi</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            <Counter from={0} to={stats.totalVisitors} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
