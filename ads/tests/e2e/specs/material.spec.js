describe("material", () => {
  beforeEach(() => {
    cy.$getAuthStatus();
    cy.$getAccountId();
    cy.$getAccountSearch();
    cy.$getReservationOrder();
    cy.$getReservationOrderId();
    cy.$getBoardInfo();
    cy.$getExposureReservation();
    cy.$getMaterialReservation();
    cy.$getMaterialFinalReservation();
    cy.$getMaterialReservationGrouping();
    cy.$putMaterial();
  });

  it.skip("上方查詢欄位，輸入後顯示結果", () => {
    cy.visit("/material");

    cy.$getSelectDropdown("account");
    cy.$getDatePicker("personnel");
    cy.$getSelectByClass("selectDropdownBlock");

    cy.get(".button_bg_blue_large").should("be.disabled");
    cy.get("@selectDropdownBlockInput").should("be.disabled");

    cy.get("@accountDiv").type("T1234");
    cy.$getSelectOptions("李麥克").click();

    cy.get("@personnelDiv").click();
    cy.get(".available.today")
      .click()
      .click();

    cy.wait(1000);

    cy.get("@selectDropdownBlockInput")
      .focus()
      .type("{enter}", { force: true });
    cy.$getSelectOptions("一零四").click();

    cy.get(".button_bg_blue_large").should("be.enabled");
  });

  it("上傳錯誤素材，跳出提示", () => {
    cy.visit("/material?id=30103-211000003&device=PC&reservationId=13567");
    cy.fixture("150x120.png", { encoding: null }).as("materialImage");

    cy.get(".default_img_bg_color")
      .should("have.attr", "src")
      .should("be.empty");
    cy.get("#upload_file_0_0").selectFile("@materialImage", {
      force: true
    });
    cy.get(".img_file_warning").should("contain.text", "尺寸錯誤，請重新上傳");
  });

  it("上傳正確素材，顯示圖片", () => {
    cy.visit("/material?id=30103-211000003&device=PC&reservationId=13567");
    cy.fixture("80x80.png", { encoding: null }).as("materialImage");

    cy.get(".default_img_bg_color")
      .invoke("attr", "src")
      .should("be.empty");
    cy.get("#upload_file_0_0").selectFile("@materialImage", {
      force: true
    });
    cy.get(".img_file_warning").should("not.be.visible");
    cy.get(".default_img_bg_color")
      .invoke("attr", "src")
      .should("not.be.empty");
  });

  it("輸入錯誤網址，出現提示", () => {
    cy.visit("/material?id=30103-211000003&device=PC&reservationId=13567");

    cy.get(".img_link input").type("123");
    cy.contains(".button_block .button_bg_white_restraint", "儲存").click();

    cy.get(".img_link .link-warning").should("be.visible");
  });

  it("輸入正確網址，跳出loading樣式", () => {
    cy.visit("/material?id=30103-211000003&device=PC&reservationId=13567");

    cy.get(".img_link input").type("https://google.com");
    cy.contains(".button_block .button_bg_white_restraint", "儲存").click();

    cy.get(".img_link .link-warning").should("not.be.visible");
  });
});
