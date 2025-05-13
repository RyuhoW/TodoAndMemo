import { Event } from 'react-big-calendar';
import { Todo } from '../../types/todo';
import { Note } from '../../types/note';

export interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: 'todo' | 'note';
  originalData: Todo | Note;
}

export interface EventDropArgs {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

export const createCalendarEvent = (data: Todo | Note): CalendarEvent => {
  const isTodo = 'status' in data;
  const timestamp = isTodo ? (data as Todo).created_at : (data as Note).createdAt;
  return {
    id: data.id,
    title: isTodo ? (data as Todo).title : (data as Note).title,
    start: new Date(timestamp),
    end: new Date(timestamp),
    allDay: true,
    type: isTodo ? 'todo' : 'note',
    originalData: data,
  };
};

export const getEventStyle = (event: CalendarEvent) => ({
  style: {
    backgroundColor: event.type === 'todo' ? '#4CAF50' : '#2196F3',
  },
}); 