import { useToast, Flex, Box, Center, Text } from "@chakra-ui/react";
import {
  faMouse,
  faHandPointer,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useEffect } from "react";
import { FileDrop } from "react-file-drop";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import { Action } from "../controllers/reducer";
import { arrToString } from "../services/helperFunctions";

export const excelAllowableTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export function DragToUpload(props: {
  fileToUpload: File | null;
  allowableTypes: string[] | null;
  verifyFiles: (files: FileList | null) => void;
}) {
  const { allowableTypes, verifyFiles, fileToUpload } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onTargetClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onDrop = (files: FileList | null) => {
    verifyFiles(files);
  };

  const onFileInputChange = (event: any) => {
    const files = event.target.files as FileList | null;

    verifyFiles(files);
  };

  const awaitingUpload = () => (
    <>
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-around"
        width="100%"
        height="100%"
      >
        <Flex direction="column" justifyContent={"center"}>
          <Box fontSize="2em">
            <FontAwesomeIcon icon={faMouse} />
          </Box>

          <Text>Drag and Drop</Text>
        </Flex>

        <Box height="90%" borderLeft="secondary" borderRadius="1em" />

        <Flex direction="column" justifyContent={"center"}>
          <Box fontSize="2em">
            <FontAwesomeIcon icon={faHandPointer} />
          </Box>

          <Text>Click to Upload</Text>
        </Flex>
      </Flex>
    </>
  );

  const receivedUpload = (fileToUpload: File) => (
    <>
      <Flex
        width="100%"
        height="100%"
        direction="column"
        justifyContent={"center"}
      >
        <Box fontSize="3em">
          <FontAwesomeIcon icon={faFileUpload} />
        </Box>

        <Text>{fileToUpload.name}</Text>
      </Flex>
    </>
  );

  return (
    <>
      <input
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
        data-testid="FileUpload"
        style={{display: "none", visibility: "hidden"}}
        accept={
          allowableTypes !== null ? arrToString(allowableTypes) : undefined
        }
      />

      <Box height="100%" width="100%">
        <FileDrop onTargetClick={onTargetClick} onDrop={onDrop}>
          <Box width="100%" height="90%">
            {fileToUpload === null
              ? awaitingUpload()
              : receivedUpload(fileToUpload)}
          </Box>
        </FileDrop>
      </Box>
    </>
  );
}
