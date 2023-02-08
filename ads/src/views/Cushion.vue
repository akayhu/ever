<template>
  <div>
    <div class="cushion_wrapper_title">墊檔廣告</div>

    <div>
      <!-- 選擇網站/頻道 -->
      <SelectTab
        ref="selectTab"
        :isActive="isSelectTabActive"
        :isFocus="currentFocusComponet === componentList.SELECT_TAB"
        @edit="currentFocusComponet = componentList.SELECT_TAB"
        @submit="onSelectTabBoardIdSelect"
      />

      <!-- 上傳墊檔 -->
      <ADUploadMaterial
        ref="ad_upload_material"
        :title="'墊檔廣告素材上傳'"
        :description="'可以上傳多組素材'"
        :storeName="'cushion'"
        :tagName="`${activeTag.channelName}/${activeTag.boardName}`"
        :isActive="isUploadMaterialActive"
        :isFocus="currentFocusComponet === componentList.UPLOAD_MATERIAL"
        :userSitePermissions="userSitePermissions"
        :device="activeTag.device"
        :exposuresListLength="materialExposuresList.length"
        :boardId="activeTag.boardId"
        @edit="currentFocusComponet = componentList.UPLOAD_MATERIAL"
        @onMaterialSubmit="onMaterialSubmit"
        @onMaterialDelete="onMaterialDelete"
      />

      <!-- 設定曝光 -->
      <Exposure
        ref="exposure"
        :isActive="isExposureActive"
        :isFocus="currentFocusComponet === componentList.EXPOSURE"
        :userSitePermissions="userSitePermissions"
        @edit="currentFocusComponet = componentList.EXPOSURE"
        @onMaterialSubmit="isDialogShow = true"
      />

      <Dialog
        @dialogCancel="isDialogShow = false"
        @dialogConfirm="resetAll"
        :isShow="isDialogShow"
        title="您已完成墊檔廣告設定，是否要繼續新增其他版位墊檔廣告"
        content="確認是否繼續墊檔廣告設定"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Dialog from "@/components/Dialog.vue";
import ADUploadMaterial from "@/components/share/uploadMaterial/ADUploadMaterial.vue";
import SelectTab from "@/components/cushion/SelectTab.vue";
import Exposure from "@/components/cushion/Exposure.vue";
import { commonMixins } from "@/mixins/commonMixins";
import { ACTIONS_TYPE as UPLPAD_MATERIAL_ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";
import { cushionActiveComponentMixin } from "@/mixins/activeComponentMixin";
import {
  ACTIONS_TYPE as CUSHION_ACTIONS_TYPE,
  MUTATIONS_TYPE as CUSHION_MUTATIONS_TYPE
} from "@/store/modules/cushion";
import { EventBus } from "@/utils/eventBus.js";

export default {
  name: "Cushion",
  components: {
    ADUploadMaterial,
    SelectTab,
    Exposure,
    Dialog
  },
  data() {
    return {
      activeTag: {
        name: "",
        device: "",
        typeId: 0,
        boardId: 0,
        siteId: 0
      },
      currentFocusComponet: "",
      userSitePermissions: true,
      isDialogShow: false
    };
  },
  mounted() {
    this.currentFocusComponet = this.componentList.SELECT_TAB;
  },
  beforeDestroy() {
    this.resetPageState();
  },
  mixins: [commonMixins, cushionActiveComponentMixin],
  inject: ["reload"],
  computed: {
    ...mapState({
      materialType: state => state.cushion.materialType,
      materialReservation: state => state.cushion.materialReservation,
      materialExposuresList: state => state.cushion.materialExposuresList
    }),
    isSelectTabActive() {
      return (
        // !this.$root.$children[0].isLoading &&
        this.activeComponetList.indexOf(this.componentList.SELECT_TAB) > -1
      );
    },
    isUploadMaterialActive() {
      return (
        this.activeComponetList.indexOf(this.componentList.UPLOAD_MATERIAL) > -1
      );
    },
    isExposureActive() {
      return this.activeComponetList.indexOf(this.componentList.EXPOSURE) > -1;
    }
  },
  methods: {
    ...mapMutations("cushion", {
      resetPageState: CUSHION_MUTATIONS_TYPE.RESET_PAGE_STATE
    }),
    ...mapActions("cushion", {
      getMaterialType: UPLPAD_MATERIAL_ACTIONS_TYPE.GET_MATERIAL_TYPE,
      getMaterialReservation:
        UPLPAD_MATERIAL_ACTIONS_TYPE.GET_MATERIAL_RESERVATION,
      getMaterialExposuresList:
        CUSHION_ACTIONS_TYPE.GET_MATERIAL_EXPOSURES_LIST,
      resetCushionData: CUSHION_ACTIONS_TYPE.RESET_CUSHION_DATA,
      getCushionTwentyMaterialReservation:
        CUSHION_ACTIONS_TYPE.GET_CUSHION_TWENTY_MATERIAL_RESERVATION
    }),
    async onSelectTabBoardIdSelect({
      typeId,
      boardId,
      siteId,
      device,
      channelName,
      boardName
    }) {
      const {
        componentList,
        updateActiveComponentList,
        getMaterialType,
        getMaterialReservation,
        getMaterialExposuresList,
        getUserSitePermissions,
        getCushionTwentyMaterialReservation
      } = this;

      this.activeTag = {
        channelName,
        boardName,
        device,
        typeId,
        boardId,
        siteId,
        device
      };
      this.userSitePermissions = getUserSitePermissions(siteId);
      try {
        updateActiveComponentList(componentList.SELECT_TAB);
        await getMaterialType({ typeId, boardId });
        await getMaterialReservation({ size: 1, page: 1, boardId });
        await getCushionTwentyMaterialReservation({
          size: 20,
          page: 1,
          boardId
        });
        await getMaterialExposuresList({ boardId });

        if (this.materialExposuresList.length > 0) {
          updateActiveComponentList(componentList.EXPOSURE);
        } else {
          updateActiveComponentList(componentList.UPLOAD_MATERIAL);
        }

        this.currentFocusComponet = componentList.UPLOAD_MATERIAL;
      } catch (error) {
        console.log(error);
      }
    },
    async onMaterialSubmit({ isCreateFisrtMaterial }) {
      const {
        componentList,
        updateActiveComponentList,
        getMaterialExposuresList
      } = this;
      try {
        await getMaterialExposuresList({ boardId: this.activeTag.boardId });
        this.$refs["ad_upload_material"].changeHideLoading();
        if (this.materialExposuresList.length > 0) {
          updateActiveComponentList(componentList.EXPOSURE);
          this.currentFocusComponet = componentList.EXPOSURE;
          if (isCreateFisrtMaterial) {
            await this.$nextTick();
            this.$refs["exposure"].autoOpenHandler(
              this.materialExposuresList[0].id
            );
          }
        } else {
          // force adUploadMaterial close
          this.currentFocusComponent = "";
          await this.$nextTick();
          this.currentFocusComponent = componentList.UPLOAD_MATERIAL;
          updateActiveComponentList(componentList.UPLOAD_MATERIAL);
        }
      } catch (e) {
        this.$refs["ad_upload_material"].changeHideLoading();
        console.log(e);
      }
    },
    async onMaterialDelete() {
      const {
        componentList,
        updateActiveComponentList,
        getMaterialExposuresList
      } = this;
      try {
        await getMaterialExposuresList({ boardId: this.activeTag.boardId });
        if (this.materialExposuresList.length > 0) {
          updateActiveComponentList(componentList.EXPOSURE);
        } else {
          updateActiveComponentList(componentList.UPLOAD_MATERIAL);
        }
      } catch (e) {
        console.log(e);
      }
    },
    resetAll() {
      EventBus.$emit("resetCushionSelectTab");
      this.updateActiveComponentList(this.componentList.SELECT_TAB);
      this.currentFocusComponet = this.componentList.SELECT_TAB;
      this.resetPageState();
      this.isDialogShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.cushion_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}
</style>
