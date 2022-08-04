import React from "react";

export default function useTextInput(initial: string) {
  const [current, setCurrent] = React.useState(initial);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(e.target.value);
  };

  return [current, changeHandler] as [
    string,
    (e: React.ChangeEvent<HTMLInputElement>) => void
  ];
}
