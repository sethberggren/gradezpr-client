import { AxiosError } from "axios";
import React from "react";
import { createError } from "./actions";
import { Action } from "./reducer";

export default async function errorHandler<K extends unknown>(
  func: (...args: any[]) => K,
  dispatch: React.Dispatch<Action>
) {
  try {
    return (await func()) as K;
  } catch (err) {
    createError(dispatch, err as AxiosError);
  }
}
