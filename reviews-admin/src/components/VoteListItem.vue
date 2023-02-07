<template>
  <tr>
    <td>{{ item.id }}</td>
    <td>{{ timeDate(item.createDate) }}</td>
    <td>{{ item.pid }}</td>
    <td>{{ item.company }}</td>
    <td>
      <button type="button" @click="jump(`/vote_detail/${item.id}`)">
        審核
      </button>
    </td>
  </tr>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "VoteListItem",
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
  text-align: center;
}

button {
  cursor: pointer;
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  text-align: center;
  padding: 6px 20px;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
}
</style>
