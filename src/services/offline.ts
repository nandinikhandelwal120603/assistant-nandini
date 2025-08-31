// Offline-first data management with localStorage caching

interface OfflineData {
  tasks: any[];
  habits: any[];
  calendarEvents: any[];
  journalEntries: any[];
  lastSyncTime: number;
}

class OfflineService {
  private readonly STORAGE_KEY = 'jarvis_offline_data';
  private syncQueue: any[] = [];

  constructor() {
    this.setupGlobalSync();
    this.loadFromCache();
  }

  private setupGlobalSync() {
    // Expose sync function globally for OfflineIndicator component
    (window as any).syncOfflineData = this.syncWithFirebase.bind(this);
  }

  private getStoredData(): OfflineData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse offline data:', error);
      }
    }

    return {
      tasks: [],
      habits: [],
      calendarEvents: [],
      journalEntries: [],
      lastSyncTime: 0
    };
  }

  private saveToCache(data: Partial<OfflineData>) {
    const current = this.getStoredData();
    const updated = { ...current, ...data, lastSyncTime: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  private loadFromCache() {
    if (!navigator.onLine) {
      const data = this.getStoredData();
      
      // Load cached data into stores
      if (data.tasks.length > 0) {
        // TODO: Load into taskStore
        console.log('Loaded cached tasks:', data.tasks.length);
      }
      
      if (data.habits.length > 0) {
        // TODO: Load into habitsStore
        console.log('Loaded cached habits:', data.habits.length);
      }
      
      if (data.calendarEvents.length > 0) {
        // TODO: Load into calendarStore
        console.log('Loaded cached events:', data.calendarEvents.length);
      }
      
      if (data.journalEntries.length > 0) {
        // TODO: Load into journalStore
        console.log('Loaded cached journal entries:', data.journalEntries.length);
      }
    }
  }

  // Cache operations for offline use
  cacheTasks(tasks: any[]) {
    this.saveToCache({ tasks });
  }

  cacheHabits(habits: any[]) {
    this.saveToCache({ habits });
  }

  cacheCalendarEvents(events: any[]) {
    this.saveToCache({ calendarEvents: events });
  }

  cacheJournalEntries(entries: any[]) {
    this.saveToCache({ journalEntries: entries });
  }

  // Queue operations for when offline
  queueOperation(operation: {
    type: 'create' | 'update' | 'delete';
    entity: 'task' | 'habit' | 'event' | 'journal';
    data: any;
    timestamp: number;
  }) {
    this.syncQueue.push(operation);
    localStorage.setItem('jarvis_sync_queue', JSON.stringify(this.syncQueue));
  }

  // Sync with Firebase when back online
  async syncWithFirebase(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Still offline, cannot sync');
      return;
    }

    try {
      console.log('Starting offline data sync...');
      
      // Get queued operations
      const queuedOps = localStorage.getItem('jarvis_sync_queue');
      if (queuedOps) {
        this.syncQueue = JSON.parse(queuedOps);
      }

      // Process sync queue
      for (const operation of this.syncQueue) {
        await this.processQueuedOperation(operation);
      }

      // Clear sync queue after successful sync
      this.syncQueue = [];
      localStorage.removeItem('jarvis_sync_queue');

      // Fetch latest data from Firebase
      await this.fetchLatestData();

      console.log('Offline data sync completed');
      
      // Show success message
      if ((window as any).showAssistantMessage) {
        (window as any).showAssistantMessage('Data synced successfully!', 'confirmation');
      }

    } catch (error) {
      console.error('Failed to sync offline data:', error);
      
      if ((window as any).showAssistantMessage) {
        (window as any).showAssistantMessage('Sync failed. Will retry later.', 'destructive');
      }
    }
  }

  private async processQueuedOperation(operation: any): Promise<void> {
    // TODO: Implement Firebase operations based on queued data
    console.log('Processing queued operation:', operation);
    
    switch (operation.entity) {
      case 'task':
        // TODO: Apply task operation to Firebase
        break;
      case 'habit':
        // TODO: Apply habit operation to Firebase
        break;
      case 'event':
        // TODO: Apply calendar event operation to Firebase
        break;
      case 'journal':
        // TODO: Apply journal entry operation to Firebase
        break;
    }
  }

  private async fetchLatestData(): Promise<void> {
    // TODO: Fetch latest data from Firebase and update local stores
    console.log('Fetching latest data from Firebase...');
    
    // For now, just update the cache timestamp
    this.saveToCache({ lastSyncTime: Date.now() });
  }

  // Check if data is stale (older than 1 hour)
  isDataStale(): boolean {
    const data = this.getStoredData();
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - data.lastSyncTime) > oneHour;
  }

  // Get offline status info
  getOfflineStatus() {
    const data = this.getStoredData();
    return {
      isOnline: navigator.onLine,
      lastSyncTime: new Date(data.lastSyncTime),
      queuedOperations: this.syncQueue.length,
      isDataStale: this.isDataStale()
    };
  }
}

export const offlineService = new OfflineService();

// Auto-sync when coming back online
window.addEventListener('online', () => {
  setTimeout(() => {
    offlineService.syncWithFirebase();
  }, 1000); // Wait 1 second to ensure connection is stable
});

// Cache data periodically when online
if (navigator.onLine) {
  setInterval(() => {
    // TODO: Cache current store data
    console.log('Periodic cache update...');
  }, 5 * 60 * 1000); // Every 5 minutes
}