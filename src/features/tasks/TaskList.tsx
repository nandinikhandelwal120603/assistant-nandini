import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { taskStore } from './taskStore';
import { Task } from '../../services/firebase';
import { CheckCircle2, Circle, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask }) => {
  const toggleTask = taskStore((state) => state.toggleTask);
  const deleteTask = taskStore((state) => state.deleteTask);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '📌';
    }
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date() > dueDate;
  };

  const formatDueDate = (dueDate?: Date) => {
    if (!dueDate) return null;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    
    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return format(dueDate, 'MMM d, yyyy');
  };

  const handleToggleTask = (task: Task) => {
    toggleTask(task.id);
    
    // Show assistant message
    if ((window as any).showAssistantMessage) {
      const message = task.completed 
        ? `Task "${task.title}" marked as incomplete.`
        : `Great job completing "${task.title}"! 🎉`;
      (window as any).showAssistantMessage(message, task.completed ? 'info' : 'celebration');
    }
  };

  const handleDeleteTask = (task: Task) => {
    deleteTask(task.id);
    
    if ((window as any).showAssistantMessage) {
      (window as any).showAssistantMessage(`Task "${task.title}" deleted.`, 'info');
    }
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const dueDate = formatDueDate(task.dueDate);
        const overdue = isOverdue(task.dueDate);

        return (
          <Card key={task.id} className={`glass-card transition-all duration-200 hover:shadow-glow ${
            task.completed ? 'opacity-75' : ''
          }`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                {/* Completion Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleTask(task)}
                  className="mt-1 p-1 h-8 w-8"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  )}
                </Button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-foreground ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`text-sm text-muted-foreground mt-1 ${
                          task.completed ? 'line-through opacity-60' : ''
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {/* Tags and Due Date */}
                      <div className="flex items-center gap-3 mt-3">
                        {/* Priority Badge */}
                        <Badge 
                          variant="secondary"
                          className={`${getPriorityColor(task.priority)} text-white text-xs`}
                        >
                          <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                          {task.priority}
                        </Badge>

                        {/* Due Date */}
                        {dueDate && (
                          <div className={`flex items-center gap-1 text-xs ${
                            overdue && !task.completed ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{dueDate}</span>
                            {overdue && !task.completed && <span>⚠️</span>}
                          </div>
                        )}

                        {/* Created Date */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Created {format(task.createdAt, 'MMM d')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTask(task)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task)}
                        className="h-8 w-8 p-0 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskList;