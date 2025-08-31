import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { journalStore } from './journalStore';
import { Heart, BookOpen, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BreathingWidget from './BreathingWidget';

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState(3);

  const journalEntries = journalStore((state) => state.entries);
  const moodEntries = journalStore((state) => state.moods);
  
  // Compute average mood with useMemo
  const averageMood = React.useMemo(() => {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentMoods = moodEntries.filter(mood => mood.timestamp >= cutoffDate);
    if (recentMoods.length === 0) return 3;
    const sum = recentMoods.reduce((acc, mood) => acc + mood.rating, 0);
    return Math.round((sum / recentMoods.length) * 10) / 10;
  }, [moodEntries]);

  const addEntry = journalStore((state) => state.addEntry);

  const handleSaveEntry = () => {
    if (!currentEntry.trim()) return;

    addEntry({
      content: currentEntry.trim(),
      mood: currentMood,
      tags: []
    });

    setCurrentEntry('');
    if ((window as any).showAssistantMessage) {
      (window as any).showAssistantMessage('Your thoughts have been saved. Thank you for sharing. 💙', 'confirmation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-therapy p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute top-6 left-6"
          >
            ← Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Journal</h1>
          <p className="text-lg text-muted-foreground">A safe space for your thoughts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Writing Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-therapy-warm" />
                  What's on your mind?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={currentEntry}
                    onChange={(e) => setCurrentEntry(e.target.value)}
                    placeholder="I'm here to listen. Share whatever is on your heart..."
                    rows={8}
                    className="resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">How are you feeling?</span>
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <Button
                          key={mood}
                          variant={currentMood === mood ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentMood(mood)}
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          {mood === 1 && '😔'}
                          {mood === 2 && '😕'}
                          {mood === 3 && '😐'}
                          {mood === 4 && '😊'}
                          {mood === 5 && '😄'}
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleSaveEntry}
                      disabled={!currentEntry.trim()}
                      className="bg-gradient-therapy"
                    >
                      Save Entry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-therapy-calm" />
                  Recent Reflections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {journalEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-4 rounded-lg bg-gradient-glass">
                      <p className="text-sm text-foreground mb-2">{entry.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{entry.createdAt.toLocaleDateString()}</span>
                        <span>Mood: {entry.mood}/5</span>
                      </div>
                    </div>
                  ))}
                  {journalEntries.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Your journal entries will appear here
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BreathingWidget />
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smile className="w-5 h-5 text-therapy-sage" />
                  Mood Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {averageMood >= 4 && '😊'}
                    {averageMood >= 3 && averageMood < 4 && '😐'}
                    {averageMood < 3 && '😔'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    7-day average: {averageMood}/5
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;