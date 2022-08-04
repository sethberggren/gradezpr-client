import { ObjectTyped } from "object-typed";
import {
  defaultCourses,
  defaultStudents,
  getByAriaLabel,
  getInputByLabel,
  loginUser,
} from "./cypressTools";

const getFileUpload = () => cy.get("input[type=file]");

const uploadGoodFile = () => {
  getByAriaLabel("Import New Assignment").click();
  getByAriaLabel("select-class-for-assignment").select(defaultCourses[1]);
  getFileUpload().attachFile("testData.xlsx");
  cy.get("button").contains(/next/i).click();
};



const confirmCopiedText = () => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.equal("Padme Amidala\t100\rBail Organa\t79.16666666666666\rObi-Wan Kenobi\t91.66666666666667\rMace Windu\t50\rShaak Ti\t90\r")
    });
  });
};

type TestDataSummaryStatisticLabels = {
  meanScore: string;
  medianScore: string;
  standardDeviation: string;
  highestScore: string;
  secondHighestScore: string;
};

type TestDataSummaryStatistics = {
  [key in keyof TestDataSummaryStatisticLabels]: number;
};

const testDataSummaryStatisticLabels: TestDataSummaryStatisticLabels = {
  meanScore: "Mean Score",
  medianScore: "Median Score",
  standardDeviation: "Standard Deviation",
  highestScore: "Highest Score",
  secondHighestScore: "Second Highest Score",
};

const testDataExpectedSummaryStatistics: TestDataSummaryStatistics = {
  meanScore: 78.6,
  medianScore: 88,
  standardDeviation: 20.88,
  highestScore: 100,
  secondHighestScore: 90,
};

const curveMethods = {
  noCurve: {
    label: "No Curve",
    addtlOpts: [],
  },
  linearScale: {
    label: "Linear Scale",
    addtlOpts: ["Min. score", "Max. score"],
  },
  meanAndStandardDeviationCurve: {
    label: "Mean and Standard Deviation Curve",
    addtlOpts: ["Desired Mean", "Desired Standard Deviation"],
  },
  highestScoreCurve: {
    label: "Highest Score Curve",
    addtlOpts: [],
  },
  secondHighestScoreCurve: {
    label: "Second Highest Score Curve",
    addtlOpts: [],
  },
} as const;

describe("file upload import assignment flow", () => {
  beforeEach(() => {
    loginUser();
  });

  it("should see all classes under the select class", () => {
    getByAriaLabel("Import New Assignment").click();

    for (const course of defaultCourses) {
      cy.get(`option[value="${course}"]`).should("be.visible");
    }
  });

  it("should click on import new assignment and be able to upload a file of the correct .xlsx type", () => {
    getByAriaLabel("Import New Assignment").click();

    getFileUpload().attachFile("badData.rtf");

    cy.get("div")
      .contains(/please upload a .xlsx file./i)
      .should("be.visible");
    cy.get("button")
      .contains(/select an item/i)
      .should("be.disabled");
    cy.get("div")
      .contains(/badData.rtf/i)
      .should("not.exist");

    getFileUpload().attachFile("testData.xlsx");

    cy.get("div")
      .contains(/please upload a .xlsx file./i)
      .should("not.exist");
    cy.get("div")
      .contains(/testData.xlsx/i)
      .should("be.visible");
    cy.get("button").contains(/next/i).should("not.be.disabled");
  });

  it("should upload file and see summary statistics", () => {
    uploadGoodFile();

    for (const key of ObjectTyped.keys(testDataSummaryStatisticLabels)) {
      const label = testDataSummaryStatisticLabels[key];
      const value = testDataExpectedSummaryStatistics[key];

      cy.get("div")
        .contains(new RegExp(label, "i"))
        .get("div")
        .contains(value)
        .should("be.visible");
    }
  });

  it("should upload file and be able to select from a variety of curve options", () => {
    uploadGoodFile();

    for (const key of ObjectTyped.keys(curveMethods)) {
      const radioLabel = curveMethods[key].label;
      const addtlOpts = curveMethods[key].addtlOpts;

      cy.get(".chakra-radio")
        .contains(radioLabel)
        .siblings("input[type='radio']")
        .check({ force: true });

      if (addtlOpts.length !== 0) {
        for (const opt of addtlOpts) {
          getByAriaLabel(`number-input-${opt}`).as("numberInput").type("50");
          cy.get("@numberInput").should("have.value", "50");
          cy.get("@numberInput").clear();
        }
      }
    }
  });

  it("should upload file, select linear curve, and copy curved values to clipboard", () => {
    uploadGoodFile();

    cy.get(".chakra-radio")
      .contains("Linear Scale")
      .siblings("input[type='radio']")
      .check({ force: true });

    getByAriaLabel(`number-input-Min. score`).type("50");
    getByAriaLabel(`number-input-Max. score`).type("100");

    cy.get("#confirmImport").click()
      .then(() => {
        getByAriaLabel("copy-grades-button")
          .should("be.visible").focus().click()
          .then(confirmCopiedText);
      });

    cy.get("button").contains(/done/i).click();

    cy.get("#testData-container")
      .as("assignmentContainer")
      .contains(/testData.xlsx/i)
      .should("be.visible");
    cy.get("@assignmentContainer")
      .contains(defaultCourses[1])
      .should("be.visible");

    getByAriaLabel(`copy-grades-testData.xlsx`).should("be.visible").click().then(confirmCopiedText);

    getByAriaLabel(`delete-assignment-testData.xlsx`).click();

    getByAriaLabel(`delete-assignment-testData.xlsx`).get("button").contains(/cancel/i).click();

    cy.get("@assignmentContainer")
      .contains(/testData.xlsx/i)
      .should("be.visible");
    cy.get("@assignmentContainer")
      .contains(defaultCourses[1])
      .should("be.visible");

    getByAriaLabel(`delete-assignment-testData.xlsx`).click();

    getByAriaLabel(`delete-assignment-testData.xlsx`).get("button").contains(/delete/i).click();
    cy.get("@assignmentContainer").should("not.exist");
  });
});
