import backendUrl from "../services/backendUrl";
import { FC, LegacyRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  toast,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SectionHeading } from "../common/SectionHeading";
import {
  changePassword as changePasswordAction,
  deleteUser,
  logout,
} from "../controllers/actions";
import { clear } from "console";
import { ChangePasswordModal } from "./ChangePasswordModal";
import GoogleAdditionalScopesButton from "../common/buttons/GoogleAdditionalScopesButton";
import useBoolean from "../hooks/useBoolean";
import useAction from "../hooks/useAction";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";

export default function Account() {

  // CONTEXT AND DISPATCH
  const { userGoogleRequiredScopes, email } = useAppStateContext();

  // STATE
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteAccountIsOpen,
    onOpen: deleteAccountOnOpen,
    onClose: deleteAccountOnClose,
  } = useDisclosure();

  // JSX VARIABLES
  const loggedIn = <Text>You're logged in with Google!  This enables grabbing information from Google Sheets.</Text>;

  const notLoggedIn = (
    <>
      <Text marginBottom="1rem">You haven't granted permission to access Google Sheets and Google Drive to enable grabbing information from Google Sheets.  Grant permissions?</Text>
      <GoogleAdditionalScopesButton />
    </>
  );

  return (
    <>
      <Box marginBottom="1em">
        <SectionHeading title="Your Account" />
      </Box>

      <Box marginBottom="1em">
        <AccountHeader heading="Email" />
        <Text>{email}</Text>
      </Box>

      <Box marginBottom="1em">
        <AccountHeader heading="Password" />
        <Button onClick={onOpen}>Change Password</Button>
      </Box>

      <Box width="50%" marginBottom="1em">
        <AccountHeader heading="Google Account" />
        {userGoogleRequiredScopes ? loggedIn : notLoggedIn}
      </Box>

      <Box>
        <AccountHeader heading="Delete Account" />
        <Button onClick={deleteAccountOnOpen}>
          Delete Your Gradezpr Account
        </Button>
      </Box>

      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
      <DeleteAcccountModal
        isOpen={deleteAccountIsOpen}
        onClose={deleteAccountOnClose}
      />
    </>
  );
}

function AccountHeader(props: { heading: string }) {
  const { heading } = props;

  return (
    <Heading as="h3" size="md" marginBottom="0.5em">
      {heading}
    </Heading>
  );
}

function DeleteAcccountModal(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const dispatch = useDispatchContext();
  const { token } = useAppStateContext();

  const navigate = useNavigate();
  const cancelButtonRef = useRef(null);

  const { loading: confirmDelete, setLoadingTrue: confirmDeleteOn } = useAction(
    async () => {
      await deleteUser(token, dispatch);
      logout(dispatch);
      navigate(routes.successfulDelete);
    },
    dispatch
  );


  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelButtonRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Delete Account</AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Once your account is deleted, you can't recover it.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelButtonRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDeleteOn} ml={3} isLoading={confirmDelete}>
              Yes, delete my account.
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
