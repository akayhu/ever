<template>
  <div>
    <div class="internalOrder_title">管理內服單</div>
    <section class="internalOrder_quotation">
      <h2 class="mb-6">查詢內服單</h2>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <td>公司別</td>
          <td colspan="3" class="company_selector">
            <SelectDropdown
              @value-changed="changeCompany"
              :value="selectedCompany"
              :options="searchedCompanyOptions"
              :asncSearchCb="companySuggestSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              placeholder="請輸入名稱、代碼"
            />
          </td>
        </tr>
        <tr>
          <td>日期</td>
          <td>
            <DatePicker :getSearchTime="getTime" :changeAction="changeDate" />
          </td>
          <td>申請人</td>
          <td>
            <SelectDropdown
              @value-changed="changeUser"
              :value="selectedUser"
              :options="searchedAccountOptions"
              :asncSearchCb="accountSuggestSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              placeholder="請輸入申請員"
            />
          </td>
        </tr>
        <tr>
          <td>內服單單號</td>
          <td colspan="3">
            <input
              v-model="salesOrderListStore.searchQuotation.id"
              placeholder="請輸入"
              widthType="280"
            />
          </td>
        </tr>
      </table>

      <div class="search">
        <button
          @click="search"
          class="button_bg_blue_large"
          :disabled="listData.loading"
        >
          查詢
        </button>
      </div>
    </section>

    <div class="create_internalOrder_button">
      <router-link
        to="/internalOrder/add"
        rel="noopener noreferrer"
        target="_blank"
        title="新增內服單"
        class="button_bg_white_large"
      >
        新增內服單
      </router-link>
    </div>

    <section v-if="listData.isSearch" class="internalOrder_list">
      <h2 class="mb-6">內服單列表</h2>
      <Loading v-if="listData.loading" class="loading" />
      <div v-else>
        <switch-tabs
          :tabs-data="quotationBookmark"
          :value="searchQuotation.queryStatus"
          :style-type="'secondary'"
          :loading="listData.loading"
          @select-tab="changeTab"
        />
        <div class="pen_number">
          共
          <span>{{ listData.totalElements }}</span>
          筆
        </div>
        <table
          v-if="listData.content.length > 0 && !listData.loading"
          cellspacing="0"
          cellpadding="0"
          width="100%"
        >
          <thead>
            <tr>
              <td>客戶資訊</td>
              <td>單號</td>
              <td>報價日期</td>
              <td>業務人員</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in listData.content"
              :key="item.id"
              @click="goInternalPage(item)"
            >
              <td>
                統編<span>{{ item.invoice }}</span>
              </td>
              <td>{{ item.id }}</td>
              <td>{{ item.createDate }}</td>
              <td>
                {{
                  item.salesInfo ? item.salesInfo.name : item.applicantInfo.name
                }}
              </td>
              <td>
                <Icon
                  v-tooltip="{
                    content: getIconTooltipText,
                    offset: 5,
                    placement: 'right',
                    trigger: 'hover'
                  }"
                  :iconName="getIconSrc"
                  @click.stop="goInternalPage(item)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="listData.content.length < 1 && !listData.loading"
          class="no_list_data"
        >
          無列表資料
        </div>
        <div
          v-if="!listData.loading && listData.content.length > 0"
          class="page_block"
        >
          <Pages
            :pageData="listData"
            :reloadPage="false"
            :isUsedEmit="true"
            @pageChange="({ page }) => changePages(page)"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, toRefs, computed, watch } from "vue";
import { useSalesOrderListStore } from "@/stores/salesOrderList";
import { useStore } from "@/store/index.js";
import useUserStore from "@/stores/user";
import { useFormStatus } from "@/composables/quotation/useFormStatus";
import useSelectUser from "@/composables/useSelectUser";
import useSelectCompany from "@/composables/useSelectCompany";
import DatePicker from "@/components/DatePicker.vue";
import SelectDropdown from "@/components/share/SelectDropdown";
import Pages from "@/components/Pages.vue";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import Icon from "@/components/share/Icon.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    DatePicker,
    SelectDropdown,
    SwitchTabs,
    Pages,
    Loading,
    Icon
  },
  setup() {
    const store = useStore();
    const userStore = useUserStore();
    const salesOrderListStore = useSalesOrderListStore();
    const { searchedAccountOptions, accountSuggestSearch } = useSelectUser();
    const { searchedCompanyOptions, companySuggestSearch } = useSelectCompany();
    const { canEditNew, queryListStatus } = useFormStatus();
    const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
    const listData = computed(() => salesOrderListStore.quotationList);
    const { searchQuotation } = toRefs(salesOrderListStore);
    const { getQuotationListData } = salesOrderListStore;

    // 取 icon tooltip 內容
    const getIconTooltipText = computed(() => {
      const selectTabType = {
        "1": "編輯",
        "2": "檢視",
        "3": "檢視",
        "6": "作廢",
        "8": "抽單/駁回",
        "9": "結案"
      };
      return selectTabType[searchQuotation.value.queryStatus];
    });
    // 取 Icon
    const getIconSrc = computed(() =>
      searchQuotation.value.queryStatus === 1
        ? "icon-edit-on"
        : "icon-icon-eye-on"
    );
    const selectedCompany = ref(null);
    const selectedUser = ref(null);
    const quotationBookmark = [
      {
        label: "草稿",
        key: 1
      },
      {
        label: "內服單簽核中",
        key: 2
      },
      {
        label: "內服單成立",
        key: 5
      },
      {
        label: "作廢",
        key: 6
      },
      {
        label: "抽單/駁回",
        key: 8
      },
      {
        label: "結案",
        key: 9
      }
    ];

    // 客戶
    const changeCompany = data => {
      selectedCompany.value = data.name;
      searchQuotation.value.customerId = data.id;
    };

    // 選擇申請人
    const changeUser = data => {
      selectedUser.value = `${data.logonId}(${data.name}/${data.accountId})`;
      searchQuotation.value.applicantId = data.accountId;
    };

    // 日期
    const getTime = time => {
      searchQuotation.value.startDate = time.searchTimeStart;
      searchQuotation.value.endDate = time.searchTimeEnd;
    };

    // 日期 change 事件
    const changeDate = dateValue => {
      searchQuotation.value.startDate = !dateValue ? null : dateValue[0];
      searchQuotation.value.endDate = !dateValue ? null : dateValue[1];
    };

    // 切換頁籤
    const changeTab = type => {
      searchQuotation.value.queryStatus = type.key;
      getQuotationListData(1);
    };

    // 查詢
    const search = () => {
      searchQuotation.value.queryStatus = 1;
      getQuotationListData(1, 1);
    };

    // 切換頁碼
    const changePages = page => {
      searchQuotation.value.page = page;
      getQuotationListData(1);
    };

    // 連結
    const goInternalPage = item => {
      const internalStatus = canEditNew(item);
      internalStatus.edit
        ? (window.location.href = `/internalOrder/edit/${item.id}`)
        : (window.location.href = `/internalOrder/view/${item.id}`);
    };

    // onCreated
    accountSuggestSearch(userStore.getUserStatus.accountId);
    selectedUser.value = `${getUserStatus.value.logonId}(${getUserStatus.value.name}/${getUserStatus.value.accountId})`;
    searchQuotation.value.applicantId = getUserStatus.value.accountId;

    // 列表只有一筆時，直接跳到相對應的狀態頁籤
    watch(listData, newValue => {
      if (newValue.content.length === 1) {
        const currentStatus = queryListStatus(newValue.content[0]);
        searchQuotation.value.queryStatus = currentStatus;
      } else if (
        newValue.content.length === 0 &&
        searchQuotation.value.queryStatus === null
      ) {
        searchQuotation.value.queryStatus = 1;
      }
    });

    return {
      salesOrderListStore,
      searchedCompanyOptions,
      companySuggestSearch,
      selectedCompany,
      changeCompany,
      searchedAccountOptions,
      accountSuggestSearch,
      selectedUser,
      changeUser,
      quotationBookmark,
      searchQuotation,
      getIconTooltipText,
      getIconSrc,
      getTime,
      changeDate,
      changeTab,
      search,
      listData,
      changePages,
      goInternalPage
    };
  }
};
</script>

<style lang="scss" scoped>
.internalOrder_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}

.create_internalOrder_button {
  text-align: right;
  margin-bottom: 24px;
}

section {
  &.internalOrder_quotation {
    margin-bottom: 24px;

    ::v-deep {
      .el-range-editor,
      .el-select {
        width: 280px;
      }
    }

    table {
      tr {
        margin-bottom: 16px;
        display: block;

        td {
          font-size: 16px;
          line-height: 1.38;
          letter-spacing: 1.38px;
          color: #292929;

          &:nth-child(1) {
            width: 115px;
            font-weight: bold;
          }

          &:nth-child(3) {
            width: 126px;
            text-align: center;
            font-weight: bold;
          }
        }
      }
    }

    .company_selector {
      ::v-deep {
        .el-select {
          width: 480px;
        }
      }
    }

    .search {
      text-align: center;
      margin-top: 8px;
    }
  }

  &.internalOrder_list {
    .pen_number {
      text-align: right;
      margin: 16px 0;
      font-size: 16px;
      font-weight: bold;

      span {
        color: #19b9c0;
      }
    }

    table {
      tr {
        border-bottom: 1px solid #eee;
        cursor: pointer;

        td {
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5) {
            padding-left: 12px;
          }

          &:nth-child(1) {
            padding-left: 18px;
            width: 230px;
          }
          &:nth-child(2) {
            width: 187px;
          }
          &:nth-child(3) {
            width: 248px;
          }
          &:nth-child(4) {
            width: 86px;
          }
          &:nth-child(5) {
            width: 149px;
          }
        }
      }

      thead {
        tr {
          td {
            font-size: 14px;
            font-weight: bold;
            line-height: 1.43;
            letter-spacing: 1.43px;
            color: #000;
            padding-bottom: 20px;
          }
        }
      }

      tbody {
        tr {
          &:hover {
            background-color: #e6f9fa;
          }

          td {
            height: 48px;
            padding: 9px 0;
            font-size: 12px;
            line-height: 1.5;
            letter-spacing: 1.29px;
            color: #292929;
            vertical-align: middle;

            span {
              margin-left: 8px;
            }

            img {
              cursor: pointer;
            }

            &:nth-child(5) {
              text-align: center;

              img {
                &:nth-child(2) {
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }

    .page_block {
      margin-top: 40px;
      text-align: right;
      font-size: 14px;
    }

    .no_list_data {
      text-align: center;
      margin: 100px 0;
      font-size: 16px;
      color: #ea475b;
    }

    .loading {
      margin: 100px 0;
    }
  }
}
</style>
