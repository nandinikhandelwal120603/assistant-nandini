import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-aurora p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-lg text-muted-foreground">Customize your experience</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              ← Dashboard
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { icon: User, title: 'Profile', desc: 'Manage your account' },
            { icon: Bell, title: 'Notifications', desc: 'Configure alerts' },
            { icon: Palette, title: 'Appearance', desc: 'Theme and display' },
            { icon: Settings, title: 'General', desc: 'App preferences' }
          ].map((item, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <item.icon className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                  <Button variant="ghost">Configure</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;