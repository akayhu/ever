<template>
  <section class="section_container">
    <div class="d-flex justify-content-between">
      <h2 class="mb-6" id="basic_title">內服單基本資料</h2>
    </div>

    <div v-if="!isDraftForm" class="cards">
      <!-- 內服單上方表頭 -->
      <OrderHeader
        v-for="(item, index) in cardsData"
        :key="index"
        :data="item"
      />
    </div>

    <div class="top_info">
      <div class="data_row mb-4">
        <div class="data_col">
          <label class="label_field">類型</label>
        </div>
        <div class="data_col w480">
          <template v-if="canEdit">
            <SelectDropdown
              :options="typeOptions"
              :value="selectedType"
              :optionsAllData="false"
              placeholder="請選擇"
              @value-changed="changeOrderType"
            />
          </template>
          <div v-else class="view_status">
            內部行銷使用(含內部計價)
          </div>
        </div>
      </div>
      <div class="data_row">
        <div class="data_col"><label class="label_field">負責人員</label></div>
        <div class="data_col w280">
          <template v-if="canEdit">
            <SelectDropdown
              @value-changed="setSelectedSales($event)"
              :value="selectedSales"
              :options="searchedSalesOptions"
              :asncSearchCb="accountSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              placeholder="請輸入負責人員"
            />
          </template>
          <div v-else class="view_status">
            {{
              `${quotationData.salesInfo.logonId}(${quotationData.salesInfo.name}/${quotationData.salesInfo.accountId})`
            }}
          </div>
        </div>
        <div class="data_col"><label class="label_field">BU名稱</label></div>
        <div class="data_col w220">
          <div v-if="canEdit">
            <SelectDropdown
              v-if="canEdit"
              :options="buOptions"
              :value="selectedBu"
              :optionsAllData="false"
              placeholder="請選擇"
              @value-changed="changeBU"
            />
          </div>
          <div v-else class="view_status">{{ selectedBu }}</div>
        </div>
      </div>
    </div>

    <div class="bottom_info">
      <div class="data_row mb-3">
        <div class="data_col"><label class="label_field">客戶</label></div>
        <div class="data_col w480">
          <template v-if="canEdit">
            <SelectDropdown
              :value="selectedCompany"
              :options="searchedCompanyOptions"
              placeholder="請輸入統編、代碼或公司名稱"
              :asncSearchCb="companySuggestSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              :disabled="!isDraftForm"
              :class="{ error_message_border: v$.customerId.$error }"
              @value-changed="changeCustomer($event)"
            />
            <div v-if="v$.customerId.$error" class="error_message">
              請輸入統編、代碼或公司名稱
            </div>
          </template>
          <div v-else class="view_status">
            {{ `${quotationData.customerName}(${quotationData.customerId})` }}
          </div>
        </div>
      </div>
      <div class="data_row mb-4">
        <div class="data_col">
          <label class="label_field">案件名稱</label>
        </div>
        <div class="data_col w480">
          <template v-if="canEdit">
            <input
              type="text"
              class="input_field"
              placeholder="請輸入"
              maxlength="50"
              v-model="quotationData.name"
              :class="{ error_message_border: v$.name.$error }"
            />
            <div v-if="v$.name.$error" class="error_message">
              請輸入案件名稱
            </div>
          </template>
          <div v-else class="view_status">{{ quotationData.name }}</div>
        </div>
      </div>
      <div class="data_row mb-4">
        <div class="data_col">
          <label class="align-self-start label_field">備註</label>
        </div>
        <div class="data_col w680">
          <el-input
            v-if="canEdit"
            class="input_field"
            type="textarea"
            placeholder="請輸入"
            v-model="quotationData.note"
            maxlength="400"
            :autosize="{ minRows: 6 }"
            show-word-limit
          />
          <div v-else class="remark_viewer">
            <input
              id="checkbox_quote_remark"
              class="remark_viewer_toggle"
              type="checkbox"
            />
            <p class="multiple_line">{{ quotationData.note }}</p>
            <label for="checkbox_quote_remark" class="label_more"
              >更多內容<img src="@/assets/icon/icon-arrow-down.svg"
            /></label>
            <label for="checkbox_quote_remark" class="label_less"
              >收合內容<img src="@/assets/icon/icon-arrow-up.svg"
            /></label>
          </div>
        </div>
      </div>
      <div v-if="!isDraftForm" class="data_row align-items-baseline">
        <div class="data_col">
          <label class="label_field">附件</label>
        </div>
        <div v-if="canEdit">
          <Loading v-if="isUploading"></Loading>
          <template v-else>
            <input
              ref="uploadFileAttachedRef"
              type="file"
              accepchangeFilet=".jpg,.jpeg,.gif,.png,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              multiple="true"
              style="display: none;"
              @change="uploadFile($event)"
            />
            <span
              class="file_upload"
              @click="handleInputFileClick"
              :class="{
                disabled:
                  quotationData.quotationAttachmentQuotationList.length >= 5 ||
                  !quotationData.canEdit
              }"
            >
              <template>
                <img
                  src="@/assets/icon/icon-photo-empty-blue.svg"
                  v-if="
                    quotationData.quotationAttachmentQuotationList.length < 5 &&
                      quotationData.canEdit
                  "
                />
                <img v-else src="@/assets/icon/icon-icon-photo.svg" />
              </template>
              上傳檔案
            </span>
            <img
              src="@/assets/icon/icon-info-warmgray.svg"
              v-tooltip="{
                placement: 'right',
                content: `<div>*上傳最後報價單</div>
                <div>*最大限制10MB</div> 
                <div>*可上傳的檔案格式：jpg,gif,pdf,doc,docx,ppt,pptx,xls,xlsx</div>`,
                offset: 5,
                trigger: 'hover'
              }"
            />
            <div class="file_name">
              <span
                v-for="file in quotationData.quotationAttachmentQuotationList"
                :key="file.id"
              >
                <a
                  :href="
                    `${apiURL}api/quotation/attachment/${file.id}/quotation/${quotationData.id}/download`
                  "
                  rel="noopener"
                  target="_blank"
                  class="font-weight-bold"
                >
                  {{ file.fileName }}
                </a>
                <icon
                  v-if="quotationData.canEdit"
                  class="delete_icon"
                  iconName="icon-16-delete-icon-delete-green"
                  size="16"
                  @click.native="deleteFile(file.id)"
                />
              </span>
            </div>
          </template>
        </div>
        <div v-else>
          <div class="file_name">
            <span
              v-for="file in quotationData.quotationAttachmentQuotationList"
              :key="file.id"
            >
              <a
                :href="
                  `${apiURL}api/quotation/attachment/${file.id}/quotation/${quotationData.id}/download`
                "
                rel="noopener"
                target="_blank"
                class="font-weight-bold"
              >
                {{ file.fileName }}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDraftForm" class="d-flex justify-content-center">
      <button
        type="button"
        class="button_bg_blue_large"
        @click="goToEdit"
        :disabled="
          !quotationData.customerId ||
            !quotationData.name ||
            !quotationData.type ||
            v$.name.$error
        "
      >
        下一步
      </button>
    </div>
  </section>
</template>

<script>
import { useRoute } from "@/router/useRouter.js";
import { ref, computed, onMounted, toRefs } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useStore } from "@/store/index.js";
import OrderHeader from "@/components/internalOrder/OrderHeader.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import { useAccountStore } from "@/stores/account.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import { useFileUpload } from "@/composables/quotation/useFileUpload.js";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    OrderHeader,
    SelectDropdown,
    Loading
  },
  setup() {
    const { router } = useRoute();
    const store = useStore();
    const accountStore = useAccountStore();
    const salesOrderStore = useSalesOrderStore();
    const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
    const { quotationData } = toRefs(salesOrderStore);
    const { canEditNew, isDraftForm } = useFormStatus();
    const { getAccountSearch } = accountStore;
    const { uploadFiles, deleteFile, isUploading } = useFileUpload(
      quotationData.value.id,
      "QUOTATION"
    );

    // 類型; 0 = 新增時預設
    const selectedType = computed(() =>
      quotationData.value.type === 1
        ? typeOptions[0].label
        : typeOptions[1].label
    );

    // BU
    const selectedBu = computed(() => {
      const buType = {
        "103": buOptions[0].label,
        "110": buOptions[1].label,
        "107": buOptions[2].label,
        "122": buOptions[3].label,
        "106": buOptions[4].label
      };
      return buType[quotationData.value.bu];
    });

    const canEdit = computed(() => canEditNew(quotationData.value).edit);
    const uploadFileAttachedRef = ref(null);
    const apiURL = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;

    // 上方小卡內容
    const cardsData = [
      { title: "內服單號", content: quotationData.value.id || "- -" },
      {
        title: "內服單狀態",
        content: quotationData.value.id
          ? canEditNew(quotationData.value).word
          : "新增"
      },
      {
        title: "申請日期",
        content: quotationData.value.quotationApplyDate || "- -"
      },
      {
        title: "成立日期",
        content: quotationData.value.quotationExpiryDate || "- -"
      }
    ];

    // 客戶
    const searchedCompanyOptions = ref([]);
    const selectedCompany = ref("");
    const searchedSalesOptions = ref([]);
    const selectedSales = ref("");
    const fileName = ref("");
    const rules = {
      customerId: { required },
      name: { required, maxLength: maxLength(50) },
      note: {}
    };

    // 類型選項
    const typeOptions = [
      { label: "內部行銷使用(含內部計價)", value: 1 },
      { label: "新客戶試用", value: 2 }
    ];

    // BU 選項
    const buOptions = [
      { label: "103 整合招募服務", value: 103 },
      { label: "110 求才產品行銷", value: 110 },
      { label: "107 人力銀行", value: 107 },
      { label: "122 人力銀行產品", value: 122 },
      { label: "106 公共事務", value: 106 }
    ];

    onMounted(async () => {
      // 新增時，內服單 type 預設為 1
      if (quotationData.value.type === 0) quotationData.value.type = 1;

      // 新增時，負責人員預設為申請人
      const accountId =
        quotationData.value.salesInfo?.accountId ??
        getUserStatus.value.accountId;
      const logonId =
        quotationData.value.salesInfo?.logonId ?? getUserStatus.value.logonId;
      const name =
        quotationData.value.salesInfo?.name ?? getUserStatus.value.name;
      const label = `${logonId}(${name}/${accountId})`;
      quotationData.value.salesId = accountId;
      selectedSales.value = label;
      searchedSalesOptions.value = [
        {
          accountId,
          logonId,
          name,
          label,
          value: accountId
        }
      ];

      selectedCompany.value = quotationData.value.customerName
        ? `${quotationData.value.customerName}(${quotationData.value.customerId})`
        : "";
    });

    // 選擇負責人員
    const setSelectedSales = data => {
      selectedSales.value = searchedSalesOptions.value.find(
        option => option.name === data.name
      ).label;
      quotationData.value.salesId = data.accountId;
    };

    // 負責人員 AC
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

    // 選擇類型
    const changeOrderType = data => {
      quotationData.value.type = data;
    };

    // 選擇 BU 名稱
    const changeBU = data => {
      quotationData.value.bu = data;
    };

    // 選擇客戶
    const changeCustomer = data => {
      selectedCompany.value = searchedCompanyOptions.value.find(
        option => option.name === data.name
      ).label;
      quotationData.value.customerId = data.value;
      quotationData.value.customerName = data.name.replace(/\([^\)]*\)/g, "");
    };

    // 輸入客戶
    const companySuggestSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        try {
          const responseData = await store.dispatch(
            "project/getCustomerSuggestion",
            {
              keyword
            }
          );
          searchedCompanyOptions.value = [...responseData].map(item => {
            return {
              ...item,
              value: item.id,
              label: item.name
            };
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    // 點擊上傳檔案
    const fileClick = id => {
      document.querySelector(`#${id}`).click();
    };

    // 上傳檔案互動視窗
    const handleInputFileClick = () => {
      if (quotationData.value.quotationAttachmentQuotationList.length >= 5)
        return;
      uploadFileAttachedRef.value.click();
    };

    // 上傳檔案
    const uploadFile = async e => {
      if (!quotationData.value.id) return;

      const elFiles = e.target.files;
      const files = [...elFiles].filter(file => file.size);
      if (files.length === 0) return;

      try {
        await uploadFiles(files);
      } catch (err) {
        console.error(err);
      }
    };

    // 建立內服單
    const goToEdit = () => {
      salesOrderStore.createQuotation().then(res => {
        router
          .push({
            path: `/internalOrder/edit/${res.id}`
          })
          .catch(() => {});
      });
    };

    return {
      v$: useVuelidate(rules, quotationData, { $autoDirty: true }),
      cardsData,
      typeOptions,
      selectedType,
      buOptions,
      selectedBu,
      searchedCompanyOptions,
      selectedCompany,
      canEdit,
      fileName,
      changeOrderType,
      changeBU,
      changeCustomer,
      companySuggestSearch,
      fileClick,
      quotationData,
      setSelectedSales,
      selectedSales,
      searchedSalesOptions,
      accountSearch,
      isDraftForm,
      isUploading,
      uploadFile,
      handleInputFileClick,
      deleteFile,
      apiURL,
      uploadFileAttachedRef,
      goToEdit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/views/orderManage/create";

.cards {
  margin-bottom: 24px;
}

.view_status {
  font-weight: bold;
  color: #7e7e7e;
}

.top_info {
  padding-bottom: 24px;
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 24px;

  .data_col {
    margin-right: 28px;
  }

  .label_field {
    width: 70px;
  }
}

.bottom_info {
  .data_col {
    margin-right: 28px;
  }

  .label_field {
    width: 70px;
  }

  .file_name {
    margin-top: 12px;

    span {
      display: block;

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }

    ::v-deep {
      .delete_icon {
        cursor: pointer;
      }
    }
  }
}
</style>
