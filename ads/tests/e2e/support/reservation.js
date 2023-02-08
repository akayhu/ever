// 依專案查詢預約檔期
Cypress.Commands.add("$getReservation", () => {
  cy.intercept(`api/reservation?*`, { response: {} });
});

// 選擇企業
Cypress.Commands.add("$postReservation", () => {
  cy.fixture("project.json").then(data => {
    cy.intercept(`api/customer/suggestion?keyword=*`, data.customerSuggestion);
  });
});

// 修改(刪除)預約檔期
Cypress.Commands.add("$deleteReservation", () => {
  cy.intercept("+(DELETE|PATCH)", `api/reservation/*`, { response: {} });
});

// 依專案預約者與委刊單期間取得委刊單號
Cypress.Commands.add("$getReservationOrder", () => {
  cy.intercept(`/api/reservation/order?*`, {
    response: [
      {
        orderId: "31110-201200010",
        customerId: 1211001829,
        customerName: "一零四資訊科技股份有限公司"
      }
    ]
  });
});

// 依委刊單號取得簡要檔期資訊
Cypress.Commands.add("$getReservationOrderId", () => {
  cy.intercept(`/api/reservation/order/*?id=*`, {
    response: [
      {
        reservationId: 13567,
        boardId: 345,
        startDate: "2021/11/25",
        endDate: "2021/11/28",
        boardName: "贊助公司",
        siteId: 2,
        siteName: "人力銀行C主網",
        channelId: 1,
        channelName: "首頁",
        status: 5,
        allowMaterial: true,
        allowEmergency: false,
        emergencyPermission: true,
        device: "PC",
        typeId: 2,
        emergencyPublish: { on: false, off: false, status: 5, permission: true }
      }
    ]
  });
});

// 依委刊單號取得簡要檔期資訊
Cypress.Commands.add("$getReservationCalendar", () => {
  cy.fixture("calendar.json").then(data => {
    cy.intercept(`api/reservation/calendar?*`, data.reservation);
  });
});

// 依預約編號取得已預約檔期
Cypress.Commands.add("$getReservationSchedule", () => {
  cy.intercept(`api/reservation/*/schedule?*`, {});
});

// 依專案和關鍵字查詢版位
Cypress.Commands.add("$getReservationProjectSuggest", () => {
  cy.intercept(`api/reservation/project/*/board/suggest?*`, {});
});

// 依專案查詢預約檔期
Cypress.Commands.add("$getReservation", resType => {
  cy.fixture("project.json").then(data => {
    cy.intercept(`api/reservation?*`, req => {
      if (resType === 0) req.reply(data.reservationEmpty);
      else req.reply(data.reservationWithData);
    });
  });
});

// 新增預約檔期
Cypress.Commands.add("$postReservation", () => {
  cy.intercept("POST", `/api/reservation`, {
    response: { formalCount: 1, prepareCount: 0 }
  });
});
