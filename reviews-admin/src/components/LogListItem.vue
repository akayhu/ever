<template>
  <tr>
    <td>{{ item.id }}</td>
    <td>{{ timeDate(item.createDate) }}</td>
    <td>{{ item.entityType }}</td>
    <td>{{ item.entityId }}</td>
    <td>{{ item.accountId }}</td>
    <td v-html="item.memo"></td>
  </tr>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "LogListItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  mixins: [commonMixins]
};
</script>

<style lang="scss" scoped>
td {
  padding: 12px 8px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
  height: 50px;
  line-height: 1.5;
  text-align: center;

  &:nth-child(6) {
    text-align: left;
  }
}
</style>
