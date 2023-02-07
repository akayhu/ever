<template>
  <el-dialog
    ref="lightbox"
    custom-class="lightbox"
    :visible="showLightBox"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="appendToBody"
  >
    <template slot="title">
      <div class="lightbox-title t2 font-weight-bold">
        {{ title }}
      </div>
      <i class="jb_icon_delete" @click="closeAndClearLightBox()"></i>
    </template>

    <div class="lightbox-content t4">{{ content }}</div>
    <div class="additional-content mx-auto">
      <slot name="additional-content"></slot>
    </div>
    <div slot="footer" class="dialog-footer text-center px-6">
      <div class="additional-description">
        <slot name="additional-description"></slot>
      </div>
      <div class="d-flex justify-content-center">
        <button
          :data-gtm-form="leftBtnContent"
          v-if="showCancelBtn"
          class="btn btn-outline-primary font-weight-bold"
          @click.prevent="
            closeAndClearLightBox();
            leftBtnCallBack();
          "
        >
          {{ leftBtnContent }}
        </button>
        <button
          :data-gtm-form="rightBtnContent"
          v-if="showConfirmBtn"
          class="btn btn-secondary font-weight-bold"
          :class="{
            'ml-3': showCancelBtn,
            'ml-md-5': showCancelBtn
          }"
          @click.prevent="
            closeAndClearLightBox();
            rightBtnCallBack();
          "
        >
          {{ rightBtnContent }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    showConfirmBtn: {
      type: Boolean,
      default: true
    },
    leftBtnContent: {
      type: String,
      default: null
    },
    rightBtnContent: {
      type: String,
      default: null
    },
    showLightBox: {
      type: Boolean,
      required: true
    },
    closeAndClearLightBox: {
      type: Function,
      required: true
    },
    leftCallBack: {
      type: Function,
      default: null
    },
    rightCallBack: {
      type: Function,
      default: null
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    leftBtnCallBack() {
      const { leftCallBack } = this;
      if (!leftCallBack) return;
      leftCallBack();
    },
    rightBtnCallBack() {
      const { rightCallBack } = this;
      if (!rightCallBack) return;
      rightCallBack();
    }
  }
};
</script>

<style lang="scss">
.lightbox {
  width: 280px;
  border-radius: 4px;
  @include device-up(md) {
    width: 480px;
  }

  &-title {
    color: get-color(text);
  }
  &-content {
    color: get-color(text);
  }

  .jb_icon_delete {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 16px;
    color: get-color(text-info);
    cursor: pointer;
  }

  button {
    width: 100%;
    max-width: 116px;
    padding: 5px 16px;
    font-size: 14px;
    line-height: 20px;
  }
}

.el-dialog__header {
  padding: 24px 24px 20px;
}

.el-dialog__body {
  padding: 0 24px 32px;
}

.el-dialog__footer {
  padding: 0 0 24px;
  @include device-up(md) {
    padding: 0 0 32px;
  }
}

.additional-content {
  max-width: 336px;
}

.additional-description {
  color: get-color(text-info);
}

#company-lists {
  .lightbox {
    margin: 0 !important;
    width: 100%;
    min-width: 360px;
    height: 100vh;
    border-radius: unset;
    @include device-up(md) {
      width: 720px;
      height: auto;
      margin: 15vh auto 50px !important;
      border-radius: 4px;
    }

    .lightbox-title,
    .lightbox-content {
      text-align: center;
    }

    .jb_icon_delete {
      font-size: 24px;
      @include device-up(md) {
        font-size: 16px;
      }
    }

    button {
      width: 100%;
      max-width: 336px;
      height: 44px;
      font-size: 18px;
      @include device-up(md) {
        width: 154px;
      }
    }
  }

  .el-dialog__body {
    min-height: 80px;
    padding: 0 24px;
    margin-bottom: 48px;
  }
}

#company-lists-vote,
#company-lists-interview {
  .lightbox {
    margin: 0 !important;
    width: 100%;
    min-width: 360px;
    height: 100vh;
    border-radius: unset;
    @include device-up(md) {
      width: 720px;
      height: auto;
      margin: 15vh auto 50px !important;
      border-radius: 4px;
    }

    .lightbox-title,
    .lightbox-content {
      text-align: center;
    }

    .jb_icon_delete {
      font-size: 24px;
      @include device-up(md) {
        font-size: 16px;
      }
    }

    button {
      width: 100%;
      max-width: 336px;
      height: 44px;
      font-size: 18px;
      @include device-up(md) {
        width: 154px;
      }
    }
  }

  .el-dialog__body {
    min-height: 188px;
    padding: 0 24px 28px;
  }

  .el-dialog__footer {
    display: none;
  }
}
</style>
