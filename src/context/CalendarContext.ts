import { createContext, useContext } from "react";

interface CalendarContextValue {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  hideWeekends: boolean;
}

export const CalendarContext = createContext<CalendarContextValue>({
  weekStartsOn: 0,
  hideWeekends: false,
});

export function useCalendarContext() {
  return useContext(CalendarContext);
}

export function useStartOfWeek() {
  const { weekStartsOn, hideWeekends } = useCalendarContext();
  const weekStartsOnWeekend = hideWeekends && [0, 6].includes(weekStartsOn);

  return weekStartsOnWeekend ? 1 : weekStartsOn;
}
