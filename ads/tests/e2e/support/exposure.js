// 修改曝光時間素材對應
Cypress.Commands.add("$putExposure", () => {
  cy.intercept("PUT", `/api/exposure*`, {});
});

// 取得曝光時間素材對應
Cypress.Commands.add("$getExposureReservation", () => {
  cy.intercept(`/api/exposure/reservation/*`, {
    response: {
      singleMaterial: true,
      materialExposures: [
        {
          startDate: "2022/07/11",
          materialId: null,
          edible: false,
          title: null,
          today: -1
        }
      ],
      finished: false
    }
  });
});

// 清除所有曝光時間素材對應
Cypress.Commands.add("$deleteExposureReservation", () => {
  cy.intercept("DELETE", `/api/exposure/reservation/*`, {});
});
