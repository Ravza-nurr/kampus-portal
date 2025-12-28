import React, { useEffect, useState } from 'react';
import { Users, Eye, Newspaper, Megaphone, Image, Settings, Activity as ActivityIcon } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/stats/dashboard'),
          api.get('/activities/recent')
        ]);
        setStats(statsRes.data);
        setActivities(activitiesRes.data);
      } catch (error) {
        console.error("Dashboard data error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getActivityIcon = (targetType, action) => {
    const className = "flex-shrink-0";
    if (targetType === 'news') return <Newspaper size={18} className={`${className} text-purple-600 dark:text-purple-400`} />;
    if (targetType === 'announcement') return <Megaphone size={18} className={`${className} text-orange-600 dark:text-orange-400`} />;
    if (targetType === 'gallery') return <Image size={18} className={`${className} text-blue-600 dark:text-blue-400`} />;
    if (targetType === 'page') return <Settings size={18} className={`${className} text-slate-600 dark:text-slate-400`} />;
    return <ActivityIcon size={18} className={`${className} text-slate-600 dark:text-slate-400`} />;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Sistemin genel durumunu buradan izleyebilirsiniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Online Kullanıcı" value={stats.onlineUsers} icon={Users} color="green" />
        <StatCard title="Toplam Ziyaretçi" value={stats.totalVisitors} icon={Eye} color="blue" />
        <StatCard title="Haber Sayısı" value={stats.newsCount} icon={Newspaper} color="purple" />
        <StatCard title="Duyuru Sayısı" value={stats.announcementCount} icon={Megaphone} color="orange" />
        <StatCard title="Galeri Fotoğrafı" value={stats.galleryCount} icon={Image} color="blue" />
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Son Aktiviteler</h3>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map(activity => (
              <div key={activity._id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/70 transition-colors">
                <div className="mt-0.5">
                  {getActivityIcon(activity.targetType, activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white font-medium">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activity.user?.name || 'Admin'} • {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: tr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">Henüz aktivite kaydı bulunmuyor.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
