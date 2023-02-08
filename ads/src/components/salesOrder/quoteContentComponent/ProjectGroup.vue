<template>
  <div>
    <div class="project_group">
      <div class="project_group_index">
        <span></span>
        專案{{ getNumberConverter(projectIndex) }}
        <div class="necessary inline-block">*</div>
      </div>
      <div class="project_group_name">
        <input
          v-model="project.name"
          type="text"
          class="input_field"
          placeholder="請輸入"
          :class="{
            error_message_border: v$.$dirty && v$.name.$error
          }"
        />
        <icon
          :iconName="
            isHover
              ? 'icon-more-icon-managerment-hover'
              : 'icon-more-icon-managerment'
          "
          v-tooltip="{
            content: '設定代理人等相關資訊',
            offset: 5,
            placement: 'right',
            trigger: 'hover'
          }"
          :disabled="!project.name"
          @mouseover.native="isHover = true"
          @mouseout.native="isHover = false"
          @click.native="openPjSetting"
          class="ml-2"
        />
        <div v-if="v$.$dirty && v$.name.$error" class="error_message">
          {{ v$.name.$errors[0].$message }}
        </div>
      </div>
      <div class="project_group_count">
        共 <span>{{ productCount }}</span> 筆
        <icon
          v-if="projectCount > 1"
          iconName="btn-close"
          size="16"
          @click.native="deleteProject(project.tempId)"
        />
      </div>
    </div>
    <div class="banner_group"><span>1. </span>banner廣告</div>

    <!-- 編輯 -->
    <div
      v-for="(productGroup, key, productGroupIndex) in bannerGroups"
      :key="key"
    >
      <ProductGroup
        :project="project"
        :groupInfo="productGroup"
        :canCreate="
          project.newProductList.length === 0 &&
            productGroupIndex === productCount - 1
        "
      />
    </div>

    <!-- 新增 -->
    <CommodityBlockEdit
      v-for="(newProduct, index) in project.newProductList"
      :key="newProduct.tempId"
      :project="project"
      :product="newProduct"
      :canCreate="index == project.newProductList.length - 1"
      status="create"
    />

    <div class="banner_group"><span>2. </span>其他類型</div>

    <!-- 編輯 -->
    <div v-for="(product, index) in otherTypesGroups" :key="product.id">
      <OtherProductGroup
        :project="project"
        :product="product"
        :canCreate="
          project.newOtherList.length === 0 &&
            index === otherTypesGroups.length - 1
        "
      />
    </div>

    <!-- 新增 -->
    <OtherTypeCommodityBlockEdit
      v-for="(newProduct, index) in project.newOtherList"
      :key="newProduct.tempId"
      :project="project"
      :product="newProduct"
      :canCreate="index == project.newOtherList.length - 1"
      status="create"
    />

    <SettingAgent
      ref="settingAgent"
      :project="project"
      :settingAgentStatus="isPjSettingOpened"
      :closeSettingAgent="closePjSetting"
      :savePjSetting="savePjSetting"
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { requiredIf, maxLength, helpers } from "@vuelidate/validators";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { getNumberConverter } from "@/utils/util.js";
import { round } from "@/utils/quotation";
import moment from "moment";
import ProductGroup from "@/components/salesOrder/quoteContentComponent/ProductGroup.vue";
import CommodityBlockEdit from "@/components/salesOrder/quoteContentComponent/CommodityBlockEdit.vue";
import SettingAgent from "@/components/share/SettingAgent.vue";
import OtherTypeCommodityBlockEdit from "@/components/salesOrder/quoteContentComponent/OtherTypeCommodityBlockEdit.vue";
import OtherProductGroup from "@/components/salesOrder/quoteContentComponent/OtherProductGroup.vue";

export default {
  components: {
    ProductGroup,
    CommodityBlockEdit,
    OtherTypeCommodityBlockEdit,
    SettingAgent,
    OtherProductGroup
  },
  props: {
    project: {
      type: Object,
      require: true
    },
    projectIndex: {
      type: Number,
      require: true
    }
  },
  setup(props) {
    const salesOrderStore = useSalesOrderStore();
    const settingAgent = ref(null);
    const isHover = ref(false);
    const isPjSettingOpened = ref(false);
    const projectCount = computed(() => salesOrderStore.projectList.length);
    const bannerGroups = computed(() => {
      let result = props.project.quotationAdList
        .filter(p => p.id && p.type === 1)
        .reduce((groups, product) => {
          const key = product.productId;
          groups[key] ||= {
            tempId: product.tempId,
            quotationId: product.quotationId,
            projectId: props.project.tempId,
            productId: product.productId,
            productName: product.productName,
            usage: product.usage,
            deduction: product.deduction,
            giveaway: product.giveaway,
            quantity: 0,
            unit: "DAY",
            quotationStartDate: product.quotationStartDate,
            quotationEndDate: product.quotationEndDate,
            free: [],
            price: 0,
            marketPrice: product.marketPrice,
            unitPrice: null,
            floorPrice: product.floorPrice,
            discountPercentage: 0,
            productList: []
          };
          groups[key].productList.push(product);
          groups[key].free.push(product.free);
          groups[key].quantity +=
            product.unit === "DAY" ? product.quantity : product.quantity * 7;
          groups[key].price += +product.price;
          groups[key].quotationStartDate =
            moment(product.quotationStartDate) <
            moment(groups[key].quotationStartDate)
              ? product.quotationStartDate
              : groups[key].quotationStartDate;
          groups[key].quotationEndDate =
            moment(product.quotationEndDate) >
            moment(groups[key].quotationEndDate)
              ? product.quotationEndDate
              : groups[key].quotationEndDate;
          return groups;
        }, {});
      Object.entries(result).forEach(([key, groupData]) => {
        groupData.unitPrice = round(groupData.price / groupData.quantity, 1);
        groupData.discountPercentage =
          groupData.marketPrice === 0
            ? 0
            : round((groupData.unitPrice / groupData.marketPrice) * 10, 1);
      });

      return result;
    });
    const otherTypesGroups = computed(() =>
      props.project.quotationAdList.filter(p => p.id && p.type === 2)
    );
    const productCount = computed(
      () =>
        Object.keys(bannerGroups.value).length +
        props.project.newProductList?.length
    );
    const otherGroups = computed(() => {
      let result = props.project.quotationAdList.filter(
        p => p.id && p.type === 2
      );
      return result;
    });

    // 刪除專案
    const deleteProject = projectId => {
      salesOrderStore.removeProject(projectId);
    };

    // 打開設定專案內容
    const openPjSetting = () => {
      if (!props.project.name) return;

      isPjSettingOpened.value = true;
      settingAgent.value.init();
    };

    // 關閉設定專案內容
    const closePjSetting = () => {
      isPjSettingOpened.value = false;
    };

    // 設定專案內容
    const savePjSetting = data => {
      isPjSettingOpened.value = false;
      let project = salesOrderStore.getSpecifiedProject(props.project.tempId);
      if (!project) return;
      Object.entries(data).forEach(([key, value]) => {
        project[key] = value;
      });
    };

    const rules = {
      name: {
        maxLength: helpers.withMessage("字數超過上限", maxLength(50)),
        required: helpers.withMessage(
          "請輸入專案名稱",
          requiredIf(
            () =>
              props.project.quotationAdList.some(p => p.productName) ||
              props.project.newProductList.some(p => p.productName) ||
              props.project.newOtherList.some(p => p.productName)
          )
        )
      }
    };

    const v$ = useVuelidate(rules, props.project, {
      $autoDirty: true
    });

    return {
      v$,
      isHover,
      isPjSettingOpened,
      settingAgent,
      projectCount,
      bannerGroups,
      productCount,
      otherGroups,
      getNumberConverter,
      deleteProject,
      openPjSetting,
      closePjSetting,
      savePjSetting,
      otherTypesGroups
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

  img {
    vertical-align: text-bottom;
    margin-left: 14px;
    cursor: pointer;
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

    img {
      cursor: pointer;
    }
  }

  &_count {
    margin-left: auto;
    @include font-common(16px, $font-weight-bold);
  }
}

.banner_group {
  @include font-common(16px, $font-weight-bold, $gray-900);
  margin-bottom: 8px;

  > span {
    color: #00afb8;
  }
}

.error_message {
  width: 100%;
}
</style>
