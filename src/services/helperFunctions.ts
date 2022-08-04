import { ObjectTyped } from "object-typed";
import { StringOnlyFormData } from "../hooks/useForm";
import {
  AscendingOrDescending,
  NumberOrStringObj,
} from "../Types";

export function indexByBool<T>(array: T[], bool: boolean[]) {
  if (array.length !== bool.length) {
    throw new Error("Array and boolean array must be the same length.");
  }

  const toReturn = bool
    .map((value, index) => {
      if (value) {
        return array[index];
      } else {
        return;
      }
    })
    .filter((value) => value !== undefined) as T[];

  return toReturn;
}

export function roundToNearestHundredth(num: number) {
  return Math.round(100 * num) / 100;
}

export function arrToString(arr: string[]) {
  const arrToStringReducer = (prev: string, curr: string, index: number) => {
    if (prev === "") {
      return curr;
    }

    return (curr = prev + "," + curr);
  };

  return arr.reduce(arrToStringReducer, "");
}

export function isEmpty(obj: Object | undefined) {
  if (obj === undefined) {
    return true;
  }

  return Object.keys(obj).length === 0;
}

export function formatDate(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const amOrPm = (hour: number): { hour: number; amOrPm: "a.m." | "p.m." } => {
    if (hour < 12) {
      return { hour: hour, amOrPm: "a.m." };
    } else {
      return { hour: hour - 12 !== 0 ? hour - 12 : 12, amOrPm: "p.m." };
    }
  };

  const amOrPmHour = amOrPm(hour);

  const formatted = `${amOrPmHour.hour}:${
    minute < 10 ? `0${minute}` : minute
  } ${amOrPmHour.amOrPm}, ${month}/${day}/${year}`;

  return formatted;
}

export const sortNumber = (
  num1: number,
  num2: number,
  ascOrDesc: AscendingOrDescending
) => {
  if (ascOrDesc === "ascending") {
    return num1 - num2;
  } else {
    return num2 - num1;
  }
};

export const sortString = (
  str1: string,
  str2: string,
  ascOrDesc: AscendingOrDescending
) => {
  const str1Upper = str1.toUpperCase();
  const str2Upper = str2.toUpperCase();
  if (ascOrDesc === "ascending") {
    return str1Upper < str2Upper ? -1 : str2Upper > str1Upper ? 1 : 0;
  } else {
    return str2Upper < str1Upper ? -1 : str1Upper > str2Upper ? 1 : 0;
  }
};

export const sortNumOrStringObj = <T extends NumberOrStringObj>(
  toSort: T[],
  property: keyof T,
  ascOrDesc: AscendingOrDescending
) => {
  if (typeof toSort[0][property] === "number") {
    toSort.sort((a, b) =>
      sortNumber(a[property] as number, b[property] as number, ascOrDesc)
    );
    return [...toSort];
  } else if (typeof toSort[0][property] === "string") {
    toSort.sort((a, b) =>
      sortString(a[property] as string, b[property] as string, ascOrDesc)
    );
    return [...toSort];
  } else {
    throw new Error(
      "Error, can only sort objects where the properties are numbers or strings."
    );
  }
};

export function verifyEmailString(email: string) {
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  return email.toLowerCase().match(emailRegex) !== null
};

export function strObjAllPropertiesSet<K extends StringOnlyFormData>(strObj: K): boolean {

  let set = true;

  for (const key of ObjectTyped.keys(strObj)) {
    if (strObj[key] === "") {
      set = false;
      return set;
    }
  }

  return set;
}