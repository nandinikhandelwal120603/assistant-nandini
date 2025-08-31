import { create } from 'zustand';
import { JournalEntry, MoodEntry } from '../../services/firebase';

interface JournalState {
  entries: JournalEntry[];
  moods: MoodEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'userId'>) => void;
  addMoodEntry: (mood: Omit<MoodEntry, 'id' | 'userId'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  getEntries: () => JournalEntry[];
  getEntriesByDate: (date: Date) => JournalEntry[];
  getRecentEntries: (days?: number) => JournalEntry[];
  getMoodHistory: (days?: number) => MoodEntry[];
  getAverageMood: (days?: number) => number;
}

export const journalStore = create<JournalState>((set, get) => ({
  entries: [
    {
      id: '1',
      content: 'Today was a good day. I felt productive and accomplished several tasks on my list. The morning meditation really helped set a positive tone.',
      mood: 4,
      tags: ['productivity', 'meditation', 'gratitude'],
      createdAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '2',
      content: 'Feeling a bit overwhelmed with work lately. Need to remember to take breaks and practice self-care.',
      mood: 2,
      tags: ['work', 'stress', 'self-care'],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      userId: 'demo-user'
    }
  ],

  moods: [
    {
      id: '1',
      rating: 4,
      notes: 'Feeling energetic and positive',
      timestamp: new Date(),
      userId: 'demo-user'
    },
    {
      id: '2',
      rating: 3,
      notes: 'Neutral day, nothing special',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      userId: 'demo-user'
    },
    {
      id: '3',
      rating: 2,
      notes: 'Stressed about work deadlines',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      userId: 'demo-user'
    }
  ],

  addEntry: (entryData) =>
    set((state) => ({
      entries: [
        {
          ...entryData,
          id: Date.now().toString(),
          createdAt: new Date(),
          userId: 'demo-user'
        },
        ...state.entries
      ]
    })),

  addMoodEntry: (moodData) =>
    set((state) => ({
      moods: [
        {
          ...moodData,
          id: Date.now().toString(),
          userId: 'demo-user'
        },
        ...state.moods
      ]
    })),

  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id)
    })),

  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    })),

  getEntries: () => get().entries,

  getEntriesByDate: (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return get().entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    });
  },

  getRecentEntries: (days = 7) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return get().entries.filter((entry) => entry.createdAt >= cutoffDate);
  },

  getMoodHistory: (days = 30) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return get().moods
      .filter((mood) => mood.timestamp >= cutoffDate)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  getAverageMood: (days = 7) => {
    const recentMoods = get().getMoodHistory(days);
    if (recentMoods.length === 0) return 3;
    
    const sum = recentMoods.reduce((acc, mood) => acc + mood.rating, 0);
    return Math.round((sum / recentMoods.length) * 10) / 10;
  }
}));