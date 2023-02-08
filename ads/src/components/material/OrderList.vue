<template>
  <section class="material_wrapper" @click="$emit('edit')">
    <h2 class="mb-6">委刊單</h2>
    <switch-tabs
      :tabs-data="queryOptionList"
      :value="queryOptions"
      @select-tab="changeQueryOptions($event.key)"
    />

    <!-- 用人員查詢 -->
    <table
      v-if="queryOptions === 'personnel'"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      class="personnel"
    >
      <tr>
        <td>專案人員</td>
        <td>
          <div v-if="queryOptions === 'personnel'" class="w250">
            <SelectDropdown
              data-e2e="account"
              @value-changed="setSelectedProjectStaff($event)"
              :value="selectedProjectPeople"
              :options="searchedProjectPeopleOptions"
              :asncSearchCb="accountSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              placeholder="請輸入專案人員"
            />
          </div>
        </td>
        <td>委刊單期間</td>
        <td>
          <DatePicker
            ref="date-picker"
            :getSearchTime="getTime"
            :changeAction="clearOrder"
          />
        </td>
      </tr>
      <tr>
        <td>委刊單(內部服務單)</td>
        <td colspan="3">
          <span
            class="selectDropdownBlock"
            :class="{ focus: serviceTicketFocus }"
          >
            <SelectDropdown
              @value-changed="setSelectedServiceTicket($event)"
              :value="selectedServiceTicket"
              :options="searchedServiceTicketOptions"
              :disabled="searchedServiceTicketOptions.length > 0 ? false : true"
              :optionsAllData="true"
              :focusAction="focusAction"
              placeholder="請選擇"
            />
          </span>
          <div class="product-error">
            <ValidationError
              :vData="serviceTicketVData"
              text="您選的委刊單期間無委刊單"
            />
          </div>
        </td>
      </tr>
    </table>

    <!-- 用委刊單查詢 -->
    <table
      v-if="queryOptions === 'order'"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      class="order"
    >
      <tr>
        <td>委刊單(內部服務單)</td>
        <td>
          <input
            v-if="queryOptions === 'order'"
            v-model="selectedServiceTicketValue"
            placeholder="請輸入委刊單號"
          />
        </td>
        <td>委刊單期間</td>
        <td>
          <DatePicker
            ref="date-picker"
            :getSearchTime="getTime"
            :changeAction="clearOrder"
          />
        </td>
      </tr>
    </table>

    <div class="material_submit_button">
      <button
        :disabled="!selectedServiceTicketValue"
        @click="searchOrder"
        class="button_bg_blue_large"
      >
        確定
      </button>
    </div>

    <Dialog
      v-if="noPermissionDialog"
      @dialogCancel="closeNoPermissionDialog"
      @dialogConfirm="closeNoPermissionDialog"
      :isShow="noPermissionDialog"
      :cancelButton="false"
      title="您無權限查詢他人的委刊單"
      content="您無權限查詢他人的委刊單"
      componentKey="noPermissionDialog"
    />
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DatePicker from "@/components/DatePicker.vue";
import ValidationError from "@/components/ValidationError";
import Dialog from "@/components/Dialog.vue";
import userAuthority from "@/utils/userAuthority";
import SelectDropdown from "@/components/share/SelectDropdown";
import SwitchTabs from "@/components/share/SwitchTabs.vue";

export default {
  name: "OrderList",
  data() {
    return {
      projectOwnerNumber: "",
      serviceTicketFocus: false,
      serviceTicketVData: {
        $error: false,
        required: false
      },
      searchedProjectPeopleOptions: [],
      selectedProjectPeople: "",
      searchedServiceTicketOptions: [],
      selectedServiceTicket: "",
      selectedServiceTicketValue: "",
      timeStart: "",
      timeEnd: "",
      noPermissionDialog: false,
      queryOptions: "personnel",
      queryOptionList: [
        { key: "personnel", label: "用人員查詢" },
        { key: "order", label: "用委刊單查詢" }
      ]
    };
  },
  components: {
    DatePicker,
    ValidationError,
    Dialog,
    SelectDropdown,
    SwitchTabs
  },
  computed: {
    ...mapGetters("user", ["getUserStatus"])
  },
  beforeMount() {
    const { $route, changeQueryOptions, searchOrder } = this;
    if ($route.query.id) {
      changeQueryOptions("order");
      this.selectedServiceTicketValue = $route.query.id;
      searchOrder();
    }
  },
  methods: {
    ...mapActions("reservation", [
      "getReservationOrder",
      "getReservationOrderId"
    ]),
    ...mapActions("account", ["getAccountSearch"]),
    ...mapActions("material", ["updateCopyMaterialDataAction"]),
    // 清空資料
    changeQueryOptions(type) {
      const { clearProjectStaff, clearTime, $route } = this;
      this.queryOptions = type;
      clearProjectStaff();
      if (!$route.query.id) clearTime();
    },
    // 清除專案人員與委刊單號
    clearProjectStaff() {
      this.selectedProjectPeople = "";
      this.searchedProjectPeopleOptions = [];
      this.projectOwnerNumber = "";
      this.selectedServiceTicket = "";
      this.selectedServiceTicketValue = "";
      this.searchedServiceTicketOptions = [];
    },
    // 清除時間與委刊單
    clearTime() {
      this.clearOrder();
      this.timeStart = "";
      this.timeEnd = "";
      this.$refs["date-picker"].dateValue = [];
    },
    // 清除委刊單
    clearOrder() {
      if (this.queryOptions === "personnel") {
        this.selectedServiceTicket = "";
        this.selectedServiceTicketValue = "";
        this.searchedServiceTicketOptions = [];
      }
    },
    // 專案人員
    async accountSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getAccountSearch } = this;
        const responseData = await getAccountSearch({ keyword });

        this.searchedProjectPeopleOptions = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.logonId}(${item.name}/${item.accountId})`,
            nameAccountId: `${item.name}(${item.accountId})`
          };
        });
      }
    },
    // 專案人員 Autocomplete，JB VM、整召業務無權編輯他人委刊單
    setSelectedProjectStaff(data) {
      const { getUserStatus, clearTime } = this;
      const userAuthorityData = userAuthority[getUserStatus.role];

      this.selectedProjectPeople = this.searchedProjectPeopleOptions.find(
        option => option.name === data.name
      ).nameAccountId;

      clearTime();

      if (
        userAuthorityData.materialEdit_2 &&
        data.accountId !== getUserStatus.accountId
      ) {
        this.noPermissionDialog = true;
      } else {
        this.projectOwnerNumber = data.accountId;
      }
    },
    // 委刊單(內部服務單) Autocomplete
    setSelectedServiceTicket(data) {
      const { searchedServiceTicketOptions } = this;
      this.selectedServiceTicket = searchedServiceTicketOptions.find(
        option => option.value === data.value
      ).label;
      this.selectedServiceTicketValue = searchedServiceTicketOptions.find(
        option => option.value === data.value
      ).value;
      this.serviceTicketFocus = false;
    },
    // 委刊單日期
    getTime(time) {
      const {
        getReservationOrder,
        projectOwnerNumber,
        serviceTicketVData
      } = this;

      this.timeStart = time.searchTimeStart;
      this.timeEnd = time.searchTimeEnd;

      if (this.queryOptions === "personnel") {
        getReservationOrder({
          startDate: this.timeStart,
          endDate: this.timeEnd,
          projectOwner: projectOwnerNumber
        }).then(res => {
          if (res.length > 0) {
            let resArr = [];
            res.forEach(item => {
              resArr.push({
                name: item
              });
            });

            this.searchedServiceTicketOptions = resArr.reduce(
              (accumulator, currentValue) => {
                const options = {};
                options.value = currentValue.name.orderId;
                options.label = `${currentValue.name.orderId} / ${currentValue.name.customerName}(${currentValue.name.customerId})`;
                accumulator.push(options);
                return accumulator;
              },
              []
            );
            serviceTicketVData.$error = false;
            serviceTicketVData.required = true;
            this.serviceTicketFocus = true;
          } else {
            serviceTicketVData.$error = true;
            serviceTicketVData.required = false;
            this.selectedServiceTicket = "";
            this.selectedServiceTicketValue = "";
            this.searchedServiceTicketOptions = [];
          }
        });
      }

      this.$emit("selectCommitteeTime", {
        timeStart: this.timeStart,
        timeEnd: this.timeEnd
      });
    },
    // 搜尋委刊單
    searchOrder() {
      const {
        getReservationOrderId,
        timeStart,
        timeEnd,
        selectedServiceTicketValue,
        updateCopyMaterialDataAction
      } = this;
      const qurey = {
        id: selectedServiceTicketValue,
        start: timeStart,
        end: timeEnd
      };

      if (!qurey.start) delete qurey.start;
      if (!qurey.end) delete qurey.end;

      updateCopyMaterialDataAction({ orderId: selectedServiceTicketValue });
      getReservationOrderId(qurey).then(() => {
        this.$emit("selectCommitteeNumber", qurey);
      });
    },
    // 關閉 Dialog
    closeNoPermissionDialog() {
      this.clearProjectStaff();
      this.noPermissionDialog = false;
    },
    focusAction() {
      this.serviceTicketFocus = false;
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  &.material_wrapper {
    margin-bottom: 24px;

    table {
      &.personnel,
      &.order {
        margin-top: 24px;

        tr {
          td {
            font-size: 16px;
            font-weight: bold;
            line-height: 1.38;
            letter-spacing: 1px;
            color: #333;

            &:nth-child(1) {
              width: 178px;
            }
            &:nth-child(2) {
              width: 290px;
            }
            &:nth-child(3) {
              width: 113px;
            }

            ::v-deep {
              input {
                width: 250px;
                background-color: #f3f3f3;
              }
            }

            span {
              &.selectDropdownBlock {
                width: 754px;
                display: inline-block;

                ::v-deep {
                  input {
                    width: 754px;
                    background-color: #f3f3f3;
                  }
                }
              }
            }

            .w250 {
              width: 250px;
            }

            .focus {
              border-radius: 4px;
              border: 1px solid #00afb8;
            }
          }

          &:nth-child(2) {
            td {
              padding-top: 24px;
            }
          }
        }
      }
    }
  }

  .material_submit_button {
    margin-top: 24px;
    text-align: center;
  }
}
</style>
