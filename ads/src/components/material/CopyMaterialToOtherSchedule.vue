<template>
  <DropDownRow
    @onEditBtnClick="handleEdit"
    @onActiveOff="resetComponentData"
    :isActive="isActive"
    :isEdit="isEdit"
    :isFocus="isFocus"
    title="複製素材至其他檔期"
    toolTipText="可依照已上傳的廣告素材設定曝光日期"
    class="mt-6"
  >
    <div v-if="reservationScheduleData.length < 1" class="no-schedule">
      此版位目前無未曝光檔期
    </div>
    <div v-if="reservationScheduleData.length > 0">
      <div class="copy-to-other-schedule-title">
        您已設定的素材如下，請選擇欲要複製的檔期
      </div>
      <div class="week_material_main">
        <div class="week_material_left">
          <icon iconName="icon-icon-date" />
        </div>
        <div class="week_material_right">
          <div v-for="(item, index) in weekMaterial" :key="item.id">
            <span>素材{{ index + 1 }}</span> {{ item.title }}
          </div>
        </div>
      </div>
      <div class="scheduled">
        <div class="title">已預約檔期</div>
        <div class="year">
          <div class="left">
            <span
              v-for="item in reservationScheduleYear"
              :key="item"
              :class="{ focus: reservationScheduleYearFocus === item }"
              >{{ item }}</span
            >
          </div>
          <div class="right" @click="clearSelectedWeek">
            <icon iconName="delete" /> 全部清除
          </div>
        </div>
        <ul>
          <li>
            <dl>
              <dd
                v-for="(item, monthName, index) of reservationMonth"
                :key="monthName"
                class="reservation_month"
                :class="{ active: currentSelectedMonth === monthName }"
                @click="currentSelectedMonth = monthName"
              >
                <span>
                  <input
                    :checked="
                      calcSelectedWeekFromMonth(monthName) === item.length
                    "
                    :value="monthName"
                    :id="`reservationMonth_${index}`"
                    @click="toggleAllWeekFromMouth(monthName)"
                    type="checkbox"
                  />
                  <label :for="`reservationMonth_${index}`">
                    <span></span>{{ monthName }}
                  </label>
                </span>
                <span>
                  <span
                    v-if="calcSelectedWeekFromMonth(monthName) > 0"
                    class="select_number"
                    >{{ calcSelectedWeekFromMonth(monthName) }}</span
                  >
                  <icon iconName="icon-arrow-right-disable" />
                </span>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dd v-for="(item, index) in reservationWeek" :key="index">
                <input
                  v-model="selectedReservationId"
                  :value="item.reservationId"
                  :id="`reservationWeek_${item.reservationId}`"
                  type="checkbox"
                />
                <label :for="`reservationWeek_${item.reservationId}`">
                  <span></span>{{ item.startDate }}~{{ item.endDate }} (ID:{{
                    item.reservationId
                  }})
                </label>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div class="single_Material">
        <label class="ad-radio-label">
          <input
            v-model="singleMaterial"
            :value="0"
            type="radio"
            name="singleMaterial"
            @change="changeSingleMaterial()"
          />
          <span class="ad-radio"></span> 單一素材
        </label>
        <el-select
          v-if="singleMaterial === 0"
          v-model="selectSingleMaterial"
          placeholder="請選擇"
          no-data-text="無素材"
          @change="changeSingleMaterialMenu"
        >
          <el-option
            v-for="item in weekMaterial"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="multiple_Material">
        <div>
          <label class="ad-radio-label">
            <input
              v-model="singleMaterial"
              :value="1"
              type="radio"
              name="singleMaterial"
              @change="changeSingleMaterial()"
            />
            <span class="ad-radio"></span> 多個素材
          </label>
        </div>
        <div v-if="singleMaterial === 1" class="seven_days">
          <ul>
            <li v-for="(item, index) in multipleMaterial" :key="index">
              Day{{ index + 1 }}.<el-select
                v-model="multipleMaterial[index]"
                placeholder="請選擇"
                no-data-text="無素材"
              >
                <el-option
                  v-for="item in weekMaterial"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </li>
          </ul>
        </div>
      </div>
      <div class="submit">
        <button
          @click="submit"
          :class="{ disabled: !canSubmit }"
          :disabled="!canSubmit"
        >
          送出
        </button>
      </div>
    </div>
    <CopyMaterialToOtherScheduleDialog
      :isShow="showSubmitDialog"
      :totalTaskCount="selectedReservationId.length"
      :doneTaskCount="apiResCont"
      @dialogCancel="dialogCancel"
      @dialogConfirm="showSubmitDialog = false"
    />
  </DropDownRow>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DropDownRow from "@/components/share/DropDownRow";
import CopyMaterialToOtherScheduleDialog from "./CopyMaterialToOtherScheduleDialog";
import { monthText } from "@/utils/dateFormat";

const state = () => {
  return {
    isEdit: false,
    showSubmitDialog: false,
    weekMaterial: [],
    reservationScheduleYear: [],
    reservationScheduleYearFocus: "",
    reservationScheduleData: [],
    singleMaterial: 0,
    selectSingleMaterial: "",
    selectSingleMaterialOptions: [],
    multipleMaterial: ["", "", "", "", "", "", ""],
    currentSelectedMonth: "",
    // 已選擇的檔期
    selectedReservationId: [],
    apiResCont: 0
  };
};

export default {
  name: "CopyMaterialToOtherSchedule",
  data() {
    return {
      ...state()
    };
  },
  props: {
    isActive: {
      type: Boolean
    },
    isFocus: {
      type: Boolean
    },
    reservationId: {
      type: Number
    }
  },
  components: {
    DropDownRow,
    CopyMaterialToOtherScheduleDialog
  },
  computed: {
    ...mapGetters("material", ["getMaterialExposuresListData"]),
    materialReservationGrouping() {
      return this.getMaterialExposuresListData.materialReservationGrouping;
    },
    reservationSchedule() {
      return this.getMaterialExposuresListData.reservationSchedule;
    },
    reservationMonth() {
      return this.reservationScheduleData.reduce((acc, el) => {
        if (acc.hasOwnProperty(monthText(el.month))) {
          acc[monthText(el.month)] = [...acc[monthText(el.month)], el];
        } else {
          acc[monthText(el.month)] = [el];
        }
        return acc;
      }, {});
    },
    reservationWeek() {
      return this.reservationMonth[this.currentSelectedMonth];
    },
    canSubmit() {
      return (
        this.multipleMaterial[0] &&
        this.multipleMaterial[1] &&
        this.multipleMaterial[2] &&
        this.multipleMaterial[3] &&
        this.multipleMaterial[4] &&
        this.multipleMaterial[5] &&
        this.multipleMaterial[6] &&
        this.selectedReservationId.length > 0
      );
    }
  },
  methods: {
    ...mapActions("material", ["postMaterialDuplicate"]),
    // 編輯
    handleEdit() {
      if (!this.isActive) return;
      this.isEdit = !this.isEdit;
    },
    // 設定 data 為預設值
    resetComponentData() {
      Object.assign(this.$data, state());
    },
    // 變更單一與多個素材選項
    changeSingleMaterial() {
      this.selectSingleMaterial = "";
      this.multipleMaterial = ["", "", "", "", "", "", ""];
    },
    // 選擇單一素材選單
    changeSingleMaterialMenu() {
      this.multipleMaterial = [];
      for (let i = 0; i < 7; i++) {
        this.multipleMaterial.push(this.selectSingleMaterial);
      }
    },
    // 取消所有單月週期
    cancelAllWeekFromMouth(monthName) {
      this.reservationMonth[monthName].forEach(el => {
        const index = this.selectedReservationId.indexOf(el.reservationId);
        const selectedReservationIdCopy = this.selectedReservationId.slice();
        selectedReservationIdCopy.splice(index, 1);
        this.selectedReservationId = selectedReservationIdCopy;
      });
    },
    // 選取所有單月週期
    selectAllWeekFromMouth(monthName) {
      this.reservationMonth[monthName].forEach(el => {
        const weekIsNotSelected =
          this.selectedReservationId.indexOf(el.reservationId) === -1;
        if (weekIsNotSelected) {
          this.selectedReservationId = [
            ...this.selectedReservationId,
            el.reservationId
          ];
        }
      });
    },
    toggleAllWeekFromMouth(monthName) {
      const isAllWeekCheck =
        this.calcSelectedWeekFromMonth(monthName) ===
        this.reservationMonth[monthName].length;
      if (isAllWeekCheck) {
        this.cancelAllWeekFromMouth(monthName);
      } else {
        this.selectAllWeekFromMouth(monthName);
      }
    },
    calcSelectedWeekFromMonth(monthName) {
      return this.reservationMonth[monthName].reduce((acc, el) => {
        if (this.selectedReservationId.indexOf(el.reservationId) !== -1) {
          acc += 1;
        }
        return acc;
      }, 0);
    },
    // 全部清除
    clearSelectedWeek() {
      this.selectedReservationId = [];
    },
    // 送出
    async submit() {
      const {
        multipleMaterial,
        reservationId,
        selectedReservationId,
        postMaterialDuplicate
      } = this;
      let query = {
        materials: multipleMaterial,
        reservationSourceId: reservationId,
        reservationTargetId: selectedReservationId[0]
      };

      this.apiResCont = 0;
      this.showSubmitDialog = true;

      for (let i = 0; i < selectedReservationId.length; i++) {
        query = {
          ...query,
          reservationTargetId: selectedReservationId[i]
        };
        await postMaterialDuplicate(query).then(() => {
          this.apiResCont += 1;
        });
      }
    },
    dialogCancel() {
      this.$emit("dialogCancel");
    }
  },
  watch: {
    isActive(newVal) {
      if (newVal) this.isEdit = true;
    },
    // 素材
    materialReservationGrouping(newVal) {
      this.weekMaterial = [];
      newVal.forEach(item => {
        if (item.current) {
          this.weekMaterial = item.materials;
        }
      });
    },
    // 已預約檔期
    reservationSchedule(newVal) {
      this.reservationScheduleData = newVal;
      newVal.forEach(item => {
        if (
          this.reservationScheduleYear.length < 1 ||
          this.reservationScheduleYear[0] !== item.year
        ) {
          this.reservationScheduleYear.push(item.year);
        }
      });
      if (this.reservationScheduleYear.length > 0)
        this.reservationScheduleYearFocus = this.reservationScheduleYear[0];
      if (newVal.length !== 0) {
        this.currentSelectedMonth = monthText(newVal[0].month);
      }
    }
  }
};
</script>

<style>
.single_Material .el-select {
  width: 380px;
}
.seven_days .el-select {
  width: 220px;
  margin-left: 8px;
}
</style>
<style lang="scss" scoped>
.no-schedule {
  color: #ea475b;
  margin-top: 20px;
  letter-spacing: 1px;
}

.copy-to-other-schedule-title {
  margin-top: 24px;
}

.week_material_main {
  display: flex;
  padding-bottom: 24px;
  border-bottom: 1px solid #d6d6d6;
  position: relative;

  &::after {
    display: inline-block;
    content: " ";
    height: 10px;
    width: 10px;
    border-width: 1px 0 0 1px;
    border-color: #d6d6d6;
    border-style: solid;
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: absolute;
    background-color: #fff;
    bottom: -5px;
    left: 50%;
  }

  .week_material_left {
    width: 58px;
    min-height: 46px;
    margin-top: 16px;

    img {
      margin: 11px 17px 0 17px;
    }
  }

  .week_material_right {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;

    div {
      background-color: #e1fafa;
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #00afb8;
      margin: 0 2px 2px 0;
      padding: 12px;

      span {
        color: #292929;
      }
    }
  }
}

.scheduled {
  margin-top: 24px;

  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #292929;
    margin-bottom: 16px;
  }

  .year {
    display: flex;
    justify-content: space-between;
    width: 600px;

    .left {
      span {
        font-size: 14px;
        font-weight: bold;
        border-radius: 12px;
        border: solid 1px #00afb8;
        background-color: #fff;
        padding: 2px 8px;
        color: #00afb8;
        margin-right: 4px;
        cursor: pointer;

        &.focus {
          background-color: #00afb8;
          color: #fff;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .right {
      line-height: 1.38;
      letter-spacing: 1px;
      color: #8f8f8f;
      font-size: 16px;
      font-weight: initial;
      cursor: pointer;

      img {
        width: 22px;
      }
    }
  }

  ul {
    display: flex;
    border: solid 1px #ddd;
    width: 600px;
    margin: 16px 0;

    li {
      width: 300px;
      margin-bottom: 0;

      dl {
        margin-bottom: 0;

        dd {
          padding: 8px 16px;
          margin-bottom: 0;
          border-bottom: 1px solid #eee;
          height: 38px;

          &:last-child {
            border-bottom: 0;
          }

          &.reservation_month {
            cursor: pointer;
            &.active {
              background-color: #fff;
              color: #00afb8;
            }
          }
        }
      }

      &:nth-child(1) {
        dl {
          dd {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f3f3f3;
            border: 1px solid #eee;
            color: #8f8f8f;
            font-weight: normal;

            .select_number {
              width: 16px;
              height: 16px;
              background-color: #00afb8;
              border-radius: 50%;
              font-size: 12px;
              font-weight: bold;
              color: #fff;
              display: inline-block;
              text-align: center;
              margin-right: 12px;
            }
          }
        }
      }

      &:nth-child(2) {
        dl {
          dd {
            color: #00afb8;
            line-height: 1.38;
            letter-spacing: 1.38px;
            font-weight: normal;
            border: 1px solid #eee;
          }
        }
      }
    }
  }
}

.single_Material {
  display: inline-flex;
  align-items: center;
  margin-top: 8px;

  label {
    width: 98px;
    margin-right: 28px;
  }
}

.multiple_Material {
  margin-top: 16px;

  .seven_days {
    padding: 0 0 16px 32px;
    margin-top: 16px;
    border-bottom: 1px solid #ddd;

    ul {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 0;

      li {
        font-size: 12px;
        font-weight: bold;
        width: 270px;
        margin: 0 26px 8px 0;
        line-height: 1.5;
        letter-spacing: 1.5px;
        color: #292929;

        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
}

.submit {
  text-align: right;

  button {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #00afb8;
    border: solid 1px #00afb8;
    padding: 6px 20px;
    background-color: #fff;
    margin-top: 24px;

    &.disabled {
      border: solid 1px #a9a9a9;
      color: #a9a9a9;
      cursor: not-allowed;
    }
  }
}
</style>
