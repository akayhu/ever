import * as staticreviewData from "@/utils/reviewData";
import { PLANT_ID_MAP, TYPEID_DISPLAY_NAME_MAP } from "@/utils/enum.js";
import moment from "moment";

export const commonMixins = {
  methods: {
    // 取匿名
    getAnonymousName(plantId, typeId) {
      const plantName = PLANT_ID_MAP[plantId] || PLANT_ID_MAP[1];
      // 投票
      if (!typeId) return `匿名${plantName}`;
      // 評論
      const reviewTypeName = TYPEID_DISPLAY_NAME_MAP[typeId];
      return `${plantName}${reviewTypeName}`;
    },
    // 取匿名圖
    getAnonymousImgUrl(anonymous) {
      return require(`@/assets/plant_${anonymous}.png`);
    },
    getAnonymousPlantsData() {
      return staticreviewData.plantList();
    },
    getCompanyLists() {
      return staticreviewData.resumeCompanyLists();
    },
    baseRatingOptions() {
      return staticreviewData.baseRatingOptions();
    },
    moreRatingOptions() {
      return staticreviewData.moreRatingOptions();
    },
    getWageOptions() {
      return staticreviewData.getAllwageTypes();
    },
    monthWageNumber(wageType) {
      return staticreviewData.monthWageNumber(wageType);
    },
    yearWageNumber() {
      return staticreviewData.yearWageNumber();
    },
    //導至編輯履歷
    goToMy104() {
      window.open(
        `https:${process.env.VUE_APP_PDA_URL}my104/resume/manage/index`
      );
    },
    // 導頁
    jump(path) {
      this.$router.push({ path: path }).catch(err => {});
    },
    // focus框線
    focusStyle(event) {
      const parentNodeStyle = event.target.parentNode.style;
      parentNodeStyle.border = "1px solid #ff7800";
      parentNodeStyle.boxShadow = "0px 0px 0.5px 0.5px #ff7800";
    },
    // blur框線
    blurStyle(event) {
      const parentNodeStyle = event.target.parentNode.style;
      parentNodeStyle.border = "1px solid #eee";
      parentNodeStyle.boxShadow = "";
    },
    // 計算今天與發起評論/投票日期毫秒數的相差
    timeAgo(created_date) {
      const toDay = new Date().getTime();
      const createdDate = Number(created_date) * 1000;
      const timeAgo = toDay - createdDate;
      return timeAgo;
    },
    // 時間顯示年月日
    timeDate(created_date) {
      const createdDate = Number(created_date) * 1000;
      const date = moment(createdDate).format("YYYY/MM/DD HH:mm");
      return date;
    },
    // JSON-LD 時間顯示年月日
    jsonLdTimeDate(created_date) {
      const createdDate = Number(created_date) * 1000;
      const date = moment(createdDate).format("YYYY-MM-DD");
      return date;
    },
    // 對 custno 做 encode
    encodeCustno(custno) {
      const custnoEncode = Number(`${custno}.`).toString(36);
      return custno ? custnoEncode : custno;
    },
    // 對 custno 做 decode
    decodeCustno(custno) {
      const custnoDecode = parseInt(custno, 36);
      return custno ? custnoDecode : custno;
    }
  }
};
