import React from 'react';
import { View } from 'react-big-calendar';

interface CalendarControlsProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const CalendarControls: React.FC<CalendarControlsProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="calendar-controls">
      <button
        className={`control-button ${activeView === 'month' ? 'active' : ''}`}
        onClick={() => onViewChange('month')}
      >
        月表示
      </button>
      <button
        className={`control-button ${activeView === 'week' ? 'active' : ''}`}
        onClick={() => onViewChange('week')}
      >
        週表示
      </button>
      <button
        className={`control-button ${activeView === 'day' ? 'active' : ''}`}
        onClick={() => onViewChange('day')}
      >
        日表示
      </button>
      <button
        className={`control-button ${activeView === 'agenda' ? 'active' : ''}`}
        onClick={() => onViewChange('agenda')}
      >
        リスト表示
      </button>
    </div>
  );
};

export default CalendarControls; 