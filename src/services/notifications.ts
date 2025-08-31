// Notification service for browser notifications and in-app notifications

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  
  constructor() {
    this.checkPermission();
  }

  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission === 'granted';
  }

  async showNotification(data: NotificationData): Promise<void> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      // Fallback to in-app notification
      this.showInAppNotification(data);
      return;
    }

    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      tag: data.tag,
      data: data.data,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      
      // Handle notification click based on data
      if (data.data?.route) {
        window.location.hash = data.data.route;
      }
    };

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  private showInAppNotification(data: NotificationData): void {
    // Show toast notification as fallback
    if ((window as any).showAssistantMessage) {
      (window as any).showAssistantMessage(`${data.title}: ${data.body}`, 'info');
    }
  }

  // Schedule notifications for habits, tasks, etc.
  scheduleTaskReminder(taskTitle: string, dueDate: Date): void {
    const now = new Date();
    const timeUntilDue = dueDate.getTime() - now.getTime();
    
    // Remind 1 hour before due
    const reminderTime = timeUntilDue - (60 * 60 * 1000);
    
    if (reminderTime > 0) {
      setTimeout(() => {
        this.showNotification({
          title: 'Task Reminder',
          body: `"${taskTitle}" is due in 1 hour`,
          icon: '📋',
          tag: 'task-reminder',
          data: { route: '/tasks' }
        });
      }, reminderTime);
    }
  }

  scheduleHabitReminder(habitName: string, reminderTime: string): void {
    // TODO: Implement daily habit reminders based on user-set times
    console.log(`Habit reminder scheduled: ${habitName} at ${reminderTime}`);
  }

  scheduleCalendarReminder(eventTitle: string, eventDate: Date): void {
    const now = new Date();
    const timeUntilEvent = eventDate.getTime() - now.getTime();
    
    // Remind 15 minutes before event
    const reminderTime = timeUntilEvent - (15 * 60 * 1000);
    
    if (reminderTime > 0) {
      setTimeout(() => {
        this.showNotification({
          title: 'Event Reminder',
          body: `"${eventTitle}" starts in 15 minutes`,
          icon: '📅',
          tag: 'event-reminder',
          data: { route: '/calendar' }
        });
      }, reminderTime);
    }
  }

  // Daily motivational notifications
  scheduleDailyMotivation(): void {
    const motivationalMessages = [
      "Great job on starting your day! Check your habits.",
      "Time to review your tasks and make progress!",
      "Don't forget to journal about your day.",
      "You're doing amazing! Keep up the good work.",
      "Take a moment to practice gratitude today."
    ];

    // Schedule at 9 AM daily
    const now = new Date();
    const tomorrow9AM = new Date();
    tomorrow9AM.setDate(now.getDate() + 1);
    tomorrow9AM.setHours(9, 0, 0, 0);

    const timeUntil9AM = tomorrow9AM.getTime() - now.getTime();

    setTimeout(() => {
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      this.showNotification({
        title: 'Daily Motivation',
        body: randomMessage,
        icon: '⭐',
        tag: 'daily-motivation',
        data: { route: '/dashboard' }
      });

      // Schedule next day
      this.scheduleDailyMotivation();
    }, timeUntil9AM);
  }
}

export const notificationService = new NotificationService();

// Initialize daily motivational notifications
notificationService.scheduleDailyMotivation();