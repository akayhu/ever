<template>
  <div v-click-outside="onClickOutside">
    <div>
      <div
        v-show="
          groupInfo.productList.length > 1 ||
            (groupInfo.productList.length <= 1 && !editing)
        "
        class="view_block"
        :class="{ bg_blue: isHover && !editing }"
        @mouseover="isHover = true"
        @mouseout="isHover = false"
      >
        <ProductViewer
          :project="project"
          :product="groupInfo"
          :groupEditing="editing"
        />
        <div class="icon_actions" @click="editing = !editing">
          <icon
            :iconName="editing || isHover ? 'icon-edit-on' : 'edit'"
            class="icon"
            size="28"
          />
        </div>
      </div>

      <!-- 單筆編輯 -->
      <ProductEditor
        v-if="groupInfo.productList.length <= 1 && editing"
        :product="groupInfo.productList[0]"
        :project="project"
      />

      <!-- 有 group 多筆編輯 -->
      <div
        v-if="groupInfo.productList.length > 1 && editing"
        class="group_block"
      >
        <ProductEditor
          v-for="product in groupInfo.productList"
          :key="product.tempId"
          :product="product"
          :project="project"
          :isGroup="true"
        />
      </div>

      <!-- 編輯時的新增商品 -->
      <div v-if="canCreate" class="booking_create">
        <icon
          @click.native.stop="createProduct"
          iconName="icon-icon-expand-less"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { clickOutside } from "@/directives/clickOutside";
import ProductViewer from "@/components/internalOrder/ProductViewer.vue";
import ProductEditor from "@/components/internalOrder/ProductEditor.vue";

export default {
  components: {
    ProductViewer,
    ProductEditor
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
    const editing = ref(false);
    const isHover = ref(false);

    editing.value = props.groupInfo.id === null;

    // 新增專案內的商品
    const createProduct = async () => {
      const newId = salesOrderStore.createProduct(props.project.tempId);
      await nextTick();
      let focusElement = document.querySelector(`#new_product_${newId}`);
      if (!focusElement) return;
      window.scrollTo({
        top: focusElement.offsetTop - 130,
        behavior: "smooth"
      });
    };

    const onClickOutside = () => {
      editing.value = false;
    };

    return { editing, isHover, createProduct, onClickOutside };
  }
};
</script>

<style lang="scss" scoped>
.view_block {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.bg_blue {
  background-color: #e6f9fa;
}

.group_block {
  position: relative;
  top: -11px;

  &::before {
    content: "";
    display: block;
    position: relative;
    top: 5px;
    left: 50%;
    width: 10px;
    height: 10px;
    border-top: 1px solid #e6f9fa;
    border-left: 1px solid #e6f9fa;
    transform: rotate(45deg);
    background-color: #e6f9fa;
  }
}

.booking_create {
  text-align: right;
  padding-top: 16px;

  img {
    cursor: pointer;
  }
}

.icon_actions {
  cursor: pointer;
  margin-left: 12px;
}
</style>
