<template>
  <div>
    <div class="wrapper_title">下載報表</div>
    <SearchBlock class="mb-3" />
    <ContentBlock />
  </div>
</template>

<script>
import SearchBlock from "@/components/reportQuery/downloadReport/SearchBlock";
import ContentBlock from "@/components/reportQuery/downloadReport/ContentBlock";

export default {
  name: "DownloadReport",
  components: {
    SearchBlock,
    ContentBlock
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}
</style>
