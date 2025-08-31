// Navigation helper for voice commands and programmatic navigation

export type AppRoute = 'dashboard' | 'tasks' | 'calendar' | 'journal' | 'hands' | 'settings';

export interface NavigationItem {
  path: string;
  name: string;
  keywords: string[];
  description: string;
}

export const NAVIGATION_MAP: Record<AppRoute, NavigationItem> = {
  dashboard: {
    path: '/',
    name: 'Dashboard',
    keywords: ['dashboard', 'home', 'main', 'overview', 'start'],
    description: 'Your daily overview with tasks, weather, and quick actions'
  },
  tasks: {
    path: '/tasks',
    name: 'Tasks',
    keywords: ['tasks', 'todo', 'todos', 'task list', 'productivity'],
    description: 'Manage your tasks and to-do items'
  },
  calendar: {
    path: '/calendar',
    name: 'Calendar',
    keywords: ['calendar', 'schedule', 'events', 'appointments', 'meetings'],
    description: 'View and manage your calendar events'
  },
  journal: {
    path: '/journal',
    name: 'Journal',
    keywords: ['journal', 'diary', 'write', 'reflect', 'thoughts', 'therapy'],
    description: 'Journal your thoughts and practice mindfulness'
  },
  hands: {
    path: '/hands',
    name: 'Hand Control',
    keywords: ['hands', 'gestures', 'camera', 'control', 'motion'],
    description: 'Control the app using hand gestures'
  },
  settings: {
    path: '/settings',
    name: 'Settings',
    keywords: ['settings', 'preferences', 'config', 'options'],
    description: 'Customize your app preferences'
  }
};

class NavigationService {
  navigate(route: AppRoute) {
    const item = NAVIGATION_MAP[route];
    if (item) {
      window.location.href = item.path;
    }
  }

  findRouteByKeyword(keyword: string): AppRoute | null {
    const lowerKeyword = keyword.toLowerCase();
    
    for (const [route, item] of Object.entries(NAVIGATION_MAP)) {
      if (item.keywords.some(k => k.includes(lowerKeyword) || lowerKeyword.includes(k))) {
        return route as AppRoute;
      }
    }
    
    return null;
  }

  getCurrentRoute(): AppRoute {
    const path = window.location.pathname;
    
    for (const [route, item] of Object.entries(NAVIGATION_MAP)) {
      if (item.path === path) {
        return route as AppRoute;
      }
    }
    
    return 'dashboard'; // default
  }

  getAllRoutes(): NavigationItem[] {
    return Object.values(NAVIGATION_MAP);
  }

  getRouteByPath(path: string): NavigationItem | null {
    for (const item of Object.values(NAVIGATION_MAP)) {
      if (item.path === path) {
        return item;
      }
    }
    return null;
  }
}

export const navigationService = new NavigationService();