import { InfoCard, InfoCardHeader, InfoCardContent } from "../common/InfoCard";
import { Text } from "@chakra-ui/react";
import { roundToNearestHundredth } from "../services/helperFunctions";
import { AssignmentDetails } from "@backend/services/getAssignmentStatistics";

export default function AssignmentInformationCard(props: { name: string; detail: string }) {
    const { name, detail } = props;
  
    return (
      <InfoCard height="6em">
        <InfoCardHeader height="70%" padding="0.25em">
          <Text textAlign="center" color="white">
            {name}
          </Text>
        </InfoCardHeader>
  
        <InfoCardContent height="30%" padding="0.25em">
          <Text>{detail}</Text>
        </InfoCardContent>
      </InfoCard>
    );
  }

export function generateAssignmentStatistics(assignmentDetails: AssignmentDetails) {
    const assignmentStatistics = [
      {
        name: "Mean Score",
        detail: roundToNearestHundredth(assignmentDetails.mean).toString(),
      },
      {
        name: "Median Score",
        detail: roundToNearestHundredth(assignmentDetails.median).toString(),
      },
      {
        name: "Standard Deviation",
        detail: roundToNearestHundredth(assignmentDetails.std).toString(),
      },
      {
        name: "Highest Score",
        detail: roundToNearestHundredth(
          assignmentDetails.highestScore
        ).toString(),
      },
      {
        name: "Second Highest Score",
        detail: roundToNearestHundredth(
          assignmentDetails.secondHighestScore
        ).toString(),
      },
    ];
  
    return assignmentStatistics;
  }