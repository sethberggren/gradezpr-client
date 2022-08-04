import { useState } from "react";
import { sortNumOrStringObj } from "../services/helperFunctions";
import { NumberOrStringObj } from "../Types";

export default function useSort<T extends NumberOrStringObj>(initial: T[]) {
  const [sortedState, setSortedState] = useState(initial);

  const sortAsc = (property: keyof T) => {
    const newSortedState = sortNumOrStringObj(
      sortedState,
      property,
      "ascending"
    );
    setSortedState(newSortedState);
  };

  const sortDesc = (property: keyof T) => {
    const newSortedState = sortNumOrStringObj(
      sortedState,
      property,
      "descending"
    );
    setSortedState(newSortedState);
  };

  return { sortedState, sortAsc, sortDesc };
}
