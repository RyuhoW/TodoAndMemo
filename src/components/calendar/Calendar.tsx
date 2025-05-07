import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Event, View, CalendarProps as BigCalendarProps } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ja } from 'date-fns/locale';
import { Todo, TodoList } from '../../types/todo';
import { Note } from '../../types/note';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: 'todo' | 'note';
  originalData: Todo | Note;
}

interface CalendarProps {
  todos: TodoList;
  notes: Note[];
  onEventDrop: (event: CalendarEvent, start: Date, end: Date) => void;
  onEventResize: (event: CalendarEvent, start: Date, end: Date) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

interface EventDropArgs {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

interface ExtendedCalendarProps extends Omit<BigCalendarProps<CalendarEvent>, 'onEventDrop' | 'onEventResize'> {
  draggableAccessor?: (event: CalendarEvent) => boolean;
  resizableAccessor?: (event: CalendarEvent) => boolean;
  onEventDrop?: (args: EventDropArgs) => void;
  onEventResize?: (args: EventDropArgs) => void;
  resizable?: boolean;
}

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

const Calendar: React.FC<CalendarProps> = ({
  todos,
  notes,
  onEventDrop,
  onEventResize,
  onSelectSlot,
  onSelectEvent,
}) => {
  const [view, setView] = useState<View>('month');
  const [activeView, setActiveView] = useState<View>('month');

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
    setActiveView(newView);
  }, []);

  const handleViewButtonClick = useCallback((newView: View) => {
    setView(newView);
    setActiveView(newView);
  }, []);

  const events: CalendarEvent[] = [
    ...todos.map((todo): CalendarEvent => ({
      id: todo.id,
      title: todo.text,
      start: new Date(todo.createdAt),
      end: new Date(todo.createdAt),
      allDay: true,
      type: 'todo',
      originalData: todo,
    })),
    ...notes.map((note): CalendarEvent => ({
      id: note.id,
      title: note.text,
      start: new Date(note.timestamp),
      end: new Date(note.timestamp),
      allDay: true,
      type: 'note',
      originalData: note,
    })),
  ];

  const handleEventDrop = useCallback(
    ({ event, start, end }: EventDropArgs) => {
      onEventDrop(event, start, end);
    },
    [onEventDrop]
  );

  const handleEventResize = useCallback(
    ({ event, start, end }: EventDropArgs) => {
      onEventResize(event, start, end);
    },
    [onEventResize]
  );

  const calendarProps: ExtendedCalendarProps = {
    localizer,
    events,
    startAccessor: "start",
    endAccessor: "end",
    style: { height: 500 },
    view,
    onView: handleViewChange,
    eventPropGetter: (event) => ({
      style: {
        backgroundColor: event.type === 'todo' ? '#4CAF50' : '#2196F3',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block'
      }
    }),
    messages: {
      month: '月',
      week: '週',
      day: '日',
      agenda: 'リスト',
      today: '今日',
      previous: '先月',
      next: '次月',
      showMore: (total: number) => `他${total}件`,
      noEventsInRange: 'この期間の予定はありません',
      allDay: '終日',
      date: '日付',
      time: '時間',
      event: '予定'
    },
    selectable: true,
    onSelectSlot,
    onSelectEvent,
    draggableAccessor: () => true,
    resizableAccessor: () => true,
    onEventDrop: handleEventDrop,
    onEventResize: handleEventResize,
    resizable: true,
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <button
          className={`control-button ${activeView === 'month' ? 'active' : ''}`}
          onClick={() => handleViewButtonClick('month')}
        >
          月表示
        </button>
        <button
          className={`control-button ${activeView === 'week' ? 'active' : ''}`}
          onClick={() => handleViewButtonClick('week')}
        >
          週表示
        </button>
        <button
          className={`control-button ${activeView === 'day' ? 'active' : ''}`}
          onClick={() => handleViewButtonClick('day')}
        >
          日表示
        </button>
        <button
          className={`control-button ${activeView === 'agenda' ? 'active' : ''}`}
          onClick={() => handleViewButtonClick('agenda')}
        >
          リスト表示
        </button>
      </div>
      <BigCalendar {...calendarProps} />
    </div>
  );
};

export default Calendar; 