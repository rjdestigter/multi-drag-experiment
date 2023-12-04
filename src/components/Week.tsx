import { addDays, isWeekend, startOfWeek } from "date-fns";
import React, { useContext, useState, ReactElement, useEffect } from "react";
import { useCalendarContext, useStartOfWeek } from "../context/CalendarContext";
import { Day } from "./Day";

const lengthSeven: never[] = Array.from({ length: 7 });

export function Week({ date }: { date: Date }) {
  const start = startOfWeek(date, { weekStartsOn: useStartOfWeek() });
  const { hideWeekends } = useCalendarContext();

  const days = lengthSeven.reduce(
    (elements, __, i) => {
      const day = addDays(start, i);

      if (!hideWeekends || (hideWeekends && !isWeekend(day))) {
        elements.push(<Day key={day.getTime()} date={day} />);
      }

      return elements;
    },
    [] as ReactElement<{ date: Date }>[]
  );

  return (
    <div
      role="row"
      // grid with even columsn
      className={`flex-1 grid grid-col-7 ${
        hideWeekends ? "grid-cols-5" : "grid-cols-7"
      } gap-px`}
    >
      {days}
    </div>
  );
}
