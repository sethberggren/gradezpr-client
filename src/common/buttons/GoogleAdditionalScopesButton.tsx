import { Button, ButtonProps } from "@chakra-ui/react";
import {
  CodeResponse,
  useGoogleLogin,
} from "@react-oauth/google";
import { useAppStateContext, useDispatchContext } from "../../controllers/context";
import { grantAdditionalScopes } from "../../controllers/actions";

export const driveScope = "https://www.googleapis.com/auth/drive.readonly";
export const sheetsScope = "https://www.googleapis.com/auth/spreadsheets.readonly";

const requiredScopes = `${driveScope} ${sheetsScope}`;

const additionalScopesText = "Authorize Gradezpr";

const noScopesError =
  "Did not provide access to Google Drive and Google Sheets!  Importing with grades with Google Sheets will not work.";

export default function GoogleAdditionalScopesButton(
  props: {
    children?: React.ReactNode;
  } & ButtonProps
) {
  const { children, ...rest } = props;

  const dispatch = useDispatchContext();
  const { userGoogleRequiredScopes, token } = useAppStateContext();

  const handleGoogleCode = async (codeResponse: CodeResponse) => grantAdditionalScopes(token, dispatch, codeResponse);

  const googleLoginCode = useGoogleLogin({
    onSuccess: handleGoogleCode,
    scope: requiredScopes,
    flow: "auth-code",
  });

  return (
    <Button onClick={googleLoginCode} {...rest}>
      {children ? children : additionalScopesText}
    </Button>
  );
}

export function GoogleLogo() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>;
}
