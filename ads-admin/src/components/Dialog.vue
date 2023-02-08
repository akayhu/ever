<template>
  <div>
    <el-dialog
      :model-value="showDialog"
      :before-close="handleClose"
      :show-close="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="720px"
      @closed="closeFunc"
    >
      <slot>
        <div class="dialog_main">
          <div class="dialog_title">
            <img v-if="!complete" src="@/assets/icon/icon-line.svg" />
            <img v-if="complete" src="@/assets/icon/icon-line-complete.svg" />
            {{ title }}
          </div>
          <div class="dialog_annotation">{{ content }}</div>
          <button
            @click="closeDialog"
            class="dialog_button_div button_bg_white_large"
          >
            關閉
          </button>
        </div>
      </slot>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Dialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    delayTime: {
      type: Boolean,
      default: false,
      required: false
    },
    jumpPath: {
      type: String,
      required: false
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    closeFunc: {
      type: Function,
      required: false
    },
    complete: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    let timer;
    onMounted(() => {
      if (props.delayTime && props.showDialog) {
        timer = setTimeout(() => {
          if (props.jumpPath)
            router.push({ path: `${props.jumpPath}` }).catch(() => {});
          if (props.closeFunc) props.closeFunc();
        }, 3000);
      }
    });
    onBeforeUnmount(() => {
      clearTimeout(timer);
    });
    const handleClose = done => {
      if (props.closeFunc) props.closeFunc();
      if (done) done();
    };
    const closeDialog = () => {
      if (props.jumpPath) {
        clearTimeout(timer);
        router.push({ path: `${props.jumpPath}` }).catch(() => {});
      }
      if (props.closeFunc) props.closeFunc();
    };

    return {
      handleClose,
      closeDialog
    };
  }
});
</script>

<style>
.el-dialog {
  border-radius: 8px !important;
  box-shadow: 0 2px 20px 0 #a9a9a9;
  border: solid 1px #e2e1e1;
  background-color: #fff;
}
.el-dialog__body {
  padding: 24px 50px !important;
  width: 620px;
  font-family: "微軟正黑體", "Microsoft JhengHei", Arial !important;
}
.el-dialog__wrapper .el-dialog__header {
  padding: 0 !important;
}
</style>

<style lang="scss" scoped>
.dialog_main {
  width: 480px;
  margin: 120px auto;
  text-align: center;

  .dialog_title {
    font-size: 20px;
    font-weight: bold;
    line-height: 1.4;
    letter-spacing: 1.4px;
    color: #333;

    img {
      vertical-align: text-top;
    }
  }

  .dialog_annotation {
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #8f8f8f;
    margin-top: 10px;
  }

  .dialog_button_div {
    margin-top: 20px;
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
  position: fixed;
  align-items: center;
  justify-content: center;
  display: flex;

  .dialog_shadow {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
  }

  .dialog_cross {
    right: 0px;
    top: 0px;
    font-size: 40px;
    margin: 0 25px;
    cursor: pointer;
    position: absolute;
    line-height: 2;
  }

  .dialog_btn {
    margin-top: 50px;
    display: flex;
    justify-content: center;

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
    }
  }
}
</style>
