import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { openrouterClient } from '../agent/openrouterClient';
import { orchestrator } from '../agent/orchestrator';
import { toast } from '@/hooks/use-toast';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const VoiceMic: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Couldn't understand that. Please try again.",
          variant: "destructive"
        });
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Microphone Error", 
          description: "Please allow microphone access and try again.",
          variant: "destructive"
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    
    try {
      // Parse intent using OpenRouter
      const intent = await openrouterClient.parseIntent(text);
      
      // Execute the intent
      const response = await orchestrator.executeIntent(intent);
      
      // Show assistant response
      if ((window as any).showAssistantMessage) {
        (window as any).showAssistantMessage(response, 'confirmation');
      }

      // Speak the response (if supported)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      toast({
        title: "Processing Error",
        description: "Sorry, I couldn't process that command.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  if (!isSupported) {
    return null; // Hide component if not supported
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex flex-col items-center gap-3">
        {/* Transcript Display */}
        {(transcript || isProcessing) && (
          <div className="glass-card p-3 max-w-xs animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {isProcessing ? 'Processing...' : 'Listening...'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isProcessing ? 'Thinking about your request...' : transcript || 'Say something...'}
            </p>
          </div>
        )}

        {/* Microphone Button */}
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`
            w-14 h-14 rounded-full transition-all duration-300
            ${isListening 
              ? 'bg-destructive hover:bg-destructive/90 animate-pulse-glow' 
              : 'bg-gradient-primary hover:scale-105'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          size="lg"
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        {/* Status indicator */}
        {isListening && (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-destructive rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-destructive rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-destructive rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceMic;