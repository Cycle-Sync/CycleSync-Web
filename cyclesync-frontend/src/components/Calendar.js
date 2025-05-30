import React, { useState, useEffect } from 'react';
import { getCalendar } from '../api';

function Calendar() {
  const [daysList, setDaysList] = useState([]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await getCalendar();
        setDaysList(response.data.days_list);
      } catch (error) {
        console.error('Failed to fetch calendar', error);
      }
    };
    fetchCalendar();
  }, []);

  return (
    <div className="calendar-wrapper">
      <div className="cycle-calendar">
        <div className="day-names">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="day-name">{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {daysList.map((day, index) => (
            <React.Fragment key={index}>
              {day.new_month && (
                <div className="month-separator" style={{ gridColumn: '1 / -1' }}>
                  {new Date(day.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
              )}
              <div
                className={`day-cell ${day.phase} ${day.is_past ? 'past' : ''} ${day.is_today ? 'today' : ''}`}
                style={{ gridColumn: new Date(day.date).getDay() + 1 }}
                title={`Day ${day.day_num} — ${day.date}`}
              >
                {new Date(day.date).getDate()}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Add cycle beads and legend as needed */}
    </div>
  );
}

export default Calendar;