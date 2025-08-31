import { Intent, TaskIntent, CalendarIntent, JournalIntent, NavigationIntent, MoodIntent } from './intentSchema';
import { taskStore } from '../features/tasks/taskStore';
import { calendarStore } from '../features/calendar/calendarStore';
import { journalStore } from '../features/journal/journalStore';
import { habitsStore } from '../features/habits/habitsStore';
import { toast } from '@/hooks/use-toast';

export class ActionOrchestrator {
  async executeIntent(intent: Intent): Promise<string> {
    try {
      switch (intent.type) {
        case 'task':
          return await this.handleTaskIntent(intent as TaskIntent);
        case 'calendar':
          return await this.handleCalendarIntent(intent as CalendarIntent);
        case 'journal':
          return await this.handleJournalIntent(intent as JournalIntent);
        case 'navigation':
          return await this.handleNavigationIntent(intent as NavigationIntent);
        case 'mood':
          return await this.handleMoodIntent(intent as MoodIntent);
        case 'habit':
          return await this.handleHabitIntent(intent as any);
        case 'weather':
          return "Let me check the weather for you!";
        case 'affirmation':
          return "Here's a positive affirmation: You are capable of amazing things!";
        default:
          return "I'm not sure how to help with that. Can you try rephrasing?";
      }
    } catch (error) {
      console.error('Error executing intent:', error);
      return "Sorry, I encountered an error while processing that request.";
    }
  }

  private async handleTaskIntent(intent: TaskIntent): Promise<string> {
    const { action, title, description, priority, dueDate } = intent.data;
    
    switch (action) {
      case 'create':
        taskStore.getState().addTask({
          title,
          description: description || '',
          priority: priority || 'medium',
          dueDate: dueDate ? new Date(dueDate) : undefined,
          completed: false
        });
        toast({
          title: "Task Added",
          description: `"${title}" has been added to your tasks.`
        });
        return `I've added "${title}" to your task list!`;
        
      case 'complete':
        // Find and complete task by title
        const tasks = taskStore.getState().getTasks();
        const taskToComplete = tasks.find(t => 
          t.title.toLowerCase().includes(title.toLowerCase()) && !t.completed
        );
        if (taskToComplete) {
          taskStore.getState().toggleTask(taskToComplete.id);
          toast({
            title: "Task Completed",
            description: `"${taskToComplete.title}" marked as complete!`
          });
          return `Great job! I've marked "${taskToComplete.title}" as complete.`;
        }
        return `I couldn't find an uncompleted task matching "${title}".`;
        
      default:
        return `I can help you create or complete tasks. What would you like to do?`;
    }
  }

  private async handleCalendarIntent(intent: CalendarIntent): Promise<string> {
    const { action, title, date, time, description } = intent.data;
    
    switch (action) {
      case 'create':
        const eventDate = date ? new Date(date) : new Date();
        calendarStore.getState().addEvent({
          title: title || 'New Event',
          date: eventDate,
          time: time || '12:00',
          description: description || ''
        });
        toast({
          title: "Event Scheduled",
          description: `"${title}" has been added to your calendar.`
        });
        return `I've scheduled "${title}" on your calendar!`;
        
      case 'view':
        return "Let me show you your upcoming events.";
        
      default:
        return "I can help you schedule events or view your calendar.";
    }
  }

  private async handleJournalIntent(intent: JournalIntent): Promise<string> {
    const { action, content, mood } = intent.data;
    
    switch (action) {
      case 'create':
        journalStore.getState().addEntry({
          content: content || '',
          mood: mood || 3
        });
        toast({
          title: "Journal Entry Saved",
          description: "Your thoughts have been recorded."
        });
        return "I've saved your journal entry. Take a moment to breathe and reflect.";
        
      case 'reflect':
        return "That's a beautiful practice. What's on your mind today?";
        
      default:
        return "I'm here to listen. What would you like to journal about?";
    }
  }

  private async handleNavigationIntent(intent: NavigationIntent): Promise<string> {
    const { destination } = intent.data;
    
    // Navigate using window.location
    const routes = {
      dashboard: '/',
      tasks: '/tasks',
      calendar: '/calendar',
      journal: '/journal',
      hands: '/hands',
      settings: '/settings'
    };
    
    const route = routes[destination];
    if (route) {
      window.location.hash = `#${route}`;
      window.location.pathname = route;
      return `Taking you to ${destination}!`;
    }
    
    return `I'm not sure how to navigate to ${destination}.`;
  }

  private async handleMoodIntent(intent: MoodIntent): Promise<string> {
    const { rating, notes } = intent.data;
    
    // Save mood to journal store
    journalStore.getState().addMoodEntry({
      rating,
      notes: notes || '',
      timestamp: new Date()
    });
    
    const moodMessages = {
      1: "I hear that you're having a tough time. Remember, difficult moments pass. You're stronger than you know.",
      2: "It sounds like today is challenging. Would you like to try a breathing exercise or write about what's on your mind?",
      3: "Thank you for checking in. Sometimes okay is perfectly fine. How can I support you today?",
      4: "I'm glad you're feeling good! What's contributing to your positive mood today?",
      5: "That's wonderful! Your positive energy is inspiring. What made today so special?"
    };
    
    toast({
      title: "Mood Recorded",
      description: `Mood rating: ${rating}/5`
    });
    
    return moodMessages[rating as keyof typeof moodMessages] || "Thank you for sharing how you're feeling.";
  }

  private async handleHabitIntent(intent: any): Promise<string> {
    const { action, habitName, date } = intent;
    
    if (action === 'mark' || action === 'complete') {
      const today = new Date().toISOString().split('T')[0];
      const habits = habitsStore.getState().habits;
      const habit = habits.find(h => h.name.toLowerCase().includes(habitName?.toLowerCase() || ''));
      
      if (habit) {
        habitsStore.getState().toggleHabitDay(habit.id, date || today);
        return `Great! Marked "${habit.name}" as completed for today. Keep up the great work!`;
      }
      return `I couldn't find a habit matching "${habitName}". You can create it in the Habits section.`;
    }
    
    return `I can help you mark habits as complete. Try saying "mark [habit name] as done".`;
  }
}

export const orchestrator = new ActionOrchestrator();