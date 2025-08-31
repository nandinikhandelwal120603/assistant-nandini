// TODO: Replace with your Firebase config before deploying on Netlify
// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  // TODO: Add your Firebase credentials here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// TODO: Uncomment when Firebase credentials are added
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
// export const storage = getStorage(app);

// Sample Firestore data models
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration?: number; // in minutes
  createdAt: Date;
  userId: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood?: number; // 1-5 scale
  tags?: string[];
  createdAt: Date;
  userId: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'confidence' | 'peace' | 'motivation' | 'self-love' | 'success';
  isActive: boolean;
  createdAt: Date;
}

export interface MoodEntry {
  id: string;
  rating: number; // 1-5
  notes?: string;
  timestamp: Date;
  userId: string;
}

// Mock data for development
export const MOCK_AFFIRMATIONS: Affirmation[] = [
  {
    id: '1',
    text: 'I am capable of achieving anything I set my mind to.',
    category: 'confidence',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '2', 
    text: 'I choose peace and calmness in every situation.',
    category: 'peace',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '3',
    text: 'Every challenge is an opportunity for growth.',
    category: 'motivation',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '4',
    text: 'I love and accept myself exactly as I am.',
    category: 'self-love',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '5',
    text: 'Success flows to me naturally and effortlessly.',
    category: 'success',
    isActive: true,
    createdAt: new Date()
  }
];

// TODO: Implement Firebase service functions when credentials are added
/*
export const firestoreService = {
  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    // Implementation with Firestore
  },
  
  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Implementation with Firestore
  },

  // Calendar Events
  async getEvents(userId: string): Promise<CalendarEvent[]> {
    // Implementation with Firestore
  },

  async addEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<string> {
    // Implementation with Firestore
  },

  // Journal Entries
  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    // Implementation with Firestore
  },

  async addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<string> {
    // Implementation with Firestore
  },

  // Affirmations
  async getAffirmations(): Promise<Affirmation[]> {
    // Implementation with Firestore
  }
};
*/