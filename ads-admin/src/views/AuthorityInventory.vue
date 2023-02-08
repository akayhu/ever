<template>
  <section>
    <h2>權限盤點</h2>
    <div class="authority_inventory_main">
      <div class="title">啟動年度盤點設定</div>
      <div class="inventory_date">
        <div>盤點日期</div>
        <div>
          <span>
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="開始日期"
              value-format="YYYY/MM/DD" /></span
          >～<span
            ><el-date-picker
              v-model="endDate"
              type="date"
              placeholder="截止日期"
              value-format="YYYY/MM/DD"
          /></span>
        </div>
        <div>
          <button
            @click="startUp"
            :disabled="!startDate || !endDate"
            class="button_bg_blue_smaller"
          >
            啟動
          </button>
        </div>
        <div class="hint">
          <icon iconName="icon-info-warmgray" />要啟動新的盤點區間前,
          請先清除前次盤點紀錄
        </div>
      </div>
      <div class="change">
        盤點後帳號異動
        <button @click="implementChange" class="button_bg_blue_small">
          執行異動
        </button>
      </div>
      <div class="confirmClear">
        清除前次盤點紀錄
        <button @click="confirmClear" class="button_bg_blue_small">
          確定清除
        </button>
        <span
          >( {{ inventoryDate.startDate }} ～
          {{ inventoryDate.endDate }} )</span
        >
      </div>
    </div>
    <div class="authority_inventory_main">
      <div class="title">盤點紀錄</div>
      <div v-if="inventoryDate.startDate" class="download_inventory">
        下載前次盤點紀錄
        <a :href="downloadUrl"
          ><icon iconName="icon-icon-download" />下載檔案</a
        >
        <span class="download_date"
          >( {{ inventoryDate.startDate }} ～
          {{ inventoryDate.endDate }} )</span
        >
        <span><icon iconName="icon-info-warmgray" />最新一次的盤點區間</span>
      </div>
      <div v-if="!inventoryDate.startDate" class="no_data">目前無資料！</div>
    </div>
    <div class="authority_inventory_main inventory_history">
      <div class="title">盤點歷程</div>
      <ul>
        <li v-for="(item, index) in 3" :key="index">
          2023-02-01~2023-02-10
          <a :href="downloadUrl"
            ><icon iconName="icon-icon-download" />下載檔案</a
          >
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthorityInventoryStore } from "@/storesPinia/authorityInventory.js";

const authorityInventoryStore = useAuthorityInventoryStore();
const {
  postInventoryActivate,
  // deleteInventory,
  getInventoryLatestInventoryDate,
  patchInventoryRestore
} = authorityInventoryStore;
const inventoryDate = computed(() => authorityInventoryStore.inventoryDate);
const downloadUrl = computed(
  () => `https:${process.env.VUE_APP_API_DOMAIN_URL}api/inventory/download`
);
const startDate = ref(null);
const endDate = ref(null);

// 啟動
const startUp = () => {
  const query = {
    startDate: startDate.value,
    endDate: endDate.value
  };
  postInventoryActivate(query);
};

// 執行異動
const implementChange = () => {
  // deleteInventory();
};

// 確定清除
const confirmClear = () => {
  patchInventoryRestore();
};

onMounted(async () => {
  await getInventoryLatestInventoryDate();
  startDate.value = inventoryDate.value.startDate;
  endDate.value = inventoryDate.value.endDate;
});
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 26px;
}
.authority_inventory_main {
  border-bottom: 1px solid #eee;
  padding-bottom: 24px;
  margin-bottom: 24px;
  line-height: 1.38;
  letter-spacing: 1px;
  color: #000;

  .title {
    font-size: 18px;
    font-weight: bold;
    line-height: 1.22;
    letter-spacing: 1.55px;
    color: #333;
  }

  .inventory_date {
    display: flex;
    margin: 24px 0;
    align-items: center;

    > div {
      &:nth-child(1) {
        margin-right: 28px;
      }
      &:nth-child(2) {
        display: flex;
        align-items: center;

        span {
          &:nth-child(1) {
            margin-right: 12px;
          }
          &:nth-child(2) {
            margin-left: 12px;
          }
        }
      }
      &:nth-child(3) {
        margin-left: 36px;
      }
      &:nth-child(4) {
        font-size: 14px;
        line-height: 1.43;
        letter-spacing: 1.43px;
        color: #8f8f8f;

        img {
          margin: 0 4px 0 8px;
        }
      }
    }
  }

  .change {
    button {
      margin-left: 45px;
    }
  }

  .download_inventory {
    margin-top: 32px;
    display: flex;
    align-items: center;

    a {
      margin-left: 12px;
      color: #00afb8;

      img {
        vertical-align: bottom;
      }
    }

    span {
      color: #8f8f8f;
      font-size: 14px;
      line-height: 1.43;
      letter-spacing: 1.43px;

      &.download_date {
        margin: 0 16px 0 12px;
        color: #00afb8;
      }

      img {
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }

  .confirmClear {
    margin-top: 16px;

    button {
      margin-left: 28px;
    }

    span {
      font-size: 14px;
      margin-left: 12px;
      color: #00afb8;
      line-height: 1.57;
      letter-spacing: 1.21px;
    }
  }

  &.inventory_history {
    ul {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.57;
      letter-spacing: 1.23px;
      color: #292929;
      margin: 24px 0 0;

      li {
        display: flex;
        align-items: center;
        margin-bottom: 24px;

        img {
          vertical-align: middle;
          margin: 0 4px 0 12px;
        }

        a {
          font-size: 14px;
          color: #00afb8;
        }

        &::before {
          content: " ";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: solid 4px #00afb8;
          position: relative;
          margin-right: 8px;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .no_data {
    font-size: 14px;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #ea475b;
    text-align: center;
    margin-top: 24px;
  }
}

button {
  font-size: 14px;
  min-height: 32px;
}
</style>
