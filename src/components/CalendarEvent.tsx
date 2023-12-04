import React from "react";
import { events } from "../data/events";
import { useStateCtx } from "../context/StateContext";
import { format } from "date-fns";

export function CalendarEvent({
  event,
  dragged,
}: {
  dragged?: true;
  event: (typeof events)[0];
}) {
  const { send, context } = useStateCtx();
  const isSelected = context.selected.includes(event.id);

  return (
    <div
      className={`flex flex-col p-2 bg-red-200 $${dragged ? "m-2" : ""}`}
      data-event-id={event.id}
      onMouseDown={() => send({ type: "mouseDownOnEvent", event })}
    >
      <div
        title={`${format(event.start, "HH:mm")} - ${format(
          event.end,
          "HH:mm"
        )}`}
        style={{
          opacity: !dragged && isSelected ? 0.3 : 1,
        }}
        className="text-xs whitespace-nowrap overflow-ellipsis overflow-hidden"
      >
        {event.title}
      </div>
    </div>
  );
}
