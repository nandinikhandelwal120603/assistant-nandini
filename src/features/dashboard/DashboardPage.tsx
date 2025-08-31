import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { taskStore } from '../tasks/taskStore';
import { calendarStore } from '../calendar/calendarStore';
import { journalStore } from '../journal/journalStore';
import { weatherService, WeatherData } from '../../services/weather';
import { MOCK_AFFIRMATIONS } from '../../services/firebase';
import { CheckCircle, Calendar, CloudSun, Heart, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FlipClock from './FlipClock';
import WeatherCard from './WeatherCard';
import TodaySummary from './TodaySummary';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentMood, setCurrentMood] = useState<number>(3);
  
  // Use stable selectors to avoid infinite loops
  const allTasks = taskStore((state) => state.tasks);
  const allEvents = calendarStore((state) => state.events);
  const journalEntries = journalStore((state) => state.entries);
  const moodEntries = journalStore((state) => state.moods);
  
  // Compute derived values with useMemo to prevent infinite loops
  const tasks = React.useMemo(() => 
    allTasks.filter(task => !task.completed), 
    [allTasks]
  );
  
  const todayEvents = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  }, [allEvents]);
  
  const averageMood = React.useMemo(() => {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentMoods = moodEntries.filter(mood => mood.timestamp >= cutoffDate);
    if (recentMoods.length === 0) return 3;
    const sum = recentMoods.reduce((acc, mood) => acc + mood.rating, 0);
    return Math.round((sum / recentMoods.length) * 10) / 10;
  }, [moodEntries]);

  useEffect(() => {
    // Load weather data
    weatherService.getCurrentWeather().then(setWeather);
  }, []);

  const handleMoodSelect = (mood: number) => {
    setCurrentMood(mood);
    journalStore.getState().addMoodEntry({
      rating: mood,
      notes: `Daily mood check-in`,
      timestamp: new Date()
    });

    if ((window as any).showAssistantMessage) {
      const messages = {
        1: "I hear you. Remember, tough days don't last. 💙",
        2: "Thank you for sharing. Every feeling is valid. 🌱", 
        3: "Thanks for checking in. You're doing great! ✨",
        4: "Wonderful! Your positive energy is inspiring! 🌟",
        5: "Amazing! What a beautiful day you're having! 🎉"
      };
      (window as any).showAssistantMessage(
        messages[mood as keyof typeof messages], 
        'confirmation'
      );
    }
  };

  const readAffirmations = () => {
    const randomAffirmation = MOCK_AFFIRMATIONS[Math.floor(Math.random() * MOCK_AFFIRMATIONS.length)];
    
    if ((window as any).showAssistantMessage) {
      (window as any).showAssistantMessage(randomAffirmation.text, 'celebration');
    }

    // Text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(randomAffirmation.text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const topTasks = tasks.slice(0, 3);
  const nextEvent = todayEvents[0];

  return (
    <div className="min-h-screen bg-gradient-aurora p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Good Morning!</h1>
        <p className="text-lg text-muted-foreground">Ready to make today amazing?</p>
      </div>

      {/* Top Row - Clock and Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlipClock />
        <WeatherCard weather={weather} />
      </div>

      {/* Today's Summary */}
      <TodaySummary />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Top 3 Tasks */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-primary" />
              Today's Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTasks.length > 0 ? (
                topTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-glass">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-destructive' :
                      task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <span className="text-sm flex-1">{task.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No tasks for today! 🎉</p>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/tasks')}
                className="w-full mt-3"
              >
                View All Tasks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Snippet */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Next Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextEvent ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-glass">
                  <h4 className="font-medium">{nextEvent.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {nextEvent.time} • Today
                  </p>
                  {nextEvent.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {nextEvent.description}
                    </p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/calendar')}
                  className="w-full"
                >
                  View Calendar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">No events scheduled today</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/calendar')}
                  className="w-full"
                >
                  Schedule Something
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Mood Picker */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-therapy-warm" />
              How are you feeling?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <Button
                    key={mood}
                    variant={currentMood === mood ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleMoodSelect(mood)}
                    className={`w-10 h-10 p-0 rounded-full ${
                      currentMood === mood ? 'bg-gradient-therapy' : ''
                    }`}
                  >
                    <span className="text-lg">
                      {mood === 1 && '😔'}
                      {mood === 2 && '😕'}
                      {mood === 3 && '😐'}
                      {mood === 4 && '😊'}
                      {mood === 5 && '😄'}
                    </span>
                  </Button>
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  7-day average: {averageMood}/5
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/journal')}
                  className="text-sm"
                >
                  Journal Your Thoughts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Affirmations Section */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-warning" />
              <h3 className="text-xl font-semibold">Daily Affirmations</h3>
              <Star className="w-6 h-6 text-warning" />
            </div>
            <p className="text-muted-foreground">
              Start your day with positive energy and intentions
            </p>
            <Button 
              onClick={readAffirmations}
              className="bg-gradient-therapy hover:scale-105 transition-transform"
              size="lg"
            >
              Read My Affirmations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Task', path: '/tasks', icon: CheckCircle, color: 'bg-primary' },
          { label: 'Schedule Event', path: '/calendar', icon: Calendar, color: 'bg-therapy-calm' },
          { label: 'Journal', path: '/journal', icon: Heart, color: 'bg-therapy-warm' },
          { label: 'Hand Control', path: '/hands', icon: CloudSun, color: 'bg-therapy-sage' }
        ].map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            onClick={() => navigate(action.path)}
            className={`h-20 flex flex-col gap-2 glass rounded-2xl hover:scale-105 transition-transform`}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;