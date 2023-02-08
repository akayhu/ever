// 使用者身份 Module
const userIdentityModule = {
  1: {
    aid: 1, // 使用者身份 id
    authorityName: "PM_Surper", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: true, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: true, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: false, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: true, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: true, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: true, // 專案及版位維護顯示
    pjmanageEdit: true, // 專案及版位維護是否可編輯
    pjmanageEdit_2: false, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: true, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: true, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: false, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: true, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: true, // 緊急上下架顯示
    emergencyViewEdit: true, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: true, // 墊檔廣告維護顯示
    cushionEdit: true, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: false, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: true, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  },
  11: {
    aid: 11, // 使用者身份 id
    authorityName: "整召_業務", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: false, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: true, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: true, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: false, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: false, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: true, // 專案及版位維護顯示
    pjmanageEdit: true, // 專案及版位維護是否可編輯
    pjmanageEdit_2: true, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: false, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: false, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: true, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: false, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: false, // 緊急上下架顯示
    emergencyViewEdit: false, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: false, // 墊檔廣告維護顯示
    cushionEdit: false, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: true, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: false, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  },
  12: {
    aid: 12, // 使用者身份 id
    authorityName: "整召_企劃", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: false, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: false, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: false, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: false, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: false, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: false, // 專案及版位維護顯示
    pjmanageEdit: false, // 專案及版位維護是否可編輯
    pjmanageEdit_2: false, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: false, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: false, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: false, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: true, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: false, // 緊急上下架顯示
    emergencyViewEdit: false, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: false, // 墊檔廣告維護顯示
    cushionEdit: false, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: false, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: true, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  },
  13: {
    aid: 13, // 使用者身份 id
    authorityName: "整召_營運", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: true, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: true, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: false, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: true, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: true, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: true, // 專案及版位維護顯示
    pjmanageEdit: true, // 專案及版位維護是否可編輯
    pjmanageEdit_2: false, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: true, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: true, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: false, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: true, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: true, // 緊急上下架顯示
    emergencyViewEdit: true, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: false, // 墊檔廣告維護顯示
    cushionEdit: false, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: false, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: true, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  },
  14: {
    aid: 14, // 使用者身份 id
    authorityName: "整召_主管", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: false, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: true, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: false, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: true, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: false, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: true, // 專案及版位維護顯示
    pjmanageEdit: true, // 專案及版位維護是否可編輯
    pjmanageEdit_2: false, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: true, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: false, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: false, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: true, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: true, // 緊急上下架顯示
    emergencyViewEdit: true, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: false, // 墊檔廣告維護顯示
    cushionEdit: false, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: false, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: true, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  },
  21: {
    aid: 21, // 使用者身份 id
    authorityName: "JB_VM", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: false, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: true, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: true, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: false, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: false, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: true, // 專案及版位維護顯示
    pjmanageEdit: true, // 專案及版位維護是否可編輯
    pjmanageEdit_2: true, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: false, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: false, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: false, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: true, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: true, // 緊急上下架顯示
    emergencyViewEdit: true, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: true, // 墊檔廣告維護顯示
    cushionEdit: true, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: true, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: false, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  },
  22: {
    aid: 22, // 使用者身份 id
    authorityName: "JB_主管", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: false, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: true, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: false, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: true, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: true, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: true, // 專案及版位維護顯示
    pjmanageEdit: true, // 專案及版位維護是否可編輯
    pjmanageEdit_2: false, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: true, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: true, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: false, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: true, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: false, // 緊急上下架顯示
    emergencyViewEdit: false, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: true, // 墊檔廣告維護顯示
    cushionEdit: true, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: true, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: false, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  },
  23: {
    aid: 23, // 使用者身份 id
    authorityName: "JB_PM", // 使用者身份
    // 檔期預約管理
    calendarView: true, // 檔期行事曆是否顯示
    calendarView_4: false, // 檔期行事曆顯示 *4：特定權限
    calendarEdit: true, // 檔期行事曆顯示是否可編輯
    calendarEdit_2: false, // 檔期行事曆編輯 *2：只能自己的
    calendarEdit_3: true, // 檔期行事曆編輯 *3：自己跟其他人的
    calendarEdit_4: false, // 檔期行事曆編輯 *4：特定權限
    pjmanageView: true, // 專案及版位維護顯示
    pjmanageEdit: true, // 專案及版位維護是否可編輯
    pjmanageEdit_2: false, // 專案及版位維護編輯 *2：只能自己的
    pjmanageEdit_3: true, // 專案及版位維護編輯 *3：自己跟其他人的
    pjmanageEdit_4: false, // 專案及版位維護編輯 *4：特定權限
    // 廣告上刊管理
    audiences: false, // 設定曝光對象 P1.5 才有
    materialView: true, // 上傳素材是否顯示
    materialEdit: true, // 上傳素材是否可編輯
    materialEdit_2: false, // 上傳素材編輯 *2：只能自己的
    materialEdit_3: true, // 上傳素材編輯 *3：自己跟其他人的
    emergencyView: true, // 緊急上下架顯示
    emergencyViewEdit: true, // 緊急上下架編輯
    proofsView: true, // 預覽廣告樣張顯示
    cushionView: true, // 墊檔廣告維護顯示
    cushionEdit: true, // 墊檔廣告維護編輯
    // 報表查詢
    maintainView: true, // 企業資料維護顯示
    maintainEdit: true, // 企業資料維護編輯
    maintainEdit_2: true, // 企業資料維護編輯 *2：只能自己的
    maintainEdit_3: false, // 企業資料維護編輯 *3：自己跟其他人的
    reportView: true, // 企業結案報告顯示
    leaderboardView: true, // 成效排行榜顯示
    compareView: true // BO
  }
};

export default userIdentityModule;
