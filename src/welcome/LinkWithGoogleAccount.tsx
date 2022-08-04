import useForm from "../hooks/useForm";
import { FormControl, Text } from "@chakra-ui/react";
import RegisterFormDisplay from "./RegisterFormDisplay";
import { useResponsive } from "../hooks/useResponsive";
import {
  FullScreenForm,
  FullScreenFormHeading,
  FullScreenFormStack,
  FullScreenFormNextButton,
  FullScreenFormError,
} from "../common/FullScreenForm";
import { useEffect, useState } from "react";
import useBoolean from "../hooks/useBoolean";
import axios, { AxiosError } from "axios";
import backendUrl from "../services/backendUrl";
import { useNavigate } from "react-router-dom";
import { setTokenAndRedirect } from "../controllers/actions";
import { Authentication } from "../Types";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import {NewToken} from "@backend/http/routes/authentication/generateToken";
import { getErrorFactory } from "../errors";
import { apiRoutes } from "../routes";

type LinkWithGoogleForm = {
  email: string;
  password: string;
  confirmedPassword: string;
};

const errors = getErrorFactory("RegistrationError");
const linkWithGoogleErrorMessages = {
  passwordsDontMatch: errors("passwordsDontMatch").errorBody.message,
  unknownError: errors("unknownError").errorBody.message,
  incorrectPassword: errors("invalidPassword").errorBody.message,
};

type LinkWithGoogleErrorMessages = keyof typeof linkWithGoogleErrorMessages;

export default function LinkWithGoogleAccount(props: {
  authentication: Authentication;
}) {
  // PROPS AND VARIABLES DERIVED FROM PROPS
  const { setAuthenticatedTrue } = props.authentication;

  // CONTEXT AND DISPATCH
  const { token } = useAppStateContext();
  const dispatch = useDispatchContext();
  const isMdOrSmaller = useResponsive("md");

  // STATE
  const [linkState, updateLinkState, linkStateComplete] =
    useForm<LinkWithGoogleForm>({
      email: "",
      password: "",
      confirmedPassword: "",
    });

  const [loading, { on: loadingOn, off: loadingOff }] = useBoolean(false);

  const [linkWithGoogleErrors, setLinkWithGoogleErrors] =
    useState<null | LinkWithGoogleErrorMessages>(null);

  const navigate = useNavigate();

  // ASYNC DATA UPDATES
  useEffect(() => {
    const linkAccounts = async () => {
      if (linkState.confirmedPassword !== linkState.password) {
        setLinkWithGoogleErrors("passwordsDontMatch");
        return;
      }

      try {
        const response = (await (
          await axios.post(backendUrl(apiRoutes.linkWithGoogle), linkState)
        ).data) as NewToken;

        setAuthenticatedTrue();
        setTokenAndRedirect(response, dispatch, setAuthenticatedTrue, navigate);

        loadingOff();
      } catch (e) {
        let error = e as AxiosError;

        if (
          error.response?.data.message ===
          linkWithGoogleErrorMessages.incorrectPassword
        ) {
          setLinkWithGoogleErrors("incorrectPassword");
        } else if (
          error.response?.data.message ===
          linkWithGoogleErrorMessages.passwordsDontMatch
        ) {
          setLinkWithGoogleErrors("passwordsDontMatch");
        } else {
          setLinkWithGoogleErrors("unknownError");
        }
      }
    };

    if (loading) {
      linkAccounts();
    } else {
      return;
    }
  }, [loading]);

  // STRING LITERALS

  const linkStateLabels: LinkWithGoogleForm = {
    email: "Email",
    password: "Password",
    confirmedPassword: "Confirm Password",
  };

  return (
    <FullScreenForm>
      <FullScreenFormHeading>You already have a gradezpr account!</FullScreenFormHeading>

      <Text marginBottom="3rem">Enter the email and password associated with your account to link with your Google account.</Text>

      <FullScreenFormStack>
        <FormControl
          as="form"
          width="100%"
          onSubmit={(e) => {
            e.preventDefault();
            loadingOn();
          }}
        >
          <RegisterFormDisplay
            formState={linkState}
            updateFormState={updateLinkState}
            formFieldLabels={linkStateLabels}
          />

          <ShowLinkingErrors linkWithGoogleErrors={linkWithGoogleErrors} />

          <FullScreenFormNextButton
            loading={loading}
            disabled={!linkStateComplete}
            text={"Link Accounts"}
          />
        </FormControl>
      </FullScreenFormStack>
    </FullScreenForm>
  );
}

function ShowLinkingErrors(props: {
  linkWithGoogleErrors: null | LinkWithGoogleErrorMessages;
}) {
  const { linkWithGoogleErrors } = props;

  const errorStateDisplay: {
    [key in LinkWithGoogleErrorMessages]: JSX.Element;
  } = {
    passwordsDontMatch: (
      <Text>Sorry, your passwords don't match. Please try again.</Text>
    ),
    incorrectPassword: (
      <Text>
        Oops, look like your information is incorrect. Please try again.
      </Text>
    ),
    unknownError: <Text>An unknown error occurred. Please try again.</Text>,
  };

  if (linkWithGoogleErrors === null) {
    return <></>;
  } else {
    return (
      <FullScreenFormError slideIn={true}>
        {" "}
        {errorStateDisplay[linkWithGoogleErrors]}
      </FullScreenFormError>
    );
  }
}
