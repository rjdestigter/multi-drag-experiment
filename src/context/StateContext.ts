import { createContext, useContext } from "react";
import { Send } from "../hooks/useStateMachine";
import { StateChart } from "../state/statechart";

export const StateContext = createContext<TStateContext>({
  state: "noop",
  send: () => undefined,
  context: {
    selected: [],
    dragPosition: {
      x: 0,
      y: 0,
    },
  },
});

type TStateContext = {
  state: string;
  send: Send;
  context: StateChart["data"];
};

export function useStateCtx() {
  return useContext(StateContext);
}
