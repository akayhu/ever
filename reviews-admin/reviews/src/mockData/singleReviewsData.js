/*
	單項分數 : ( 單項分數 * 評價數 + ( 新分數總合 ) ) / ( 評價數 + 新增評價數 )
	整體評價 : 各評價分數加總 / 5
*/
export const singleReviews = {
  advantage: "想吃零食有零食櫃...", // 優點
  auditMemo: "客服評估無爭議", // 審核備註
  auditState: 6, // 評論審核狀態 ( 0:刪除, 1:待審核, 2:不需處理, 3:審核未過, 4:檢舉下架, 5:檢舉待審, 6:審核通過, 7:檢舉重新上架 )
  company: "84598349000公司", // 公司
  createDate: "1571712747", // 建立時間
  custno: "84598349000", // 公司編號
  disadvantage: "零食櫃裡都沒零食...", // 缺點
  id: 14, // 流水號
  isRecommend: 1, // 是否推薦此公司
  isVerify: 0, // 公司認証 ( 0:沒認證, 1:認証 )
  jobName: "吃貨", // 職務名稱
  jobNameIsPublic: 1, // 職務名稱是否公開
  pid: 104150, // pid
  plantId: 1, // 植物編號
  reviewItems: [
    // 評價類別 ( 僅單筆評論有此屬性, 多筆評論無此屬性 )
    {
      reviewItem: "薪資福利",
      score: 5
    },
    {
      reviewItem: "公司前景",
      score: 5
    }
  ],
  scoreOverall: 5, // 整體評價
  seniorityMonth: 1, // 年資(月)
  seniorityYear: 0, // 年資(年)
  wage: 22000, // 時薪 ( 0 ~ 9,999 ) 月薪 ( 0 ~ 309,000 ) 年薪 ( 1:100萬以下, 2:100~125萬, 3:150~200萬, 4:200~250萬, 5:250~300萬, 6:300萬以上 )
  wageIsPublic: 1, // 薪資是否公開
  wageType: "month" // 薪資型態 ( hour:時薪, month:月薪, year:年薪 )
};

export default singleReviews;
