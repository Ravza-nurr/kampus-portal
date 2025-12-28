import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Calendar } from 'lucide-react';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get('/clubs');
        setClubs(res.data);
      } catch (error) {
        console.error("Error fetching clubs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleInspect = (clubId) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/clubs/${clubId}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Öğrenci Toplulukları</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          İlgi alanlarınıza uygun toplulukları keşfedin, etkinliklere katılın ve yeni arkadaşlar edinin.
        </p>
        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg inline-block text-sm">
            Topluluk detaylarını görmek ve katılmak için giriş yapmanız gerekmektedir.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clubs.map((club) => (
          <div key={club._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div className="h-48 relative">
              <img 
                src={club.coverImage} 
                alt={club.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{club.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
                {club.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>{club.memberCount} Üye</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{club.eventCount} Etkinlik</span>
                </div>
              </div>

              <button 
                onClick={() => handleInspect(club._id)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                İncele
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;
