import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FlipClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const displayHours = (time.getHours() % 12 || 12).toString().padStart(2, '0');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const FlipDigit: React.FC<{ digit: string; label?: string }> = ({ digit, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-gradient-primary text-primary-foreground rounded-lg p-4 shadow-glow min-w-[80px] text-center">
          <span className="text-4xl md:text-6xl font-mono font-bold">
            {digit}
          </span>
        </div>
        {/* Flip animation overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none" />
      </div>
      {label && (
        <span className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="text-center space-y-6">
          {/* Date */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {formatDate(time)}
            </h2>
            <p className="text-muted-foreground">
              {time.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ')[1]}
            </p>
          </div>

          {/* Time Display */}
          <div className="flex items-center justify-center gap-6">
            <FlipDigit digit={displayHours} label="Hours" />
            
            <div className="flex flex-col gap-2 animate-pulse">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
            
            <FlipDigit digit={minutes} label="Minutes" />
            
            <div className="hidden md:flex flex-col gap-2 animate-pulse">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
            
            <div className="hidden md:block">
              <FlipDigit digit={seconds} label="Seconds" />
            </div>
          </div>

          {/* AM/PM Indicator */}
          <div className="flex justify-center">
            <div className="bg-gradient-glass px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-foreground">
                {ampm}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlipClock;