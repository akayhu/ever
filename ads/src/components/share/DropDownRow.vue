<template>
  <section class="dropdown_row" :class="{ active: isFocus }">
    <div class="dropdown_row_panel d-flex align-items-center">
      <div class="dropdown_row_panel_title d-flex align-items-center">
        {{ title }}
        <icon
          v-if="toolTipText"
          class="ml-2"
          iconName="ic-help-outline"
          size="16"
          v-tooltip="{
            placement: 'right',
            offset: 5,
            content: toolTipText,
            trigger: 'hover'
          }"
        />
      </div>
      <div class="dropdown_row_panel_tiptext">
        <template v-if="isPanelSlotUsed">
          <slot v-show="isContentShow" name="panel" />
        </template>
        <span
          v-else
          v-show="isTipTextShow"
          :class="{
            normal: tipTextStatus === 'normal',
            warning: tipTextStatus === 'warning',
            danger: tipTextStatus === 'danger'
          }"
          >{{ tipText }}</span
        >
      </div>
      <button
        class="dropdown_row_panel_editbtn bg-transparent border-0"
        :style="{ cursor: calcIsEditBtnClickAble ? 'pointer' : 'not-allowed' }"
        @click.stop="onEditBtnClick"
      >
        <img :src="currentIcon" />
      </button>
    </div>
    <div
      v-if="isContentShow"
      :class="{ dropdown_row_content: title !== '緊急上下架' }"
    >
      <div v-if="subTitle" class="dropdown_row_content_subtitle mt-2">
        {{ subTitle }}
      </div>
      <slot />
    </div>
  </section>
</template>

<script>
import expandLessSvg from "@/assets/icon/icon-arrow-up.svg";
import editSvg from "@/assets/icon/edit.svg";
import expandMoreSvg from "@/assets/icon/icon-arrow-down-disable.svg";

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    toolTipText: {
      type: String,
      default: () => ""
    },
    tipText: {
      type: String,
      default: () => ""
    },
    tipTextStatus: {
      typr: String,
      default: () => "normal"
    },
    subTitle: {
      type: String,
      default: () => ""
    },
    isActive: {
      type: Boolean,
      required: true
    },
    isFocus: {
      type: Boolean,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    isEditBtnClickAble: {
      type: Boolean,
      default: () => true
    },
    special: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentIcon() {
      if (this.special) {
        return expandMoreSvg;
      } else if (this.isActive) {
        return this.isContentShow ? expandLessSvg : editSvg;
      } else {
        return expandMoreSvg;
      }
    },
    isPanelSlotUsed() {
      return !!this.$slots.panel;
    },
    isTipTextShow() {
      // return this.toolTipText && this.isActive && !this.isEdit;
      return this.toolTipText && this.isActive && !this.isEdit;
    },
    isContentShow() {
      // return this.isActive && this.isFocus && this.isEdit;
      return this.isActive && this.isEdit;
    },
    calcIsEditBtnClickAble() {
      return this.isEditBtnClickAble && this.isActive;
    }
  },
  methods: {
    onEditBtnClick() {
      if (!this.calcIsEditBtnClickAble || this.special) return;
      this.$emit("onEditBtnClick");
    }
  },
  watch: {
    isEdit(newVal) {
      if (newVal) {
        this.$emit("onEditOpen");
      } else {
        this.$emit("onEditOff");
      }
    },
    isActive(newVal) {
      if (newVal) {
        this.$emit("onActiveOpen");
      } else {
        this.$emit("onActiveOff");
      }
    },
    isFocus(newVal) {
      if (newVal) {
        this.$emit("onFocusOpen");
      } else {
        this.$emit("onFocusOff");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.dropdown_row {
  width: 100%;
  position: relative;

  &.active {
    border-color: $blue-turquoise;
  }

  .dropdown_row_panel {
    min-height: 32px;

    .dropdown_row_panel_title {
      flex: 0 0 306px;
      max-width: 306px;
      @include font-common(24px, 500);
      letter-spacing: 1px;
    }

    .dropdown_row_panel_tiptext {
      flex: 1 1 auto;

      > span {
        @include font-common(16px, $font-weight-bold);

        &.normal {
          color: $black;
        }

        &.warning {
          color: $yellow;
        }

        &.danger {
          color: $red;
          font-size: 14px;
        }
      }
    }
  }

  .dropdown_row_content {
    .dropdown_row_content_subtitle {
      @include font-common(16px, $font-weight-normal, $gray-700);
    }
  }
}
</style>
