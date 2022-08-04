import { CSSObject, Flex, FlexProps } from "@chakra-ui/react";

type CardVariants = "raised" | "sunken" | "outline" | "solid";
type CardColors = "primary" | "secondary" | "accent" | "warning";

const cardColors: { [key in CardColors]: string } = {
  primary: "primary.500",
  secondary: "secondary.500",
  accent: "accent.500",
  warning: "red"
};

export function Card(
  props: {
    variant: CardVariants;
    cardColor?: CardColors;
  } & FlexProps
) {
  const { variant, cardColor, children, ...rest } = props;

  const setColor = cardColor ? cardColors[cardColor] : "primary.500";

  const roundedStyles: CSSObject = {
    borderRadius: "0.375rem",
  };

  const variantStyles: { [variant in CardVariants]: CSSObject } = {
    raised: {
      boxShadow: "0 0.1em 0.2em 0 rgba(0, 0, 0, 0.2)",
    },
    sunken: {
      boxShadow: "0.2em 0.2em 0.2em 0.2em rgba(0, 0, 0, 0.2) inset",
    },

    // outline could have backgroundColor: white or something else.
    outline: {
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: setColor,
    },
    solid: {
      backgroundColor: setColor,
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: setColor,
      color: "white",
    },
  };

  return (
    <Flex __css={{ ...variantStyles[variant], ...roundedStyles }} {...rest}>
      {children}
    </Flex>
  );
}
