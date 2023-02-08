<template>
  <div>
    <!-- 客戶基本資料及授信資料上方表頭 -->
    <div class="cards">
      <OrderHeader
        v-for="(item, index) in creditData"
        :key="index"
        :data="item"
      />
    </div>

    <!-- 公司負責人 -->
    <div class="company_leader_block mb-4">
      <div class="title">公司負責人</div>
      <div>
        <input
          v-model="quotationData.companyLeader"
          :class="{ error_message_border: v$.companyLeader.$error }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.companyLeader.$error" class="error_message">
          {{ v$.companyLeader.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 公司電話、公司傳真 -->
    <div class="company_phone_block mb-4">
      <div class="title">公司電話<span class="necessary">*</span></div>
      <div class="mr-7">
        <input
          v-model="quotationData.companyPhone"
          :class="{ error_message_border: v$.companyPhone.$error }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.companyPhone.$error" class="error_message">
          {{ v$.companyPhone.$errors[0].$message }}
        </div>
      </div>
      <div class="title secondary">公司傳真</div>
      <div>
        <input
          v-model="quotationData.companyFax"
          :class="{ error_message_border: v$.companyFax.$error }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.companyFax.$error" class="error_message">
          {{ v$.companyFax.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 公司地址 -->
    <div class="company_address_block mb-4">
      <div class="title">公司地址<span class="necessary">*</span></div>
      <div>
        <input
          v-model="quotationData.companyAddress"
          :class="{ error_message_border: v$.companyAddress.$error }"
          type="text"
          widthType="480"
          placeholder="請輸入"
        />
        <div v-if="v$.companyAddress.$error" class="error_message">
          {{ v$.companyAddress.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 公司聯絡人 -->
    <div class="company_contact_block mb-4">
      <div class="title">公司聯絡人<span class="necessary">*</span></div>
      <div>
        <input
          v-model="quotationData.companyContact"
          :class="{ error_message_border: v$.companyContact.$error }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.companyContact.$error" class="error_message">
          {{ v$.companyContact.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 聯絡人職稱、聯絡人部門 -->
    <div class="company_contact_job_title_block mb-4">
      <div class="title">聯絡人職稱</div>
      <div class="mr-7">
        <input
          v-model="quotationData.companyContactJobTitle"
          :class="{ error_message_border: v$.companyContactJobTitle.$error }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.companyContactJobTitle.$error" class="error_message">
          {{ v$.companyContactJobTitle.$errors[0].$message }}
        </div>
      </div>
      <div class="title secondary">聯絡人部門</div>
      <div>
        <input
          v-model="quotationData.companyContactDepartment"
          :class="{
            error_message_border: v$.companyContactDepartment.$error
          }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.companyContactDepartment.$error" class="error_message">
          {{ v$.companyContactDepartment.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 聯絡人Email -->
    <div class="company_contact_email_block mb-4">
      <div class="title">聯絡人Email<span class="necessary">*</span></div>
      <div>
        <input
          v-model="quotationData.companyContactEmail"
          :class="{ error_message_border: v$.companyContactEmail.$error }"
          type="text"
          widthType="480"
          placeholder="請輸入"
        />
        <div v-if="v$.companyContactEmail.$error" class="error_message">
          {{ v$.companyContactEmail.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 選擇常用聯絡人 -->
    <div class="frequent_contacts">
      <span @click="openModal()" class="text-decoration-none mr-3">
        選擇常用聯絡人
      </span>
      <button
        @click.prevent="submitFrequentContacts"
        type="button"
        class="button_bg_white_medium"
        style="width: 168px"
      >
        儲存常用聯絡人資訊
      </button>
    </div>

    <Modal
      ref="contactDialog"
      @close="showContactDialog = false"
      :isShow="showContactDialog"
      title="常用聯絡人資訊"
      width="711"
    >
      <div slot="body">
        <FrequentContacts :closeContactDialog="closeContactDialog" />
      </div>
    </Modal>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, helpers, email } from "@vuelidate/validators";
import OrderHeader from "@/components/salesOrder/quoteContentComponent/OrderHeader.vue";
import Modal from "@/components/share/Modal.vue";
import FrequentContacts from "@/components/salesOrder/FrequentContacts.vue";

export default defineComponent({
  components: {
    Modal,
    OrderHeader,
    FrequentContacts
  },
  setup() {
    const salesOrderStore = useSalesOrderStore();
    const quotationData = computed(() => salesOrderStore.quotationData);
    const rules = computed(() => {
      if (salesOrderStore.quotationData.stage === 1) {
        return {
          companyLeader: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyPhone: {
            required: helpers.withMessage("請輸入此欄位", required),
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyFax: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyAddress: {
            required: helpers.withMessage("請輸入此欄位", required),
            maxLength: helpers.withMessage("字數超過上限", maxLength(100))
          },
          companyContact: {
            required: helpers.withMessage("請輸入此欄位", required),
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyContactEmail: {
            required: helpers.withMessage("請輸入此欄位", required),
            maxLength: helpers.withMessage("字數超過上限", maxLength(100)),
            email: helpers.withMessage("格式不正確", email)
          },
          companyContactJobTitle: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyContactDepartment: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          }
        };
      } else {
        return {
          companyLeader: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyPhone: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyFax: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyAddress: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(100))
          },
          companyContact: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyContactEmail: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(100)),
            email: helpers.withMessage("格式不正確", email)
          },
          companyContactJobTitle: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          },
          companyContactDepartment: {
            maxLength: helpers.withMessage("字數超過上限", maxLength(20))
          }
        };
      }
    });
    const v$ = useVuelidate(rules, quotationData, {
      $autoDirty: true
    });

    const creditData = ref([
      {
        title: "統一編號",
        content: quotationData.value.invoice
      },
      {
        title: "發票金額",
        content: Number(
          quotationData.value.totalPriceIncludeTax
        ).toLocaleString()
      },
      {
        title: "可使用額度/總信用額度上限",
        content: `${Number(
          quotationData.value.customerCredit.salesNum
        ).toLocaleString()}/${Number(
          quotationData.value.customerCredit.salesPoint
        ).toLocaleString()}`,
        greyBackground: true
      },
      {
        title: "客戶90天以上未AR",
        content: quotationData.value.customerCredit.ar90,
        greyBackground: true
      }
    ]);
    const contactDialog = ref(null);
    const showContactDialog = ref(false);

    const openModal = () => {
      showContactDialog.value = true;
      contactDialog.value.openModal();
    };

    // 儲存常用聯絡人資訊
    const submitFrequentContacts = () => {
      v$.value.$touch();
      if (v$.value.$error) return;
      salesOrderStore.createContact();
    };

    // 取得授信資料
    salesOrderStore.getCustomerCredit({
      customerId: quotationData.value.customerId
    });

    return {
      v$,
      quotationData,
      creditData,
      contactDialog,
      showContactDialog,
      submitFrequentContacts,
      openModal
    };
  },
  methods: {
    // 關閉選擇常用聯絡人
    closeContactDialog() {
      this.$refs.contactDialog.close();
    }
  }
});
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  justify-content: space-between;
}

.company_leader_block,
.company_phone_block,
.company_address_block,
.company_contact_block,
.company_contact_job_title_block,
.company_contact_email_block {
  display: flex;
  align-items: center;

  .title {
    max-width: 185px;
    flex-grow: 1;
    font-weight: bold;

    &.secondary {
      max-width: 115px;
    }
  }
}

.frequent_contacts {
  text-align: right;

  span {
    cursor: pointer;
    color: #1654b9;
    font-size: 14px;
  }

  button {
    letter-spacing: 1.43px;
  }
}
</style>
