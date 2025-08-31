import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { taskStore } from './taskStore';
import { Task } from '../../services/firebase';
import { Plus, CheckCircle2, Circle, Trash2, Edit, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import TaskEditor from './TaskEditor';

const TaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasks = taskStore((state) => state.tasks);
  
  // Use useMemo to prevent infinite re-renders
  const completedTasks = React.useMemo(() => 
    tasks.filter(task => task.completed), [tasks]
  );
  const incompleteTasks = React.useMemo(() => 
    tasks.filter(task => !task.completed), [tasks]
  );

  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    
    // Filter by priority
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsEditing(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setEditingTask(null);
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: 'bg-primary' },
    { label: 'Active', value: incompleteTasks.length, color: 'bg-warning' },
    { label: 'Completed', value: completedTasks.length, color: 'bg-success' },
    { 
      label: 'Completion Rate', 
      value: tasks.length > 0 ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` : '0%',
      color: 'bg-therapy-calm' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-aurora p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Tasks</h1>
            <p className="text-lg text-muted-foreground">Manage your productivity</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="hover:bg-glass"
            >
              ← Dashboard
            </Button>
            <Button onClick={handleCreateTask} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-foreground flex items-center">
                  <Filter className="w-4 h-4 mr-1" />
                  Status:
                </span>
                {['all', 'active', 'completed'].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(f as any)}
                    className={filter === f ? 'bg-gradient-primary' : ''}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <span className="text-sm font-medium text-foreground">Priority:</span>
                {['all', 'high', 'medium', 'low'].map((p) => (
                  <Button
                    key={p}
                    variant={priorityFilter === p ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPriorityFilter(p as any)}
                    className={priorityFilter === p ? 'bg-gradient-primary' : ''}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <TaskList 
        tasks={filteredTasks} 
        onEditTask={handleEditTask}
      />

      {/* Task Editor Modal */}
      {isEditing && (
        <TaskEditor
          task={editingTask}
          onClose={handleCloseEditor}
        />
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery || filter !== 'all' || priorityFilter !== 'all'
                    ? 'No tasks match your filters'
                    : 'No tasks yet'
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first task to get started'
                  }
                </p>
                {(!searchQuery && filter === 'all' && priorityFilter === 'all') && (
                  <Button onClick={handleCreateTask} className="bg-gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Task
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskPage;