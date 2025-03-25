
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { getMoodEmoji, getMoodString } from '../utils/selfCare';

interface MoodLog {
  date: string;
  mood: number;
  note?: string;
}

interface MoodTrackerProps {
  onComplete?: () => void;
  className?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onComplete, className }) => {
  const { user } = useAuth();
  const [moodValue, setMoodValue] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [streak, setStreak] = useState<number>(0);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Load mood logs and streak from localStorage
      const storedLogs = localStorage.getItem(`techno_mood_logs_${user.id}`);
      if (storedLogs) {
        const logs: MoodLog[] = JSON.parse(storedLogs);
        setMoodLogs(logs);
        
        // Check if user has logged mood today
        const today = new Date().toISOString().split('T')[0];
        const loggedToday = logs.some(log => log.date === today);
        setHasLoggedToday(loggedToday);
        
        // Calculate streak
        calculateStreak(logs);
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

  const handleLogMood = () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Create new mood log
    const newLog: MoodLog = {
      date: today,
      mood: moodValue,
      note: note.trim() || undefined
    };
    
    // Add to logs
    const updatedLogs = [...moodLogs];
    
    // If already logged today, replace the entry
    const todayIndex = updatedLogs.findIndex(log => log.date === today);
    if (todayIndex >= 0) {
      updatedLogs[todayIndex] = newLog;
    } else {
      updatedLogs.push(newLog);
    }
    
    // Save to localStorage
    localStorage.setItem(`techno_mood_logs_${user.id}`, JSON.stringify(updatedLogs));
    
    // Update state
    setMoodLogs(updatedLogs);
    setHasLoggedToday(true);
    calculateStreak(updatedLogs);
    
    toast.success('Your mood has been logged!');
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Card className={`w-full max-w-md glass-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          {hasLoggedToday ? "Today's Mood" : "How are you feeling today?"}
        </CardTitle>
        <CardDescription className="text-center">
          {streak > 0 ? (
            <span className="inline-flex items-center gap-2">
              <span className="text-sm font-medium">Streak: {streak} day{streak !== 1 ? 's' : ''}</span>
              <span className="text-amber-500">🔥</span>
            </span>
          ) : (
            "Start your daily mood tracking habit today"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-6xl">
            {getMoodEmoji(moodValue)}
          </div>
          <div className="text-lg font-medium">
            {getMoodString(moodValue)}
          </div>
        </div>
        
        <div className="space-y-2 px-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Not well</span>
            <span>Neutral</span>
            <span>Great</span>
          </div>
          <Slider
            value={[moodValue]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setMoodValue(value[0])}
            disabled={hasLoggedToday}
            className="py-2"
          />
        </div>
        
        {!hasLoggedToday && (
          <div className="space-y-2">
            <label htmlFor="mood-note" className="block text-sm font-medium">
              Add a note (optional)
            </label>
            <textarea
              id="mood-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-20 p-2 border rounded-md bg-background/50 resize-none"
              placeholder="What's on your mind today?"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {hasLoggedToday ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onComplete}
          >
            Continue
          </Button>
        ) : (
          <Button 
            className="w-full"
            onClick={handleLogMood}
          >
            Log My Mood
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MoodTracker;
