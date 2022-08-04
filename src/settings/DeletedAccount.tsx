import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FullScreenForm,
  FullScreenFormHeading,
} from "../common/FullScreenForm";
import { useAppStateContext } from "../controllers/context";
import { routes } from "../routes";

export default function DeletedAccount() {
  const { token } = useAppStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (token !== null) {
      navigate(routes.account);
    }
  }, [token]);

  return (
    <FullScreenForm>
      <FullScreenFormHeading>
        You've successfully deleted your account. Hope to see you again soon!
      </FullScreenFormHeading>
    </FullScreenForm>
  );
}