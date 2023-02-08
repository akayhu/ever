Cypress.Commands.add("clearIntercept", aliasName => {
  const routes = Cypress.state("routes");
  Object.entries(routes).forEach(([key, value]) => {
    const { alias } = value;
    if (Object.is(alias, aliasName)) {
      delete routes[key];
    }
  });
  Cypress.state("routes", routes);
});

Cypress.Commands.add("$getSelectDropdown", name => {
  cy.get(`[data-e2e="${name}"]`).as(`${name}Div`);
  cy.get(`@${name}Div`)
    .find("input")
    .as(`${name}Input`);
});

Cypress.Commands.add("$getSelectByClass", className => {
  cy.get(`.${className} .el-select`).as(`${className}Div`);
  cy.get(`@${className}Div`)
    .find("input")
    .as(`${className}Input`);
});

Cypress.Commands.add("$getSelectOptions", value => {
  cy.contains(".el-select-dropdown__item", value).as(`${value}Option`);
});

Cypress.Commands.add("$getDatePicker", className => {
  cy.get(`.${className} .el-date-editor`).as(`${className}Div`);
  cy.get(`@${className}Div`)
    .find("input")
    .eq(0)
    .as(`${className}Start`);
  cy.get(`@${className}Div`)
    .find("input")
    .eq(1)
    .as(`${className}End`);
});

// Cypress.Commands.add("$getDatePickerOption", className => {
//   cy.get(`.${className} .el-date-editor`).as(`${className}Div`);
//   cy.get(`@${className}Div input`)
//     .eq(0)
//     .as(`${className}Start`)
//     .eq(1)
//     .as(`${className}End`);
// });
