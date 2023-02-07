<template>
  <tr>
    <td>{{ item.id }}</td>
    <td v-if="type === 'reviews'">{{ getIdName(item.typeId) }}</td>
    <td>{{ timeDate(item.createDate) }}</td>
    <td>{{ item.pid }}</td>
    <td>{{ item.company }}</td>
    <td>{{ getVerifyStateName(item.auditState) }}</td>
    <td>{{ item.bossReply ? "有" : "" }}</td>
    <td>
      <button
        type="button"
        @click="
          jump(
            `/${type === 'reviews' ? 'review_detail' : 'vote_detail'}/${
              item.id
            }`
          )
        "
      >
        審核
      </button>
    </td>
  </tr>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
import { getTypeIdName } from "@/utils/anonymous";
export default {
  name: "SearchListItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: ""
    }
  },
  mixins: [commonMixins],
  methods: {
    getVerifyStateName: function(verifyState) {
      const verifyStateType = {
        2: "不須處理",
        3: "未通過",
        4: this.type === "reviews" ? "申訴下架" : "通過",
        5: "申訴待審",
        6: "通過",
        7: "申訴重新上架"
      };
      return verifyStateType[verifyState];
    },
    getIdName(id) {
      return getTypeIdName(id);
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  font-size: 14px;
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
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 0.25rem;
}
</style>
