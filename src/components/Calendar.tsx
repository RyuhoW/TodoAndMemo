import React, { useState, useCallback, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View, Event, CalendarProps as BigCalendarProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Todo } from '../types/todo';
import { Note } from '../types/note';

const locales = {
  'ja': ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: 'todo' | 'note';
}

interface CalendarProps {
  todos: Todo[];
  notes: Note[];
  onEventDrop?: (event: CalendarEvent, start: Date, end: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ todos, notes, onEventDrop }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [activeView, setActiveView] = useState<View>('month');

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = [
      ...todos.map(todo => ({
        id: todo.id,
        title: todo.text,
        start: new Date(todo.createdAt),
        end: new Date(todo.createdAt),
        type: 'todo' as const,
      })),
      ...notes.map(note => ({
        id: note.id,
        title: note.text,
        start: new Date(note.timestamp),
        end: new Date(note.timestamp),
        type: 'note' as const,
      })),
    ];
    setEvents(calendarEvents);
  }, [todos, notes]);

  const handleEventDrop = useCallback(({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
    if (onEventDrop) {
      onEventDrop(event, start, end);
    }
  }, [onEventDrop]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => ({
    style: {
      backgroundColor: event.type === 'todo' ? '#4CAF50' : '#2196F3',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    }
  }), []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
    setActiveView(newView);
  }, []);

  const handleViewButtonClick = useCallback((newView: View) => {
    setView(newView);
    setActiveView(newView);
  }, []);

  const calendarProps: BigCalendarProps<CalendarEvent> = {
    localizer,
    events,
    startAccessor: "start",
    endAccessor: "end",
    style: { height: 500 },
    view,
    onView: handleViewChange,
    eventPropGetter: eventStyleGetter,
    messages: {
      next: "次",
      previous: "前",
      today: "今日",
      month: "月",
      week: "週",
      day: "日",
      agenda: "予定表",
      date: "日付",
      time: "時間",
      event: "予定",
      noEventsInRange: "予定はありません"
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <button 
          onClick={() => handleViewButtonClick('month')}
          className={activeView === 'month' ? 'active' : ''}
        >
          月表示
        </button>
        <button 
          onClick={() => handleViewButtonClick('week')}
          className={activeView === 'week' ? 'active' : ''}
        >
          週表示
        </button>
        <button 
          onClick={() => handleViewButtonClick('day')}
          className={activeView === 'day' ? 'active' : ''}
        >
          日表示
        </button>
        <button 
          onClick={() => handleViewButtonClick('agenda')}
          className={activeView === 'agenda' ? 'active' : ''}
        >
          リスト表示
        </button>
      </div>
      <BigCalendar {...calendarProps} />
    </div>
  );
};

export default Calendar; 