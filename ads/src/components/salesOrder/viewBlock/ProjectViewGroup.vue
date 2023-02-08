<template>
  <div>
    <div class="project_group">
      <div class="project_group_index">
        <span></span>
        專案{{ getNumberConverter(projectIndex) }}
      </div>
      <div class="project_group_name">{{ project.name }}</div>
      <div class="project_group_count">
        共
        <span>{{ project.quotationAdList.length }}</span>
        筆<span class="fold" @click="switchOpen = !switchOpen"
          >收合<icon
            :iconName="switchOpen ? 'icon-arrow-up' : 'icon-arrow-down'"
            size="24"
        /></span>
      </div>
    </div>

    <div v-if="switchOpen">
      <div class="banner_group"><span>1. </span>banner廣告</div>
      <CommodityBlockView
        v-for="product in project.quotationAdList.filter(p => p.type === 1)"
        :key="product.id"
        :project="project"
        :product="product"
        :handleEditing="null"
      />

      <div class="banner_group mt-6"><span>2. </span>其他類型</div>
      <OtherTypeCommodityBlockView
        v-for="product in project.quotationAdList.filter(p => p.type === 2)"
        :key="product.id"
        :project="project"
        :product="product"
        :handleEditing="null"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getNumberConverter } from "@/utils/util.js";
import CommodityBlockView from "@/components/salesOrder/quoteContentComponent/CommodityBlockView.vue";
import OtherTypeCommodityBlockView from "@/components/salesOrder/quoteContentComponent/OtherTypeCommodityBlockView.vue";

export default {
  components: {
    CommodityBlockView,
    OtherTypeCommodityBlockView
  },
  props: {
    project: {
      type: Object,
      default: () => {}
    },
    projectIndex: {
      type: Number,
      default: 1
    }
  },
  setup() {
    const switchOpen = ref(true);
    return {
      switchOpen,
      getNumberConverter
    };
  }
};
</script>

<style lang="scss" scoped>
.project_group {
  display: flex;
  align-items: baseline;
  margin-bottom: 28px;

  span {
    color: #19b9c0;
  }

  &_index {
    @include font-common(18px, $font-weight-bold, $gray-900);
    margin-right: 24px;
    display: flex;
    align-items: center;

    > span {
      width: 10px;
      height: 10px;
      margin-right: 8px;
      background-color: #00b2ba;
    }
  }

  &_name {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    max-width: 650px;

    input {
      width: 480px;
    }
  }

  &_count {
    margin-left: auto;
    @include font-common(16px, $font-weight-bold);

    .fold {
      color: #292929;
      font-size: 18px;
      margin-left: 12px;
      cursor: pointer;

      img {
        margin-left: 8px;
      }
    }
  }
}

.banner_group {
  @include font-common(16px, $font-weight-bold, $gray-900);
  margin-bottom: 8px;

  > span {
    color: #00afb8;
  }
}
</style>
