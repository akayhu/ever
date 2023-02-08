Cypress.Commands.add("$getTools", () => {
  cy.fixture("toolsBoard.json").then(data => {
    cy.intercept("api/component/board", data).as("getToolsList");
  });

  cy.intercept("PATCH", "api/component/board", {
    response: {
      id: 422,
      channelId: 119,
      channelName: "My104會員中心 ",
      siteId: 1,
      siteName: "人力銀行C主網",
      device: "PC",
      name: "鑽石橫幅",
      url: null,
      conditionId: 0,
      snapshot: false,
      typeId: 15,
      style: "Job",
      responseTypeTemplateDetail: null,
      reserve: 2,
      lowerLimit: 0,
      upperLimit: 2,
      promotion: false,
      status: true,
      associateWithProduct: null,
      canDelete: null,
      sort: 1234567
    }
  }).as("patchToolsList");

  cy.intercept("api/report/file/download/common/material-update-times").as(
    "downloadMaterialUpdateTimes"
  );

  cy.intercept("api/report/file/download/common/unclosed-project?*").as(
    "downloadUnclosedProject"
  );
});

Cypress.Commands.add("$getCustomer", () => {
  cy.fixture("customer.json").then(data => {
    cy.intercept("GET", "api/customer", data).as("getCustomer");
  });
});
