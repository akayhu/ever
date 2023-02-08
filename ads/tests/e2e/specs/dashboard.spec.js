describe("dashboard", () => {
  beforeEach(() => {
    cy.$getSite();
    cy.$getChannel();
    cy.$getRemark();
    cy.$getReservationCalendar();
    cy.$getExpiredReservation();
    cy.$getDashboardReservation();
  });

  it("系統管理者導回行事曆", () => {
    cy.$getAuthStatus("admin");

    cy.visit("https://localhost:8780/");
    cy.get("h2").should("have.text", "檔期行事曆");
  });

  it("產品管理企劃導回行事曆", () => {
    cy.$getAuthStatus("productPlanner");

    cy.visit("https://localhost:8780/");
    cy.get("h2").should("have.text", "檔期行事曆");
  });

  it("產品管理VM導回行事曆", () => {
    cy.$getAuthStatus("productvm");

    cy.visit("https://localhost:8780/");
    cy.get("h2").should("have.text", "檔期行事曆");
  });

  it("產品主管導回行事曆", () => {
    cy.$getAuthStatus("productManager");

    cy.visit("/");
    cy.get("h2").should("have.text", "檔期行事曆");
  });

  it("整招營運企劃導回行事曆", () => {
    cy.$getAuthStatus("recruitPlanner");

    cy.visit("/");
    cy.get("h2").should("have.text", "檔期行事曆");
  });

  it("整招業務銷售人員顯示 dashboard 過期預約未刪除", () => {
    cy.$getAuthStatus("recruitSales");

    cy.visit("https://localhost:8780/");
    cy.get(".card").should("have.length", 1);
    cy.get(".card .title").should("have.text", "過期預約未刪除");
  });

  it("整昭營運同仁顯示 dashboard 全部資訊", () => {
    cy.$getAuthStatus("recruitMaintainer");

    cy.visit("/");

    cy.get(".card").should("have.length", 3);
    cy.get(".card .title")
      .eq(0)
      .should("have.text", "未上傳素材檔期");
    cy.get(".card .title")
      .eq(1)
      .should("have.text", "未拉cue檔期");
    cy.get(".card .title")
      .eq(2)
      .should("have.text", "過期預約未刪除");
  });

  it("整招主管顯示 dashboard 全部資訊", () => {
    cy.$getAuthStatus("recruitManager");

    cy.visit("/");

    cy.get(".card").should("have.length", 3);
    cy.get(".card .title")
      .eq(0)
      .should("have.text", "未上傳素材檔期");
    cy.get(".card .title")
      .eq(1)
      .should("have.text", "未拉cue檔期");
    cy.get(".card .title")
      .eq(2)
      .should("have.text", "過期預約未刪除");
  });
});
