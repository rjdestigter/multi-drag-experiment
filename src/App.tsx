import React, { useContext, useState, ReactElement, useEffect } from "react";

import {
  eachWeekOfInterval,
  endOfWeek,
  startOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isWeekend,
  format,
  isSameDay,
} from "date-fns";
import { CalendarContext } from "./context/CalendarContext";
import { StateContext } from "./context/StateContext";
import { useStateMachine } from "./hooks/useStateMachine";
import { Month } from "./components/Month";
import { eventsById } from "./data/events";
import { CalendarEvent } from "./components/CalendarEvent";
import { Draggable } from "./components/Draggable";

export const App = () => {
  const [date, setDate] = useState(today());
  const [state, send, context] = useStateMachine();

  return (
    <CalendarContext.Provider value={{ weekStartsOn: 1, hideWeekends: false }}>
      <StateContext.Provider
        value={{
          state,
          context,
          send,
        }}
      >
        State: {state}
        <div className="p-2 h-full">
          <Month date={date} />
        </div>
        {context.selected.length > 0 && (
          <Draggable>
            {context.selected.map((id) => {
              return <CalendarEvent event={eventsById[id]} dragged />;
            })}
          </Draggable>
        )}
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </StateContext.Provider>
    </CalendarContext.Provider>
  );
};

function today() {
  return startOfDay(new Date());
}
