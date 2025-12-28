import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { Users, Calendar, ArrowLeft, Shield, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate } from '../utils/formatDate';

const ClubDetail = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await api.get(`/clubs/${id}`);
        setClub(res.data);
      } catch (error) {
        console.error("Error fetching club", error);
        toast.error("Topluluk bilgileri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  const handleJoinRequest = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/clubs/${id}/request`);
      toast.success("İsteğiniz topluluk yöneticisine iletildi.");
    } catch (error) {
      toast.error(error.response?.data?.message || "İstek gönderilirken bir hata oluştu");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Bu üyeyi topluluktan çıkarmak istediğinizden emin misiniz?")) return;
    try {
      await api.delete(`/clubs/${id}/members/${userId}`);
      // Refresh club data
      const res = await api.get(`/clubs/${id}`);
      setClub(res.data);
      toast.success("Üye çıkarıldı");
    } catch (error) {
      toast.error(error.response?.data?.message || "İşlem başarısız");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!club) return <div className="text-center py-10">Topluluk bulunamadı</div>;

  const isMember = isAuthenticated && club.members.some(m => m._id === user._id);
  const isLeader = isAuthenticated && club.leaders.some(l => l._id === user._id);
  const isAdmin = isAuthenticated && user.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate('/clubs')} className="mb-6">
        <ArrowLeft size={20} className="mr-2" /> Tüm Topluluklar
      </Button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-8">
        <div className="h-64 md:h-80 relative">
          <img 
            src={club.coverImage} 
            alt={club.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{club.name}</h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center">
                  <Users size={18} className="mr-2" />
                  <span>{club.memberCount} Üye</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>{club.events.length} Etkinlik</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Hakkında</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-8">
                {club.description}
              </p>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Etkinlikler</h2>
              {club.events.length > 0 ? (
                <div className="space-y-4">
                  {club.events.map((event) => (
                    <div key={event._id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{event.title}</h3>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">Henüz planlanmış bir etkinlik yok.</p>
              )}
            </div>

            <div className="w-full md:w-80 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Yöneticiler</h3>
                <div className="space-y-3">
                  {club.leaders.map((leader) => (
                    <div key={leader._id} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold mr-3">
                        {leader.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{leader.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{leader.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(isLeader || isAdmin) && (
                <Link to={`/clubs/manage/${club._id}`}>
                  <Button className="w-full mb-3">
                    <Shield size={18} className="mr-2" /> Topluluğu Yönet
                  </Button>
                </Link>
              )}

              {isAdmin && !isLeader && (
                <div className="w-full py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-center text-sm border border-blue-100 dark:border-blue-900/30">
                  <Shield size={16} className="inline mr-2" />
                  Admin olarak sadece denetleyici rolündesiniz
                </div>
              )}

              {!isMember && !isLeader && isAuthenticated && !isAdmin && (
                <Button onClick={handleJoinRequest} className="w-full">
                  Katılım İsteği Gönder
                </Button>
              )}

              {isMember && (
                <div className="w-full py-2 px-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-center font-medium border border-green-100 dark:border-green-900/30">
                  Bu topluluğun üyesisiniz
                </div>
              )}

              {/* Member List - Visible to all club members */}
              {isMember && (() => {
                const leaderIds = club.leaders.map(l => l._id);
                const regularMembers = club.members.filter(m => !leaderIds.includes(m._id));
                
                return regularMembers.length > 0 ? (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 mt-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Users size={18} className="mr-2" />
                      Üyeler ({regularMembers.length})
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {regularMembers.map((member) => {
                        const canDelete = isLeader || isAdmin;
                        
                        return (
                          <div key={member._id} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold mr-3 text-sm">
                                {member.name.charAt(0)}
                              </div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {member.name}
                              </div>
                            </div>
                            {canDelete && (
                              <button 
                                onClick={() => handleRemoveMember(member._id)}
                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Üyeyi Çıkar"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
