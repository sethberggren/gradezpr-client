import { EditIcon } from "@chakra-ui/icons";
import { Grid, Flex, IconButton, Text } from "@chakra-ui/react";
import { DeleteButtonWithPopover } from "../../common/buttons/DeleteButtonWithPopover";
import { Card } from "../../common/Card";
import SmallCardDivider from "../../common/SmallCardDivider";
import { useResponsive } from "../../hooks/useResponsive";
import { StudentResponse } from "@backend/http/routes/students/studentsRoute";

export function UserStudent(props: {
  student: StudentResponse;
  editStudentButtonHandler: (studentToEdit: StudentResponse) => void;
  handleDelete: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { student, handleDelete, editStudentButtonHandler } = props;

  const isMdOrSmaller = useResponsive();

  const largeDisplay = (
    <Card variant="outline" marginBottom="0.5em">
      <Grid
        templateColumns="repeat(6, 1fr)"
        alignItems="center"
        padding="0.25em"
        width="100%"
      >
        <Flex>
          <Text marginLeft="1em" id={`student-last-${student.id}`}>
            {student.lastName}
          </Text>
        </Flex>

        <Text id={`student-first-${student.id}`}>{student.firstName}</Text>
        <Text id={`student-external-id=${student.externalId}`}>
          {student.externalId}
        </Text>
        <Text id={`student-course=${student.id}`}>{student.courses}</Text>

        <Flex justifyContent="center">
          <IconButton
            aria-label={`edit-${student.lastName}-${student.firstName}`}
            maxWidth="50%"
            icon={<EditIcon />}
            size="md"
            width="50%"
            variant="ghost"
            colorScheme="secondary"
            onClick={() => editStudentButtonHandler(student)}
          />
        </Flex>

        <Flex justifyContent="center">
          <DeleteButtonWithPopover
            aria-label={`delete-${student.lastName}-${student.firstName}`}
            handleDelete={handleDelete}
            buttonWidth="50%"
            colorScheme="secondary"
          />
        </Flex>
      </Grid>
    </Card>
  );

  const smallDisplay = (
    <Card
      variant="outline"
      direction="column"
      maxWidth="90vw"
      minWidth="75vw"
      alignItems="center"
      justifyContent="center"
      marginBottom="1em"
      padding="1em"
    >
      <Flex direction="column" alignItems="center">
        <Text fontWeight="600">{`${student.lastName}, ${student.firstName}`}</Text>

        <SmallCardDivider />

        <Text>{student.externalId}</Text>

        <SmallCardDivider />

        <Text>{student.courses}</Text>

        <SmallCardDivider />

        <Flex direction="row" width="50%" justifyContent="space-between">
          <Flex justifyContent="center">
            <IconButton
              aria-label="icon"
              maxWidth="50%"
              icon={<EditIcon />}
              size="md"
              width="50%"
              variant="ghost"
              colorScheme="secondary"
              onClick={() => editStudentButtonHandler(student)}
            />
          </Flex>

          <Flex justifyContent="center">
            <DeleteButtonWithPopover
              handleDelete={handleDelete}
              buttonWidth="50%"
              placement="bottom"
              colorScheme="secondary"
            />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );

  return <>{isMdOrSmaller ? smallDisplay : largeDisplay}</>;
}
