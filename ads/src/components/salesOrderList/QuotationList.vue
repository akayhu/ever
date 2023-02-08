<template>
  <section v-if="quotationList.isSearch" class="quotation_list">
    <h2>報價單列表</h2>
    <div v-if="!quotationList.loading">
      <SwitchTabs
        :tabs-data="quotationBookmark"
        :value="searchQuotation.queryStatus"
        :style-type="'secondary'"
        @select-tab="changeTab"
      />
      <div class="pen_number">
        共<span>{{ quotationList.totalElements }}</span
        >筆
      </div>
      <div v-if="quotationList.content.length > 0">
        <table cellspacing="0" cellpadding="0" width="100%">
          <thead>
            <tr>
              <td>客戶資訊</td>
              <td>單號</td>
              <td>報價日期</td>
              <td>成交金額</td>
              <td>折扣</td>
              <td>業務人員</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in listData"
              :key="item.id"
              @click="goGuotationPage(item)"
            >
              <td>
                <div>
                  客戶<span
                    v-tooltip="{
                      content: item.customerName,
                      offset: 5,
                      placement: 'bottom-start',
                      trigger: 'hover'
                    }"
                    class="client_name"
                    >{{ item.customerName }}</span
                  >
                </div>
                <div>
                  統編<span>{{ item.invoice }}</span>
                </div>
                <div>
                  編號<span>{{ item.customerId }}</span>
                </div>
              </td>
              <td>
                <div>
                  報價<span>{{ item.id }}</span>
                </div>
                <div>用印<span>- -</span></div>
                <div>
                  ERP<span>{{ item.orderId || "- -" }}</span>
                </div>
              </td>
              <td>{{ item.quotationDate }}</td>
              <td>{{ item.totalPriceIncludeTax.toLocaleString() }}</td>
              <td>{{ item.discountPercentageLabel }}折</td>
              <td>{{ item.salesInfo.name }}</td>
              <td>
                <span v-if="searchQuotation.queryStatus === 8">{{
                  item.audit === 2 ? "駁回" : "抽單"
                }}</span>
              </td>
              <td>
                <img
                  v-tooltip="{
                    content: getLeftIconTooltipText,
                    offset: 5,
                    placement: 'right',
                    trigger: 'hover'
                  }"
                  @click.stop="getLeftLink(item.id)"
                  :src="getLeftIconSrc()"
                />
                <img
                  v-if="
                    searchQuotation.queryStatus === 3 ||
                      searchQuotation.queryStatus === 5
                  "
                  v-tooltip="{
                    content: getRightIconTooltipText,
                    offset: 5,
                    placement: 'right',
                    trigger: 'hover'
                  }"
                  @click.stop="getRightLink(item)"
                  :src="getRightIconSrc()"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="page_block">
          <Pages
            :pageData="quotationList"
            :reloadPage="false"
            :isUsedEmit="true"
            @pageChange="({ page }) => changePages(page)"
          />
        </div>
      </div>
      <div v-if="quotationList.content.length < 1" class="no_list_data">
        無列表資料
      </div>
    </div>

    <div v-if="quotationList.loading" class="loading">
      <Loading />
    </div>

    <Dialog
      @dialogCancel="showDialog = false"
      @dialogConfirm="handleConfirm"
      :isShow="showDialog"
      :cancelButton="showCancelButton"
      :title="dialogTitle"
      :content="dialogContent"
    />

    <!-- 轉訂單 action -->
    <TransferOrder
      :isShowTransferOrder="showTransferOrder"
      @cancelShowTransferOrder="showTransferOrder = false"
      @submitTransferOrder="submitTransferOrder"
    />
  </section>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from "vue";
import { useSalesOrderListStore } from "@/stores/salesOrderList.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus";
import { useRoute } from "@/router/useRouter.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import TransferOrder from "@/components/share/TransferOrder.vue";
import Pages from "@/components/Pages.vue";
import Loading from "@/components/Loading.vue";
import Dialog from "@/components/Dialog.vue";

export default defineComponent({
  components: {
    SwitchTabs,
    Pages,
    Loading,
    TransferOrder,
    Dialog
  },
  setup() {
    const { router } = useRoute();
    const { queryListStatus, canEditNew } = useFormStatus();
    const salesOrderListStore = useSalesOrderListStore();
    const salesOrderStore = useSalesOrderStore();

    const { getQuotationListData } = salesOrderListStore;
    const {
      searchQuotation,
      quotationList,
      getQuotationList: listData
    } = toRefs(salesOrderListStore);

    const showTransferOrder = ref(false);
    const showDialog = ref(false);
    const showCancelButton = ref(false);
    const dialogTitle = ref("");
    const dialogContent = ref("");
    const transferOrderId = ref(null);
    const quotationBookmark = ref([
      {
        key: 1,
        label: "草稿"
      },
      {
        key: 2,
        label: "報價簽核中"
      },
      {
        key: 3,
        label: "報價成立"
      },
      {
        key: 4,
        label: "轉訂單簽核中"
      },
      {
        key: 5,
        label: "訂單成立"
      },
      {
        key: 6,
        label: "作廢"
      },
      {
        key: 7,
        label: "退刊"
      },
      {
        key: 8,
        label: "駁回/抽單"
      },
      {
        key: 9,
        label: "結案"
      }
    ]);

    // 取左 icon 連結
    const getLeftLink = id => {
      // 暫時開發網址，轉訂單簽核(4)之後先進簽核檢視，其他為一般檢視，之後用權限判斷
      const selectTabType = {
        "1": `EditSalesOrder`,
        "2": `GeneralViewSalesOrder`,
        "3": `GeneralViewSalesOrder`,
        "4": `SignOffViewSalesOrder`,
        "5": `SignOffViewSalesOrder`,
        "6": `SignOffViewSalesOrder`,
        "7": `SignOffViewSalesOrder`,
        "8": `EditSalesOrder`,
        "9": `SignOffViewSalesOrder`
      };

      router
        .push({
          name: selectTabType[searchQuotation.value.queryStatus],
          params: { salesOrderId: id }
        })
        .catch(() => {});
    };

    // 取右 icon 連結
    const getRightLink = item => {
      if (searchQuotation.value.queryStatus === 3) {
        transferOrderId.value = item.id;
        showTransferOrder.value = true;
      } else {
        router
          .push({
            name: "CueManagement",
            params: { salesOrderId: item.orderId }
          })
          .catch(() => {});
      }
    };

    // 取左 icon tooltip 內容
    const getLeftIconTooltipText = () => {
      const selectTabType = {
        "1": "編輯",
        "2": "檢視",
        "3": "用印申請",
        "4": "檢視",
        "5": "檢視",
        "6": "作廢",
        "7": "退刊",
        "8": "駁回/抽單",
        "9": "檢視"
      };
      return selectTabType[searchQuotation.value.queryStatus];
    };

    // 取左 icon
    const getLeftIconSrc = () => {
      const selectTabType = {
        "1": require("@/assets/icon/icon-edit-on.svg"),
        "2": require("@/assets/icon/icon-icon-eye-on.svg"),
        "3": require("@/assets/icon/icon-seal-on.svg"),
        "4": require("@/assets/icon/icon-icon-eye-on.svg"),
        "5": require("@/assets/icon/icon-icon-eye-on.svg"),
        "6": require("@/assets/icon/icon-icon-eye-on.svg"),
        "7": require("@/assets/icon/icon-icon-eye-on.svg"),
        "8": require("@/assets/icon/icon-edit-on.svg"),
        "9": require("@/assets/icon/icon-icon-eye-on.svg")
      };
      return selectTabType[searchQuotation.value.queryStatus];
    };

    // 取右 icon tooltip 文案
    const getRightIconTooltipText = () => {
      return searchQuotation.value.queryStatus === 3 ? "轉訂單" : "拉CUE";
    };

    // 切換頁籤
    const changeTab = type => {
      searchQuotation.value.queryStatus = type.key;
      searchQuotation.value.page = 1;
      getQuotationListData();
    };

    // 取右 icon
    const getRightIconSrc = () => {
      return searchQuotation.value.queryStatus === 3
        ? require("@/assets/icon/icon-cueoff-clicked.svg")
        : require("@/assets/icon/icon-ordoff-clicked.svg");
    };

    // 切換頁碼
    const changePages = async page => {
      searchQuotation.value.page = page;
      await getQuotationListData();
    };

    // dialog 按下確定
    const handleConfirm = async () => {
      showDialog.value = false;
      changeTab({ key: 3 });
    };

    // 轉訂單送出
    const submitTransferOrder = async () => {
      await salesOrderStore.changeAction("SIGN", transferOrderId.value);
      showTransferOrder.value = false;
      showDialog.value = true;
      showCancelButton.value = false;
      dialogTitle.value = "您已轉訂單完成！";
      dialogContent.value = "按下確認鈕後回列表";
    };

    // 列表連結
    const goGuotationPage = item => {
      const salesOrderStatus = canEditNew(item);
      salesOrderStatus.edit
        ? (window.location.href = `/salesOrder/editSalesOrder/${item.id}`)
        : (window.location.href = `/salesOrder/generalViewSalesOrder/${item.id}`);
    };

    // 列表只有一筆時，直接跳到相對應的狀態頁籤
    watch(quotationList, newValue => {
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
      quotationBookmark,
      getLeftLink,
      getRightLink,
      getLeftIconTooltipText,
      getLeftIconSrc,
      changeTab,
      getRightIconTooltipText,
      getRightIconSrc,
      searchQuotation,
      quotationList,
      listData,
      changePages,
      showTransferOrder,
      goGuotationPage,
      submitTransferOrder,
      handleConfirm,
      dialogTitle,
      showDialog,
      showCancelButton,
      dialogContent
    };
  }
});
</script>

<style lang="scss" scoped>
section {
  &.quotation_list {
    h2 {
      margin-bottom: 24px;
    }

    .pen_number {
      text-align: right;
      margin: 16px 0;
      font-size: 16px;
      font-weight: bold;

      span {
        color: #19b9c0;
        margin: 0 4px;
      }
    }

    table {
      tr {
        border-bottom: 1px solid #eee;

        td {
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7) {
            padding-left: 12px;
          }

          &:nth-child(8) {
            width: 107px;
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

            &:nth-child(1) {
              padding-left: 18px;
              width: 405px;
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
              width: 55px;
            }

            &:nth-child(6) {
              width: 94px;
            }

            &:nth-child(7) {
              width: 51px;
            }

            &:nth-child(8) {
              width: 90px;
            }
          }
        }
      }

      tbody {
        tr {
          &:hover {
            cursor: pointer;
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
              margin-bottom: 8px;

              &:last-child {
                margin-bottom: 0;
              }

              span {
                padding-left: 8px;
                vertical-align: top;

                &.client_name {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  width: 343px;
                  display: inline-block;
                }
              }
            }

            img {
              cursor: pointer;
            }

            &:nth-child(8) {
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
      margin-top: 24px;
      text-align: right;
      font-size: 14px;
    }

    .no_list_data {
      text-align: center;
      margin: 100px 0;
      font-size: 16px;
      color: #ea475b;
    }
  }

  .loading {
    margin: 100px 0;
  }
}
</style>
