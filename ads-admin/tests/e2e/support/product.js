Cypress.Commands.add("$getProduct", () => {
  cy.fixture("product.json").then(data => {
    cy.intercept("api/component/product?keyword=*", data.allProduct).as(
      "getProduct"
    );

    cy.intercept("api/component/product?keyword=*", data.searchProduct).as(
      "getSearchProduct"
    );

    cy.intercept("api/component/product?keyword=*", data.searchProductTest).as(
      "searchProductTest"
    );
  });

  cy.intercept("api/component/product/*?productId=*", {
    response: {
      id: 321,
      productCode: "MISC1020000114",
      name: "學生實習專區/首頁/首頁黃金版位－圖",
      status: true,
      boardList: [
        {
          id: 376,
          channelId: 162,
          channelName: "Akay測試頻道22",
          siteId: 5,
          siteName: "工程測試用網站",
          device: "PC",
          name: "型態 28 test",
          url: null,
          conditionId: null,
          snapshot: null,
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
          sort: 1
        }
      ],
      createDate: "2021-11-24T02:48:23.000+0000",
      updateDate: "2021-11-24T02:48:23.000+0000"
    }
  }).as("getProductId");

  cy.intercept("api/component/product/board/*?boardId=*", {
    response: [
      {
        id: 321,
        productCode: "MISC1020000114",
        name: "學生實習專區/首頁/首頁黃金版位－圖",
        status: true,
        boardList: [
          {
            id: 376,
            channelId: 162,
            channelName: "Akay測試頻道22",
            siteId: 5,
            siteName: "工程測試用網站",
            device: "PC",
            name: "型態 28 test",
            url: null,
            conditionId: null,
            snapshot: null,
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
            sort: 1
          }
        ],
        createDate: "2021-11-24T02:48:23.000+0000",
        updateDate: "2021-11-24T02:48:23.000+0000"
      }
    ]
  }).as("getProductIdBoardId");
});

Cypress.Commands.add("$putProduct", () => {
  cy.intercept("PUT", "api/component/product", {
    response: {
      id: 433,
      productCode: "MISC1030000020",
      name: "人力銀行主網/首頁/黃金大版位(圖)",
      status: true,
      boardList: [
        {
          id: 413,
          channelId: 162,
          channelName: "Akay測試頻道22",
          siteId: 5,
          siteName: "工程測試用網站",
          device: "PC",
          name: "test",
          url: null,
          conditionId: null,
          snapshot: null,
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
          sort: 1
        }
      ],
      createDate: "2022-07-04T06:20:36.000+0000",
      updateDate: "2022-07-04T06:20:36.000+0000"
    }
  }).as("putProduct");
});

Cypress.Commands.add("$getProductBoardId", () => {
  cy.intercept("GET", "api/component/product/board/*?boardId=*", {
    response: [
      {
        id: 430,
        productCode: "MISC1100000098",
        name: "test精準廣告",
        status: true,
        boardList: [
          {
            id: 413,
            channelId: 162,
            channelName: "Akay測試頻道22",
            siteId: 5,
            siteName: "工程測試用網站",
            device: "PC",
            name: "test",
            url: null,
            conditionId: null,
            snapshot: null,
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
            sort: 1
          }
        ],
        createDate: "2022-06-16T07:27:23.000+0000",
        updateDate: "2022-06-16T07:27:23.000+0000"
      },
      {
        id: 433,
        productCode: "MISC1030000020",
        name: "人力銀行主網/首頁/黃金大版位(圖)",
        status: true,
        boardList: [
          {
            id: 413,
            channelId: 162,
            channelName: "Akay測試頻道22",
            siteId: 5,
            siteName: "工程測試用網站",
            device: "PC",
            name: "test",
            url: null,
            conditionId: null,
            snapshot: null,
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
            sort: 1
          }
        ],
        createDate: "2022-07-04T06:20:36.000+0000",
        updateDate: "2022-07-04T06:20:36.000+0000"
      }
    ]
  }).as("getProductBoardId");
});

Cypress.Commands.add("$getProductMisSearch", () => {
  cy.fixture("productMis.json").then(data => {
    cy.intercept("GET", "api/component/product/mis/suggest?*", data).as(
      "getProductMisSearch"
    );
  });
});

Cypress.Commands.add("$getSearchSite", () => {
  cy.fixture("site.json").then(data => {
    cy.intercept("GET", "api/component/site?*", data.PC).as("getSearchSite");
  });
});

Cypress.Commands.add("$getSearchChannel", () => {
  cy.fixture("channel.json").then(data => {
    cy.intercept(
      "GET",
      "api/component/site/*/channel?*",
      data.productSearchChannel
    ).as("getSearchChannel");
  });
});

Cypress.Commands.add("$getSearchBoard", () => {
  cy.fixture("board.json").then(data => {
    cy.intercept(
      "GET",
      "api/component/site/*/channel/*/board?*",
      data.productSearchBoard
    ).as("getSearchBoard");
  });
});
