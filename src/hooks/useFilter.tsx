import { useState } from "react";
import { NumberOrStringObj } from "../Types";

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export default function useFilter<T extends NumberOrStringObj>(initial: T[]) {
  const [filtered, setFiltered] = useState(initial);

  const filter = <K extends keyof T>(property: K, value: PropType<T, K>) => {
    const newFiltered = initial.filter((val) => val[property] === value);

    setFiltered([...newFiltered]);
  };

  const clearFilter = () => {
    setFiltered(initial);
  };

  return { filtered, filter, clearFilter };
}
