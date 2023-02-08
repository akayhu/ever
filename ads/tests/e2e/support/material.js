// 新增素材
Cypress.Commands.add("$postMaterial", () => {
  cy.intercept("POST", `/api/material`, {});
});

// 刪除素材
Cypress.Commands.add("$deleteMaterial", () => {
  cy.intercept("DELETE", `/api/material/*/reservation/*`, {});
});

// 取得單一素材
Cypress.Commands.add("$getSingleMaterial", () => {
  cy.intercept(`/material/*`, {});
});

// 修改素材
Cypress.Commands.add("$putMaterial", () => {
  cy.intercept(`/api/material/*`, {});
});

// 取得正式素材列表
Cypress.Commands.add("$getMaterialFinalReservation", () => {
  cy.intercept(`/api/material/final/reservation/*`, { response: [] });
});

// 取得圖片上傳路徑
Cypress.Commands.add("$getMaterialPresignedurl", () => {
  cy.intercept(`/api/material/presignedurl?*`, {});
});

// 取得素材
Cypress.Commands.add("$getMaterialReservation", () => {
  cy.intercept(`/api/material/reservation/*?*`, {
    response: {
      page: 1,
      limit: 1,
      total: 1,
      totalPage: 1,
      materialResponse: [
        {
          id: 4388,
          contents: [
            {
              materialId: 4388,
              typeGroupNo: 1,
              sort: 1,
              innerText: "",
              fileName: "",
              link: "",
              type: "IMAGE"
            },
            {
              materialId: 4388,
              typeGroupNo: 1,
              sort: 2,
              innerText: "台新新鮮人台新新鮮人台新新鮮人",
              fileName: "",
              link: "",
              type: "TEXT"
            },
            {
              materialId: 4388,
              typeGroupNo: 1,
              sort: 3,
              innerText: "不方便提供不方便提供不方便提供",
              fileName: "",
              link: "",
              type: "TEXT"
            },
            {
              materialId: 4388,
              typeGroupNo: 1,
              sort: 4,
              innerText: "不告訴你不告訴你不告訴你不告訴你不告訴",
              fileName: "",
              link: "",
              type: "TEXT"
            },
            {
              materialId: 4388,
              typeGroupNo: 1,
              sort: 5,
              innerText: "不告訴你不告訴你不告訴你不告訴你不告訴你",
              fileName: "",
              link: "",
              type: "TEXT"
            }
          ],
          status: 1,
          edible: true,
          deletable: false,
          title: "台新新鮮人",
          updateBy: "1244",
          updateDate: "2022/06/15 11:17:30"
        }
      ]
    }
  });
});

// 上傳壓縮檔
Cypress.Commands.add("$postMaterialUploadZip", () => {
  cy.intercept("POST", `/api/material/upload/zip/*`, {});
});

// 取得可複製素材選項
Cypress.Commands.add("$getMaterialReservationGrouping", () => {
  cy.intercept(`/api/material/reservation-grouping?*`, {
    response: [
      {
        reservationId: 8591,
        startDate: "20211125",
        endDate: "20211128",
        current: false,
        materials: [{ id: 2796, title: "素材001" }]
      },
      {
        reservationId: 12211,
        startDate: "20220524",
        endDate: "20220529",
        current: false,
        materials: [{ id: 4079, title: "素材001" }]
      },
      {
        reservationId: 12218,
        startDate: "20220530",
        endDate: "20220605",
        current: false,
        materials: [{ id: 4076, title: "素材001" }]
      }
    ]
  });
});

// 複製素材
Cypress.Commands.add("$postMaterialDuplicate", () => {
  cy.intercept("POST", `/api/material/duplicate*`, {});
});
