
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, Calendar, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMoodEmoji, getMoodString, getMoodColor, getAllSelfCareActivities } from '../utils/selfCare';
import { Link } from 'react-router-dom';

interface MoodLog {
  date: string;
  mood: number;
  note?: string;
}

interface ChatHistory {
  date: string;
  messages: any[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  useEffect(() => {
    if (user) {
      // Load mood logs
      const storedLogs = localStorage.getItem(`techno_mood_logs_${user.id}`);
      if (storedLogs) {
        const logs: MoodLog[] = JSON.parse(storedLogs);
        setMoodLogs(logs);
        calculateStreak(logs);
      }
      
      // Load chat history
      const storedHistory = localStorage.getItem(`techno_chat_history_${user.id}`);
      if (storedHistory) {
        setChatHistory(JSON.parse(storedHistory));
      }
    }
  }, [user]);
  
  const calculateStreak = (logs: MoodLog[]) => {
    if (!logs.length) {
      setStreak(0);
      return;
    }
    
    // Sort logs by date
    const sortedLogs = [...logs].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    let currentStreak = 1;
    let currentDate = new Date(sortedLogs[0].date);
    
    // Check if the most recent log is from today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mostRecentLogDate = new Date(sortedLogs[0].date);
    mostRecentLogDate.setHours(0, 0, 0, 0);
    
    // If the most recent log is not from today or yesterday, streak is broken
    if (!(mostRecentLogDate.getTime() === today.getTime() || mostRecentLogDate.getTime() === yesterday.getTime())) {
      setStreak(0);
      return;
    }
    
    // Calculate continuous streak
    for (let i = 1; i < sortedLogs.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      const logDate = new Date(sortedLogs[i].date);
      
      // If dates are consecutive, increase streak
      if (logDate.toISOString().split('T')[0] === prevDate.toISOString().split('T')[0]) {
        currentStreak++;
        currentDate = logDate;
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  };
  
  const previousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const nextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Don't allow going to future months
    if (nextMonth <= new Date()) {
      setCurrentMonth(nextMonth);
    }
  };
  
  const renderCalendar = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get first day of month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-12 md:h-14"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const log = moodLogs.find(log => log.date === date);
      
      calendarDays.push(
        <div 
          key={date} 
          className={`h-12 md:h-14 rounded-md flex flex-col items-center justify-center relative group
            ${log ? getMoodColor(log.mood) : 'bg-transparent border border-dashed border-border/50'}
            transition-all duration-200 hover:scale-[1.03]
          `}
        >
          <span className={`text-sm font-medium ${log ? 'text-techno-dark' : ''}`}>{day}</span>
          {log && (
            <>
              <span className="text-xs">{getMoodEmoji(log.mood)}</span>
              {log.note && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 rounded-md bg-white shadow-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                  {log.note}
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    
    return calendarDays;
  };
  
  const getAverageMood = () => {
    if (moodLogs.length === 0) return 0;
    
    const sum = moodLogs.reduce((total, log) => total + log.mood, 0);
    return (sum / moodLogs.length).toFixed(1);
  };
  
  const getMostFrequentMood = () => {
    if (moodLogs.length === 0) return null;
    
    const moodCounts: Record<number, number> = {};
    
    moodLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    });
    
    let mostFrequentMood = 3;
    let highestCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > highestCount) {
        mostFrequentMood = Number(mood);
        highestCount = count;
      }
    });
    
    return mostFrequentMood;
  };
  
  // Get self-care suggestions
  const suggestions = getAllSelfCareActivities().slice(0, 3);
  
  // Calculate stats
  const averageMood = getAverageMood();
  const mostFrequentMood = getMostFrequentMood();
  
  return (
    <div className="w-full max-w-5xl space-y-6 py-4">
      <h1 className="text-3xl font-bold">Your Wellness Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{streak}</span>
              <span className="text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {streak > 0 
                ? `You've tracked your mood for ${streak} consecutive day${streak !== 1 ? 's' : ''}.` 
                : "Start tracking your mood daily to build a streak!"}
            </p>
          </CardContent>
        </Card>
        
        {/* Average mood card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart size={18} className="text-techno-blush" />
              Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{averageMood}</span>
              <span className="text-muted-foreground">/ 5</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {moodLogs.length > 0 
                ? `Based on ${moodLogs.length} mood log${moodLogs.length !== 1 ? 's' : ''}.`
                : "Log your first mood to start tracking!"}
            </p>
          </CardContent>
        </Card>
        
        {/* Most frequent mood card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChartIcon size={18} className="text-primary" />
              Most Frequent Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostFrequentMood !== null ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{getMoodEmoji(mostFrequentMood)}</span>
                  <span className="text-xl font-medium">{getMoodString(mostFrequentMood)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This is your most commonly logged mood.
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground">No mood data yet</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="calendar">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="calendar">Mood Calendar</TabsTrigger>
          <TabsTrigger value="suggestions">Self-Care Ideas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mood Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={previousMonth}>
                    <ChevronLeft size={18} />
                  </Button>
                  <span className="text-sm font-medium">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={nextMonth}
                    disabled={
                      currentMonth.getMonth() === new Date().getMonth() && 
                      currentMonth.getFullYear() === new Date().getFullYear()
                    }
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Track your mood patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Calendar header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium">{day}</div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 justify-center text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-techno-mint"></div>
                  <span>Happy</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-techno-light-blue"></div>
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-techno-lavender"></div>
                  <span>Anxious</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-techno-blue"></div>
                  <span>Sad</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggestions" className="mt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Self-Care Suggestions
              </CardTitle>
              <CardDescription>
                Try these activities to support your mental well-being
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="glass-card p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-lg">{suggestion.activity}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                  </div>
                ))}
                
                <div className="text-center mt-6">
                  <Link to="/chat">
                    <Button className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      <span>Chat with Techno for More Ideas</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
