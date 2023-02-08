describe("小工具測試", () => {
  beforeEach(() => {
    cy.$getAuthAdminStatus();
    cy.$getTools();
    cy.$getCustomer();
    cy.visit("/tools");
  });

  it("顯示「請至少輸入七碼」提示", () => {
    cy.get(
      ".list-group > div:nth-child(1) > div:nth-child(6) > input[type=text]"
    )
      .clear()
      .type("123{enter}", { delay: 150 })
      .should("have.value", "123");
    cy.get(".enter_at_least").should("contain", "請至少輸入七碼");
  });

  it("完成版位排序", () => {
    cy.get(
      ".list-group > div:nth-child(1) > div:nth-child(6) > input[type=text]"
    )
      .clear()
      .type("1234567{enter}", { delay: 150 });
  });

  it("素材更新數據，完成下載報表", () => {
    cy.get(".switch_tabs_element:nth-child(2)")
      .should("have.class", "switch_tabs_element")
      .should("contain", "素材更新數據")
      .click();
    cy.get(".unclosed_project a").should("contain", "下載報表").click();
    cy.wait("@downloadMaterialUpdateTimes")
      .its("response.statusCode")
      .should("eq", 401);
  });

  it("未結案專案清單，完成下載 2022 報表", () => {
    cy.get(".switch_tabs_element:nth-child(3)")
      .should("have.class", "switch_tabs_element")
      .should("contain", "未結案專案清單")
      .click();
    cy.get(".el-input__inner").click();
    cy.get(".el-select-dropdown__wrap .el-select-dropdown__item:nth-child(3)")
      .should("contain", "2022")
      .click();
    cy.get(".content a").should("contain", "下載報表").click();
    cy.wait("@downloadUnclosedProject")
      .its("response.statusCode")
      .should("eq", 401);
  });

  it("顯示 ERP custno 列表資料", () => {
    cy.get(".switch_tabs_element:nth-child(4)")
      .should("have.class", "switch_tabs_element")
      .should("contain", "ERP custno對照表")
      .click();
    cy.wait("@getCustomer").its("response.statusCode").should("eq", 200);
  });
});
