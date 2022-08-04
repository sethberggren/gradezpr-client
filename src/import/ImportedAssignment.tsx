import { Grid, GridItem, Flex, Text, Skeleton } from "@chakra-ui/react";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionButton from "../common/buttons/ActionButton";
import { DeleteButtonWithPopover } from "../common/buttons/DeleteButtonWithPopover";
import { Card } from "../common/Card";
import SmallCardDivider from "../common/SmallCardDivider";
import { useResponsive } from "../hooks/useResponsive";
import { formatDate } from "../services/helperFunctions";
import { useClipboard } from "../hooks/useClipboard";
import { AssignmentResponse } from "@backend/services/curveGrades";

export function ImportedAssignment(props: {
  assignment: AssignmentResponse;
  handleDelete: () => Promise<void>;
}) {
  // PROPS AND VARIABLES DERIVED FROM PROPS
  const { assignment, handleDelete } = props;

  // CONTEXT AND DISPATCH
  const isMdOrSmaller = useResponsive();

  // STATE
  const { onCopy, hasCopied } = useClipboard(assignment.allGradesString);

  // JSX VARIABLES
  const largeDesign = (
    <Card
      variant="outline"
      width="100%"
      marginBottom="1em"
      id={`${assignment.name
        .replaceAll(" ", "")
        .replaceAll(".xlsx", "")}-container`}
    >
      <Grid templateColumns="repeat(5,1fr)" width="100%" height="5em">
        <GridItem colSpan={2} paddingLeft="1em">
          {" "}
          <Flex
            justifyContent="flex-start"
            alignItems="center"
            height="100%"
            width="calc(100%)"
          >
            <Text textOverflow="ellipsis" maxWidth="90%" overflow="hidden">
              {assignment.name}
            </Text>
          </Flex>{" "}
        </GridItem>
        <GridItem colSpan={1}>
          {" "}
          <Flex
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Text>{assignment.course}</Text>
          </Flex>{" "}
        </GridItem>
        <GridItem colSpan={1}>
          <Flex
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            textAlign="center"
            padding="0.5rem"
          >
            <Text>{formatDate(new Date(`${assignment.lastUpdated}`))}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex
            height="100%"
            width="100%"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <ActionButton
              actionType="secondary"
              onClick={() => onCopy()}
              aria-label={`copy-grades-${assignment.name}`}
            >
              {hasCopied ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faCopy} />
              )}
            </ActionButton>

            <DeleteButtonWithPopover
              aria-label={`delete-assignment-${assignment.name}`}
              handleDelete={handleDelete}
              colorScheme="secondary"
            />
          </Flex>
        </GridItem>
      </Grid>
    </Card>
  );

  const smallDesign = (
    <Card
      variant="outline"
      direction="column"
      marginBottom="1em"
      width="100%"
      padding="1em"
      justifyContent="center"
      alignItems="center"
      id={`${assignment.name
        .replaceAll(" ", "")
        .replaceAll(".xlsx", "")}-container`}
    >
      <Flex direction="column" alignItems="center">
        <Text
          textAlign="center"
          textOverflow="ellipsis"
          overflowWrap="anywhere"
        >
          {assignment.name}
        </Text>

        <SmallCardDivider />

        <Flex>
          <Text>{assignment.course}</Text>
        </Flex>

        <SmallCardDivider />

        <Flex>
          <Text>{formatDate(new Date(assignment.lastUpdated))}</Text>
        </Flex>

        <SmallCardDivider />

        <Flex
          minWidth="50%"
          maxWidth="75%"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <ActionButton actionType="secondary" onClick={() => onCopy()}>
            {hasCopied ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faCopy} />
            )}
          </ActionButton>

          <DeleteButtonWithPopover
            handleDelete={handleDelete}
            colorScheme="secondary"
          />
        </Flex>
      </Flex>
    </Card>
  );

  return <>{isMdOrSmaller ? smallDesign : largeDesign}</>;
}
