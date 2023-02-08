<template>
  <section class="query_quotation">
    <h2>查詢報價單</h2>
    <table cellspacing="0" cellpadding="0">
      <tr>
        <td>公司別</td>
        <td colspan="3">
          <label class="ad-radio-label">
            <input
              v-model="searchQuotation.account104"
              :value="1"
              type="radio"
              name="promotion"
            />
            <span class="ad-radio"></span>一零四資訊科技
          </label>
          <label class="ad-radio-label">
            <input
              v-model="searchQuotation.account104"
              :value="4"
              type="radio"
              name="promotion"
            />
            <span class="ad-radio"></span>一零四管理顧問
          </label>
        </td>
      </tr>
      <tr>
        <td>客戶</td>
        <td colspan="3" class="client">
          <SelectDropdown
            @value-changed="setSelectedClient($event)"
            :value="selectedClient"
            :options="searchedClientOptions"
            :asncSearchCb="companySuggestSearch"
            :filterable="true"
            :remote="true"
            :optionsAllData="true"
            :clearable="true"
            placeholder="請輸入統編、代碼或公司名稱"
          />
        </td>
      </tr>
      <tr>
        <td>日期</td>
        <td>
          <DatePicker
            ref="datePicker"
            :getSearchTime="getTime"
            :clearable="true"
            :changeAction="clearOrder"
          />
        </td>
        <td>業務人員</td>
        <td>
          <SelectDropdown
            @value-changed="setSelectedSales($event)"
            :value="selectedSales"
            :options="searchedSalesOptions"
            :asncSearchCb="accountSearch"
            :filterable="true"
            :remote="true"
            :optionsAllData="true"
            :clearable="true"
            placeholder="請輸入業務人員"
          />
        </td>
      </tr>
      <tr>
        <td>報價單單號</td>
        <td>
          <input
            v-model="searchQuotation.id"
            placeholder="請輸入"
            widthType="280"
          />
        </td>
        <td>訂單單號</td>
        <td>
          <input
            v-model="searchQuotation.orderId"
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
        :disabled="quotationList.loading"
      >
        查詢
      </button>
    </div>
  </section>
</template>

<script>
import { useStore } from "@/store/index.js";
import { ref, toRefs, computed } from "vue";
import { useAccountStore } from "@/stores/account.js";
import { useSalesOrderListStore } from "@/stores/salesOrderList.js";
import SelectDropdown from "@/components/share/SelectDropdown";
import DatePicker from "@/components/DatePicker.vue";

export default {
  components: {
    SelectDropdown,
    DatePicker
  },
  setup() {
    const store = useStore();
    const accountStore = useAccountStore();
    const { getAccountSearch } = accountStore;
    const salesOrderListStore = useSalesOrderListStore();
    const { getQuotationListData } = salesOrderListStore;
    const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
    const { searchQuotation, quotationList } = toRefs(salesOrderListStore);
    let searchedClientOptions = ref([]);
    let selectedClient = ref(null);
    let searchedSalesOptions = ref([]);
    let selectedSales = ref(null);
    let datePicker = ref(null);

    // 客戶 AC
    const companySuggestSearch = async keyword => {
      if (!keyword) return;
      if (!keyword) return;
      if (keyword.length >= 2) {
        let query = !isNaN(Number(keyword))
          ? { invoice: keyword }
          : { keyword };
        const responseData = await store.dispatch(
          "project/getCustomerSuggestion",
          query
        );

        searchedClientOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      }
    };

    // 選擇客戶
    const setSelectedClient = data => {
      if (!data) {
        selectedClient.value = null;
        searchQuotation.value.customerId = null;
        return;
      }
      selectedClient.value = searchedClientOptions.value.find(
        option => option.name === data.name
      ).label;
      searchQuotation.value.customerId = data.value;
    };

    // 日期
    const getTime = time => {
      searchQuotation.value.startDate = time.searchTimeStart;
      searchQuotation.value.endDate = time.searchTimeEnd;
    };

    const clearOrder = dateValue => {
      if (!dateValue) {
        searchQuotation.value.startDate = null;
        searchQuotation.value.endDate = null;
      }
    };

    // 選擇業務人員
    const setSelectedSales = data => {
      if (!data) {
        selectedSales.value = null;
        searchQuotation.value.salesId = null;
        return;
      }
      selectedSales.value = searchedSalesOptions.value.find(
        option => option.name === data.name
      ).label;
      searchQuotation.value.salesId = data.value;
    };

    // 業務人員 AC
    const accountSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const responseData = await getAccountSearch({ keyword });
        searchedSalesOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.logonId}(${item.name}/${item.accountId})`
          };
        });
      }
    };

    // 查詢
    const search = () => {
      searchQuotation.value.queryStatus = 1;
      getQuotationListData();
    };

    // created
    accountSearch(getUserStatus.value.accountId);
    selectedSales.value = `${getUserStatus.value.logonId}(${getUserStatus.value.name}/${getUserStatus.value.accountId})`;
    searchQuotation.value.salesId = getUserStatus.value.accountId;

    return {
      searchQuotation,
      quotationList,
      searchedClientOptions,
      selectedClient,
      searchedSalesOptions,
      selectedSales,
      companySuggestSearch,
      setSelectedClient,
      getTime,
      clearOrder,
      setSelectedSales,
      accountSearch,
      search,
      datePicker
    };
  }
};
</script>

<style lang="scss" scoped>
section {
  &.query_quotation {
    margin-bottom: 24px;

    h2 {
      margin-bottom: 24px;
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

          &.client {
            ::v-deep .el-select {
              width: 684px;
            }
          }

          ::v-deep {
            .el-range-editor,
            .el-select {
              width: 280px;
            }
          }
        }
      }
    }

    .search {
      text-align: center;
      margin-top: 8px;
    }
  }
}
</style>
