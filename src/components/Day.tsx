import React, { useState } from "react";
import { useStateCtx } from "../context/StateContext";
import { events } from "../data/events";
import { format, isSameDay } from "date-fns";
import { CalendarEvent } from "./CalendarEvent";

export function Day({ date }: { date: Date }) {
  const { state } = useStateCtx();
  const [draggingOver, setDraggingOver] = useState(false);
  const event = events.find((event) => isSameDay(event.start, date));

  //   const event =
  //     draggingOver || date.getDate() === 13 ? (
  //       <SampleEvent dragged={draggingOver} />
  //     ) : null;

  return (
    <div
      role="gridcell"
      className="bg-white hover:bg-gray-100 py-2"
      aria-label={format(date, "EEE MMM dd yyyy")}
      onMouseEnter={() => {
        state === "dragging" && setDraggingOver(true);
      }}
      onMouseLeave={() => {
        state === "dragging" && setDraggingOver(false);
      }}
    >
      <div className="text-center">{format(date, "dd")}</div>
      {event && <CalendarEvent event={event} />}
    </div>
  );
}
