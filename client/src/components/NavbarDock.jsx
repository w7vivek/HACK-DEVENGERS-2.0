import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, HelpCircle, ArrowRightLeft, Info, LogIn, LogOut } from 'lucide-react';
import { Dock, DockIcon } from './motion-primitives/Dock';
import { useAuth } from '../context/AuthContext';

export const NavbarDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const pathname = location.pathname;

  const isAuthPage = pathname === '/auth' || pathname === '/login' || pathname === '/signup';
  const isLight = isAuthPage; // Auth page is the warm cream editorial theme

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <Dock
        className={`shadow-2xl transition-all duration-300 backdrop-blur-2xl ${
          isLight
            ? 'bg-white/85 border border-black/10 text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)]'
            : 'bg-black/75 border border-white/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
        }`}
      >
        <DockIcon
          active={pathname === '/'}
          onClick={() => navigate('/')}
          label="Home"
          className={
            pathname !== '/'
              ? isLight
                ? 'text-neutral-800 hover:text-black hover:bg-black/5'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              : ''
          }
        >
          <Home className="w-5 h-5" />
        </DockIcon>

        <DockIcon
          active={pathname === '/how-it-works'}
          onClick={() => navigate('/how-it-works')}
          label="How it Works"
          className={
            pathname !== '/how-it-works'
              ? isLight
                ? 'text-neutral-800 hover:text-black hover:bg-black/5'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              : ''
          }
        >
          <HelpCircle className="w-5 h-5" />
        </DockIcon>

        <DockIcon
          active={pathname === '/dashboard'}
          onClick={() => navigate(user ? '/dashboard' : '/auth')}
          label={user ? 'Transactions' : 'Get Started'}
          className={
            pathname !== '/dashboard'
              ? isLight
                ? 'text-neutral-800 hover:text-black hover:bg-black/5'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              : ''
          }
        >
          <ArrowRightLeft className="w-5 h-5" />
        </DockIcon>

        <DockIcon
          active={pathname === '/about'}
          onClick={() => navigate('/about')}
          label="About"
          className={
            pathname !== '/about'
              ? isLight
                ? 'text-neutral-800 hover:text-black hover:bg-black/5'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              : ''
          }
        >
          <Info className="w-5 h-5" />
        </DockIcon>

        {user ? (
          <DockIcon
            onClick={async () => {
              await logout();
              navigate('/');
            }}
            label="Sign Out"
            className="text-red-500 hover:!text-red-600"
          >
            <LogOut className="w-5 h-5" />
          </DockIcon>
        ) : (
          <DockIcon
            active={isAuthPage}
            onClick={() => navigate('/auth')}
            label="Sign In"
            className={
              !isAuthPage
                ? isLight
                  ? 'text-neutral-800 hover:text-black hover:bg-black/5'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                : ''
            }
          >
            <LogIn className="w-5 h-5" />
          </DockIcon>
        )}
      </Dock>
    </div>
  );
};
