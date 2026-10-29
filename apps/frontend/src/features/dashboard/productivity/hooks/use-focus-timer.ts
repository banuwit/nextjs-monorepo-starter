"use client";

import { useEffect, useReducer } from "react";

type TimerState = {
  duration: number;
  remaining: number;
  running: boolean;
  /** Minutes completed in this page session. */
  completedMinutes: number;
  sessions: number;
};

type TimerAction =
  | { type: "tick" }
  | { type: "toggle" }
  | { type: "reset" }
  | { type: "preset"; minutes: number };

function reducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "tick":
      if (!state.running) return state;
      if (state.remaining > 1) return { ...state, remaining: state.remaining - 1 };
      return {
        ...state,
        remaining: state.duration,
        running: false,
        completedMinutes: state.completedMinutes + state.duration / 60,
        sessions: state.sessions + 1,
      };
    case "toggle":
      return { ...state, running: !state.running };
    case "reset":
      return { ...state, remaining: state.duration, running: false };
    case "preset":
      return { ...state, duration: action.minutes * 60, remaining: action.minutes * 60, running: false };
  }
}

export function useFocusTimer(initialMinutes: number) {
  const [state, dispatch] = useReducer(reducer, {
    duration: initialMinutes * 60,
    remaining: initialMinutes * 60,
    running: false,
    completedMinutes: 0,
    sessions: 0,
  });

  useEffect(() => {
    if (!state.running) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(timer);
  }, [state.running]);

  return { ...state, dispatch };
}
