import { Button, FormControl, Input, Text } from "@chakra-ui/react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../common/buttons/ActionButton";
import {
  FullScreenForm,
  FullScreenFormError,
  FullScreenFormHeading,
  FullScreenFormNextButton,
  FullScreenFormStack,
} from "../common/FullScreenForm";
import { resetPassword, ResetPasswordStatus } from "../controllers/actions";
import useAction from "../hooks/useAction";
import useBoolean from "../hooks/useBoolean";
import useForm from "../hooks/useForm";
import useFormComplete from "../hooks/useFormCompleted";
import { routes } from "../routes";
import RegisterFormDisplay from "./RegisterFormDisplay";

const errorMessages: Record<Exclude<ResetPasswordStatus, "OK">, string> = {
  noEmailOrPassword: "An unexpected error occured.  Please try again.",
  userDoesNotExist:
    "It looks like you don't have an account associated with Gradezpr.  Please check your information and try again.",
};

export default function ForgotPassword() {
  const [email, setEmail] = useForm({ email: "" });
  const formComplete = useFormComplete(email);

  const [status, setStatus] = useState<ResetPasswordStatus | "typing">(
    "typing"
  );

  const [loading, { on: loadingOn, off: loadingOff }] = useBoolean(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const resetUserPassword = async () => {
      const status = await resetPassword(email);
      setStatus(status);

      loadingOff();
    };

    if (loading) {
      resetUserPassword();
    }
  }, [loading]);

  useEffect(() => {
    if (status === "noEmailOrPassword" || status === "userDoesNotExist") {
      setErrorMessage(errorMessages[status]);
    } else if (status === "OK") {
      navigate(routes.passwordResetSuccess);
    }
  }, [status]);

  return (
    <FullScreenForm>
      <FullScreenFormHeading>Forgot password?</FullScreenFormHeading>

      <FullScreenFormStack>
        <FormControl
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            loadingOn();
          }}
        >
          <RegisterFormDisplay
            formState={email}
            updateFormState={setEmail}
            formFieldLabels={{ email: "Email" }}
          />

          {errorMessage !== "" ? (
            <FullScreenFormError slideIn={true}>
              <Text>{errorMessage}</Text>
            </FullScreenFormError>
          ) : null}

          <FullScreenFormNextButton
            text={"Go"}
            disabled={!formComplete}
            loading={loading}
          />
        </FormControl>
      </FullScreenFormStack>
    </FullScreenForm>
  );
}

export function ResetPasswordSuccess() {
  const navigate = useNavigate();

  return (
    <FullScreenForm>
      <FullScreenFormHeading>
        Your temporary password has been emailed to you. Be on the lookout for
        an email from seth@gradezpr.com to arrive in the next few minutes.
      </FullScreenFormHeading>

      <Button
        colorScheme="secondary"
        variant="solid"
        onClick={() => navigate(routes.login)}
      >
        <Text>
          <FontAwesomeIcon icon={faArrowLeft} /> Return to Login
        </Text>
      </Button>
    </FullScreenForm>
  );
}
