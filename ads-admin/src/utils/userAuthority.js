// 使用者身份 Module
const userIdentityModule = {
  1: {
    aid: 1, // 使用者身份 id
    authorityName: "系統管理者", // 使用者身份
    userInfoView: true, // 使用者資料維護顯示
    userInfoEdit: true, // 使用者資料維護編輯
    userLogView: true, // 使用者行為紀錄顯示
    webSiteView: true, // 網站管理(含APP)顯示
    webSiteEdit: true, // 網站管理(含APP)編輯
    webChannelView: true, // 頻道管理顯示
    webChannelEdit: true, // 頻道管理編輯
    webBoardView: true, // 版位管理顯示
    webBoardEdit: true, // 版位管理編輯
    productView: true, // 商品與版位關聯管理顯示
    productEdit: true, // 商品與版位關聯管理編輯
    AdTypeManagementView: true, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: true, // 廣告型態管理編輯 P1.5 才有
    padAdLink: true, // 墊檔廣告上傳連結,
    setConditionsView: true, // 條件設定列表
    setConditionsEdit: true, // 條件設定編輯
    tools: true // 小工具
  },
  11: {
    aid: 11, // 使用者身份 id
    authorityName: "整召業務銷售人員", // 使用者身份
    userInfoView: false, // 使用者資料維護顯示
    userInfoEdit: false, // 使用者資料維護編輯
    userLogView: false, // 使用者行為紀錄顯示
    webSiteView: false, // 網站管理(含APP)顯示
    webSiteEdit: false, // 網站管理(含APP)編輯
    webChannelView: false, // 頻道管理顯示
    webChannelEdit: false, // 頻道管理編輯
    webBoardView: false, // 版位管理顯示
    webBoardEdit: false, // 版位管理編輯
    productView: false, // 商品與版位關聯管理顯示
    productEdit: false, // 商品與版位關聯管理編輯
    AdTypeManagementView: false, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: false, // 廣告型態管理編輯 P1.5 才有
    padAdLink: false, // 墊檔廣告上傳連結
    setConditionsView: false, // 條件設定列表
    setConditionsEdit: false, // 條件設定編輯
    tools: false // 小工具
  },
  12: {
    aid: 12, // 使用者身份 id
    authorityName: "整召營運企劃", // 使用者身份
    userInfoView: false, // 使用者資料維護顯示
    userInfoEdit: false, // 使用者資料維護編輯
    userLogView: false, // 使用者行為紀錄顯示
    webSiteView: false, // 網站管理(含APP)顯示
    webSiteEdit: false, // 網站管理(含APP)編輯
    webChannelView: false, // 頻道管理顯示
    webChannelEdit: false, // 頻道管理編輯
    webBoardView: false, // 版位管理顯示
    webBoardEdit: false, // 版位管理編輯
    productView: false, // 商品與版位關聯管理顯示
    productEdit: false, // 商品與版位關聯管理編輯
    AdTypeManagementView: false, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: false, // 廣告型態管理編輯 P1.5 才有
    padAdLink: false, // 墊檔廣告上傳連結
    setConditionsView: false, // 條件設定列表
    setConditionsEdit: false, // 條件設定編輯
    tools: false // 小工具
  },
  13: {
    aid: 13, // 使用者身份 id
    authorityName: "整召營運同仁", // 使用者身份
    userInfoView: false, // 使用者資料維護顯示
    userInfoEdit: false, // 使用者資料維護編輯
    userLogView: false, // 使用者行為紀錄顯示
    webSiteView: false, // 網站管理(含APP)顯示
    webSiteEdit: false, // 網站管理(含APP)編輯
    webChannelView: false, // 頻道管理顯示
    webChannelEdit: false, // 頻道管理編輯
    webBoardView: false, // 版位管理顯示
    webBoardEdit: false, // 版位管理編輯
    productView: false, // 商品與版位關聯管理顯示
    productEdit: false, // 商品與版位關聯管理編輯
    AdTypeManagementView: false, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: false, // 廣告型態管理編輯 P1.5 才有
    padAdLink: false, // 墊檔廣告上傳連結
    setConditionsView: false, // 條件設定列表
    setConditionsEdit: false, // 條件設定編輯
    tools: false // 小工具
  },
  14: {
    aid: 14, // 使用者身份 id
    authorityName: "整召主管", // 使用者身份
    userInfoView: false, // 使用者資料維護顯示
    userInfoEdit: false, // 使用者資料維護編輯
    userLogView: false, // 使用者行為紀錄顯示
    webSiteView: false, // 網站管理(含APP)顯示
    webSiteEdit: false, // 網站管理(含APP)編輯
    webChannelView: false, // 頻道管理顯示
    webChannelEdit: false, // 頻道管理編輯
    webBoardView: false, // 版位管理顯示
    webBoardEdit: false, // 版位管理編輯
    productView: false, // 商品與版位關聯管理顯示
    productEdit: false, // 商品與版位關聯管理編輯
    AdTypeManagementView: false, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: false, // 廣告型態管理編輯 P1.5 才有
    padAdLink: false, // 墊檔廣告上傳連結
    setConditionsView: false, // 條件設定列表
    setConditionsEdit: false, // 條件設定編輯
    tools: false // 小工具
  },
  21: {
    aid: 21, // 使用者身份 id
    authorityName: "產品管理VM", // 使用者身份
    userInfoView: false, // 使用者資料維護顯示
    userInfoEdit: false, // 使用者資料維護編輯
    userLogView: false, // 使用者行為紀錄顯示
    webSiteView: true, // 網站管理(含APP)顯示
    webSiteEdit: false, // 網站管理(含APP)編輯
    webChannelView: true, // 頻道管理顯示
    webChannelEdit: false, // 頻道管理編輯
    webBoardView: true, // 版位管理顯示
    webBoardEdit: false, // 版位管理編輯
    productView: true, // 商品與版位關聯管理顯示
    productEdit: true, // 商品與版位關聯管理編輯
    AdTypeManagementView: true, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: true, // 廣告型態管理編輯 P1.5 才有
    padAdLink: true, // 墊檔廣告上傳連結
    setConditionsView: true, // 條件設定列表
    setConditionsEdit: true, // 條件設定編輯
    tools: false // 小工具
  },
  22: {
    aid: 22, // 使用者身份 id
    authorityName: "產品主管", // 使用者身份
    userInfoView: false, // 使用者資料維護顯示
    userInfoEdit: false, // 使用者資料維護編輯
    userLogView: false, // 使用者行為紀錄顯示
    webSiteView: true, // 網站管理(含APP)顯示
    webSiteEdit: false, // 網站管理(含APP)編輯
    webChannelView: true, // 頻道管理顯示
    webChannelEdit: false, // 頻道管理編輯
    webBoardView: true, // 版位管理顯示
    webBoardEdit: false, // 版位管理編輯
    productView: true, // 商品與版位關聯管理顯示
    productEdit: false, // 商品與版位關聯管理編輯
    AdTypeManagementView: true, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: true, // 廣告型態管理編輯 P1.5 才有
    padAdLink: true, // 墊檔廣告上傳連結
    setConditionsView: true, // 條件設定列表
    setConditionsEdit: false, // 條件設定編輯
    tools: false // 小工具
  },
  23: {
    aid: 23, // 使用者身份 id
    authorityName: "產品管理企劃", // 使用者身份
    userInfoView: false, // 使用者資料維護顯示
    userInfoEdit: false, // 使用者資料維護編輯
    userLogView: false, // 使用者行為紀錄顯示
    webSiteView: true, // 網站管理(含APP)顯示
    webSiteEdit: true, // 網站管理(含APP)編輯
    webChannelView: true, // 頻道管理顯示
    webChannelEdit: true, // 頻道管理編輯
    webBoardView: true, // 版位管理顯示
    webBoardEdit: true, // 版位管理編輯
    productView: false, // 商品與版位關聯管理顯示
    productEdit: false, // 商品與版位關聯管理編輯
    AdTypeManagementView: true, // 廣告型態管理顯示 P1.5 才有
    AdTypeManagementEdit: true, // 廣告型態管理編輯 P1.5 才有
    padAdLink: true, // 墊檔廣告上傳連結
    setConditionsView: true, // 條件設定列表
    setConditionsEdit: true, // 條件設定編輯
    tools: false // 小工具
  }
};

export default userIdentityModule;
