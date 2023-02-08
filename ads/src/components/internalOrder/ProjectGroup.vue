<template>
  <div>
    <div class="group_header">
      <div>
        <span class="seq">{{ projectIndex + 1 }}. </span>
        <span class="name">專案{{ getNumberConverter(projectIndex) }}</span>
      </div>
      <div>
        <span>
          共 <span class="seq">{{ productCount }}</span> 筆
        </span>
        <span
          v-if="!isViewForm && salesOrderStore.projectList.length > 1"
          @click="
            salesOrderStore.removeProject(
              salesOrderStore.projectList[projectIndex].tempId
            )
          "
          ><icon iconName="btn-close" size="16"
        /></span>
      </div>
    </div>
    <div>
      <div v-if="!isViewForm" class="edit_mode">
        <div class="data_row mb-6">
          <div class="data_col">
            <label class="label_field">預約專案</label>
          </div>
          <div class="data_col w480">
            <div class="d-flex align-items-center">
              <input
                widthType="480"
                v-model="project.name"
                :class="{ error_message_border: v$.name.$error }"
                placeholder="請輸入"
              />
              <icon
                class="ml-2"
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
              />
            </div>
            <div v-if="v$.name.$error" class="error_message">
              {{ v$.name.$errors[0].$message }}
            </div>
          </div>
        </div>

        <!-- 編輯 -->
        <div
          v-for="(productGroup, key, productGroupIndex) in productGroups"
          :key="key"
        >
          <ProductGroup
            :project="project"
            :groupInfo="productGroup"
            :canCreate="
              project.newProductList.length === 0 &&
                productGroupIndex === productCount - 1
            "
            class="new_product"
          />
        </div>

        <!-- 新增 -->
        <ProductEditor
          v-for="(newProduct, index) in project.newProductList"
          :key="newProduct.tempId"
          :project="project"
          :product="newProduct"
          :showAddBtn="index == project.newProductList.length - 1"
          :editMode="'create'"
        />
      </div>
      <div v-else>
        <div class="data_row pl-6">
          <div class="data_col">
            <label class="label_field">預約專案</label>
          </div>
          <div class="data_col">
            <div class="label_viewer">{{ project.name }}</div>
          </div>
        </div>
        <div>
          <div v-for="(productGroup, key) in productGroups" :key="key">
            <ProductViewer
              v-for="product in productGroup.productList"
              class="view_mode"
              :key="product.tempId"
              :project="project"
              :product="product"
              :groupEditing="false"
            />
          </div>
        </div>
      </div>

      <SettingAgent
        ref="settingAgent"
        :project="project"
        :settingAgentStatus="isPjSettingOpened"
        :closeSettingAgent="closePjSetting"
        :savePjSetting="savePjSetting"
        :isEmptyBoard="quotationData.customerId == '1112153878'"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, toRefs } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { getNumberConverter } from "@/utils/util.js";
import moment from "moment";
import useVuelidate from "@vuelidate/core";
import { helpers, requiredIf, maxLength } from "@vuelidate/validators";
import { useFormStatus } from "@/composables/quotation/useFormStatus";
import ProductGroup from "@/components/internalOrder/ProductGroup.vue";
import ProductEditor from "@/components/internalOrder/ProductEditor.vue";
import SettingAgent from "@/components/share/SettingAgent.vue";
import ProductViewer from "@/components/internalOrder/ProductViewer.vue";

export default {
  components: { ProductGroup, ProductEditor, SettingAgent, ProductViewer },
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
    const { quotationData } = toRefs(salesOrderStore);
    const { isViewForm, canEdit } = useFormStatus();
    const projectCount = computed(() => salesOrderStore.projectList.length);
    const productGroups = computed(() => {
      return props.project.quotationAdList
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
    });
    const productCount = computed(() => {
      if (!canEdit.value) {
        return props.project.quotationAdList.length;
      } else {
        return (
          Object.keys(productGroups.value).length +
          props.project.newProductList?.length
        );
      }
    });
    const settingAgent = ref(null);
    const isHover = ref(false);
    const isPjSettingOpened = ref(false);

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
      Object.entries(data).forEach(([key, value]) => {
        props.project[key] = value;
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
              props.project.newProductList.some(p => p.productName)
          )
        )
      }
    };

    const v$ = useVuelidate(rules, props.project, {
      $autoDirty: true
    });

    return {
      v$,
      salesOrderStore,
      quotationData,
      isViewForm,
      isHover,
      settingAgent,
      isPjSettingOpened,
      projectCount,
      productGroups,
      productCount,
      getNumberConverter,
      openPjSetting,
      closePjSetting,
      savePjSetting
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/views/orderManage/internalOrder";

.group_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;

  span {
    @include font-common(16px, $font-weight-bold);
  }

  .seq {
    color: #00afb8;
  }

  img {
    margin-left: 19px;
    align-self: center;
    cursor: pointer;
    width: 16px;
  }
}

.label_field {
  margin-right: 28px;
}

.edit_mode {
  margin-top: 24px;
  margin-bottom: 24px;
}

.view_mode {
  border-bottom: 1px solid #ddd;
}
</style>
