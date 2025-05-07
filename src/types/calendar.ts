import { Todo } from './todo';
import { Note } from './note';
import { Event } from 'react-big-calendar';

export interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: 'todo' | 'note';
  originalData: Todo | Note;
}

export interface CalendarProps {
  todos: Todo[];
  notes: Note[];
  onEventDrop: (event: CalendarEvent, start: Date, end: Date) => void;
  onEventResize: (event: CalendarEvent, start: Date, end: Date) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export interface EventDropArgs {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  label: string;
  icon: React.ReactNode;
}

export interface CalendarControlsProps {
  activeView: CalendarView['type'];
  onViewChange: (view: CalendarView['type']) => void;
}

export interface CalendarEventFormProps {
  event?: CalendarEvent;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
}

export interface CalendarEventModalProps {
  isOpen: boolean;
  event?: CalendarEvent;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete: (eventId: number) => void;
} 