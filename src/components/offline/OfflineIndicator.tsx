import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing data...",
        variant: "default"
      });
      
      // Trigger sync with Firebase when back online
      if ((window as any).syncOfflineData) {
        (window as any).syncOfflineData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Working offline. Changes will sync when reconnected.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="glass-card px-3 py-2 rounded-lg flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-destructive" />
        <span className="text-sm text-destructive font-medium">Offline</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;