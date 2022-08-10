import { v4 as uuid } from "uuid";
import { ObjectTyped } from "object-typed";
import { defaultCourses } from "./tools/courseTools";
import { getByAriaLabel } from "./tools/formTools";
import { menuButton } from "./tools/generalTools";
import { NewStudentForm, fillOutNewStudentForm, checkIfStudentIsCreated, newStudentFormLabels, checkIfStudentIsDeleted } from "./tools/studentTools";
import { loginUser } from "./tools/userTools";


const newStudentMultipleCourses: NewStudentForm = {
  firstName: uuid(),
  lastName: uuid(),
  id: uuid(),
  courses: defaultCourses
    .sort()
    .reduce((prev, curr) => {
      return `${prev}, ${curr}`;
    }, "")
    .slice(2),
};

const newStudentOneCourse: NewStudentForm = {
  firstName: uuid(),
  lastName: uuid(),
  id: uuid(),
  courses: defaultCourses[0],
};



describe("create new student", () => {
  beforeEach(() => {
    loginUser();
    menuButton().click();
    cy.contains(/manage students/i).click();
  });

  it("should open up manage students using the menu button", () => {
    cy.url().should("include", "/settings/students");
  });

  it("should create a new student with a single course", () => {
    getByAriaLabel("add-single-student").click();

    fillOutNewStudentForm(newStudentOneCourse, newStudentFormLabels, "new");

    cy.wait(500);

    checkIfStudentIsCreated(newStudentOneCourse);
  });

  it("should edit the previously created new student and add multiple courses", () => {
    getByAriaLabel(
      `edit-${newStudentOneCourse.lastName}-${newStudentOneCourse.firstName}`
    ).click();

    cy.get("header")
      .contains(
        `Edit ${newStudentOneCourse.firstName} ${newStudentOneCourse.lastName}`
      )
      .should("be.visible");

    fillOutNewStudentForm(
      newStudentMultipleCourses,
      newStudentFormLabels,
      "update"
    );

    checkIfStudentIsCreated(newStudentMultipleCourses);
  });

  it("should delete the edited student", () => {
    getByAriaLabel(
      `delete-${newStudentMultipleCourses.lastName}-${newStudentMultipleCourses.firstName}`
    )
      .as("deleteButton")
      .click();

    cy.get("button")
      .contains(/cancel/i)
      .click({ force: true });

    checkIfStudentIsCreated(newStudentMultipleCourses);

    cy.get("@deleteButton").click();

    cy.get("button")
      .contains(/delete/i)
      .click({ force: true });

    cy.wait(1000);

    checkIfStudentIsDeleted(newStudentMultipleCourses);
  });
});
