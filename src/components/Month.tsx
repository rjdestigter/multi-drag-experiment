import {
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useCalendarContext } from "../context/CalendarContext";
import { Week } from "./Week";

export function Month({ date }: { date: Date }) {
  const { weekStartsOn } = useCalendarContext();
  const start = startOfWeek(startOfMonth(date), { weekStartsOn });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn });
  const weeks = eachWeekOfInterval(
    { start, end },
    { weekStartsOn: weekStartsOn }
  );

  const rows = weeks.map((week) => <Week key={week.getTime()} date={week} />);

  return (
    <div
      role="grid"
      className="flex flex-col h-full bg-gray-200 gap-px border border-gray-200"
    >
      {rows}
    </div>
  );
}
