<template>
  <tbody>
    <!-- Loading -->
    <tr v-if="getTypeData && getTypeData.length < 1">
      <td colspan="2" class="loading">
        <Loading />
      </td>
    </tr>

    <template v-if="getTypeData && getTypeData.length > 0">
      <template v-for="(item, index) in getTypeData">
        <tr v-if="item.name" :key="item.id">
          <th class="title">{{ item.name }}</th>
          <td></td>
        </tr>
        <template v-for="(elementItem, elementIndex) in item.elementList">
          <!-- 圖片尺寸 -->
          <AdTypeImage
            v-if="
              elementItem.elementType === 'image' ||
                elementItem.elementType === 'file'
            "
            @changeGroupList="changeGroupListFunc"
            :typeData="typeData"
            :itemData="elementItem"
            :typeDataIndex="index"
            :elementIndex="elementIndex"
            :v="v"
            :key="elementItem.id"
          />

          <!-- 文字限制 -->
          <AdTypeText
            v-if="elementItem.elementType === 'text'"
            @changeGroupList="changeGroupListFunc"
            :typeData="typeData"
            :itemData="elementItem"
            :typeDataIndex="index"
            :elementIndex="elementIndex"
            :v="v"
            :key="elementItem.id"
          />
        </template>
      </template>
    </template>

    <!-- 上刊須知 -->
    <AdTypeMemo
      v-if="getTypeData && getTypeData.length > 0"
      @changeMome="changeMomeFunc"
      :itemData="typeData"
      :boardTypeId="boardTypeId"
    />
  </tbody>
</template>

<script>
import { computed, defineComponent } from "vue";
import Loading from "@/components/Loading.vue";
import AdTypeImage from "./AdTypeImage.vue";
import AdTypeText from "./AdTypeText.vue";
import AdTypeMemo from "./AdTypeMemo.vue";

export default defineComponent({
  name: "AdTypeLayout",
  props: {
    typeData: {
      type: Object,
      required: true
    },
    v: {
      type: Object,
      required: true
    },
    boardTypeId: {
      type: Number
    }
  },
  components: {
    Loading,
    AdTypeImage,
    AdTypeText,
    AdTypeMemo
  },
  emits: ["changeBoardTypeMomeFunc", "changeBoardTypeDataFunc"],
  setup(props, { emit }) {
    const getTypeData = computed(() => props.typeData.groupList);

    const changeMomeFunc = value => {
      emit("changeBoardTypeMomeFunc", value);
    };

    const changeGroupListFunc = (name, value, typeDataIndex, elementIndex) => {
      emit("changeBoardTypeDataFunc", name, value, typeDataIndex, elementIndex);
    };

    return {
      getTypeData,
      changeMomeFunc,
      changeGroupListFunc
    };
  }
});
</script>

<style lang="scss" scoped>
tr {
  margin-bottom: 20px;
  display: flex;

  th {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #292929;
    padding-right: 28px;

    &.title {
      color: #00afb8;
    }
  }

  td {
    &.loading {
      text-align: center;
      width: 100%;
      padding: 50px 0;
    }
  }
}
</style>
