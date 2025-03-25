
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, MessageCircle, Brain, BarChart, Sparkles } from 'lucide-react';

const Index = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      navigate('/chat');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center px-4">
      {/* Hero content */}
      <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="gradient-text">Techno</span>
            <span className="block mt-1">Your AI Mental Health Companion</span>
          </h1>
          <p className="text-xl mt-4 text-muted-foreground">
            An intelligent chatbot designed to provide emotional support, track your mood, and help you develop healthier mental habits.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-techno-mint/20 flex items-center justify-center text-techno-dark">
              <MessageCircle size={18} />
            </div>
            <span className="text-sm">Empathetic Conversations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-techno-lavender/20 flex items-center justify-center text-techno-dark">
              <Brain size={18} />
            </div>
            <span className="text-sm">Emotion Recognition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-techno-blue/20 flex items-center justify-center text-techno-dark">
              <BarChart size={18} />
            </div>
            <span className="text-sm">Mood Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-techno-blush/20 flex items-center justify-center text-techno-dark">
              <Sparkles size={18} />
            </div>
            <span className="text-sm">Self-Care Suggestions</span>
          </div>
        </div>
      </div>

      {/* Auth card */}
      <div className="order-1 lg:order-2">
        <Card className="glass-card max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Sign up to start your mental wellness journey'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="bg-white/50"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-white/50"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
              <div className="text-center text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Index;
