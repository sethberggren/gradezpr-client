import { Button, ButtonProps } from "@chakra-ui/react";
import { forwardRef, Ref } from "react";

const ActionButton = forwardRef(
  (
    props: ButtonProps & { actionType: "primary" | "secondary" | "proceed" },
    ref: Ref<HTMLButtonElement>
  ) => {
    const { actionType, ...rest } = props;

    if (actionType === "primary" || actionType === "secondary") {
      return (
        <Button
          variant={actionType === "primary" ? "outline" : "ghost"}
          colorScheme="secondary"
          ref={ref}
          {...rest}
        >
          {props.children}
        </Button>
      );
    } else {
      return (
        <Button colorScheme="accent" ref={ref} {...rest}>
          {props.children}
        </Button>
      );
    }
  }
);

export default ActionButton;
