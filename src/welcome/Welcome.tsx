import {
  As,
  Button,
  Center,
  Flex,
  FlexProps,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import {
  faArrowRight,
  faBolt,
  faCloudMeatball,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../common/buttons/ActionButton";
import { Card } from "../common/Card";

type WelcomeSteps = {
  heading: string;
  description: string;
};

const headingFontSize = {
  base: "2rem",
  md: "4rem",
};

const textFontSize = {
  base: "1rem",
  md: "2rem",
};

export default function Welcome() {

  // STATE
  const navigate = useNavigate();

  
  // JSX VARIABLES

  const welcome = {
    heading: "Free yourself from grading...zap your grades.",
    description: "gradezpr",
  };

  const stepsHeader = "Easy as:";
  const steps: WelcomeSteps[] = [
    {
      heading: "Upload",
      description: "your grades.",
    },
    {
      heading: "Curve",
      description: "your grades.",
    },
    {
      heading: "Zap",
      description: "your grades into PowerSchool.",
    },
  ];

  const renderedSteps = steps.map((step, index) => (
    <WelcomeSteps index={index} step={step} key={`steps-${index}`} />
  ));

  const registerSection = {
    heading: "Decrease the tedium of teaching.",
    description: "Get back to the things that matter.",
    registerButton: "Register now.",
  };

  const welcomeButtons = {
    register: "Register",
    login: "Log In",
  };

  const registerOnClick = () => {
    navigate("/register");
  };

  const loginOnClick = () => {
    navigate("/login");
  };

  const welcomeButtonGroup = (
    <>
      <Flex
        direction="row"
        justifyContent="flex-end"
        paddingRight="1.5rem"
        alignItems="center"
        width="100%"
        height="10%"
      >
        <ActionButton
          actionType="secondary"
          marginRight="1rem"
          onClick={registerOnClick}
        >
          {welcomeButtons.register}
        </ActionButton>

        <ActionButton actionType="primary" onClick={loginOnClick}>
          {welcomeButtons.login}
        </ActionButton>
      </Flex>
    </>
  );

  return (
    <>
      <WelcomeSection
        backgroundColor="primary.500"
        direction="column"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        {welcomeButtonGroup}
        <Flex
          width="90%"
          height="90%"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <WelcomeHeading heading={welcome.heading} as="h1" />

          <Flex direction="row" fontSize={headingFontSize}>
            <Text marginRight="2rem"> {welcome.description}</Text>

            <Text>
              <FontAwesomeIcon icon={faBolt} />
            </Text>
          </Flex>
        </Flex>
      </WelcomeSection>

      <WelcomeSection
        direction="column"
        alignItems="center"
        justifyContent="space-around"
      >
        <Flex
          height="20%"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <WelcomeHeading heading={stepsHeader} as="h2" />
        </Flex>

        <Flex
          direction={{ base: "column", md: "row" }}
          width="100%"
          height="80%"
          alignItems={{ base: "center", md: "center" }}
          justifyContent={{ base: "space-around", md: "space-around" }}
        >
          {renderedSteps}
        </Flex>
      </WelcomeSection>

      <WelcomeSection
        backgroundColor="primary.500"
        direction="column"
        alignItems="center"
        justifyContent="space-around"
        color="white"
      >
        <WelcomeHeading heading={registerSection.heading} as="h2" />

        <Text fontSize={textFontSize}>{registerSection.description}</Text>

        <Button
          height="5rem"
          width="15rem"
          colorScheme="secondary"
          transition="0.5s"
          fontSize="150%"
          flexWrap="wrap"
          justifyContent="space-around"
          onClick={registerOnClick}
        >
          <Text>{registerSection.registerButton}</Text>

          <Text>
            <FontAwesomeIcon icon={faArrowRight} />
          </Text>
        </Button>
      </WelcomeSection>
    </>
  );
}

function WelcomeSection(props: { children: React.ReactNode } & FlexProps) {
  const { children, ...rest } = props;

  return (
    <Flex height="100vh" width="100vw" {...rest}>
      {children}
    </Flex>
  );
}

function WelcomeHeading(props: { heading: string; as?: As }) {
  const { heading, as } = props;

  return (
    <Heading as={as} fontSize={headingFontSize} textAlign="center">
      {heading}
    </Heading>
  );
}

function WelcomeSteps(props: { step: WelcomeSteps } & { index: number }) {
  const { index, step } = props;
  const { description, heading } = step;

  const welcomeStepsHeadingStyle = {
    base: "1.5rem",
    lg: "3rem",
  };

  const welcomeTextStyle = {
    base: "1rem",
    lg: "2rem",
  };

  return (
    <Card
      variant="solid"
      cardColor="primary"
      height={{ base: "10rem", lg: "20rem" }}
      width={{ base: "15rem", lg: "20rem" }}
      transition="0.5s"
    >
      <Flex
        direction="column"
        height="100%"
        width="100%"
        justifyContent="center"
      >
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="center"
          marginBottom={{ base: "1rem", lg: "2rem" }}
        >
          <Flex
            borderRadius="50%"
            height={{ base: "4rem", lg: "7.5rem" }}
            width={{ base: "4rem", lg: "7.5rem" }}
            alignItems="center"
            justifyContent="center"
            backgroundColor="secondary.500"
            _hover={{ backgroundColor: "secondary.200" }}
            transition="0.5s"
          >
            <Text
              color="white"
              size="xl"
              fontSize={welcomeStepsHeadingStyle}
              fontWeight="bold"
            >
              {index + 1}
            </Text>
          </Flex>
        </Flex>

        <Flex direction="column" alignItems="center">
          <Heading
            as="h3"
            size="lg"
            fontWeight="bold"
            fontSize={welcomeStepsHeadingStyle}
          >
            {heading}
          </Heading>

          <Text size="md" fontSize={welcomeTextStyle}>
            {description}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
