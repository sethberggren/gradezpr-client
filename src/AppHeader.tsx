import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import { Flex, Heading, Box, Menu, MenuButton, Button, MenuList, MenuItem, Link } from "@chakra-ui/react";
import { faBolt, faChartLine, faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {Link as ReactRouterLink} from "react-router-dom";
import React from "react";
import { TMenuItem } from "./getMenuItems";
import AppFooter from "./AppFooter";

const isBeta = true;

export default function AppHeader(props: {children: React.ReactNode, settingsMenuItems: TMenuItem[], menuItems: TMenuItem[]}) {

    const {children, settingsMenuItems, menuItems} = props;
    const navigate = useNavigate();

    const renderedSettingsMenuItems = settingsMenuItems.map((item) => (
      <MenuItem
        onClick={() => navigate(item.route, { replace: true })}
        id={`${item.displayName.replaceAll(" ", "")}-menu-item`}
      >
        {item.displayName}
      </MenuItem>
    ));
  
  
    return (

      <> 
      <header>
        <Flex
          as={"nav"}
          width="100vw"
          height="4em"
          display="flex"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          bg="primary.500"
        >
          <Link to={"../import"} as={ReactRouterLink} marginLeft="1em">
            <Heading as="h1" color="white">

               <FontAwesomeIcon icon={faBolt} />
              {"        "} Gradezpr {isBeta ? <sup>{"(beta)"}</sup> : null}
             
            </Heading>
          </Link>
  
          <Box marginRight="1em">
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="secondary"
                aria-label="Menu Button"
              >
                <SettingsIcon />
              </MenuButton>
  
              <MenuList>
                {renderedSettingsMenuItems}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </header>

      <Box padding="1em" backgroundColor="white" minHeight="calc(95vh)">
        {children}
      </Box>
      
      <AppFooter />
      </>
      
      
    );
  }