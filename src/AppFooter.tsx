import { Flex, Link, Text } from "@chakra-ui/react";
import {
  faBook,
  faBug,
  faFileContract,
  faGavel,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useResponsive } from "./hooks/useResponsive";
import { routes } from "./routes";
import { Link as ReactRouterLink } from "react-router-dom";
import { useAppStateContext } from "./controllers/context";

type FooterLink = {
  text: string;
  icon: JSX.Element;
  link: string;
  authRequired: boolean;
  isExternal: boolean;
};

const footerLinks: FooterLink[] = [
  {
    text: "About Gradezpr",
    icon: <FontAwesomeIcon icon={faBook} />,
    link: routes.about,
    authRequired: false,
    isExternal: false,
  },
  {
    text: "Submit a Bug/Feature Request",
    icon: <FontAwesomeIcon icon={faBug} />,
    link: routes.featureRequest,
    authRequired: true,
    isExternal: false,
  },
  {
    text: "Privacy Policy",
    icon: <FontAwesomeIcon icon={faFileContract} />,
    link: routes.privacyPolicy,
    authRequired: false,
    isExternal: false,
  },
  {
    text: "Get the Extension",
    icon: <FontAwesomeIcon icon={faGlobe} />,
    link: "https://chrome.google.com/webstore/detail/gradezpr-extension/kdhmclflakomgdeedipbnoddneiaamea",
    authRequired: false,
    isExternal: true,
  },
];

export default function AppFooter() {
  const isMdOrSmaller = useResponsive("md");

  return (
    <Flex
      width="100%"
      wrap="wrap"
      backgroundColor="whitesmoke"
      minHeight="3rem"
      paddingX={isMdOrSmaller ? "2rem" : "4rem"}
      justifyContent="space-evenly"
    >
      <Text display="flex" alignItems="center" textAlign="center">
        Made with 💙 by{" "}
        <a
          style={{ margin: "0 0.3rem", textDecoration: "underline" }}
          href="https://www.iceberggren.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          iceberggren
        </a>{" "}
        ❄️
      </Text>

      {footerLinks.map((footerLink) => (
        <FooterLink {...footerLink} />
      ))}
    </Flex>
  );
}

function FooterLink(props: FooterLink) {
  const { text, icon, link, authRequired, isExternal } = props;

  const { authenticated } = useAppStateContext();

  if (isExternal) {
    return (
      <Link
        as="a"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        display="flex"
        alignItems="center"
        paddingY="0.25rem"
        textAlign="center"
      >
        <Text>
          {text} {icon}
        </Text>
      </Link>
    );
  }

  if (authRequired) {
    return authenticated ? (
      <Link
        as={ReactRouterLink}
        to={link}
        display="flex"
        alignItems="center"
        paddingY="0.25rem"
        textAlign="center"
      >
        <Text>
          {text} {icon}
        </Text>
      </Link>
    ) : null;
  } else {
    return (
      <Link
        as={ReactRouterLink}
        to={link}
        display="flex"
        alignItems="center"
        paddingY="0.25rem"
        textAlign="center"
      >
        <Text>
          {text} {icon}
        </Text>
      </Link>
    );
  }
}

// function ExternalFooterLink(props: FooterLink) {
//   const { text, icon, link, authRequired, isExternal } = props;

//   const { authenticated } = useAppStateContext();

//   const LinkToReturn = (
//     <Link
//       as="a"
//       href={link}
//       target="_blank"
//       rel="noopener noreferrer"
//       display="flex"
//       alignItems="center"
//       paddingY="0.25rem"
//       textAlign="center"
//     >
//       <Text>
//         {text} {icon}
//       </Text>
//     </Link>
//   );

//   if (authRequired) {
//     return authenticated ? LinkToReturn : null;
//   } else {
//     return LinkToReturn;
//   }
// }
