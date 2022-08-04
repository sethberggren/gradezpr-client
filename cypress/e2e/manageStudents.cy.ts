import { v4 as uuid } from "uuid";
import { ObjectTyped } from "object-typed";
import {
  defaultCourses,
  getByAriaLabel,
  getInputByLabel,
  loginUser,
  menuButton,
} from "./cypressTools";

type NewStudentForm = {
  firstName: string;
  lastName: string;
  id: string;
  courses: string;
};

const newStudentFormLabels: NewStudentForm = {
  firstName: "First Name:",
  lastName: "Last Name:",
  id: "ID:",
  courses: "Courses:",
};

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

const fillOutNewStudentForm = (
  newStudentFormContent: NewStudentForm,
  newStudentFormLabels: NewStudentForm,
  updateOrNew: "update" | "new"
) => {
  const checkLabel = "Courses:";

  for (const key of ObjectTyped.keys(newStudentFormContent)) {
    const label = newStudentFormLabels[key];
    const entry = newStudentFormContent[key];

    if (label !== checkLabel) {
      getInputByLabel(label).clear();
      getInputByLabel(label).type(entry);
      getInputByLabel(label).should("have.value", entry);
    } else {
      // entry is the student's courses, so change that into an array and click on the element.

      const studentCourses = entry.split(",").map((val) => val.trim());

      for (const studentCourse of studentCourses) {
        cy.get('[type="checkbox"]').check(studentCourse, { force: true });
      }
    }
  }

  if (updateOrNew === "new") {
    cy.get("button")
      .contains(/add student/i)
      .click();
  } else {
    cy.get("button")
      .contains(/update/i)
      .click();
  }
};

const checkIfStudentIsCreated = (newStudentFormContent: NewStudentForm) => {
  for (const key of ObjectTyped.keys(newStudentFormContent)) {
    const entry = newStudentFormContent[key];

    cy.get("#student-container").contains(entry).should("be.visible");
  }
};

const checkIfStudentIsDeleted = (newStudentFormContent: NewStudentForm) => {
  for (const key of ObjectTyped.keys(newStudentFormContent)) {
    if (key !== "courses") {
      const entry = newStudentFormContent[key];

      cy.get("div").contains(entry).should("not.exist");
    }
  }
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
