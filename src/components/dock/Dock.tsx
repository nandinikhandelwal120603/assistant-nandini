import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  BookOpen, 
  Target,
  Settings, 
  Mic, 
  MicOff 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DockProps {
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  onNavigate: (route: string) => void;
}

const Dock: React.FC<DockProps> = ({ isVoiceActive, onToggleVoice, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    { icon: Home, label: 'Dashboard', route: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', route: '/tasks' },
    { icon: Calendar, label: 'Calendar', route: '/calendar' },
    { icon: BookOpen, label: 'Journal', route: '/journal' },
    { icon: Target, label: 'Habits', route: '/habits' },
    { icon: Settings, label: 'Settings', route: '/settings' },
  ];

  const handleNavigation = (route: string) => {
    navigate(route);
    onNavigate(route);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-2">
          {/* Navigation Items */}
          {dockItems.map((item) => (
            <Button
              key={item.route}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.route)}
              className={`
                w-10 h-10 rounded-xl transition-all duration-300
                ${location.pathname === item.route 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'hover:bg-primary/20 text-muted-foreground hover:text-foreground'
                }
              `}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </Button>
          ))}

          {/* Separator */}
          <div className="w-px h-8 bg-border mx-2" />

          {/* Voice Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVoice}
            className={`
              w-10 h-10 rounded-xl transition-all duration-300
              ${isVoiceActive 
                ? 'bg-primary text-primary-foreground animate-pulse-glow' 
                : 'bg-destructive/20 text-destructive hover:bg-destructive/30'
              }
            `}
            title={isVoiceActive ? 'Voice Active' : 'Voice Inactive'}
          >
            {isVoiceActive ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dock;