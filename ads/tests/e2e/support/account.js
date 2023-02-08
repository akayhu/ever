Cypress.Commands.add("$getAuthStatus", (role = "admin") => {
  cy.fixture("account.json").then(data => {
    cy.intercept("api/internal/auth/status", data[role]);
  });
});

// 依身分查詢使用者
Cypress.Commands.add("$getAccountSearch", () => {
  cy.fixture("account.json").then(data => {
    cy.intercept("api/account/search?keyword=*", {
      response: [{ accountId: "T1234", logonId: "michael.lee", name: "李麥克" }]
    });
  });
});

// 取得會員資料
Cypress.Commands.add("$getAccountId", () => {
  cy.intercept(`api/account/*`, {
    response: {
      accountId: "T1234",
      allowedSite: [0],
      emergency: true,
      logonId: "michael.lee",
      name: "李麥克",
      role: 1,
      status: 1
    }
  });
});
