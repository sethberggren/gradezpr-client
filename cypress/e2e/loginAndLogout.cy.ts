import { watchFile } from "fs";
import { v4 as uuid } from "uuid";
import { getInputByLabel, getByAriaLabel } from "./tools/formTools";
import { loginUser } from "./tools/userTools";

function getExpiryTime(minutes: number) {
  const currentTime = new Date();

  const expiresAt = new Date();
  expiresAt.setMinutes(currentTime.getMinutes() + 30);

  return expiresAt.toUTCString();
}

const verifyLoginScreen = () => {
  cy.url().should("include", "/login");
  getInputByLabel("Email").should("be.visible");
  getInputByLabel("Password").should("be.visible");
  expect(localStorage.getItem("token")).to.be.null;
};

const verifyHomeScreen = () => {
  cy.url().should("include", "/import");

  cy.get("h1")
    .contains(/imported grades/i)
    .should("be.visible");

  getByAriaLabel("Import New Assignment").should("be.visible");

  getByAriaLabel("Menu Button").should("be.visible");
};

describe("login and logout flow", () => {
  beforeEach(() => {
    loginUser();
  });
  it("should login and see the main screen", () => {
    verifyHomeScreen();
  });

  it("should logout and be redirected to login", () => {
    getByAriaLabel("Menu Button").click();
    cy.wait(1000);
    cy.get("button").contains("Logout").click({ force: true });

    verifyLoginScreen();
  });

  it("should redirect the user to the credential error screen if the token does not match the token in the backend", () => {
    cy.wait(2000);
    cy.window()
      .then((win: any) => {
        if (win.dispatch) {
          win.dispatch({
            type: "setToken",
            payload: { token: uuid(), expiresAt: getExpiryTime(30) },
          });
        } else {
          throw new Error("Dispatch does not exist");
        }
      })
      .then(() => {
        cy.wait(2000);
        cy.reload();

        cy.get("h2")
          .contains(
            "Oops, something is wrong with your login information. Please log back in"
          )
          .should("be.visible");
        cy.get("button")
          .contains(/log in/i)
          .should("be.visible")
          .click().then(() => {

            loginUser();
            verifyHomeScreen();
          })
      });
  });

  it("should automatically logout the user after a specified period of time", () => {
    cy.clock(new Date());
    cy.wait(1000);
    cy.tick(1900000);

    cy.get("h2")
      .contains("You have been logged out for security!")
      .should("be.visible");

    cy.get("button").contains("Log back in?").should("be.visible").click();

    verifyLoginScreen();
  });
});
