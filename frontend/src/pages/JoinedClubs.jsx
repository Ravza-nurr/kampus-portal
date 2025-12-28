import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { User } from 'lucide-react';

const JoinedClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get('/users/me/profile');
        setClubs(res.data.clubsJoined);
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
        <User size={24} className="mr-3 text-green-600" /> Katıldığım Topluluklar
      </h1>

      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => (
            <div key={club._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/clubs/${club._id}`}>
                <div className="h-48 relative">
                  <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{club.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{club.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-xl text-center text-slate-500 dark:text-slate-400">
          <User size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2">Henüz bir topluluğa üye değilsiniz.</p>
          <Link to="/clubs" className="text-blue-600 hover:underline">Toplulukları keşfedin</Link>
        </div>
      )}
    </div>
  );
};

export default JoinedClubs;
