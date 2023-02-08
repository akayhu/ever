<template>
  <div>
    <!-- 報價單上方訂單未成立表頭 -->
    <div v-if="cardHeaderView === 'orderHeader'" class="cards">
      <OrderHeader v-for="(item, index) in cardsData" :key="index" :data="item">
        <div v-if="item.other">
          <div class="d-flex align-items-center">
            <icon iconName="eye-show" class="mr-1"></icon>
            <span
              v-if="quotationData.quotationAttachmentContractList?.length > 0"
            >
              <a
                :href="
                  `${apiURL}api/quotation/attachment/${quotationData.quotationAttachmentContractList[0].id}/quotation/${quotationData.id}/download`
                "
                class="imgName"
                v-tooltip="{
                  content: `${quotationData.quotationAttachmentContractList[0].fileName}`,
                  offset: 5,
                  placement: 'right',
                  trigger: 'hover'
                }"
                >檢視用印合約
              </a>
            </span>
            <span
              v-if="
                quotationData.quotationAttachmentHandWrittenList?.length > 0
              "
            >
              <a
                :href="
                  `${apiURL}api/quotation/attachment/${quotationData.quotationAttachmentHandWrittenList[0].id}/quotation/${quotationData.id}/download`
                "
                class="imgName"
                v-tooltip="{
                  content: `${quotationData.quotationAttachmentHandWrittenList[0].fileName}`,
                  offset: 5,
                  placement: 'right',
                  trigger: 'hover'
                }"
                >檢視未用印(手簽版)合約
              </a>
            </span>
          </div>
        </div>
      </OrderHeader>
    </div>

    <!-- 報價單上方訂單成立表頭 -->
    <EstablishedHeader v-if="cardHeaderView === 'establishedHeader'" />

    <!-- 公司別、申請人 -->
    <div class="basic_info">
      <div class="data_row">
        <div class="data_col">
          <label class="label_field">公司別</label>
        </div>
        <div class="data_col">
          <label class="ad-radio-label">
            <input
              :disabled="true"
              type="radio"
              name="company_type"
              :value="1"
              v-model="quotationData.account104"
            />
            <span class="ad-radio"></span>一零四資訊科技
          </label>
          <label class="ad-radio-label">
            <input
              :disabled="true"
              type="radio"
              name="company_type"
              :value="4"
              v-model="quotationData.account104"
            />
            <span class="ad-radio"></span>一零四管理顧問
          </label>
        </div>
      </div>
      <div class="data_row">
        <div class="data_col">
          <label class="label_field">申請人</label>
        </div>
        <div class="data_col">
          <label class="label_viewer">{{
            quotationData.applicantInfo.name
          }}</label>
        </div>
        <div class="data_col">
          <label class="label_field">業務人員</label>
        </div>
        <div class="data_col">
          <label class="label_viewer">
            {{
              `${quotationData.salesInfo.logonId}(${quotationData.salesInfo.name}/${quotationData.salesInfo.accountId})`
            }}
          </label>
        </div>
      </div>
    </div>

    <!-- 客戶、合約備註 -->
    <div class="basic_content">
      <div class="data_row">
        <div class="data_col">
          <label class="label_field">BU</label>
        </div>
        <div class="data_col w480 mr-3">
          <label class="label_viewer">{{ buMap[quotationData.bu] }}</label>
        </div>
      </div>
      <div class="data_row">
        <div class="data_col">
          <label class="label_field">客戶</label>
        </div>
        <div class="data_col w480 mr-3">
          <label class="label_viewer">{{
            `${quotationData.customerName}(${quotationData.customerId})`
          }}</label>
        </div>
      </div>
      <div class="data_row">
        <div class="data_col">
          <label class="label_field">案件名稱</label>
        </div>
        <div class="data_col w480">
          <label class="label_viewer">{{ quotationData.name }}</label>
        </div>
      </div>
      <div class="data_row">
        <div class="data_col">
          <label
            class="align-self-start label_field"
            :class="{ signOffView: signOffView }"
          >
            主管報價說明
          </label>
        </div>
        <div class="data_col w680">
          <p
            class="multiple_line quote_description"
            :class="{ multiple_line_open: openQuoteDescriptionBlock }"
          >
            {{ quotationData.note4Internal }}
          </p>
          <div v-if="showQuoteDescriptionMore" class="remark_viewer">
            <input
              id="checkbox_quote_remark"
              class="remark_viewer_toggle"
              type="checkbox"
            />
            <label
              @click="handleOpenQuoteDescription"
              for="checkbox_quote_remark"
              class="label_more"
            >
              更多內容
              <img src="@/assets/icon/icon-arrow-down.svg" />
            </label>
            <label
              @click="handleOpenQuoteDescription"
              for="checkbox_quote_remark"
              class="label_less"
            >
              收合內容
              <img src="@/assets/icon/icon-arrow-up.svg" />
            </label>
          </div>
        </div>
      </div>
      <div class="data_row">
        <div class="data_col">
          <label class="align-self-start label_field">
            合約說明/備註<br />(顯示於合約)
          </label>
        </div>
        <div class="data_col w680">
          <p
            class="multiple_line contract_description"
            :class="{ multiple_line_open: openContractDescriptionBlock }"
          >
            {{ quotationData.note }}
          </p>
          <div v-if="showContractDescriptionMore" class="remark_viewer">
            <input
              id="checkbox_contract_remark"
              class="remark_viewer_toggle"
              type="checkbox"
            />
            <label
              @click="handleOpenContractDescription"
              for="checkbox_contract_remark"
              class="label_more"
            >
              更多內容
              <img src="@/assets/icon/icon-arrow-down.svg" />
            </label>
            <label
              @click="handleOpenContractDescription"
              for="checkbox_contract_remark"
              class="label_less"
            >
              收合內容
              <img src="@/assets/icon/icon-arrow-up.svg" />
            </label>
          </div>
        </div>
      </div>
      <div class="data_row">
        <div class="data_col">
          <label class="label_field">附件(報價單)</label>
        </div>
        <div v-if="quotationData.quotationAttachmentQuotationList?.length > 0">
          <a
            :href="
              `${apiURL}api/quotation/attachment/${quotationData.quotationAttachmentQuotationList[0].id}/quotation/${quotationData.id}/download`
            "
            class="imgName"
          >
            {{ quotationData.quotationAttachmentQuotationList[0].fileName }}
          </a>
        </div>
      </div>
    </div>

    <!-- 客戶基本資料及授信資料、發票及付款資訊 -->
    <div>
      <div class="title mt-10">客戶基本資料及授信資料</div>
      <div class="divider_arrow"></div>
      <span
        class="d-flex justify-content-end"
        @click="showCustomerData = !showCustomerData"
      >
        <span style="cursor: pointer;">
          收合
          <img src="@/assets/icon/icon-arrow-up-border.svg" />
        </span>
      </span>

      <div v-show="showCustomerData">
        <div class="cards">
          <OrderHeader
            v-for="(item, index) in creditData"
            :key="index"
            :data="item"
          />
        </div>

        <div class="customer_info">
          <div class="data_row">
            <div class="data_col">
              <label class="label_field">公司負責人</label>
            </div>
            <div class="data_col w220">
              <label class="label_viewer">
                {{ quotationData.companyLeader }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">公司電話</label>
            </div>
            <div class="data_col w220">
              <label class="label_viewer">
                {{ quotationData.companyPhone }}
              </label>
            </div>
            <div class="data_col">
              <label class="label_field">公司傳真</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.companyFax }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">公司地址</label>
            </div>
            <div class="data_col w480">
              <label class="label_viewer">
                {{ quotationData.companyAddress }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">公司聯絡人</label>
            </div>
            <div class="data_col w220">
              <label class="label_viewer">
                {{ quotationData.companyContact }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">聯絡人職稱</label>
            </div>
            <div class="data_col w220">
              <label class="label_viewer">
                {{ quotationData.companyContactJobTitle }}
              </label>
            </div>
            <div class="data_col">
              <label class="label_field">聯絡人部門</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.companyContactDepartment }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">聯絡人Email</label>
            </div>
            <div class="data_col w480">
              <label class="label_viewer">
                {{ quotationData.companyContactEmail }}
              </label>
            </div>
          </div>
        </div>

        <div class="title mt-10">發票及付款資訊</div>
        <div class="divider_arrow"></div>
        <div class="invoice_info">
          <div class="data_row">
            <div class="data_col">
              <label class="label_field">發票抬頭</label>
            </div>
            <div class="data_col w480">
              <label class="label_viewer">
                {{ quotationData.invoiceTitle }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">是否列印抬頭</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.invoicePrintTitle === 1 ? "是" : "否" }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">是否立即開整張發票</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.invoiceImmediate === 1 ? "是" : "否" }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">發票開立資訊</label>
            </div>
            <div class="data_col d-flex w-700">
              <div class="label_viewer mr-7">
                {{ quotationData.invoiceSendDate ? "定期開立" : "分期開立" }}
              </div>
              <div class="w-600">
                {{
                  quotationData.invoiceSendDate
                    ? quotationData.invoiceSendDate
                    : quotationData.invoiceSendNote
                }}
              </div>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">客戶付款條件</label>
            </div>
            <div class="data_col w220">
              <label class="label_viewer">{{
                paymentTerms(quotationData.paymentTerms)
              }}</label>
            </div>
            <div class="data_col w122">
              <label class="label_field">付款方式</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">{{
                paymentMethod(quotationData.paymentMethod)
              }}</label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">客戶價格組</label>
            </div>
            <div class="data_col w220">
              <label class="label_viewer">{{
                paymentPrice(quotationData.paymentPriceType)
              }}</label>
            </div>
            <div class="data_col w122">
              <label class="label_field">發票聯式</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">{{
                invoicePaper(quotationData.invoicePaperType)
              }}</label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">稅率</label>
            </div>
            <div class="data_col w220">
              <label class="label_viewer">{{
                paymentTaxRate(quotationData.paymentTaxRate)
              }}</label>
            </div>
            <div class="data_col w122">
              <label class="label_field">發票處理方式</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">{{
                invoiceDeliver(quotationData.invoiceDeliver)
              }}</label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">電子發票收件人</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.invoiceRecipientName }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">電子發票收件人信箱</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.invoiceRecipientEmail }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">是否需紙本發票</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.invoiceType === 0 ? "是" : "否" }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">發票收件人</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.invoicePaperRecipientName }}
              </label>
            </div>
          </div>

          <div class="data_row">
            <div class="data_col">
              <label class="label_field">發票寄送地址</label>
            </div>
            <div class="data_col">
              <label class="label_viewer">
                {{ quotationData.invoicePaperRecipientAddress }}
              </label>
            </div>
          </div>

          <div class="internal_order_remarks">
            <div :class="{ signOffView: signOffView }" class="mr-6">
              內部輸單備註
            </div>
            <div class="internal_order_textarea">
              {{ quotationData.invoiceNote || "- -" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "@/store/index.js";
import { useRoute } from "@/router/useRouter.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import OrderHeader from "@/components/salesOrder/quoteContentComponent/OrderHeader.vue";
import EstablishedHeader from "@/components/salesOrder/quoteContentComponent/EstablishedHeader.vue";

export default {
  components: {
    OrderHeader,
    EstablishedHeader
  },
  setup() {
    const store = useStore();
    const { route } = useRoute();
    const salesOrderStore = useSalesOrderStore();
    const { statusLabel, canEditNew } = useFormStatus();
    const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
    const quotationData = computed(() => salesOrderStore.quotationData);
    const cardHeaderView = computed(
      () => canEditNew(quotationData.value).cardHeaderView
    );
    const showCustomerData = ref(true);
    const signOffView = ref(false);
    const showQuoteDescriptionMore = ref(false);
    const openQuoteDescriptionBlock = ref(false);
    const showContractDescriptionMore = ref(false);
    const openContractDescriptionBlock = ref(false);
    const cardsData = computed(() => [
      {
        title: "訂單編號",
        content: quotationData.value.id
      },
      {
        title: "狀態",
        content: statusLabel.value,
        other:
          quotationData.value.quotationAttachmentHandWrittenList?.length > 0 ||
          quotationData.value.quotationAttachmentContractList?.length > 0
      },
      {
        title: "申請日期",
        content: quotationData.value.quotationApplyDate
      },
      {
        title: "有效日期",
        content: quotationData.value.quotationExpiryDate
      }
    ]);
    const creditData = computed(() => [
      {
        title: "統一編號",
        content: salesOrderStore.quotationData.invoice
      },
      {
        title: "發票金額",
        content: Number(
          salesOrderStore.quotationData.totalPriceIncludeTax
        ).toLocaleString()
      },
      {
        title: "可使用額度/總信用額度上限",
        content: `${Number(
          salesOrderStore.quotationData.customerCredit.salesNum
        ).toLocaleString()}/${Number(
          salesOrderStore.quotationData.customerCredit.salesPoint
        ).toLocaleString()}`,
        credit: true
      },
      {
        title: "客戶90天以上未AR",
        content: salesOrderStore.quotationData.customerCredit.ar90,
        credit: true
      }
    ]);
    const apiURL = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
    const buMap = { 103: "整招招募服務", 112: "整合招募服務(教育)" };

    // 付款條件
    const paymentTerms = type => {
      const paymentTermsType = {
        "1": "發票開立後，月結30天",
        "2": "發票開立後，月結45天",
        "3": "發票開立後，月結60天",
        "4": "發票開立後，月結90天",
        "5": "發票開立後，月結120天",
        "6": "預收款"
      };
      return paymentTermsType[type];
    };

    // 付款方式
    const paymentMethod = type => {
      const paymentMethodType = {
        "1": "電匯",
        "2": "支票",
        "3": "信用卡"
      };
      return paymentMethodType[type];
    };

    // 客戶價格組
    const paymentPrice = type => {
      const paymentPriceType = {
        "1": "新客",
        "2": "舊客",
        "3": "標準客戶"
      };
      return paymentPriceType[type];
    };

    // 發票聯式
    const invoicePaper = type => {
      const invoicePaperType = {
        "2": "二聯",
        "3": "三聯"
      };
      return invoicePaperType[type];
    };

    // 稅率
    const paymentTaxRate = type => {
      const paymentTaxRateType = {
        "0": "0%",
        "0.05": "5%"
      };
      return paymentTaxRateType[type];
    };

    // 發票處理方式
    const invoiceDeliver = type => {
      const invoiceDeliverType = {
        "1": "掛號",
        "2": "交給業務",
        "3": "平信",
        "4": "開給104",
        "5": "上傳金財通"
      };
      return invoiceDeliverType[type];
    };

    onMounted(() => {
      const quote_description = document.querySelector(".quote_description");
      const contract_description = document.querySelector(
        ".contract_description"
      );
      if (route.name === "SignOffViewSalesOrder") signOffView.value = true;
      if (quote_description.offsetHeight >= 66)
        showQuoteDescriptionMore.value = true;
      if (contract_description.offsetHeight >= 66)
        showContractDescriptionMore.value = true;

      // 取得授信資料
      salesOrderStore.getCustomerCredit({
        customerId: quotationData.value.customerId
      });
    });

    const handleOpenQuoteDescription = () => {
      openQuoteDescriptionBlock.value = !openQuoteDescriptionBlock.value;
    };

    const handleOpenContractDescription = () => {
      openContractDescriptionBlock.value = !openContractDescriptionBlock.value;
    };

    return {
      getUserStatus,
      showCustomerData,
      signOffView,
      cardsData,
      creditData,
      buMap,
      showQuoteDescriptionMore,
      openQuoteDescriptionBlock,
      handleOpenQuoteDescription,
      showContractDescriptionMore,
      openContractDescriptionBlock,
      handleOpenContractDescription,
      quotationData,
      paymentTerms,
      paymentMethod,
      paymentPrice,
      invoicePaper,
      paymentTaxRate,
      invoiceDeliver,
      apiURL,
      cardHeaderView
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/views/orderManage/create";

.basic_info {
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 24px;

  .data_col {
    margin-right: 28px;
  }
  .data_row {
    margin-bottom: 16px;

    &:nth-child(1) {
      .data_col {
        &:nth-child(1) {
          width: 53px;
        }
      }
    }

    &:nth-child(2) {
      .data_col {
        &:nth-child(1) {
          width: 53px;
        }
        &:nth-child(2) {
          width: 154px;
        }
        &:nth-child(3) {
          width: 70px;
        }
        &:nth-child(4) {
          width: 280px;
        }
      }
    }
  }
}

.title {
  font-size: 20px;
  font-weight: bold;
  line-height: 1.4;
  letter-spacing: 1.4px;
  color: #292929;
  padding-bottom: 16px;
}

.basic_content {
  .data_row {
    margin-bottom: 16px;

    .data_col {
      display: initial;
    }

    .data_col:nth-child(1) {
      width: 113px;
      margin-right: 28px;
    }
  }
}

.invoice_info {
  .data_row {
    align-items: flex-start;
  }
}

.customer_info,
.invoice_info {
  .data_row {
    margin-bottom: 16px;

    .w-600 {
      width: 600px;
      color: #7e7e7e;
      font-weight: bold;
    }

    .w-700 {
      width: 700px;
      margin-right: 0;
    }
  }

  .data_col {
    margin-right: 28px;
    max-width: 650px;
    word-break: break-word;

    &:nth-child(1) {
      width: 157px;
    }
  }
}

.divider_arrow {
  position: relative;
  margin-bottom: 22px;
  height: 1px;
  background-color: #d6d6d6;

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    top: -7px;
    left: calc(50%);
    width: 14px;
    height: 14px;
    transform: rotate(45deg);
    background-color: #fff;
    border-bottom: 1px solid #d6d6d6;
    border-right: 1px solid #d6d6d6;
  }
}

.common_contact {
  .contact {
    padding: 25px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;

    .label_field {
      width: 172px;
      margin-right: 28px;
    }

    &:hover {
      background-color: #e6f9fa;
    }
  }
}

.signOffView {
  color: #ea475b;
}

.internal_order_remarks {
  display: flex;
  border-top: 1px solid #e2e1e1;
  padding-top: 24px;

  div {
    &:nth-child(1) {
      font-weight: bold;
    }
    &.internal_order_textarea {
      color: #7e7e7e;
      font-weight: bold;
      font-size: 16px;
      line-height: 1.38;
      letter-spacing: 1.38px;
    }
  }
}
</style>
