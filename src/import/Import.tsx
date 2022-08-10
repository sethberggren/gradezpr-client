import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Select,
  Text,
  GridItem,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { faFilter, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ImportDialogue } from "./ImportDialog";
import { deleteAssignment } from "../controllers/actions";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import { SectionHeading } from "../common/SectionHeading";
import { useResponsive } from "../hooks/useResponsive";
import ActionButton from "../common/buttons/ActionButton";
import { ImportedAssignment } from "./ImportedAssignment";
import { ImportStateContextProvider } from "../controllers/importContext";
import NoStudentsOrCoursesModal from "./NoStudentsOrCoursesModal";

export default function Import(props: { displayName: string }) {
  const { displayName } = props;

  const {
    isOpen: importMainIsOpen,
    onOpen: importMainOnOpen,
    onClose: importMainOnClose,
  } = useDisclosure();

  const {
    isOpen: noStudentsOrCoursesIsOpen,
    onOpen: noStudentsOrCoursesOnOpen,
    onClose: noStudentsOrCoursesOnClose,
  } = useDisclosure();

  const { userCourses, userStudents } = useAppStateContext();
  const isMdOrSmaller = useResponsive();

  const handleOpen = () => {
    if (
      userCourses.length === 0 ||
      userStudents.length === 0 ||
      userCourses === undefined ||
      userStudents === undefined
    ) {
      noStudentsOrCoursesOnOpen();
      return;
    }

    importMainOnOpen();
  };

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Flex
        direction="row"
        justifyContent={"space-between"}
        alignItems="center"
        marginBottom="2em"
        width="100%"
      >
        <SectionHeading title={displayName} />

        <ActionButton
          onClick={handleOpen}
          actionType="primary"
          aria-label="Import New Assignment"
        >
          {isMdOrSmaller ? (
            <FontAwesomeIcon icon={faPlusSquare} />
          ) : (
            "Import New Assignment"
          )}
        </ActionButton>
      </Flex>

      <ImportStateContextProvider>
        <ImportDialogue onClose={importMainOnClose} isOpen={importMainIsOpen} />
      </ImportStateContextProvider>

      <NoStudentsOrCoursesModal
        isOpen={noStudentsOrCoursesIsOpen}
        onClose={noStudentsOrCoursesOnClose}
      />

      <ImportedAssignments />
    </Flex>
  );
}

function ImportedAssignments() {
  // CONTEXT AND DISPATCH
  const { userCourses, userAssignments, token } = useAppStateContext();
  const dispatch = useDispatchContext();
  const isMdOrSmaller = useResponsive();

  console.log(userAssignments);

  // STATE
  const [courseFilter, setCourseFilter] = useState("All Classes");
  const [assignmentsInView, setAssignmentsInView] = useState(
    userAssignments.sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1))
  );

  // EFFECTS
  useEffect(() => {
    if (courseFilter === "All Classes") {
      setAssignmentsInView([...userAssignments]);
    } else {
      const newCoursesInView = userAssignments.filter(
        (assignment) => assignment.course === courseFilter
      );
      setAssignmentsInView(newCoursesInView);
    }
  }, [courseFilter]);

  useEffect(() => {
    setCourseFilter("All Classes");
    setAssignmentsInView(userAssignments);
  }, [userAssignments]);

  // JSX ELEMENTS

  const renderedCourseOptions = () =>
    ["All Classes", ...userCourses.map((course) => course.subject)].map(
      (val) => (
        <option value={val} key={val}>
          {val}
        </option>
      )
    );

  const renderedAssignments = () =>
    assignmentsInView.map((value) => (
      <ImportedAssignment
        assignment={value}
        key={value.id}
        handleDelete={() =>
          deleteAssignment(token, dispatch, userAssignments, value.id)
        }
      />
    ));

  return (
    <>
      <Stack
        maxWidth={isMdOrSmaller ? undefined : "60%"}
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginBottom="3em"
      >
        <Flex direction="row" justifyContent="center">
          <Flex alignItems="center" marginRight="1em">
            <FontAwesomeIcon icon={faFilter} />
          </Flex>

          <Select
            icon={<ChevronDownIcon />}
            variant="filled"
            size="md"
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            {renderedCourseOptions()}
          </Select>
        </Flex>

        <Flex
          direction="column"
          minWidth={isMdOrSmaller ? "50vw" : undefined}
          maxWidth={isMdOrSmaller ? "75vw" : undefined}
        >
          {assignmentsInView.length !== 0 ? (
            renderedAssignments()
          ) : (
            <GridItem colSpan={5} textAlign={"center"}>
              <Text>No assignments :( hit the button above to get started</Text>
            </GridItem>
          )}
        </Flex>
      </Stack>
    </>
  );
}
