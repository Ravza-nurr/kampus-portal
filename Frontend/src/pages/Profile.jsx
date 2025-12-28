import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { User, Shield, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me/profile');
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile", error);
        toast.error("Profil bilgileri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleRemoveFavorite = async (newsId) => {
    try {
      await api.delete(`/users/me/favorites/${newsId}`);
      setProfile({
        ...profile,
        favorites: profile.favorites.filter(f => f._id !== newsId)
      });
      toast.success("Favorilerden çıkarıldı");
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="text-center py-10">Profil bulunamadı</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-3xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
              <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
              <div className="mt-2 text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded inline-block text-slate-600 dark:text-slate-300 uppercase">
                {profile.role}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30">
            <LogOut size={18} className="mr-2" /> Çıkış Yap
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Managed Clubs */}
            {profile.clubsLeading.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Shield size={20} className="mr-2 text-blue-600" /> Yönettiğim Topluluklar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.clubsLeading.map(club => (
                    <div key={club._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                      <div className="h-32 relative">
                        <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{club.name}</h3>
                        <div className="flex gap-2 mt-4">
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
              </section>
            )}

            {/* Joined Clubs */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <User size={20} className="mr-2 text-green-600" /> Üye Olduğum Topluluklar
              </h2>
              {(() => {
                // Filter out clubs where user is a leader
                const leaderClubIds = profile.clubsLeading.map(club => club._id);
                const memberOnlyClubs = profile.clubsJoined.filter(club => !leaderClubIds.includes(club._id));
                
                return memberOnlyClubs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {memberOnlyClubs.map(club => (
                      <div key={club._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <Link to={`/clubs/${club._id}`}>
                          <div className="h-32 relative">
                            <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">{club.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{club.description}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl text-center text-slate-500 dark:text-slate-400">
                    Henüz bir topluluğa üye değilsiniz. <Link to="/clubs" className="text-blue-600 hover:underline">Toplulukları keşfedin!</Link>
                  </div>
                );
              })()}
            </section>

          </div>

          {/* Sidebar (Favorites) */}
          <div className="lg:col-span-1">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Heart size={20} className="mr-2 text-red-500" /> Favori Haberler
              </h2>
              <div className="space-y-4">
                {profile.favorites.length > 0 ? (
                  profile.favorites.map(news => (
                    <div key={news._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                      <Link to={`/news/${news.slug}`} className="block mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                      </Link>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-slate-500">{formatDate(news.date)}</span>
                        <button 
                          onClick={() => handleRemoveFavorite(news._id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Favorilerden Çıkar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl text-center text-slate-500 dark:text-slate-400 text-sm">
                    Favori haberiniz yok.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
