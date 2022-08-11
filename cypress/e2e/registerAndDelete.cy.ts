import * as dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { ObjectTyped } from "object-typed";
import {
  fillOutStringForm,
  clearStringForm,
  getByAriaLabel,
} from "./tools/formTools";
import { appUrl, menuButton } from "./tools/generalTools";
import { acknowledgePrivacyPolicy, RegisterForm, registerFormFieldLabels } from "./tools/userTools";

const password = uuid();

const registerFormValues: RegisterForm = {
  firstName: uuid(),
  lastName: uuid(),
  email: `${uuid()}@gmail.com`,
  password: password,
  confirmedPassword: password,
};

const incorrectRegisterFormValues: RegisterForm = {
  firstName: uuid(),
  lastName: uuid(),
  email: `${uuid()}@gmail.com`,
  password: uuid(),
  confirmedPassword: password,
};

describe("register flow", () => {
  it("should visit homepage", () => {
    cy.visit(appUrl());
  });

  it("should click register and open up the register page", () => {
    cy.contains(/register/i).click();
    cy.url().should("include", "/register");
  });

  it("should show error if passwords don't match", () => {
    fillOutStringForm(registerFormFieldLabels, incorrectRegisterFormValues);

    cy.contains(/next/i).click();
    cy.contains(
      /Your passwords do not match. Check them and try again!/i
    ).should("be.visible");
  });

  it("should allow the user to clear out the form", () => {
    clearStringForm(registerFormFieldLabels);
  });

  it("should allow the user to fill out the register form", () => {
    fillOutStringForm(registerFormFieldLabels, registerFormValues);

    cy.contains(/next/i).click();
    cy.contains(
      /Your passwords do not match. Check them and try again!/i
    ).should("not.exist");

    acknowledgePrivacyPolicy();

    cy.wait(2000);

    cy.url().should("include", "/import");
  });
});

describe("delete flow", () => {
  it("should click on settings, then manage acccount", () => {

    getByAriaLabel("Close tour modal").click();

    cy.wait(2000);
    menuButton().click();
    cy.contains(/manage account/i).click();

    cy.url().should("include", "/settings/account");
  });

  it("should click on delete account and be able to cancel", () => {
    cy.contains(/delete your gradezpr account/i).click();
    cy.contains(/cancel/i).click();

    cy.contains(/delete your gradezpr account/i).should("be.visible");
  });

  it("should be able to delete account and be redirected", () => {
    cy.contains(/delete your gradezpr account/i).click();
    cy.get("button")
      .contains(/yes, delete my account/i)
      .click();

    cy.url().should("include", "/settings/account-delete");
    expect(localStorage.getItem("token")).to.be.null;
  });
});
