<template>
  <div>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div class="schedule_bar">
        <div class="title">簽核者</div>
        <div>
          <div class="schedule_line" :style="styleVar">
            <div
              v-for="(item, index) in schedule?.normalSegment.records"
              :key="index"
              @click="showPointContent(index)"
              class="point"
              :class="
                `${
                  currentPointIndex === index
                    ? 'not_signed'
                    : currentPointIndex > index
                    ? 'signed'
                    : 'default'
                }  point--${index}`
              "
            >
              <div v-if="pointIndex === index" class="point_date">
                <div class="mb-3">
                  送簽時間<span class="ml-3">{{
                    item.requestDate || "- -"
                  }}</span>
                </div>
                <div>
                  簽核時間<span class="ml-3">{{
                    item.reviewDate || "- -"
                  }}</span>
                </div>
              </div>
              <div class="point_name">
                {{ item.approver?.empName || item.allowedApprover[0].empName }}
                {{
                  item.approver &&
                  item.approver?.empId !== item.allowedApprover[0].empId
                    ? "(代)"
                    : ""
                }}
              </div>
              <div v-if="item.tag === 'TL1'" class="point_note">(法務)</div>
            </div>
          </div>
        </div>
      </div>
      <div class="description">
        <div class="title">說明：</div>
        <div class="content">
          {{ schedule?.normalSegment.records[pointIndex]?.note || "- -" }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, toRefs, computed } from "vue";
import { useReviewStore } from "@/stores/review";
import Loading from "@/components/Loading.vue";

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    reviewType: {
      type: String,
      required: true
    }
  },
  components: {
    Loading
  },
  setup(props) {
    const reviewStore = useReviewStore();
    const { loading, schedule } = toRefs(reviewStore);
    const legalSchedule = computed(() => reviewStore.legalSchedule);
    const pointIndex = ref(0);
    const currentPointIndex = computed(() => {
      if (legalSchedule === 0 || legalSchedule === null) {
        // 簽核中或是駁回
        return -1;
      } else {
        return pointIndex.value;
      }
    });
    const styleVar = computed(() => ({
      "--width": `${schedule.value?.normalSegment.records.length * 120 || 0}px`
    }));

    const showPointContent = type => {
      pointIndex.value = type;
    };

    reviewStore
      .getResourceSchedule({
        id: props.id,
        type: props.reviewType
      })
      .then(() => {
        pointIndex.value =
          schedule.value?.normalSegment.records.findIndex(
            record => record.result === null
          ) || 0;
      });

    return {
      loading,
      schedule,
      pointIndex,
      currentPointIndex,
      styleVar,
      legalSchedule,
      showPointContent
    };
  }
};
</script>

<style lang="scss" scoped>
.schedule_bar {
  min-height: 126px;
  display: flex;
  align-items: flex-end;
  color: #292929;

  .schedule_line {
    position: relative;
    width: var(--width);
    border-radius: 5px;
    background-color: #d8d8d8;
    height: 10px;
    margin: 0 0 5px 4px;

    .default {
      background-color: #d8d8d8;

      &::after {
        border: 5px solid #d8d8d8;
      }
    }

    .not_signed {
      background-color: #6dd9df;

      &::after {
        border: 5px solid #00afb8;
      }
    }

    .signed {
      background-color: #c1e66c;

      &::after {
        border: 5px solid #90cb03;
      }
    }

    .turn_down {
      background-color: #ffc2c2;

      &::after {
        border: 5px solid #e94141;
      }
    }

    .point {
      height: 10px;
      border-radius: 5px;
      position: relative;

      &::after {
        content: " ";
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: #fff;
        border-radius: 10px;
        position: absolute;
        right: -10px;
        bottom: -5px;
        cursor: pointer;
      }

      @for $i from 0 through 10 {
        &--#{$i} {
          width: ($i + 1) * 120px;
          top: $i * -10px;
          z-index: 10 - $i;
        }
      }
    }

    .point_date {
      position: absolute;
      border-left: dashed 1px #979797;
      padding: 7px 0 24px 12px;
      width: 300px;
      top: -85px;
      right: -300px;

      span {
        color: #00afb8;
      }

      &::before {
        content: " ";
        background-color: #fff;
        width: 9px;
        height: 9px;
        border-radius: 10px;
        border: 1px solid #979797;
        display: inline-block;
        position: absolute;
        left: -5px;
        top: -5px;
      }
    }

    .point_name {
      font-size: 16px;
      color: #797979;
      position: absolute;
      bottom: -32px;
      right: -36px;
    }

    .point_note {
      font-size: 16px;
      color: #797979;
      position: absolute;
      bottom: -50px;
      right: -28px;
    }
  }
}

.description {
  display: flex;
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 1.43px;
  color: #292929;
  margin-top: 50px;
  font-weight: initial;

  .title {
    min-width: 60px;
    font-size: 16px;
    font-weight: bold;
  }

  .content {
    max-width: 600px;
  }
}
</style>
