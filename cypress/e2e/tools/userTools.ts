import {
  fillOutStringForm,
  getByAriaLabel,
  getInputByLabel,
} from "./formTools";
import { appUrl } from "./generalTools";
import { v4 as uuid } from "uuid";

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


export const acknowledgePrivacyPolicy = () => {

  cy.get("input").check({force: true});

  cy.get("button").contains(/continue/i).click({force: true});
}

export const loginUser = (credentials?: {
  email: string;
  password: string;
}) => {
  const email = testUser.email;
  const password = testUser.password;

  const loginFormLabels = {
    email: "Email",
    password: "Password",
  };

  const loginFormValues = {
    email: credentials ? credentials.email : email,
    password: credentials ? credentials.password : password,
  };

  cy.visit(appUrl("login"));

  fillOutStringForm(loginFormLabels, loginFormValues);

  return cy.get("button").contains(/login/i).click();
};

export const createUuidUser = (dismissWelcome?: boolean) => {
  const password = uuid();

  const registerFormValues: RegisterForm = {
    firstName: uuid(),
    lastName: uuid(),
    email: `${uuid()}@gmail.com`,
    password: password,
    confirmedPassword: password,
  };

  cy.visit(appUrl("register"));
  fillOutStringForm(registerFormFieldLabels, registerFormValues);

  cy.get("button").contains(/next/i).click().then(() => {
    cy.wait(2000);

    acknowledgePrivacyPolicy();

    cy.wait(2000);
    if (dismissWelcome) {
      getByAriaLabel("Close tour modal").click();

      cy.wait(2000);
    }
  })

  return { email: registerFormValues.email, password: password };
};

const verifyLoginScreen = () => {
  cy.url().should("include", "/login");
  getInputByLabel("Email").should("be.visible");
  getInputByLabel("Password").should("be.visible");
  expect(localStorage.getItem("token")).to.be.null;
};

export const logoutUser = () => {
  getByAriaLabel("Menu Button").click();
  cy.wait(1000);
  cy.get("button").contains("Logout").click({ force: true });

  verifyLoginScreen();
};

export const deleteUser = () => {
  getByAriaLabel("Menu Button").click();
  cy.contains(/manage account/i).click();

  cy.url().should("include", "/settings/account");

  cy.contains(/delete your gradezpr account/i).click();
  cy.contains(/cancel/i).click();

  cy.contains(/delete your gradezpr account/i).should("be.visible");

  cy.contains(/delete your gradezpr account/i).click();
  cy.get("button")
    .contains(/yes, delete my account/i)
    .click()
    .then(() => {
      cy.url().should("include", "/settings/account-delete");
    });
};
