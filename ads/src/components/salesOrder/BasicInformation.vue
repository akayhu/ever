<template>
  <div>
    <!-- 報價單基本資料 -->
    <section class="section_container" id="basic_information">
      <div class="d-flex justify-content-between align-items-center">
        <h2>報價單基本資料</h2>
        <button
          v-if="canApplyExample()"
          type="button"
          class="button_bg_white_large"
          @click.prevent="openModal()"
        >
          套用範例
        </button>
      </div>

      <!-- 新增狀態 -->
      <CreatedQuotation v-if="canCreatedQuotation()" />

      <!-- 編輯狀態 -->
      <QuotationBasicInfoEdit v-if="canQuotationBasicInfoEdit()" />

      <!-- 一般檢視、簽核檢視狀態 -->
      <QuotationBasicInfoView v-if="canQuotationBasicInfoView()" />
    </section>

    <div v-if="canCreatedQuotation()" class="created_btn">
      <button
        type="button"
        class="button_bg_white_large mr-7"
        @click="goToDraftSalesOrder(true)"
        :class="{
          button_bg_white_large_disable:
            !quotationData.customerId || !quotationData.name || v$.name.$error
        }"
        :disabled="!quotationData.customerId || v$.name.$error"
      >
        建立檔期預約
      </button>
      <button
        type="button"
        class="button_bg_blue_large"
        @click="goToDraftSalesOrder(false)"
        :disabled="
          !quotationData.customerId || !quotationData.name || v$.name.$error
        "
      >
        建立報價單
      </button>
    </div>

    <Dialog
      ref="confirmDialog"
      @dialogCancel="showConfirm = false"
      @dialogConfirm="showConfirm = false"
      :isShow="showConfirm"
      :cancelButton="true"
      title="注意"
      content="您選擇了不同企業，只會套用報價內容"
    />

    <Modal
      ref="applyButtonDialog"
      @close="closeApplyButtonDialog"
      :isShow="showApplyButtonDialog"
      title="套用範例"
    >
      <template #body>
        <div class="apply_button">
          <table class="search_table" cellspacing="0" cellpadding="0">
            <tr>
              <td>日期</td>
              <td>
                <DatePicker :getSearchTime="getTime" />
              </td>
              <td>狀態</td>
              <td class="status">
                <el-select
                  v-model="searchQuotationData.queryStatus"
                  placeholder="請選擇"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
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
                  placeholder="請輸入統編、代碼或公司名稱"
                />
              </td>
            </tr>
          </table>

          <div class="search">
            <button @click="search" class="button_bg_blue_large">
              查詢
            </button>
          </div>

          <div
            v-if="
              exampleCompanyListData.isSearch && !exampleCompanyListData.loading
            "
          >
            <div v-if="exampleList.length > 0" class="quotation_list">
              <table cellspacing="0" cellpadding="0" width="100%">
                <thead>
                  <tr>
                    <td>客戶資訊</td>
                    <td>單號</td>
                    <td>申請日期</td>
                    <td>成交金額</td>
                    <td>折扣</td>
                    <td>狀態</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in exampleList" :key="item.id">
                    <td>
                      <div>
                        <label>企業名稱</label>
                        <span
                          v-tooltip="{
                            content: item.customerName,
                            offset: 5,
                            placement: 'bottom-start',
                            trigger: 'hover'
                          }"
                          class="client_name"
                        >
                          {{ item.customerName }}
                        </span>
                      </div>
                      <div>
                        <label>企業統編</label>
                        <span>{{ item.invoice }}</span>
                      </div>
                      <div>
                        <label>編號</label>
                        <span>{{ item.customerId }}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        報價<span>{{ item.id }}</span>
                      </div>
                      <div>
                        訂單<span>{{ item.id }}</span>
                      </div>
                    </td>
                    <td>{{ item.updateDate }}</td>
                    <td>{{ item.totalPrice }}</td>
                    <td>{{ item.discountPercentageLabel }} 折</td>
                    <td>{{ getStatus(item.status) }}</td>
                    <td>
                      <button
                        type="button"
                        class="button_bg_white_medium"
                        @click="applyExample(item.id, item.customerId)"
                      >
                        套用
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="exampleList.length > 0" class="page_block">
              <Pages
                :pageData="exampleCompanyListData"
                :isUsedEmit="true"
                :reloadPage="false"
                @pageChange="({ page }) => changePages(page)"
              />
            </div>

            <div v-if="exampleList.length < 1" class="no_list_data">
              無客戶資料
            </div>
          </div>

          <div v-if="exampleCompanyListData.loading" class="loading">
            <Loading />
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted, toRefs } from "vue";
import { useStore } from "@/store/index.js";
import { useRoute } from "@/router/useRouter.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import Modal from "@/components/share/Modal.vue";
import Pages from "@/components/Pages.vue";
import CreatedQuotation from "@/components/salesOrder/CreatedQuotation.vue";
import QuotationBasicInfoEdit from "@/components/salesOrder/editBlock/QuotationBasicInfoEdit.vue";
import QuotationBasicInfoView from "@/components/salesOrder/viewBlock/QuotationBasicInfoView.vue";
import Loading from "@/components/Loading.vue";
import Dialog from "@/components/Dialog.vue";
import useVuelidate from "@vuelidate/core";
import { maxLength } from "@vuelidate/validators";

export default {
  components: {
    SelectDropdown,
    DatePicker,
    CreatedQuotation,
    QuotationBasicInfoEdit,
    QuotationBasicInfoView,
    Pages,
    Modal,
    Loading,
    Dialog
  },
  setup() {
    const store = useStore();
    const { route, router } = useRoute();
    const salesOrderStore = useSalesOrderStore();
    const {
      createQuotation,
      resetApplyExample,
      getApplyQuotationExample,
      getApplyExampleCompanyList
    } = salesOrderStore;
    const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
    const { quotationData, exampleList } = toRefs(salesOrderStore);
    const searchQuotationData = computed(
      () => salesOrderStore.applyExampleForm
    );
    const exampleCompanyListData = computed(
      () => salesOrderStore.exampleCompanyList
    );
    const showApplyButtonDialog = ref(false);
    const statusOptions = ref([
      {
        label: "草稿",
        value: 1
      },
      {
        label: "報價簽核中",
        value: 2
      },
      {
        label: "報價成立",
        value: 3
      },
      {
        label: "轉訂單簽核中",
        value: 4
      },
      {
        label: "訂單成立",
        value: 5
      },
      {
        label: "作廢",
        value: 6
      },
      {
        label: "退刊",
        value: 7
      },
      {
        label: "駁回/抽單",
        value: 8
      },
      {
        label: "結案",
        value: 9
      }
    ]);
    const selectedClient = ref(null);
    const searchedClientOptions = ref([]);
    const showConfirm = ref(false);
    const confirmDialog = ref(null);
    const applyButtonDialog = ref(null);
    const rules = { name: { maxLength: maxLength(50) } };

    onMounted(() => {
      // 套用範例客戶搜自己的客戶
      searchQuotationData.value.salesId = getUserStatus.value.accountId;

      // 點擊瀏覽器上下頁時，重新 loading
      // window.addEventListener("popstate", () => {
      //   window.location.reload();
      // });
    });

    // 報價單狀態
    const getStatus = type => {
      const StatusType = {
        "0": "未結案",
        "1": "結案",
        "2": "逾期",
        "3": "作廢",
        "4": "退刊"
      };
      return StatusType[type];
    };

    // 日期
    const getTime = time => {
      searchQuotationData.value.startDate = time.searchTimeStart;
      searchQuotationData.value.endDate = time.searchTimeEnd;
    };

    // 查詢
    const search = () => {
      getApplyExampleCompanyList();
    };

    // 可套用範例
    const canApplyExample = () => {
      return (
        route.name === "EditSalesOrder" || route.name === "DraftSalesOrder"
      );
    };

    // 可新增
    const canCreatedQuotation = () => route.name === "CreatedSalesOrder";

    // 可編輯
    const canQuotationBasicInfoEdit = () => {
      return (
        route.name === "EditSalesOrder" || route.name === "DraftSalesOrder"
      );
    };

    // 可一般檢視或簽合檢視
    const canQuotationBasicInfoView = () => {
      return (
        route.name === "GeneralViewSalesOrder" ||
        route.name === "SignOffViewSalesOrder"
      );
    };

    // 選擇客戶
    const setSelectedClient = data => {
      selectedClient.value = searchedClientOptions.value.find(
        option => option.name === data.name
      ).label;
      searchQuotationData.value.customerId = data.value;
    };

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

    // 確認套用範例
    const openConfirm = async () => {
      showConfirm.value = true;
      return await confirmDialog.value.confirm();
    };

    // 關閉 Dialog
    const closeApplyButtonDialog = () => {
      resetApplyExample();
      selectedClient.value = null;
      searchQuotationData.value.queryStatus = 1;
      searchedClientOptions.value = [];
      showApplyButtonDialog.value = false;
    };

    // 開啓套用範例
    const openModal = () => {
      // 套用範例客戶搜自己的客戶
      searchQuotationData.value.salesId = getUserStatus.value.accountId;
      showApplyButtonDialog.value = true;
      applyButtonDialog.value.openModal();
    };

    // 套用範例
    const applyExample = async (id, customerId) => {
      if (quotationData.value.customerId !== customerId) {
        let result = await openConfirm();
        if (result) getApplyQuotationExample({ id });
        else return;
      } else {
        getApplyQuotationExample({ id });
      }
      closeApplyButtonDialog();
      document.querySelector("body").classList.remove("overflow-hidden");
    };

    // 切換頁碼
    const changePages = async page => {
      searchQuotationData.value.page = page;
      await getApplyExampleCompanyList();
    };

    // 建立檔期預、報價單
    const goToDraftSalesOrder = reserve => {
      createQuotation().then(res => {
        let path = {
          path: `/salesOrder/editSalesOrder/${res.id}`,
          query: { reserve }
        };
        if (!path.query.reserve) delete path.query;
        router.push(path).catch(() => {});
      });
    };

    return {
      v$: useVuelidate(rules, quotationData, { $autoDirty: true }),
      route,
      showApplyButtonDialog,
      statusOptions,
      canApplyExample,
      canCreatedQuotation,
      canQuotationBasicInfoEdit,
      canQuotationBasicInfoView,
      getTime,
      search,
      showConfirm,
      confirmDialog,
      applyButtonDialog,
      searchQuotationData,
      selectedClient,
      setSelectedClient,
      searchedClientOptions,
      companySuggestSearch,
      closeApplyButtonDialog,
      exampleCompanyListData,
      exampleList,
      getStatus,
      quotationData,
      applyExample,
      changePages,
      goToDraftSalesOrder,
      openConfirm,
      openModal
    };
  }
};
</script>

<style lang="scss" scoped>
.section_container {
  margin-bottom: 20px;
  line-height: 1.38;
  letter-spacing: 1.38px;

  h2 {
    font-size: 20px;
  }
}

.created_btn {
  text-align: center;
}

.apply_button {
  .search_table {
    ::v-deep .el-date-editor.el-range-editor {
      width: 100%;
    }

    ::v-deep .status .el-select {
      width: 260px;
    }

    ::v-deep .client .el-select {
      width: 680px;
    }

    tr {
      margin-bottom: 16px;
      display: block;

      td {
        color: #292929;

        &:nth-child(1) {
          width: 63px;
          font-weight: bold;
        }

        &:nth-child(2) {
          width: 320px;
        }

        &:nth-child(3) {
          width: 100px;
          text-align: center;
          font-weight: bold;
        }
      }
    }
  }

  .search {
    text-align: center;
    margin: 14px 0 30px;
  }

  .quotation_list {
    table {
      thead {
        tr {
          border-bottom: 1px solid #eee;

          td {
            font-size: 14px;
            font-weight: bold;
            line-height: 1.43;
            letter-spacing: 1.43px;
            color: #000;
            padding-top: 19px;
            padding-bottom: 20px;

            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5),
            &:nth-child(6) {
              padding-left: 12px;
            }

            &:nth-child(1) {
              padding-left: 12px;
              width: 230px;
            }
            &:nth-child(2) {
              width: 187px;
            }
            &:nth-child(3) {
              width: 103px;
            }
            &:nth-child(4) {
              width: 90px;
            }
            &:nth-child(5) {
              width: 66px;
            }
            &:nth-child(6) {
              padding-left: 24px;
              width: 74px;
            }
          }
        }
      }

      tbody {
        .button_bg_white_medium {
          width: 50px;
        }

        tr {
          border-bottom: 1px solid #eee;

          &:hover {
            background-color: #e6f9fa;
          }

          td {
            padding: 16px 0;
            font-size: 12px;
            line-height: 1.5;
            letter-spacing: 1.29px;
            color: #292929;
            vertical-align: middle;

            div {
              &:not(:last-child) {
                margin-bottom: 8px;
              }

              label {
                width: 54px;
              }

              span {
                padding-left: 8px;
                vertical-align: top;

                &.client_name {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  width: 168px;
                  display: inline-block;
                }
              }
            }

            &:nth-child(1),
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5),
            &:nth-child(6) {
              padding-left: 12px;
            }

            &:nth-child(1) {
              width: 237px;
            }
            &:nth-child(2) {
              width: 187px;
            }
            &:nth-child(3) {
              width: 103px;
            }
            &:nth-child(4) {
              width: 90px;
            }
            &:nth-child(5) {
              width: 66px;
            }
            &:nth-child(6) {
              padding-left: 24px;
              width: 90px;
            }
            &:nth-child(7) {
              text-align: center;
            }
          }
        }
      }
    }
  }

  .page_block {
    margin-top: 24px;
    text-align: right;
    font-size: 14px;
  }
}

.loading {
  margin: 100px 0;
}

.no_list_data {
  text-align: center;
  margin: 100px 0;
  font-size: 16px;
  color: #ea475b;
}
</style>
