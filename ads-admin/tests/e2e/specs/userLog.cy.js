describe("使用者行為記錄測試", () => {
  beforeEach(() => {
    cy.$getAuthAdminStatus();
    cy.$getLogList();
    cy.$getAccountSearch();
    cy.$getCompareResult();
  });

  it("到使用者行為記錄頁", () => {
    cy.visit("/loginhome");
    cy.get(".menu_section > div:nth-child(1) > a")
      .should("contain", "會員管理")
      .realHover();
    cy.get(".menu_section > nav > ul > li:nth-child(2) > a")
      .should("contain", "使用者行為記錄")
      .realClick();
    cy.request("/userlog").then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("列表只顯示搜尋 9999 相關帳號列表資料，清除搜尋條件顯示所有列表資料", () => {
    cy.visit("/userlog");
    cy.get(".user_behavior_search > div:nth-child(1) > div > div > div > input")
      .focus()
      .type("9999", { delay: 150 })
      .should("have.value", "9999");
    cy.$getSelectOptions("e2e.text(Cypress/9999)").click();
    cy.get(".user_behavior_search > div:nth-child(2) input").focus().click();
    cy.$getSelectOptions("會員").click();
    // cy.get(".el-select-dropdown__item").eq(2).click();
    // cy.get(".user_account:nth-child(2) .el-select input").should(
    //   "have.value",
    //   "會員"
    // );
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
    cy.get(".button_bg_white_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_white_large")
      .should("contain", "清除")
      .click({ force: true });
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click({ force: true });
  });

  it("顯示「請選擇分類」、「請輸入ID」提示", () => {
    cy.visit("/userlog");
    cy.get(".search_user_log_block > ul > li:nth-child(2)")
      .should("contain", "查詢歷程")
      .click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
    cy.get(
      ".user_behavior_search > div:nth-child(1) > div > div.error_message > div"
    ).should("contain", "請選擇分類");
    cy.get(
      ".user_behavior_search > div:nth-child(2) > div > div.error_message > div"
    ).should("contain", "請輸入ID");
  });

  it("顯示有關 9999 動作修改歷程列表", () => {
    cy.visit("/userlog");
    cy.get(".search_user_log_block > ul > li:nth-child(2)")
      .should("contain", "查詢歷程")
      .click();
    cy.get(".user_behavior_search > div:nth-child(1) input").focus().click();
    cy.get(".el-select-dropdown__item").eq(1).click();
    cy.get(".user_account:nth-child(1) .el-select input").should(
      "have.value",
      "會員"
    );
    cy.get(".user_behavior_search > div:nth-child(2) > div > input")
      .focus()
      .type("9999", { delay: 150 })
      .should("have.value", "9999");
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
  });

  it("顯示變更差異彈跳視窗並 3 秒後關閉", () => {
    cy.visit("/userlog");
    cy.get(
      "section.log_list_block > div:nth-child(2) > div:nth-child(6) > span"
    )
      .should("contain", "變更差異")
      .click();
    cy.wait(3000);
    cy.get(
      " div.modal > div.modal_container > div.modal_header > div.modal_cross > img"
    ).click();
  });

  it("顯示資料欄位彈跳視窗並 3 秒後關閉", () => {
    cy.visit("/userlog");
    cy.get(
      "section.log_list_block > div:nth-child(2) > div:nth-child(7) > span"
    )
      .should("contain", "資料欄位")
      .click();
    cy.wait(3000);
    cy.get(
      " div.modal > div.modal_container > div.modal_header > div.modal_cross > img"
    ).click();
  });
});
