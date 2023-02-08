describe("newpj", () => {
  beforeEach(() => {
    cy.$getAuthStatus();

    cy.$getCustomerSuggestion();
    cy.$getProjectList();
    cy.$postProject();
    cy.$getReservation(0);
  });

  it("新增專案時，取消後顯示編輯頁面", () => {
    cy.visit("/newpj");

    cy.get(".button_block .button_bg_white_large").click();
    cy.url().should("include", "/pjmanage");
    cy.get(".pjmanage_wrapper_title").should("have.text", "專案及版位維護");
  });

  it("新增專案，儲存後顯示錯誤提示", () => {
    cy.visit("/newpj");

    cy.get(".button_block .button_bg_blue_large").click();
    cy.get(".error_message").should("have.length", 2);
    cy.get(".error_message")
      .eq(0)
      .should("have.text", " 請選擇正確企業名稱 ");
    cy.get(".error_message")
      .eq(1)
      .should("have.text", " 請填入專案名稱 ");
  });

  it("新增專案，填入完整資料後顯示專案內容", () => {
    cy.visit("/newpj");

    // 企業
    cy.$getSelectDropdown("company");
    cy.get("@companyDiv").type("test");
    cy.$getSelectOptions("test1").click();

    // 預約人員
    cy.$getSelectByClass("account")
      .get("@accountInput")
      .should("have.value", "系統管理者(1)");

    cy.get(".button_bg_blue_large").click();
    cy.get(".dialog_btn_confirm").click();

    cy.get("input[placeholder='輸入企業統編或企業名稱']").should("be.disabled");
    cy.get(
      "input[placeholder='建議：企業名稱-今日日期，信義房屋20200103']"
    ).should("be.disabled");
    cy.get(".filter").should("be.visible");
    cy.get(".no_reserved_layout")
      .should("be.visible")
      .should("have.text", "無預約版位");
  });
});

describe("editpj", () => {
  beforeEach(() => {
    cy.$getAuthStatus();
    cy.$getBoardSuggest();
    cy.$getCustomerSuggestion();
    cy.$getProjectList();
    cy.$postProject();
    cy.$getReservation(0);
    cy.$postReservation();
  });

  it("新增版位，儲存後顯示錯誤提示", () => {
    cy.visit("/editpj?projectId=1");

    cy.get(".button_bg_white_large").click();
    cy.get(".create_layout_table")
      .should("be.visible")
      .should("contain.text", "新增版位");
    cy.get(".create_layout_table .button_bg_blue_large").click();
    cy.get(".ac_layout .error_message").should(
      "have.text",
      " 請選擇正確版位名稱 "
    );
    cy.get(".date_td .error_message").should(
      "have.text",
      " 請選擇時間  起始日不能小於今日 "
    );
  });

  it("新增版位，輸入正確資料後，顯示預約資訊", () => {
    cy.visit("/editpj?projectId=1");

    cy.get(".button_bg_white_large").click();
    cy.get(".create_layout_table")
      .should("be.visible")
      .should("contain.text", "新增版位");
    cy.get(".ac_layout .el-select")
      .type("黃金大版位")
      .wait(1000)
      .type("{downArrow}{enter}");
    cy.get(".ac_commodity input").should(
      "have.value",
      "人力銀行主網/C首頁(2018)/黃金大版位天(10萬)"
    );
    cy.get(".date_td .el-date-editor").click();
    cy.get(".available.today")
      .click()
      .click();
    cy.get(".date_td input[type='number']").should("have.value", "1");
    cy.get(".create_layout_button_block .button_bg_blue_large").click();
    cy.get(".dialog_btn_confirm").click();
    cy.get(".error_message").should("have.length", 0);
  });

  it("調整銷用後，訊息爲完整時，顯示錯誤提示", () => {
    cy.$getReservation(1);

    cy.visit("/editpj?projectId=1");

    cy.get(".item .canEdit")
      .eq(0)
      .click();
    cy.get(".editItem").should("be.visible");

    cy.get(".contract .ad-radio-label").as("radioButtons");
    cy.contains(".button_block .button_bg_white_restraint", "儲存").as(
      "saveButton"
    );

    // 曝光專案
    cy.get("@radioButtons")
      .eq(1)
      .click();
    cy.get("@saveButton").click();
    cy.get(".contract .error_message")
      .should("be.visible")
      .should("have.text", " 請輸入專案名稱 ");

    // 舊單PR
    cy.get("@radioButtons")
      .eq(2)
      .click();
    cy.get("@saveButton").click();
    cy.get(".contract .error_message")
      .should("be.visible")
      .should("have.text", " 請輸入專案名稱 ");

    // 成效PR
    cy.get("@radioButtons")
      .eq(3)
      .click();
    cy.get("@saveButton").click();
    cy.get(".error_message")
      .last()
      .should("be.visible")
      .should("have.text", " 請填入PR原因 ");
  });

  it("已拉cue以上的狀態，日期爲 disabled", () => {
    cy.$getReservation(1);
    cy.visit("/editpj?projectId=1");

    cy.get(".item .canEdit")
      .eq(1)
      .click();
    cy.get(".editItem").should("be.visible");
    cy.get(".date_td .el-range-input").should("be.disabled");
  });
});
