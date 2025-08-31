import React, { useEffect, useRef, useState } from 'react';

interface WakeWordDetectorProps {
  wakeWord: string;
  onWakeWordDetected: () => void;
}

const WakeWordDetector: React.FC<WakeWordDetectorProps> = ({ 
  wakeWord, 
  onWakeWordDetected 
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart for continuous wake word detection
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.log('Wake word detection restart failed:', error);
          }
        }, 100);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          
          // Check for wake word
          if (transcript.includes(wakeWord.toLowerCase())) {
            onWakeWordDetected();
            
            // Brief pause after wake word detection
            recognition.stop();
            setTimeout(() => {
              try {
                recognition.start();
              } catch (error) {
                console.log('Wake word recognition restart failed:', error);
              }
            }, 2000);
            break;
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== 'no-speech' && event.error !== 'audio-capture') {
          console.error('Wake word detection error:', event.error);
        }
        
        // Restart on most errors
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.log('Wake word detection error restart failed:', error);
          }
        }, 1000);
      };

      // Start wake word detection
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start wake word detection:', error);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [wakeWord, onWakeWordDetected]);

  // This component doesn't render anything visible
  return null;
};

// Type definitions
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

export default WakeWordDetector;