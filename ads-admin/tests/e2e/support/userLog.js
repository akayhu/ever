Cypress.Commands.add("$getLogList", () => {
  cy.fixture("log.json").then(data => {
    cy.intercept("api/log?*", data.allList).as("getAllLog");

    cy.intercept("api/log?logTypes=*", data.searchList).as("getSearchLog");

    cy.intercept("api/log/data-history?*", data.searchDataHistoryList).as(
      "getSearchDataHistoryLog"
    );
  });
});

Cypress.Commands.add("$getCompareResult", () => {
  cy.intercept("api/log/*/compare-result?*", {
    response: {
      onlyOnLeft: [
        { property: "projectId", value: "263.0" },
        { property: "reservations.0.usage", value: "0.0" },
        { property: "reservations.0.giveaway", value: "false" },
        { property: "reservations.0.deduction", value: "0.0" },
        { property: "reservations.0.boardId", value: "415.0" },
        { property: "reservations.0.productId", value: "414.0" },
        { property: "reservations.0.periods.0.start", value: "2022/04/29" },
        { property: "reservations.0.periods.0.end", value: "2022/07/27" },
        { property: "reservations.0.note", value: "" }
      ],
      onlyOnRight: [
        { property: "usage", value: "0.0" },
        { property: "deduction", value: "0.0" },
        { property: "giveaway", value: "false" },
        { property: "note", value: "" },
        { property: "startDate", value: "2022/06/27" },
        { property: "endDate", value: "2022/07/03" }
      ],
      differences: []
    }
  }).as("getCompareResult");
});
