<template>
  <section class="search_user_log_block">
    <switch-tabs
      :tabs-data="[
        { key: 'behavior_record', label: '查詢使用者行為記錄' },
        { key: 'history_record', label: '查詢歷程' }
      ]"
      :value="tab"
      @select-tab="handleChangeTab($event.key)"
    />
    <div class="user_behavior_search">
      <div v-if="tab === 'behavior_record'" class="user_account">
        <span>人員</span>
        <SelectDropdown
          @value-changed="setSelectedAccount($event)"
          :value="accountLabel"
          :options="searchedAccountOptions"
          :asncSearchCb="accountSearch"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          noDataText="查不到對應人員"
          placeholder="請輸入"
        />
      </div>
      <div class="user_account">
        <span>分類</span>
        <div>
          <el-select
            v-model="v$.logTypeValue.$model"
            @focus="accountFocus"
            :class="{
              error_message_border:
                tab === 'history_record' && v$.logTypeValue.$error
            }"
            clearable
            placeholder="請選擇"
          >
            <el-option
              v-for="item in logTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <ValidationError
            v-if="tab === 'history_record'"
            :vData="v$.logTypeValue"
            text="請選擇分類"
          />
        </div>
      </div>
      <div v-if="tab === 'history_record'" class="user_account">
        <span>ID</span>
        <div>
          <input
            v-model="v$.keyId.$model"
            :class="{ error_message_border: v$.keyId.$error }"
            widthType="260"
            placeholder="請輸入"
          />
          <ValidationError :vData="v$.keyId" text="請輸入ID" />
        </div>
      </div>
    </div>
    <div v-if="tab === 'behavior_record'" class="user_behavior_time">
      <span>日期</span>
      <span>
        <DatePicker
          ref="datePicker"
          :clearable="true"
          :getSearchTime="getTime"
          @clearAction="clearTime"
        />
      </span>
    </div>
    <div class="search_button_block">
      <button @click="handleClearSearch" class="button_bg_white_large">
        清除
      </button>
      <button @click="handleSerach" class="button_bg_blue_large">查詢</button>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import SelectDropdown from "@/components/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import ValidationError from "@/components/ValidationError.vue";
import SwitchTabs from "@/components/SwitchTabs.vue";
import { useAccountStore } from "@/storesPinia/account.js";

export default defineComponent({
  name: "SearchLogBlock",
  components: {
    SelectDropdown,
    ValidationError,
    DatePicker,
    SwitchTabs
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { getAccountSearch } = useAccountStore();
    const logTypes = ref([
      {
        label: "登入登出",
        value: 0
      },
      {
        label: "會員",
        value: 11
      },
      {
        label: "網站",
        value: 21
      },
      {
        label: "頻道",
        value: 22
      },
      {
        label: "版位",
        value: 23
      },
      {
        label: "曝光條件",
        value: 24
      },
      {
        label: "商品關聯",
        value: 31
      },
      {
        label: "專案",
        value: 41
      },
      {
        label: "素材",
        value: 51
      },
      {
        label: "墊檔素材",
        value: 52
      },
      {
        label: "素材曝光日期",
        value: 53
      },
      {
        label: "檔期預約",
        value: 61
      },
      {
        label: "緊急上架",
        value: 62
      },
      {
        label: "緊急下架",
        value: 63
      },
      {
        label: "網頁曝光職缺",
        value: 71
      }
    ]);
    const datePicker = ref(null);
    let v$ = useVuelidate();
    let tab = ref("behavior_record");
    let keyId = ref("");
    let accountId = ref("");
    let accountLabel = ref("");
    let logTypeValue = ref("");
    let searchedAccountOptions = ref([]);
    let startDate = ref("");
    let endDate = ref("");

    onMounted(async () => {
      const routeQuery = route.query;
      if (routeQuery.accountId) {
        accountId.value = routeQuery.accountId;
        await accountSearch(routeQuery.accountId);
        setSelectedAccount({ accountId: routeQuery.accountId });
      }
      if (routeQuery.logType) logTypeValue.value = Number(routeQuery.logType);
      if (routeQuery.logTypes) logTypeValue.value = Number(routeQuery.logTypes);
      if (routeQuery.startDate && routeQuery.endDate) {
        startDate.value = routeQuery.startDate;
        endDate.value = routeQuery.endDate;
        datePicker.value.dateValue = [routeQuery.startDate, routeQuery.endDate];
      }
      if (routeQuery.keyId) {
        keyId.value = routeQuery.keyId;
        tab.value = "history_record";
      } else {
        tab.value = "behavior_record";
      }
    });

    // 搜尋使用者 AC
    const accountSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const responseData = await getAccountSearch({
          keyword
        });
        searchedAccountOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.logonId}(${item.name}/${item.accountId})`
          };
        });
      }
    };

    // 選取人員
    const setSelectedAccount = data => {
      accountId.value = searchedAccountOptions.value.find(
        option => option.accountId === data.accountId
      ).accountId;
      accountLabel.value = searchedAccountOptions.value.find(
        option => option.accountId === data.accountId
      ).label;
    };

    // 切換 tab
    const handleChangeTab = type => {
      const logTypeValueValidation = v$.value.logTypeValue;
      const keyIdValidation = v$.value.keyId;
      logTypeValueValidation.$reset();
      keyIdValidation.$reset();
      tab.value = type;
      if (type === "behavior_record") {
        keyId.value = "";
        logTypeValue.value = "";
      } else {
        startDate.value = "";
        endDate.value = "";
        accountId.value = "";
        accountLabel.value = "";
        searchedAccountOptions.value = [];
        logTypeValue.value = "";
      }
    };

    // 查詢
    const handleSerach = () => {
      if (tab.value === "history_record") {
        const logTypeValueValidation = v$.value.logTypeValue;
        const keyIdValidation = v$.value.keyId;
        logTypeValueValidation.$touch();
        keyIdValidation.$touch();
        if (logTypeValueValidation.$error || keyIdValidation.$error) return;
      }

      const searchLogQuery = {
        keyId: keyId.value,
        accountId: accountId.value,
        logTypes: logTypeValue.value,
        logType: logTypeValue.value,
        startDate: startDate.value,
        endDate: endDate.value
      };

      if (!keyId.value) delete searchLogQuery.keyId;
      if (!accountId.value) delete searchLogQuery.accountId;
      if (!startDate.value) delete searchLogQuery.startDate;
      if (!endDate.value) delete searchLogQuery.endDate;
      if (!logTypeValue.value && logTypeValue.value !== 0) {
        delete searchLogQuery.logTypes;
        delete searchLogQuery.logType;
      }
      if (
        (logTypeValue.value || logTypeValue.value === 0) &&
        tab.value === "behavior_record"
      )
        delete searchLogQuery.logType;
      if (
        (logTypeValue.value || logTypeValue.value === 0) &&
        tab.value === "history_record"
      )
        delete searchLogQuery.logTypes;

      router.push({ query: searchLogQuery }).catch(() => {});
    };

    // 清除
    const handleClearSearch = () => {
      v$.value.logTypeValue.$reset();
      v$.value.keyId.$reset();
      accountId.value = "";
      keyId.value = "";
      accountLabel.value = "";
      logTypeValue.value = "";
      searchedAccountOptions.value = [];
      startDate.value = "";
      endDate.value = "";
      if (tab.value === "behavior_record") datePicker.value.dateValue = [];
    };

    // 取得時間
    const getTime = time => {
      startDate.value = time.searchTimeStart;
      endDate.value = time.searchTimeEnd;
    };

    // 清除分類為選取錯誤訊息
    const accountFocus = () => {
      v$.value.logTypeValue.$reset();
    };

    // 清除時間
    const clearTime = () => {
      startDate.value = "";
      endDate.value = "";
      datePicker.value.dateValue = [];
    };

    return {
      v$,
      logTypes,
      tab,
      keyId,
      accountId,
      accountLabel,
      logTypeValue,
      searchedAccountOptions,
      startDate,
      endDate,
      datePicker,
      accountSearch,
      setSelectedAccount,
      handleChangeTab,
      handleSerach,
      handleClearSearch,
      getTime,
      accountFocus,
      clearTime
    };
  },
  validations: {
    logTypeValue: { required },
    keyId: { required }
  }
});
</script>

<style lang="scss" scoped>
.search_user_log_block {
  .user_behavior_search {
    display: flex;
    font-size: 16px;
    color: #333;
    margin-top: 24px;

    .user_account {
      display: flex;
      align-items: baseline;
      white-space: nowrap;

      span {
        margin-right: 28px;
      }

      &:nth-child(2) {
        span {
          margin-left: 28px;
        }
      }

      :deep(.el-select) {
        width: 260px;
      }
    }

    :deep(.el-input) {
      input {
        height: 38px;
      }
    }
  }

  .user_behavior_time {
    margin-top: 24px;
    align-items: center;
    display: flex;

    span {
      margin-right: 28px;
    }

    :deep(.el-input__inner) {
      width: 400px;
    }
  }

  .search_button_block {
    text-align: center;
    margin-top: 24px;

    button {
      &:first-child {
        margin-right: 30px;
      }
    }
  }
}
</style>
