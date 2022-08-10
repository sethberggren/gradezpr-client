import {
  Divider,
  FormControl,
  Link
} from "@chakra-ui/react";
import { loginUser, loginUserWithGoogle } from "../controllers/actions";
import useBoolean from "../hooks/useBoolean";
import useAction from "../hooks/useAction";
import { useDispatchContext } from "../controllers/context";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import {
  FullScreenForm,
  FullScreenFormError,
  FullScreenFormHeading,
  FullScreenFormNextButton,
  FullScreenFormStack,
} from "../common/FullScreenForm";
import RegisterFormDisplay from "./RegisterFormDisplay";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Authentication } from "../Types";
import { routes } from "../routes";
import {Link as ReactRouterLink} from "react-router-dom"

type LoginForm = {
  email: string;
  password: string;
};

const loginFormLabels = {
  email: "Email",
  password: "Password",
};

function Login(props: {authentication: Authentication}) {
    // PROPS AND VARIABLES DERIVED FROM PROPS
    const {setAuthenticatedTrue} = props.authentication;


    // CONTEXT AND DISPATCH
    const dispatch = useDispatchContext();
  
    // STATE
    const [loginForm, updateLoginForm, loginFormComplete] = useForm<LoginForm>({
      email: "",
      password: "",
    });
  
    const [incorrectPassword, { on: setIncorrectPasswordTrue }] =
      useBoolean(false);
  
    const navigate = useNavigate();
  
    // ASYNC DATA UPDATES
    const { loading: loadingEmailLogin, setLoadingTrue: loadingEmailLoginTrue } =
      useAction(async () => {
        const { email, password } = loginForm;
  
        await loginUser(
          email,
          password,
          setIncorrectPasswordTrue,
          setAuthenticatedTrue,
          dispatch,
          navigate
        );
      }, dispatch);
      
  
    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
      try {
        await loginUserWithGoogle(credentialResponse, dispatch, setAuthenticatedTrue, navigate);
      } catch (e) {
        dispatch({type: "setToken", payload: null});
        setIncorrectPasswordTrue();
      }
    };

  const loginHeading = "Log In to Gradezpr";
  const loginButtonText = "Login";

  return (
    <>
      <FullScreenForm>
        <FullScreenFormHeading>{loginHeading}</FullScreenFormHeading>

        <FullScreenFormStack>
          <FormControl
            as="form"
            width="100%"
            onSubmit={(e) => {
              e.preventDefault();
              loadingEmailLoginTrue();
            }}
          >
            <RegisterFormDisplay
              formState={loginForm}
              updateFormState={updateLoginForm}
              formFieldLabels={loginFormLabels}
            />

            <ShowLoginErrors incorrectPassword={incorrectPassword} />

            <Link as={ReactRouterLink} to={routes.passwordReset}>Forgot Password?</Link>

            
            <FullScreenFormNextButton
              text={loginButtonText}
              loading={loadingEmailLogin}
              disabled={!loginFormComplete}
            />
          </FormControl>

          <Divider border="3px solid black" opacity="100" />

          <GoogleLogin
            useOneTap
            onSuccess={handleGoogleLogin}
            onError={() => setIncorrectPasswordTrue()}
          />
        </FullScreenFormStack>
      </FullScreenForm>
    </>
  );
}

function ShowLoginErrors(props: { incorrectPassword: boolean }) {
  const { incorrectPassword } = props;

  const incorrectPasswordText =
    "Your credentials are incorrect. Please try again.";

  if (incorrectPassword) {
    return (
      <FullScreenFormError slideIn={true}>
        {incorrectPasswordText}
      </FullScreenFormError>
    );
  } else {
    return <></>;
  }
}

export default Login;
