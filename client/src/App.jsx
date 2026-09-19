import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavbarDock } from './components/NavbarDock';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F1E9]">
        <div className="w-8 h-8 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F1E9]">
        <div className="w-8 h-8 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin" />
      </div>
    );
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const RootLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F1E9] text-[#1A1A1A]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Auth initialMode="login" />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Auth initialMode="signup" />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <NavbarDock />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
