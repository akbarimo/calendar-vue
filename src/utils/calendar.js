import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

export const generateCalendarDates = (month = dayjs().month(), year = dayjs().year()) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf('month');
  const firstDayOfWeek = firstDateOfMonth.day();

  const calendarDates = [...Array(42)].map((_, i) => {
    const currentDate = firstDateOfMonth.add(i - firstDayOfWeek, 'day');
    const isCurrentMonth = currentDate.isSame(firstDateOfMonth, 'month');
    return {
      date: currentDate,
      ...(isCurrentMonth && { currentMonth: true }),
      ...(isCurrentMonth && currentDate.isSame(dayjs(), 'date') && { today: true }),
    };
  });

  return calendarDates;
};

export const months = dayjs.months();

export const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
