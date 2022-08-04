import { Flex, Link, Text } from "@chakra-ui/react";
import { faBook, faBug, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useResponsive } from "./hooks/useResponsive";
import { routes } from "./routes";
import { Link as ReactRouterLink } from "react-router-dom";

const footerLinks: { text: string; icon: JSX.Element; link: string }[] = [
  {
    text: "About Gradezpr",
    icon: <FontAwesomeIcon icon={faBook} />,
    link: routes.about,
  },
  {
    text: "Submit a Bug/Feature Request",
    icon: <FontAwesomeIcon icon={faBug} />,
    link: routes.featureRequest,
  },
//   {
//       text: "Get the Extension",
//       icon: <FontAwesomeIcon icon={faGlobe} />,
//       link: routes.extension
//   }
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
      <Text display="flex" alignItems="center" textAlign="center">Made with 💙 by iceberggren ❄️</Text>

      {footerLinks.map((footerLink) => (
        <FooterLink
          text={footerLink.text}
          icon={footerLink.icon}
          link={footerLink.link}
          key={footerLink.text}
        />
      ))}
    </Flex>
  );
}

function FooterLink(props: { text: string; icon: JSX.Element; link: string }) {
  const { text, icon, link } = props;

  return (
    <Link as={ReactRouterLink} to={link} display="flex" alignItems="center" paddingY="0.25rem" textAlign="center">
      <Text>
      {text} {icon} 
      </Text>
    </Link>
  );
}
