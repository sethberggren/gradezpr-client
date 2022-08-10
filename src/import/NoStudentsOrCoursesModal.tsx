import {
  Flex,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ActionButton from "../common/buttons/ActionButton";
import { useAppStateContext } from "../controllers/context";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";

function isEmptyArrayOrUndefined(arr: any[]): boolean {
  return arr.length === 0 || !arr;
}

export default function NoStudentsOrCoursesModal(
  props: Omit<ModalProps, "children">
) {
  const { isOpen, onClose } = props;

  const { userStudents, userCourses } = useAppStateContext();
  const navigate = useNavigate();

  const [hasNoStudents, setHasNoStudents] = useState(
    isEmptyArrayOrUndefined(userStudents)
  );
  const [hasNoCourses, setHasNoCourses] = useState(
    isEmptyArrayOrUndefined(userCourses)
  );

  useEffect(() => {
    setHasNoStudents(isEmptyArrayOrUndefined(userStudents));
    setHasNoCourses(isEmptyArrayOrUndefined(userCourses));
  }, [userCourses, userStudents]);

  const handleButtonClick = (route: "students" | "courses") => {
    onClose();

    navigate(routes[route]);
  };

  const modalText = (
    <Text marginBottom="1rem">
      Gradezpr has detected that you may have no courses or students. You
      currently have:
      <UnorderedList paddingLeft="1rem" paddingY="1rem">
        <ListItem>
          {hasNoStudents ? 0 : userStudents.length}{" "}
          {userStudents.length !== 1 ? " students" : " student"}
        </ListItem>

        <ListItem>
          {hasNoCourses ? 0 : userCourses.length}{" "}
          {userCourses.length !== 1 ? " courses" : " course"}
        </ListItem>
      </UnorderedList>
      Gradezpr needs at least one course and at least one student to start
      importing grades. You can add students and courses with the buttons below!
    </Text>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Oops!</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {modalText}

          <Stack
            direction="column"
            width="100%"
            alignItems="center"
            spacing="1rem"
            marginBottom="1rem"
          >
            <ActionButton
              actionType="proceed"
              width="50%"
              onClick={() => handleButtonClick("courses")}
            >
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                style={{ marginRight: "0.5rem" }}
              />{" "}
              Add Courses
            </ActionButton>

            <ActionButton
              actionType="proceed"
              width="50%"
              onClick={() => handleButtonClick("students")}
            >
              <FontAwesomeIcon icon={faGraduationCap} style={{marginRight: "0.5rem"}}/> Add Students{" "}
            </ActionButton>
          </Stack>
        </ModalBody>

      </ModalContent>
    </Modal>
  );
}
