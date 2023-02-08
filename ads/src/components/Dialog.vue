<template>
  <transition name="dialog-effect">
    <div
      v-if="isShow"
      class="dialog d-flex align-items-center justify-content-center position-fixed"
    >
      <div class="dialog_shadow position-absolute" />
      <div class="dialog_body position-relative">
        <div @click="dialogCancel" class="dialog_cross position-absolute">
          ×
        </div>
        <div class="dialog_title">
          <icon iconName="icon-line" /> {{ title
          }}<span v-if="theEssential" class="the-essential"
            >{{ theEssential }} <span>!!</span></span
          >
        </div>
        <div v-if="content" v-text="content" class="dialog_content" />
        <div class="dialog_btn d-flex justify-content-center">
          <button
            v-if="cancelButton"
            v-text="'取消'"
            @click="dialogCancel"
            class="dialog_btn_cancel"
          />
          <button
            v-text="'確定'"
            @click="dialogConfirm"
            class="dialog_btn_confirm"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
let resolve = null;

export default {
  name: "Dialog",
  props: {
    title: {
      type: String,
      default: "",
      required: true
    },
    content: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      required: true
    },
    cancelButton: {
      type: Boolean,
      default: true
    },
    theEssential: {
      type: String,
      default: ""
    }
  },
  watch: {
    isShow: newVal => {
      if (newVal) {
        document.querySelector("body").style.overflow = "hidden";
      } else {
        document.querySelector("body").style.overflow = "auto";
      }
    }
  },
  methods: {
    dialogCancel() {
      this.$emit("dialogCancel");
      if (resolve) resolve(false);
    },
    dialogConfirm() {
      this.$emit("dialogConfirm");
      if (resolve) resolve(true);
    },
    confirm() {
      return new Promise((resolse, reject) => {
        resolve = resolse;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
      margin-top: 10px;
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
    margin-top: 50px;

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

    .dialog_btn_cancel {
      background-color: #fff;
      color: #00afb8;
      margin-right: 30px;
    }
  }
}
</style>
