import React from 'react';
import { generateCalendar } from './utils.js'; // Ruta corregida
import '../styles/Calendar.css'; // Ruta corregida

const Calendar = ({ events, onEventClick, onDayClick, className }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate(); // Obtener el día actual
  const weeks = generateCalendar(currentYear, currentMonth);

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(
      (event) =>
        new Date(event.start).getDate() === day &&
        new Date(event.start).getMonth() === currentMonth &&
        new Date(event.start).getFullYear() === currentYear
    );
  };

  return (
    <div className={`calendar ${className}`}>
      <div className="calendar-header">
        {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day) => (
          <div key={day} className="calendar-header-day">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-body">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`calendar-day ${day === currentDate ? 'calendar-day-current' : ''}`}
                onClick={() => onDayClick(new Date(currentYear, currentMonth, day))}
              >
                <div className="calendar-day-number">{day}</div>
                <div className="calendar-events">
                  {getEventsForDay(day).map((event) => (
                    <div
                      key={event.id}
                      className="calendar-event"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onDayClick
                        onEventClick(event);
                      }}
                      style={{ backgroundColor: event.color || '#cccccc' }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
