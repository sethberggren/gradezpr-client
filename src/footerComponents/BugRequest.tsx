import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FullScreenForm,
  FullScreenFormHeading,
  FullScreenFormStack,
} from "../common/FullScreenForm";
import { postUserRequest } from "../controllers/actions";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import useAction from "../hooks/useAction";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

// import { UserRequestRequest, TypeOfRequest, typeOfRequest } from "@backend/http/routes/userRequest/postUserRequest"

export const typeOfRequest = ["Bug", "Feature"] as const;

export type TypeOfRequest = typeof typeOfRequest[number];

export type UserRequestRequest = {
  typeOfRequest: TypeOfRequest;
  requestBody: string;
  shouldBeEmailed: boolean;
};

const shouldBeEmailed = ["Yes", "No"] as const;

type ShouldBeEmailed = typeof shouldBeEmailed[number];

const bugRequestHeading = "Submit a Bug/Feature Request";
export default function BugRequest() {
  const [requestForm, setRequestForm] = useState({typeOfRequest: "Bug", requestBody: "", shouldBeEmailed: false} as UserRequestRequest);
  const { token } = useAppStateContext();
  const dispatch = useDispatchContext();

  const navigate = useNavigate();

  const handleRadio = (val: TypeOfRequest) => {
    const newRequestForm = { ...requestForm };
    newRequestForm.typeOfRequest = val;

    setRequestForm(newRequestForm);
  };

  const handleTextInput = (val: string) => {
    const newRequestForm = { ...requestForm };
    newRequestForm.requestBody = val;

    setRequestForm(newRequestForm);
  };

  const handleShouldBeEmailed = (val: ShouldBeEmailed) => {
    const newRequestForm = { ...requestForm };
    newRequestForm.shouldBeEmailed = val === "Yes";

    setRequestForm(newRequestForm);
  };

  const { loading, setLoadingTrue } = useAction(async () => {
    await postUserRequest(token, dispatch, requestForm);

    navigate(routes.requestComplete);
  }, dispatch);

  return (
    <FullScreenForm direction="column">
      <FullScreenFormHeading>{bugRequestHeading}</FullScreenFormHeading>

      <FormControl
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          setLoadingTrue();
        }}
        display="flex"
        justifyContent="center"
      >
        <FullScreenFormStack>
          <FormLabel
            htmlFor="type-of-request"
            marginBottom="0"
            textDecoration="underline"
          >
            Type of Request:
          </FormLabel>

          <RadioGroup
            id="type-of-request"
            value={requestForm.typeOfRequest}
            onChange={handleRadio}
            colorScheme="secondary"
          >
            <Stack>
              {typeOfRequest.map((request) => (
                <Radio key={request} value={request}>{request}</Radio>
              ))}
            </Stack>
          </RadioGroup>

          <FormLabel htmlFor="request-body" textDecoration="underline">
            Describe Your{" "}
            {requestForm.typeOfRequest === "Bug" ? "Bug" : "Request"}:
          </FormLabel>

          <Textarea
            id="request-body"
            required
            colorScheme="secondary"
            onChange={(e) => handleTextInput(e.target.value)}
          />

          <FormLabel htmlFor="email-followup" textDecoration="underline">
            Would you like an email follow-up regarding this{" "}
            {requestForm.typeOfRequest === "Bug"
              ? "Bug".toLowerCase()
              : "Request".toLowerCase()}
            ?
          </FormLabel>

          <RadioGroup
            id="email-followup"
            value={
              requestForm.shouldBeEmailed === true
                ? shouldBeEmailed[0]
                : shouldBeEmailed[1]
            }
            onChange={handleShouldBeEmailed}
            display="flex"
            alignItems="center"
            colorScheme="secondary"
          >
            <Stack>
              {shouldBeEmailed.map((opt) => (
                <Radio key={opt} value={opt}>{opt}</Radio>
              ))}
            </Stack>
          </RadioGroup>

          <Button type="submit" colorScheme="secondary" isLoading={loading}>
            Submit
          </Button>
        </FullScreenFormStack>
      </FormControl>
    </FullScreenForm>
  );
}

export function BugRequestComplete() {
  const navigate = useNavigate();

  return (
    <FullScreenForm>
      <FullScreenFormStack width="90%">
        <FullScreenFormHeading textAlign="center">
          Thanks for submitting your request!
        </FullScreenFormHeading>
      </FullScreenFormStack>

      <Button colorScheme="secondary" onClick={() => navigate(routes.import)} maxWidth="70%" minWidth="13rem">
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
        <FontAwesomeIcon icon={faArrowCircleLeft} />
         <Text>
          Back to homepage
         </Text>
        </Flex>
        
      </Button>
    </FullScreenForm>
  );
}
