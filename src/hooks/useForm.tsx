import React, { useState } from "react";
import useFormComplete from "./useFormCompleted";

export type StringOnlyFormData = {
  [key: string]: string;
};

const newFieldNaNError = "Error!  Cannot parse event target to number.";
const fallthroughCaseError =
  "Error!  Cannot pass any value other than string or number to useForm hook.";

export default function useForm<K extends StringOnlyFormData>(initial: K) {
  const [state, setState] = useState(initial);

  const update = (
    field: keyof K,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (typeof state[field] === "string") {
      const newState = { ...state };
      const newField = event.target.value;

      newState[field] = newField as K[keyof K];

      setState(newState);
      // } else if (typeof state[field] === "number") {
      //   const newState = { ...state };
      //   const newField = parseInt(event.target.value);

      //   if (isNaN(newField)) {
      //     throw new Error(newFieldNaNError);
      //   }

      //   newState[field] = newField as K[keyof K];

      //   setState(newState);
    } else {
      throw new Error(fallthroughCaseError);
    }
  };

  const isComplete = useFormComplete(state);

  return [state, update, isComplete] as const;
}
