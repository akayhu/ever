// 取得版位資訊
Cypress.Commands.add("$getBoard", () => {
  cy.fixture("board.json").then(data => {
    cy.intercept(`api/component/site/*/channel/*/board`, data.boardInfo);
  });
});

// 從版位+型態取得單筆版位資訊(含型態內容)
Cypress.Commands.add("$getBoardInfo", () => {
  cy.fixture("board.json").then(data => {
    cy.intercept(`api/component/board/*/type/*?*`, data.boardType);
  });
});

// 版位名稱推薦
Cypress.Commands.add("$getBoardSuggest", () => {
  cy.fixture("board.json").then(data => {
    cy.intercept(`api/component/product/board/suggest?keyword=*`, data.suggest);
  });
});
