// 選擇企業
Cypress.Commands.add("$getCustomerSuggestion", () => {
  cy.fixture("project.json").then(data => {
    cy.intercept(`api/customer/suggestion?keyword=*`, data.customerSuggestion);
  });
});

// 依推薦結果查詢專案(列表)
Cypress.Commands.add("$getProjectList", (projectId = 1) => {
  cy.fixture("project.json").then(data => {
    cy.intercept(`api/project/1?projectId=*`, data.projectInfo);
  });
});

// 新增預約專案
Cypress.Commands.add("$postProject", () => {
  cy.intercept("POST", "api/project", { response: 1 });
});

// 修改預約專案
Cypress.Commands.add("$patchProject", () => {
  cy.intercept("patch", "api/project/*", { response: 1 });
});

// 查詢單筆預約專案
Cypress.Commands.add("$getProject", () => {
  cy.fixture("project.json").then(data => {
    cy.intercept("api/project/*", data.projectInfo);
  });
});

// 刪除預約專案
Cypress.Commands.add("$deleteProjectId", () => {
  cy.intercept("delete", "api/project/*", { response: 1 });
});

// 依關鍵字推薦專案
Cypress.Commands.add("$getProjectRecommend", () => {
  cy.intercept("delete", "api/project/recommend?keyword=*", {
    response: {
      customerId: 1234,
      customerName: "永慶房屋",
      owner: "T1234",
      projectId: 1000,
      projectName: "信義房屋-20200505",
      projectStatus: 1,
      projectType: 0
    }
  });
});

// 依關鍵字搜尋專案(預約版位銷用)
Cypress.Commands.add("$getProjectSearch", () => {
  cy.intercept("delete", "api/project/search?keyword=*", {
    response: {
      id: 13579,
      name: "永慶房屋"
    }
  });
});

// 依關鍵字推薦企業或專案
Cypress.Commands.add("$getProjectSuggestion", () => {
  cy.intercept("delete", "api/project/suggestion?keyword=*", {
    response: {
      id: 13579,
      name: "永慶房屋"
    }
  });
});
