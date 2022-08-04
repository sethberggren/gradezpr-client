import {
  FlexProps,
  Flex,
  HeadingProps,
  Heading,
  StackProps,
  Stack,
  ButtonProps,
  Spinner,
  SlideFade,
  Text,
} from "@chakra-ui/react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useResponsive } from "../hooks/useResponsive";
import ActionButton from "./buttons/ActionButton";
import { Card } from "./Card";

export function FullScreenForm(
  props: { children: React.ReactNode } & FlexProps
) {
  const { children, ...rest } = props;

  return (
    <Flex
      width="100vw"
      minHeight="100vh"
      direction="column"
      padding={{ base: "2rem", md: "5rem" }}
      alignItems="center"
      backgroundColor="primary.500"
      color="white"
      {...rest}
    >
      {children}
    </Flex>
  );
}

export function FullScreenFormHeading(
  props: { children: React.ReactNode } & HeadingProps
) {
  const { children, ...rest } = props;

  return (
    <Heading marginBottom="1rem" {...rest}>
      {children}
    </Heading>
  );
}

export function FullScreenFormStack(
  props: { children: React.ReactNode } & StackProps
) {
  const { children, ...rest } = props;

  return (
    <Stack
      width={{ base: "100%", lg: "40%" }}
      direction="column"
      spacing="1rem"
      alignItems="center"
      {...rest}
    >
      {children}
    </Stack>
  );
}

export function FullScreenFormNextButton(
  props: {
    text: string;
    loading?: boolean;
    disabled?: boolean;
  } & ButtonProps
) {
  const { text, loading, disabled } = props;

  const isMdOrSmaller = useResponsive("md");

  const nextButtonText = isMdOrSmaller ? (
    <Text>
      <FontAwesomeIcon icon={faArrowRight} />
    </Text>
  ) : (
    <Text>
      {text} <FontAwesomeIcon icon={faArrowRight} />
    </Text>
  );

  return (
    <Flex direction="row" width="100%" justifyContent="flex-end">
      <ActionButton
        actionType="proceed"
        colorScheme="secondary"
        type="submit"
        minWidth="5rem"
        height="2.5rem"
        disabled={disabled}
      >
        {loading ? <Spinner /> : nextButtonText}
      </ActionButton>
    </Flex>
  );
}

export function FullScreenFormError(props: {
  children: React.ReactNode;
  slideIn: boolean;
}) {
  const { children, slideIn } = props;

  return (
    <SlideFade in={slideIn}>
      <Card
        variant="solid"
        cardColor="warning"
        width="100%"
        padding="0.5rem"
        direction="row"
        alignItems="center"
        marginBottom="1rem"
      >
        {children}
      </Card>
    </SlideFade>
  );
}
