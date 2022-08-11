import { appUrl } from "./tools/generalTools";

const passwordChangeUrl = `http://localhost:8080/auth/forgot-password` 

describe("forgot passsword tests", () => {
  it("should be able to successfully reset password", () => {
    
    cy.intercept(
      { method: "POST", url: passwordChangeUrl },
      { status: "OK" }
    ).as("forgotPasswordRequest");

    cy.visit(appUrl());

    cy.get("button")
      .contains(/log in/i)
      .click();

    cy.url().should("include", "login");

    cy.get("a")
      .contains(/forgot password/i)
      .click();

    cy.url().should("include", "password-reset");

    cy.get("input").type("thisEmailIsAssociatedWithAccount@gmail.com");

    cy.get("button").contains(/go/i).click();

    cy.wait("@forgotPasswordRequest").then(() => {
      cy.url().should("include", "password-changed");

      cy.contains(
        "Your temporary password has been emailed to you. Be on the lookout for an email from seth@gradezpr.com to arrive in the next few minutes."
      ).should("be.visible");

      cy.get("button")
        .contains(/return to login/i)
        .should("be.visible")
        .click();

      cy.url().should("include", "login");
    });
  });

  it("should respond with an error if the user's email is not associated with a gradezpr account", () => {

    cy.intercept({
        method: "POST",
        url: passwordChangeUrl
    }, {statusCode: 401, body: {name: "AuthenticationError", message: "The user does not exist - create an account and login."}}).as("forgotPasswordRequest");

    cy.visit(appUrl("password-reset"));

    cy.get("input").type("thisEmailIsNotAssociatedWithAnAccount@gmail.com");
    
    cy.get("button").contains(/go/i).click();

    cy.wait("@forgotPasswordRequest").then(() => {

        cy.url().should("not.include", "password-changed");

        cy.get("p").contains(/please check your information and try again/i).should("be.visible");
    })
    
  })
});
