<template>
  <div class="results_view_vm_main">
    <div class="search_bar">
      <SwitchTabs
        @select-tab="changeSelectTab($event)"
        :tabsData="tabData"
        :value="currentTab"
        styleType="secondary"
        class="d-flex align-items-center"
      />
    </div>

    <div class="mt-6 checkbox_block">
      <div>
        <span v-for="(item, index) in checkboxType" :key="index">
          <input
            type="checkbox"
            v-model="item.checked"
            @change="setPromo"
            :id="`item_${index}`"
            :data-type="item.type"
          />
          <label :for="`item_${index}`" class="mr-2">
            <span class="mr-2"></span>{{ item.title }}
          </label>
        </span>
      </div>
      <div>
        <button
          v-if="
            productPromo.audit === 0 ||
              productPromo.audit === 2 ||
              productPromo.audit === 3
          "
          @click="edit"
          class="button_bg_white_smaller"
        >
          編輯
        </button>
      </div>
    </div>

    <Loading v-if="productPromoLoading" size="28" class="date_loading" />
    <div v-else-if="productPromoListData.length > 0" class="mt-5 date_block">
      <span
        v-for="item in productPromoListData"
        @click="getPromoId(item.id, item.audit)"
        :key="item.id"
        :data-audit="item.audit"
        :class="{ focus: item.id === productPromoListId }"
        >{{ moment(item.effectiveDate).format("MM-DD") }}</span
      >
    </div>

    <Loading v-if="productPromo.loading" class="loading" />
    <div v-else-if="productPromo.productPromoEffectList.length > 0">
      <div class="search_block">
        <div class="search">
          <input
            type="text"
            v-model="keyword"
            placeholder="請輸入關鍵字查詢"
            widthType="220"
            class="mr-3"
          />
          <img src="@/assets/icon/icon-search.svg" />
        </div>
        <div class="ml-6 mr-2 effective_date">
          簽核日期：<span>{{ productPromo.approvedDate || "- -" }}</span>
        </div>
        <div class="ml-2 mr-6 effective_date">
          生效日期：<span>{{ productPromo.effectiveDate || "- -" }}</span>
        </div>
        <div>
          <a
            :href="
              `${apiURL}api/component/product/promo/${productPromo.id}/download`
            "
            class="download"
            target="_blank"
            ><img src="@/assets/icon/icon-download.svg" class="mr-1" />
            下載檔案</a
          >
        </div>
      </div>
      <ReservePriceTableHana
        :promoListData="productPromo"
        :year="year"
        :keyword="keyword"
      />
    </div>
    <div v-else class="no_list_data">
      無列表資料
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect.js";
import moment from "moment";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import ReservePriceTableHana from "@/components/reservePrice/ReservePriceTableHana.vue";
import Loading from "@/components/Loading.vue";

const props = defineProps({ year: [String, Date], setShowBlock: Function });
const productPromoEffectStore = useProductPromoEffectStore();
const {
  getProductPromo,
  changeQuarter,
  getProductPromoId,
  resettingProductPromoEffectList,
  changeProductPromoListId,
  setEditProductPromoId,
  changeAudit
} = productPromoEffectStore;
const productPromo = computed(() => productPromoEffectStore.productPromo);
const productPromoListData = computed(
  () => productPromoEffectStore.productPromoListData
);
const searchYear = computed(() =>
  props.year.length === 4 ? props.year : props.year.getFullYear()
);
const currentTab = computed(() => productPromoEffectStore.quarter);
const productPromoListId = computed(
  () => productPromoEffectStore.productPromoListId
);
const productPromoLoading = computed(
  () => productPromoEffectStore.productPromoLoading
);
const auditList = ref([4, 5]);
const keyword = ref(null);
const checkboxType = ref([
  { title: "生效", checked: true, value: 5, type: "TAKE_EFFECT" },
  { title: "儲存", checked: false, value: 0, type: "SAVE" },
  { title: "送簽中", checked: false, value: 1, type: "SIGN" },
  { title: "駁回", checked: false, value: 2, type: "REJECT" },
  { title: "抽單", checked: false, value: 3, type: "RETRIEVE" },
  { title: "作廢", checked: false, value: 6, type: "DISCARD" }
]);
const apiURL = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
const tabData = [
  { key: 1, label: "Q1" },
  { key: 2, label: "Q2" },
  { key: 3, label: "Q3" },
  { key: 4, label: "Q4" }
];

const getPromoList = async () => {
  const query = {
    year: searchYear.value,
    quarter: currentTab.value,
    auditList: auditList.value
  };
  try {
    await getProductPromo(query);
  } catch (error) {
    console.log(error);
  }
};

// 切換 tab
const changeSelectTab = async tab => {
  await changeQuarter(tab.key);
  checkboxType.value.forEach((item, index) =>
    index === 0 ? (item.checked = true) : (item.checked = false)
  );
  auditList.value = [4, 5];
  resettingProductPromoEffectList();
  await getPromoList();
  if (productPromoListData.value.length > 0) {
    await getProductPromoId({ id: productPromoListData.value[0].id });
    changeProductPromoListId(productPromoListData.value[0].id);
  }
};

// 過濾
const setPromo = async event => {
  auditList.value = [];
  changeProductPromoListId(null);
  checkboxType.value.forEach(item => {
    if (item.checked) {
      auditList.value.push(item.value);
      if (item.value === 5) auditList.value.push(4);
    }
  });
  await resettingProductPromoEffectList();
  if (auditList.value.every(item => item.checked === true)) {
    event.target.checked = true;
    return;
  }
  await getPromoList();
};

// 取得底價促案
const getPromoId = (id, auditId) => {
  changeProductPromoListId(id);
  changeAudit(auditId);
  getProductPromoId({ id });
};

// 編輯
const edit = async () => {
  await setEditProductPromoId(productPromoEffectStore.productPromoListId);
  props.setShowBlock("ReservePriceSetting", false);
};
</script>

<style lang="scss" scoped>
.results_view_vm_main {
  background-color: #fff;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  padding: 24px;
}

.search_bar {
  position: relative;
}

.no_list_data {
  text-align: center;
  margin: 100px 0;
  font-size: 16px;
  color: #ea475b;
}

.date_loading {
  margin: 16px;
}

.loading {
  margin: 88px 0;
}

.checkbox_block {
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    &:nth-child(1) {
      span {
        label {
          font-size: 16px;
          font-weight: bold;
          line-height: 1.38;
          letter-spacing: 1.38px;
        }
        &:nth-child(1) {
          label {
            color: #609af3;
          }
        }
        &:nth-child(2) {
          label {
            color: #50c0c5;
          }
        }
        &:nth-child(3) {
          label {
            color: #9bdc67;
          }
        }
        &:nth-child(4) {
          label {
            color: #fb827e;
          }
        }
        &:nth-child(5) {
          label {
            color: #ffa468;
          }
        }
        &:nth-child(6) {
          label {
            color: #798596;
          }
        }
      }
    }
  }
}

.date_block {
  span {
    cursor: pointer;
    margin-right: 12px;
    padding: 2px 8px;
    border-radius: 12px;

    &:last-child {
      margin-right: 0;
    }

    &[data-audit="0"] {
      color: #50c0c5;
      border: 1px solid #50c0c5;

      &:hover {
        border: 1px solid #e6f9fa;
        background-color: #e6f9fa;
      }
      &.focus {
        color: #fff;
        background-color: #39c8d0;
      }
    }
    &[data-audit="1"] {
      color: #9bdc67;
      border: 1px solid #9bdc67;

      &:hover {
        border: 1px solid #def3cd;
        background-color: #def3cd;
      }
      &.focus {
        color: #fff;
        background-color: #9bdc67;
      }
    }
    &[data-audit="2"] {
      color: #fb827e;
      border: 1px solid #fb827e;

      &:hover {
        border: 1px solid #ffd5d4;
        background-color: #ffd5d4;
      }
      &.focus {
        color: #fff;
        background-color: #fb827e;
      }
    }
    &[data-audit="3"] {
      color: #ffa468;
      border: 1px solid #ffa468;

      &:hover {
        border: 1px solid #ffe5d4;
        background-color: #ffe5d4;
      }
      &.focus {
        color: #fff;
        background-color: #ffa468;
      }
    }
    &[data-audit="4"],
    &[data-audit="5"] {
      color: #609af3;
      border: 1px solid #609af3;

      &:hover {
        border: 1px solid #d2e4ff;
        background-color: #d2e4ff;
      }
      &.focus {
        background-color: #609af3;
        color: #fff;
      }
    }
    &[data-audit="6"] {
      color: #798596;
      border: 1px solid #798596;

      &:hover {
        border: 1px solid #d3dfef;
        background-color: #d3dfef;
      }
      &.focus {
        color: #fff;
        background-color: #798596;
      }
    }
  }
}

.search_block {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  line-height: 2;
  letter-spacing: 0.89px;
  margin-top: 24px;

  .search {
    display: flex;
    align-items: center;
    img {
      cursor: pointer;
    }
  }

  .effective_date {
    span {
      color: #00afb8;
    }
  }

  .download {
    color: #0e66c7;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}
</style>
