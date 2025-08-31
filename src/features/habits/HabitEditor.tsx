import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { habitsStore } from './habitsStore';
import { X, Save } from 'lucide-react';

interface HabitEditorProps {
  habit: any | null;
  onClose: () => void;
}

const HabitEditor: React.FC<HabitEditorProps> = ({ habit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [category, setCategory] = useState('health');

  const addHabit = habitsStore((state) => state.addHabit);
  const updateHabit = habitsStore((state) => state.updateHabit);

  const iconOptions = [
    '🎯', '💪', '🏃', '📚', '🧘', '💧', '🍎', '☀️', 
    '🛌', '✍️', '🎨', '🎵', '🧠', '❤️', '🌱', '⚡'
  ];

  const categoryOptions = [
    { value: 'health', label: 'Health & Fitness' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'learning', label: 'Learning' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'social', label: 'Social' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
      setIcon(habit.icon);
      setCategory(habit.category || 'health');
    }
  }, [habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const habitData = {
      name: name.trim(),
      description: description.trim(),
      icon,
      category,
      completedDates: []
    };

    if (habit) {
      // Update existing habit
      updateHabit(habit.id, habitData);
      if ((window as any).showAssistantMessage) {
        (window as any).showAssistantMessage(`Habit "${name}" updated successfully!`, 'confirmation');
      }
    } else {
      // Create new habit
      addHabit(habitData);
      if ((window as any).showAssistantMessage) {
        (window as any).showAssistantMessage(`Habit "${name}" created successfully!`, 'confirmation');
      }
    }

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="glass-card w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {habit ? 'Edit Habit' : 'Create New Habit'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
            {/* Icon Selection */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((iconOption) => (
                  <Button
                    key={iconOption}
                    type="button"
                    variant={icon === iconOption ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIcon(iconOption)}
                    className="text-lg"
                  >
                    {iconOption}
                  </Button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this habit important to you?"
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-primary">
                <Save className="w-4 h-4 mr-2" />
                {habit ? 'Update Habit' : 'Create Habit'}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitEditor;