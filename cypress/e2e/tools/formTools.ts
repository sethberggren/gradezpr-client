import { ObjectTyped } from "object-typed";

export const getByAriaLabel = (ariaLabel: string) => {
  return cy.get(`[aria-label = '${ariaLabel}']`);
};

export const getInputByLabel = (label: string) => {
  return cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id: string | undefined) => {
      if (id === undefined) {
        throw new Error("Could not find input by label.");
      } else {
        return cy.get(`#${id}`);
      }
    });
};

export const fillOutStringForm = <K extends { [key: string]: string }>(
  labels: K,
  values: K
) => {
  for (const key of ObjectTyped.keys(labels)) {
    const label = labels[key];
    const value = values[key];

    console.log("here's the label " + label);

    getInputByLabel(label).type(value);
    getInputByLabel(label).should("have.value", value);
  }
};

export const clearStringForm = <K extends { [key: string]: string }>(
  labels: K
) => {
  for (const key of ObjectTyped.keys(labels)) {
    const label = labels[key];

    getInputByLabel(label).clear();
    getInputByLabel(label).should("have.value", "");
  }
};
