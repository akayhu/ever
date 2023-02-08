<template>
  <div>
    <Contract
      title="底價促案"
      :fixed="false"
      :showHistory="true"
      :id="id"
      reviewType="PRODUCT_PROMO"
      :actionCallback="actionCallback"
    />

    <section class="mt-4">
      <div class="title_block">
        <div>底價簽核</div>
        <div>
          生效日期：<span>{{ promoStore.productPromo.effectiveDate }}</span>
        </div>
      </div>

      <ReservePriceTableHana
        v-if="promoStore.productPromo.audit === 1"
        :promoListData="promoStore.productPromo"
        :year="date"
      />
    </section>
  </div>
</template>

<script setup>
import { useRoute } from "@/router/useRoute";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect";
import Contract from "@/components/share/ContractReview/Contract.vue";
import ReservePriceTableHana from "@/components/reservePrice/ReservePriceTableHana.vue";

const { route, router } = useRoute();
const promoStore = useProductPromoEffectStore();
const id = route.params.id;
const date = new Date();

const actionCallback = () => {
  router.push("/reservePrice");
};

promoStore.getProductPromoId({ id }).then(() => {
  if (promoStore.productPromo.audit !== 1) router.push("/reservePrice");
});
</script>

<style lang="scss" scoped>
section {
  width: 1280px;
  margin: 0 auto;
  padding: 24px;

  .title_block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      line-height: 1.33;
      letter-spacing: 1.33px;
      color: #333;
      font-weight: bold;

      &:nth-child(1) {
        font-size: 24px;
      }
      &:nth-child(2) {
        font-size: 14px;

        span {
          color: #00afb8;
        }
      }
    }
  }
}
</style>
