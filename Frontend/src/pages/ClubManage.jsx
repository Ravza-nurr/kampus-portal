import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { ArrowLeft, Save, Plus, Trash2, Check, X, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate } from '../utils/formatDate';

const ClubManage = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // info, events, requests, members
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: ''
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: ''
  });

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const clubRes = await api.get(`/clubs/${id}`);
        setClub(clubRes.data);
        setFormData({
          name: clubRes.data.name,
          description: clubRes.data.description,
          coverImage: clubRes.data.coverImage
        });

        // Check permission
        const isLeader = clubRes.data.leaders.some(l => l._id === user._id);
        const isAdmin = user.role === 'admin';
        
        if (!isLeader && !isAdmin) {
          toast.error("Bu sayfaya erişim yetkiniz yok");
          navigate('/clubs');
          return;
        }

        const requestsRes = await api.get(`/clubs/${id}/requests`);
        setRequests(requestsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, authLoading, navigate]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/clubs/${id}`, formData);
      toast.success("Topluluk bilgileri güncellendi");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Bu topluluğu düzenleme yetkiniz yok");
      } else {
        toast.error(error.response?.data?.message || "Güncelleme başarısız");
      }
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/clubs/${id}/events`, newEvent);
      setClub(res.data);
      setNewEvent({ title: '', description: '', date: '' });
      toast.success("Etkinlik eklendi");
    } catch (error) {
      toast.error("Etkinlik eklenemedi");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) return;
    try {
      const res = await api.delete(`/clubs/${id}/events/${eventId}`);
      setClub(res.data);
      toast.success("Etkinlik silindi");
    } catch (error) {
      toast.error("Silme işlemi başarısız");
    }
  };

  const handleApproveRequest = async (userId) => {
    try {
      await api.post(`/clubs/${id}/approve/${userId}`);
      setRequests(requests.filter(r => r._id !== userId));
      toast.success("Üyelik onaylandı");
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await api.post(`/clubs/${id}/reject/${userId}`);
      setRequests(requests.filter(r => r._id !== userId));
      toast.success("Üyelik reddedildi");
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Bu üyeyi topluluktan çıkarmak istediğinizden emin misiniz?")) return;
    try {
      await api.delete(`/clubs/${id}/members/${userId}`);
      // Refresh club data
      const clubRes = await api.get(`/clubs/${id}`);
      setClub(clubRes.data);
      toast.success("Üye çıkarıldı");
    } catch (error) {
      toast.error(error.response?.data?.message || "İşlem başarısız");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(`/clubs/${id}`)} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Yönetim Paneli: {club.name}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full text-left px-6 py-4 font-medium transition-colors ${
                activeTab === 'info' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Topluluk Bilgileri
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full text-left px-6 py-4 font-medium transition-colors ${
                activeTab === 'events' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Etkinlikler
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full text-left px-6 py-4 font-medium transition-colors ${
                activeTab === 'requests' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Üyelik İstekleri
              {requests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`w-full text-left px-6 py-4 font-medium transition-colors ${
                activeTab === 'members' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Üyeler
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
            
            {activeTab === 'info' && (
              <form onSubmit={handleUpdateInfo} className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Bilgileri Düzenle</h2>
                <Input 
                  label="Topluluk Adı" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
                <Textarea 
                  label="Açıklama" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  rows={5}
                  required 
                />
                <Input 
                  label="Kapak Görseli URL" 
                  value={formData.coverImage} 
                  onChange={(e) => setFormData({...formData, coverImage: e.target.value})} 
                  required 
                />
                {formData.coverImage && (
                  <img src={formData.coverImage} alt="Preview" className="h-40 w-full object-cover rounded-lg" />
                )}
                <div className="flex justify-end">
                  <Button type="submit"><Save size={18} className="mr-2" /> Değişiklikleri Kaydet</Button>
                </div>
              </form>
            )}

            {activeTab === 'events' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Yeni Etkinlik Ekle</h2>
                  <form onSubmit={handleAddEvent} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
                    <Input 
                      label="Etkinlik Başlığı" 
                      value={newEvent.title} 
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
                      required 
                    />
                    <Textarea 
                      label="Açıklama" 
                      value={newEvent.description} 
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
                      rows={3}
                      required 
                    />
                    <Input 
                      label="Tarih" 
                      type="date"
                      value={newEvent.date} 
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} 
                      required 
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm"><Plus size={16} className="mr-2" /> Ekle</Button>
                    </div>
                  </form>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mevcut Etkinlikler</h2>
                  {club.events.length > 0 ? (
                    <div className="space-y-4">
                      {club.events.map((event) => (
                        <div key={event._id} className="flex justify-between items-start bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{event.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{event.description}</p>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">Henüz etkinlik yok.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Bekleyen İstekler</h2>
                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((reqUser) => (
                      <div key={reqUser._id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold mr-3">
                            {reqUser.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{reqUser.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{reqUser.email}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveRequest(reqUser._id)}
                            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                            title="Onayla"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(reqUser._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                            title="Reddet"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">Bekleyen üyelik isteği yok.</p>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Users size={20} className="mr-2 text-purple-600" /> Topluluk Üyeleri
                </h2>
                <div className="space-y-3">
                  {/* Leaders */}
                  {club.leaders.map((leader) => (
                    <div key={leader._id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold mr-3">
                          {leader.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{leader.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{leader.email}</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                        🟦 Yönetici
                      </div>
                    </div>
                  ))}
                  
                  {/* Regular Members (exclude leaders) */}
                  {(() => {
                    const leaderIds = club.leaders.map(l => l._id);
                    const regularMembers = club.members.filter(m => !leaderIds.includes(m._id));
                    
                    return regularMembers.length > 0 ? (
                      regularMembers.map((member) => (
                        <div key={member._id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold mr-3">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{member.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{member.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">
                              ⚪ Üye
                            </div>
                            <button 
                              onClick={() => handleRemoveMember(member._id)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Üyeyi Çıkar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : null;
                  })()}
                  
                  {/* Empty state if only leaders exist */}
                  {(() => {
                    const leaderIds = club.leaders.map(l => l._id);
                    const regularMembers = club.members.filter(m => !leaderIds.includes(m._id));
                    return regularMembers.length === 0 ? (
                      <div className="mt-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl text-center text-slate-500 dark:text-slate-400 text-sm">
                        Henüz üye yok. Sadece yöneticiler bulunuyor.
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubManage;
