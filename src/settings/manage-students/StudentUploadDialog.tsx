import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Input,
  ModalFooter,
  Button,
  Spinner,
  Flex,
  Text,
  Link,
  toast,
  useToast,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Card } from "../../common/Card";
import { DragToUpload, excelAllowableTypes } from "../../common/DragToUpload";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
} from "../../common/InfoCard";
import { uploadRoster } from "../../controllers/actions";
import { useAppStateContext, useDispatchContext } from "../../controllers/context";
import useAction from "../../hooks/useAction";

const uploadInstructions = [
  <Text width="100%">
    {" "}
    Download the template spreadsheet{" "}
    <Link
      color="blue"
      href="https://docs.google.com/spreadsheets/d/1lhXkwjfATvXG5MSb8GnY3bGGaXaD2-I1ivWxXcljyAc/edit?usp=sharing"
      isExternal
    >
      here.
    </Link>{" "}
  </Text>,
  <Text width="100%"> Fill out the spreadsheet. </Text>,
  <Text width="100%"> Upload the spreadsheet below! </Text>,
];

export function StudentUploadDialog(props: { isOpen: boolean; onClose: () => void }) {

  // PROPS AND VARIABLES DERIVED FROM PROPS
  const {isOpen, onClose} = props;

  // CONTEXT AND DISPATCH
  const dispatch = useDispatchContext();
  const {token} = useAppStateContext();

  // STATE
  const toast = useToast();
  const [fileToUpload, setFileToUpload] = useState<null | File>(null);
  const [isUploading, setIsUploading] = useState(false);

  // STATE MANAGEMENT
  const verifyFile = (files: FileList | null) => {
    const allowableTypes = excelAllowableTypes;
    
    if (files === null) {
      return;
    }

    if (files.length > 1) {
      dispatch({
        type: "error",
        payload: {
          type: "File Upload Error.",
          message: "Please upload only one file.",
        },
      });
      return;
    }

    if (!allowableTypes.includes(files[0].type)) {
      dispatch({
        type: "error",
        payload: {
          type: "File Upload Error.",
          message: "Please upload a .xlsx file.",
        },
      });
      return;
    }

    setFileToUpload(files[0]);
  };

  // ASYNC DATA UPDATES
  const {loading, setLoadingTrue} = useAction(async () => {
    if (fileToUpload === null) {
      throw new Error("File is null, unable to upload.");
    };

    const importResponse = await uploadRoster(token, dispatch, fileToUpload);

    if (importResponse) {
      const { numberOfInsertedStudents, duplicateStudents } = importResponse;

      toast({
        title: "Roster imported.",
        description: `Imported ${
          numberOfInsertedStudents
        } students. ${
          duplicateStudents !== ""
            ? `${duplicateStudents} were duplicates.`
            : ""
        }`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, dispatch);

  // JSX VARIABLES
  const renderedUploadInstructions = uploadInstructions.map((instruction, index) => (
    <UploadInstruction number={index + 1}>
      {instruction}
    </UploadInstruction>
  ));
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Bulk Import Students</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box>
              <Flex
                direction="row"
                justifyContent="space-between"
                paddingX="1em"
                marginBottom="1.5em"
              >
                {renderedUploadInstructions}
              </Flex>

              <Flex paddingX="1em" height="10em">
                <DragToUpload
                  fileToUpload={fileToUpload}
                  allowableTypes={excelAllowableTypes}
                  verifyFiles={verifyFile}
                />
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={setLoadingTrue}
              disabled={fileToUpload === null ? true : false}
              marginRight="1em"
              isLoading={loading}
            >
              Import
            </Button>

            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export function UploadInstruction(props: {
  number: number;
  children?: React.ReactNode;
}) {
  const { number, children } = props;

  return (
    <InfoCard minHeight="10em" width="30%">
      <InfoCardHeader>
        <Text textAlign="center" color="white" padding="0.5em" fontSize="1.5em">
          {number}
        </Text>
      </InfoCardHeader>

      <InfoCardContent __css={{ hyphens: "auto" }} padding="0.5em">
        {children}
      </InfoCardContent>
    </InfoCard>
  );
}
