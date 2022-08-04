import {v4 as uuid} from "uuid"
import { getByAriaLabel, loginUser, menuButton } from "./cypressTools";

const newCourses = [uuid(), uuid(), uuid()];

describe("add new course", () => {

  beforeEach(() => {
    loginUser();

    menuButton().click();

    cy.contains(/manage courses/i).click();

    cy.url().should("include", "/settings/courses");
  });

  it("should click on the new course button and add a new course", () => {
    for (const newCourse of newCourses) {
      getByAriaLabel("create-new-course").click();

      cy.get("input").as("newCourseInput").should("be.visible");
      getByAriaLabel("add-new-course")
        .as("newCourseConfirm")
        .should("be.visible");

      cy.get("@newCourseInput").type(newCourse);
      cy.get("@newCourseConfirm").click();

      cy.contains(new RegExp(newCourse, "i")).should("be.visible");
    }
  });

  it("should delete the courses just created", () => {
    for (const newCourse of newCourses) {
      const newCourseRegEx = new RegExp(newCourse, "i");

      getByAriaLabel(`delete-course-${newCourse}`).as("deleteButton").click();
      cy.wait(200)
      cy.get("@deleteButton").should("not.exist");
    }
  });
});
