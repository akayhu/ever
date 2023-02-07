<template>
  <div class="d-flex">
    <span
      v-for="typeId in reviewTypeGroup"
      :key="`group-${typeId}`"
      class="tag t4 d-inline-block"
      :class="{
        active: currentType === typeId
      }"
      @click="tagHandler(typeId)"
    >
      {{ reviewTypeGroupName[typeId] }}
    </span>
  </div>
</template>

<script>
import { TYPEID_MAP, TYPEID_GROUP_NAME_MAP } from "@/utils/enum.js";
export default {
  name: "ReviewTypeTags",
  props: {
    currentType: {
      type: Number,
      default: TYPEID_MAP.ALL
    }
  },
  data: function() {
    return {
      reviewTypeGroup: TYPEID_MAP,
      reviewTypeGroupName: TYPEID_GROUP_NAME_MAP
    };
  },
  methods: {
    tagHandler(typeId) {
      if (typeId === this.currentType) return;
      this.$emit("click", typeId);
    }
  }
};
</script>

<style lang="scss" scoped>
.tag {
  padding: 1px 8px;
  margin: 0 4px;
  border-radius: 12px;
  border: 1px solid get-color(calm);
  color: get-color(calm);
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &.active {
    color: #fff;
    background-color: get-color(calm);
  }
}
</style>
