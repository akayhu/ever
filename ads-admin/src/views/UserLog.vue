<template>
  <div>
    <!-- 查詢使用者行為記錄 -->
    <SearchLogBlock />

    <!-- 使用者行為記錄列表 -->
    <LogList />
  </div>
</template>

<script>
import SearchLogBlock from "@/components/userLog/SearchLogBlock.vue";
import LogList from "@/components/userLog/LogList.vue";

export default {
  name: "UserLog",
  components: {
    SearchLogBlock,
    LogList
  }
};
</script>
