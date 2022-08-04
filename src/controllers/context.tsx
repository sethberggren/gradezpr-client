import { createContext, useContext, useReducer } from "react";
import { JsxEmit } from "typescript";
import { getTokenFromStorage } from "./tokenTools";
import { appReducer, State, Action } from "./reducer";
import { getTimeDifference } from "../App";
import { NewToken } from "@backend/http/routes/authentication/generateToken";
import { CourseResponse } from "@backend/http/routes/courses/postCourse";
import { StudentResponse } from "@backend/http/routes/students/studentsRoute";
import { AssignmentResponse } from "@backend/services/curveGrades";


const isAuthenticated =
  getTokenFromStorage() !== null &&
  getTokenFromStorage() !== undefined &&
  getTimeDifference(
    new Date((getTokenFromStorage() as NewToken).expiresAt),
    new Date()
  ) > 0;

export const appContextInitialState: State = {
  error: { type: "", message: "" },
  userCourses: [{ id: 1, subject: "Mastering the Force" }] as CourseResponse[],
  userStudents: [] as StudentResponse[],
  userAssignments: [] as AssignmentResponse[],
  userGoogleRequiredScopes: false,
  initializing: false,
  initialized: false,
  email: "",
  windowWidth: window.innerWidth,
  token: getTokenFromStorage(),
  authenticated: isAuthenticated,
};

const AppStateContext = createContext(appContextInitialState);
const AppDispatchContext = createContext({} as React.Dispatch<Action>);

export const useAppStateContext = () => useContext(AppStateContext);

export const useDispatchContext = () => useContext(AppDispatchContext);

export function AppContextProvider(props: {
  children?: JSX.Element | JSX.Element[];
}) {
  const { children } = props;

  const [state, dispatch] = useReducer(appReducer, appContextInitialState);

  if ((window as any).Cypress) {
    (window as any).dispatch = dispatch;
  }

  if (!children) {
    return null;
  }

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}
