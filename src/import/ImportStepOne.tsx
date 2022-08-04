import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Button,
  Spinner,
  ModalFooter,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Center,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { isEmpty } from "../services/helperFunctions";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import { importFile, verifyFile } from "../controllers/actions";
import { DragToUpload, excelAllowableTypes } from "../common/DragToUpload";
import ActionButton from "../common/buttons/ActionButton";
import useBoolean from "../hooks/useBoolean";
import useAction from "../hooks/useAction";
import { GoogleDriveSearch } from "./GoogleDriveSearch";
import ImportHelpTooltip from "./ImportHelpTooltip";
import ThreeButtonModalFooter from "./ThreeButtonModalFooter";
import {
  useImportStateContext,
  useImportStateDispatch,
} from "../controllers/importContext";

type ImportTab = {
  title: string;
  component: JSX.Element;
  helpButtonInfo: JSX.Element;
};

export function ImportStepOne(props: { onClose: () => void }) {
  // PROPS AND VARIABLES DERIVED FROM PROPS
  const { onClose } = props;

  // CONTEXT AND DISPATCH
  const { userCourses, token } = useAppStateContext();
  const dispatch = useDispatchContext();

  const { gDrive, fileUpload } = useImportStateContext();
  const importDispatch = useImportStateDispatch();

  // STATE
  const [
    userHasSelectedFile,
    { on: setUserHasSelectedFileTrue, off: setUserHasSelectedFileFalse },
  ] = useBoolean(false);
  const [selectedClass, setSelectedClass] = useState(userCourses[0].subject);
  const [tabIndex, setTabIndex] = useState(0);

  // STATE MANAGEMENT
  // EFFECTS
  useEffect(() => {
    if (fileUpload.toUpload.name) {
      setUserHasSelectedFileTrue();
    } else if (!isEmpty(gDrive.selected!)) {
      setUserHasSelectedFileTrue();
    } else {
      setUserHasSelectedFileFalse();
    }
  }, [gDrive.selected, fileUpload.toUpload]);

  // ASYNC DATA UPDATES
  const { loading, setLoadingTrue } = useAction(
    () =>
      importFile(
        token,
        dispatch,
        importDispatch,
        selectedClass,
        gDrive.selected,
        fileUpload.toUpload
      ),
    dispatch
  );

  // JSX VARIABLES
  const importTabs: ImportTab[] = [
    {
      title: "File Upload",
      component: (
        <>
          <Center>
            <Box height="25vh" width="90%">
              <DragToUpload
                allowableTypes={excelAllowableTypes}
                verifyFiles={(files: FileList | null) =>
                  verifyFile(dispatch, importDispatch, files)
                }
                fileToUpload={
                  fileUpload.toUpload.name === undefined
                    ? null
                    : fileUpload.toUpload
                }
              />
            </Box>
          </Center>
        </>
      ),
      helpButtonInfo: (
        <Text padding="1rem" width="100%">
          Select this option to upload Excel files. Make sure the file has both
          a "Student ID" column and a "Grade" column.
        </Text>
      ),
    },
    {
      title: "Google Sheets",
      component: <GoogleDriveSearch />,
      helpButtonInfo: (
        <Text padding="1rem" width="100%">
          Select this option to upload Google Sheets files. Make sure the file
          is a Google Forms response sheet.
        </Text>
      ),
    },
  ];

  const modalActionButtons: [JSX.Element, JSX.Element, JSX.Element] = [
    <ImportHelpTooltip title={importTabs[tabIndex].title}>
      {importTabs[tabIndex].helpButtonInfo}
    </ImportHelpTooltip>,
    <ActionButton
      actionType="proceed"
      onClick={setLoadingTrue}
      disabled={!userHasSelectedFile || loading}
    >
      {loading ? <Spinner /> : !userHasSelectedFile ? "Select an item" : "Next"}
    </ActionButton>,
    <Button variant="ghost" onClick={onClose}>
      {" "}
      Cancel{" "}
    </Button>,
  ];

  const renderedCourseSelect = userCourses.map((val) => (
    <option value={val.subject} key={val.subject}>
      {val.subject}
    </option>
  ));

  const renderedTabTitles = importTabs.map((tab) => (
    <Tab key={tab.title}>{tab.title}</Tab>
  ));

  const renderedTabPanels = importTabs.map((tab) => (
    <TabPanel key={`${tab.title}-component`}>
      {tab.component}
    </TabPanel>
  ));

  return (
    <ModalContent>
      <ModalHeader>Import Assignment</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <Text> Select Class: </Text>
        <Select
          onChange={(e) => setSelectedClass(e.target.value)}
          marginBottom="2em"
          aria-label="select-class-for-assignment"
          variant="flushed"
        >
          {renderedCourseSelect}
        </Select>
        <Tabs
          isFitted
          variant="enclosed"
          colorScheme="accent"
          onChange={(index) => setTabIndex(index)}
        >
          <TabList>
            {renderedTabTitles}
          </TabList>

          <TabPanels>
            {renderedTabPanels}
          </TabPanels>
        </Tabs>
      </ModalBody>

      <ThreeButtonModalFooter buttons={modalActionButtons} />
    </ModalContent>
  );
}