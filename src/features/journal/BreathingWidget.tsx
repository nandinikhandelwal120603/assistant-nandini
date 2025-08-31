import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BreathingWidget: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  React.useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhase(current => {
        switch (current) {
          case 'inhale': return 'hold';
          case 'hold': return 'exhale';
          case 'exhale': return 'inhale';
        }
      });
    }, 4000); // 4 seconds per phase

    return () => clearInterval(interval);
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPhase('inhale');
    }
  };

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-center">4-7-8 Breathing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          {/* Breathing Circle */}
          <div className="flex justify-center">
            <div 
              className={`
                w-32 h-32 rounded-full bg-gradient-therapy
                transition-transform duration-[4000ms] ease-in-out
                ${isActive ? 
                  phase === 'inhale' ? 'scale-125' :
                  phase === 'hold' ? 'scale-125' : 'scale-75'
                  : 'scale-100'
                }
              `}
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {isActive ? getInstruction() : 'Ready to breathe?'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isActive ? 'Follow the circle' : 'Inhale 4s • Hold 7s • Exhale 8s'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleToggle}
              className={isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-gradient-therapy'}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            {isActive && (
              <Button
                variant="ghost"
                onClick={() => {
                  setIsActive(false);
                  setPhase('inhale');
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingWidget;