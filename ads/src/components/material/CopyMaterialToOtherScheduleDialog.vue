<template>
  <transition name="dialog-effect">
    <div
      v-if="isShow"
      class="dialog d-flex align-items-center justify-content-center position-fixed"
    >
      <div class="dialog_shadow position-absolute" />
      <div class="dialog_body position-relative">
        <div class="d-flex justify-content-center align-items-center">
          <div class="d-flex flex-column justify-content-start">
            <div class="dialog_content ml-8">
              <icon v-if="process === 100" iconName="icon-line-on" size="16" />
              <icon v-else iconName="icon-line" size="16" />
              <span>上傳進度</span>
              <span class="process-bar position-relative d-inline-block mx-2">
                <span
                  class="process-bar process-bar_done position-absolute"
                  :style="{ width: `${process}%` }"
                ></span>
              </span>
              <span>
                已完成
                <span class="done-task-number">{{ doneTaskCount }}</span> /
                {{ totalTaskCount }}
              </span>
            </div>
            <div class="dialog_title mb-4 text-left">
              <span class="align-middle">
                <span v-if="process === 100">
                  批次素材上傳設定已完成 !<br />
                  是否要繼續上傳這張委刊單其他版位的素材?
                </span>
                <span v-else>批次素材上傳設定中，請勿關閉頁面 !</span>
              </span>
            </div>
          </div>
        </div>
        <div class="dialog_btn mt-10 d-flex justify-content-center">
          <button
            v-if="process === 100"
            v-text="'取消'"
            @click="dialogCancel"
            class="dialog_btn_cancel"
          />
          <button
            v-text="'確定'"
            :disabled="process !== 100"
            class="dialog_btn_confirm"
            :class="{ disabled: process !== 100 }"
            @click="dialogConfirm"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    totalTaskCount: {
      type: Number,
      required: true
    },
    doneTaskCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    process() {
      return Math.round((this.doneTaskCount / this.totalTaskCount) * 100);
    }
  },
  methods: {
    dialogCancel() {
      this.$emit("dialogCancel");
    },
    dialogConfirm() {
      this.$emit("dialogConfirm");
    }
  }
};
</script>

<style lang="scss" scoped>
.done-task-number {
  color: #00afb8;
}

.process-bar {
  height: 10px;
  width: 200px;
  border-radius: 10px;
  background-color: #ddd;
  transition: width 0.3s;

  &.process-bar_done {
    left: 0;
    top: 0;
    background-color: #8debc8;
  }
}

.dialog-effect-enter-active,
.dialog-effect-leave-active {
  transition: all 0.3s ease-in-out;
}

.dialog-effect-enter,
.dialog-effect-leave-to {
  opacity: 0;
}

.dialog-effect-enter-to,
.dialog-effect-leave {
  opacity: 1;
}

.dialog-effect-enter,
.dialog-effect-leave-to {
  transform: translateY(-30px);
}

.dialog-effect-enter-to,
.dialog-effect-leave {
  transform: translateY(0px);
}

.dialog {
  z-index: 9999;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  .dialog_shadow {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .dialog_body {
    min-width: 720px;
    min-height: 350px;
    padding: 100px 50px;
    text-align: center;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 20px 0 #a9a9a9;
    z-index: 1;

    .dialog_title {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.4;
      letter-spacing: 1.4px;
      color: #333;
      margin-left: 65px;

      img {
        vertical-align: text-top;
      }

      .the-essential {
        color: #ea475b;

        span {
          color: #333;
        }
      }
    }

    .dialog_content {
      font-size: 16px;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #8f8f8f;
      margin-bottom: 12px;

      img {
        margin-right: 10px;
        vertical-align: bottom;
      }
    }
  }

  .dialog_cross {
    right: 0px;
    top: 0px;
    font-size: 40px;
    margin: 0 25px;
    cursor: pointer;
    line-height: 2;
  }

  .dialog_btn {
    > button {
      min-width: 154px;
      line-height: 38px;
      border-width: 1px;
      border: 1px solid #00afb8;
      text-align: center;
      font-size: 18px;
      border-radius: 4px;
    }

    .dialog_btn_confirm {
      background-color: #00afb8;
      color: #fff;
      &.disabled {
        background-color: #a9a9a9;
        border: 1px solid #a9a9a9;
        cursor: not-allowed;
      }
    }

    .dialog_btn_cancel {
      background-color: #fff;
      color: #00afb8;
      margin-right: 30px;
    }
  }
}
</style>
