import { create } from 'zustand';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  completedDates: string[]; // Array of 'YYYY-MM-DD' date strings
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (id: string, date: string) => void;
}

export const habitsStore = create<HabitsState>((set, get) => ({
  habits: [
    {
      id: '1',
      name: 'Drink Water',
      description: 'Stay hydrated with 8 glasses of water daily',
      icon: '💧',
      category: 'health',
      completedDates: ['2025-01-31'], // Today for demo
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '2',
      name: 'Morning Exercise',
      description: '30 minutes of physical activity',
      icon: '💪',
      category: 'health',
      completedDates: ['2025-01-30', '2025-01-31'], // Yesterday and today for demo
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '3',
      name: 'Read for 20 minutes',
      description: 'Daily reading habit for personal growth',
      icon: '📚',
      category: 'learning',
      completedDates: ['2025-01-29', '2025-01-30'], // 2 days ago and yesterday
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    }
  ],

  addHabit: (habitData) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          ...habitData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'demo-user'
        }
      ]
    })),

  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id
          ? { ...habit, ...updates, updatedAt: new Date() }
          : habit
      )
    })),

  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id)
    })),

  toggleHabitDay: (id, date) =>
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id === id) {
          const completedDates = habit.completedDates || [];
          const isCompleted = completedDates.includes(date);
          
          return {
            ...habit,
            completedDates: isCompleted
              ? completedDates.filter(d => d !== date)
              : [...completedDates, date],
            updatedAt: new Date()
          };
        }
        return habit;
      })
    }))
}));