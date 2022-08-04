import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "./common/buttons/ActionButton";
import { FullScreenForm, FullScreenFormHeading } from "./common/FullScreenForm";
import { logout } from "./controllers/actions";
import { useDispatchContext } from "./controllers/context";
import { routes } from "./routes";

export default function CredentialError() {
  const dispatch = useDispatchContext();
  const navigate = useNavigate();

  useEffect(() => {
    logout(dispatch);
  }, []);

  return (
    <FullScreenForm>
      <FullScreenFormHeading>
        Oops, something is wrong with your login information. Please log back
        in.
      </FullScreenFormHeading>

      <ActionButton
        actionType="primary"
        onClick={() => {
          navigate(routes.login);
        }}
      >
        Log In
      </ActionButton>
    </FullScreenForm>
  );
}
