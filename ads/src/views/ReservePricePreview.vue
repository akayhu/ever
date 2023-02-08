<template>
  <section class="reserve_price_preview_main">
    <div class="mb-6 d-flex align-items-center">
      <div class="title flex-fill">預覽_底價測案</div>
      <div class="font-weight-normal">
        生效日期：<span class="pl-1 text-primary">{{
          productPromo.effectiveDate || "- -"
        }}</span>
      </div>
    </div>
    <div class="copywriting">
      <div class="title">
        {{ currentVersion }}<span class="ml-2">促案</span>
      </div>
      <div class="mt-2">{{ productPromo.note }}</div>
    </div>

    <Loading v-if="loading" class="loading" />
    <table
      v-else-if="productPromo.productPromoEffectList.length > 0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
    >
      <tr>
        <th>整招版<br />產品分級</th>
        <th>網站名稱</th>
        <th>頻道名稱</th>
        <th>版位名稱</th>
        <th>輪播次數</th>
        <th>牌價(未稅)</th>
        <th>底價(未稅)</th>
        <th>折扣</th>
        <th>試用身份</th>
        <th>平均曝光數<br />(週)</th>
        <th>總平均Click<br />(週)</th>
        <th>平均CTR</th>
        <th>備註</th>
      </tr>
      <tr v-for="item in productPromo.productPromoEffectList" :key="item.index">
        <td>{{ item.group }}</td>
        <td>{{ item.siteName }}</td>
        <td>{{ item.channelName }}</td>
        <td>{{ item.boardName }}</td>
        <td>{{ item.rotate }}</td>
        <td>${{ item.marketPrice.toLocaleString() }}</td>
        <td>${{ item.floorPrice.toLocaleString() || 0 }}</td>
        <td>
          {{
            item.floorPrice && item.marketPrice
              ? round((item.floorPrice / item.marketPrice) * 100, 2)
              : 0
          }}%
        </td>
        <td>{{ item.notForProduct || "- -" }}</td>
        <td>{{ item.impression.toLocaleString() }}</td>
        <td>{{ item.click.toLocaleString() }}</td>
        <td>{{ getActualCTR(item.impression, item.click) }}</td>
        <td>
          <div class="py-2">
            <div v-if="item.noteForPromoLastVersion" class="table_note">
              <div>補充：{{ item.noteForPromoLastVersion }}</div>
            </div>
            <div v-if="item.noteForEffectLastVersion" class="table_note">
              <div>補充：{{ item.noteForEffectLastVersion }}</div>
            </div>
            <div v-if="item.noteForPromo">
              <div>補充：{{ item.noteForPromo }}</div>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <div v-else class="no_list_data">尚無版位資料</div>
  </section>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect.js";
import { useRoute } from "@/router/useRoute.js";
import moment from "moment";
import Loading from "@/components/Loading.vue";
import { round } from "@/utils/quotation.js";

const productPromoEffectStore = useProductPromoEffectStore();
const { getProductPromoId } = productPromoEffectStore;
const { route } = useRoute();
const productPromo = computed(() => productPromoEffectStore.productPromo);
const loading = computed(() => productPromoEffectStore.productPromo.loading);

// 現在所屬版本
const currentVersion = computed(
  () =>
    `Y${String(productPromo.value.year).substring(2, 4)}-Q${
      productPromo.value.quarter
    } ${moment(productPromo.value.effectiveDate).format("MM-DD")}`
);

// 平均CTR
const getActualCTR = (impression, click) =>
  impression && click ? ((click / impression) * 100).toFixed(2) + "%" : "- -";

onMounted(async () => {
  const query = {
    id: route.query.id
  };
  await getProductPromoId(query);
});
</script>

<style lang="scss" scoped>
.reserve_price_preview_main {
  min-width: 1440px;
  max-width: max-content;
  margin: 24px;
  display: inline-block;

  .title {
    font-size: 24px;
    font-weight: bold;
    line-height: 1.33;
    letter-spacing: 1.33px;
    color: #333;
    & + div {
      color: #333;
      -webkit-text-stroke-width: 0.4px;
      letter-spacing: 0.78px;
    }
  }

  .copywriting {
    padding: 24px;
    margin-bottom: 24px;
    border-radius: 8px;
    border: solid 1px #e2e1e1;
    background-color: #e6f9fa;

    .title {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #00afb8;

      span {
        color: #333;
      }
    }
  }

  .text-primary {
    color: #00afb8;
  }
}

table {
  > tr {
    width: 100%;
    height: 70px;
    line-height: 1.57;
    letter-spacing: 1.23px;
    border-bottom: 1px solid #eee;

    &:nth-child(1) {
      background-color: #f8f8f8;
    }

    th,
    td {
      padding: 12px;
      vertical-align: middle;
    }

    th {
      &:nth-child(1) {
        min-width: 130px;
      }
      &:nth-child(2) {
        min-width: 130px;
      }
      &:nth-child(3) {
        min-width: 130px;
      }
      &:nth-child(4) {
        min-width: 130px;
      }
      &:nth-child(5) {
        min-width: 130px;
      }
      &:nth-child(6) {
        min-width: 130px;
      }
      &:nth-child(7) {
        min-width: 130px;
      }
      &:nth-child(8) {
        min-width: 130px;
      }
      &:nth-child(9) {
        min-width: 130px;
      }
      &:nth-child(10) {
        min-width: 130px;
      }
      &:nth-child(11) {
        min-width: 130px;
      }
      &:nth-child(12) {
        min-width: 130px;
      }
      &:nth-child(13) {
        min-width: 130px;
      }
    }

    th {
      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9),
      &:nth-child(13) {
        background-color: #e6f9fa;
      }
      &:nth-child(10),
      &:nth-child(11),
      &:nth-child(12) {
        background-color: #dbf7c5;
      }
    }
    td {
      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9),
      &:nth-child(13) {
        background-color: #f7fdfd;
      }
      &:nth-child(10),
      &:nth-child(11),
      &:nth-child(12) {
        background-color: #edfbe2;
      }
    }
  }
}

.table_note {
  &:not(:last-child) {
    padding-bottom: 8px;
  }
}

.loading {
  width: 100%;
  margin: 88px 0;
}

.no_list_data {
  text-align: center;
  margin: 100px 0;
  font-size: 16px;
  color: #ea475b;
}
</style>
