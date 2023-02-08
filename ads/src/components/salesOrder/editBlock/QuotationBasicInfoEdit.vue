<template>
  <div>
    <!-- 報價單上方表頭、公司別、申請人、客戶、合約備註 -->
    <Quotation />

    <div>
      <div class="title mt-10">客戶基本資料及授信資料</div>
      <span class="collapse" @click="showCustomerData = !showCustomerData">
        <span>
          收合
          <img
            v-if="!showCustomerData"
            src="@/assets/icon/icon-arrow-up-border.svg"
          />
          <img v-else src="@/assets/icon/icon-arrow-down-border.svg" />
        </span>
      </span>

      <div v-show="showCustomerData">
        <!-- 客戶基本資料及授信資料內容 -->
        <CreditInformation />
      </div>

      <div v-show="showCustomerData">
        <div class="title mt-10">發票及付款資訊</div>
        <!-- 發票及付款資訊內容 -->
        <PaymentInformation />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "@/router/useRouter.js";
import Quotation from "@/components/salesOrder/basicInformation/Quotation.vue";
import CreditInformation from "@/components/salesOrder/basicInformation/CreditInformation.vue";
import PaymentInformation from "@/components/salesOrder/basicInformation/PaymentInformation.vue";

export default defineComponent({
  components: {
    Quotation,
    CreditInformation,
    PaymentInformation
  },
  setup() {
    const { route } = useRoute();
    let showCustomerData = ref(true);
    onMounted(() => {
      if (route.query.reserve && route.query.reserve === "true") {
        setTimeout(() => {
          let anchor = document.querySelector("#quote_content");
          window.scrollTo({
            top: anchor.offsetTop - 87,
            behavior: "smooth"
          });
        }, 100);
      }
    });
    return { showCustomerData };
  }
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1.4px;
  color: #292929;
  padding-bottom: 16px;
  position: relative;
  margin-bottom: 22px;
  border-bottom: 1px solid #d6d6d6;

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: -8px;
    left: calc(50%);
    width: 14px;
    height: 14px;
    transform: rotate(45deg);
    background-color: #fff;
    border-bottom: 1px solid #d6d6d6;
    border-right: 1px solid #d6d6d6;
  }
}

.collapse {
  display: flex;
  justify-content: flex-end;

  span {
    cursor: pointer;
  }
}
</style>
