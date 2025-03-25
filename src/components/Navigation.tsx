
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, BarChart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-card border-b backdrop-blur-md bg-white/60 px-4 py-3 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold">T</div>
            <span className="text-xl font-semibold gradient-text hidden sm:inline-block">Techno</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/chat" className={`p-2 rounded-lg transition-colors ${isActive('/chat') ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground/80'}`}>
                    <div className="flex items-center gap-2 px-2">
                      <MessageCircle size={20} />
                      <span>Chat</span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Chat with Techno</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/dashboard" className={`p-2 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground/80'}`}>
                    <div className="flex items-center gap-2 px-2">
                      <BarChart size={20} />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>View your progress</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={logout} className="text-foreground/80 hover:text-foreground hover:bg-secondary">
                    <LogOut size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Log out</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={16} />
              </div>
              <span className="text-sm font-medium hidden md:inline-block">{user?.name}</span>
            </div>
          </div>

          {/* Mobile navigation toggle */}
          <button 
            className="p-2 rounded-lg sm:hidden text-foreground/80 hover:bg-secondary" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {showMobileMenu && (
        <div className="sm:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs z-50 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col h-full py-6 px-4">
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold">T</div>
                <span className="text-xl font-semibold gradient-text">Techno</span>
              </div>

              <nav className="flex flex-col space-y-2">
                <Link to="/chat" className={`p-3 rounded-lg transition-colors ${isActive('/chat') ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground/80'}`} onClick={() => setShowMobileMenu(false)}>
                  <div className="flex items-center gap-3">
                    <MessageCircle size={20} />
                    <span>Chat</span>
                  </div>
                </Link>
                <Link to="/dashboard" className={`p-3 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground/80'}`} onClick={() => setShowMobileMenu(false)}>
                  <div className="flex items-center gap-3">
                    <BarChart size={20} />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </nav>

              <div className="mt-auto">
                <div className="flex items-center gap-3 p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-foreground/60">{user?.email}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 flex items-center gap-2 justify-center"
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
