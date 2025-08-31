import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { habitsStore } from './habitsStore';
import { Plus, Target, TrendingUp, Calendar, Check, X } from 'lucide-react';
import HabitEditor from './HabitEditor';
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const HabitsPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  
  const habits = habitsStore((state) => state.habits);
  const toggleHabitDay = habitsStore((state) => state.toggleHabitDay);

  // Get current week days
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setIsEditing(true);
  };

  const handleEditHabit = (habit: any) => {
    setEditingHabit(habit);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setEditingHabit(null);
  };

  const getHabitStreak = (habit: any) => {
    const completedDates = habit.completedDates || [];
    let streak = 0;
    let currentDate = new Date();
    
    while (streak < 365) { // Max 365 day check
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (completedDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeekProgress = (habit: any) => {
    const completedDates = habit.completedDates || [];
    const completedThisWeek = weekDays.filter(day => 
      completedDates.includes(format(day, 'yyyy-MM-dd'))
    ).length;
    
    return (completedThisWeek / 7) * 100;
  };

  const isDayCompleted = (habit: any, date: Date) => {
    const completedDates = habit.completedDates || [];
    return completedDates.includes(format(date, 'yyyy-MM-dd'));
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => 
    isDayCompleted(habit, today)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-aurora p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Habits</h1>
            <p className="text-lg text-muted-foreground">Build positive routines</p>
          </div>
          <Button onClick={handleCreateHabit} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>

        {/* Today's Progress */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {completedToday}/{totalHabits}
                </div>
                <div className="text-sm text-muted-foreground">Today's Progress</div>
                <Progress 
                  value={totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0} 
                  className="mt-2"
                />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-1">
                  {habits.reduce((sum, habit) => sum + getHabitStreak(habit), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Streak Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-therapy-calm mb-1">
                  {Math.round(habits.reduce((sum, habit) => sum + getWeekProgress(habit), 0) / (habits.length || 1))}%
                </div>
                <div className="text-sm text-muted-foreground">Week Average</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{habit.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {getHabitStreak(habit)} days
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditHabit(habit)}
                  >
                    Edit
                  </Button>
                </div>
              </div>

              {/* Week View */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">This Week</span>
                  <Progress value={getWeekProgress(habit)} className="w-24" />
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const completed = isDayCompleted(habit, day);
                    const isPast = day < today && !isToday(day);
                    const isTodayDay = isToday(day);
                    
                    return (
                      <div key={day.toISOString()} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">
                          {format(day, 'EEE')}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHabitDay(habit.id, format(day, 'yyyy-MM-dd'))}
                          disabled={!isTodayDay && !isPast}
                          className={`
                            w-8 h-8 rounded-full p-0 transition-all duration-200
                            ${completed 
                              ? 'bg-success text-white hover:bg-success/90' 
                              : isTodayDay 
                                ? 'border-2 border-primary hover:bg-primary/20'
                                : isPast 
                                  ? 'text-muted-foreground'
                                  : 'text-muted-foreground/50'
                            }
                          `}
                        >
                          {completed ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="text-xs">{format(day, 'd')}</span>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {habits.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <Target className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4">Start building positive routines</p>
                <Button onClick={handleCreateHabit} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Habit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habit Editor Modal */}
      {isEditing && (
        <HabitEditor
          habit={editingHabit}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default HabitsPage;