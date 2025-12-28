import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layout/PublicLayout';
import AdminLayout from '../layout/AdminLayout';

// Public Pages
import Home from '../pages/Home';
import News from '../pages/News';
import NewsDetail from '../pages/NewsDetail';
import Announcements from '../pages/Announcements';
import Gallery from '../pages/Gallery';
import About from '../pages/About';
import Contact from '../pages/Contact';
import SiteMap from '../pages/SiteMap';

// Admin Pages
import AdminLogin from '../admin/AdminLogin';
import Dashboard from '../admin/Dashboard';
import NewsList from '../admin/news/NewsList';
import NewsForm from '../admin/news/NewsForm';
import AnnouncementsList from '../admin/announcements/AnnouncementsList';
import AnnouncementForm from '../admin/announcements/AnnouncementForm';
import GalleryList from '../admin/gallery/GalleryList';
import GalleryUpload from '../admin/gallery/GalleryUpload';
import PageSettings from '../admin/pages/PageSettings';
import ClubList from '../admin/clubs/ClubList';
import ClubForm from '../admin/clubs/ClubForm';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Clubs from '../pages/Clubs';
import ClubDetail from '../pages/ClubDetail';
import ClubManage from '../pages/ClubManage';
import Favorites from '../pages/Favorites';
import JoinedClubs from '../pages/JoinedClubs';
import MyClubs from '../pages/MyClubs';
import Settings from '../pages/Settings';

import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/site-map" element={<SiteMap />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected User Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          
          {/* Club Routes */}
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/communities" element={<Clubs />} /> {/* Alias for /clubs */}
          <Route path="/clubs/:id" element={<ClubDetail />} />
          
          <Route path="/communities/joined" element={
            <ProtectedRoute>
              <JoinedClubs />
            </ProtectedRoute>
          } />
          <Route path="/communities/my-clubs" element={
            <ProtectedRoute>
              <MyClubs />
            </ProtectedRoute>
          } />
          
          <Route path="/clubs/manage/:id" element={
            <ProtectedRoute>
              <ClubManage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Login - Outside of AdminLayout to avoid sidebar */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="news" element={<NewsList />} />
          <Route path="news/new" element={<NewsForm />} />
          <Route path="news/edit/:id" element={<NewsForm />} />
          
          <Route path="announcements" element={<AnnouncementsList />} />
          <Route path="announcements/new" element={<AnnouncementForm />} />
          <Route path="announcements/edit/:id" element={<AnnouncementForm />} />
          
          <Route path="gallery" element={<GalleryList />} />
          <Route path="gallery/upload" element={<GalleryUpload />} />
          
          <Route path="clubs" element={<ClubList />} />
          <Route path="clubs/new" element={<ClubForm />} />
          <Route path="clubs/edit/:id" element={<ClubForm />} />

          <Route path="pages" element={<PageSettings />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
