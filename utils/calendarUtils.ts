import { F1Race } from "../types";

const formatDateToICS = (dateStr: string, timeStr: string, durationMinutes: number = 120): { start: string, end: string } => {
  // Combine date and time, assume UTC ('Z')
  const dateTimeString = `${dateStr}T${timeStr}Z`;
  const startDate = new Date(dateTimeString);
  
  if (isNaN(startDate.getTime())) {
      // Fallback if format fails
      const now = new Date();
      return {
          start: now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
          end: new Date(now.getTime() + 7200000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      }
  }

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return {
    start: format(startDate),
    end: format(endDate)
  };
};

export const generateICSFile = (race: F1Race): string => {
  const { start, end } = formatDateToICS(race.date, race.time);
  
  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//F1 Calendar Sync//EN',
    'BEGIN:VEVENT',
    `UID:${race.round}-${race.date}@f1sync.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:F1 ${race.grandPrixName} - ${race.city}`,
    `DESCRIPTION:Formula 1 Race at ${race.circuitName}. ${race.description}`,
    `LOCATION:${race.circuitName}, ${race.city}, ${race.country}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
};

export const downloadICS = (race: F1Race) => {
  const url = generateICSFile(race);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `f1-round-${race.round}-${race.city}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDisplayDate = (dateStr: string, timeStr: string) => {
    try {
        const date = new Date(`${dateStr}T${timeStr}Z`);
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    } catch (e) {
        return `${dateStr} ${timeStr} UTC`;
    }
}

export const formatTimeIST = (dateStr: string, timeStr: string): string => {
  try {
    const date = new Date(`${dateStr}T${timeStr}Z`);
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
      hour12: true
    }).format(date);
  } catch (e) {
    return 'TBA';
  }
};

export const formatTimeLocal = (dateStr: string, timeStr: string, timezoneId: string): string => {
  try {
    const date = new Date(`${dateStr}T${timeStr}Z`);
    // Fallback to UTC if timezone is invalid
    const tz = timezoneId && timezoneId !== '' ? timezoneId : 'UTC';
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: tz,
      hour12: true
    }).format(date);
  } catch (e) {
    return 'TBA';
  }
};

export const formatWeekendRange = (startStr: string, endStr: string): string => {
  try {
    // startStr: YYYY-MM-DD
    const start = new Date(startStr);
    const end = new Date(endStr);
    const startMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start);
    const endMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(end);
    const startDay = start.getDate();
    const endDay = end.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  } catch (e) {
    return `${startStr} - ${endStr}`;
  }
}