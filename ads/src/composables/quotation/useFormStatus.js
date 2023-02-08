import { computed } from "vue";
import { useRoute } from "@/router/useRoute.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";

export const useFormStatus = () => {
  const { route } = useRoute();
  const salesOrderStore = useSalesOrderStore();
  const statusConcat = computed(() =>
    [
      salesOrderStore.quotationData.audit,
      salesOrderStore.quotationData.stage
    ].join("")
  );
  const statusLabel = computed(() => {
    const statusType = {
      "1": "結案",
      "2": "逾期",
      "3": "作廢",
      "4": "退刊"
    };
    return (
      statusType[salesOrderStore.quotationData.status] ||
      getPermissionStatus(statusConcat.value, routeState)
    );
  });
  const isDraftForm = computed(
    () =>
      route.name === "CreatedSalesOrder" || route.name === "CreateInternalOrder"
  );
  const isEditForm = computed(
    () => route.name === "EditSalesOrder" || route.name === "EditInternalOrder"
  );
  const isViewForm = computed(
    () =>
      route.name === "GeneralViewSalesOrder" ||
      route.name === "SignOffViewSalesOrder" ||
      route.name === "ViewInternalOrder"
  );
  const isSignView = computed(
    () =>
      route.name === "SignOffViewSalesOrder" ||
      route.name === "ViewInternalOrder"
  );
  const canEdit = computed(() => {
    if (!salesOrderStore.quotationData.canEdit) return false;
    if (
      salesOrderStore.quotationData.audit === 1 ||
      salesOrderStore.quotationData.audit === 4
    )
      return false;
    if (
      salesOrderStore.quotationData.stage === 2 ||
      salesOrderStore.quotationData.stage === 3
    )
      return false;
    if (
      salesOrderStore.quotationData.status > 0 &&
      salesOrderStore.quotationData.status <= 4
    )
      return false;
    return true;
  });

  const queryStatus = {
    "00": 1, // 草稿
    "01": 1, // 完稿
    "11": 2, // 報價/內服單簽核中
    "02": 3, // 報價/內服單成立
    "12": 4, // 轉訂單簽核中
    "03": 5, // 訂單成立
    "43": 5, // 訂單成立
    "21": 8, // 駁回
    "22": 8, // 駁回
    "31": 8, // 抽單
    "32": 8 // 抽單
  };

  const routeState =
    route?.name === "CreateInternalOrder" ||
    route?.name === "EditInternalOrder" ||
    route?.name === "ViewInternalOrder"
      ? "internal"
      : "sales";

  const name = routeState === "internal" ? "內服單" : "報價";

  const getPermissionStatus = statusConcat => {
    const permissionType = {
      "00": "草稿",
      "01": "完稿",
      "11": `${name}簽核中`,
      "02": `${name}成立`,
      "12": "轉訂單簽核中",
      "03": "訂單成立(未上傳合約)",
      "43": "訂單成立",
      "21": "完稿(駁回)",
      "22": `${name}成立(駁回)`,
      "31": "完稿(抽單)",
      "32": `${name}成立(抽單)`
    };
    return permissionType[statusConcat];
  };

  const queryListStatus = data => {
    const value = [data.audit, data.stage].join("");
    const statusType = {
      "1": 9,
      "3": 6,
      "4": 7
    };
    return statusType[data.status] || queryStatus[value];
  };

  // 可否編輯與顯示文案
  const canEditNew = data => {
    const editType = {
      "000": { edit: true, word: "草稿", cardHeaderView: "orderHeader" },
      "010": { edit: true, word: "完稿", cardHeaderView: "orderHeader" },
      "110": {
        edit: false,
        word: `${name}簽核中`,
        cardHeaderView: "orderHeader"
      },
      "020": {
        edit: false,
        word: `${name}成立`,
        cardHeaderView: "orderHeader"
      },
      "120": {
        edit: false,
        word: "轉訂單簽核中",
        cardHeaderView: "orderHeader"
      },
      "030": {
        edit: false,
        word: "訂單成立(未上傳合約)",
        cardHeaderView: "establishedHeader"
      },
      "430": {
        edit: false,
        word: `${routeState === "internal" ? "內服單" : "訂單"}成立`,
        cardHeaderView: "establishedHeader"
      },
      "031": { edit: false, word: "結案", cardHeaderView: "establishedHeader" },
      "431": { edit: false, word: "結案", cardHeaderView: "establishedHeader" },
      "210": { edit: true, word: "完稿(駁回)", cardHeaderView: "orderHeader" },
      "220": {
        edit: false,
        word: `${name}成立(駁回)`,
        cardHeaderView: "orderHeader"
      },
      "310": { edit: true, word: "完稿(抽單)", cardHeaderView: "orderHeader" },
      "320": {
        edit: false,
        word: `${name}成立(抽單)`,
        cardHeaderView: "orderHeader"
      },
      "013": { edit: false, word: "作廢", cardHeaderView: "orderHeader" },
      "023": { edit: false, word: "作廢", cardHeaderView: "orderHeader" },
      "033": { edit: false, word: "作廢", cardHeaderView: "establishedHeader" },
      "223": { edit: false, word: "作廢", cardHeaderView: "orderHeader" },
      "323": { edit: false, word: "作廢", cardHeaderView: "establishedHeader" },
      "333": { edit: false, word: "作廢", cardHeaderView: "establishedHeader" },
      "313": { edit: false, word: "作廢", cardHeaderView: "establishedHeader" },
      "433": { edit: false, word: "作廢", cardHeaderView: "establishedHeader" },
      "034": { edit: false, word: "退刊", cardHeaderView: "establishedHeader" }
    };
    let value = [data.audit, data.stage, data.status].join("");
    return editType[value];
  };

  return {
    statusLabel,
    isDraftForm,
    isEditForm,
    isViewForm,
    isSignView,
    canEdit,
    canEditNew,
    queryListStatus
  };
};
