<template>
  <div>
    <div v-click-outside="onClickOutside">
      <!-- 新增專案 -->
      <div v-if="!editStatus">
        <CommodityBlockEdit
          :project="project"
          :product="groupInfo.productList[0]"
        />
      </div>

      <!-- 專案列表 -->
      <div v-if="editStatus">
        <div
          v-show="
            groupInfo.productList.length > 1 ||
              (groupInfo.productList.length <= 1 && !editing)
          "
          class="view_block"
          :class="{ boxShadow: lastEditGroup === groupInfo.tempId }"
        >
          <CommodityBlockView
            ref="anchor"
            :project="project"
            :product="groupInfo"
            :groupEditing="editing"
            :groupError="v$.$errors.length > 0"
            :handleEditing="handleEditing"
          />
        </div>

        <!-- 單筆編輯 -->
        <CommodityBlockEdit
          v-show="groupInfo.productList.length <= 1 && editing"
          :product="groupInfo.productList[0]"
          :project="project"
          :editing="editing"
          status="edit"
          editType="single"
          class="bg"
        />

        <!-- 有 group 多筆編輯 -->
        <div
          v-show="groupInfo.productList.length > 1 && editing"
          class="group_block bg"
        >
          <CommodityBlockEdit
            v-for="product in groupInfo.productList"
            :key="product.tempId"
            :product="product"
            :project="project"
            :editing="editing"
            status="edit"
            editType="group"
          />
        </div>
      </div>
    </div>
    <!-- 編輯時的新增商品 -->
    <div v-show="canCreate" class="booking_create">
      <icon
        @click.native="createProduct"
        iconName="icon-icon-expand-less"
        size="28"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useRoute } from "@/router/useRouter.js";
import { clickOutside } from "@/directives/clickOutside";
import CommodityBlockEdit from "@/components/salesOrder/quoteContentComponent/CommodityBlockEdit.vue";
import CommodityBlockView from "@/components/salesOrder/quoteContentComponent/CommodityBlockView.vue";

export default {
  components: {
    CommodityBlockEdit,
    CommodityBlockView
  },
  props: {
    project: {
      type: Object,
      require: true
    },
    groupInfo: {
      type: Object,
      require: true
    },
    canCreate: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    clickOutside
  },
  setup(props) {
    const salesOrderStore = useSalesOrderStore();
    const { route } = useRoute();
    const { lastEditGroup } = toRefs(salesOrderStore);

    const v$ = useVuelidate();
    const editing = ref(false);
    editing.value = props.groupInfo.id === null;

    const anchor = ref(null);

    const editStatus = computed(
      () => route.name === "DraftSalesOrder" || route.name === "EditSalesOrder"
    );

    // 觸發編輯模式
    const handleEditing = async () => {
      editing.value = !editing.value;
      salesOrderStore.lastEditGroup = props.groupInfo.tempId;
      await nextTick();

      let anchor = document.querySelector(
        props.groupInfo.productList.length > 1
          ? `#commodity_block_${props.groupInfo.tempId}`
          : `#product_block_${props.groupInfo.tempId}`
      );
      setTimeout(async () => {
        // 等待收合
        window.scrollTo({
          top: anchor.offsetTop,
          behavior: "smooth"
        });
      }, 100);
    };

    // 新增專案內的商品
    const createProduct = async () => {
      const newId = salesOrderStore.createProduct(props.project.tempId);
      await nextTick();

      let anchor = document.querySelector(`#product_block_${newId}`);
      // 等待收合
      setTimeout(() => {
        window.scrollTo({
          top: anchor.offsetTop,
          behavior: "smooth"
        });
      }, 100);
    };

    const onClickOutside = () => {
      editing.value = false;
    };

    return {
      v$,
      lastEditGroup,
      editing,
      anchor,
      editStatus,
      handleEditing,
      createProduct,
      onClickOutside
    };
  }
};
</script>

<style lang="scss" scoped>
.view_block {
  display: flex;
  align-items: center;

  &.boxShadow {
    box-shadow: 0 0 6px 0 rgba(126, 126, 126, 0.3);
  }
}

.bg {
  background-color: #e9f3fb;

  ::v-deep input,
  ::v-deep .el-date-editor {
    background-color: #fff !important;
  }
}

.group_block {
  position: relative;
  box-shadow: inset 0 1px 4px 0 rgba(197, 197, 197, 0.5);

  &::after {
    content: "";
    position: absolute;
    z-index: 2;
    left: 50%;
    top: -12px;
    width: 0;
    height: 0;
    border: 7px solid;
    border-color: transparent transparent #e9f3fb transparent;
  }

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: -14px;
    width: 0;
    height: 0;
    border: 7px solid;
    border-color: transparent transparent #e2e1e1 transparent;
  }
}

.booking_create {
  text-align: right;
  //padding: 16px 40px 0 0;
  margin-top: 16px;
  margin-bottom: 16px;

  img {
    cursor: pointer;
  }
}
</style>
