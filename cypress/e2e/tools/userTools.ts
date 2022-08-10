import { fillOutStringForm } from "./formTools";
import { appUrl } from "./generalTools";

export type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

export const registerFormFieldLabels: RegisterForm = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    confirmedPassword: "Confirm Password",
  };
  

export const testUser: RegisterForm = {
  firstName: "Anakin",
  lastName: "Skywalker",
  email: "anakin_skywalker@theforce.net",
  password: "ch0s3n1*",
  confirmedPassword: "ch0s3n1*",
};

export const loginUser = () => {
  const email = testUser.email;
  const password = testUser.password;

  const loginFormLabels = {
    email: "Email",
    password: "Password",
  };

  const loginFormValues = {
    email: email,
    password: password,
  };

  cy.visit(appUrl("login"));

  fillOutStringForm(loginFormLabels, loginFormValues);

  cy.get("button").contains(/login/i).click();
};
