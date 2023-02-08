<template>
  <!-- 命名、文字限制 -->
  <tr class="bb1">
    <th>命名</th>
    <td>
      <span class="mr16">
        <input
          v-model="title"
          :placeholder="`請輸入${name}(顯示於前台)`"
          :class="{
            error_message_border:
              vTypeData[`title_${typeDataIndex}_${elementIndex}`].$error
          }"
          :disabled="!getUserAuthority.webBoardEdit"
          widthType="380"
        />
      </span>
      <span>
        <input
          v-model="textLimit"
          :class="{
            error_message_border:
              vTypeData[`textLimit_${typeDataIndex}_${elementIndex}`].$error
          }"
          :disabled="!getUserAuthority.webBoardEdit"
          placeholder="請輸入"
          widthType="78"
        />
      </span>
      <span class="ml8 mr16">字</span>
      <span class="mr9 titie">連結</span>
      <span class="switch_checkbox_block">
        <SwitchCheckbox
          :checked="linkable"
          :disabled="!getUserAuthority.webBoardEdit"
          @handleChange="handleChange"
        />
      </span>
      <ValidationError
        :vData="vTypeData[`title_${typeDataIndex}_${elementIndex}`]"
        text="請填入命名名稱"
      />
      <ValidationError
        :vData="vTypeData[`textLimit_${typeDataIndex}_${elementIndex}`]"
        text="請填入文字限制字數"
      />
    </td>
  </tr>
</template>

<script>
import { ref, computed, onBeforeMount, defineComponent } from "vue";
import ValidationError from "@/components/ValidationError.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";

export default defineComponent({
  name: "AdTypeText",
  props: {
    typeData: {
      type: Object,
      required: true
    },
    v: {
      type: Object,
      required: true
    },
    typeDataIndex: {
      type: Number,
      required: true
    },
    elementIndex: {
      type: Number,
      required: true
    }
  },
  components: {
    SwitchCheckbox,
    ValidationError
  },
  emits: ["changeGroupList"],
  setup(props, { emit }) {
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const vTypeData = computed(() => props.v);
    const title = computed({
      get: () =>
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].title,
      set: value => {
        emit(
          "changeGroupList",
          "title",
          value,
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    const textLimit = computed({
      get: () =>
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].textLimit,
      set: value => {
        emit(
          "changeGroupList",
          "textLimit",
          value,
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    const linkable = computed({
      get: () => {
        const linkableValue =
          props.typeData.groupList[props.typeDataIndex].elementList[
            props.elementIndex
          ].linkable;
        return linkableValue === 0 ? false : true;
      },
      set: value => {
        emit(
          "changeGroupList",
          "linkable",
          Number(value),
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    let name = ref("");

    onBeforeMount(() => {
      name.value =
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].title;
    });

    const handleChange = val => {
      linkable.value = val;
    };

    return {
      name,
      getUserAuthority,
      vTypeData,
      title,
      textLimit,
      linkable,
      handleChange
    };
  }
});
</script>

<style lang="scss" scoped>
tr {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  &.bb1 {
    border-bottom: 1px solid #e2e1e1;
    padding-bottom: 20px;
  }

  th {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #292929;
    padding-right: 28px;
    width: 62px;
  }

  td {
    font-size: 14px;

    span {
      &.ml8 {
        margin-left: 8px;
        font-weight: initial;
      }
      &.mr16 {
        margin-right: 16px;
      }
      &.mr9 {
        margin-right: 9px;
      }
      &.pt10 {
        padding-top: 10px;
      }
      &.titie {
        font-size: 14px;
        font-weight: bold;
      }
      &.switch_checkbox_block {
        vertical-align: middle;
      }
    }
  }
}
</style>
