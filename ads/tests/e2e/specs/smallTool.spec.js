describe("small-tool", () => {
  beforeEach(() => {
    cy.$getAuthStatus();
    cy.$getToolReservationId();
    cy.$getToolMaterialId();
  });

  it("查詢後顯示結果", () => {
    cy.visit("/smallTools");

    cy.get(".tools_search_block").then($elements => {
      cy.get($elements).each((element, index) => {
        cy.get(element)
          .find("button")
          .as(`button${index}`);
        cy.get(element)
          .find("input")
          .as(`input${index}`);

        cy.get(`@button${index}`)
          .should("have.length", 1)
          .should("be.disabled");
        cy.get(`@input${index}`).type("1234");
        cy.get(`@button${index}`).should("be.enabled");
        cy.get(`@button${index}`).click();
        cy.get(element)
          .siblings(".tools_search_result")
          .should("be.visible");
      });
    });
  });
});
