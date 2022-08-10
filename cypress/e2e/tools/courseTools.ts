import { getByAriaLabel } from "./formTools";
import { menuButton } from "./generalTools";

export const defaultCourses = [
  "Mastering the Force",
  "Deciphering Painful Visions",
  "Lava Burns 101",
  "Diplomacy for Dummies",
].sort();

export const addNewCourse = (courseName: string) => {
  menuButton().click();

  cy.contains(/manage courses/i).click();

  cy.url().should("include", "/settings/courses");

  getByAriaLabel("create-new-course").click();

  cy.get("input").as("newCourseInput").should("be.visible");
  getByAriaLabel("add-new-course").as("newCourseConfirm").should("be.visible");

  cy.get("@newCourseInput").type(courseName);
  cy.get("@newCourseConfirm").click();

  cy.contains(new RegExp(courseName, "i")).should("be.visible");
};
