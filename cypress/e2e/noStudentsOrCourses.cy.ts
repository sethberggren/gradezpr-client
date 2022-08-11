import { v4 as uuid } from "uuid";
import { addNewCourse } from "./tools/courseTools";
import { getByAriaLabel, fillOutStringForm } from "./tools/formTools";
import { appUrl } from "./tools/generalTools";
import { addNewRandomStudent } from "./tools/studentTools";
import {
  deleteUser,
  RegisterForm,
  registerFormFieldLabels,
} from "./tools/userTools";

const password = uuid();

const registerFormValues: RegisterForm = {
  firstName: uuid(),
  lastName: uuid(),
  email: `${uuid()}@gmail.com`,
  password: password,
  confirmedPassword: password,
};

const newCourse = uuid();

const openAndVerifyNoStudentsOrCoursesModal = () => {
  cy.get("button")
    .contains(/import/i)
    .click();

  cy.contains(
    /Gradezpr has detected that you may have no courses or students./i
  ).should("be.visible");
};

describe("test to make sure the No Students or Courses Modal opens if the user does not have students or courses", () => {
  after(() => {
    deleteUser();
  });
  it("should see the modal with zero students and zero courses", () => {
    cy.visit(appUrl("register"));
    fillOutStringForm(registerFormFieldLabels, registerFormValues);

    cy.contains(/next/i).click();
    cy.contains(
      /Your passwords do not match. Check them and try again!/i
    ).should("not.exist");

    cy.url().should("include", "/import");

    openAndVerifyNoStudentsOrCoursesModal();

    cy.contains(/0 students/i).should("be.visible");
    cy.contains(/0 courses/i).should("be.visible");

    cy.get("button")
      .contains(/add courses/i)
      .click();

    cy.url().should("include", "settings/courses");
  });

  it("should be able to add a course, and see the modal have the updated value", () => {
    addNewCourse(newCourse);

    cy.get("a")
      .contains(/gradezpr/i)
      .click();

    openAndVerifyNoStudentsOrCoursesModal();

    cy.contains(/0 students/i).should("be.visible");
    cy.contains(/1 course/i).should("be.visible");

    cy.get("button")
      .contains(/add students/i)
      .click();

    cy.url().should("include", "settings/students");
  });

  it("should be able to add a student, then no longer see the modal because the user has at least one student and at least one coures", () => {
    addNewRandomStudent(newCourse);

    cy.get("a")
      .contains(/gradezpr/i)
      .click();

    cy.get("button")
      .contains(/import/i)
      .click();

    cy.contains(/import assignment/i).should("be.visible");

    getByAriaLabel("Close Import Assignment Modal").click({ force: true });
  });
});
