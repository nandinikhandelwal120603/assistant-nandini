import { create } from 'zustand';
import { CalendarEvent } from '../../services/firebase';

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'userId'>) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  getEvents: () => CalendarEvent[];
  getEventsForDate: (date: Date) => CalendarEvent[];
  getUpcomingEvents: (days?: number) => CalendarEvent[];
  getTodayEvents: () => CalendarEvent[];
}

export const calendarStore = create<CalendarState>((set, get) => ({
  events: [
    {
      id: '1',
      title: 'Team standup',
      description: 'Daily team sync meeting',
      date: new Date(),
      time: '09:00',
      duration: 30,
      createdAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '2',
      title: 'Lunch with Sarah',
      description: 'Catch up over lunch',
      date: new Date(),
      time: '12:30',
      duration: 60,
      createdAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '3',
      title: 'Doctor appointment',
      description: 'Annual checkup',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      time: '14:00',
      duration: 45,
      createdAt: new Date(),
      userId: 'demo-user'
    }
  ],

  addEvent: (eventData) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...eventData,
          id: Date.now().toString(),
          createdAt: new Date(),
          userId: 'demo-user'
        }
      ]
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id)
    })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      )
    })),

  getEvents: () => get().events,

  getEventsForDate: (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return get().events.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === targetDate.getTime();
    });
  },

  getUpcomingEvents: (days = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return get().events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= futureDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getTodayEvents: () => {
    const today = new Date();
    return get().getEventsForDate(today);
  }
}));