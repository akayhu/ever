describe("廣告與商品設定測試", () => {
  beforeEach(() => {
    cy.$getAuthAdminStatus();
    cy.$getProduct();
    cy.$getProductMisSearch();
    cy.$getSearchSite();
    cy.$getSearchChannel();
    cy.$getSearchBoard();
    cy.$putProduct();
    cy.$getProductBoardId();
    cy.visit("/product");
  });

  it("顯示最強主打相關列表資訊", () => {
    cy.get(
      ".product_search_block > div.ad_product_search > div:nth-child(1) > input"
    )
      .type("最強主打", { delay: 150 })
      .should("have.value", "最強主打");
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
  });

  it("顯示「請選擇商品」、「請選擇載具」、「請選擇網站」、「請選擇頻道」、「請選擇版位」提示", () => {
    cy.contains(".button_bg_white_large", "新增").click();

    cy.get(".button_bg_blue_large").should("contain", "儲存").click();

    let excepts = [
      "請選擇商品",
      "請選擇載具",
      "請選擇網站",
      "請選擇頻道",
      "請選擇版位"
    ];
    cy.get(".error_message").should("have.length", 5);
    cy.get(".error_message").each((el, index) => {
      cy.get(el).should("contain", excepts[index]);
    });
  });

  it("完成新增商品與版位維護", () => {
    cy.visit("/productadd");

    // 商品
    cy.$getSelectDropdown("product").get("@productDiv").type("黃金大版");
    cy.$getSelectOptions("人力銀行主網/首頁/黃金大版位(圖)").click();

    let attributes = [
      { name: "device", match: "PC" },
      { name: "site", match: "工程測試用網站" },
      { name: "channel", match: "Akay測試頻道22" },
      { name: "board", match: "型態 28 test" }
    ];

    // input select
    attributes.forEach(data => {
      cy.get(`[data-e2e='${data.name}'] input`).click();
      cy.contains(".el-select-dropdown__item", data.match).click();
    });

    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "儲存")
      .click();
  });

  it("完成商品與版位編輯", () => {
    cy.get("input[placeholder='請輸入商品或版位名稱']")
      .type("test", { delay: 150 })
      .should("have.value", "test");
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "查詢")
      .click();
    cy.get(".product_and_slot_list_block img.pointer").eq(0).click();
    cy.request("/productedit?productId=321").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.class", "button_bg_blue_large")
      .should("contain", "儲存")
      .click();
  });
});
