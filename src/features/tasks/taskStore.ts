import { create } from 'zustand';
import { Task } from '../../services/firebase';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getTasks: () => Task[];
  getTasksByPriority: (priority: 'low' | 'medium' | 'high') => Task[];
  getCompletedTasks: () => Task[];
  getIncompleteTasks: () => Task[];
}

export const taskStore = create<TaskState>((set, get) => ({
  tasks: [
    {
      id: '1',
      title: 'Review morning affirmations',
      description: 'Start the day with positive mindset',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '2', 
      title: 'Complete project proposal',
      description: 'Finish the quarterly project proposal draft',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '3',
      title: 'Call mom',
      description: 'Weekly check-in call',
      completed: true,
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    }
  ],

  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'demo-user'
        }
      ]
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      )
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    })),

  // Remove getter functions to prevent caching issues
  getTasks: () => get().tasks,
  getTasksByPriority: (priority) => get().tasks.filter((task) => task.priority === priority),
  getCompletedTasks: () => get().tasks.filter((task) => task.completed),
  getIncompleteTasks: () => get().tasks.filter((task) => !task.completed)
}));