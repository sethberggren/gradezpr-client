import { useEffect, useRef } from "react";
import "./App.css";
import Import from "./import/Import";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faFileImport,
  faGraduationCap,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { intialize, updateWindowWidth } from "./controllers/actions";
import { useAppStateContext, useDispatchContext } from "./controllers/context";
import Account from "./settings/Account";
import ManageStudents from "./settings/manage-students/ManageStudents";
import ManageCourses from "./settings/ManageCourses";
import useError from "./hooks/useError";
import useBoolean from "./hooks/useBoolean";
import AppRoutes from "./AppRoutes";
import { routes } from "./routes";
import Initalizing from "./welcome/Initializing";
import Logout from "./welcome/Logout";
import { BrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { auth } from "google-auth-library";
import { Authentication, TokenTimeoutState } from "./Types";
import { getMenuItems, getSettingsMenuItems } from "./getMenuItems";
import { BASENAME } from "./envVars";

const initializingScreen = true;

export function getTimeDifference(future: Date, past: Date) {
  return future.getTime() - past.getTime();
}

function App() {
  // CONTEXT AND DISPATCH
  const dispatch = useDispatchContext();
  const { initializing, token, initialized, authenticated } =
    useAppStateContext();

  const appStateContext = useAppStateContext();

  // STATE
  const authenticatedState: Authentication = {
    authenticated: authenticated,
    setAuthenticatedTrue: () =>
      dispatch({ type: "setAuthenticated", payload: true }),
    setAuthenticatedFalse: () =>
      dispatch({ type: "setAuthenticated", payload: true }),
  };

  const [tokenTimeout, { on: tokenTimeoutOn, off: tokenTimeoutOff }] =
    useBoolean(false);

  const timer = useRef(0);

  const tokenTimeoutState: TokenTimeoutState = {
    tokenTimeout: tokenTimeout,
    tokenTimeoutOn: tokenTimeoutOn,
    tokenTimeoutOff: tokenTimeoutOff,
  };

  // EFFECTS

  useEffect(() => {
    const initalizeApp = async () => {
      await intialize(token, dispatch);
    };

    if (authenticated && !initialized) {
      initalizeApp();
    } else {
      return;
    }
  }, [authenticated, initialized]);

  useEffect(() => {
    tokenTimeoutOff();
    // effect to handle whether or not the token has timed out.
    if (token !== null) {
      // clear old timeout

      window.clearTimeout(timer.current);

      const expiryTime = new Date(token.expiresAt);

      const difference = getTimeDifference(expiryTime, new Date());

      // if difference is less than zero, the token has expired.  Show logout screen.
      if (difference < 0) {
        tokenTimeoutOn();
      }

      timer.current = window.setTimeout(() => {
        tokenTimeoutOn();
        dispatch({ type: "setAuthenticated", payload: false });
      }, difference);
    }

    return () => window.clearTimeout(timer.current);
  }, [token]);

  useEffect(() => {
    // effect to handle whether or not the token has timed out, on the app's initial render.
    tokenTimeoutOff();
    if (token !== null) {
      const expiryTime = new Date(token.expiresAt);

      const difference = getTimeDifference(expiryTime, new Date());

      // if difference is less than zero, the token has expired.  Show logout screen.
      if (difference < 0) {
        tokenTimeoutOn();
      }

      timer.current = window.setTimeout(() => {
        tokenTimeoutOn();
        dispatch({ type: "setAuthenticated", payload: false });
      }, difference);
    }

    return () => window.clearTimeout(timer.current);
  }, []);


  useEffect(() => {
    // effect to handle responsive elements
    window.addEventListener("resize", () => updateWindowWidth(dispatch));

    return window.removeEventListener("resize", () =>
      updateWindowWidth(dispatch)
    );
  }, []);

  // JSX VARIABLES

  const withInitializingScreen = initializing ? (
    <BrowserRouter>
      <Initalizing />
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <AppRoutes
        authenticatedState={authenticatedState}
        tokenTimeoutState={tokenTimeoutState}
        menuItems={getMenuItems()}
        settingsMenuItems={getSettingsMenuItems(
          tokenTimeoutState,
          authenticatedState
        )}
      />
    </BrowserRouter>
  );

  const withoutInitializingScreen = (
    <BrowserRouter>
      {" "}
      <AppRoutes
        authenticatedState={authenticatedState}
        tokenTimeoutState={tokenTimeoutState}
        menuItems={getMenuItems()}
        settingsMenuItems={getSettingsMenuItems(
          tokenTimeoutState,
          authenticatedState
        )}
      />
    </BrowserRouter>
  );

  return initializingScreen
    ? withInitializingScreen
    : withoutInitializingScreen;
}

export default App;