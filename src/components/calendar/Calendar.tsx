import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View, CalendarProps as BigCalendarProps } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ja } from 'date-fns/locale';
import { Todo, TodoList } from '../../types/todo';
import { Note } from '../../types/note';
import { CalendarEvent, EventDropArgs, createCalendarEvent, getEventStyle } from './CalendarEvent';
import CalendarControls from './CalendarControls';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarProps {
  todos: TodoList;
  notes: Note[];
  onEventDrop: (event: CalendarEvent, start: Date, end: Date) => void;
  onEventResize: (event: CalendarEvent, start: Date, end: Date) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (event: CalendarEvent) => void;
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

  const events: CalendarEvent[] = [
    ...todos.map(createCalendarEvent),
    ...notes.map(createCalendarEvent),
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
    eventPropGetter: getEventStyle,
    messages: {
      month: '月',
      week: '週',
      day: '日',
      agenda: 'リスト',
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
      <CalendarControls activeView={activeView} onViewChange={handleViewChange} />
      <BigCalendar {...calendarProps} />
    </div>
  );
};

export default Calendar; 