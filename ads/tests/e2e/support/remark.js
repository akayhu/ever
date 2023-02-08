// 查詢指定月份的備註
Cypress.Commands.add("$getRemark", () => {
  cy.fixture("calendar.json").then(data => {
    cy.intercept(`api/remark?*`, data.remark);
  });
});
