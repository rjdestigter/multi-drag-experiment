import React, { useEffect } from "react";
import { useStateCtx } from "../context/StateContext";

export function Draggable({ children }: { children: React.ReactNode }) {
  const { context, send } = useStateCtx();
  const { x: left, y: top } = context.dragPosition;

  const events = React.Children.toArray(children);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        pointerEvents: "none",
      }}
    >
      {events.reverse().map((event, i) => {
        return (
          <div
            style={{
              position: "absolute",
              zIndex: i,
              top: (events.length - i) * 5,
              left: (events.length - i) * -5,
              border: "1px solid red",
            }}
          >
            {event}
          </div>
        );
      })}
    </div>
  );
}
