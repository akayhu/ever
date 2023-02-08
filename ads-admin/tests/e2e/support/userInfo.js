Cypress.Commands.add("$getAccount", () => {
  cy.fixture("account.json").then(data => {
    cy.intercept("api/account?*", data.allList).as("getAllAccount");
  });

  cy.intercept("GET", "api/account/*", {
    response: {
      logonId: "e2e.text",
      name: "Cypress",
      accountId: "9999",
      status: 1,
      role: 1,
      emergency: true,
      allowedSite: [1, 2, 3, 4, 5, 6, 10, 14, 20, 40, 102, 115, 132, 134]
    }
  }).as("getAccountId");

  cy.intercept("POST", "api/account", { response: "9999" }).as("postAccount");

  cy.intercept("PUT", "api/account/*", { response: true }).as("putAccountId");
});

Cypress.Commands.add("$getSite", () => {
  cy.fixture("site.json").then(data => {
    // cy.intercept("api/component/site?*", data.PC).as("getSitePC");
    cy.intercept("api/component/site?device=PC*", data.PC).as("getSitePC");
    cy.intercept("api/component/site?device=APP*", data.APP).as("getSiteAPP");
    cy.intercept("api/component/site?device=MOBILE*", data.MOBILE).as(
      "getSiteMobile"
    );
    // cy.intercept(
    //   "GET",
    //   "api/component/site?device=PC&page=1&size=100&status=true",
    //   data.PC
    // ).as("getSitePC");
    // cy.intercept(
    //   "GET",
    //   "api/component/site?device=APP&page=1&size=100&status=true",
    //   data.APP
    // ).as("getSiteAPP");
    // cy.intercept(
    //   "GET",
    //   "api/component/site?device=MOBILE&page=1&size=100&status=true",
    //   data.MOBILE
    // ).as("getSiteMobile");
    // cy.intercept(
    //   "GET",
    //   "api/component/site?size=20&page=1&sort=status_desc&device=PC",
    //   data.PC
    // ).as("getWebListSitePC");
  });
});

Cypress.Commands.add("$getPhoneUser", () => {
  cy.intercept("api/account/phoneUser?queryStr=*", {
    response: [
      {
        id: "9999",
        account: "e2e.test",
        name: "Cypress",
        shortDept: "前端工程一部",
        fullDept: "資訊服務事業體-工程總處-互動工程處-前端工程一部",
        ext: "8780"
      }
    ]
  }).as("getPhoneUser");
});

Cypress.Commands.add("$getAccountSearch", () => {
  cy.intercept("api/account/search?keyword=*", {
    response: [{ logonId: "e2e.text", name: "Cypress", accountId: "9999" }]
  }).as("getAccountSearch");
});
