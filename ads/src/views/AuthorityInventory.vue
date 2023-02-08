<template>
  <div class="wrapper_main">
    <div>
      <img src="@/assets/error_maintain.svg" />
    </div>
    <div class="wrapper_main_content">
      <div class="title">年度權限盤點</div>
      <p>
        親愛的用戶，您好，<br />
        廣告平台一年一度的盤點又來，請確認是否還有使用廣告平台的需求，<br />
        逾期未完成盤點者，系統會自動關閉帳號權限。
      </p>
      <ul>
        <li>
          作業時間：<span>{{ startDateMonth }}</span
          >月<span>{{ startDateDate }}</span
          >日 ~<span>{{ endDateMonth }}</span
          >月<span>{{ endDateDate }}</span
          >日
        </li>
        <li>
          盤點環境包含：Lab、Stg、Prod，三環境分別確認。<br />
          <span>Prod</span
          ><a href="https://adsmart.104.com.tw/">https://adsmart.104.com.tw/</a
          ><br />
          <span>Stg</span
          ><a href="https://adsmart.104-staging.com.tw/"
            >https://adsmart.104-staging.com.tw/</a
          ><br />
          <span>Lab</span
          ><a href="https://adsmart.104-dev.com.tw/"
            >https://adsmart.104-dev.com.tw/</a
          ><br />
        </li>
        <li>
          如要異動權限，請至 eportal/表單作業/資訊服務權限申請單 提出申請。
        </li>
        <li>如有任何疑問，請找:陳頤萱(#8667)、徐文達(#8309)</li>
      </ul>
      <div class="button_block">
        <label class="ad-radio-label">
          <input type="radio" v-model="requirement" name="text" value="0" />
          <span class="ad-radio"></span>我還有需要使用
        </label>

        <label class="ad-radio-label">
          <input type="radio" v-model="requirement" name="text" value="1" />
          <span class="ad-radio"></span>我不需要使用
        </label>

        <div class="mt-8">
          <Loading v-if="loading" />
          <button
            v-else
            @click="submit"
            data-test="pullCue-submit"
            class="button_bg_blue_large mb-4"
            :disabled="!requirement"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthorityInventoryStore } from "@/stores/authorityInventory.js";
import { useStore } from "@/store/index.js";
import { useRoute } from "@/router/useRouter.js";
import Loading from "@/components/Loading.vue";
import moment from "moment";

const store = useStore();
const { router } = useRoute();
const authorityInventoryStore = useAuthorityInventoryStore();
const { patchInventory } = authorityInventoryStore;
const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
const inventoryDate = computed(() => authorityInventoryStore.inventoryDate);
const startDateMonth = computed(
  () => moment(inventoryDate.value.startDate).month() + 1
);
const startDateDate = computed(() =>
  moment(inventoryDate.value.startDate).date()
);
const endDateMonth = computed(
  () => moment(inventoryDate.value.endDate).month() + 1
);
const endDateDate = computed(() => moment(inventoryDate.value.endDate).date());
const requirement = ref(null);
const loading = ref(false);

// 整召角色，三種身分的登入後首頁為 Dashboard，其餘身分的登入後首頁維持為行事曆
// 11: Salesperson(整召業務), 13: Operator(整召營運), 14: Manager(整召主管)
// 之後新權限要調整
const conscriptArr = [11, 13, 14];

// 確認
const submit = () => {
  loading.value = true;
  const query = {
    accountId: getUserStatus.value.accountId,
    requirement: Number(requirement.value)
  };
  patchInventory(query).then(() => {
    if (getUserStatus.value.type === 1) {
      // 無權限
      router.push({ path: "error/403" }).catch(() => {});
    } else {
      // 盤點後導到登入首頁
      conscriptArr.includes(getUserStatus.value.role)
        ? router.push({ path: "/dashboard" }).catch(() => {})
        : router.push({ path: "/calendar" }).catch(() => {});
    }
  });
};
</script>

<style lang="scss" scoped>
.wrapper_main {
  width: 1280px;
  height: 540px;
  margin: 30px auto 0;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper_main_content {
    margin-left: 55px;
    width: 510px;
    font-size: 14px;
    color: #8f8f8f;
    line-height: 1.57;
    letter-spacing: 1.21px;

    .title {
      font-size: 20px;
      line-height: 1.4;
      letter-spacing: 1.4px;
      color: #292929;
      margin-bottom: 16px;
    }

    p {
      margin-bottom: 0;
    }

    ul {
      list-style: auto;
      margin: 0 0 0 20px;

      li {
        &:nth-child(1) {
          span {
            margin: 0 4px;
            color: #00afb8;
          }
        }
        &:nth-child(2) {
          span {
            width: 36px;
            margin-right: 8px;
            display: inline-block;
          }
        }

        a {
          font-size: 12px;
        }
      }
    }

    .button_block {
      margin-top: 32px;
      text-align: center;
    }
  }
}
</style>
