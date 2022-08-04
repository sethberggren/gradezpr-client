import {
  faChalkboardTeacher,
  faFileImport,
  faGraduationCap,
  faLongArrowAltRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Import from "./import/Import";
import { routes } from "./routes";
import Account from "./settings/Account";
import ManageStudents from "./settings/manage-students/ManageStudents";
import ManageCourses from "./settings/ManageCourses";
import { Authentication, TokenTimeoutState } from "./Types";
import Logout from "./welcome/Logout";

export type TMenuItem = {
  route: string;
  displayName: string;
  component: JSX.Element;
  icon: JSX.Element;
};

export function getMenuItems() {
  const menuItems: TMenuItem[] = [
    {
      route: routes.import,
      displayName: "Imported Grades",
      component: <Import displayName="Imported Grades" />,
      icon: <FontAwesomeIcon icon={faFileImport} />,
    },
  ];

  return menuItems;
}

export function getSettingsMenuItems(tokenTimeoutState: TokenTimeoutState, authenticatedState: Authentication) {
  const settingsMenuItems: TMenuItem[] = [
    {
      route: routes.account,
      displayName: "Manage Account",
      component: <Account />,
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      route: routes.students,
      displayName: "Manage Students",
      component: <ManageStudents />,
      icon: <FontAwesomeIcon icon={faGraduationCap} />,
    },
    {
      route: routes.courses,
      displayName: "Manage Courses",
      component: <ManageCourses />,
      icon: <FontAwesomeIcon icon={faChalkboardTeacher} />,
    },
    {
      route: routes.logout,
      displayName: "Logout",
      component: (
        <Logout
          authenticatedState={authenticatedState}
          tokenTimeoutState={tokenTimeoutState}
          logoutOrTimeout="logout"
        />
      ),
      icon: <FontAwesomeIcon icon={faLongArrowAltRight} />,
    },
  ];

  return settingsMenuItems;
}
