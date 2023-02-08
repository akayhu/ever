<template>
  <transition name="dialog-effect">
    <div v-if="isShow" class="modal">
      <div class="modal_mask"></div>
      <div class="modal_container" :style="`width: ${width}px`">
        <div class="modal_header">
          <div class="title">
            {{ title }}
            <span v-if="comment" class="comment">
              <img src="@/assets/icon/icon-info-warmgray.svg" />
              {{ comment }}
            </span>
          </div>
          <slot name="header" />
          <div @click="close" class="modal_cross">
            <img src="@/assets/icon/icon-delete-big.svg" />
          </div>
        </div>
        <div class="modal_body"><slot name="body" /></div>
        <div class="modal_footer"><slot name="footer" /></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    title: {
      type: String,
      default: "",
      required: true
    },
    comment: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      required: true
    },
    width: {
      type: String,
      required: false
    }
  },
  methods: {
    close() {
      this.$emit("close");
      document.querySelector("body").classList.remove("overflow-hidden");
    },
    openModal() {
      document.querySelector("body").classList.add("overflow-hidden");
    }
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        this.openModal();
      } else {
        this.close();
      }
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

.overflow-hidden {
  overflow: hidden;
}

.modal {
  position: fixed;
  top: 0px;
  right: 0;
  bottom: 0px;
  left: 0;
  z-index: 2000;
  overflow: hidden;

  &_mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  &_container {
    position: relative;
    width: 950px;
    background-color: #fff;
    border-radius: 8px;
    margin: 80px auto;
    display: flex;
    flex-direction: column;
    z-index: 2;
    max-height: calc(100% - 5rem);
    padding: 24px 0 24px 24px;

    .modal_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-right: 24px;
      line-height: 1.4;
      letter-spacing: 1.4px;
      color: #333;

      .title {
        font-size: 20px;
        font-weight: bold;
        display: inline-flex;
        align-items: center;
      }

      .comment {
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.43;
        letter-spacing: 1.43px;
        color: #7e7e7e;

        img {
          margin: 0 4px 0 8px;
          vertical-align: middle;
        }
      }

      .modal_cross {
        font-size: 30px;
        cursor: pointer;
        color: #8b8b8b;
      }
    }

    .modal_body {
      padding-right: 24px;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 14px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #aaa;
        border: 4px solid #fff;
        background-clip: padding-box;
      }
    }

    .modal_footer {
      padding-right: 24px;
    }
  }

  .dialog_content {
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #8f8f8f;
    margin-top: 10px;
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
