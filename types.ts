export interface F1Race {
  round: number;
  grandPrixName: string;
  circuitName: string;
  city: string;
  country: string;
  date: string; // ISO 8601 UTC date string for the MAIN RACE
  time: string; // UTC time string (HH:mm:ss) for the MAIN RACE
  trackImageUrl: string;
  homeRaceFor: string[];
  description: string;
  timezoneId: string; // IANA timezone ID (e.g. "Europe/London")
  isSprintWeekend: boolean;
  weekendStartDate: string; // YYYY-MM-DD (Friday)
  weekendEndDate: string; // YYYY-MM-DD (Sunday)
}

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export interface Driver {
  name: string;
  number: number;
}

export interface Team {
  name: string;
  country: string;
  drivers: Driver[];
  engine: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}