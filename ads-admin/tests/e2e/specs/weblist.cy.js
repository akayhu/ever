describe("網站維護測試", () => {
  beforeEach(() => {
    cy.$getAuthAdminStatus();
    cy.$getSite();
    cy.$getWebListPcAllSite();
    cy.$getWebListPcAllChannel();
    cy.$getWebListPcAllBoard();
    cy.$postSite();
    cy.$postChannel();
    cy.$getWebListPcBoardId();
    cy.$getType();
    cy.$getCondition();
    cy.visit("/weblist");
  });

  it("列表為工程測試用網站，頻道為 Akay 測試頻道 22 資料列表", () => {
    cy.get(
      ".web_list_search > div:nth-child(1) > span.device .el-select input[class=el-input__inner]"
    )
      .focus()
      .click();
    cy.get(
      ".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default > ul > li:nth-child(1)"
    )
      .first()
      .click();
    cy.get(
      ".web_list_search > div:nth-child(1) > span.device .el-select input[class=el-input__inner]"
    ).should("have.value", "PC");
    cy.get(".web_list_site .el-select input[class=el-input__inner]")
      .focus()
      .click();
    cy.get(".el-popper:nth-child(2) .el-select-dropdown__item:nth-child(4)")
      .should("contain", "工程測試用網站")
      .click();
    cy.get(".web_list_channel .el-select input[class=el-input__inner]")
      .focus()
      .click();
    cy.get(".el-popper:nth-child(3) .el-select-dropdown__item:nth-child(1)")
      .should("contain", "e2e測試頻道")
      .click();
    cy.get(".button_bg_blue_small")
      .should("have.length", 1)
      .should("contain", "查詢")
      .click();
  });

  it("顯示「請填入網站名稱」提示", () => {
    cy.get(".button_bg_white_large")
      .should("have.length", 2)
      .should("have.class", "button_bg_white_large")
      .should("contain", "+ 新增網站")
      .first()
      .click();
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "確定")
      .click();
    cy.get(".error_message > div").should("contain", "請填入網站名稱");
  });

  it("完成新增網站", () => {
    cy.get(".button_bg_white_large")
      .should("have.length", 2)
      .should("have.class", "button_bg_white_large")
      .should("contain", "+ 新增網站")
      .first()
      .click();
    cy.get(".create_web_table > tr:nth-child(2) > td:nth-child(2) > input")
      .focus()
      .type("e2e測試網站", { delay: 150 })
      .should("have.value", "e2e測試網站");
    cy.get(".create_web_table > tr:nth-child(3) > td:nth-child(2) > input")
      .focus()
      .type("https://www.e2etest.com.tw", { delay: 150 })
      .should("have.value", "https://www.e2etest.com.tw");
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "確定")
      .click();
    cy.request("/weblist").then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("顯示「請填入頻道名稱」、「請填入寬高」、「請填入延遲時間」提示", () => {
    cy.get(
      ".web_list_table > div:nth-child(4) > div:nth-child(4) > div > div:nth-child(2) > a"
    ).click();
    cy.request("/channeladd?siteId=135").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "確定")
      .click();
    cy.get(
      ".web_abb_table > table > tr:nth-child(1) > td:nth-child(2) > div > div"
    ).should("contain", "請填入頻道名稱");
    cy.get(
      ".web_abb_table > table > tr:nth-child(3) > td.size > div > div"
    ).should("contain", "請填入寬高");
    cy.get(
      ".web_abb_table > table > tr:nth-child(4) > td.millisecond > div > div"
    ).should("contain", "請填入延遲時間");
  });

  it("完成新增頻道", () => {
    cy.get(
      ".web_list_table > div:nth-child(4) > div:nth-child(4) > div > div:nth-child(2) > a"
    ).click();
    cy.request("/channeladd?siteId=135").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.get(".web_abb_table > table > tr:nth-child(1) > td:nth-child(2) > input")
      .focus()
      .type("e2e測試頻道", { delay: 150 })
      .should("have.value", "e2e測試頻道");
    cy.get(
      ".web_abb_table > table > tr:nth-child(3) > td.size > input:nth-child(1)"
    )
      .focus()
      .type("1920", { delay: 150 })
      .should("have.value", "1920");
    cy.get(
      ".web_abb_table > table > tr:nth-child(3) > td.size > input:nth-child(3)"
    )
      .focus()
      .type("780", { delay: 150 })
      .should("have.value", "780");
    cy.get(".web_abb_table > table > tr:nth-child(4) > td.millisecond > input")
      .focus()
      .type("3", { delay: 150 })
      .should("have.value", "3");
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "確定")
      .click();
    cy.request("/weblist").then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("顯示「請填入版位名稱、「請填寫可book數量」、「請填寫正確則數(左邊 <= 右邊)」提示", () => {
    cy.get(
      ".web_list_table > div:nth-child(4) > div:nth-child(4) > div.web_list_site > div:nth-child(1) > span"
    ).click();
    cy.get(
      ".web_list_table > div:nth-child(4) > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(3) > a"
    ).click();
    cy.request("/banneradd?siteId=135&channelId=179").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "儲存")
      .click();
    cy.get(
      "section > table > tr:nth-child(1) > td:nth-child(2) > div > div"
    ).should("contain", "請填入版位名稱");
    cy.get(
      "section > table > tr:nth-child(8) > td.book_quantity > div > div"
    ).should("contain", "請填寫可book數量");
    cy.get(
      "section > table > tr:nth-child(9) > td.book_quantity > div > div"
    ).should("contain", "請填寫正確則數(左邊 <= 右邊)");
  });

  it("完成新增版位", () => {
    cy.get(
      ".web_list_table > div:nth-child(4) > div:nth-child(4) > div.web_list_site > div:nth-child(1) > span"
    ).click();
    cy.get(
      ".web_list_table > div:nth-child(4) > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(3) > a"
    ).click();
    cy.request("/banneradd?siteId=135&channelId=179").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.get("section > table > tr:nth-child(1) > td:nth-child(2) > input")
      .type("e2e測試版位", { delay: 150 })
      .should("have.value", "e2e測試版位");
    cy.get(
      "section > table > tr:nth-child(7) > td > div > div.type_first_main > table > tr:nth-child(1) > td > div"
    ).click();
    cy.get(
      ".el-popper:nth-child(2) .el-select-dropdown__wrap > ul > li:nth-child(2)"
    ).click();
    cy.get(
      ".type_first_main > table > tbody > tr.bb1 > td > span:nth-child(2) > input"
    )
      .type("10", { delay: 150 })
      .should("have.value", "10");
    cy.get("section > table > tr:nth-child(8) > td.book_quantity > input")
      .type("1", { delay: 150 })
      .should("have.value", "1");
    cy.get(
      " section > table > tr:nth-child(9) > td.book_quantity > input:nth-child(1)"
    )
      .type("0", { delay: 150 })
      .should("have.value", "0");
    cy.get(
      "section > table > tr:nth-child(9) > td.book_quantity > input:nth-child(2)"
    )
      .type("1", { delay: 150 })
      .should("have.value", "1");
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "儲存")
      .click();
    cy.request("/weblist").then(response => {
      expect(response.status).to.eq(200);
    });
  });
});
