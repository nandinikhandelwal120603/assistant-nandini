import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { taskStore } from '../tasks/taskStore';
import { calendarStore } from '../calendar/calendarStore';
import { journalStore } from '../journal/journalStore';
import { BarChart3, Target, Calendar, BookOpen, TrendingUp } from 'lucide-react';

const TodaySummary: React.FC = () => {
  // Use stable selectors to avoid infinite loops
  const allTasks = taskStore((state) => state.tasks);
  const allEvents = calendarStore((state) => state.events);
  const moodEntries = journalStore((state) => state.moods);
  const journalEntries = journalStore((state) => state.entries);
  
  // Compute derived values with useMemo
  const totalTasks = allTasks.length;
  const completedTasks = React.useMemo(() => 
    allTasks.filter(task => task.completed).length, 
    [allTasks]
  );
  
  const todayEvents = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    }).length;
  }, [allEvents]);
  
  const recentEntries = React.useMemo(() => {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day
    return journalEntries.filter(entry => entry.createdAt >= cutoffDate).length;
  }, [journalEntries]);
  
  const averageMood = React.useMemo(() => {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    const recentMoods = moodEntries.filter(mood => mood.timestamp >= cutoffDate);
    if (recentMoods.length === 0) return 3;
    const sum = recentMoods.reduce((acc, mood) => acc + mood.rating, 0);
    return Math.round((sum / recentMoods.length) * 10) / 10;
  }, [moodEntries]);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      icon: Target,
      label: 'Task Completion',
      value: `${completionRate}%`,
      detail: `${completedTasks}/${totalTasks} completed`,
      color: 'text-primary'
    },
    {
      icon: Calendar,
      label: 'Today\'s Events',
      value: todayEvents.toString(),
      detail: 'scheduled',
      color: 'text-therapy-calm'
    },
    {
      icon: BookOpen,
      label: 'Journal Entries',
      value: recentEntries.toString(),
      detail: 'today',
      color: 'text-therapy-warm'
    },
    {
      icon: TrendingUp,
      label: 'Mood Average',
      value: `${averageMood}/5`,
      detail: 'this week',
      color: 'text-therapy-sage'
    }
  ];

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4.5) return '🤩';
    if (mood >= 3.5) return '😊';
    if (mood >= 2.5) return '😐';
    if (mood >= 1.5) return '😕';
    return '😔';
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Today's Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-gradient-glass">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${
                  stat.label === 'Task Completion' ? getCompletionColor(completionRate) :
                  stat.label === 'Mood Average' ? 'text-therapy-warm' : 'text-foreground'
                }`}>
                  {stat.value}
                  {stat.label === 'Mood Average' && (
                    <span className="ml-2 text-lg">
                      {getMoodEmoji(averageMood)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div className="mt-6 space-y-4">
          {/* Task Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Tasks</span>
              <span>{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-gradient-glass rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  completionRate >= 80 ? 'bg-success' :
                  completionRate >= 60 ? 'bg-warning' : 'bg-destructive'
                }`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Mood Trend */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Mood</span>
              <span>{averageMood}/5</span>
            </div>
            <div className="w-full bg-gradient-glass rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-therapy transition-all duration-500"
                style={{ width: `${(averageMood / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-aurora text-center">
          <p className="text-sm text-foreground">
            {completionRate >= 80 && "Fantastic progress! You're crushing your goals! 🚀"}
            {completionRate >= 60 && completionRate < 80 && "Great work! Keep up the momentum! 💪"}
            {completionRate >= 40 && completionRate < 60 && "You're making progress! Every step counts! 🌟"}
            {completionRate < 40 && "Every journey starts with a single step. You've got this! ✨"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySummary;