import { Modal, ModalOverlay } from "@chakra-ui/react";

import { ImportStepOne } from "./ImportStepOne";
import { ImportStepTwo } from "./ImportStepTwo";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import { resetImportState } from "../controllers/actions";
import { ImportStateContextProvider, useImportStateContext, useImportStateDispatch } from "../controllers/importContext";

export function ImportDialogue(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isOpen, onClose } = props;

  const { importStage } = useImportStateContext();
  const importDispatch = useImportStateDispatch();

  const handleClose = () => {
    resetImportState(importDispatch);
    onClose();
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />

      {importStage === 1 ? (
        <ImportStepOne onClose={handleClose} />
      ) : (
        <ImportStepTwo onClose={handleClose} />
      )}
    </Modal>
  );
}