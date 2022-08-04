import {
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ActionButton from "../common/buttons/ActionButton";
import { changePassword as changePasswordAction } from "../controllers/actions";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import useAction from "../hooks/useAction";

export function ChangePasswordModal(props: { isOpen: boolean; onClose: () => void }) {

  // PROPS AND VARIABLES DERIVED FROM PROPS
  const { isOpen, onClose } = props;

  // CONTEXT AND DISPATCH
  const { token } = useAppStateContext();
  const dispatch = useDispatchContext();

  // STATE
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const toast = useToast();

  // STATE MANAGEMENT
  const clearOnClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordsMatch(true);
    onClose();
  };

  // EFFECTS
  // ASYNC DATA UPDATES
  const {loading, setLoadingTrue} = useAction(async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    changePasswordAction(token, dispatch, {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });

    clearOnClose();
    toast({
      status: "success",
      duration: 3000,
      isClosable: true,
      title: "Password Changed!",
    });
  }, dispatch);
  // JSX VARIABLES




  return (
    <Modal isOpen={isOpen} onClose={clearOnClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Password Change</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoadingTrue();
              }}
            >
              <FormControl>
                <FormLabel>Old Password:</FormLabel>

                <Input
                  value={oldPassword}
                  type="password"
                  marginBottom="1em"
                  onChange={(e) => setOldPassword(e.target.value)}
                />

                <FormLabel>New Password:</FormLabel>

                <Input
                  value={newPassword}
                  type="password"
                  marginBottom="1em"
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <FormLabel>Confirm New Password:</FormLabel>

                <Input
                  value={confirmPassword}
                  type="password"
                  marginBottom="1em"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Text
                  color="red"
                  marginBottom="1em"
                  display={passwordsMatch ? "none" : "block"}
                >
                  Passwords do not match, try again!
                </Text>

                <Flex width="100%" justifyContent="center" marginBottom="1em">
                  <ActionButton actionType="proceed" type="submit" isLoading={loading}>
                    Change Password
                  </ActionButton>
                </Flex>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
