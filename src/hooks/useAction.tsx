import React, { useEffect } from "react";
import errorHandler from "../controllers/errorHandler";
import { Action } from "../controllers/reducer";
import useBoolean from "./useBoolean";

export default function useAction<T>(action: () => Promise<T> | void, dispatch: React.Dispatch<Action>) {
  const [loading, { on: setLoadingTrue, off: setLoadingFalse }] =
    useBoolean(false);

  useEffect(() => {
    const fetchData = async () => {
      // should implement a way to handle errors in a graceful manner...

      console.log("Starting to load...");
      setLoadingTrue();

      await errorHandler(action, dispatch);

      setLoadingFalse();
      console.log("Finished loading!");
    };

    if (loading) {
      fetchData();
    } else {
      return;
    }
  }, [loading]);

  return { loading, setLoadingTrue, setLoadingFalse };
}
