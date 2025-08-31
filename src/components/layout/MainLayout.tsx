import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VoiceOrb from '../voice/VoiceOrb';
import Dock from '../dock/Dock';
import PetAssistant from '../../ui/PetAssistant';
import WakeWordDetector from '../voice/WakeWordDetector';
import OfflineIndicator from '../offline/OfflineIndicator';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const location = useLocation();

  // Show dashboard only on specific routes or when voice commanded
  useEffect(() => {
    const dashboardRoutes = ['/dashboard', '/tasks', '/calendar', '/journal', '/habits', '/settings'];
    setIsDashboardVisible(dashboardRoutes.includes(location.pathname));
  }, [location.pathname]);

  const handleWakeWordDetected = () => {
    if (isVoiceActive) {
      // Show assistant response and orb
      if ((window as any).showAssistantMessage) {
        (window as any).showAssistantMessage("Yes, I'm listening. How can I help?", 'info');
      }
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Dashboard commands
    if (lowerCommand.includes('open dashboard') || lowerCommand.includes('show dashboard')) {
      setIsDashboardVisible(true);
      window.location.hash = '/dashboard';
    }
    
    // Hide dashboard
    if (lowerCommand.includes('hide dashboard') || lowerCommand.includes('close dashboard')) {
      setIsDashboardVisible(false);
      window.location.hash = '/';
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background - Prismatic gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-therapy-calm/5 to-therapy-warm/5" />
      
      {/* Wake Word Detection */}
      {isVoiceActive && (
        <WakeWordDetector
          wakeWord="hey louis"
          onWakeWordDetected={handleWakeWordDetected}
        />
      )}

      {/* Voice Orb - Center of screen when dashboard hidden */}
      {!isDashboardVisible && (
        <VoiceOrb 
          isVoiceActive={isVoiceActive}
          onVoiceCommand={handleVoiceCommand}
        />
      )}

      {/* Main Content - Only shown when dashboard visible */}
      {isDashboardVisible && (
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      )}

      {/* Always visible dock at bottom */}
      <Dock 
        isVoiceActive={isVoiceActive}
        onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
        onNavigate={(route) => {
          setIsDashboardVisible(true);
          window.location.hash = route;
        }}
      />

      {/* Pet Assistant */}
      <PetAssistant />

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default MainLayout;