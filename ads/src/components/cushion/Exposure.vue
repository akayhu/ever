<template>
  <DropDownRow
    @onEditBtnClick="handleEdit"
    @onActiveOff="resetComponentData"
    @onFocusOff="isEdit = false"
    :tipText="activeText"
    :isEditBtnClickAble="!isLoading"
    :isActive="isActive"
    :isEdit="isEdit"
    :isFocus="isFocus"
    title="設定墊檔素材曝光"
    toolTipText="可依照已上傳的墊檔廣告素材設定素材曝光"
  >
    <div class="exposure">
      <div class="exposure_botttom_select pt-5 d-flex align-items-center">
        <span>單一素材</span>
        <select-dropdown
          :value="selectedName"
          :disabled="isLoading || !userSitePermissions"
          :filterable="false"
          :remote="false"
          :options="dropdowmOption"
          :placeholder="'請選擇'"
          @value-changed="onDropDownSelect"
        />
        <span v-if="!userSitePermissions" class="exposed">
          無網站權限不可編輯
        </span>
      </div>
      <div class="exposure_botttom_submit pt-5 d-flex justify-content-end">
        <button
          :disabled="!selectedMaterialId || !userSitePermissions"
          @click="submit"
        >
          送出
        </button>
      </div>
    </div>
  </DropDownRow>
</template>

<script>
import DropDownRow from "@/components/share/DropDownRow";
import SelectDropdown from "@/components/share/SelectDropdown";
import { mapState, mapActions, mapMutations } from "vuex";
import { MUTATIONS_TYPE } from "@/store/modules/cushion";
import { ACTIONS_TYPE } from "@/store/modules/cushion";
// import { GETTERS_TYPE as ROOT_GETTERS_TYPE } from "@/store/index";
// import { MUTATIONS_TYPE as ROOT_MUTATIONS_TYPE } from "@/store/index";
import { apiPostSpareMaterialDecision } from "@/apis/spareMaterial";

const state = () => {
  return {
    isLoading: false,
    isEdit: false,
    selectedMaterialId: ""
  };
};

export default {
  name: "Exposure",
  data() {
    return {
      ...state()
    };
  },
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
    isFocus: {
      type: Boolean,
      required: true
    },
    userSitePermissions: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SelectDropdown,
    DropDownRow
  },
  computed: {
    ...mapState({
      lastApiTypeList: state => state.lastApiTypeList,
      boardId: state => state.cushion.materialType.boardId,
      materialExposuresList: state => state.cushion.materialExposuresList
    }),
    dropdowmOption() {
      return this.materialExposuresList.map(option => ({
        ...option,
        value: option.id,
        label: option.title
      }));
    },
    selectedName() {
      const ary = this.materialExposuresList.filter(
        option => option.id === this.selectedMaterialId
      );
      return !ary[0] ? "" : ary[0].title ? ary[0].title : "";
    },
    activeText() {
      return this.materialExposuresList.some(item => item.decided)
        ? "曝光日期已設定"
        : "";
    }
  },
  methods: {
    ...mapActions("cushion", {
      getMaterialExposuresList: ACTIONS_TYPE.GET_MATERIAL_EXPOSURES_LIST
    }),
    ...mapMutations("cushion", {
      updateMaterialExposuresList: MUTATIONS_TYPE.UPDATE_MATERIAL_EXPOSURES_LIST
    }),
    onDropDownSelect(id) {
      this.selectedMaterialId = id;
    },
    async submit() {
      if (!this.selectedMaterialId) return;
      try {
        const { data: response } = await apiPostSpareMaterialDecision({
          materialId: this.selectedMaterialId,
          boardId: this.boardId
        });
        await this.getMaterialExposuresList({ boardId: this.boardId });
        if (response) {
          this.$emit("onMaterialSubmit");
        } else {
          //failed
        }
      } catch (error) {
        console.log(error);
      }
    },
    async handleEdit() {
      if (!this.isActive || this.isLoading) return;
      this.isEdit = !this.isEdit;
      this.$emit("edit");
      if (this.isEdit) {
        this.materialExposuresList.forEach(material => {
          if (material.decided) this.selectedMaterialId = material.id;
        });
      }
    },
    resetComponentData() {
      Object.assign(this.$data, state());
    },
    autoOpenHandler(val) {
      this.selectedMaterialId = val;
      this.handleEdit();
    }
  }
};
</script>

<style lang="scss" scoped>
.exposure {
  .exposure_botttom_select {
    min-height: 38px;

    > span {
      line-height: 22px;
      font-size: 16px;
      padding-right: 28px;
      letter-spacing: 1.38px;
    }

    ::v-deep .el-select {
      width: 260px;
    }
  }

  .exposed {
    margin-left: 8px;
    color: #ea475b;
    font-size: 16px;
    font-weight: initial;
  }

  .exposure_botttom_submit {
    > button {
      min-width: 70px;
      height: 32px;
      border: 1px solid #30a9b0;
      color: #30a9b0;
      line-height: 30px;
      background-color: #fff;

      &:disabled {
        border-color: #a9a9a9;
        color: #a9a9a9;
        cursor: not-allowed;
      }
    }
  }
}
</style>
