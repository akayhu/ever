<template>
  <el-dialog
    top="50px"
    width="90vw"
    custom-class="preview_dialog"
    :visible="visible"
    @update:visible="changeStatusHandler"
  >
    <template v-if="hasTitle" v-slot:title>
      <div class="preview_body_title">
        <p class="h4 mb-0 font-weight-bold text-body">
          預覽<span class="pl-2 h6 mb-0 font-weight-bold">廣告版型預覽</span>
        </p>
      </div>
    </template>
    <PreviewPage
      v-if="visible"
      class="mx-auto mb-15"
      :title="title"
      :device="boardInfo.device"
      :boardId="boardInfo.boardId"
      :typeId="boardInfo.typeId"
      :materialId="materialId"
      :materialType="materialType"
    >
    </PreviewPage>
  </el-dialog>
</template>

<script>
import PreviewPage from "@/components/preview/PreviewPage.vue";

export default {
  name: "PreviewPopup",
  components: {
    PreviewPage
  },
  model: {
    prop: "visible",
    event: "update"
  },
  props: {
    hasTitle: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    boardInfo: {
      type: Object,
      required: true
    },
    apiPath: {
      type: String,
      required: true
    },
    materialId: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      boardData: null
    };
  },
  computed: {
    materialType() {
      return this.apiPath === "material" ? "material" : "spareMaterial";
    },
    title() {
      return [
        this.boardInfo.device,
        this.boardInfo.channelName,
        this.boardInfo.name
      ].join(" / ");
    }
  },
  methods: {
    changeStatusHandler(status) {
      this.$emit("update", status);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

::v-deep .el-dialog {
  max-width: 1166px;
  background-color: $white;
  border: 1px solid $gray-400;
  border-radius: 8px;
  &__header {
    padding: 24px 51px 20px;
    .el-dialog__headerbtn {
      .el-dialog__close {
        font-size: 24px;
      }
      &:focus {
        outline: none;
      }
    }
  }
  &__body {
    margin: 0 51px;
    padding: 0;
  }
}
</style>
