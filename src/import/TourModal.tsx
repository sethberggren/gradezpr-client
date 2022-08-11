import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {WelcomeResponse} from "@backend/http/routes/welcome/getWelcome"
import { useEffect, useState } from "react";
import ActionButton from "../common/buttons/ActionButton";
import { getWelcome, hasSeenWelcome } from "../controllers/actions";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import useAction from "../hooks/useAction";

export type WelcomeResponse = {
  header: string;
  body: string;
};

export default function TourModal(props: Omit<ModalProps, "children">) {
  const { isOpen, onClose } = props;

  const { token, isNewUser } = useAppStateContext();
  const dispatch = useDispatchContext();

  const [welcomeSteps, setWelcomeSteps] = useState<WelcomeResponse[]>([]);
  const [welcomeStepInView, setWelcomeStepInView] = useState<number>(0);

  const { loading, setLoadingTrue } = useAction(async () => {
    const receivedWelcomeSteps = await getWelcome(token, dispatch);

    setWelcomeSteps(receivedWelcomeSteps);
  }, dispatch);

  const { setLoadingTrue: setHasSeenWelcome } = useAction(async () => {
    await hasSeenWelcome(token, dispatch);

    onClose();
  }, dispatch);

  useEffect(() => {
    if (isNewUser) {
      setLoadingTrue();
    }
  }, []);

  const renderedWelcomeSteps = welcomeSteps.map((welcomeStep) => (
    <TourModalStep
      header={welcomeStep.header}
      body={welcomeStep.body}
      key={welcomeStep.header}
    />
  ));

  return (
    <Modal isOpen={isOpen} onClose={setHasSeenWelcome} size="md">
      <ModalOverlay />

      <ModalContent>
        {loading ? (
          <TourModalLoading />
        ) : (
          renderedWelcomeSteps[welcomeStepInView]
        )}
        <ModalFooter width="100%">
          {loading ? null : (
            <TourModalFooter
              welcomeStepInView={welcomeStepInView}
              setWelcomeStepInView={setWelcomeStepInView}
              welcomeSteps={welcomeSteps}
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function TourModalStep(props: WelcomeResponse) {
  const { header, body } = props;

  return (
    <>
      <ModalHeader>{header}</ModalHeader>

      <ModalCloseButton aria-label="Close tour modal" />

      <ModalBody>{body}</ModalBody>
    </>
  );
}

function TourModalLoading() {
  return (
    <>
      <ModalHeader>Welcome to Gradezpr! ⚡</ModalHeader>

      <ModalCloseButton aria-label="Close tour modal" />

      <ModalBody>
        <Spinner />
      </ModalBody>
    </>
  );
}

type TourModalFooterProps = {
  welcomeStepInView: number;
  setWelcomeStepInView: (num: number) => void;
  welcomeSteps: WelcomeResponse[];
};

function TourModalFooter(props: TourModalFooterProps) {
  const { welcomeStepInView, setWelcomeStepInView, welcomeSteps } = props;

  const shiftRight = () => {
    if (welcomeStepInView !== welcomeSteps.length - 1) {
      setWelcomeStepInView(welcomeStepInView + 1);
    }
  };

  const shiftLeft = () => {
    if (welcomeStepInView !== 0) {
      setWelcomeStepInView(welcomeStepInView - 1);
    }
  };

  return (
    <Flex direction="row" width="100%" justifyContent="space-between">
      <Flex width="50%" justifyContent="flex-start" aria-label="Tour progress">
        <Text>
          {welcomeStepInView + 1}/{welcomeSteps.length}
        </Text>
      </Flex>

      <Flex width="50%" justifyContent="flex-end">
        <ActionButton
          actionType="secondary"
          onClick={shiftLeft}
          isDisabled={welcomeStepInView === 0}
          marginRight="1rem"
          aria-label="Back in tour"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ marginRight: "0.5rem" }}
          />
          Back
        </ActionButton>
        <ActionButton
          actionType="proceed"
          onClick={shiftRight}
          isDisabled={welcomeStepInView === welcomeSteps.length - 1}
          aria-label="Next in tour"
        >
          Next{" "}
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{ marginLeft: "0.5rem" }}
          />
        </ActionButton>
      </Flex>
    </Flex>
  );
}
