import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { openrouterClient } from '../../agent/openrouterClient';
import { orchestrator } from '../../agent/orchestrator';
import { toast } from '@/hooks/use-toast';

interface VoiceOrbProps {
  isVoiceActive: boolean;
  onVoiceCommand: (command: string) => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ isVoiceActive, onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && isVoiceActive) {
      setupSpeechRecognition(SpeechRecognition);
      setupAudioVisualization();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVoiceActive]);

  const setupSpeechRecognition = (SpeechRecognition: any) => {
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if voice is still active
      if (isVoiceActive) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.log('Recognition restart failed:', error);
          }
        }, 1000);
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        processVoiceCommand(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        toast({
          title: "Voice Recognition Error",
          description: "Couldn't understand that. Please try again.",
          variant: "destructive"
        });
      }
    };

    // Start initial recognition
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  };

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Failed to setup audio visualization:', error);
    }
  };

  const processVoiceCommand = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setTranscript('');
    
    try {
      // First handle navigation commands
      onVoiceCommand(text);
      
      // Then parse intent using OpenRouter
      const intent = await openrouterClient.parseIntent(text);
      const response = await orchestrator.executeIntent(intent);
      
      // Show assistant response
      if ((window as any).showAssistantMessage) {
        (window as any).showAssistantMessage(response, 'confirmation');
      }

      // Speak the response
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
    }
  };

  if (!isVoiceActive) {
    return null;
  }

  const orbSize = isListening ? 120 + (audioLevel * 60) : 100;
  const glowIntensity = isListening ? 0.6 + (audioLevel * 0.4) : 0.3;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-30">
      {/* Transcript Display */}
      {(transcript || isProcessing) && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="glass-card p-4 max-w-md animate-fade-in">
            <p className="text-center text-foreground">
              {isProcessing ? 'Processing...' : transcript}
            </p>
          </div>
        </div>
      )}

      {/* Voice Orb */}
      <div className="relative">
        {/* Outer glow rings */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{
            width: orbSize + 40,
            height: orbSize + 40,
            left: -20,
            top: -20,
            background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
            opacity: glowIntensity,
            filter: 'blur(20px)'
          }}
        />
        
        {/* Main orb */}
        <div 
          className="relative rounded-full glass-card flex items-center justify-center transition-all duration-300"
          style={{
            width: orbSize,
            height: orbSize,
            background: isListening 
              ? `radial-gradient(circle, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))`
              : `radial-gradient(circle, hsl(var(--muted) / 0.3), hsl(var(--muted) / 0.1))`,
            boxShadow: isListening 
              ? `0 0 ${20 + audioLevel * 30}px hsl(var(--primary) / 0.5)`
              : '0 0 20px hsl(var(--muted) / 0.3)'
          }}
        >
          {/* Icon */}
          {isListening ? (
            <Mic 
              className="text-primary transition-all duration-300" 
              size={32 + audioLevel * 16}
            />
          ) : (
            <MicOff 
              className="text-muted-foreground" 
              size={32}
            />
          )}

          {/* Audio visualization particles */}
          {isListening && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full animate-float"
                  style={{
                    left: `${50 + Math.cos(i * Math.PI / 4) * 30}%`,
                    top: `${50 + Math.sin(i * Math.PI / 4) * 30}%`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.3 + audioLevel * 0.7,
                    transform: `scale(${0.5 + audioLevel})`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status text */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-muted-foreground text-center">
            {isProcessing ? 'Processing...' 
             : isListening ? 'Listening...' 
             : 'Voice Assistant Ready'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Add wake word interface types to global scope
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

export default VoiceOrb;