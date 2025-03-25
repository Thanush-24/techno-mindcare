
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background to-secondary overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-techno-mint/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-techno-lavender/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] right-[30%] w-64 h-64 bg-techno-blue/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {isAuthenticated && <Navigation />}
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
