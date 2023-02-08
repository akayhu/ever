<template>
  <DropDownRow
    @onEditBtnClick="handleEdit"
    @onActiveOff="resetComponentData"
    :tipText="activeText"
    :isActive="isActive"
    :isEdit="edit"
    :isFocus="isFocus"
    title="設定素材曝光日期"
    toolTipText="可依照已上傳的廣告素材設定曝光日期"
    class="mb-6"
  >
    <div class="appointment">
      <div class="appointment_bottom_content">
        <div class="appointment_date">
          <div>
            <span class="start_date">開始日期：{{ tagData.startDate }}</span>
            <span class="end_date">結束日期：{{ tagData.endDate }}</span>
          </div>
          <div
            class="clearAll"
            :class="{ disabled: getShowUneditableText || !isUploaded }"
            @click.stop="clearExposureReservation"
          >
            <icon
              iconName="delete"
              :disabled="getShowUneditableText || !isUploaded"
            />全部清除
          </div>
        </div>
        <div>
          <div class="single">
            <label class="ad-radio-label">
              <input
                v-model="sales"
                @change="getSubmitDisabled()"
                :disabled="!isSelectedValEdible || !userSitePermissions"
                :value="1"
                type="radio"
                name="text"
              />
              <span class="ad-radio"></span>單一素材
            </label>
            <span v-if="sales === 1" class="single_select">
              <el-select
                v-model="singleSelectValue"
                @change="getSubmitDisabled()"
                :disabled="!isSelectedValEdible || !userSitePermissions"
                placeholder="請選擇素材"
                no-data-text="無正式素材"
              >
                <el-option
                  v-for="item in materialExposuresList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </span>
            <span
              v-if="
                (getShowUneditableText && sales === 1) || !userSitePermissions
              "
              class="exposed"
            >
              無法上傳素材!! (素材已曝光 或 刊期已過 或 沒有拉cue 或
              您沒有上傳權限)
            </span>
          </div>
          <div>
            <label class="ad-radio-label">
              <input
                v-model="sales"
                @change="getSubmitDisabled()"
                :disabled="!userSitePermissions"
                :value="2"
                type="radio"
                name="text"
              />
              <span class="ad-radio"></span>多個素材
            </label>
            <span
              v-if="
                (getShowUneditableText && sales === 2) || !userSitePermissions
              "
              class="exposed"
            >
              無法上傳素材!! (素材已曝光 或 刊期已過 或 沒有拉cue 或
              您沒有上傳權限)
            </span>
          </div>
          <div v-if="sales === 2" class="multi_material_date">
            <div
              v-for="(item, index) in selectValue"
              :key="index"
              class="multi_material_select"
            >
              <div class="day_block" :class="{ isToday: item.today === 0 }">
                {{ item.date }}
              </div>
              <div>
                <el-select
                  v-model="selectValue[index].materialId"
                  @change="getSubmitDisabled()"
                  :disabled="!item.edible || !userSitePermissions"
                  placeholder="請選擇素材"
                  no-data-text="無正式素材"
                >
                  <el-option
                    v-for="item in materialExposuresList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="multi_material_submit">
            <button
              @click="submitDate"
              :disabled="
                !canSubmit ||
                  !userSitePermissions ||
                  !submitDisabled ||
                  materialExposuresList.length < 1
              "
              class="button_bg_white_restraint"
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  </DropDownRow>
</template>

<script>
import DropDownRow from "@/components/share/DropDownRow";
import { mapGetters, mapActions } from "vuex";

const state = () => {
  return {
    edit: false,
    submitDateState: false,
    sales: 1,
    selectValue: [],
    canChangeSales: true,
    singleSelectValue: "",
    canSubmit: false,
    submitDisabled: true,
    finished: false,
    showUneditableText: false,
    isUploaded: false
  };
};

export default {
  name: "AppointmentSchedule",
  data() {
    return {
      ...state()
    };
  },
  props: {
    committeeTime: {
      type: Object,
      required: true
    },
    reservationId: {
      type: Number
    },
    tagData: {
      type: Object
    },
    isActive: {
      type: Boolean
    },
    isFocus: {
      type: Boolean
    },
    userSitePermissions: {
      type: Boolean,
      default: true
    },
    reservationOrderId: {
      type: String
    }
  },
  components: {
    DropDownRow
  },
  computed: {
    ...mapGetters("material", ["getMaterialExposuresListData"]),
    materialExposuresList() {
      return this.getMaterialExposuresListData.materialExposuresList;
    },
    isSelectedValEdible() {
      return this.canChangeSales;
    },
    activeText() {
      return this.submitDateState || this.finished
        ? "曝光日期已設定"
        : "請設定";
    },
    getShowUneditableText() {
      return this.showUneditableText;
    }
  },
  methods: {
    ...mapActions("exposure", [
      "putExposure",
      "getExposureReservation",
      "deleteExposureReservation"
    ]),
    // 編輯
    handleEdit() {
      if (!this.isActive) return;
      const { getSubmitDisabled } = this;

      this.edit = !this.edit;
      this.$emit("edit");
      getSubmitDisabled();
    },
    // 送出
    submitDate() {
      const {
        sales,
        singleSelectValue,
        reservationId,
        putExposure,
        selectValue,
        canSubmit,
        deleteExposureReservation,
        $route,
        reservationOrderId
      } = this;

      if (!canSubmit) return;
      if (
        this.singleSelectValue === "" &&
        this.selectValue.every(item => item.materialId === null)
      ) {
        const query = {
          reservationId,
          orderId: reservationOrderId || $route.query.id
        };

        deleteExposureReservation(query).then(res => {
          this.$emit("appointmentScheduleSubmit", { clearAll: true });
        });
      } else {
        let singleMaterial = [];

        if (sales === 1) {
          selectValue.forEach(item => {
            singleMaterial.push({
              materialId: singleSelectValue,
              startDate: item.startDate
            });
          });
        }

        const query = {
          reservationId,
          dateMaterialId: sales === 1 ? singleMaterial : selectValue
        };

        putExposure(query).then(res => {
          if (res) {
            this.submitDateState = true;
            this.$emit("appointmentScheduleSubmit", res);
          }
        });
      }
    },
    // 取曝光數據
    async handleExposureReservationData(
      reservationId,
      newMaterialExposuresList
    ) {
      const { getExposureReservation } = this;
      this.selectValue = [];
      this.singleSelectValue = "";
      this.canSubmit = false;
      this.isUploaded = this.tagData.status === 3; // 已設定曝光但檔期未開始才可以清除曝光
      this.showUneditableText = !this.tagData.allowMaterial;
      // 取素材對應曝光時間
      await getExposureReservation({ reservationId }).then(res => {
        this.finished = res.finished;
        if (res.singleMaterial) {
          this.sales = 1;
          this.singleSelectValue =
            res.materialExposures[0].materialId ||
            (newMaterialExposuresList && newMaterialExposuresList[0].id);
        } else {
          this.sales = 2;
        }

        res.materialExposures.forEach(item => {
          const splitStartDate = item.startDate.split("/");
          // 可編修可修改送出
          this.canSubmit = item.edible;
          this.selectValue.push({
            ...item,
            date: `${splitStartDate[1]}/${splitStartDate[2]}`
          });
        });

        // 判斷是否可選單一或多個素材
        res.materialExposures.reduce((acc, curr) => {
          if (acc === 0 || acc === null) {
            acc = curr.materialId;
            this.canChangeSales = true;
          } else {
            if (acc === curr.materialId) {
              this.canChangeSales = true;
              this.singleSelectValue = curr.materialId;
            } else {
              this.canChangeSales = false;
            }
          }
          return acc;
        }, 0);
      });

      // 多個素材若無 materialId，預設帶入正式素材第一筆
      this.selectValue.forEach((item, index) => {
        if (
          item.edible &&
          item.materialId === null &&
          item.today >= 0 &&
          newMaterialExposuresList
        ) {
          this.selectValue[index].materialId = newMaterialExposuresList[0].id;
        }
      });
    },
    // 判斷送出是否可點
    getSubmitDisabled() {
      const { singleSelectValue, selectValue, sales } = this;

      // 若為全部清除的狀態可點送出
      if (
        singleSelectValue === "" &&
        selectValue.every(item => item.materialId === null)
      ) {
        this.submitDisabled = true;
        return;
      }

      let selectArr = [];
      if (sales === 1) {
        singleSelectValue ? selectArr.push(true) : selectArr.push(false);
      } else if (sales === 2) {
        selectValue.forEach(item => {
          if (item.edible) {
            item.materialId ? selectArr.push(true) : selectArr.push(false);
          }
        });
      }
      selectArr.indexOf(false) !== -1
        ? (this.submitDisabled = false)
        : (this.submitDisabled = true);
    },
    // 設定 data 為預設值
    resetComponentData() {
      Object.assign(this.$data, state());
    },
    // 父層 refs 執行
    autoOpenHandler(val) {
      this.singleSelectValue = val;
    },
    // 全部清除
    clearExposureReservation() {
      if (this.getShowUneditableText || !this.isUploaded) return;
      this.singleSelectValue = "";
      this.selectValue.forEach(item => {
        item.materialId = null;
      });
      this.getSubmitDisabled();
    }
  },
  watch: {
    reservationId(reservationId) {
      const { handleExposureReservationData } = this;
      if (reservationId > 0) {
        this.showUneditableText = false;
        handleExposureReservationData(reservationId);
      }
    },
    getExposureReservation() {
      const { handleExposureReservationData, reservationId } = this;
      this.showUneditableText = false;
      handleExposureReservationData(reservationId);
    },
    materialExposuresList(newVal) {
      const { handleExposureReservationData, reservationId } = this;
      if (newVal.length > 0) {
        this.showUneditableText = false;
        handleExposureReservationData(reservationId, newVal);
      }
    },
    isActive(newVal) {
      if (newVal) this.edit = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.appointment {
  .appointment_bottom_content {
    margin-top: 24px;

    .appointment_date {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ddd;

      .start_date,
      .end_date {
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
      }

      .end_date {
        margin-left: 27px;
      }

      .clearAll {
        line-height: 1.38;
        letter-spacing: 1px;
        color: #8f8f8f;
        font-size: 16px;
        font-weight: initial;
        cursor: pointer;

        img {
          width: 22px;
          cursor: pointer;

          &.disabled {
            cursor: not-allowed;
          }
        }
      }
      .disabled {
        color: #a9a9a9;
        cursor: not-allowed;
      }
    }
    .single {
      margin-bottom: 24px;

      .single_select {
        width: 260px;
        display: inline-block;
      }
    }

    .multi_material_date {
      display: flex;
      flex-wrap: wrap;
      padding-left: 20px;
      margin-top: 16px;

      .multi_material_select {
        display: flex;
        align-items: center;
        width: 267px;
        margin: 0 22px 8px 0;

        .day_block {
          margin-right: 9px;
          font-size: 12px;
          padding: 10px 4px;
          letter-spacing: 1.5px;
        }

        .isToday {
          background-color: #e6f9fa;
          color: #00afb8;
          font-weight: bold;
        }

        &:nth-child(3n) {
          margin-right: 0;
        }

        ::v-deep {
          input {
            width: 220px;
          }
        }
      }
    }

    .multi_material_submit {
      text-align: right;
      margin-top: 24px;
    }

    .exposed {
      margin-left: 8px;
      color: #ea475b;
      font-size: 14px;
      font-weight: initial;
    }
  }
}

.dialog_title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #333;
  text-align: center;
  margin-top: 90px;
}

.dialog_button_block {
  margin: 50px 0 62px;
  text-align: center;
}
</style>
