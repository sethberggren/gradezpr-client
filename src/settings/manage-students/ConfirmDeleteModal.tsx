import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";

export function ConfirmDeleteModal(props: {
  isOpen: boolean;
  onClose: () => void;
  setConfirmedDelete: () => void;
}) {
  const { isOpen, onClose, setConfirmedDelete } = props;

  const initialFocusRef = useRef(null);

  const handleClose = () => {
    setConfirmedDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" initialFocusRef={initialFocusRef}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <Text>Are you sure you want to delete all students?</Text>
          </ModalHeader>

          <ModalFooter>
            <Button colorScheme="red" onClick={handleClose} marginRight="0.5rem">
              Yes
            </Button>

            <Button variant="ghost" onClick={onClose} ref={initialFocusRef}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
