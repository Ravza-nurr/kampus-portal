import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { Shield } from 'lucide-react';

const MyClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get('/users/me/profile');
        setClubs(res.data.clubsLeading);
      } catch (error) {
        console.error("Error fetching clubs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
        <Shield size={24} className="mr-3 text-blue-600" /> Yönettiğim Topluluklar
      </h1>

      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => (
            <div key={club._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="h-48 relative">
                <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{club.name}</h3>
                <div className="flex gap-3 mt-4">
                  <Link to={`/clubs/manage/${club._id}`} className="flex-1">
                    <Button size="sm" className="w-full">Yönet</Button>
                  </Link>
                  <Link to={`/clubs/${club._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Görüntüle</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-xl text-center text-slate-500 dark:text-slate-400">
          <Shield size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2">Yönettiğiniz bir topluluk bulunmuyor.</p>
          <p className="text-sm">Yeni bir topluluk oluşturmak için yönetici ile iletişime geçin.</p>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
