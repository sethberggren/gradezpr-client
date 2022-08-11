import { fillOutStringForm } from "./tools/formTools";
import { appUrl, menuButton } from "./tools/generalTools";
import {
  createUuidUser,
  deleteUser,
  loginUser,
  logoutUser,
} from "./tools/userTools";
import { v4 as uuid } from "uuid";
import { every } from "cypress/types/lodash";

const passwordChangeLabels = {
  oldPassword: "Old Password:",
  newPassword: "New Password:",
  confirmNewPassword: "Confirm New Password:",
};

const mockedInitializeData = {
    courses: [],
    students: [],
    assignments: [],
    userInformation: {
        email: uuid(),
        userGoogleRequiredScopes: true,
        isNewUser: false,
        isLoggedInWithGoogle: true
    }
}

const tokenExpirationTime = new Date();

tokenExpirationTime.setMinutes(new Date().getMinutes() + 30);

const tokenExpirationString = tokenExpirationTime.toUTCString();

describe("test user settings", () => {
  it("should login without Google and be able to change the user's password", () => {
    const credentials = createUuidUser(true);

    menuButton().click();

    cy.get("button")
      .contains(/manage account/i)
      .click();

    cy.get("h1")
      .contains(/your account/i)
      .should("be.visible");

    cy.get("button")
      .contains(/change password/i)
      .should("be.visible")
      .click();

    cy.get("header")
      .contains(/password change/i)
      .should("be.visible");

    const newPassword = uuid();

    fillOutStringForm(passwordChangeLabels, {
      oldPassword: credentials.password,
      newPassword: newPassword,
      confirmNewPassword: newPassword,
    });

    cy.get("button")
      .contains(/change password/i)
      .realClick();

    deleteUser();
  });

  it("should login with Google and see that the option to change password is not there", () => {
    cy.intercept(
      { method: "POST", url: "http://localhost:8080/auth/login" },
      {
        statusCode: 200,
        body: { token: uuid(), expiresAt: tokenExpirationString },
      }
    ).as("loginRequest");

    cy.intercept(
      {
        method: "GET",
        url: "http://localhost:8080/gradeupdater/initialize"
      },
      { statusCode: 200, body: mockedInitializeData }
    ).as("initializeRequest");

    cy.visit(appUrl("login"));

    loginUser({
      email: "thisEmailIsLoggedInWithGoogle@gmail.com",
      password: "testingtestingtesting",
    });

    cy.wait("@loginRequest").then(() => {
      cy.wait("@initializeRequest").then(() => {
        menuButton().click();

        cy.get("button")
          .contains(/manage account/i)
          .click();

        cy.get("p")
          .contains(/your account uses google to login/i)
          .should("be.visible");

        cy.get("button")
          .contains(/change password/i)
          .should("not.exist");
      });
    });
  });
});
