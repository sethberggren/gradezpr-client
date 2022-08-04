import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { clearErrors } from "../controllers/actions";
import { Action } from "../controllers/reducer";
import { reloginErrors } from "../errors";
import { routes } from "../routes";
import { CustomError } from "../Types";

export default function useError(
  error: CustomError,
  navigate: NavigateFunction,
  dispatch: React.Dispatch<Action>
) {
  const toast = useToast();

  useEffect(() => {

    if (reloginErrors.includes(error.message)) {
      navigate(routes.credentialError);
      return;
    }

    if (error.message !== "") {
      const title = `Error!`;
      const description = error.message;
      const status = "error";
      const duration = 3000;
      const isClosable = true;

      toast({
        title: title,
        description: description,
        status: status,
        duration: duration,
        isClosable: isClosable,
      });

      setTimeout(() => clearErrors(dispatch), duration);
    }
  }, [error]);
}
