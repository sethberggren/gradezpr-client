import { appUrl, fillOutStringForm, clearStringForm, getByAriaLabel, loginUser, getInputByLabel} from "./cypressTools";
import {v4 as uuid} from "uuid";

describe("user request flow", () => {

    beforeEach(() => {
        loginUser();
    });

    it("should be able to submit a bug request", () => {
        cy.get("a").contains(/submit a bug\/feature request/i).click();

        cy.url().should("include", "request");

        cy.get("label").contains(/bug/i).should("be.visible");
        cy.get("label").contains(/feature/i).should("be.visible");

        getInputByLabel("Describe Your Bug:").should("be.visible").type(uuid());

        cy.get("label").contains(/yes/i).should("be.visible");
        cy.get("label").contains(/no/i).should("be.visible");

        cy.get("button").contains(/submit/i).click();

        cy.url().should("include", "requestComplete");

        cy.get("h2").contains(/thanks/i).should("be.visible");
        cy.get("button").contains(/back/i).click();

        cy.url().should("include", "import");
    })
})