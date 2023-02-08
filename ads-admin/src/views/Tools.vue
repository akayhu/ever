<template>
  <section>
    <h2>小工具</h2>

    <SwitchTabs
      :tabsData="tabsData"
      :value="tab"
      styleType="secondary"
      @select-tab="handleChangeTab($event.key)"
    />

    <!-- 版位序號設定 -->
    <div v-if="tab === 'placement_order'" class="placement_order">
      <div v-if="boardSortListData.length > 0">
        <div class="sort_title">
          <div>siteName</div>
          <div>Device</div>
          <div>channelName</div>
          <div>boardName</div>
          <div>typeId</div>
          <div>Sort</div>
          <div>拖曳</div>
        </div>
        <draggable
          tag="transition-group"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          v-model="boardSortListData"
          class="list-group"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          handle=".handle"
          item-key="id"
        >
          <template #item="{ element, index }">
            <div
              class="sort_content handle"
              @mousedown="mousedown(index)"
              @mouseout="mouseout(index)"
            >
              <div>{{ element.siteName }} ( {{ element.siteId }} )</div>
              <div>{{ element.device }}</div>
              <div>{{ element.channelName }} ( {{ element.channelId }} )</div>
              <div>{{ element.name }} ( {{ element.id }} )</div>
              <div>{{ element.typeId }}</div>
              <div>
                <input
                  type="text"
                  v-model="element.sort"
                  @keyup.enter="sortChange(index)"
                  @input="element.sort = element.sort.replace(/[^\d]/g, '')"
                  :class="{
                    error_message_border:
                      v$.boardSortListData.$each.$message[index][0] &&
                      v$.boardSortListData.$error &&
                      sortIndex === index
                  }"
                />
                <div
                  v-if="v$.boardSortListData.$error && sortIndex === index"
                  class="enter_at_least"
                >
                  {{ v$.boardSortListData.$each.$message[index][0] }}
                </div>
              </div>
              <div>
                <img :src="element.drag ? move : moreNormal" />
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <div v-if="boardSortListData.length < 1" class="loading">
        <Loading />
      </div>
    </div>

    <!-- 素材更新數據 -->
    <div v-else-if="tab === 'material_update'" class="unclosed_project">
      <div class="content">
        <a
          :href="materialDownloadLink"
          rel="noopener noreferrer"
          target="_blank"
          >下載報表</a
        >
      </div>
    </div>

    <!-- 未結案專案清單 -->
    <div v-else-if="tab === 'unclosed_project'" class="unclosed_project">
      <div class="content">
        <SelectDropdown
          :value="selectedUnClosedProjectYear"
          :options="unClosedProjectYearOptions"
          :optionsAllData="true"
          @value-changed="selectedUnClosedProjectYear = $event"
        />
        <a
          :href="unClosedProjectDownloadLink"
          rel="noopener noreferrer"
          target="_blank"
          >下載報表</a
        >
      </div>
    </div>

    <!-- ERP custno對照表 -->
    <div v-else class="erp_custno">
      <div class="illustrate mb-16">
        說明：除( * )每日凌晨與公版同步更新一次，其餘為即時資訊
      </div>
      <div class="erp_chart title">
        <div>平台</div>
        <div>ERP Custno</div>
        <div>公版公司名稱</div>
        <div>企業統一編號</div>
        <div>VIP Custno (*)</div>
        <div>公版企業編號</div>
      </div>
      <div class="erp_chart title">
        <div>公版</div>
        <div>id</div>
        <div>name</div>
        <div>invoice</div>
        <div>custNo</div>
        <div>mdmKey</div>
      </div>
      <div v-if="customerData.length > 0">
        <div v-for="item in customerData" :key="item.id" class="erp_chart">
          <div></div>
          <div>{{ item.id }}</div>
          <div>{{ item.name }}</div>
          <div>{{ item.invoice }}</div>
          <div>{{ item.custNo }}</div>
          <div>{{ item.mdmKey }}</div>
        </div>
      </div>
      <div v-else class="loading"><Loading /></div>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import SelectDropdown from "@/components/SelectDropdown.vue";
import SwitchTabs from "@/components/SwitchTabs.vue";
import draggable from "vuedraggable";
import moreNormal from "@/assets/icon/icon-icon-li-more-normal.svg";
import move from "@/assets/icon/icon-icon-move.svg";
import Loading from "@/components/Loading.vue";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { useBoardStore } from "@/storesPinia/board.js";
import { useProjectStore } from "@/storesPinia/project.js";

export default defineComponent({
  name: "Tools",
  components: { SelectDropdown, SwitchTabs, Loading, draggable },
  validations: {
    boardSortListData: {
      $each: helpers.forEach({
        sort: {
          isUnique: helpers.withMessage("請至少輸入七碼", function (value) {
            return String(value).length > 0 && String(value).length < 7
              ? false
              : true;
          })
        }
      })
    }
  },
  setup() {
    const boardStore = useBoardStore();
    const projectStore = useProjectStore();
    const { patchBoardSort, getAllBoard } = boardStore;
    const { getCustomer } = projectStore;
    const v$ = useVuelidate();
    // 素材更新數據下載報表連結
    const materialDownloadLink = computed(
      () =>
        `https:${process.env.VUE_APP_API_DOMAIN_URL}api/report/file/download/common/material-update-times`
    );
    // 未結案專案清單報表年份
    const unClosedProjectYearOptions = computed(() => {
      const thisYear = new Date().getFullYear();
      let result = [];
      for (let i = 2020; i <= thisYear; i++) {
        result.push(i);
      }
      return result;
    });
    // 未結案專案清單下載報表連結
    const unClosedProjectDownloadLink = computed(
      () =>
        `https:${process.env.VUE_APP_API_DOMAIN_URL}api/report/file/download/common/unclosed-project?year=${selectedUnClosedProjectYear.value}`
    );
    const selectedUnClosedProjectYear = ref(new Date().getFullYear() - 1);
    const tabsData = ref([
      { key: "placement_order", label: "版位序號設定" },
      { key: "material_update", label: "素材更新數據" },
      { key: "unclosed_project", label: "未結案專案清單" },
      { key: "erp_custno", label: "ERP custno對照表" }
    ]);
    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    });
    let tab = ref("placement_order");
    let drag = ref(false);
    let boardSortListData = ref([]);
    let customerData = ref([]);
    let sortIndex = ref(0);

    // 選取的 tab
    const handleChangeTab = type => {
      tab.value = type;

      if (type === "erp_custno" && customerData.value.length < 1)
        getCustomerDataFunc();
    };

    // 拖曳 icon 滑鼠按下
    const mousedown = index => {
      boardSortListData.value[index] = {
        ...boardSortListData.value[index],
        drag: true
      };
    };

    // 拖曳 icon 滑鼠離開
    const mouseout = index => {
      boardSortListData.value[index] = {
        ...boardSortListData.value[index],
        drag: false
      };
    };

    // sort input，輸入 7 位數以上再打 api
    const sortChange = index => {
      sortIndex.value = index;
      const validation = v$.value.boardSortListData;
      validation.$touch();
      if (boardSortListData.value[index].sort.length >= 7) {
        patchBoardSort({
          id: boardSortListData.value[index].id,
          sort: Number(boardSortListData.value[index].sort)
        }).then(() => {
          validation.$reset();
          getAllBoardFunc();
        });
      }
    };

    // 取版位排序資料
    const getAllBoardFunc = () => {
      boardSortListData.value = [];
      getAllBoard().then(res => {
        boardSortListData.value = res.slice();
      });
    };

    // 取 ERP custno 對照表
    const getCustomerDataFunc = () => {
      customerData.value = [];
      getCustomer().then(res => {
        customerData.value = res;
      });
    };

    getAllBoardFunc();

    return {
      selectedUnClosedProjectYear,
      tabsData,
      drag,
      tab,
      materialDownloadLink,
      unClosedProjectYearOptions,
      unClosedProjectDownloadLink,
      handleChangeTab,
      moreNormal,
      move,
      mousedown,
      mouseout,
      boardSortListData,
      sortChange,
      dragOptions,
      v$,
      sortIndex,
      customerData
    };
  }
});
</script>

<style lang="scss" scoped>
@import "~scss/mixin/mixin";

h2 {
  margin-bottom: 20px;
}

.material_update_times {
  margin-bottom: 24px;

  :deep(.switch_tabs_element) {
    cursor: initial;
  }

  .content {
    margin: 0 24px;
  }
}

.unclosed_project {
  :deep(.switch_tabs_element) {
    cursor: initial;
  }

  .content {
    margin: 0 24px;

    .el-select {
      width: 100px;
      margin-right: 28px;
    }
  }
}

.placement_order {
  .tab_outer {
    position: relative;

    span {
      position: absolute;
      top: 20px;
      right: 0px;
      cursor: pointer;
    }
  }

  .sort_title {
    display: flex;
    border-bottom: 1px solid #eee;
    padding-bottom: 16px;
    background-color: #fff;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    line-height: 22px;

    div {
      padding: 0 12px;

      &:nth-child(1) {
        width: 232px;
      }
      &:nth-child(2) {
        width: 88px;
      }
      &:nth-child(3) {
        width: 228px;
      }
      &:nth-child(4) {
        width: 208px;
      }
      &:nth-child(5) {
        width: 88px;
      }
      &:nth-child(6) {
        width: 168px;
      }
      &:nth-child(7) {
        width: 88px;
        text-align: center;
        padding-left: 0;
      }
    }
  }

  .sort_content {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    font-size: 16px;

    &:hover {
      background-color: #e6f9fa;
    }

    .enter_at_least {
      font-size: 14px;
      line-height: 1.43;
      letter-spacing: 1.43px;
      color: #ea475b;
      width: initial !important;
      padding: 0;
    }

    div {
      padding: 13px 12px;
      line-height: 1.38;
      letter-spacing: 1px;

      &:nth-child(1) {
        width: 228px;
      }
      &:nth-child(2) {
        width: 88px;
      }
      &:nth-child(3) {
        width: 228px;
      }
      &:nth-child(4) {
        width: 208px;
      }
      &:nth-child(5) {
        width: 88px;
      }
      &:nth-child(6) {
        width: 168px;
        padding: 4px 0;

        input {
          width: 96px;
        }
      }
      &:nth-child(7) {
        width: 88px;
        text-align: center;

        img {
          cursor: pointer;
        }
      }
    }
  }
}

.erp_custno {
  .illustrate {
    font-size: 14px;
    color: #ea475b;
    letter-spacing: 1px;
    padding-left: 12px;
  }

  .erp_chart {
    display: grid;
    grid-template-columns: 60px 140px 380px 150px 200px 186px;
    grid-gap: 12px;
    border-bottom: 1px solid #eee;
    align-items: center;

    div {
      display: inline-grid;
      font-size: 16px;
      color: #292929;
      padding: 12px 0;
      line-height: 1.43;
      letter-spacing: 1.43px;

      &:nth-child(1) {
        padding-left: 12px;
      }
    }

    &.title {
      div {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;

  i {
    cursor: pointer;
  }
}
.loading {
  margin: 100px 0;
}
</style>
