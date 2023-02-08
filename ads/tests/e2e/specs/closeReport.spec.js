describe("close-report", () => {
  beforeEach(() => {
    cy.$getAuthStatus();

    cy.$getFilterCustomerSuggest();
    cy.$getFilterBoard();
    cy.$getFilterProjectSuggest();
    cy.$getClosingProjectSummary();
    cy.$getBoardInfo();
    cy.$getClosingProjectBoardAdSummary();
    cy.$getClosingProjectBoardAdData();
  });

  it("查詢後，url 包含 selectedDate、selectedCompany、selectedProject等參數", () => {
    cy.visit("/report");

    cy.get(".button_bg_blue_large").as("filterButton");

    cy.get("@filterButton").should("be.disabled");
    cy.get(".el-range-input").should("be.disabled");

    // 企業
    cy.$getSelectDropdown("company")
      .get("@companyDiv")
      .type("test");
    cy.$getSelectOptions("test123").click();

    // 日期
    cy.$getDatePicker("project_datetime_range").click();
    cy.get(".available.today")
      .click()
      .click();

    // 專案
    cy.$getSelectByClass("project_selection").click();
    cy.$getSelectOptions("project_test123").click();

    cy.get("@filterButton")
      .should("be.enabled")
      .click();

    cy.url()
      .should("contain", "selectedDate")
      .should("contain", "selectedCompany")
      .should("contain", "selectedProject");
  });

  it("點擊廣告數據頁籤後，顯示數據列表", () => {
    cy.$renderAdvertisingReport();

    cy.visit(
      "/report?selectedDate=start%3D%222022%2F07%2F13%22%26end%3D%222022%2F07%2F13%22&selectedCompany=name%3D%22test123%28123%29%22%26id%3D123&selectedProject=id%3D123%26name%3D%22project_test123%22%26selfProject%3Dfalse%26startDate%3D%222021%2F09%2F08%22%26endDate%3D%222022%2F07%2F05%22%26value%3D123%26label%3D%22project_test123%22&searchedProjects=id%3D123%26name%3D%22project_test123%22%26selfProject%3Dfalse%26startDate%3D%222021%2F09%2F08%22%26endDate%3D%222022%2F07%2F05%22%26value%3D123%26label%3D%22project_test123%22&currentTab=TabProjectSummary"
    );

    cy.get(".table_header").should("contain", "廣告成效報告"); // wait for element
    cy.contains(".switch_tabs_element", "廣告數據").click();
    cy.get(".project_board_ad").should("be.visible");
    cy.get(".button_bg_white_small").click();
    cy.get(".el-message").should("contain", "報表產生中，欲下載請至下載報表");
    cy.get(".el-message__closeBtn").click();
    cy.get(".el-message").should("have.length", 0);
  });

  it("點擊主應數據頁籤後，顯示數據列表", () => {
    cy.$getClosingProjectJobApplyDataPeriodSummary();
    cy.$getClosingProjectJobApplyData();
    cy.$getMaintainJobSettingCount();
    cy.$getMaintainJobSettingReportStatus();
    cy.$renderJobapplyReport();

    cy.visit(
      "/report?selectedDate=start%3D%222022%2F07%2F13%22%26end%3D%222022%2F07%2F13%22&selectedCompany=name%3D%22test123%28123%29%22%26id%3D123&selectedProject=id%3D123%26name%3D%22project_test123%22%26selfProject%3Dfalse%26startDate%3D%222021%2F09%2F08%22%26endDate%3D%222022%2F07%2F05%22%26value%3D123%26label%3D%22project_test123%22&searchedProjects=id%3D123%26name%3D%22project_test123%22%26selfProject%3Dfalse%26startDate%3D%222021%2F09%2F08%22%26endDate%3D%222022%2F07%2F05%22%26value%3D123%26label%3D%22project_test123%22&currentTab=TabProjectSummary"
    );

    cy.get(".table_header").should("contain", "廣告成效報告"); // wait for element
    cy.contains(".switch_tabs_element", "主應數據").click();
    cy.get(".project_board_apply_table").should("be.visible");
    cy.get(".button_bg_white_small").click();
    cy.get(".el-message").should("contain", "報表產生中，欲下載請至下載報表");
    cy.get(".el-message__closeBtn").click();
    cy.get(".el-message").should("have.length", 0);
  });
});
