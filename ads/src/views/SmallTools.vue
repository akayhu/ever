<template>
  <section>
    <div class="tools_title">查詢小工具</div>
    <switch-tabs
      :tabs-data="[{ key: 'reservation', label: '檔期ID查版位' }]"
      value="reservation"
      style-type="secondary"
    />
    <div class="tools_search_block">
      <div>檔期ID</div>
      <div>
        <input
          v-model="reservationId"
          type="text"
          placeholder="請輸入"
          widthType="260"
        />
      </div>
      <div>
        <button
          @click="handleGetReservationId"
          :disabled="reservationId.length < 1"
          class="button_bg_blue_large"
        >
          確認
        </button>
      </div>
    </div>
    <div v-if="openSearchReservationBlock" class="tools_search_result">
      <div v-if="reservationMath">
        <div class="search_title">查詢結果</div>
        <div
          v-for="item in reservationObj"
          :key="item.id"
          class="search_content"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
      <div v-if="!reservationMath" class="no_match">
        無符合的資料!
      </div>
    </div>

    <switch-tabs
      class="tools_material"
      :tabs-data="[{ key: 'material', label: '查素材名稱' }]"
      value="material"
      style-type="secondary"
    />
    <div class="tools_search_block">
      <div>素材ID</div>
      <div>
        <input
          v-model="materialId"
          type="text"
          placeholder="請輸入"
          widthType="260"
        />
      </div>
      <div>
        <button
          @click="handleGetToolMaterialId"
          :disabled="materialId.length < 1"
          class="button_bg_blue_large"
        >
          確認
        </button>
      </div>
    </div>
    <div v-if="openSearchMaterialIdBlock" class="tools_search_result">
      <div v-if="materialMath">
        <div class="search_title">查詢結果</div>
        <div v-for="item in materialObj" :key="item.id" class="search_content">
          <span>{{ item.name }}</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
      <div v-if="!materialMath" class="no_match">
        無符合的資料!
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from "vue";
import { useToolStore } from "@/stores/tool.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";

export default {
  components: {
    SwitchTabs
  },
  setup() {
    const toolStore = useToolStore();
    const { getToolReservationId, getToolMaterialId } = toolStore;
    const reservationId = ref("");
    const materialId = ref("");
    const openSearchReservationBlock = ref(false);
    const openSearchMaterialIdBlock = ref(false);
    const reservationMath = ref(false);
    const materialMath = ref(false);
    const reservationObj = ref([
      {
        id: "board",
        name: "版位名稱",
        value: ""
      },
      {
        id: "date",
        name: "檔期時間",
        value: ""
      },
      {
        id: "projectName",
        name: "專案名稱",
        value: ""
      },
      {
        id: "companyName",
        name: "企業名稱",
        value: ""
      }
    ]);
    const materialObj = ref([
      {
        id: "reservationId",
        name: "預約編號",
        value: ""
      },
      {
        id: "title",
        name: "素材名稱",
        value: ""
      },
      {
        id: "customerName",
        name: "企業名稱",
        value: ""
      },
      {
        id: "projectName",
        name: "專案名稱",
        value: ""
      },
      {
        id: "board",
        name: "版位名稱",
        value: ""
      },
      {
        id: "date",
        name: "檔期時間",
        value: ""
      }
    ]);

    // 查詢檔期
    const handleGetReservationId = () => {
      getToolReservationId({ id: reservationId.value })
        .then(res => {
          reservationObj.value[0].value = `${res.device}/${res.channelName}/${res.boardName}`;
          reservationObj.value[1].value = `${res.startDate} ~ ${res.endDate}`;
          reservationObj.value[2].value = res.projectName;
          reservationObj.value[3].value = res.customerName;
          reservationMath.value = true;
          openSearchReservationBlock.value = true;
        })
        .catch(() => {
          reservationMath.value = false;
          openSearchReservationBlock.value = true;
        });
    };

    // 查詢素材
    const handleGetToolMaterialId = () => {
      getToolMaterialId({ id: materialId.value })
        .then(res => {
          materialObj.value[0].value = res.reservationId;
          materialObj.value[1].value = res.materialTitle;
          materialObj.value[2].value = res.customerName;
          materialObj.value[3].value = res.projectName;
          materialObj.value[4].value = `${res.device}/${res.channelName}/${res.boardName}`;
          materialObj.value[5].value = `${res.startDate} ~ ${res.endDate}`;
          materialMath.value = true;
          openSearchMaterialIdBlock.value = true;
        })
        .catch(() => {
          materialMath.value = false;
          openSearchMaterialIdBlock.value = true;
        });
    };

    return {
      reservationId,
      materialId,
      openSearchReservationBlock,
      openSearchMaterialIdBlock,
      reservationMath,
      materialMath,
      reservationObj,
      materialObj,
      handleGetReservationId,
      handleGetToolMaterialId
    };
  }
};
</script>

<style lang="scss" scoped>
section {
  .tools_title {
    font-size: 24px;
    font-weight: bold;
    line-height: 1.33;
    letter-spacing: 1.5px;
    color: #333;
    margin-bottom: 20px;
  }

  .switch_tabs_secondary {
    ::v-deep .switch_tabs_element {
      cursor: inherit;
    }
  }
  .tools_material {
    margin-top: 24px;
  }

  .tools_search_block {
    display: flex;
    align-items: center;
    padding-bottom: 24px;
    margin-top: 24px;

    div {
      &:nth-child(1) {
        margin: 0 28px;
        font-size: 16px;
        font-weight: bold;
        line-height: 1.38;
        letter-spacing: 1.38px;
      }
      &:nth-child(2) {
        margin-right: 28px;
      }
    }
  }

  .tools_search_result {
    padding: 24px 28px;
    background-color: #f8f8f8;
    box-shadow: inset 0 1px 4px 0 rgba(197, 197, 197, 0.5);
    font-size: 16px;
    position: relative;
    margin-bottom: 60px;

    &::before {
      content: "";
      position: absolute;
      width: 0px;
      height: 0px;
      border-right: 6px solid transparent;
      border-bottom: 6px solid rgba(197, 197, 197, 0.4);
      border-left: 6px solid transparent;
      top: -6px;
      left: 50%;
    }

    &::after {
      content: "";
      position: absolute;
      width: 0px;
      height: 0px;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #f8f8f8;
      border-left: 6px solid transparent;
      top: -3px;
      left: 50%;
    }

    .search_title {
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #333;
      margin-bottom: 20px;
    }

    .search_content {
      margin-bottom: 12px;
      line-height: 1.38;
      letter-spacing: 1.38px;

      span {
        &:nth-child(1) {
          margin-left: 20px;
        }

        &:nth-child(2) {
          margin-left: 20px;
          font-weight: bold;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .no_match {
      font-size: 16px;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #fd223d;
      text-align: center;
      padding: 60px 0;
    }
  }
}
</style>
