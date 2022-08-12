import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Checkbox,
  ModalFooter,
  Button,
  Spinner,
  Flex,
  FormControl,
  FormLabel,
  RadioGroup,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createStudent, editStudent } from "../../controllers/actions";
import {
  useAppStateContext,
  useDispatchContext,
} from "../../controllers/context";
import ActionButton from "../../common/buttons/ActionButton";
import useAction from "../../hooks/useAction";
import { StudentResponse } from "@backend/http/routes/students/studentsRoute";

const newStudent: StudentResponse = {
  id: 0,
  firstName: "",
  lastName: "",
  externalId: "",
  courses: "",
};

export function StudentEditDialog(props: {
  isOpen: boolean;
  onClose: () => void;
  updateOrNew: { type: "update"; student: StudentResponse } | { type: "new" };
}) {
  // PROPS AND VARIABLES DERIVED FROM PROPS
  const { isOpen, onClose, updateOrNew } = props;
  const { type } = updateOrNew;

  // CONTEXT AND DISPATCH
  const { userCourses, userStudents, token } = useAppStateContext();
  const dispatch = useDispatchContext();

  // STATE
  const [editedStudent, setEditedStudent] = useState(newStudent);
  const [courseCheckbox, setCourseCheckbox] = useState<string[]>([]);

  // STATE MANAGEMENT
  const handleCourseCheckbox = (values: string[]) => {
    const newCourseCheckbox = [...values];

    const courseString = newCourseCheckbox.reduce((prev, curr) => {
      return `${curr}, ${prev}`;
    }, "");

    setEditedStudent({ ...editedStudent, courses: courseString.slice(0, -2) });

    setCourseCheckbox(newCourseCheckbox);
  };

  const resetOnClose = () => {
    setEditedStudent({
      id: 0,
      firstName: "",
      lastName: "",
      externalId: "",
      courses: "",
    } as StudentResponse);

    onClose();
  };

  // EFFECTS
  useEffect(() => {
    // initialize effect.  Determine whether the student is new or an update, and update the checkboxes accordingly.
    if (type === "new") {
      setEditedStudent(newStudent);
      setCourseCheckbox([]);
    } else {
      setEditedStudent(updateOrNew.student);
      const studentCourses = updateOrNew.student.courses
        .split(",")
        .map((val) => val.trim());

      setCourseCheckbox([...studentCourses]);
    }
  }, [userCourses, updateOrNew]);

  // effect to update course checkboxes when the user adds a new course.

  // useEffect(() => {
  //   setCourseCheckbox(
  //     userCourses.map((val) => {
  //       return {
  //         course: val.subject,
  //         selected: false,
  //       };
  //     })
  //   );
  // }, [userCourses]);

  // ASYNC DATA FETCHING
  const { loading, setLoadingTrue } = useAction(async () => {
    const postNewStudent = async () => {
      await createStudent(token, dispatch, userStudents, editedStudent);
    };

    const editNewStudent = async () => {
      await editStudent(token, dispatch, userStudents, editedStudent);
    };

    if (type === "update") {
      editNewStudent();
      onClose();
    } else {
      postNewStudent();
      onClose();
    }
  }, dispatch);

  // JSX VARIABLES

  const renderedCourseCheckboxes = userCourses.map((course) => {
    return (
      <Checkbox
        colorScheme="accent"
        key={`checkbox-${course.subject}-${
          type === "update" ? updateOrNew.student.externalId : "new"
        }`}
        value={course.subject}
      >
        {course.subject}
      </Checkbox>
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={resetOnClose} size="md">
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            {type === "update"
              ? `Edit ${updateOrNew.student.firstName} ${updateOrNew.student.lastName}`
              : "Create New Student"}
          </ModalHeader>
          <ModalCloseButton />

          <FormControl
            paddingX="1.5rem"
            mb="1rem"
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              setLoadingTrue();
            }}
          >
            <ModalBody>
              <FormLabel htmlFor="first-name-entry">First Name:</FormLabel>

              <Input
                value={editedStudent.firstName}
                marginBottom="1em"
                onChange={(e) =>
                  setEditedStudent({
                    ...editedStudent,
                    firstName: e.target.value,
                  })
                }
                placeholder={
                  type === "update" ? updateOrNew.student.firstName : ""
                }
                id="first-name-entry"
              />

              <FormLabel htmlFor="last-name-entry">Last Name:</FormLabel>

              <Input
                value={editedStudent.lastName}
                marginBottom="1em"
                onChange={(e) =>
                  setEditedStudent({
                    ...editedStudent,
                    lastName: e.target.value,
                  })
                }
                placeholder={
                  type === "update" ? updateOrNew.student.lastName : ""
                }
                id="last-name-entry"
              />

              <FormLabel htmlFor="id-entry">ID:</FormLabel>

              <Input
                id="id-entry"
                value={editedStudent.externalId}
                onChange={(e) =>
                  setEditedStudent({
                    ...editedStudent,
                    externalId: e.target.value,
                  })
                }
                marginBottom="1em"
                placeholder={
                  type === "update" ? updateOrNew.student.externalId : ""
                }
              />

              <FormLabel hmtlFor="courses-checkbox">Courses:</FormLabel>

              <CheckboxGroup
                onChange={handleCourseCheckbox}
                value={courseCheckbox}
              >
                <Stack direction="column">{renderedCourseCheckboxes}</Stack>
              </CheckboxGroup>
            </ModalBody>

            <ModalFooter>
              <ActionButton actionType="proceed" type="submit">
                {loading ? (
                  <Spinner />
                ) : type === "new" ? (
                  "Add Student"
                ) : (
                  "Update"
                )}
              </ActionButton>

              <Button variant="ghost" onClick={resetOnClose}>
                Cancel
              </Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
