describe("設定條件測試", () => {
  beforeEach(() => {
    cy.$getAuthAdminStatus();
    cy.$getSetconditions();
  });

  // it("到設定條件頁", () => {
  //   cy.visit("/loginhome");
  //   cy.get(".menu_section > div:nth-child(2) > a")
  //     .should("contain", "廣告元件管理")
  //     .realHover();
  //   cy.get(".menu_section > nav > ul > li:nth-child(4) > a")
  //     .should("contain", "設定條件")
  //     .realClick();

  //   cy.url().should("contain", "/setconditions");
  // });

  it("到設定條件新增頁", () => {
    cy.visit("/setconditions");
    // cy.get(".button_bg_white_large").click();
    // cy.url().should("contain", "/conditionadd");
  });

  // it("顯示「請輸入Key」、請輸入「Value」提示", () => {
  //   cy.visit("/conditionadd");
  //   cy.get(".button_bg_blue_large")
  //     .should("have.length", 1)
  //     .should("have.class", "button_bg_blue_large")
  //     .should("contain", "確定")
  //     .click();
  //   cy.get(".name_wrapper .error_message").should("contain", "請輸入Key");
  //   cy.get(".key_block .error_message").should("contain", "請輸入Key");
  //   cy.get(".value_block .error_message").should("contain", "請輸入Value");
  // });

  // it("完成設定條件", () => {
  //   cy.visit("/conditionadd");
  //   cy.get("#conditionName")
  //     .type("條件設定測試", { delay: 150 })
  //     .should("have.value", "條件設定測試");
  //   cy.get(".textarea_memo textarea")
  //     .type("條件設定備註", { delay: 150 })
  //     .should("have.value", "條件設定備註");
  //   cy.get(".key_block .input_key")
  //     .type("e2e_key", { delay: 150 })
  //     .should("have.value", "e2e_key");
  //   cy.get(".input_value textarea")
  //     .type("e2e_value", { delay: 150 })
  //     .should("have.value", "e2e_value");
  //   cy.get(".input_memo textarea")
  //     .type("e2e備註說明", { delay: 150 })
  //     .should("have.value", "e2e備註說明");
  //   cy.get(".button_bg_blue_large")
  //     .should("have.length", 1)
  //     .should("have.class", "button_bg_blue_large")
  //     .should("contain", "確定")
  //     .click();
  //   cy.url().should("contain", "/setconditions");
  // });

  // it("刪除條件設定資料", () => {
  //   cy.visit("/setconditions");
  //   cy.get(
  //     ".set_conditions_list > div.list > div:nth-child(1) > div > div:nth-child(3) > img"
  //   ).click();
  //   cy.request("/conditionedit/49").then(response => {
  //     expect(response.status).to.eq(200);
  //   });
  //   cy.get("div.button_block > button:nth-child(2)")
  //     .should("have.length", 1)
  //     .should("have.class", "button_bg_white_large")
  //     .should("contain", "刪除")
  //     .click();
  //   cy.get(
  //     "div:nth-child(6) > div > div > div > div.el-dialog__body > div.dialog_button_block > button.button_bg_blue_large"
  //   )
  //     .should("have.class", "button_bg_blue_large")
  //     .should("contain", "確定")
  //     .click();
  //   cy.url().should("contain", "/setconditions");
  // });
});
