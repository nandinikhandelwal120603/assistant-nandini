import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calendarStore } from './calendarStore';
import { CalendarEvent } from '../../services/firebase';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import EventEditor from './EventEditor';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const events = calendarStore((state) => state.events);
  
  // Compute derived values with useMemo
  const upcomingEvents = React.useMemo(() => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= futureDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for selected date using useMemo
  const selectedDateEvents = React.useMemo(() => {
    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);
    
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === targetDate.getTime();
    });
  }, [events, selectedDate]);

  // Get events for the month (for calendar dots)
  const monthEvents = events.filter(event => isSameMonth(event.date, currentDate));

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEditing(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setEditingEvent(null);
  };

  const getEventsForDay = (date: Date) => {
    return monthEvents.filter(event => isSameDay(event.date, date));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-aurora p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Calendar</h1>
            <p className="text-lg text-muted-foreground">Manage your schedule</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="hover:bg-glass"
            >
              ← Dashboard
            </Button>
            <Button onClick={handleCreateEvent} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map(date => {
                  const dayEvents = getEventsForDay(date);
                  const isSelected = isSameDay(date, selectedDate);
                  const isTodayDate = isToday(date);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`
                        p-2 h-20 text-left rounded-lg transition-all hover:bg-gradient-glass relative
                        ${isSelected ? 'bg-gradient-primary text-primary-foreground' : ''}
                        ${isTodayDate && !isSelected ? 'bg-gradient-therapy' : ''}
                      `}
                    >
                      <span className={`text-sm font-medium ${
                        isSelected ? 'text-primary-foreground' : 
                        isTodayDate ? 'text-foreground' : 'text-foreground'
                      }`}>
                        {format(date, 'd')}
                      </span>
                      
                      {/* Event Dots */}
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex gap-1 flex-wrap">
                          {dayEvents.slice(0, 3).map((_, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-primary-foreground' : 'bg-primary'
                              }`}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className={`text-xs ${
                              isSelected ? 'text-primary-foreground' : 'text-primary'
                            }`}>
                              +{dayEvents.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-therapy-calm" />
                {format(selectedDate, 'EEEE, MMMM d')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => handleEditEvent(event)}
                      className="p-3 rounded-lg bg-gradient-glass cursor-pointer hover:bg-gradient-therapy transition-all"
                    >
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(event.time)}
                        {event.duration && ` (${event.duration}min)`}
                      </p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No events scheduled</p>
                  <Button 
                    onClick={handleCreateEvent} 
                    size="sm"
                    className="bg-gradient-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map(event => (
                  <div
                    key={event.id}
                    onClick={() => handleEditEvent(event)}
                    className="p-3 rounded-lg bg-gradient-glass cursor-pointer hover:bg-gradient-therapy transition-all"
                  >
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(event.date, 'MMM d')} at {formatTime(event.time)}
                    </p>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No upcoming events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Editor Modal */}
      {isEditing && (
        <EventEditor
          event={editingEvent}
          selectedDate={selectedDate}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default CalendarPage;