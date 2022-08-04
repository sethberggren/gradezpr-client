import { useState } from "react";
import { sortNumOrStringObj } from "../services/helperFunctions";
import { NumberOrStringObj } from "../Types";
import useFilter from "./useFilter";

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export default function useSortAndFilter<T extends NumberOrStringObj>(initial: T[]) {
  const [filtered, setFiltered] = useState(initial);

  const sortAsc = (property: keyof T) => {
    const newSorted = sortNumOrStringObj(filtered, property, "ascending");
    setFiltered(newSorted);
  };

  const sortDesc = (property: keyof T) => {
    const newSorted = sortNumOrStringObj(filtered, property, "descending");
    setFiltered(newSorted);
  };

  const filter = <K extends keyof T>(property: K, value: PropType<T, K>) => {
    const newFiltered = initial.filter((val) => val[property] === value);

    setFiltered([...newFiltered]);
  };

  const clearFilter = () => {
    setFiltered(initial);
  };

  return { filtered, sortAsc, sortDesc, filter, clearFilter, setFiltered };
}
