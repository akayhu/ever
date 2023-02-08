describe("maintain", () => {
  beforeEach(() => {
    cy.$getAuthStatus();

    cy.$getFilterCustomerSuggest();
    cy.$getFilterProjectSuggest();
    cy.$getMaintainJobSetting();
  });

  it("查詢後，url 包含 selectedDate、selectedCompany、selectedProject等參數", () => {
    cy.visit("/maintain_new");

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
});
