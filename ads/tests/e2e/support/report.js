// 選擇企業
Cypress.Commands.add("$getFilterCustomerSuggest", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(
      `api/report/filter/customer/suggest?keyword=*`,
      data.customerSuggestion
    );
  });
});

// 依關鍵字與廣告區間篩選有曝光的版位
// Cypress.Commands.add("$getFilterBoardSuggest", () => {
//   cy.fixture("report.json").then(data => {
//     cy.intercept(
//       `api/report/filter/board/suggest?keyword=*`,
//       data.boardSuggestion
//     );
//   });
// });

// 依專案編號查詢有曝光的版位

Cypress.Commands.add("$getFilterBoard", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(`api/report/filter/board?projectIds=*`, data.boardSuggestion);
  });
});

// 選擇專案
Cypress.Commands.add("$getFilterProjectSuggest", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(
      `api/report/filter/project/suggest?customerId=*`,
      data.projectSuggestion
    );
  });
});

// 查詢專案下設定之職缺資訊(含設定)
Cypress.Commands.add("$getMaintainJobSetting", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(
      `api/report/maintain/project/*/job-setting?projectId=*&start=*&end=*&page=1&size=100&settingFirst=false`,
      data.jobSetting
    );
  });
});

// 查詢專案下設定之職缺資訊(含設定)
Cypress.Commands.add("$postMaintainJobSetting", () => {
  cy.intercept("post", `api/report/maintain/project/*/job-setting`, {
    response: true
  });
});

// 企業結案報告-總表
Cypress.Commands.add("$getClosingProjectSummary", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(
      `/api/report/closing-project/project/*/summary?porjId=*`,
      data.projectSummary
    );
  });
});

// 企業結案報告-廣告數據版位總計
Cypress.Commands.add("$getClosingProjectBoardAdSummary", () => {
  cy.intercept(
    `/api/report/closing-project/project/*/board/*/summary?porjId=*&boardId=*`,
    { response: { impression: 295, click: 20, ctr: 6.78, sources: [] } }
  );
});

// 企業結案報告-廣告版位數據列表
Cypress.Commands.add("$getClosingProjectBoardAdData", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(
      `/api/report/closing-project/project/*/board/*/advertisingData?*`,
      data.projectAdvertisingData
    );
  });
});

//企業資料維護-查詢專案下設定之職缺數量
Cypress.Commands.add("$getMaintainJobSettingCount", () => {
  cy.intercept(`/api/report/maintain/project/*/job-setting-count?*`, {
    response: 50
  });
});

//企業資料維護-查詢網頁曝光設定與報表狀態
Cypress.Commands.add("$getMaintainJobSettingReportStatus", () => {
  cy.intercept(`/api/report/maintain/project/*/job-setting-report-status?*`, {
    response: 50
  });
});

// 企業結案報告-應徵數據控制器
Cypress.Commands.add("$getClosingProjectJobApplyDataSummary", () => {
  cy.intercept(
    `/api/report/closing-project/project/*/jobApplyData/summary?*`,
    {}
  );
});

// 企業結案報告:區間應徵數據總計
Cypress.Commands.add("$getClosingProjectJobApplyDataPeriodSummary", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(
      `/api/report/closing-project/project/*/jobApplyData/period-summary?*`,
      data.periodSummary
    );
  });
});

// 企業結案報告-應徵數據
Cypress.Commands.add("$getClosingProjectJobApplyData", () => {
  cy.fixture("report.json").then(data => {
    cy.intercept(
      `/api/report/closing-project/project/*/jobApplyData?*`,
      data.jobApplyData
    );
  });
});

// 產生結案報告:廣告數據綜合版本
Cypress.Commands.add("$renderAdvertisingReport", () => {
  cy.intercept(
    "POST",
    `/api/report/file/download/closing-project/advertising-complete-data`,
    { response: 3 }
  );
});

// 產生結案報告:主應數據各種版本
Cypress.Commands.add("$renderJobapplyReport", () => {
  cy.intercept(
    "POST",
    `/api/report/file/download/closing-project/jobapply-complete-data`,
    { response: 3 }
  );
});
