import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Grid,
  Flex,
  IconButton,
  Text,
  GridItem,
  useDisclosure,
  Select,
  Tooltip,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useAppStateContext,
  useDispatchContext,
} from "../../controllers/context";
import { deleteStudent } from "../../controllers/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faFilter,
  faUserPlus,
  faUsersSlash,
} from "@fortawesome/free-solid-svg-icons";
import { UserStudent } from "./UserStudent";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { StudentEditDialog } from "./StudentEditDialog";
import { StudentUploadDialog } from "./StudentUploadDialog";
import { useResponsive } from "../../hooks/useResponsive";
import { SectionHeading } from "../../common/SectionHeading";
import ActionButton from "../../common/buttons/ActionButton";
import useBoolean from "../../hooks/useBoolean";
import useAction from "../../hooks/useAction";
import useSortAndFilter from "../../hooks/useSortAndFilter";
import { StudentResponse } from "@backend/http/routes/students/studentsRoute";

export default function ManageStudents() {
  // CONTEXT AND DISPATCH
  const { userStudents, userCourses, token } = useAppStateContext();
  const dispatch = useDispatchContext();
  const isMdOrSmaller = useResponsive();

  // STATE
  const {
    isOpen: bulkImportIsOpen,
    onOpen: bulkImportOnOpen,
    onClose: bulkImportOnClose,
  } = useDisclosure();
  const {
    isOpen: editStudentIsOpen,
    onOpen: editStudentOnOpen,
    onClose: editStudentOnClose,
  } = useDisclosure();

  const {
    isOpen: deleteAllModalIsOpen,
    onOpen: deleteAllModalOnOpen,
    onClose: deleteAllModalOnClose,
  } = useDisclosure();

  const {
    filtered: studentsInView,
    filter: filterStudentsInView,
    clearFilter,
    sortAsc: sortStudentsAsc,
    sortDesc: sortStudentsDesc,
    setFiltered: setStudentsInView,
  } = useSortAndFilter(userStudents);

  const [isAscending, { on: ascendingTrue, off: ascendingFalse }] =
    useBoolean(true);

  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [sortMethod, setSortMethod] = useState<
    "lastNameAsc" | "lastNameDesc" | "firstNameAsc" | "firstNameDesc" | "noSort"
  >("noSort");

  const [studentToEdit, setStudentToEdit] = useState<
    | {
        type: "update";
        student: StudentResponse;
      }
    | {
        type: "new";
      }
  >({ type: "new" });

  // STATE MANAGEMENT
  const editButtonClicked = (studentToEdit: StudentResponse) => {
    setStudentToEdit({ type: "update", student: studentToEdit });
    editStudentOnOpen();
  };

  const newStudentClicked = () => {
    setStudentToEdit({ type: "new" });
    editStudentOnOpen();
  };

  // EFFECTS
  useEffect(() => {
    // effect to filter students when the filter is changed
    if (courseFilter === "All Courses") {
      clearFilter();
    } else {
      filterStudentsInView("courses", courseFilter);
    }
  }, [courseFilter]);

  useEffect(() => {
    // effect required to update the students in view when the userStudents state changes
    setStudentsInView(userStudents);
  }, [userStudents]);

  useEffect(() => {
    switch (sortMethod) {
      case "firstNameAsc": {
        sortStudentsAsc("firstName");
        ascendingTrue();
        break;
      }

      case "firstNameDesc": {
        sortStudentsDesc("firstName");
        ascendingFalse();
        break;
      }

      case "lastNameAsc": {
        sortStudentsAsc("lastName");
        ascendingTrue();
        break;
      }

      case "lastNameDesc": {
        sortStudentsDesc("lastName");
        ascendingFalse();
        break;
      }

      case "noSort": {
        // don't sort, this is used only when the component is first initialized.
        break;
      }
    }
  }, [sortMethod]);

  // ASYNC DATA UPDATES
  const {
    loading: confirmedDeleteAll,
    setLoadingTrue: confirmedDeleteAllTrue,
  } = useAction(
    async () => await deleteStudent(token, dispatch, userStudents),
    dispatch
  );

  // JSX VARIABLES

  const renderedCourseSelect = [
    "All Courses",
    ...userCourses.map((course) => course.subject),
  ].map((course) => (
    <option value={course} key={course}>
      {course}
    </option>
  ));

  const renderedSortSelect = [
    { display: "Last Name", mapping: "lastName" },
    { display: "First Name", mapping: "firstName" },
  ].map((item) => (
    <option value={item.mapping} key={item.mapping}>
      {item.display}
    </option>
  ));

  const studentsActionButtonGroup = (
    <Flex
      direction="row"
      width={isMdOrSmaller ? "100%" : undefined}
      justifyContent={isMdOrSmaller ? "center" : "space-between"}
    >
      <Tooltip hasArrow label="Add Student">
        <ActionButton
          aria-label="add-single-student"
          marginRight="0.5em"
          actionType="primary"
          onClick={newStudentClicked}
        >
          <FontAwesomeIcon icon={faUserPlus} />
        </ActionButton>
      </Tooltip>

      <Tooltip hasArrow label="Bulk Add Students">
        <ActionButton
          aria-label="upload-multiple-students"
          marginRight="0.5em"
          actionType="primary"
          onClick={bulkImportOnOpen}
        >
          <FontAwesomeIcon icon={faFileUpload} />
        </ActionButton>
      </Tooltip>

      <Tooltip hasArrow label="Delete All Students">
        <ActionButton
          aria-label="delete-all-students"
          actionType="primary"
          onClick={deleteAllModalOnOpen}
        >
          <FontAwesomeIcon icon={faUsersSlash} />
        </ActionButton>
      </Tooltip>
    </Flex>
  );

  const tableHeadersLg = (
    <Grid templateColumns="repeat(6, 1fr)" gap={2}>
      <GridItem>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row"
        >
          <Text textAlign="left" marginLeft="1em">
            Last Name
          </Text>
          <IconButton
            variant="ghost"
            aria-label="icon"
            icon={isAscending ? <ArrowUpIcon /> : <ArrowDownIcon />}
            size="md"
            onClick={() =>
              isAscending
                ? setSortMethod("lastNameDesc")
                : setSortMethod("lastNameAsc")
            }
          />
        </Flex>
      </GridItem>

      <GridItem>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>First Name</Text>
          <IconButton
            aria-label="icon"
            variant="ghost"
            icon={isAscending ? <ArrowUpIcon /> : <ArrowDownIcon />}
            size="md"
            onClick={() =>
              isAscending
                ? setSortMethod("firstNameDesc")
                : setSortMethod("firstNameAsc")
            }
          />
        </Flex>
      </GridItem>

      <GridItem>
        <Flex justifyContent="space-between" alignItems="center" height="100%">
          <Text>ID</Text>
        </Flex>
      </GridItem>

      <GridItem colSpan={3}>
        <Flex alignItems="center" justifyContent="flex-start" width="100%">
          <Box marginRight="1em">
            <FontAwesomeIcon icon={faFilter} />
          </Box>
          <Select
            maxWidth="10em"
            minWidth="5em"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            {renderedCourseSelect}
          </Select>
        </Flex>
      </GridItem>
    </Grid>
  );

  const tableHeadersSm = (
    <Flex
      direction="row"
      width="100%"
      maxHeight="10em"
      minHeight="7em"
      justifyContent="center"
    >
      <Grid
        templateColumns="15% 1fr 15%"
        gridColumnGap="5%"
        width="100%"
        maxWidth="75%"
      >
        <GridItem display="flex" justifyContent="flex-end" alignItems="center">
          <Icon>
            <ArrowUpDownIcon />
          </Icon>
        </GridItem>

        <GridItem display="flex" alignItems="center">
          <Select
            onChange={(e) =>
              sortStudentsAsc(e.target.value as keyof StudentResponse)
            }
          >
            {renderedSortSelect}
          </Select>
        </GridItem>

        <GridItem></GridItem>

        <GridItem display="flex" justifyContent="flex-end" alignItems="center">
          <Box>
            <FontAwesomeIcon icon={faFilter} />
          </Box>
        </GridItem>

        <GridItem display="flex" alignItems="center">
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            {renderedCourseSelect}
          </Select>
        </GridItem>

        <GridItem></GridItem>
      </Grid>
    </Flex>
  );

  const renderedStudentsInView = studentsInView.map((student) => (
    <UserStudent
      student={student}
      key={student.externalId}
      editStudentButtonHandler={editButtonClicked}
      handleDelete={() =>
        deleteStudent(token, dispatch, userStudents, student.id)
      }
    />
  ));

  return (
    <Box>
      <Flex
        direction="row"
        flexWrap="wrap"
        alignItems="flex-start"
        justifyContent={isMdOrSmaller ? "center" : "space-between"}
        width={isMdOrSmaller ? "100%" : undefined}
        marginBottom={isMdOrSmaller ? "1em" : "1em"}
      >
        <Box marginBottom={isMdOrSmaller ? "1.5em" : "1em"}>
          <SectionHeading title="Your Students" />
        </Box>

        {studentsActionButtonGroup}
      </Flex>

      <Flex
        direction="column"
        paddingX={isMdOrSmaller ? "0em" : "7.5em"}
        id="student-container"
      >
        {isMdOrSmaller ? tableHeadersSm : tableHeadersLg}

        <Divider
          height="0.05rem"
          backgroundColor="black"
          marginBottom="1.5em"
          marginTop="0.5em"
        />

        <Flex
          direction="column"
          maxHeight={isMdOrSmaller ? undefined : undefined}
          overflowY="auto"
          alignItems={isMdOrSmaller ? "center" : undefined}
        >
          {studentsInView.length === 0 ? (
            <Flex justifyContent={"center"} alignItems={"center"}>
              <Text>
                No students! :( Hit the upload button to get started.{" "}
              </Text>
            </Flex>
          ) : (
            renderedStudentsInView
          )}
        </Flex>
      </Flex>

      <StudentEditDialog
        isOpen={editStudentIsOpen}
        onClose={editStudentOnClose}
        updateOrNew={studentToEdit}
      />

      <StudentUploadDialog
        isOpen={bulkImportIsOpen}
        onClose={bulkImportOnClose}
      />

      <ConfirmDeleteModal
        onClose={deleteAllModalOnClose}
        isOpen={deleteAllModalIsOpen}
        setConfirmedDelete={confirmedDeleteAllTrue}
      />
    </Box>
  );
}