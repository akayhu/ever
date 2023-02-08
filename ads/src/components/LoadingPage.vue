<template>
  <div class="loading d-flex justify-content-center align-items-center">
    <Loading />
  </div>
</template>

<script>
import Loading from "@/components/Loading";
export default {
  name: "LoadingPage",
  components: {
    Loading
  }
};
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  z-index: 2004;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba($color: #000000, $alpha: 0.2);
}
</style>
