describe.skip("登入測試", () => {
  beforeEach(() => {
    cy.intercept("/api/admin/auth/status", {
      response: {
        accessible: true,
        accountId: null,
        allowedSite: [],
        dataPermission: [],
        logonId: null,
        name: null,
        role: 0,
        specialPermission: [],
        type: 0
      }
    }).as("noLogin");
    cy.visit("https://localhost:8787/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "zh-Hant" });
        Object.defineProperty(win.navigator, "languages", { value: ["zh"] });
        Object.defineProperty(win.navigator, "accept_languages", {
          value: ["zh"]
        });
      },
      headers: {
        "Accept-Language": "zh"
      }
    })
      .its("navigator.language")
      .should("equal", "zh-Hant");
    cy.wait("@noLogin").its("response.statusCode").should("eq", 200);
  });

  it("到會員登入頁", () => {
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.text", "登入")
      .click();
    cy.request(
      "https://sso.fp.104-dev.com.tw/admin/login?clientId=adplatform-admin&relayState=/loginhome"
    ).then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("顯示「帳號或密碼錯誤」提示", () => {
    cy.get(".button_bg_blue_large")
      .should("have.length", 1)
      .should("have.text", "登入")
      .click();
    cy.request(
      "https://sso.fp.104-dev.com.tw/admin/login?clientId=adplatform-admin&relayState=/loginhome"
    ).then(response => {
      expect(response.status).to.eq(200);
    });
    cy.get(".acc_input")
      .type("e2e.test", { delay: 150 })
      .should("have.value", "e2e.test");
    cy.get(".pass_input")
      .type("1234", { delay: 150 })
      .should("have.value", "1234");
    cy.get("label[for=remember_acc]").click();
    cy.intercept("https://sso.fp.104-dev.com.tw/admin/confirm").then(res => {
      console.log(res);
    });
    cy.get(".login_submit")
      .should("have.length", 1)
      .should("have.value", "登入")
      .click();
    cy.request(
      "https://sso.fp.104-dev.com.tw/admin/login?clientId=adplatform-admin&relayState=%2Floginhome"
    ).then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it("未登入或已登入，點擊 logo，回首頁", () => {
    cy.get("a[href='/']")
      .should("have.length", 1)
      .click()
      .request("https://localhost:8787/")
      .then(response => {
        expect(response.status).to.eq(200);
      });
  });
});
