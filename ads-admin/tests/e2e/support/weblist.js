Cypress.Commands.add("$getWebListPcAllSite", () => {
  cy.fixture("site.json").then(data => {
    cy.intercept("api/component/site?*", data.weblistSearchPcAllSite).as(
      "getWebListPcAllSite"
    );

    // cy.intercept("api/component/site?*", data.weblistSearchPcAllSite).as(
    //   "getWebListPcAllSite2"
    // );
  });

  cy.intercept("api/component/site/*?siteId=*", {
    response: {
      id: 5,
      name: "工程測試用網站",
      url: null,
      device: "PC",
      status: true,
      sort: null,
      channelCount: 2
    }
  }).as("getWebListPcAssignSiteId");

  cy.intercept("api/component/site/suggest?keyword=*", {
    response: [
      {
        id: 5,
        name: "工程測試用網站",
        url: null,
        device: "PC",
        status: true,
        sort: null,
        channelCount: null
      }
    ]
  }).as("getWebListPcAssignSite");

  cy.intercept("api/component/site/*?siteId=*", {
    response: {
      id: 135,
      name: "e2e測試網站",
      url: "https://www.e2etest.com.tw",
      device: "PC",
      status: true,
      sort: null,
      channelCount: 1
    }
  }).as("getWebListPcSite135");
});

Cypress.Commands.add("$postSite", () => {
  cy.intercept("POST", "api/component/site", {
    response: {
      id: 135,
      name: "e2e 測試網站",
      url: "https://www.e2etest.com.tw",
      device: "PC",
      status: true,
      sort: null,
      channelCount: null
    }
  }).as("postSite");
});

Cypress.Commands.add("$postChannel", () => {
  cy.intercept("POST", "api/component/site/*/channel", {
    response: [
      {
        id: 179,
        siteId: 135,
        siteName: "e2e測試網站",
        device: "PC",
        name: "e2e測試頻道",
        url: null,
        sleep: 3,
        width: 1920,
        height: 780,
        status: true,
        boardCount: null
      }
    ]
  }).as("postChannel");
});

Cypress.Commands.add("$getWebListPcAllChannel", () => {
  cy.fixture("channel.json").then(data => {
    cy.intercept(
      "api/component/site/*/channel?siteId=*",
      data.webListSearchPcChannel
    ).as("getWebListPcAllChannel");
  });

  cy.intercept("api/component/site/*/channel/*?siteId=*", {
    response: {
      id: 162,
      siteId: 5,
      siteName: "工程測試用網站",
      device: "PC",
      name: "Akay測試頻道22",
      url: "https://tw.yahoo.com",
      sleep: 7000,
      width: 1500,
      height: 1500,
      status: true,
      boardCount: 2
    }
  }).as("getWebListPcAssignChannelId");

  cy.intercept("api/component/site/*?siteId=*", {
    response: [
      {
        id: 179,
        siteId: 135,
        siteName: "e2e測試網站",
        device: "PC",
        name: "e2e測試頻道",
        url: null,
        sleep: 3,
        width: 1920,
        height: 780,
        status: true,
        boardCount: null
      }
    ]
  }).as("getWebListPcSiteChannel179");

  cy.intercept("api/component/site/*/channel/*?siteId=*", {
    response: {
      id: 179,
      siteId: 135,
      siteName: "e2e測試網站",
      device: "PC",
      name: "e2e測試頻道",
      url: null,
      sleep: 3,
      width: 1920,
      height: 780,
      status: true,
      boardCount: null
    }
  }).as("getWebListPcSiteChannel179_2");

  cy.intercept("api/component/site/*/channel?siteId=*", {
    response: [
      {
        id: 179,
        siteId: 135,
        siteName: "e2e測試網站",
        device: "PC",
        name: "e2e測試頻道",
        url: null,
        sleep: 3,
        width: 1920,
        height: 780,
        status: true,
        boardCount: null
      }
    ]
  }).as("getWebListPcChannel179");
});

Cypress.Commands.add("$getWebListPcAllBoard", () => {
  cy.intercept("api/component/site/*/channel/*/board?siteId=*", {
    response: [
      {
        id: 376,
        channelId: 162,
        channelName: "Akay測試頻道22",
        siteId: 5,
        siteName: "工程測試用網站",
        device: "PC",
        name: "型態 28 test",
        url: null,
        conditionId: 15,
        snapshot: false,
        typeId: 28,
        style: "型態 28",
        responseTypeTemplateDetail: null,
        reserve: 1,
        lowerLimit: 1,
        upperLimit: 1,
        promotion: true,
        status: true,
        associateWithProduct: null,
        canDelete: null,
        sort: 90101010
      },
      {
        id: 413,
        channelId: 162,
        channelName: "Akay測試頻道22",
        siteId: 5,
        siteName: "工程測試用網站",
        device: "PC",
        name: "test",
        url: null,
        conditionId: 0,
        snapshot: true,
        typeId: 2,
        style: "",
        responseTypeTemplateDetail: null,
        reserve: 1,
        lowerLimit: 1,
        upperLimit: 2,
        promotion: false,
        status: true,
        associateWithProduct: null,
        canDelete: null,
        sort: 1111111
      }
    ]
  }).as("getWebListPcAssignBoardId");
});

Cypress.Commands.add("$getWebListPcBoardId", () => {
  cy.intercept("api/type/*/boardId/*?boardId=*", {
    response: { typeId: null, boardId: null, memo: null, groupList: null }
  }).as("getWebListPcBoardId0");

  cy.intercept("api/type/*/boardId/*?boardId=*", {
    response: {
      typeId: 2,
      boardId: 0,
      memo: null,
      groupList: [
        {
          groupNo: 1,
          name: null,
          elementList: [
            {
              elementType: "text",
              title: "文字",
              textLimit: null,
              placeholder: null,
              linkable: 1
            }
          ]
        }
      ]
    }
  }).as("getWebListPcBoardId2");

  cy.intercept("POST", "api/component/site/135/channel/179", {
    response: {
      id: 427,
      channelId: 179,
      channelName: "e2e測試頻道",
      siteId: 135,
      siteName: "e2e測試網站",
      device: "PC",
      name: "e2e測試版位",
      url: null,
      conditionId: 0,
      snapshot: true,
      typeId: 2,
      style: "",
      responseTypeTemplateDetail: {
        typeId: 2,
        boardId: 427,
        memo: null,
        groupList: [
          {
            groupNo: 1,
            name: null,
            elementList: [
              {
                elementType: "text",
                title: "文字",
                textLimit: 10,
                placeholder: null,
                linkable: 1
              }
            ]
          }
        ]
      },
      reserve: 1,
      lowerLimit: 0,
      upperLimit: 1,
      promotion: false,
      status: true,
      associateWithProduct: null,
      canDelete: null,
      sort: 0
    }
  }).as("postBoardId427");
});

Cypress.Commands.add("$getType", () => {
  cy.intercept("api/type", {
    response: [
      { id: 1, name: "1通用：圖片(GIF / JPG / PNG 等)" },
      { id: 2, name: "2通用：文字" },
      { id: 3, name: "3通用：圖+文(左圖,右內文)" },
      { id: 4, name: "4通用：圖+文(左圖+右上標題+右下內文)" },
      { id: 5, name: "5通用：圖+文(上圖+下內文)" },
      { id: 6, name: "6通用：文+圖(左上標題+左下內文+右圖)" },
      { id: 7, name: "7專用：關鍵字職缺，多行文字(關鍵字+文案)" },
      { id: 8, name: "8通用：多行文字(大標+內文一+左下小標+右下內文二)" },
      {
        id: 9,
        name: "9專用：熱門企業，文+圖(圖+上文字一+中文字一+下文字一+底文字一)"
      },
      { id: 10, name: "10：精準廣告" },
      { id: 11, name: "11：Load 一次自動輪播" },
      { id: 12, name: "12：手風琴(多則圖+文同時呈現)" },
      { id: 13, name: "13：Slide Box(限行銷使用)" },
      { id: 14, name: "14專用：即將下線，熱門企業" },
      { id: 15, name: "15通用：文+圖(上標題+內文一+內文二+內文三+右圖)" },
      { id: 16, name: "16專用：頂呱呱，自動展開縮合(html5)" },
      {
        id: 17,
        name: "17專用：最強主打，圖+文(上圖+標題+內文+左下內文+右下內文)"
      },
      { id: 18, name: "18專用：品牌特區，圖+文(大圖+小圖+標題+內文八則+中圖)" },
      { id: 19, name: "19通用：文+圖(上標題+內文一+內文二+Action文案+右圖)" },
      { id: 20, name: "20通用：多行文字(大標+小標+內文一+內文二)" },
      { id: 21, name: "21通用：靜態文字" },
      { id: 22, name: "22通用：圖+文(左圖+上標題+內文一+內文二+Action文案)" },
      { id: 23, name: "23通用：文+圖(上標+內文一+內文二+右圖)" },
      { id: 24, name: "24通用：多行文字(左標題+右內文)" },
      { id: 25, name: "25專用：APP黃金看版(全兼)，特殊圖(左右下角圓弧角)" },
      { id: 26, name: "26通用：多行文字(左上大標+左內文+右小標)" },
      {
        id: 27,
        name: "27專用：產業特輯列表，文+圖(左圖+右頂上一標題+右頂上一類別+右上一文字+右上一文字+右中文字+右底文字一~四)​"
      },
      {
        id: 28,
        name: "28專用：產業特輯卡片，文+圖(圖+頂標題+上文字一+中文字二+底文字)​:"
      },
      { id: 29, name: "29通用：多行文字(靜態文字+PK條件)" }
    ]
  }).as("getType");
});

Cypress.Commands.add("$getCondition", () => {
  cy.intercept("GET", "api/condition/?page=*", {
    response: {
      content: [
        {
          id: 36,
          name: "測試產業動態",
          memo: "被動電子元件製造業1001005002",
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 28,
          name: "公司搜尋列表_科技研發業(新鮮人)",
          memo: "類目搜尋indcat_sub\n關鍵字搜尋結果第一筆企業對應類目indcat_kw",
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 27,
          name: "公司搜尋列表_營建製造業(新鮮人)",
          memo: null,
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 26,
          name: "公司搜尋列表_服務業(新鮮人)",
          memo: "類目搜尋indcat_sub\n關鍵字搜尋結果第一筆企業對應類目indcat_kw\n",
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 25,
          name: "公司搜尋列表_金融保險業(新鮮人)_1004001001",
          memo: "四大產業\n動線有二\n(1)類目搜尋:命中指定產業\n(2)關鍵字搜尋:結果第一家企業的產業有命中指定產業\n金融機構及其相關業(584)+投資理財相關業(548)\n(共1,132家公司)",
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 24,
          name: "CP test",
          memo: null,
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 20,
          name: "公司搜尋列表_半導體產業特輯",
          memo: null,
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 15,
          name: "公司頁TAG_半導體產業特輯",
          memo: "1",
          conditionGroups: null,
          responseBoards: null
        },
        {
          id: 12,
          name: "公司頁TAG_新鮮人產業特輯",
          memo: "有進駐企業館的企業，此處填寫custNo\n資料來源by每周五，檔案連結(待瑞秋提供)\ncustno轉換小工具https://i3wtj9.axshare.com/Cteam.html\n\n興潤房屋仲介有限公司\t12653785000\n加XXXXXXX股份有限公司\t96965564000\n多麗絲股份有限公司\t12246681000\n台新餐飲設備股份有限公司\t96949827000\n阿哈哈有限公司 (廣告平台測試中勿關閉)\t130000000079238\n山山股份有限公司艾波測試勿動\t27347309000\n",
          conditionGroups: null,
          responseBoards: null
        }
      ],
      totalPages: 1,
      totalElements: 9,
      last: false,
      size: 100,
      page: 1,
      numberOfElements: 9
    }
  }).as("getCondition");
});
