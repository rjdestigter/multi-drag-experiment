import { Appointment } from "../data/events";
import { Send } from "../hooks/useStateMachine";

const data = {
  selected: [],
  dragPosition: {
    x: 0,
    y: 0,
  },
};

const addSelectedAppointment = updateData((data, { event }) => {
  return {
    selected: data.selected.concat((event as unknown as Appointment).id),
  };
});

const resetSelected = updateData(() => ({ selected: [] }));

function subscribeToMouseMove(send: Send) {
  const onMouseMove = (e: MouseEvent) => {
    send({ type: "mouseMove", y: e.pageY, x: e.pageX });
  };

  addEventListener("mousemove", onMouseMove);

  return () => {
    removeEventListener("mousemove", onMouseMove);
  };
}

const raceBetweenMoveAndUp = (send: Send) => {
  const onMouseMove = (e: MouseEvent) => {
    send({ type: "mouseMove" });
  };

  const onMouseUp = (e: MouseEvent) => {
    send({ type: "mouseUp" });
  };

  addEventListener("mouseup", onMouseUp, { once: true });

  const timeout = setTimeout(() => {
    addEventListener("mousemove", onMouseMove, { once: true });
  }, 50);

  return () => {
    clearTimeout(timeout);
    removeEventListener("mousemove", onMouseMove);
    removeEventListener("mouseup", onMouseUp);
  };
};

function preventTextSelection() {
  window.getSelection()?.removeAllRanges();
}

const eventIsNotSelected = (context: StateData, { event }: StateEvent) => {
  console.log("eventIsNotSelected", context, event);
  console.log(
    `[${context.selected.join(", ")}].includes(${
      (event as unknown as Appointment).id
    })`
  );
  return !context.selected.includes((event as unknown as Appointment).id);
};

const deselectMostRecentSelection = updateData(({ selected }) => {
  return {
    selected: selected.slice(0, -1),
  };
});

const trackMousePosition = updateData((_, { x, y }) => {
  if (typeof x !== "number" || typeof y !== "number") return _;

  return {
    dragPosition: {
      x,
      y,
    },
  };
});

const waitForSelectionToBeReleased = (send: Send) => {
  const onMouseDown = (e: MouseEvent) => {
    send({ type: "mouseDown" });
  };

  addEventListener("mousedown", onMouseDown, { once: true });

  return () => {
    removeEventListener("mousedown", onMouseDown);
  };
};

export const statechart: StateChart = {
  data,
  initial: "idle",
  states: {
    // Idle state, nothing is happening
    idle: {
      entry: [resetSelected],
      on: {
        mouseDownOnEvent: {
          target: "mouseIsDown",
          actions: [addSelectedAppointment],
        },
      },
    },

    // Mouse down click on an event
    mouseIsDown: {
      invoke: [raceBetweenMoveAndUp],
      on: {
        // Mouse was released quickly, probably a click
        mouseUp: "idle",
        mouseMove: {
          target: "dragging",
          actions: [preventTextSelection],
        },
      },
    },

    // Dragging one or more selected events
    dragging: {
      on: {
        mouseDown: "idle",
        mouseDownOnEvent: {
          target: "mouseIsDownWhileDragging",
          actions: [addSelectedAppointment],
          cond: eventIsNotSelected,
        },
        mouseMove: {
          actions: [trackMousePosition],
        },
      },
      invoke: [waitForSelectionToBeReleased, subscribeToMouseMove],
    },

    // Mouse down click on an event while already dragging a selected event
    mouseIsDownWhileDragging: {
      invoke: [raceBetweenMoveAndUp],
      on: {
        mouseUp: {
          target: "dragging",
          actions: [deselectMostRecentSelection],
        },
        mouseMove: {
          target: "dragging",
          actions: [preventTextSelection],
        },
      },
    },
  },
};

function updateData(
  cb: (context: StateData, event: StateEvent) => Partial<StateData>
) {
  return {
    kind: "updateData",
    cb,
  } as const;
}

export type StateChart = {
  initial: string;
  data: {
    selected: Appointment["id"][];
    dragPosition: {
      x: number;
      y: number;
    };
  };
  states: {
    [state: string]: State;
  };
};

export type Action = {
  kind: "updateData";
  cb: (context: StateData, event: StateEvent) => Partial<StateData>;
};

export type ActionFn = (context: StateData, event: StateEvent) => void;

export type On = {
  target?: string;
  actions?: Array<Action | ActionFn>;
  cond?: (context: StateData, event: StateEvent) => boolean;
};

export type State = {
  entry?: Array<Action | ActionFn>;
  on?: Record<string, string | On>;
  after?: {
    [ms: number]: string;
  };
  invoke?: Invoke[];
};

export type Invoke = (send: Send, event: StateEvent) => () => void;

export type StateData = StateChart["data"];

export type StateEvent = { type: string } & Record<string, unknown>;

export type DataUpdater = (
  context: StateData,
  event: StateEvent
) => Partial<StateData>;
