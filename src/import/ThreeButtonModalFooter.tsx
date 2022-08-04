import { ModalFooter, Flex, Spinner, Button } from "@chakra-ui/react";
import ActionButton from "../common/buttons/ActionButton";
import ImportHelpTooltip from "./ImportHelpTooltip";

export default function ThreeButtonModalFooter(props: {
  buttons: [JSX.Element, JSX.Element, JSX.Element];
}) {
  const { buttons } = props;

  const [leftButton, middleButton, rightButton] = buttons;

  return (
    <ModalFooter>
      <Flex width="100%" justifyContent="space-between">
        <Flex>{leftButton}</Flex>

        <Flex>
          <Flex marginRight="0.5rem">{middleButton}</Flex>

          <Flex>{rightButton}</Flex>
        </Flex>
      </Flex>
    </ModalFooter>
  );
}
