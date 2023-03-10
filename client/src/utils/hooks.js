import { useState, useEffect } from "react";

// custom hook to handle state management AND local storage persistence
// `key` is the string key used to store the value in local storage
// `initialValue` is the initial value to use if nothing found in local storage.
// update the value in local storage whenever state changes
// returns an array containing the current state value and the setState function.
export const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {

    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};