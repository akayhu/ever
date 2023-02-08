// 查詢小工具-查詢素材
Cypress.Commands.add("$getToolMaterialId", () => {
  cy.intercept("api/tool/material/*?*", {
    response: {
      device: "APP",
      siteId: 3,
      siteName: "工作快找",
      channelId: 16,
      channelName: "【下線】優化版首頁",
      boardId: 51,
      boardName: "黃金看版",
      customerId: 1112079913,
      customerName: "台新餐飲設備股份有限公司",
      projectId: 12,
      projectName: "台新餐飲設備_職缺驗收",
      materialTitle: "素材001",
      reservationId: 1369,
      startDate: "2021/01/18",
      endDate: "2021/01/24"
    }
  });
});

// 查詢小工具-查詢檔期
Cypress.Commands.add("$getToolReservationId", () => {
  cy.intercept("api/tool/reservation/*?*", {
    response: {
      device: "APP",
      siteId: 3,
      siteName: "工作快找",
      channelId: 47,
      channelName: "新版搜尋頁",
      boardId: 136,
      boardName: "人氣文字2(全職)",
      projectId: 27,
      projectName: "加百裕工業_April_20201214",
      customerId: 1110206294,
      customerName: "加百裕工業股份有限公司",
      startDate: "2020/12/21",
      endDate: "2020/12/27"
    }
  });
});
