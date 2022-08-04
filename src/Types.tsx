export type CustomError = {
  type: string,
  message: string
};

export type NumberOrStringObj = {
  [key: string]: number | string;
};

export type AscendingOrDescending = "ascending" | "descending";

export type Authentication = {
  authenticated: boolean;
  setAuthenticatedTrue: () => void;
  setAuthenticatedFalse: () => void;
};

export type TokenTimeoutState = {
  tokenTimeout: boolean;
  tokenTimeoutOn: () => void;
  tokenTimeoutOff: () => void;
};

export type DiscriminateUnion<
  T,
  K extends keyof T,
  V extends T[K]
> = Extract<T, Record<K, V>>;

export type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> =
  { [V in T[K]]: DiscriminateUnion<T, K, V> };