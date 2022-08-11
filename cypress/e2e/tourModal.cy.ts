import { getByAriaLabel } from "./tools/formTools";
import { createUuidUser, deleteUser, loginUser, logoutUser } from "./tools/userTools";

describe("tour modal tests", () => {
  let userCredentials = {
    email: "",
    password: ""
  }

  after(() => {
    deleteUser();
  })
  let closeTourModal : Cypress.Chainable<JQuery<HTMLElement>>;

  it("should create a new user and log in, seeing the tour modal", () => {
    userCredentials  = createUuidUser();

    cy.wait(1000);

    closeTourModal = getByAriaLabel("Close tour modal");

    closeTourModal.should("be.visible");
  });

  it("should click through the tour modal", () => {

    getByAriaLabel("Back in tour").as("backButton");

    getByAriaLabel("Next in tour").as("nextButton");

    getByAriaLabel("Tour progress").as("tourProgress");

    cy.get("@backButton").should("be.disabled");
    cy.get("@nextButton").should("be.enabled");

    cy.get("@tourProgress").should("contain", "1/6");

    for (let i = 2; i <= 6; i++) {
        cy.get("@nextButton").click();

        cy.get("@tourProgress").should("contain", `${i}/6`);
    }

    cy.get("@nextButton").should("be.disabled");
  });

  it("should be able to exit the tour modal", () => {

    getByAriaLabel("Close tour modal").click({force: true});

    cy.wait(1000);

    getByAriaLabel("Close tour modal").should("not.exist");
  });

  it("should not see the tour modal when logging back in", () => {
        logoutUser();

        loginUser(userCredentials);

        getByAriaLabel("Close tour modal").should("not.exist");
  })
});
