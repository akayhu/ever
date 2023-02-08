import { setActivePinia, createPinia } from "pinia";
import { useBoardStore } from "@/storesPinia/board.js";
import {
  apiPostBoard,
  apiPatchBoard,
  apiGetBoard,
  apiGetBoardId,
  apiDeleteBoardId,
  apiGetBoardSuggest,
  apiGetAllBoard,
  apiPatchBoardSort
} from "@/apis/board";

jest.mock("@/apis/board", () => ({
  apiPostBoard: jest.fn(),
  apiPatchBoard: jest.fn(),
  apiGetBoard: jest.fn(),
  apiGetBoardId: jest.fn(),
  apiDeleteBoardId: jest.fn(),
  apiGetBoardSuggest: jest.fn(),
  apiGetAllBoard: jest.fn(),
  apiPatchBoardSort: jest.fn()
}));

describe("測試 Board Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 getBoard action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { getBoard } = boardStore;
    const query = {
      channelId: 4,
      siteId: 1
    };
    const mockData = [
      {
        id: 9,
        channelId: 4,
        channelName: "首頁",
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "頂呱呱",
        url: null,
        conditionId: 0,
        snapshot: false,
        typeId: 16,
        style: "",
        responseTypeTemplateDetail: null,
        reserve: 1,
        lowerLimit: 0,
        upperLimit: 1,
        promotion: true,
        status: true,
        associateWithProduct: null,
        canDelete: null,
        sort: 9980101
      }
    ];
    apiGetBoard.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getBoard(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getBoard action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { postBoard } = boardStore;
    const query = {
      channelId: 4,
      siteId: 1,
      requestBoard: {
        channelId: 0,
        conditionId: 0,
        id: 0,
        lowerLimit: 0,
        name: "string",
        promotion: true,
        requestTypeTemplateDetail: {
          groupList: [
            {
              elementList: [
                {
                  elementType: "string",
                  fileLimit: 0,
                  height: 0,
                  linkable: 0,
                  placeholder: "string",
                  textLimit: 0,
                  title: "string",
                  width: 0
                }
              ],
              name: "string"
            }
          ],
          memo: "string"
        },
        reserve: 0,
        snapshot: true,
        status: true,
        style: "string",
        typeId: 0,
        upperLimit: 0,
        url: "string"
      }
    };
    const mockData = {
      associateWithProduct: true,
      canDelete: true,
      channelId: 0,
      channelName: "string",
      conditionId: 0,
      device: "PC",
      id: 0,
      lowerLimit: 0,
      name: "string",
      promotion: true,
      reserve: 0,
      responseTypeTemplateDetail: {
        boardId: 0,
        groupList: [
          {
            elementList: [{}],
            groupNo: 0,
            name: "string"
          }
        ],
        memo: "string",
        typeId: 0
      },
      siteId: 0,
      siteName: "string",
      snapshot: true,
      sort: 0,
      status: true,
      style: "string",
      typeId: 0,
      upperLimit: 0,
      url: "string"
    };
    apiPostBoard.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await postBoard(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getBoardId action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { getBoardId } = boardStore;
    const query = {
      boardId: 9,
      channelId: 4,
      siteId: 1
    };
    const mockData = {
      id: 9,
      channelId: 4,
      channelName: "首頁",
      siteId: 1,
      siteName: "人力銀行C主網",
      device: "PC",
      name: "頂呱呱",
      url: null,
      conditionId: 0,
      snapshot: false,
      typeId: 16,
      style: "",
      responseTypeTemplateDetail: {
        typeId: 16,
        boardId: 9,
        memo: "1. 展開縮合廣告的寬度需一致，以免曝光時跑版\r\n2. 展開/關閉廣告為白字，上傳素材時區塊的底色建議較深，以免看不清楚展開/關閉廣告的白字\r\n3. 需同時上傳大小兩個檔案，以及預設圖(較低階的瀏覽器僅呈現預設圖檔)\r\n4. 廣告播放限定秒數內即會自動縮合，素材製作請務必於秒數內播畢",
        groupList: [
          {
            groupNo: 1,
            name: "預覽一(收合/預設)",
            elementList: [
              {
                elementType: "image",
                title: "預設小圖",
                width: 1024,
                height: 60,
                fileLimit: 200,
                linkable: 1
              },
              {
                elementType: "file",
                title: "收合小圖html",
                width: 1024,
                height: 60,
                fileLimit: 200,
                linkable: 0
              }
            ]
          },
          {
            groupNo: 2,
            name: "預覽二(展開)",
            elementList: [
              {
                elementType: "file",
                title: "展開大圖html",
                width: 1024,
                height: 200,
                fileLimit: 250,
                linkable: 0
              }
            ]
          }
        ]
      },
      reserve: 1,
      lowerLimit: 0,
      upperLimit: 1,
      promotion: true,
      status: true,
      associateWithProduct: true,
      canDelete: false,
      sort: 9980101
    };
    apiGetBoardId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getBoardId(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 patchBoard action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { patchBoard } = boardStore;
    const query = {
      channelId: 4,
      siteId: 1,
      requestBoard: {
        channelId: 0,
        conditionId: 0,
        id: 0,
        lowerLimit: 0,
        name: "string",
        promotion: true,
        requestTypeTemplateDetail: {
          groupList: [
            {
              elementList: [
                {
                  elementType: "string",
                  fileLimit: 0,
                  height: 0,
                  linkable: 0,
                  placeholder: "string",
                  textLimit: 0,
                  title: "string",
                  width: 0
                }
              ],
              name: "string"
            }
          ],
          memo: "string"
        },
        reserve: 0,
        snapshot: true,
        status: true,
        style: "string",
        typeId: 0,
        upperLimit: 0,
        url: "string"
      }
    };
    const mockData = {
      associateWithProduct: true,
      canDelete: true,
      channelId: 0,
      channelName: "string",
      conditionId: 0,
      device: "PC",
      id: 0,
      lowerLimit: 0,
      name: "string",
      promotion: true,
      reserve: 0,
      responseTypeTemplateDetail: {
        boardId: 0,
        groupList: [
          {
            elementList: [{}],
            groupNo: 0,
            name: "string"
          }
        ],
        memo: "string",
        typeId: 0
      },
      siteId: 0,
      siteName: "string",
      snapshot: true,
      sort: 0,
      status: true,
      style: "string",
      typeId: 0,
      upperLimit: 0,
      url: "string"
    };
    apiPatchBoard.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await patchBoard(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 deleteBoardId action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { deleteBoardId } = boardStore;
    const query = {
      siteId: 1,
      channelId: 4,
      boardId: 9
    };
    const mockData = true;
    apiDeleteBoardId.mockResolvedValue(mockData);
    const result = await deleteBoardId(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getBoardMenu action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { getBoardMenu } = boardStore;
    const query = {
      channelId: 4,
      siteId: 1
    };
    const mockData = [
      {
        id: 9,
        channelId: 4,
        channelName: "首頁",
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "頂呱呱",
        url: null,
        conditionId: 0,
        snapshot: false,
        typeId: 16,
        style: "",
        responseTypeTemplateDetail: null,
        reserve: 1,
        lowerLimit: 0,
        upperLimit: 1,
        promotion: true,
        status: true,
        associateWithProduct: null,
        canDelete: null,
        sort: 9980101
      }
    ];
    apiGetBoard.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getBoardMenu(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getBoardSuggest action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { getBoardSuggest } = boardStore;
    const query = {
      channelId: 4,
      siteId: 1,
      keyword: "黃金"
    };
    const mockData = [
      {
        id: 10,
        channelId: 4,
        channelName: "首頁",
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "黃金大版位",
        url: null,
        conditionId: 0,
        snapshot: true,
        typeId: 1,
        style: "",
        responseTypeTemplateDetail: null,
        reserve: 2,
        lowerLimit: 1,
        upperLimit: 2,
        promotion: false,
        status: true,
        associateWithProduct: null,
        canDelete: null,
        sort: 9010101
      }
    ];
    apiGetBoardSuggest.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getBoardSuggest(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getAllBoard action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { getAllBoard } = boardStore;
    const mockData = [
      {
        id: 212,
        channelId: 55,
        channelName: "首頁(test)",
        siteId: 6,
        siteName: "VM測試",
        device: "PC",
        name: "測25",
        url: null,
        conditionId: 0,
        snapshot: true,
        typeId: 2,
        style: "",
        responseTypeTemplateDetail: null,
        reserve: 1,
        lowerLimit: 1,
        upperLimit: 1,
        promotion: false,
        status: true,
        associateWithProduct: null,
        canDelete: null,
        sort: 0
      }
    ];
    apiGetAllBoard.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getAllBoard();
    expect(result).toStrictEqual(mockData);
  });

  it("測試 patchBoardSort action 成功後回傳", async () => {
    const boardStore = useBoardStore();
    const { patchBoardSort } = boardStore;
    const query = {
      requestBoardSort: {
        id: 0,
        sort: 0
      }
    };
    const mockData = {
      associateWithProduct: true,
      canDelete: true,
      channelId: 0,
      channelName: "string",
      conditionId: 0,
      device: "PC",
      id: 0,
      lowerLimit: 0,
      name: "string",
      promotion: true,
      reserve: 0,
      responseTypeTemplateDetail: {
        boardId: 0,
        groupList: [
          {
            elementList: [{}],
            groupNo: 0,
            name: "string"
          }
        ],
        memo: "string",
        typeId: 0
      },
      siteId: 0,
      siteName: "string",
      snapshot: true,
      sort: 0,
      status: true,
      style: "string",
      typeId: 0,
      upperLimit: 0,
      url: "string"
    };
    apiPatchBoardSort.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await patchBoardSort(query);
    expect(result).toStrictEqual(mockData);
  });
});
