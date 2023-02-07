<template>
  <div class="service-terms t4 text-center mt-8 mt-md-12">
    請先閱讀 104 公司評論
    <router-link
      class="term-link font-weight-bold"
      data-gtm-form="服務條款"
      to="/terms"
      target="_blank"
      rel="noopener noreferrer"
    >
      《服務條款》 </router-link
    ><br />
    為了維護內容品質，並保護會員免於觸法，資料送出後會通過 104客服的審核才發佈。
  </div>
</template>

<script>
export default {
  name: "ServiceTerms"
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
.service-terms {
  color: $gray-700;

  .term-link {
    color: #1654b9;
    &:hover {
      color: #4e91ff;
    }
  }
}
</style>
