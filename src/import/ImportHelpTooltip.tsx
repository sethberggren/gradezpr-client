import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/react";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";

export default function ImportHelpTooltip(props: {
    title: string;
    children: React.ReactNode;
  }) {
    const { title, children } = props;
  
    return (
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Button>
        </PopoverTrigger>
  
        <PopoverContent
          bg={"primary.500"}
          color="white"
          _focus={{ borderColor: "secondary.500" }}
        >
          <PopoverArrow bg={"primary.500"} />
  
          <PopoverHeader>{title}</PopoverHeader>
  
          <PopoverCloseButton />
  
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }