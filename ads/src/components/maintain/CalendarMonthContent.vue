<template>
  <table cellpadding="0" cellspacing="0" class="table_calendar">
    <thead>
      <tr>
        <td>
          <div class="day_block">
            <div class="ml-3">
              <icon
                v-if="!maintainData.canEdit"
                class="mr-2 disabled"
                iconName="icon-icon-date"
              />
              <ADSDatePicker
                v-if="maintainData.canEdit"
                v-model="allJobDate"
                align="left"
                type="singlerange"
                placeholder="選擇日期"
                format="yyyy/MM/dd"
                :picker-options="pickerOptions"
                :disableArrow="true"
                :disabled="maintainData.content.length === 0"
                :allJobText="`${allJobLength ? '刪除' : '新增'}`"
                @blur="cancelClick"
                @change="datePickerConfirm($event)"
              >
                <template v-slot:custom_input>
                  <icon
                    class="mr-2"
                    :disabled="maintainData.content.length === 0"
                    :iconName="
                      maintainData.content.length > 0
                        ? 'icon-icon-date-link'
                        : 'icon-icon-date'
                    "
                    v-tooltip="{
                      content: '全部職缺設定',
                      placement: 'top-start',
                      offset: 5,
                      trigger: 'hover',
                      show: showTooltip
                    }"
                  />
                </template>
              </ADSDatePicker>
              職務名稱<icon
                v-tooltip="{
                  content: '如欲看職務可點選下列職務名稱',
                  offset: 5,
                  placement: 'right',
                  trigger: 'hover'
                }"
                class="image_info"
                iconName="icon-info-warmgray"
                size="16"
              />
            </div>
            <div>
              <icon
                v-if="!firstDate"
                @click.native="changeMonth('prev')"
                iconName="icon-arrow-left"
              />
              <icon
                v-else
                v-tooltip="{
                  content: `您選擇的專案區間為${maintainData.period.start}~${maintainData.period.end}`,
                  offset: 5,
                  placement: 'right',
                  trigger: 'hover'
                }"
                iconName="icon-arrow-left-disable"
                disabled
              />
            </div>
          </div>
        </td>
        <td
          v-for="(item, index) in monthData"
          :key="index"
          :class="{
            holiday:
              item.week === '六' ||
              item.week === '日' ||
              getHoliday(item.date.replaceAll('/', '-'))
          }"
        >
          <div class="day_block">
            <span :class="{ toDay: item.isToday }">{{ item.day }}</span>
          </div>
        </td>
        <td>
          <div class="day_block">
            <icon
              v-if="!lastData"
              @click.native="changeMonth('next')"
              iconName="icon-arrow-right"
            />
            <icon
              v-else
              v-tooltip="{
                content: `您選擇的專案區間為${maintainData.period.start}~${maintainData.period.end}`,
                offset: 5,
                placement: 'left',
                trigger: 'hover'
              }"
              iconName="icon-arrow-right-disable"
              disabled
            />
          </div>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(jobItem, jobItemIndex) in maintainData.content"
        :key="jobItem.jobNo"
      >
        <td>
          <div>
            <input
              v-model="allJob"
              type="checkbox"
              :id="`job_checkbox_${jobItemIndex}`"
              :value="jobItem.jobNo"
              :disabled="!maintainData.canEdit"
              @change="updateRowSetting($event, jobItemIndex)"
            />
            <label :for="`job_checkbox_${jobItemIndex}`"><span></span></label>
          </div>
          <div class="job_title">
            <a
              :href="getJobUrl(jobItem.jobNo)"
              rel="noopener noreferrer"
              target="_blank"
              v-tooltip="{
                content: jobItem.jobName,
                offset: 5,
                placement: 'right',
                trigger: 'hover'
              }"
              class="title"
            >
              {{ jobItem.jobName }}
            </a>
            <div class="jobNo">{{ jobItem.jobNo }}</div>
          </div>
        </td>
        <td
          v-for="(item, itemIndex) in jobItem.setting"
          :key="item.id"
          :class="{
            no_data: !monthData[itemIndex].date,
            click:
              clickLocation.itemIndex === itemIndex &&
              clickLocation.jobItemIndex === jobItemIndex,
            no_range: !item.range,
            no_data: !maintainData.canEdit
          }"
          @click="setDate(itemIndex, jobItemIndex)"
        >
          <span
            v-if="item.range && maintainData.canEdit"
            :selectl-line="item.choice ? 'middle' : ''"
            :class="{
              clickToEdit:
                item.choice &&
                clickLocation.itemIndex === itemIndex &&
                clickLocation.jobItemIndex === jobItemIndex,
              clickToSet:
                !item.choice &&
                clickLocation.itemIndex === itemIndex &&
                clickLocation.jobItemIndex === jobItemIndex
            }"
            class="content"
          >
          </span>
          <ADSDatePicker
            v-if="maintainData.canEdit"
            v-model="dateValue"
            align="left"
            type="singlerange"
            placeholder="選擇日期"
            format="yyyy/MM/dd"
            :picker-options="pickerOptions"
            :disableArrow="true"
            @focus="
              handleFocus(
                monthData[itemIndex].month,
                monthData[itemIndex].day,
                jobItemIndex
              )
            "
            @blur="cancelClick"
            @confirmClick="
              datePickerConfirm(
                $event,
                jobItem.jobNo,
                monthData[itemIndex].month,
                monthData[itemIndex].day
              )
            "
          >
            <template v-slot:custom_input>
              <span
                v-if="item.range && !item.choice"
                class="date_picker_td"
              ></span>
            </template>
          </ADSDatePicker>
          <span
            v-if="
              item.range &&
                item.choice &&
                clickLocation.itemIndex === itemIndex &&
                clickLocation.jobItemIndex === jobItemIndex
            "
            class="delete_content"
          >
            <div class="delete_icon">
              <icon
                @click.native.stop="cancelClick"
                iconName="btn-close"
                size="16"
              />
            </div>
            <div class="delete_text">
              是否刪除
              <span>
                {{ monthData[itemIndex].month }}/{{ monthData[itemIndex].day }}
              </span>
            </div>
            <div class="delete_btn">
              <button @click.stop="cancelClick" class="button_cancel">
                取消
              </button>
              <button
                @click.stop="handleDelete(jobItem.jobNo)"
                class="button_submit"
              >
                確認
              </button>
            </div>
          </span>
          <div
            v-if="!item.range && monthData[itemIndex].date"
            class="slash"
          ></div>
        </td>
        <td v-for="day in padDays" :key="day" class="no_data">
          <div class="slash"></div>
        </td>
        <td></td>
      </tr>
      <tr v-if="maintainData.content.length === 0" class="no_data">
        <th></th>
        <th colspan="25">此區間無刊登職缺</th>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { holiday } from "@/utils/nationalHoliday.js";
import { getDateFormat } from "@/utils/dateFormat.js";
import { getDaysInYearMonth } from "@/utils/dateProcessing.js";
import { encodeCustno } from "@/utils/jobCode.js";
import moment from "moment";

const FORMAT_STRING = "YYYY/MM/DD";

export default {
  props: {
    monthData: {
      type: Array,
      default: () => []
    },
    year: {
      type: Number,
      default: 2022
    },
    month: {
      type: Number,
      default: 1
    },
    prevCurrentNextMonthData: {
      type: Function,
      default: () => {}
    },
    haveDays: {
      type: Number,
      default: 31
    },
    maintainData: {
      type: Object,
      default: () => {}
    },
    changeSwitchState: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const allJobDate = ref([]);
    const allJob = ref([]);
    const dateValue = ref([]);
    const clickLocation = ref({
      itemIndex: "",
      jobItemIndex: ""
    });
    const pickerOptions = ref({
      activeRange: []
    });
    const showTooltip = ref(false);

    const firstDate = computed(() => {
      const splitPeriodDataStart = props.maintainData.period.start.split("/");
      const periodYear = Number(splitPeriodDataStart[0]);
      const periodMonth = Number(splitPeriodDataStart[1]);
      return periodYear === props.year && periodMonth === props.month;
    });

    const lastData = computed(() => {
      const splitPeriodDataEnd = props.maintainData.period.end.split("/");
      const periodYear = Number(splitPeriodDataEnd[0]);
      const periodMonth = Number(splitPeriodDataEnd[1]);
      return periodYear === props.year && periodMonth === props.month;
    });

    const padDays = computed(() => {
      const dataDays = props.maintainData.content[0].setting.length;
      let result = [];
      for (let i = dataDays; i < 31; i++) {
        result.push(i);
      }
      return result;
    });

    const allJobLength = computed(
      () => allJob.value.length === props.maintainData.content.length
    );

    // 全選行事曆預設值
    const AllDatePickerDefaule = () => {
      const periodStartDate = props.maintainData.period.start;
      const periodLastDate = props.maintainData.period.end;
      allJobDate.value = [
        `${props.year}/${props.month}/01`,
        `${props.year}/${props.month}/${getDaysInYearMonth(
          props.year,
          props.month
        )}`
      ];
      if (firstDate.value) allJobDate.value[0] = periodStartDate;
      if (lastData.value) allJobDate.value[1] = periodLastDate;
    };

    // 判斷職務名稱全部是否有勾選
    const selectAllDataCheckbox = () => {
      allJob.value = [];
      props.maintainData.content.forEach(contentItem => {
        let rangeData = [];
        contentItem.setting.forEach(settingItem => {
          if (settingItem.range) {
            rangeData.push(settingItem);
          }
        });
        if (rangeData.every(rangeItem => rangeItem.choice)) {
          allJob.value.push(contentItem.jobNo);
        }
      });
    };

    // 取國定假日
    const getHoliday = date => (holiday[date] ? true : false);

    // 取消點擊
    const cancelClick = () => {
      clickLocation.value.itemIndex = "";
      clickLocation.value.jobItemIndex = "";
    };

    // 確認刪除
    const handleDelete = jobNo => {
      let val = [
        {
          jobNo,
          start: props.monthData[clickLocation.value.itemIndex].date,
          end: props.monthData[clickLocation.value.itemIndex].date
        }
      ];
      deleteSetting(val);
      selectAllDataCheckbox();
      cancelClick();
    };

    // 選取某職務某一天的日期位置
    const setDate = (itemIndex, jobItemIndex) => {
      if (!props.maintainData.canEdit) return;
      clickLocation.value.itemIndex = itemIndex;
      clickLocation.value.jobItemIndex = jobItemIndex;
    };

    // 切換上下月
    const changeMonth = type => {
      type === "prev"
        ? props.changeSwitchState("month", "prev")
        : props.changeSwitchState("month", "next");
      cancelClick();
    };

    const handleFocus = (month, day, jobItemIndex) => {
      pickerOptions.value.activeRange = [];
      props.maintainData.content[jobItemIndex].setting.forEach(item => {
        if (item.choice) pickerOptions.value.activeRange.push(item.date);
      });
      dateValue.value = [
        `${props.year}/${month}/${day}`,
        `${props.year}/${month}/${day}`
      ];
    };

    const createSetting = value => {
      emit("createJobSetting", value);
    };

    const deleteSetting = value => {
      emit("deleteJobSetting", value);
    };

    // 小日曆點擊確定事件
    const datePickerConfirm = (val, jobNo) => {
      if (!val) return;
      let returnValue = [];
      AllDatePickerDefaule();

      // 設定單一職缺
      if (jobNo) {
        returnValue.push({
          start: getDateFormat(val[0], FORMAT_STRING),
          end: getDateFormat(val[1], FORMAT_STRING),
          jobNo
        });

        createSetting(returnValue);
        selectAllDataCheckbox();
      } else {
        // 設定多職缺
        props.maintainData.content.forEach(item => {
          returnValue.push({
            start: getDateFormat(val[0], FORMAT_STRING),
            end: getDateFormat(val[1], FORMAT_STRING),
            jobNo: item.jobNo
          });
        });

        // checkbox 未全選。新增設定
        if (props.maintainData.content.length !== allJob.value.length) {
          createSetting(returnValue);
        } else {
          allJob.value = [];
          deleteSetting(returnValue);
        }
        selectAllDataCheckbox();
      }
    };

    // 單獨操作職務名稱 Checkbox
    const updateRowSetting = (e, index) => {
      const jobNo = e.target.value;
      let rangeData = [];
      props.maintainData.content[index].setting.forEach(settingItem => {
        if (settingItem.range) {
          rangeData.push(settingItem);
        }
      });
      let start = rangeData[0].date;
      let end = rangeData[rangeData.length - 1].date;
      let returnValue = [
        {
          start: getDateFormat(start, FORMAT_STRING),
          end: getDateFormat(end, FORMAT_STRING),
          jobNo: Number(jobNo)
        }
      ];

      e.target.checked
        ? createSetting(returnValue)
        : deleteSetting(returnValue);
    };

    const getJobUrl = jobno => {
      const jobCode = encodeCustno(jobno);
      return `https://www.${process.env.VUE_APP_DOMAIN}.com.tw/job/${jobCode}`;
    };

    watch(props.monthData, newVal => {
      dateValue.value = [newVal[0].date, newVal[0].date];
      allJobDate.value = [newVal[0].date, newVal[0].date];
    });

    onMounted(() => {
      const periodStartDate = props.maintainData.period.start;
      const periodLastDate = props.maintainData.period.end;
      pickerOptions.value.disabledDate = time => {
        let firstDate = moment([props.year, props.month - 1]).startOf("month");
        if (firstDate.isSameOrBefore(periodStartDate))
          firstDate = moment(periodStartDate);
        let lastDate = moment([props.year, props.month - 1]).endOf("month");
        if (lastDate.isSameOrAfter(periodLastDate))
          lastDate = moment(periodLastDate);
        return firstDate > time || time > lastDate;
      };
      dateValue.value = [props.monthData[0].date, props.monthData[0].date];
      selectAllDataCheckbox();
      setTimeout(() => {
        showTooltip.value = true;
      }, 0);
    });

    AllDatePickerDefaule();

    return {
      allJobDate,
      allJob,
      clickLocation,
      dateValue,
      pickerOptions,
      showTooltip,
      firstDate,
      lastData,
      padDays,
      allJobLength,
      getHoliday,
      cancelClick,
      handleDelete,
      setDate,
      changeMonth,
      handleFocus,
      datePickerConfirm,
      updateRowSetting,
      getJobUrl
    };
  }
};
</script>

<style lang="scss" scoped>
.table_calendar {
  thead {
    background-color: #fff;
    position: sticky;
    top: 194px;
    z-index: 5;

    tr {
      td {
        width: 30px;
        color: #292929;
        text-align: center;
        height: 54px;
        vertical-align: middle;

        img {
          transform: translateY(-2px);
          cursor: pointer;

          &.disabled {
            cursor: not-allowed;
          }
        }

        &.holiday {
          color: #fe7c7c;
        }

        .day_block {
          border-bottom: 1px solid #eee;
          height: 54px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &:nth-child(1) {
          width: 220px;
          color: #000;
          font-weight: bold;
          letter-spacing: 1.38px;
          text-align: left;

          > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          img {
            &:nth-child(2) {
              margin-left: 8px;
              vertical-align: sub;
            }
          }
        }

        .toDay {
          background-color: #292929;
          border-radius: 50%;
          color: #fff;
          padding: 1px 0;
          width: 24px;
          display: inline-block;
          height: 24px;
        }
      }
    }
  }

  tbody {
    tr {
      &.no_data {
        color: #fd223d;
        text-align: center;
        letter-spacing: 1px;
        margin: 150px 0;

        th {
          border: 0;
          padding: 150px 0;
          font-weight: normal;
          &.hover {
            border: none;
          }
        }
      }

      td {
        height: 48px;
        text-align: center;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        vertical-align: middle;
        cursor: pointer;
        position: relative;
        z-index: 1;
        width: 30px;

        &:hover {
          border: 1px solid #00afb8;
          z-index: 3;

          .content {
            border-right: 1px solid #00afb8;
            width: 29px;
            right: -1px;
          }
        }

        &.no_data {
          cursor: initial;

          &:hover {
            border: 1px solid #eee;
          }
        }

        .date_picker_td {
          width: 29px;
          height: 40px;
          display: block;
          position: relative;
          z-index: 2;
        }

        &.no_range {
          cursor: initial;

          &:hover {
            border-top: 1px solid #eee;
            border-left: 1px solid #eee;
            border-right: 0;
            border-bottom: 0;
          }
        }

        .slash {
          height: 0px;
          border-top: 1px solid #d8d8d8;
          width: 56px;
          transform: rotate(121deg);
          -o-transform: rotate(121deg);
          -moz-transform: rotate(121deg);
          -webkit-transform: rotate(121deg);
          top: 23px;
          left: -14px;
          cursor: initial;
          position: absolute;
        }

        &:nth-child(1) {
          padding-left: 10px;
          letter-spacing: 1.38px;
          text-align: left;
          border-left: 0;
          cursor: initial;
          display: flex;
          align-items: center;
          width: 220px;

          &:hover {
            border-left: 0;
            border-top: 1px solid #eee;
            border-right: 0;
            border-bottom: 0;
          }

          > div {
            &.job_title {
              letter-spacing: 1.43px;
              line-height: 1;

              .title {
                font-size: 14px;
                color: #1654b9;
                display: inline-block;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 170px;
                overflow: hidden;
              }

              .jobNo {
                font-size: 12px;
                color: #797979;
              }
            }
          }
        }
        &:last-child {
          cursor: initial;

          &:hover {
            border-left: 1px solid #eee;
            border-top: 1px solid #eee;
            border-right: 0;
            border-bottom: 0;
          }
        }
        &:last-child {
          border-top: 0;

          &:hover {
            border: 0;
            border-left: 1px solid #eee;
          }
        }

        &.click {
          z-index: 4;
        }

        span {
          &.content {
            display: block;
            height: 16px;
            width: 30px;
            position: absolute;
            z-index: 2;
            right: 0;
            top: 16px;

            &[selectl-line="middle"] {
              background-color: #c6ecee;
            }
            &.clickToEdit {
              border-radius: 8px;
              border: 1px solid #00afb8;
              left: 0;
            }
            &.clickToSet {
              border-radius: 8px;
              background-color: #00afb8;
              right: 0;
            }
            &.editStatus {
              border-radius: 8px;
              border: solid 1px #00afb8;
              right: 0;
            }
          }
        }

        .delete_content {
          position: absolute;
          background-color: #fff;
          padding: 20px 24px;
          border: solid 1px #e2e1e1;
          width: 190px;
          top: 40px;
          left: -5px;
          z-index: 4;
          border-radius: 4px;
          box-shadow: 0px 2px 10px 0px #ccc;

          &::before {
            content: " ";
            display: inline-block;
            border-style: solid;
            border-width: 0 7px 7px 7px;
            border-color: transparent transparent #a9a9a9 transparent;
            position: absolute;
            top: -7px;
            left: 11px;
          }
          &::after {
            content: " ";
            display: inline-block;
            border-style: solid;
            border-width: 0 7px 7px 7px;
            border-color: transparent transparent #fff transparent;
            position: absolute;
            top: -7px;
            left: 11px;
          }

          .delete_icon {
            text-align: right;

            img {
              cursor: pointer;
            }
          }
          .delete_text {
            text-align: left;
            letter-spacing: 1.43px;
            margin-top: 12px;

            span {
              color: #00afb8;
              margin-left: 4px;
            }
          }

          .delete_btn {
            margin-top: 12px;

            .button_cancel {
              width: 58px;
              text-align: center;
              padding: 6px 0;
              color: #00afb8;
              background-color: #fff;
              border-radius: 4px;
              border: 1px solid #00afb8;
              font-size: 14px;
              letter-spacing: 1.43px;
              margin-right: 16px;
            }

            .button_submit {
              width: 58px;
              text-align: center;
              padding: 6px 0;
              color: #fff;
              background-color: #00afb8;
              border-radius: 4px;
              border: 0px;
              font-size: 14px;
              letter-spacing: 1.43px;
            }
          }
        }
      }

      &:nth-child(1) {
        td {
          border-top: 1px solid #fff;

          &:hover {
            border-top: 1px solid #00afb8;
          }
          &.no_data,
          &.no_range {
            &:hover {
              border-top: 1px solid #fff;
            }
          }
          &:nth-child(1),
          &:last-child {
            &:hover {
              border-top: 1px solid #fff;
            }
          }
        }
      }

      &:last-child {
        td {
          border-bottom: 1px solid #eee;

          &:hover {
            border-bottom: 1px solid #00afb8;
          }

          &.no_range,
          &.no_data,
          &:nth-child(1),
          &:last-child {
            &:hover {
              border-bottom: 1px solid #eee;
            }
          }
        }
      }
    }
  }
}
</style>
