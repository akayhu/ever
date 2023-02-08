// 拿到裝置底下有多少個站點
Cypress.Commands.add("$getSite", () => {
  cy.intercept(`api/component/site?*`, {
    response: {
      content: [
        {
          id: 1,
          name: "人力銀行C主網",
          url: "https://www.104.com.tw/",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 14
        },
        {
          id: 4,
          name: "人力銀行B主網",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 5,
          name: "工程開發用網站",
          url: null,
          device: "PC",
          status: true,
          sort: null,
          channelCount: 2
        },
        {
          id: 6,
          name: "VM測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 14,
          name: "行雲流水",
          url: null,
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 40,
          name: "QA測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 102,
          name: "Victor測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 134,
          name: "max test",
          url: null,
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 108,
          name: "Sam測試用網站",
          url: "https://www.sam-test.com.tw",
          device: "PC",
          status: false,
          sort: null,
          channelCount: 1
        }
      ],
      totalPages: 1,
      totalElements: 9,
      last: false,
      size: 50,
      page: 1,
      numberOfElements: 9
    }
  });
});
