import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AppHeader from "./AppHeader";
import { BASENAME } from "./envVars";
import Login from "./welcome/Login";
import { routes } from "./routes";
import LinkWithGoogleAccount from "./welcome/LinkWithGoogleAccount";
import Register from "./welcome/Register";
import Welcome from "./welcome/Welcome";
import { Authentication, TokenTimeoutState } from "./Types";
import Logout from "./welcome/Logout";
import { TMenuItem } from "./getMenuItems";
import About from "./footerComponents/About";
import BugRequest, { BugRequestComplete } from "./footerComponents/BugRequest";
import { auth } from "google-auth-library";
import DeletedAccount from "./settings/DeletedAccount";
import CredentialError from "./CredentialError";
import useError from "./hooks/useError";
import { useAppStateContext, useDispatchContext } from "./controllers/context";
import ForgotPassword, { ResetPasswordSuccess } from "./welcome/ForgotPassword";
import PrivacyPolicy from "./privacy/PrivacyPolicy";
import PrivacyAcknowledgement from "./privacy/PrivacyAcknowledgement";

export default function AppRoutes(props: {
  authenticatedState: Authentication;
  tokenTimeoutState: TokenTimeoutState;
  menuItems: TMenuItem[];
  settingsMenuItems: TMenuItem[];
}) {
  // PROPS AND VARIABLES DERIVED FROM PROPS
  const {
    authenticatedState,
    tokenTimeoutState,
    menuItems,
    settingsMenuItems,
  } = props;

  const { tokenTimeout } = tokenTimeoutState;
  const { authenticated } = authenticatedState;

  // CONTEXT AND DISPATCH
  const { error } = useAppStateContext();
  const navigate = useNavigate();
  const dispatch = useDispatchContext();

  // EFFECTS
  useError(error, navigate, dispatch);

  // JSX VARIABLES

  const renderedMenuItems = menuItems.map((item) => (
    <Route
      path={item.route}
      element={
        <ProtectedRoute
          authenticated={authenticated}
          tokenTimeout={tokenTimeout}
        >
          <AppHeader
            menuItems={menuItems}
            settingsMenuItems={settingsMenuItems}
          >
            {item.component}
          </AppHeader>
        </ProtectedRoute>
      }
    />
  ));

  const renderedSettingsMenuItems = settingsMenuItems.map((item) => (
    <Route
      path={item.route}
      element={
        <ProtectedRoute
          authenticated={authenticated}
          tokenTimeout={tokenTimeout}
        >
          {item.route === routes.logout ? (
            item.component
          ) : (
            <AppHeader
              menuItems={menuItems}
              settingsMenuItems={settingsMenuItems}
            >
              {item.component}
            </AppHeader>
          )}
        </ProtectedRoute>
      }
    />
  ));

  // could refactor to use outlet for appheader??

  return (
    <Routes>
      <Route
        path={routes.register}
        element={<Register authentication={authenticatedState} />}
      />
      <Route
        path={"/"}
        element={!authenticated ? <Welcome /> : <NavigateToImport />}
      />
      <Route
        path={routes.login}
        element={
          !authenticated ? (
            <Login authentication={authenticatedState} />
          ) : (
            <NavigateToImport />
          )
        }
      />
      <Route path={routes.passwordReset} element={<ForgotPassword />} />
      <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />

      <Route
        path={routes.privacyPolicyAcknowledgement}
        element={
          <ProtectedRoute
            authenticated={authenticated}
            tokenTimeout={tokenTimeout}
          >
            <PrivacyAcknowledgement />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.passwordResetSuccess}
        element={<ResetPasswordSuccess />}
      />
      <Route
        path={routes.linkAccounts}
        element={<LinkWithGoogleAccount authentication={authenticatedState} />}
      />
      <Route
        path={routes.timeout}
        element={
          <Logout
            authenticatedState={authenticatedState}
            logoutOrTimeout="timeout"
            tokenTimeoutState={tokenTimeoutState}
          />
        }
      />
      <Route path={routes.credentialError} element={<CredentialError />} />

      <Route path={routes.about} element={<About />} />
      <Route path={routes.successfulDelete} element={<DeletedAccount />} />

      <Route
        path={routes.featureRequest}
        element={
          <ProtectedRoute
            authenticated={authenticated}
            tokenTimeout={tokenTimeout}
          >
            <BugRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path={routes.requestComplete}
        element={
          <ProtectedRoute
            authenticated={authenticated}
            tokenTimeout={tokenTimeout}
          >
            <BugRequestComplete />
          </ProtectedRoute>
        }
      />

      {renderedMenuItems}

      {renderedSettingsMenuItems}
    </Routes>
  );
}

function ProtectedRoute(props: {
  authenticated: boolean;
  tokenTimeout: boolean;
  children: React.ReactElement;
}) {
  const { authenticated, children, tokenTimeout } = props;

  if (authenticated && !tokenTimeout) {
    return children;
  } else if (tokenTimeout) {
    return <Navigate to={routes.timeout} />;
  } else {
    return <Navigate to={routes.login} />;
  }
}

function NavigateToImport() {
  return <Navigate to={routes.import} />;
}
