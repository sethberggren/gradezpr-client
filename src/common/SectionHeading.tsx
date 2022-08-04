import { Heading } from "@chakra-ui/react";

export function SectionHeading(props: { title: string }) {
  const { title } = props;

  return (
    <Heading
      as="h1"
      fontSize="2em"
      fontWeight="bold"
      boxShadow="heading"
      display="inline"
      backgroundColor="white"
      paddingRight="0.5rem"
    >
      {title}
    </Heading>
  );
}
