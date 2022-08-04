import { Divider } from "@chakra-ui/react";

function SmallCardDivider(props: { width?: number }) {
  const { width } = props;

  return (
    <Divider
      borderBottom="primary"
      opacity="100%"
      marginY="0.5em"
      width={width ? width : "30%"}
    />
  );
}

export default SmallCardDivider;