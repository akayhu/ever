<template>
  <div>
    <!-- 發票抬頭 -->
    <div class="invoice_title_block mb-4">
      <div class="title">發票抬頭</div>
      <div>
        <input
          v-model="quotationData.invoiceTitle"
          type="text"
          widthType="480"
          placeholder="請輸入"
        />
      </div>
    </div>

    <!-- 是否列印抬頭 -->
    <div class="invoice_print_title_block mb-4">
      <div class="title">是否列印抬頭</div>
      <div>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.invoicePrintTitle"
            :value="1"
            type="radio"
            name="invoice_title"
          />
          <span class="ad-radio"></span>是
        </label>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.invoicePrintTitle"
            :value="0"
            type="radio"
            name="invoice_title"
          />
          <span class="ad-radio"></span>否
        </label>
      </div>
    </div>

    <!-- 是否立即開整張發票 -->
    <div class="invoice_immediate_block mb-4">
      <div class="title">是否立即開整張發票</div>
      <div>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.invoiceImmediate"
            :value="1"
            type="radio"
            name="invoice_immediately"
          />
          <span class="ad-radio"></span>是
        </label>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.invoiceImmediate"
            :value="0"
            type="radio"
            name="invoice_immediately"
          />
          <span class="ad-radio"></span>否
        </label>
      </div>
    </div>

    <!-- 發票開立資訊 定期開立 -->
    <div class="invoice_send_block mb-4">
      <div class="title">發票開立資訊</div>
      <div>
        <label class="ad-radio-label mr-7">
          <input
            v-model="whetherInvoiceImmediate"
            :value="1"
            type="radio"
            name="invoiceInfo"
            @change="changeInvoice"
          />
          <span class="ad-radio"></span>單期開立
        </label>
        <el-date-picker
          v-model="quotationData.invoiceSendDate"
          @change="changeInvoiceSendDate"
          type="month"
          placeholder="選擇年/月"
          format="yyyy/MM"
          value-format="yyyy/MM"
          class="invoice_month"
        >
        </el-date-picker>
      </div>
    </div>

    <!-- 發票開立資訊 分期開立 -->
    <div class="invoice_send_note_block mb-4">
      <div class="title"></div>
      <div>
        <label class="ad-radio-label mr-7">
          <input
            v-model="whetherInvoiceImmediate"
            @change="changeInvoice"
            :value="2"
            type="radio"
            name="invoiceInfo"
          />
          <span class="ad-radio"></span>分期開立
        </label>
        <div class="period w-480">
          <el-input
            v-model="quotationData.invoiceSendNote"
            @input="changeInvoiceSendNote"
            :autosize="{ minRows: 3 }"
            type="textarea"
            class="input_field"
            placeholder="請輸入"
            maxlength="100"
            show-word-limit
          />
        </div>
      </div>
    </div>

    <!-- 客戶付款條件、付款方式 -->
    <div class="payment_terms_block mb-4">
      <div class="title">客戶付款條件<span class="necessary">*</span></div>
      <div class="mr-7 w-220">
        <el-select v-model="quotationData.paymentTerms" placeholder="請選擇">
          <el-option
            v-for="item in payConditionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="title">付款方式<span class="necessary">*</span></div>
      <div>
        <el-select v-model="quotationData.paymentMethod" placeholder="請選擇">
          <el-option
            v-for="item in paymentMethodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 客戶價格組、發票聯式 -->
    <div class="payment_price_type_block mb-4">
      <div class="title">客戶價格組<span class="necessary">*</span></div>
      <div class="mr-7 w-220">
        <el-select
          v-model="quotationData.paymentPriceType"
          placeholder="請選擇"
        >
          <el-option
            v-for="item in paymentPriceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="title">發票聯式<span class="necessary">*</span></div>
      <div>
        <el-select
          v-model="quotationData.invoicePaperType"
          placeholder="請選擇"
        >
          <el-option
            v-for="item in invoicePaperTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 稅率、發票處理方式 -->
    <div class="payment_tax_rate_block mb-4">
      <div class="title">稅率<span class="necessary">*</span></div>
      <div class="mr-7 w-220">
        <el-select
          v-model="quotationData.paymentTaxRate"
          placeholder="請選擇"
          @change="salesOrderStore.getCalPrice"
        >
          <el-option
            v-for="item in paymentTaxRateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="title">發票處理方式</div>
      <div>
        <el-select v-model="quotationData.invoiceDeliver" placeholder="請選擇">
          <el-option
            v-for="item in invoiceDeliverOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 電子發票收件人 -->
    <div class="invoice_recipient_name_block mb-4">
      <div class="title">電子發票收件人<span class="necessary">*</span></div>
      <div>
        <input
          v-model="quotationData.invoiceRecipientName"
          :class="{ error_message_border: v$.invoiceRecipientName.$error }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.invoiceRecipientName.$error" class="error_message">
          {{ v$.invoiceRecipientName.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 電子發票收件人信箱 -->
    <div class="invoice_recipient_email_block mb-4">
      <div class="title">
        電子發票收件人信箱<span class="necessary">*</span>
      </div>
      <div>
        <input
          v-model="quotationData.invoiceRecipientEmail"
          :class="{ error_message_border: v$.invoiceRecipientEmail.$error }"
          type="text"
          widthType="480"
          placeholder="請輸入"
        />
        <div v-if="v$.invoiceRecipientEmail.$error" class="error_message">
          {{ v$.invoiceRecipientEmail.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 是否需紙本發票 -->
    <div class="invoice_type_block mb-4">
      <div class="title">是否需紙本發票<span class="necessary">*</span></div>
      <div>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.invoiceType"
            :value="0"
            type="radio"
            name="company"
          />
          <span class="ad-radio"></span>是
        </label>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.invoiceType"
            :value="1"
            type="radio"
            name="company"
          />
          <span class="ad-radio"></span>否
        </label>
      </div>
    </div>

    <!-- 發票收件人 -->
    <div class="invoice_paper_recipient_name_block mb-4">
      <div class="title">發票收件人<span class="necessary">*</span></div>
      <div>
        <input
          v-model="quotationData.invoicePaperRecipientName"
          :class="{ error_message_border: v$.invoicePaperRecipientName.$error }"
          type="text"
          widthType="220"
          placeholder="請輸入"
        />
        <div v-if="v$.invoicePaperRecipientName.$error" class="error_message">
          {{ v$.invoicePaperRecipientName.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 發票寄送地址 -->
    <div class="invoice_paper_recipient_address_block mb-4">
      <div class="title">發票寄送地址<span class="necessary">*</span></div>
      <div>
        <input
          v-model="quotationData.invoicePaperRecipientAddress"
          :class="{
            error_message_border: v$.invoicePaperRecipientAddress.$error
          }"
          type="text"
          widthType="480"
          placeholder="請輸入"
        />
        <div
          v-if="v$.invoicePaperRecipientAddress.$error"
          class="error_message"
        >
          {{ v$.invoicePaperRecipientAddress.$errors[0].$message }}
        </div>
      </div>
    </div>

    <!-- 內部輸單備註 -->
    <div class="invoice_note_block pt-6">
      <div class="title">內部輸單備註</div>
      <div class="w-712">
        <el-input
          v-model="quotationData.invoiceNote"
          :autosize="{ minRows: 4 }"
          type="textarea"
          class="input_field"
          placeholder="請輸入"
          maxlength="1500"
          show-word-limit
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, toRefs, computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, helpers, email } from "@vuelidate/validators";

export default defineComponent({
  setup() {
    const salesOrderStore = useSalesOrderStore();
    const { quotationData } = toRefs(salesOrderStore);
    let whetherInvoiceImmediate = ref(1);
    let payConditionOptions = ref([
      {
        label: "發票開立後，月結30天",
        value: 1
      },
      {
        label: "發票開立後，月結45天",
        value: 2
      },
      {
        label: "發票開立後，月結60天",
        value: 3
      },
      {
        label: "發票開立後，月結90天",
        value: 4
      },
      {
        label: "發票開立後，月結120天",
        value: 5
      },
      {
        label: "預收款",
        value: 6
      }
    ]);
    let paymentMethodOptions = ref([
      {
        label: "電匯",
        value: 1
      },
      {
        label: "支票",
        value: 2
      },
      {
        label: "信用卡",
        value: 3
      }
    ]);
    let paymentPriceTypeOptions = ref([
      {
        label: "新客",
        value: 1
      },
      {
        label: "舊客",
        value: 2
      },
      {
        label: "標準客戶",
        value: 3
      }
    ]);
    let invoicePaperTypeOptions = ref([
      {
        label: "二聯式",
        value: 2
      },
      {
        label: "三聯式",
        value: 3
      }
    ]);
    let paymentTaxRateOptions = ref([
      {
        label: "0%",
        value: 0
      },
      {
        label: "5%",
        value: 0.05
      }
    ]);
    let invoiceDeliverOptions = ref([
      {
        label: "上傳金財通",
        value: 5
      }
    ]);

    const rules = computed(() => {
      let ruleObj = {
        invoiceRecipientName: {
          maxLength: helpers.withMessage("字數超過上限", maxLength(20))
        },
        invoiceRecipientEmail: {
          maxLength: helpers.withMessage("字數超過上限", maxLength(100)),
          email: helpers.withMessage("格式不正確", email)
        },
        invoicePaperRecipientName: {
          maxLength: helpers.withMessage("字數超過上限", maxLength(20))
        },
        invoicePaperRecipientAddress: {
          maxLength: helpers.withMessage("字數超過上限", maxLength(100))
        }
      };
      if (salesOrderStore.quotationData.stage === 1) {
        ruleObj.invoiceRecipientName.required = helpers.withMessage(
          "請輸入此欄位",
          required
        );
        ruleObj.invoiceRecipientEmail.required = helpers.withMessage(
          "請輸入此欄位",
          required
        );
        ruleObj.invoicePaperRecipientName.required = helpers.withMessage(
          "請輸入此欄位",
          required
        );
        ruleObj.invoicePaperRecipientAddress.required = helpers.withMessage(
          "請輸入此欄位",
          required
        );
      }
      return ruleObj;
    });
    const v$ = useVuelidate(rules, quotationData, {
      $autoDirty: true
    });

    onMounted(() => {
      quotationData.value.invoiceTitle =
        quotationData.value.invoiceTitle || quotationData.value.customerName;
      quotationData.value.invoiceSendNote
        ? (whetherInvoiceImmediate.value = 2)
        : (whetherInvoiceImmediate.value = 1);
    });

    // 發票開立資訊 radio 選擇
    const changeInvoice = val => {
      val.target.value === "1"
        ? (quotationData.value.invoiceSendNote = null)
        : (quotationData.value.invoiceSendDate = null);
    };

    // 選擇定期開立日期
    const changeInvoiceSendDate = () => {
      whetherInvoiceImmediate.value = 1;
      quotationData.value.invoiceSendNote = null;
    };

    // 分期開立備註
    const changeInvoiceSendNote = () => {
      whetherInvoiceImmediate.value = 2;
      quotationData.value.invoiceSendDate = null;
    };

    watch(quotationData, newValue => {
      newValue.invoiceSendNote
        ? (whetherInvoiceImmediate.value = 2)
        : (whetherInvoiceImmediate.value = 1);
    });

    return {
      salesOrderStore,
      quotationData,
      whetherInvoiceImmediate,
      payConditionOptions,
      paymentMethodOptions,
      paymentPriceTypeOptions,
      invoicePaperTypeOptions,
      paymentTaxRateOptions,
      invoiceDeliverOptions,
      v$,
      changeInvoice,
      changeInvoiceSendDate,
      changeInvoiceSendNote
    };
  }
});
</script>

<style lang="scss" scoped>
.invoice_title_block,
.invoice_print_title_block,
.invoice_immediate_block,
.invoice_send_block,
.invoice_send_note_block,
.payment_terms_block,
.payment_price_type_block,
.payment_tax_rate_block,
.invoice_recipient_name_block,
.invoice_recipient_email_block,
.invoice_type_block,
.invoice_paper_recipient_name_block,
.invoice_paper_recipient_address_block {
  display: flex;
  align-items: center;

  .title {
    max-width: 185px;
    flex-grow: 1;
    font-weight: bold;
  }
}
.invoice_send_note_block {
  > div {
    &:nth-child(2) {
      display: flex;
    }
  }

  .w-480 {
    width: 480px;
  }
}

.invoice_note_block {
  border-top: 1px solid #e2e1e1;
  display: flex;

  .title {
    margin-right: 28px;
    font-weight: bold;
  }

  .w-712 {
    width: 712px;
  }
}

.w-220 {
  width: 220px;
}

.input_field {
  width: 100%;

  ::v-deep textarea {
    background-color: #f3f3f3;
    border: 1px solid #ddd;
    font-size: 16px;
  }

  ::v-deep .el-input__count {
    color: #7e7e7e !important;
    background-color: #f3f3f3 !important;
  }
}
</style>
