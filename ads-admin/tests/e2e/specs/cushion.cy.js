describe("墊檔測試", () => {
  beforeEach(() => {
    cy.$getAuthAdminStatus();
  });

  it("連到前台上傳墊檔頁", () => {
    cy.visit("/loginhome");
    cy.get(".header_right");
    cy.get(".menu_section > div:nth-child(2) > a")
      .should("contain", "廣告元件管理")
      .realHover();
    cy.get(".menu_section > nav > ul > li:nth-child(3) > a")
      .should("contain", "墊檔素材上刊")
      .invoke("removeAttr", "target")
      .click();
    cy.url().should(
      "contain",
      "login?clientId=adplatform-internal&relayState=/cushion"
    );
  });
});
