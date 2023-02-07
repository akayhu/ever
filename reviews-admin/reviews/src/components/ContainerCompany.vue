<template>
  <div class="container-tow-column container-rwd d-block d-md-flex">
    <div class="container-sidebar">
      <slot name="side" />
    </div>
    <div class="container-main ml-md-6">
      <slot name="main" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ContainerCompany"
};
</script>

<style scoped lang="scss">
@import "~scss/component/variables";

.container-tow-column {
  .container-main {
    width: 100%;
  }
  .container-sidebar {
    width: 100%;
    @include media-breakpoint-up(md) {
      flex-shrink: 0;
      width: 220px;
    }
    @include media-breakpoint-up(xl) {
      width: 240px;
    }
  }
}
</style>
