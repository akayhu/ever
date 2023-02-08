<template>
  <section class="section_container" id="quote_content">
    <h2 class="mb-6">報價內容</h2>
    <div>
      <!-- banner 廣告、其他類型 草稿、編輯 -->
      <BannerAdsProjectEdit v-if="isEditForm" />
      <!-- banner 廣告、其他類型 一般檢視、簽核檢視 -->
      <BannerAdsProjectView v-if="isViewForm" />
    </div>
  </section>
</template>

<script>
import { useRoute } from "@/router/useRouter.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import BannerAdsProjectEdit from "@/components/salesOrder/editBlock/BannerAdsProjectEdit.vue";
import BannerAdsProjectView from "@/components/salesOrder/viewBlock/BannerAdsProjectView.vue";

export default {
  components: {
    BannerAdsProjectEdit,
    BannerAdsProjectView
  },
  setup() {
    const { route } = useRoute();
    const { isEditForm, isViewForm } = useFormStatus();

    // 可新增
    const canCreate = () => route.name === "DraftSalesOrder";

    // 可編輯
    const canEdit = () => route.name === "EditSalesOrder";

    // 可檢視
    const canQuotationBasicInfoView = () => {
      return (
        route.name === "GeneralViewSalesOrder" ||
        route.name === "SignOffViewSalesOrder"
      );
    };

    return {
      isEditForm,
      isViewForm,
      canQuotationBasicInfoView,
      canEdit,
      canCreate
    };
  }
};
</script>

<style lang="scss" scoped>
.quote_title {
  font-size: 18px;
  font-weight: bold;
  line-height: 1.56;
  letter-spacing: 1.26px;
  color: #292929;
  border-left: 10px solid #00b2ba;
  padding-left: 8px;
  margin-bottom: 24px;
}
</style>
