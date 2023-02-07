<template>
  <div class="CompareInputFixed paddingX-rwd py-4">
    <div class="outer">
      <div class="compare-container position-relative">
        <div class="back" v-show="activeSide !== null">
          <button @click.prevent="actionHandler('blur', this.activeSide)">
            <i class="jb_icon_left"></i>
          </button>
        </div>
        <div class="inner" ref="area">
          <AcSearchInput
            class="input input-left"
            @update:companyName="$emit('update:compareName', [$event, 0])"
            @update:companyCustno="$emit('update:compareCustno', [$event, 0])"
            :currentCompany="currentCompany[0]"
            :companyName="compareName[0]"
            :companyCustno="compareCustno[0]"
            @focusing="actionHandler('focus', 0)"
            @unfocus="actionHandler('blur', 0)"
          />
          <div class="vs t2 font-weight-bold">VS</div>
          <AcSearchInput
            class="input input-right"
            @update:companyName="$emit('update:compareName', [$event, 1])"
            @update:companyCustno="$emit('update:compareCustno', [$event, 1])"
            :currentCompany="currentCompany[1]"
            :companyName="compareName[1]"
            :companyCustno="compareCustno[1]"
            @focusing="actionHandler('focus', 1)"
            @unfocus="actionHandler('blur', 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AcSearchInput from "@/components/AcSearchInput.vue";
export default {
  name: "CompareInputFixed",
  components: {
    AcSearchInput
  },
  props: {
    currentCompany: {
      type: Array,
      required: true
    },
    compareName: {
      type: Array,
      required: true
    },
    compareCustno: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeSide: null
    };
  },
  methods: {
    actionHandler(type, idx) {
      const side = idx > 0 ? "right" : "left";
      if (type === "focus") {
        this.activeSide = idx;
        this.$refs.area.classList.add(side);
      } else {
        this.activeSide = null;
        this.$refs.area.classList.remove(side);
      }
    }
  }
};
</script>

<style lang="scss">
.CompareInputFixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 10001;
  height: 76px;
  box-shadow: 0 2px 4px 0 rgba(41, 41, 41, 0.2);
  .outer {
    max-width: 912px;
    margin: 0 auto;
    @include device-up(lg) {
      max-width: 1120px;
    }
    @include device-up(xl) {
      max-width: 1192px;
      @include support-ie {
        max-width: 1200px;
      }
    }
  }
  .ac-dropdown {
    &.el-popper .el-scrollbar__wrap {
      max-height: calc(44px * 7);
      @include support-ie {
        max-height: calc(44px * 7 + 16px);
      }
    }
  }
  .compare-container,
  .inner {
    width: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .inner {
    flex: 1 1 100%;
    &.left {
      .vs,
      .input-right {
        flex-basis: 0;
      }
    }
    &.right {
      .vs,
      .input-left {
        flex-basis: 0;
      }
    }
  }
  .input {
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 100%;
    overflow: hidden;
    transition: flex-basis 0.12s ease-out;
  }
  .vs {
    text-align: center;
    flex: 0 0 40px;
    overflow: hidden;
  }
  .back {
    flex: 0 0 40px;
    font-size: 24px;
    color: get-color(text-info);
    align-self: stretch;
    button {
      height: 100%;
      display: flex;
      align-items: center;
      outline: none;
      border: none;
      background-color: transparent;
      padding: 0;
    }
  }
}
</style>
