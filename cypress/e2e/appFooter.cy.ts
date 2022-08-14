import { appUrl } from "./tools/generalTools";
import { loginUser } from "./tools/userTools";

const visibleToEveryone = ["iceberggren", "About Gradezpr", "Privacy Policy"];
const visibleToAuthorized = ["Submit a Bug/Feature Request"];

const verifyVisibleToEveryone = () => {
  for (const link of visibleToEveryone) {
    cy.get("a").contains(link).should("be.visible");
  }
};

const verifyVisibleToAuthorized = () => {
  for (const link of visibleToAuthorized) {
    cy.get("a").contains(link).should("be.visible");
  }
};

describe("tests of App Footer", () => {
  it("should see links at the bottom that do not require authentication", () => {
    cy.visit(appUrl());

    verifyVisibleToEveryone();
  });

  it("should see links at the bottom that do require authentication", () => {
    loginUser().then(() => {

        cy.wait(5000);
      verifyVisibleToEveryone();

      verifyVisibleToAuthorized();
    });
  });
});
