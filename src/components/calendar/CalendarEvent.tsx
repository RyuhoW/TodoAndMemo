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

export const createCalendarEvent = (data: Todo | Note): CalendarEvent | null => {
  const isTodo = 'status' in data;
  const timestamp = isTodo ? (data as Todo).created_at : (data as Note).createdAt;
  const title = isTodo ? (data as Todo).title : (data as Note).title;
  
  // タスクで時間指定がない場合はnullを返す
  if (isTodo && !(data as Todo).scheduled_time) {
    return null;
  }

  const scheduledTime = isTodo && (data as Todo).scheduled_time 
    ? new Date((data as Todo).scheduled_time || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  return {
    id: data.id,
    title: title,
    start: new Date(timestamp),
    end: new Date(timestamp),
    allDay: true,
    type: isTodo ? 'todo' : 'note',
    originalData: data,
  };
};

export const getEventStyle = (event: CalendarEvent) => {
  const isTodo = event.type === 'todo';
  const todo = isTodo ? event.originalData as Todo : null;
  const scheduledTime = todo?.scheduled_time 
    ? new Date(todo.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return {
    style: {
      backgroundColor: isTodo ? '#4CAF50' : '#2196F3',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.875rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    title: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
        {scheduledTime && (
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{scheduledTime}</div>
        )}
      </div>
    ),
  };
}; 