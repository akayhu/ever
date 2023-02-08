// 拿到特定站點底下有多少個頻道
Cypress.Commands.add("$getChannel", () => {
  cy.intercept(`api/component/site/*/channel?*`, {
    response: [
      {
        id: 4,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "首頁",
        url: "https://www.104-dev.com.tw/jobs/main/",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 16
      },
      {
        id: 5,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "工作列表頁",
        url: "https://www.104-dev.com.tw/jobs/search",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 6
      },
      {
        id: 6,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "職缺頁",
        url: "http://www.104-dev.com.tw/job/",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 6
      },
      {
        id: 13,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "轉職專區首頁",
        url: "https://www.104-dev.com.tw/jobs/main/changejob/?tab=job_1_1",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 1
      },
      {
        id: 14,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "公司列表頁",
        url: "https://www.104-dev.com.tw/company/?jobsource=cs_custlist&mode=s",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 8
      },
      {
        id: 15,
        siteId: 4,
        siteName: "人力銀行B主網",
        device: "PC",
        name: "VIP登入首頁",
        url: null,
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 1
      }
    ]
  });
});
