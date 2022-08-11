import {
  Checkbox,
  Divider,
  FormControl,
  Link,
  Text,
} from "@chakra-ui/react";
import { ObjectTyped } from "object-typed";
import React, { useEffect, useState } from "react";
import useBoolean from "../hooks/useBoolean";
import useForm from "../hooks/useForm";
import { useResponsive } from "../hooks/useResponsive";
import useBooleanObject from "../hooks/useBooleanObject";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import RegisterFormDisplay from "./RegisterFormDisplay";
import {
  FullScreenForm,
  FullScreenFormHeading,
  FullScreenFormStack,
  FullScreenFormNextButton,
  FullScreenFormError,
} from "../common/FullScreenForm";
import { registerGoogleUserApi, registerUserApi, setTokenAndRedirect } from "../controllers/actions";
import { Authentication} from "../Types";
import { useDispatchContext } from "../controllers/context";
import { AxiosError } from "axios";
import { getErrorFactory } from "../errors";
import { routes } from "../routes";

export type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

export const initialRegisterForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmedPassword: "",
};

export const registerFormFieldLabels: RegisterForm = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  password: "Password",
  confirmedPassword: "Confirm Password",
};

const errors = getErrorFactory("RegistrationError");

const registrationErrorMessages = {
  alreadyRegistered: errors("alreadyRegistered").errorBody.message,
  passwordsDontMatch: errors("passwordsDontMatch").errorBody.message,
  unknownError: errors("unknownError").errorBody.message,
};

type RegistrationErrors = keyof typeof registrationErrorMessages;

export default function Register(props: { authentication: Authentication }) {
  // PROPS AND VARIABLES DERIVED FROM PROPS
  const { authentication } = props;
  const { setAuthenticatedTrue, setAuthenticatedFalse } = authentication;

  // CONTEXT AND DISPATCH
  const dispatch = useDispatchContext();

  // STATE
  const [registerState, updateRegisterState, registerStateComplete] =
    useForm<RegisterForm>(initialRegisterForm);

  const [loading, { on: setLoadingTrue, off: setLoadingFalse }] =
    useBoolean(false);

  const navigate = useNavigate();

  const [errorState, setErrorState] = useState<null | RegistrationErrors>(null);

  // STATE MANAGEMENT
  const handleNext = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLoadingTrue();
  };

  // ASYNC DATA UPDATES

  useEffect(() => {
    const registerUser = async () => {
      if (registerState.password !== registerState.confirmedPassword) {
        setErrorState("passwordsDontMatch");
        setLoadingFalse();
        return;
      }

      try {
        const response = await registerUserApi(registerState);

        if (response) {
          setTokenAndRedirect(
            response,
            dispatch,
            setAuthenticatedTrue,
            navigate,
            routes.privacyPolicyAcknowledgement
          );
        } else {
          setErrorState("unknownError");
        }

        setLoadingFalse();
      } catch (error: any) {
        const axiosError: AxiosError = error;

        if (
          axiosError.response?.data.message ===
          registrationErrorMessages.alreadyRegistered
        ) {
          setErrorState("alreadyRegistered");
        } else if (
          axiosError.response?.data.message ===
          registrationErrorMessages.passwordsDontMatch
        ) {
          setErrorState("passwordsDontMatch");
        } else {
          setErrorState("unknownError");
        }

        setLoadingFalse();
      }
    };

    if (loading) {
      registerUser();
      return () => setLoadingFalse();
    } else {
      return () => setLoadingFalse();
    }
  }, [loading]);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const token = await registerGoogleUserApi(credentialResponse);

      if (token) {
        setAuthenticatedTrue();
        setTokenAndRedirect(token, dispatch, setAuthenticatedTrue, navigate, routes.privacyPolicyAcknowledgement);
      } else {
        setErrorState("unknownError");
      }
    } catch (error: any) {
      const axiosError: AxiosError = error;

      if (
        axiosError.response?.data.message ===
        registrationErrorMessages.alreadyRegistered
      ) {
        navigate(routes.linkAccounts);
      } else {
        setErrorState("unknownError");
      }
    }
  };

  const handleGoogleFailure = () => {
    setErrorState("unknownError");
  };

  // STRING LITERALS

  const formFieldLabels: RegisterForm = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    confirmedPassword: "Confirm Password",
  };

  const registerHeading = "Let's get zapping!  Enter your information below.";
  const nextButtonText = "Next";

  return (
    <FullScreenForm>
      <FullScreenFormHeading>{registerHeading}</FullScreenFormHeading>

      <FullScreenFormStack>
        <FormControl as="form" width="100%" onSubmit={handleNext}>
          <RegisterFormDisplay
            formState={registerState}
            updateFormState={updateRegisterState}
            formFieldLabels={formFieldLabels}
          />

          {errorState === null ? (
            <></>
          ) : (
            <ShowRegistrationErrors errorState={errorState} />
          )}

          <FullScreenFormNextButton
            text={nextButtonText}
            loading={loading}
            disabled={!registerStateComplete}
          />
        </FormControl>

        <Divider border="2px solid black" opacity="100" />

        <GoogleLogin
          useOneTap
          onSuccess={handleGoogleLogin}
          onError={handleGoogleFailure}
        />
      </FullScreenFormStack>
    </FullScreenForm>
  );
}

function ShowRegistrationErrors(props: { errorState: RegistrationErrors }) {
  const { errorState } = props;

  const errorStateDisplay: { [key in RegistrationErrors]: JSX.Element } = {
    alreadyRegistered: (
      <Text>
        There is already an account with this email -{" "}
        <Link as={ReactRouterLink} to="/login">
          login here.
        </Link>
      </Text>
    ),
    passwordsDontMatch: (
      <Text>Your passwords do not match. Check them and try again!</Text>
    ),
    unknownError: <Text>An unknown error occured. Please try again.</Text>,
  };

  return (
    <FullScreenFormError slideIn={true}>
      {errorStateDisplay[errorState]}
    </FullScreenFormError>
  );
}