<template>
  <div>
    <div class="section_title">
      {{ editable ? "建立內服單" : "內服單成立" }}
    </div>

    <TopRightAction :validate="validate" :resetValidation="resetValidation" />

    <div v-if="!isLoading" class="internal_order_content mt-6">
      <div>
        <LeftMenu />
      </div>
      <div class="internal_order_right">
        <BasicInformation />
        <ProjectContent v-if="!isDraftForm" />
      </div>
    </div>
    <div v-else>
      <LoadingPage />
    </div>

    <Dialog
      ref="confirmDialog"
      @dialogCancel="showConfirm = false"
      @dialogConfirm="showConfirm = false"
      :isShow="showConfirm"
      :cancelButton="true"
      title="注意"
      content="資料尚未儲存，確定要離開此頁嗎?"
    />

    <div id="componentDialog"></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, computed, nextTick, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus";
import TopRightAction from "@/components/salesOrder/TopRightAction.vue";
import LeftMenu from "@/components/internalOrder/LeftMenu.vue";
import BasicInformation from "@/components/internalOrder/BasicInformation.vue";
import ProjectContent from "@/components/internalOrder/ProjectContent.vue";
import LoadingPage from "@/components/LoadingPage.vue";
import Dialog from "@/components/Dialog.vue";

export default {
  components: {
    TopRightAction,
    LeftMenu,
    BasicInformation,
    ProjectContent,
    LoadingPage,
    Dialog
  },
  beforeRouteLeave(to, from, next) {
    if (this.isFormDirty && to.name !== "Page500") {
      this.showConfirm = true;
      this.$refs.confirmDialog.confirm().then(answer => {
        if (answer) {
          useSalesOrderStore().$reset();
          return next();
        } else {
          return next(false);
        }
      });
      return next(false);
    }
    useSalesOrderStore().$reset();
    return next();
  },
  setup() {
    const salesOrderStore = useSalesOrderStore();
    const { quotationData } = toRefs(salesOrderStore);
    const { isDraftForm, canEditNew } = useFormStatus();
    const v$ = useVuelidate();
    const isLoading = computed(() => salesOrderStore.isLoading);
    const isFormDirty = computed(() => v$.value.$anyDirty);
    const editable = computed(() => canEditNew(quotationData.value).edit);
    const showDialog = ref(false);
    const showConfirm = ref(false);

    onMounted(() => {
      window.addEventListener("beforeunload", beforeWindowUnload);
    });

    onUnmounted(() => {
      window.removeEventListener("beforeunload", beforeWindowUnload);
    });

    const beforeWindowUnload = e => {
      e.preventDefault();
      if (isFormDirty.value) e.returnValue = "";
    };

    const validate = () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        setTimeout(() => {
          // 等待編輯區塊收合
          nextTick(() => {
            const top =
              document.querySelector(`.error_message`).offsetTop - 150;
            window.scrollTo({ top });
          });
        }, 100);
        return false;
      }
      return true;
    };

    // 重設 vuelidate 的驗證狀態
    const resetValidation = () => v$.value.$reset();

    return {
      editable,
      quotationData,
      isFormDirty,
      editable,
      showDialog,
      showConfirm,
      isDraftForm,
      isLoading,
      v$,
      validate,
      resetValidation
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/views/orderManage/internalOrder";

button {
  position: fixed;
}

.section_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  position: absolute;
  z-index: 6;
}

.internal_order_content {
  display: flex;

  .internal_order_right {
    width: 1000px;
  }
}

.section_container {
  .basic_info {
    display: flex;

    > span {
      margin-right: 28px;
    }
  }
}
</style>
