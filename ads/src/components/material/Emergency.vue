<template>
  <DropDownRow
    @onEditBtnClick="handleEdit"
    @onActiveOff="resetComponentData"
    :tipText="shelf"
    :isActive="isActive"
    :isEdit="isEdit"
    :isFocus="isFocus"
    :special="!getOff && !getOn"
    class="mb-6"
    title="緊急上下架"
    toolTipText="將已曝光版位緊急上、下架"
  >
    <template v-slot:panel>
      <div v-if="isEdit && isActive" class="intermediate_content">
        <span v-if="showLoading" class="loading_block">
          <Loading />
        </span>
        <button
          v-if="!showLoading"
          @click="handlePostPublish"
          :disabled="!getOn"
          :class="
            getOn
              ? 'button_bg_blue_smaller'
              : 'button_bg_white_small button_bg_white_small_disable'
          "
        >
          上架
        </button>
        <button
          v-if="!showLoading"
          @click="handleDeletePublish"
          :disabled="!getOff"
          :class="
            getOff
              ? 'button_bg_blue_smaller'
              : 'button_bg_white_small button_bg_white_small_disable'
          "
        >
          下架
        </button>
      </div>
    </template>
  </DropDownRow>
</template>

<script>
import { mapActions } from "vuex";
import DropDownRow from "@/components/share/DropDownRow";
import Loading from "@/components/Loading";

export default {
  name: "EmergencyShelf",
  data() {
    return {
      isEdit: false,
      shelf: "",
      publishOff: false,
      publishOn: false,
      showLoading: false
    };
  },
  computed: {
    getOff() {
      return this.publishOff;
    },
    getOn() {
      return this.publishOn;
    },
    getShelf: {
      get() {
        return this.shelf;
      }
    }
  },
  components: {
    DropDownRow,
    Loading
  },
  props: {
    reservationId: {
      type: Number
    },
    isActive: {
      type: Boolean
    },
    isFocus: {
      type: Boolean
    },
    emergencyPublish: {
      type: Object
    }
  },
  mounted() {
    const { emergencyPublish, setStatus } = this;
    const status = emergencyPublish.status;
    const off = emergencyPublish.off;
    const on = emergencyPublish.on;
    setStatus({ status, off, on });
  },
  methods: {
    ...mapActions("publish", ["postPublishId", "deletePublishId"]),
    // 編輯
    handleEdit() {
      if (!this.isActive) return;
      this.isEdit = !this.isEdit;
      this.$emit("edit");
    },
    // 上架
    handlePostPublish() {
      const { postPublishId, reservationId, setStatus } = this;
      if (!this.publishOn) return;
      this.showLoading = true;
      postPublishId({ id: reservationId }).then(res => {
        const status = res.emergencyPublish.status;
        const off = res.emergencyPublish.off;
        const on = res.emergencyPublish.on;
        setStatus({ status, off, on });
        this.showLoading = false;
        this.$emit("onPublishSubmit");
        this.isEdit = false;
      });
    },
    // 下架
    handleDeletePublish() {
      const { deletePublishId, reservationId, setStatus } = this;
      if (!this.publishOff) return;
      this.showLoading = true;
      deletePublishId({ id: reservationId }).then(res => {
        const status = res.emergencyPublish.status;
        const off = res.emergencyPublish.off;
        const on = res.emergencyPublish.on;
        setStatus({ status, off, on });
        this.showLoading = false;
        this.$emit("onPublishSubmit");
        this.isEdit = false;
      });
    },
    resetComponentData() {
      Object.assign(this.$data);
    },
    setStatus({ status, off, on }) {
      this.shelf = this.nowStatus(status);
      this.publishOff = off;
      this.publishOn = on;
    },
    nowStatus(status) {
      const statusType = {
        2: "未上架",
        3: "未上架",
        4: "上架中",
        5: "已上架"
      };
      return statusType[status] || "已下架";
    }
  },
  watch: {
    // 狀態不等於 emergency 或 haveOfficialMaterial 不可編輯
    materialServiceValue(value) {
      if (value !== "emergency" || value !== "haveOfficialMaterial")
        this.isEdit = false;
    },
    emergencyPublish(newVal) {
      const status = newVal.status;
      const off = newVal.off;
      const on = newVal.on;
      this.setStatus({ status, off, on });
    },
    isActive(newVal) {
      if (newVal) this.isEdit = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.intermediate_content {
  width: 450px;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 1px;
  color: #2d2d2d;

  button {
    &:nth-child(1) {
      margin-right: 16px;
    }
  }

  .exposed {
    margin-left: 8px;
    color: #ea475b;
    font-size: 16px;
    font-weight: initial;
  }
}
</style>
