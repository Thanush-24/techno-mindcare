
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={isAuthenticated ? <Navigate to="/chat" replace /> : <Index />} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <Toaster />
          <Sonner position="top-right" />
        </ChatProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
