import { extendTheme } from "@chakra-ui/react";

const Theme = extendTheme({
  colors: {
    primary: {
      100: "#9B9EAB",
      200: "#9093A2",
      300: "#858999",
      400: "#7A7E90",
      500: "#696D7D",
      600: "#666A7A",
      700: "#5D606F",
      800: "#545764",
      900: "#4A4D59",
    },
    secondary: {
      50: "#E7EEE7",
      100: "#DBE6DB",
      200: "#CFDDCF",
      300: "#C3D5C3",
      400: "#B7CCB7",
      500: "#ABC4AB",
      600: "#A0BBA0",
      700: "#94B394",
      800: "#88AA88",
      900: "#7CA27C",
    },
    accent: {
      100: "#DFFAFE",
      200: "#BFF2FE",
      300: "#9FE5FD",
      400: "#86D6FB",
      500: "#5FBFF9",
      600: "#4596D6",
      700: "#2F71B3",
      800: "#1E5090",
      900: "#123877",
    },
  },
  shadows: {
    heading: "0.25em 0.25em #ABC4AB",
  },
  borders: {
    primary: "0.2em solid #696D7D",
    secondary: "0.1em solid #ABC4AB",
    accent: "0.1em solid #5FBFF9",
  },
});

export default Theme;
