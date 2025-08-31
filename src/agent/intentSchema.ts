// Intent schema for OpenRouter API responses
export interface Intent {
  type: 'task' | 'calendar' | 'journal' | 'navigation' | 'mood' | 'weather' | 'affirmation' | 'unknown';
  confidence: number;
  data: any;
}

export interface TaskIntent {
  type: 'task';
  data: {
    action: 'create' | 'complete' | 'delete' | 'update';
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
  };
}

export interface CalendarIntent {
  type: 'calendar';
  data: {
    action: 'create' | 'view' | 'update' | 'delete';
    title?: string;
    date?: string;
    time?: string;
    duration?: number;
    description?: string;
  };
}

export interface JournalIntent {
  type: 'journal';
  data: {
    action: 'create' | 'reflect' | 'mood';
    content?: string;
    mood?: number;
    tags?: string[];
    prompt?: string;
  };
}

export interface NavigationIntent {
  type: 'navigation';
  data: {
    destination: 'dashboard' | 'tasks' | 'calendar' | 'journal' | 'hands' | 'settings';
  };
}

export interface MoodIntent {
  type: 'mood';
  data: {
    rating: number; // 1-5
    notes?: string;
  };
}

export const INTENT_EXAMPLES = {
  tasks: [
    "Add a task to call mom tomorrow",
    "Mark my workout task as complete",
    "What are my high priority tasks?",
    "Create a reminder to buy groceries"
  ],
  calendar: [
    "Schedule a meeting for 3pm today",
    "What's on my calendar tomorrow?", 
    "Block 2 hours for focused work",
    "Cancel my lunch meeting"
  ],
  journal: [
    "I want to journal about my day",
    "Help me reflect on my goals",
    "I'm feeling anxious about work",
    "Start a gratitude practice"
  ],
  navigation: [
    "Go to my tasks",
    "Open the calendar",
    "Take me to the journal",
    "Show me the dashboard"
  ],
  mood: [
    "I'm feeling great today",
    "Rate my mood as 4",
    "I'm having a tough day",
    "My energy is low today"
  ]
};