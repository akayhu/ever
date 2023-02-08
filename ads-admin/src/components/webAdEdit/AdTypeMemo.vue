<template>
  <!-- 上刊須知 -->
  <tr class="alignItemsStart" :class="{ bt20: boardTypeId === 18 }">
    <th class="no-pt">上刊須知</th>
    <td>
      <textarea
        v-model="memo"
        :class="{ hasDefault: itemData.memo }"
        placeholder="請輸入"
        :disabled="!getUserAuthority.webBoardEdit"
      >
      </textarea>
    </td>
  </tr>
</template>

<script>
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";

export default defineComponent({
  name: "AdTypeMemo",
  props: {
    itemData: {
      type: Object,
      required: true
    },
    boardTypeId: {
      type: Number
    }
  },
  emits: ["changeMome"],
  setup(props, { emit }) {
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const memo = computed({
      get: () => props.itemData.memo,
      set: value => {
        emit("changeMome", value);
      }
    });

    return {
      getUserAuthority,
      memo
    };
  }
});
</script>

<style lang="scss" scoped>
tr {
  display: flex;

  &.alignItemsStart {
    align-items: start;
    margin-bottom: 0;
  }

  &.no_mb {
    margin-bottom: 0;
  }

  &.bt20 {
    margin-top: 20px;
    border-top: 1px solid #e2e1e1;
    padding-top: 20px;
  }

  th {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #292929;
    padding-right: 28px;
  }

  td {
    font-size: 14px;

    textarea {
      width: 654px;
      height: 134px;
      font-size: 16px;

      &.hasDefault {
        background-color: #e6f9fa;
      }
    }
  }
}
</style>
