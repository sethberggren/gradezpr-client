import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import backendUrl from "../services/backendUrl";

import { RegisterForm } from "../welcome/Register";
import { CodeResponse, CredentialResponse } from "@react-oauth/google";
import { apiRoutes } from "../routes";
import { Action } from "./reducer";
import React from "react";
import { AlertDialog } from "@chakra-ui/react";
import { createCredentialError, createError } from "./actions";
import errorHandler from "./errorHandler";

import { NewToken } from "@backend/http/routes/authentication/generateToken";

export function tokenHeader(token: NewToken) {
  console.log(token.token);
  return {
    headers: {
      "x-access-token": token.token,
    },
  };
}

export function setTokenFromResponseHeader(
  res: AxiosResponse<any, any>,
  dispatch: React.Dispatch<Action>
) {
  if (res === undefined) {
    return;
  }

  const tokenHeader = res.headers["x-access-token"];

  if (tokenHeader) {
    const tokenHeaderJson = JSON.parse(tokenHeader) as NewToken;
    dispatch({ type: "setToken", payload: tokenHeaderJson });

    console.log("The token has been refreshed!");
  } else {
    createCredentialError(dispatch);
  }
}

type HTTPMethods =
  | {
      type: "PUT";
      payload: object;
    }
  | { type: "GET" }
  | { type: "DELETE" }
  | { type: "POST"; payload: object }
  | { type: "PATCH"; payload: object };

export async function apiCall<K extends unknown>(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  httpMethod: HTTPMethods,
  url: string,
  returnData: true
): Promise<K | undefined>;
export async function apiCall<K extends unknown>(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  httpMethod: HTTPMethods,
  url: string
): Promise<void>;

export async function apiCall<K extends unknown>(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  httpMethod: HTTPMethods,
  url: string,
  returnData?: true
): Promise<K | void | undefined> {
  if (token === null) {
    createCredentialError(dispatch);
    return;
  }

  let response: AxiosResponse | undefined;
  const tokenToSend = tokenHeader(token);

  console.log(tokenToSend);

  const requestUrl = backendUrl(url);

  switch (httpMethod.type) {
    case "GET": {
      response = await errorHandler(
        () => axios.get(requestUrl, tokenToSend),
        dispatch
      );

      if (response === undefined) {
        return undefined;
      }

      break;
    }

    case "DELETE": {
      response = await errorHandler(
        () => axios.delete(requestUrl, tokenToSend),
        dispatch
      );

      if (response === undefined) {
        return undefined;
      }

      break;
    }

    case "POST": {
      const { payload } = httpMethod;
      response = await errorHandler(
        () => axios.post(requestUrl, payload, tokenToSend),
        dispatch
      );

      if (response === undefined) {
        return undefined;
      }

      break;
    }

    case "PUT": {
      const { payload } = httpMethod;
      response = await errorHandler(
        () => axios.put(requestUrl, payload, tokenToSend),
        dispatch
      );

      if (response === undefined) {
        return undefined;
      }
      break;
    }

    case "PATCH": {
      const { payload } = httpMethod;
      response = await errorHandler(
        () => axios.patch(requestUrl, payload, tokenToSend),
        dispatch
      );

      if (response === undefined) {
        return undefined;
      }
      break;
    }
  }

  // what happens if the axios request fails?? what happens to the token??

  setTokenFromResponseHeader(response, dispatch);

  if (returnData && response !== undefined) {
    return response.data as K;
  } else {
    return;
  }
}
