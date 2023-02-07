<template>
  <ElRadioGroup
    v-model="localTypeId"
    class="radio-group d-flex flex-wrap align-items-center"
    @change="typeIdHandler"
  >
    <ElRadio :label="reviewTypeMap.INTERVIEW"
      >{{ reviewTypeGroupName[reviewTypeMap.INTERVIEW] }}
    </ElRadio>
    <ElRadio :label="reviewTypeMap.FULL_TIME"
      >{{ reviewTypeGroupName[reviewTypeMap.FULL_TIME] }}
    </ElRadio>
    <ElRadio :label="reviewTypeMap.INTERN"
      >{{ reviewTypeGroupName[reviewTypeMap.INTERN] }}
    </ElRadio>
    <ElRadio :label="reviewTypeMap.PART_TIME"
      >{{ reviewTypeGroupName[reviewTypeMap.PART_TIME] }}
    </ElRadio>
  </ElRadioGroup>
</template>

<script>
import { TYPEID_MAP, TYPEID_FORM_NAME_MAP } from "@/utils/enum.js";
export default {
  name: "TypeIdRadioGroup",
  props: {
    currentTypeId: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      localTypeId: this.currentTypeId || TYPEID_MAP.FULL_TIME,
      reviewTypeMap: TYPEID_MAP,
      reviewTypeGroupName: TYPEID_FORM_NAME_MAP
    };
  },
  methods: {
    typeIdHandler(typeId) {
      this.$emit("change", typeId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
.radio-group > label {
  margin-right: 28px;

  @include media-breakpoint-down(sm) {
    margin-right: 40px;
  }

  &:last-child {
    margin-right: 0;
  }
}

::v-deep .el-radio .el-radio__input {
  @include device-up(md) {
    margin-right: 12px;
  }
}
</style>
