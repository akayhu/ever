<template>
  <div class="arrow_switch_tabs d-flex align-items-center">
    <div
      class="single_tab"
      :class="{ single_tab_active: tab.key === value }"
      v-for="tab in tabsData"
      :key="tab.key"
      @click="selectTab(tab.key)"
    >
      {{ tab.label }}
    </div>
    <div
      ref="underneathDiamond"
      class="underneath_diamond diamond position-absolute"
    ></div>
    <div
      ref="upperDiamond"
      class="upper_diamond diamond position-absolute"
    ></div>
  </div>
</template>

<script>
export default {
  name: "Arrow_Switch_tab",
  props: {
    tabsData: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  mounted() {
    this.changeArrowPosition();
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.changeArrowPosition();
      });
    }
  },
  methods: {
    selectTab(tabValue) {
      this.$emit("select-tab", tabValue);
    },
    changeArrowPosition() {
      const activeTab = document.querySelector(".single_tab_active");
      const activeTabToLeft = activeTab.offsetLeft;
      const activeTabWidth = activeTab.offsetWidth;
      const undeathSquare = this.$refs.underneathDiamond;
      const uppperSquare = this.$refs.upperDiamond;
      const squareWidth = undeathSquare.offsetWidth;
      const squareMidLine = Math.ceil(Math.sqrt(Math.pow(squareWidth, 2) * 2));
      const squareOffset = (activeTabWidth - squareMidLine) / 2;
      undeathSquare.style.left = uppperSquare.style.left = `${activeTabToLeft +
        squareOffset}px`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.arrow_switch_tabs {
  @include font-common(16px);
  position: relative;
  height: 50px;
  border-bottom: solid 1px #e2e1e1;
  box-shadow: 0px 4px 4px -3px rgba(197, 197, 197, 0.5);

  .single_tab {
    cursor: pointer;

    &_active {
      color: #00cbd2;
    }
  }

  .single_tab:first-child {
    margin-left: 40px;
  }

  .single_tab:not(:first-child) {
    margin-left: 60px;
  }

  .diamond {
    width: 12px;
    height: 12px;
    background: $white;
    transform: rotate(45deg);
  }

  .underneath_diamond {
    box-shadow: inset 1px 1px 4px 0px rgba(197, 197, 197, 0.9);
    top: 44px;
  }
  .upper_diamond {
    top: 47px;
  }
}
</style>
