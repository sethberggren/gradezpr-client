import {
  FullScreenForm,
  FullScreenFormHeading,
} from "../common/FullScreenForm";
import { Text } from "@chakra-ui/react";
import ActionButton from "../common/buttons/ActionButton";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { useEffect } from "react";
import { logout } from "../controllers/actions";
import { useDispatchContext } from "../controllers/context";
import { Authentication, TokenTimeoutState } from "../Types";

const timeoutText = "You have been logged out for security!";

const logoutText = "You've logged out.";

const logBackInButton = "Log back in?";

export default function Logout(props: {
  logoutOrTimeout: "logout" | "timeout";
  authenticatedState: Authentication;
  tokenTimeoutState: TokenTimeoutState;
}) {
  const { logoutOrTimeout } = props;

  const {setAuthenticatedFalse} = props.authenticatedState;

  const { tokenTimeoutOff, tokenTimeoutOn } = props.tokenTimeoutState;

  const navigate = useNavigate();
  const dispatch = useDispatchContext();

  // when this component renders, it runs the effect to log the user out.
  // most importantly, it sets the token in the local storage to null.

  useEffect(() => {
    setAuthenticatedFalse();
    logout(dispatch);
  }, []);

  return (
    <FullScreenForm>
      <FullScreenFormHeading>
        {logoutOrTimeout === "logout" ? logoutText : timeoutText}
      </FullScreenFormHeading>

      <ActionButton
        actionType="primary"
        onClick={() => {
          tokenTimeoutOff();
          navigate(routes.login);
        }}
      >
        {logBackInButton}
      </ActionButton>
    </FullScreenForm>
  );
}
