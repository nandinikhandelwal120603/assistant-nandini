import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  type: 'confirmation' | 'info' | 'celebration';
  timestamp: Date;
}

const PetAssistant: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  // Show assistant when there are messages
  useEffect(() => {
    if (messages.length > 0 && !currentMessage) {
      setCurrentMessage(messages[0]);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        hideMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [messages, currentMessage]);

  const addMessage = (text: string, type: Message['type'] = 'info') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const hideMessage = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentMessage(null);
      setMessages(prev => prev.slice(1));
    }, 300);
  };

  // Global message function for other components to use
  useEffect(() => {
    (window as any).showAssistantMessage = addMessage;
  }, []);

  if (!currentMessage) return null;

  const getEmoji = (type: Message['type']) => {
    switch (type) {
      case 'confirmation': return '✅';
      case 'celebration': return '🎉';
      default: return '💫';
    }
  };

  const getBgColor = (type: Message['type']) => {
    switch (type) {
      case 'confirmation': return 'bg-gradient-therapy';
      case 'celebration': return 'bg-gradient-primary';
      default: return 'bg-gradient-glass';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className={`
          glass-card p-4 max-w-sm transition-all duration-300 transform
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
          ${getBgColor(currentMessage.type)}
        `}
      >
        <div className="flex items-start gap-3">
          {/* Pet Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center animate-float">
              <span className="text-2xl">
                {getEmoji(currentMessage.type)}
              </span>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground leading-relaxed">
              {currentMessage.text}
            </p>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={hideMessage}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Floating action button when minimized */}
        {messages.length > 1 && (
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-xs text-primary-foreground font-bold">
                {messages.length - 1}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat toggle when no current message */}
      {!isVisible && messages.length === 0 && (
        <Button
          onClick={() => addMessage("Hello! I'm here to help. Try saying something!")}
          className="w-14 h-14 rounded-full bg-gradient-primary shadow-glow animate-float"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default PetAssistant;