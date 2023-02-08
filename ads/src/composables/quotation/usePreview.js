import { computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { round } from "@/utils/quotation";

export const paymentTermsType = {
  1: "月結30天",
  2: "月結45天",
  3: "月結60天",
  4: "月結90天",
  5: "月結120天",
  6: "預收款"
};

export const otherProductUnit = {
  "人力銀行主網/新聞快訊/橫幅": "則",
  雇主品牌模組: "天",
  觀察企業: "天",
  人才市場模組_內部使用: "天",
  人才市場模組_新: "月",
  品牌宣傳頁: "天",
  專案型: "則",
  政府計畫公司頁: "天",
  資料庫人才開發: "天",
  人力銀行商廣EDM_02: "封",
  "展示型廣告(已上刊)": "天"
};

export const usePreview = () => {
  const salesOrderStore = useSalesOrderStore();
  const projectGroups = computed(() =>
    salesOrderStore.quotationData.projectList.map(project => {
      return {
        id: project.id,
        name: project.name,
        bannerPrice: project.quotationAdList
          .filter(p => p.type === 1)
          .reduce((prev, curr) => prev + curr.price, 0), // 優惠價未稅
        bannerContent: project.quotationAdList
          .filter(p => p.type === 1 && p.product.boardList.length > 0)
          .map((productInfo, index) => {
            return {
              index: index + 1,
              device: productInfo.product.boardList[0].device,
              channel: productInfo.product.boardList[0].channelName,
              name: productInfo.product.name.split("/").pop(),
              rotate: productInfo.product.rotate,
              impression: productInfo.product.impression,
              click: productInfo.product.click,
              ratio: productInfo.product.impression
                ? round(
                    (productInfo.product.click /
                      productInfo.product.impression) *
                      100,
                    2
                  )
                : "- -",
              unitPrice: productInfo.unitPrice,
              quantity: productInfo.quantity,
              unit: productInfo.unit === "WEEK" ? "週" : "天",
              price: productInfo.marketPrice * productInfo.quantity
            };
          }),
        haveProject:
          project.quotationAdList.filter(p => p.type === 2).length > 0,
        otherContent: project.quotationAdList
          .filter(p => p.type === 2)
          .map((product, index) => {
            return {
              index: index + 1,
              name: product.externalName,
              content: product.note,
              unitPrice: product.unitPrice,
              quantity: product.quantity,
              unit: otherProductUnit[product.productName],
              price: product.marketPrice * product.quantity,
              discountPrice: product.price
            };
          })
      };
    })
  );
  const totalMarketPrice = computed(() =>
    salesOrderStore.quotationData.projectList.reduce(
      (prev, curr) =>
        prev +
        curr.quotationAdList.reduce(
          (productPrev, productCurr) =>
            productPrev +
            round(productCurr.marketPrice * productCurr.quantity * 1.05, 0),
          0
        ),
      0
    )
  );
  const totalPrice = computed(() =>
    salesOrderStore.quotationData.projectList.reduce(
      (prev, curr) =>
        prev +
        curr.quotationAdList.reduce(
          (productPrev, productCurr) =>
            productPrev + round(productCurr.price * 1.05, 0),
          0
        ),
      0
    )
  );

  return {
    projectGroups,
    totalMarketPrice,
    totalPrice
  };
};
