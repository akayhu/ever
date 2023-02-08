<template>
  <el-dialog
    title="預覽"
    top="50px"
    width="1000px"
    custom-class="preview_dialog"
    :visible.sync="dialogStatus"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="img_relative">
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "PreviewDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogStatus: {
      get() {
        return this.showDialog;
      },
      set() {}
    }
  },
  methods: {
    handleClose(done) {
      this.$emit("changeShowDialog");
      done();
    }
  }
};
</script>

<style>
.preview_dialog .el-dialog__header {
  padding: 38px 50px 0;
}
.preview_dialog .el-dialog__header .el-dialog__title {
  font-weight: bold;
}
.preview_dialog .el-dialog__headerbtn {
  margin: 20px 26px 0 0;
}
.preview_dialog .el-dialog__headerbtn:focus {
  outline: none;
}
.preview_dialog .el-dialog__headerbtn .el-dialog__close {
  font-size: 18px;
  color: #2e344d;
  font-weight: bold;
}
.preview_dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2e344d;
}
.preview_dialog .el-dialog__body {
  padding: 40px 50px;
}
.preview_dialog .img_relative {
  position: relative;
}
</style>

<style lang="scss" scoped>
.dialog_main {
  width: 480px;
  margin: 120px auto;
  text-align: center;

  .dialog_title {
    font-size: 20px;
    font-weight: bold;
    line-height: 1.4;
    letter-spacing: 1.4px;
    color: #333;

    img {
      vertical-align: text-top;
    }
  }

  .dialog_annotation {
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #8f8f8f;
    margin-top: 10px;
  }
}
</style>
