<template>
  <div class="container-tow-column container-rwd d-flex">
    <div class="container-main mr-md-6">
      <slot name="main" />
    </div>
    <div class="container-sidebar d-none d-md-block">
      <slot name="side" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ContainerSidebar"
};
</script>

<style scoped lang="scss">
@import "~scss/component/variables";

.container-tow-column {
  .container-main {
    width: 100%;
  }
  .container-sidebar {
    width: 220px;
    flex-shrink: 0;
    @include media-breakpoint-up(xl) {
      width: 240px;
    }
  }
}
</style>
