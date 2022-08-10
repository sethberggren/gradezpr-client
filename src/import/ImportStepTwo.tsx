import { CheckCircleIcon, CopyIcon } from "@chakra-ui/icons";
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Heading,
  Grid,
  ModalFooter,
  Spinner,
  Button,
  RadioGroup,
  Stack,
  Flex,
  Tooltip,
  List,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ActionButton from "../common/buttons/ActionButton";
import { curveGrades } from "../controllers/actions";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import {
  useImportStateContext,
  useImportStateDispatch,
} from "../controllers/importContext";
import useAction from "../hooks/useAction";
import { useClipboard } from "../hooks/useClipboard";
import AssignmentInformationCard, {
  generateAssignmentStatistics,
} from "./AssignmentInformationCard";
import CurveMethodDisplay, { generateCurveMethods } from "./CurveMethodDisplay";
import ImportHelpTooltip from "./ImportHelpTooltip";
import ThreeButtonModalFooter from "./ThreeButtonModalFooter";
import { CurveOptions } from "@backend/services/curveGrades";

const curveMethodTooltipContent: { heading: string; body: string }[] = [
  {
    heading: "Linear Curve",
    body: "Scales your current minimum and maximum grades to the desired minimum and maximum grades.",
  },
  {
    heading: "Mean and Standard Deviation Curve",
    body: "Scales your grades to the desired mean and standard deviation.",
  },
  {
    heading: "Highest Score Curve",
    body: "Subracts the highest score from 100, then adds that amount of points to each grade.",
  },
  {
    heading: "Second Highest Score Curve",
    body: "Just like the highest score curve, but subtracts the second highest score from 100.",
  },
];

export function ImportStepTwo(props: { onClose: () => void }) {
  // PROPS AND VARIABLES DERIVED FROM PROPS

  const { onClose } = props;

  // CONTEXT AND DISPATCH
  const { userAssignments, token } = useAppStateContext();
  const dispatch = useDispatchContext();

  const {
    assignmentReturned,
    importedAssignmentCurveString,
    fileUpload,
    gDrive,
  } = useImportStateContext();
  const importDispatch = useImportStateDispatch();

  // STATE
  const [curveOptions, setCurveOptions] = useState(
    {} as {
      max: string;
      min: string;
      mean: string;
      std: string;
    }
  );

  const [selectedCurveOption, setSelectedCurveOption] = useState(0);
  const { hasCopied, onCopy } = useClipboard(importedAssignmentCurveString);

  // STATE MANAGEMENT
  const handleCurveOptions = (
    numberString: string,
    property: keyof typeof curveOptions
  ) => {
    const newCurveOptions = { ...curveOptions };
    newCurveOptions[property] = numberString;

    setCurveOptions(newCurveOptions);
  };

  const handleRadio = (val: string) => {
    setSelectedCurveOption(parseInt(val));
  };

  const curveMethods = generateCurveMethods(handleCurveOptions);
  const assignmentStatistics = generateAssignmentStatistics(assignmentReturned);

  // ASYNC DATA UPDATES
  const { loading, setLoadingTrue } = useAction(async () => {
    const curveMethod = curveMethods[selectedCurveOption].backendName;

    const curveOptionsAsNums: CurveOptions = {
      min: parseFloat(curveOptions.min),
      max: parseFloat(curveOptions.max),
      mean: parseFloat(curveOptions.mean),
      std: parseFloat(curveOptions.std),
    };

    await curveGrades(
      token,
      dispatch,
      importDispatch,
      assignmentReturned,
      userAssignments,
      curveMethod,
      curveOptionsAsNums,
      gDrive.selected,
      fileUpload.toUpload
    );
  }, dispatch);

  // JSX VARIABLES
  const curveMethodTooltip = (
    <ImportHelpTooltip title="Curve Methods">
      <UnorderedList spacing="0.5rem">
        {curveMethodTooltipContent.map((content) => (
          <ListItem>
            <Text fontWeight="bold">{content.heading}: </Text>{" "}
            <Text>{content.body}</Text>
          </ListItem>
        ))}
      </UnorderedList>
    </ImportHelpTooltip>
  );

  const importGradesButtonGroup = (
    <ActionButton
      actionType="proceed"
      disabled={loading}
      onClick={setLoadingTrue}
      id="confirmImport"
    >
      {loading ? <Spinner /> : "Import"}
    </ActionButton>
  );

  const cancelButton = (
    <Button variant="ghost" onClick={onClose}>
      {importedAssignmentCurveString === "" ? "Cancel" : "Done"}
    </Button>
  );

  const doneImportingGradesButtonGroup = (
    <Tooltip hasArrow label={hasCopied ? "" : "Copy grades to clipboard."}>
      <ActionButton
        actionType="proceed"
        width="5em"
        onClick={() => onCopy()}
        aria-label="copy-grades-button"
      >
        {hasCopied ? <CheckCircleIcon /> : <CopyIcon />}
      </ActionButton>
    </Tooltip>
  );

  const modalActionButtons: [JSX.Element, JSX.Element, JSX.Element] = [
    curveMethodTooltip,
    importedAssignmentCurveString === ""
      ? importGradesButtonGroup
      : doneImportingGradesButtonGroup,
    cancelButton,
  ];

  const renderedAssignmentStatistics = assignmentStatistics.map((stat) => (
    <AssignmentInformationCard
      key={stat.name}
      name={stat.name}
      detail={stat.detail}
    />
  ));

  const renderedCurveMethods = curveMethods.map((val, index) => (
    <CurveMethodDisplay
      currentSelectedIndex={selectedCurveOption}
      index={index}
      curveMethod={val}
    />
  ));

  return (
    <ModalContent>
      <ModalHeader maxWidth="90%">
        Import {assignmentReturned.assignmentName}{" "}
      </ModalHeader>
      <ModalCloseButton aria-label="Close Import Assignment Modal"/>

      <ModalBody>
        <Box>
          <Box marginBottom="1em">
            <Heading as="h4" size="md" marginBottom="1em">
              Assignment Information
            </Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {renderedAssignmentStatistics}
            </Grid>
          </Box>

          <Box marginBottom="1em">
            <Heading as="h4" size="md" marginBottom="1em">
              Curve Method
            </Heading>
            <RadioGroup onChange={handleRadio} value={selectedCurveOption}>
              <Stack>{renderedCurveMethods}</Stack>
            </RadioGroup>
          </Box>
        </Box>
      </ModalBody>

      <ThreeButtonModalFooter buttons={modalActionButtons} />
    </ModalContent>
  );
}