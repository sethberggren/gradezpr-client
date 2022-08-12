import { ObjectTyped } from "object-typed";
import { useState } from "react";

type BoolObj = {
  [key: string]: boolean;
};

type BoolObjSetState<K> = (key: keyof K) => void;

export default function useBooleanObject<K extends BoolObj>(initial: K) {
  const [boolObj, setBoolObj] = useState(initial);

  // change this to useCallback?  Chakra UI's implementation uses this.

  const on = (key: keyof K) => {
    const newState = { ...boolObj };
    newState[key] = true as K[keyof K];
    setBoolObj(newState);
  };

  const off = (key: keyof K) => {
    const newState = { ...boolObj };
    newState[key] = false as K[keyof K];
    setBoolObj(newState);
  };

  const toggle = (key: keyof K) => {
    const newState = { ...boolObj };
    newState[key] = !newState[key] as K[keyof K];
    setBoolObj(newState);
  };

  const allOn = () => {
    const newState = { ...boolObj };

    for (const key of ObjectTyped.keys(newState)) {
      newState[key] = true as K[keyof K];
    }

    setBoolObj(newState);
  };

  const allOff = () => {
    const newState = { ...boolObj };

    for (const key of ObjectTyped.keys(newState)) {
      newState[key] = false as K[keyof K];
    }

    setBoolObj(newState);
  };

  return [boolObj, { on, off, toggle, allOn, allOff }] as const;
}
