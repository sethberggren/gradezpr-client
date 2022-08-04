import { fill, uniqueId } from "cypress/types/lodash";
import { ObjectTyped } from "object-typed";
import { RegisterForm, registerFormFieldLabels } from "./registerAndDelete.cy";

export const getByAriaLabel = (ariaLabel: string) => {
  return cy.get(`[aria-label = '${ariaLabel}']`);
};

export const BASENAME = "gradezpr";

export const getInputByLabel = (label: string) => {
  return cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id: string | undefined) => {
      if (id === undefined) {
        throw new Error("Could not find input by label.");
      } else {
        return cy.get(`#${id}`);
      }
    });
};

export const fillOutStringForm = <K extends { [key: string]: string }>(
  labels: K,
  values: K
) => {
  for (const key of ObjectTyped.keys(labels)) {
    const label = labels[key];
    const value = values[key];

    getInputByLabel(label).type(value);
    getInputByLabel(label).should("have.value", value);
  }
};

export const clearStringForm = <K extends { [key: string]: string }>(
  labels: K
) => {
  for (const key of ObjectTyped.keys(labels)) {
    const label = labels[key];

    getInputByLabel(label).clear();
    getInputByLabel(label).should("have.value", "");
  }
};

export const appUrl = (url?: string) =>
  url
    ? `http://localhost:3000/${BASENAME}/${url}`
    : `http://localhost:3000/${BASENAME}`;

export const menuButton = () => {
  return getByAriaLabel("Menu Button");
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

  cy.get("button")
    .contains(/login/i)
    .click();
};

export const defaultCourses = [
  "Mastering the Force",
  "Deciphering Painful Visions",
  "Lava Burns 101",
  "Diplomacy for Dummies"
].sort();

export const defaultStudents = [
  "Padme Amidala",
  "Bail Organa",
  "Obi-Wan Kenobi",
  "Mace Windu",
  "Shaak Ti",
];
