import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Hand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HandsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-aurora p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Hand Control</h1>
              <p className="text-lg text-muted-foreground">Control the app with gestures</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              ← Dashboard
            </Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hand className="w-5 h-5 text-primary" />
              Camera Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hand Gesture Control</h3>
              <p className="text-muted-foreground mb-6">
                MediaPipe hand tracking will be implemented here
              </p>
              <p className="text-sm text-muted-foreground">
                • Swipe up/down to navigate<br/>
                • Left/right swipes for actions<br/>
                • Palm open to pause<br/>
                • Pinch to select
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HandsPage;