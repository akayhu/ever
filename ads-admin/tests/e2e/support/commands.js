import "cypress-real-events/support";

Cypress.Commands.add("$getAuthAdminStatus", () => {
  cy.fixture("status.json").then(data => {
    cy.intercept("GET", "api/admin/auth/status", data).as("getAuthAdminStatus");
  });
});

Cypress.Commands.add("$getSelectDropdown", name => {
  cy.get(`[data-e2e="${name}"]`).as(`${name}Div`);
  cy.get(`@${name}Div`).find("input").as(`${name}Input`);
});

Cypress.Commands.add("$getSelectOptions", value => {
  cy.contains(".el-select-dropdown__item", value).as(`${value}Option`);
});
