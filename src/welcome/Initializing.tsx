import { Center, Flex, Spinner } from "@chakra-ui/react";
import {
  FullScreenForm,
  FullScreenFormHeading,
} from "../common/FullScreenForm";

export default function Initalizing() {

  const initalizeText = "Firing up the zappers...";
  
  return (
    <FullScreenForm alignItems="center">
      <Flex direction="column" height="50%" width="90%" alignItems="center">
        <FullScreenFormHeading marginBottom="3rem">
          {initalizeText}
        </FullScreenFormHeading>
        <Spinner size="xl" color="secondary.500" speed="0.65s" thickness="5px"/>
      </Flex>
    </FullScreenForm>
  );
}
