import { Flex, FlexProps } from "@chakra-ui/react";
import React, { ReactChild, ReactNode } from "react";
import { Card } from "./Card";

function InfoCard(props: { children?: ReactNode | ReactNode[] } & FlexProps) {
  const { children, ...rest } = props;

  return (
    <Card variant="raised" overflow="hidden" {...rest}>
      {children}
    </Card>
  );
}

function InfoCardHeader(
  props: { children?: ReactNode | ReactNode[] } & FlexProps
) {
  const { children, ...rest } = props;
  return (
    <Flex
      height="30%"
      width="100%"
      backgroundColor="accent.500"
      direction="column"
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {children}
    </Flex>
  );
}

function InfoCardContent(
  props: { children?: ReactNode | ReactNode[] } & FlexProps
) {
  const { children, ...rest } = props;

  return (
    <Flex
      height="70%"
      width="100%"
      backgroundColor="accent.200"
      direction="column"
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {children}
    </Flex>
  );
}

export { InfoCard, InfoCardHeader, InfoCardContent };
