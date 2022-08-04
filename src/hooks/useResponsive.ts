import { useMediaQuery } from "@chakra-ui/react";
import { useAppStateContext } from "../controllers/context";

const breakpoints = {
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoints = keyof typeof breakpoints;

export function useResponsive(breakpoint?: Breakpoints) {

  const {windowWidth} = useAppStateContext();

  if (breakpoint) {
    return windowWidth <= breakpoints[breakpoint];
  } else {
    return windowWidth <= 992;
  }
}
