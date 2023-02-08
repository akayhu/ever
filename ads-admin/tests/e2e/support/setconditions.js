Cypress.Commands.add("$getSetconditions", () => {
  cy.fixture("condition.json").then(data => {
    cy.intercept("api/condition/?keyword*", data).as("getSetconditions");
  });

  cy.intercept("POST", "api/condition", {
    response: {
      id: 49,
      name: "條件設定測試",
      memo: "條件設定備註",
      conditionGroups: [
        {
          conditionId: 49,
          groupId: 1,
          sort: 1,
          conditionKey: "e2e_key",
          conditionValue: "e2e_value",
          memo: "e2e備註說明"
        }
      ],
      responseBoards: null
    }
  }).as("postCondition");

  cy.intercept("GET", "api/condition/*", {
    response: {
      id: 49,
      name: "條件設定測試",
      memo: "條件設定備註",
      conditionGroups: [
        {
          conditionId: 49,
          groupId: 1,
          sort: 1,
          conditionKey: "e2e_key",
          conditionValue: "e2e_value",
          memo: "e2e備註說明"
        }
      ],
      responseBoards: []
    }
  }).as("getCondition");

  cy.intercept("DELETE", "api/condition/*", {}).as("deleteCondition");
});
