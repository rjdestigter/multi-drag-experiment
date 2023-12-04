import { useEffect, useRef, useState } from "react";
import { Invoke, On, StateEvent, statechart } from "../state/statechart";

export function useStateMachine() {
  // What state are we in
  const [stateValue, setStateValue] = useState(statechart.initial);

  // Contextual data
  const [data, setData] = useState(statechart.data);

  const ref = useRef({
    // Last event causing a state transition
    event: { type: "" },
    // Current state
    value: stateValue,
    // Clean up functions for invoked services
    invokees: [] as Array<() => void>,
  });

  const { after, invoke, entry } = statechart.states[ref.current.value];

  // Dispatch an event to the state machine
  const send: Send = (event) => {
    // Event configuration for the current state
    const on = statechart.states[ref.current.value].on?.[event.type];
    const config: Exclude<On, string> =
      typeof on === "string" ? { target: on } : on || {};

    // Where should we go next
    const target = config.target || ref.current.value;

    // Return early if a condition is not met
    if (config.cond?.(data, event) === false) return;

    // Clean up invoked services if we're transitioning
    if (target !== ref.current.value) {
      while (ref.current.invokees.length) {
        ref.current.invokees.pop()?.();
      }
    }

    ref.current.event = event;
    ref.current.value = target;
    setStateValue(target);

    // Perform event side effects if any
    config.actions?.forEach((action) => {
      if (typeof action === "function") {
        action(data, event);
        // Special side effect for updating data state
      } else if (action.kind === "updateData") {
        setData((data) => {
          return {
            ...data,
            ...action.cb(data, event),
          };
        });
      }
    });
  };

  // Execute action after ms if configured for state
  useEffect(() => {
    if (after) {
      const timeouts = Object.keys(after).map((ms) => {
        const nextState = after[+ms];

        const timeout = setTimeout(() => {
          setStateValue(nextState);
        }, +ms);

        return timeout;
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [after]);

  // Invoke services if configured for state
  useEffect(() => {
    if (invoke) {
      ref.current.invokees = invoke.map((fn) => fn(send, ref.current.event));
    }
  }, [invoke]);

  // Perform entry actions if configured for state
  useEffect(() => {
    entry?.forEach((action) => {
      if (typeof action === "function") {
        action(data, ref.current.event);
      } else if (action.kind === "updateData") {
        setData((data) => {
          return {
            ...data,
            ...action.cb(data, ref.current.event),
          };
        });
      }
    });
  }, [entry]);

  return [stateValue, send, data, setData] as const;
}

export type Send = (event: StateEvent) => void;
