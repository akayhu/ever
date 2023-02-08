<template>
  <div v-click-outside="onClickOutside">
    <OtherTypeCommodityBlockView
      v-show="!editing"
      :project="project"
      :product="product"
      :groupEditing="editing"
      :groupError="v$.$errors.length > 0"
      :handleEditing="handleEditing"
    />

    <OtherTypeCommodityBlockEdit
      v-show="editing"
      :project="project"
      :product="product"
      status="edit"
    />

    <div v-if="canCreate" class="booking_create">
      <img
        @click="createOtherQuote"
        src="@/assets/icon/icon-icon-expand-less.svg"
        class="ml-2"
      />
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import OtherTypeCommodityBlockEdit from "@/components/salesOrder/quoteContentComponent/OtherTypeCommodityBlockEdit.vue";
import OtherTypeCommodityBlockView from "@/components/salesOrder/quoteContentComponent/OtherTypeCommodityBlockView.vue";

export default {
  components: {
    OtherTypeCommodityBlockEdit,
    OtherTypeCommodityBlockView
  },
  props: {
    project: {
      type: Object,
      require: true
    },
    product: {
      type: Object,
      require: true
    },
    canCreate: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const salesOrderStore = useSalesOrderStore();
    const editing = ref(false);
    const v$ = useVuelidate();

    const createOtherQuote = async () => {
      const newId = salesOrderStore.createOtherProduct(props.project.tempId);
      await nextTick();
      let anchor = document.querySelector(`#otherQuote_block_${newId}`);
      // 等待收合
      setTimeout(() => {
        window.scrollTo({
          top: anchor.offsetTop,
          behavior: "smooth"
        });
      }, 100);
    };

    // 編輯
    const handleEditing = () => {
      editing.value = !editing.value;
    };

    // 點擊空白區塊顯示檢視狀態
    const onClickOutside = () => {
      editing.value = false;
    };

    return {
      v$,
      editing,
      handleEditing,
      createOtherQuote,
      onClickOutside
    };
  }
};
</script>

<style lang="scss" scoped>
.booking_create {
  text-align: right;
  padding-top: 16px;

  img {
    cursor: pointer;
  }
}
</style>
