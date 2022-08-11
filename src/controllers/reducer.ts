import { StatHelpText } from "@chakra-ui/react";
import { CustomError, DiscriminateUnion } from "../Types";
import { cloneDeep } from "lodash";
import { setTokenInStorage } from "./tokenTools";
import { CourseResponse } from "@backend/http/routes/courses/postCourse";
import { AssignmentResponse } from "@backend/services/curveGrades";
import { StudentResponse } from "@backend/http/routes/students/studentsRoute";
import { NewToken } from "@backend/http/routes/authentication/generateToken";

type AppReducerFunction = {
  [key in ActionTypes]: (
    state: State,
    { payload }: { payload: DiscriminateUnion<Action, "type", key>["payload"] }
  ) => State;
};

const appReducerFunctions: AppReducerFunction = {
  error: (state: State, { payload }: { payload: CustomError }) => {
    return { ...state, error: payload };
  },
  setUserCourses: (
    state: State,
    { payload }: { payload: CourseResponse[] }
  ) => {
    return { ...state, userCourses: payload };
  },
  setUserAssignments: (
    state: State,
    { payload }: { payload: AssignmentResponse[] }
  ) => {
    return { ...state, userAssignments: payload };
  },
  setUserStudents: (
    state: State,
    { payload }: { payload: StudentResponse[] }
  ) => {
    return { ...state, userStudents: payload };
  },
  initialize: (
    state: State,
    { payload }: { payload: Omit<State, "token"> }
  ) => {
    const newState = { token: state.token, ...payload } as State;
    return newState;
  },
  setWindowWidth: (state: State, { payload }: { payload: number }) => {
    return { ...state, windowWidth: payload };
  },
  setInitializing: (state: State, { payload }: { payload: boolean }) => {
    return { ...state, initializing: payload };
  },
  setUserGoogleRequiredScopes: (
    state: State,
    { payload }: { payload: boolean }
  ) => {
    return { ...state, userGoogleRequiredScopes: payload };
  },
  setToken: (state: State, { payload }: { payload: NewToken | null }) => {
    setTokenInStorage(payload);
    return { ...state, token: payload };
  },
  setInitialized: (state: State, { payload }: { payload: boolean }) => {
    return { ...state, initialized: payload };
  },
  logout: (state: State, { payload }: { payload: State }) => {
    setTokenInStorage(null);
    return cloneDeep(payload);
  },
  setAuthenticated: (state: State, { payload }: { payload: boolean }) => {
    return { ...state, authenticated: payload };
  },
  setIsNewUser: (state: State, {payload}: {payload: boolean}) => {
    return {...state, isNewUser: payload}
  }
};

export type State = {
  //   isLoading: boolean;
  error: CustomError;
  userCourses: CourseResponse[];
  userStudents: StudentResponse[];
  userAssignments: AssignmentResponse[];
  userGoogleRequiredScopes: boolean;
  initializing: boolean;
  initialized: boolean;
  email: string;
  windowWidth: number;
  token: NewToken | null;
  authenticated: boolean;
  isLoggedInWithGoogle: boolean;
  isNewUser: boolean;
};

// need some sort of conditional type, in which you set the {type: K, extraProps: depending on K} to use with dispatch function...
// https://dev.to/sanderdebr/flawless-react-state-management-usereducer-and-context-api-1a7g

export type Action =
  | {
      type: "error";
      payload: CustomError;
    }
  | { type: "setUserCourses"; payload: CourseResponse[] }
  | { type: "setUserStudents"; payload: StudentResponse[] }
  | { type: "initialize"; payload: Omit<State, "token"> }
  | { type: "setUserAssignments"; payload: AssignmentResponse[] }
  | { type: "setWindowWidth"; payload: number }
  | { type: "setInitializing"; payload: boolean }
  | { type: "setInitialized"; payload: boolean }
  | { type: "setUserGoogleRequiredScopes"; payload: boolean }
  | { type: "setToken"; payload: NewToken | null }
  | { type: "logout"; payload: State }
  | { type: "setAuthenticated"; payload: boolean }
  | {
      type: "setIsNewUser";
      payload: boolean;
    };
type ActionTypes = Action["type"];

export function appReducer(state: State, action: Action) {
  return appReducerFunctions[action.type](state, action as any);
}
