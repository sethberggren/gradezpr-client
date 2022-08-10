import { getByAriaLabel, getInputByLabel } from "./formTools";
import { v4 as uuid } from "uuid";
import { ObjectTyped } from "object-typed";

export type NewStudentForm = {
  firstName: string;
  lastName: string;
  id: string;
  courses: string;
};

export const defaultStudents = [
  "Padme Amidala",
  "Bail Organa",
  "Obi-Wan Kenobi",
  "Mace Windu",
  "Shaak Ti",
];

export const newStudentFormLabels: NewStudentForm = {
  firstName: "First Name:",
  lastName: "Last Name:",
  id: "ID:",
  courses: "Courses:",
};

export const addNewRandomStudent = (courseName: string) => {
  const newStudentOneCourse = {
    firstName: uuid(),
    lastName: uuid(),
    id: uuid(),
    courses: courseName,
  };

  const newStudentFormLabels = {
    firstName: "First Name:",
    lastName: "Last Name:",
    id: "ID:",
    courses: "Courses:",
  };

  getByAriaLabel("add-single-student").click();

  fillOutNewStudentForm(newStudentOneCourse, newStudentFormLabels, "new");

  cy.wait(500);

  checkIfStudentIsCreated(newStudentOneCourse);
};

export const fillOutNewStudentForm = (
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

export const checkIfStudentIsCreated = (
  newStudentFormContent: NewStudentForm
) => {
  for (const key of ObjectTyped.keys(newStudentFormContent)) {
    const entry = newStudentFormContent[key];

    cy.get("#student-container").contains(entry).should("be.visible");
  }
};

export const checkIfStudentIsDeleted = (newStudentFormContent: NewStudentForm) => {
  for (const key of ObjectTyped.keys(newStudentFormContent)) {
    if (key !== "courses") {
      const entry = newStudentFormContent[key];

      cy.get("div").contains(entry).should("not.exist");
    }
  }
};
