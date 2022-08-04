import { DeleteIcon, AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Stack,
  Flex,
  IconButton,
  Divider,
  Text,
  Input,
  useToast,
  AlertDescription,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import { addNewCourse, deleteCourse } from "../controllers/actions";
import { SectionHeading } from "../common/SectionHeading";
import { useResponsive } from "../hooks/useResponsive";
import useAction from "../hooks/useAction";
import useTextInput from "../hooks/useTextInput";

export default function ManageCourses() {
  // PROPS AND VARIABLES DERIVED FROM PROPS
  // CONTEXT AND DISPATCH
  const { userCourses, token } = useAppStateContext();
  const dispatch = useDispatchContext();
  const isMdOrSmaller = useResponsive();

  // STATE

  const [enteringNewCourse, setEnteringNewCourse] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(0);
  const [newCourse, setNewCourse] = useState("");

  // STATE MANAGEMENT

  const handleDelete = (id: number) => {
    setCourseToDelete(id);
    setDeletingTrue();
  };

  const handleTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCourse(e.target.value);
  }

  // EFFECTS
  // ASYNC DATA UPDATES
  const { loading, setLoadingTrue } = useAction(async () => {
    await addNewCourse(token, dispatch, userCourses, newCourse);
    setNewCourse("");
    setEnteringNewCourse(false);
  }, dispatch);

  const { loading: deleting, setLoadingTrue: setDeletingTrue } = useAction(
    async () => {
      await deleteCourse(token, dispatch, userCourses, courseToDelete);
   
    },
    dispatch
  );

  // JSX VARIABLES
  const renderedCourses = userCourses.map((course) => (
    <UserCourse
      name={course.subject}
      key={course.subject}
      handleDelete={() => handleDelete(course.id)}
    />
  ));

  return (
    <Flex width="100%" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        justifyContent="center"
        minWidth={isMdOrSmaller ? undefined : "30vw"}
        maxWidth={isMdOrSmaller ? undefined : "75vw"}
        width={isMdOrSmaller ? "90vw" : undefined}
      >
        <Box marginBottom="1em">
          <SectionHeading title="Your Classes" />
        </Box>

        <Stack spacing={2}>
          {userCourses.length === 0 && enteringNewCourse !== true ? (
            <Text>
              You have no courses! Hit the plus sign below to get started.{" "}
            </Text>
          ) : (
            renderedCourses
          )}

          {enteringNewCourse ? (
            <NewCourse
              loading={loading}
              setLoadingTrue={setLoadingTrue}
              newCourse={newCourse}
              setNewCourse={handleTextInput}
            />
          ) : (
            <IconButton
              aria-label="create-new-course"
              icon={<AddIcon />}
              size="md"
              onClick={() => setEnteringNewCourse(true)}
            />
          )}
        </Stack>
      </Flex>
    </Flex>
  );
}

function NewCourse(props: {
  newCourse: string;
  setNewCourse: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  setLoadingTrue: () => void;
}) {
  const { newCourse, setNewCourse, loading, setLoadingTrue } = props;

  return (
    <Flex direction="row" justifyContent="space-between">
      <Input
        variant="flushed"
        focusBorderColor="accent"
        value={newCourse}
        onChange={setNewCourse}
        width="85%"
      />

      <Flex>
        <IconButton
          aria-label="add-new-course"
          icon={<CheckCircleIcon />}
          size="md"
          colorScheme="secondary"
          isLoading={loading}
          onClick={setLoadingTrue}
        />
      </Flex>
    </Flex>
  );
}

function UserCourse(props: { name: string; handleDelete: () => void }) {
  const { name, handleDelete } = props;

  return (
    <>
      <Flex
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        key={name}
      >
        <Text>{name}</Text>
        <IconButton
          aria-label={`delete-course-${name}`}
          icon={<DeleteIcon />}
          size="md"
          colorScheme="secondary"
          onClick={handleDelete}
        />
      </Flex>

      <Divider borderColor="primary" />
    </>
  );
}
