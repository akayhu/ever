describe("使用者資料維護測試", () => {
  beforeEach(() => {
    cy.$getAuthAdminStatus();
    cy.$getAccount();
    cy.$getSite();
    cy.$getPhoneUser();
    cy.$getAccountSearch();
  });

  it("到使用者資料維護頁", () => {
    cy.visit("/loginhome");
    cy.wait("@getAuthAdminStatus").its("response.statusCode").should("eq", 200);
    cy.get(".menu_section > div:nth-child(1) > a")
      .should("contain", "會員管理")
      .click();
    cy.request("/userinfo").then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("到新增列表頁", () => {
    cy.visit("/userinfo");
    // cy.wait("@getAuthAdminStatus").its("response.statusCode").should("eq", 200);
    // cy.wait("@getAllAccount").its("response.statusCode").should("eq", 200);
    cy.get("[data-e2e='useradd']")
      .should("have.length", 1)
      .should("have.class", "button_bg_white_large")
      .should("contain", "+ 新增")
      .click();
    cy.url("contain", "/useradd");
  });

  it("顯示「請輸入員編」提示", () => {
    cy.visit("/useradd");
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "確定")
      .click();
    cy.get(".error_message div").should("contain", "請輸入員編");
  });

  it("新增會員成功", () => {
    cy.visit("/useradd");
    cy.get("input[class=el-input__inner]")
      .focus()
      .type("9999", { delay: 150 })
      .should("have.value", "9999");
    cy.get(".el-select-dropdown__item").first().click();
    cy.get(".el-select input").should("have.value", "9999(Cypress)");
    cy.get(
      ".job_category > div.job_category_wrapper > div:nth-child(1) > label"
    )
      .should("contain", "系統管理者")
      .click();
    cy.get(".published > div:nth-child(7) > div:nth-child(3) > label")
      .should("contain", "test2")
      .click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "確定")
      .click();
    cy.request("/userinfo").then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("回到使用者資料維護頁", () => {
    cy.visit("/useradd");
    cy.get(".button_bg_white_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_white_large")
      .should("contain", "取消")
      .click();
    cy.request("/userinfo").then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("搜尋列表資料為 9999 相關列表資料", () => {
    cy.visit("/userinfo");
    cy.get("input[class=el-input__inner]")
      .focus()
      .type("9999", { delay: 150 })
      .should("have.value", "9999");
    cy.get(".el-select-dropdown__item").first().click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
  });

  it("列表資料為全部使用者資料", () => {
    cy.visit("/userinfo");
    cy.get("input[class=el-input__inner]")
      .focus()
      .type("9999", { delay: 150 })
      .should("have.value", "9999");
    cy.get(".el-select-dropdown__item").first().click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
    cy.get(".button_bg_white_large")
      .should("have.length", 3)
      .should("have.class", "button_bg_white_large")
      .should("contain", "清除")
      .first()
      .click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
  });

  it("完成編輯 9999 會員資料", () => {
    cy.visit("/userinfo");
    cy.get("input[class=el-input__inner]")
      .focus()
      .type("9999", { delay: 150 })
      .should("have.value", "9999");
    cy.get(".el-select-dropdown__item").first().click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
    cy.get(".account_items_main .pointer").eq(0).click();
    cy.get(
      ".job_category > div.job_category_wrapper > div:nth-child(2) > label"
    )
      .should("contain", "產品管理企劃")
      .click();
    cy.get(".emergency-label")
      .should("have.length", 1)
      .should("have.class", "emergency-label")
      .should("contain", "緊急上下架")
      .click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "儲存")
      .click();
    cy.request("/userinfo").then(response => {
      expect(response.status).to.eq(200);
    });
  });
});
