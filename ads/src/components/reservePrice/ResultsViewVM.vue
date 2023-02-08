<template>
  <div class="results_view_vm_main">
    <SwitchTabs
      @select-tab="changeSelectTab($event)"
      :tabsData="tabData"
      :value="currentTab"
      styleType="secondary"
      class="d-flex align-items-center"
    />

    <div class="title_block mt-6 mb-6">
      <div>
        <span class="title">版位成效</span>
        <span>
          <img src="@/assets/icon/icon-info-warmgray.svg" class="ml-2 mr-1" />每
          Q 月初15日前更新</span
        >
      </div>
      <div>
        <span>此版本更新日期：</span>
        <span>{{ productEffectUpdateDate }}</span>
      </div>
    </div>

    <div class="table_main">
      <Loading v-if="productEffect.loading" class="loading" />
      <table
        v-else-if="activeEffectList.length > 0"
        cellpadding="0"
        cellspacing="0"
        class="mb-4"
      >
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>產品分級</th>
            <th>網站名稱</th>
            <th>頻道名稱</th>
            <th>版位名稱</th>
            <th>輪播次數</th>
            <th>牌價(未稅)$</th>
            <th>平均曝光數(週)</th>
            <th>總平均Click(週)</th>
            <th>平均CTR</th>
            <th>備注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in activeEffectList" :key="index">
            <td>{{ item.productName }}</td>
            <td>
              <span
                v-tooltip="{
                  placement: 'right',
                  offset: 5,
                  content: item.group,
                  trigger: 'hover'
                }"
                >{{ item.group }}</span
              >
            </td>
            <td>
              <span
                v-tooltip="{
                  placement: 'right',
                  offset: 5,
                  content: item.siteName,
                  trigger: 'hover'
                }"
                >{{ item.siteName }}</span
              >
            </td>
            <td>
              <span
                v-tooltip="{
                  placement: 'right',
                  offset: 5,
                  content: item.channelName,
                  trigger: 'hover'
                }"
                >{{ item.channelName }}</span
              >
            </td>
            <td>
              <span
                v-tooltip="{
                  placement: 'right',
                  offset: 5,
                  content: item.boardName,
                  trigger: 'hover'
                }"
                >{{ item.boardName }}</span
              >
            </td>
            <td>
              <span>{{ item.rotate }}</span>
            </td>
            <td>
              <span>{{ item.marketPrice.toLocaleString() }}</span>
            </td>
            <td>
              <span>{{ item.impression.toLocaleString() }}</span>
            </td>
            <td>
              <span>{{ item.click.toLocaleString() }}</span>
            </td>
            <td>
              <span>{{ item.ctr ? `${item.ctr}%` : "- -" }}</span>
            </td>
            <td>
              <span>{{ item.note }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="no_list_data">
        無列表資料
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import Loading from "@/components/Loading.vue";

const props = defineProps({ year: [String, Date] });
const productPromoEffectStore = useProductPromoEffectStore();
const { getProductEffect, changeQuarter } = productPromoEffectStore;
const { productEffect, productEffectUpdateDate, quarter } = storeToRefs(
  productPromoEffectStore
);
const activeEffectList = computed(() =>
  productEffect.value.content.filter(item => item.status === true)
);
const searchYear = computed(() =>
  props.year.length === 4 ? props.year : props.year.getFullYear()
);
const currentTab = computed(() => quarter.value);
const tabData = [
  { key: 1, label: "Q1" },
  { key: 2, label: "Q2" },
  { key: 3, label: "Q3" },
  { key: 4, label: "Q4" }
];

// 取列表資料
const getEffectList = async () => {
  const getProductEffectQuery = {
    year: searchYear.value,
    quarter: quarter.value
  };
  try {
    await getProductEffect(getProductEffectQuery);
  } catch (error) {
    console.log(error);
  }
};

// 切換Ｑ季
const changeSelectTab = async tab => {
  await changeQuarter(tab.key);
  await getEffectList();
};
</script>

<style lang="scss" scoped>
.results_view_vm_main {
  background-color: #fff;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  padding: 24px;
}

.title_block {
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;

    &:nth-child(1) {
      span {
        &:nth-child(1) {
          font-size: 24px;
          font-weight: bold;
          line-height: 1.33;
          letter-spacing: 1.33px;
          color: #333;
        }
        &:nth-child(2) {
          font-size: 14px;
          line-height: 2.29;
          letter-spacing: 0.78px;
          color: #7e7e7e;

          img {
            vertical-align: text-bottom;
          }
        }
      }
    }
    &:nth-child(2) {
      span {
        font-size: 14px;
        font-weight: bold;
        line-height: 2.29;
        letter-spacing: 0.78px;

        &:nth-child(1) {
          color: #333;
        }
        &:nth-child(2) {
          color: #00afb8;
        }
      }
    }
  }
}

.table_main {
  width: 100%;
  overflow: auto;
}

table {
  width: 1550px;
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 1.201px;
  color: #292929;

  thead {
    tr {
      background-color: #f8f8f8;

      th {
        padding: 24px 12px;

        img {
          vertical-align: text-bottom;
          cursor: pointer;
        }

        &:nth-child(1) {
          width: 140px;
          padding-left: 16px;
        }

        &:nth-child(2) {
          width: 128px;
        }

        &:nth-child(3) {
          width: 148px;
        }

        &:nth-child(4) {
          width: 180px;
        }

        &:nth-child(5) {
          width: 184px;
        }

        &:nth-child(6) {
          width: 100px;
        }

        &:nth-child(7) {
          width: 108px;
        }

        &:nth-child(8) {
          width: 132px;
        }

        &:nth-child(9) {
          width: 140px;
        }

        &:nth-child(10) {
          width: 112px;
        }

        &:nth-child(11) {
          width: 221px;
        }
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #eee;

      &:hover {
        background-color: #e6f9fa;
      }

      td {
        padding: 24px 12px;

        &:nth-child(1) {
          padding-left: 16px;

          span {
            max-width: 92px;
          }
        }
        &:nth-child(2) {
          span {
            max-width: 110px;
          }
        }
        &:nth-child(3) {
          span {
            max-width: 124px;
          }
        }
        &:nth-child(4) {
          span {
            max-width: 132px;
          }
        }

        span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
          line-height: 1;
        }
      }
    }
  }
}

.no_list_data {
  text-align: center;
  margin: 100px 0;
  font-size: 16px;
  color: #ea475b;
}

.loading {
  margin: 88px 0;
}
</style>
