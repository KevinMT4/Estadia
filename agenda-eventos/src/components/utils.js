// utils.js
export const generateCalendar = (year, month) => {
    const weeks = [];
    let currentDate = new Date(year, month, 1);
    const firstDayOfMonth = currentDate.getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  
    let week = new Array(7).fill(null);
    let currentDay = 1;
  
    // Fill in the first week
    for (let i = firstDayOfMonth; i < 7; i++) {
      week[i] = currentDay++;
    }
    weeks.push(week);
  
    // Fill in the remaining weeks
    while (currentDay <= lastDayOfMonth) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && currentDay <= lastDayOfMonth; i++) {
        week[i] = currentDay++;
      }
      weeks.push(week);
    }
  
    return weeks;
  };
  