import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Flex,
  ButtonProps,
  PlacementWithLogical,
} from "@chakra-ui/react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef } from "react";

export function DeleteButtonWithPopover(props: {
  handleDelete: any;
  buttonHeight?: string;
  buttonWidth?: string;
  popoverSize?: string;
  colorScheme?: "primary" | "secondary" | "accent";
  placement?: PlacementWithLogical;
} & ButtonProps) {
  const { handleDelete, buttonHeight, buttonWidth, placement, colorScheme, ...rest } =
    props;

  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const initialFocusRef = useRef(null);

  const deleteText = "Confirm Delete";

  return (
    <Popover
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
      placement={placement ? placement : "right"}
      initialFocusRef={initialFocusRef}
      flip={false}
    >
      <PopoverTrigger>
        <Button
          variant="ghost"
          colorScheme={colorScheme}
          height={buttonHeight}
          width={buttonWidth}
          {...rest}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </PopoverTrigger>
      <PopoverContent width="10em">
        <PopoverArrow />
        <PopoverHeader>{deleteText}</PopoverHeader>

        <PopoverBody>
          <Flex direction="row">
            <Button colorScheme="red" size="xs" onClick={handleDelete}>
              Delete
            </Button>

            <Button
              variant="ghost"
              onClick={close}
              size="xs"
              ref={initialFocusRef}
            >
              Cancel
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
