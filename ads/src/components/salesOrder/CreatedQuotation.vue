<template>
  <div>
    <!-- 公司別 -->
    <div class="account_block mb-4 mt-6">
      <div class="title mr-7">公司別</div>
      <div>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.account104"
            :value="1"
            type="radio"
            name="company_type"
          />
          <span class="ad-radio"></span>一零四資訊科技
        </label>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.account104"
            :value="4"
            type="radio"
            name="company_type"
          />
          <span class="ad-radio"></span>一零四管理顧問
        </label>
      </div>
    </div>

    <!-- 申請人、業務人員 -->
    <div class="applicant_block mb-6 pb-6">
      <div class="title mr-7">申請人</div>
      <div class="mr-7">
        <input
          v-model="getUserStatus.name"
          disabled
          widthType="154"
          type="text"
        />
      </div>
      <div class="title mr-7">業務人員</div>
      <div class="w-280">
        <SelectDropdown
          @value-changed="setSelectedSales($event)"
          :value="selectedSales"
          :options="searchedSalesOptions"
          :asncSearchCb="accountSearch"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          placeholder="請輸入業務人員"
        />
      </div>
    </div>

    <!-- 客戶 -->
    <div class="client_block mb-4">
      <div class="title">客戶</div>
      <div class="w-480">
        <SelectDropdown
          @value-changed="setSelectedClient($event)"
          class="input_field"
          :value="selectedClient"
          :options="searchedClientOptions"
          :asncSearchCb="clientSearch"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          placeholder="請輸入統編、代碼或公司名稱"
        />
      </div>
    </div>

    <!-- 案件名稱 -->
    <div class="case_name_block mb-4">
      <div class="title">案件名稱</div>
      <div>
        <input
          v-model="quotationData.name"
          type="text"
          widthType="480"
          placeholder="請輸入"
          :class="{ error_message_border: v$.name.$error }"
        />
        <div v-if="v$.name.$error" class="error_message">
          {{ v$.name.$errors[0].$message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "@/store/index.js";
import { useAccountStore } from "@/stores/account.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import useVuelidate from "@vuelidate/core";
import { maxLength, helpers } from "@vuelidate/validators";

export default {
  components: { SelectDropdown },
  setup() {
    const store = useStore();
    const accountStore = useAccountStore();
    const { getAccountSearch } = accountStore;
    const salesOrderStore = useSalesOrderStore();
    const quotationData = computed(() => salesOrderStore.quotationData);
    const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
    const selectedSales = ref("");
    const searchedSalesOptions = ref([]);
    const selectedClient = ref("");
    const searchedClientOptions = ref([]);
    const selectedClientId = ref("");
    const rules = {
      name: { maxLength: helpers.withMessage("字數超過上限", maxLength(50)) }
    };

    onMounted(() => {
      quotationData.value.applicantId = getUserStatus.value.accountId;
      quotationData.value.salesId = getUserStatus.value.accountId;
      selectedSales.value = `${getUserStatus.value.logonId}(${getUserStatus.value.name}/${getUserStatus.value.accountId})`;
    });

    // 選擇客戶
    const setSelectedClient = data => {
      selectedClient.value = searchedClientOptions.value.find(
        option => option.name === data.name
      ).label;
      selectedClientId.value = searchedClientOptions.value.find(
        option => option.name === data.name
      ).value;
      quotationData.value.customerId = data.value;
      quotationData.value.customerName = data.name.replace(/\([^\)]*\)/g, "");
    };

    // 客戶 AC
    const clientSearch = async keyword => {
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

    // 選擇業務人員
    const setSelectedSales = data => {
      selectedSales.value = searchedSalesOptions.value.find(
        option => option.name === data.name
      ).label;
      quotationData.value.salesId = data.accountId;
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

    return {
      v$: useVuelidate(rules, quotationData, { $autoDirty: true }),
      getUserStatus,
      setSelectedSales,
      selectedSales,
      searchedSalesOptions,
      selectedClient,
      searchedClientOptions,
      clientSearch,
      accountSearch,
      quotationData,
      setSelectedClient
    };
  }
};
</script>

<style lang="scss" scoped>
.account_block,
.applicant_block,
.client_block,
.case_name_block {
  display: flex;

  .title {
    font-weight: bold;
  }
}

.applicant_block,
.client_block {
  align-items: center;
}

.applicant_block {
  border-bottom: 1px solid #ddd;

  .w-280 {
    width: 280px;
  }
}

.client_block {
  .title {
    margin-right: 108px;
  }

  .w-480 {
    width: 480px;
  }
}

.case_name_block {
  align-items: baseline;

  .title {
    margin-right: 72px;
  }
}
</style>
