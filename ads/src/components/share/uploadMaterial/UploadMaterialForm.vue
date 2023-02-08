<template>
  <div>
    <div class="top_block mt-6">
      <div class="warning_text">
        {{ warningText }}
      </div>
      <div class="delete_block">
        <button
          @click="isDialogShow = true"
          :disabled="isDeleteButtonDisabled || !userSitePermissions"
          class="button_bg_white_restraint"
        >
          刪除
        </button>
      </div>
    </div>

    <div class="publish_form">
      <div class="publish_form_left_block">
        <div v-if="requestParam.materialId" class="material_id">
          <span>ID：{{ requestParam.materialId }}</span>
          <span v-if="getUserRole === 1">
            <icon iconName="demo-icon-p" />
            <a
              :href="getMaterialPreviewForEngineer"
              rel="noopener noreferrer"
              target="_blank"
              title="素材預覽"
              >素材預覽
            </a>
          </span>
        </div>

        <div class="material_name_block">
          <div class="material_name">素材命名</div>
          <input
            v-model.trim="materialTitle"
            v-filterSpecifiedSymbols
            :disabled="!isEditable || !allowMaterial || !userSitePermissions"
            type="text"
            placeholder="請輸入"
            heightType="38"
            widthType="360"
            maxlength="50"
            @paste="filterValue($event, 'materialTitle')"
            @keydown="filterValue($event, 'materialTitle')"
          />
        </div>

        <fragment
          v-if="materialType.groupList && materialType.groupList.length > 0"
        >
          <div
            v-for="(item, index) in materialType.groupList"
            :key="item.id"
            class="group_list_block"
          >
            <div v-show="item.name" class="group_list_title">
              {{ item.name }}
            </div>
            <fragment
              v-for="(elementItem, elementIndex) in item.elementList"
              :key="elementItem.id"
            >
              <component
                :is="AD_FORM_COMPOMENT_TYPE[elementItem.elementType]"
                :storeName="storeName"
                :isEditable="isEditable"
                :userSitePermissions="userSitePermissions"
                :itemData="elementItem"
                :elementIndex="elementIndex"
                :typeDataIndex="index"
                :allowMaterial="allowMaterial"
                :inValidateLinkList="inValidateLinkList"
                :device="device"
              />
            </fragment>
          </div>
        </fragment>
      </div>

      <div class="img_view_block">
        <div
          v-for="(section, sectionIndex) in currentPreview.list"
          :key="section.name"
        >
          <div class="title">
            預覽{{ sectionIndex + 1 }}
            <span>您的圖像廣告( 範例 )</span>
          </div>
          <div
            :class="{ narrow: materialType.typeId === 27 }"
            class="review_content"
          >
            <component :storeName="storeName" :is="section.name" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="updateUserName" class="last_edit_user">
      最後修改：{{ updateUserName }}({{ accountId }}) {{ updateDate }}
    </div>

    <div class="button_block">
      <button
        @click="isDialogShow = true"
        :disabled="isDeleteButtonDisabled"
        class="button_bg_white_restraint"
      >
        刪除
      </button>
      <button
        @click="changeOpenPreviewDialog"
        :disabled="isPreviewButtonDisabled"
        class="button_bg_white_restraint"
      >
        預覽
      </button>
      <button
        @click="handleSubmit"
        :disabled="isSaveButtonDisabled"
        class="button_bg_white_restraint"
      >
        儲存
      </button>
    </div>
    <Dialog
      @dialogCancel="waringDialogShow = false"
      @dialogConfirm="waringDialogShow = false"
      :isShow="waringDialogShow"
      :cancelButton="false"
      :title="warningText"
    />
    <Dialog
      @dialogCancel="dialogCancelClick"
      @dialogConfirm="dialogConfirmClick"
      :isShow="isDialogShow"
      componentKey="isDialogShow"
      key="isDialogShow"
      title="您確定要刪除該筆素材？"
      content="確認是否刪除素材"
    />
    <PreviewPopup
      v-model="showPreviewPopup"
      :hasTitle="true"
      :materialId="requestParam.materialId"
      :apiPath="storeName"
      :boardInfo="materialType"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import axios from "axios";
import AdTypeFile from "./form/AdTypeFile";
import AdTypeImage from "./form/AdTypeImage.vue";
import AdTypeTextarea from "./form/AdTypeTextarea.vue";
import Dialog from "@/components/Dialog.vue";
import PreviewPopup from "@/components/preview/PreviewPopup.vue";
import { MUTATIONS_TYPE } from "@/store/share/uploadMaterial/mutations";
import { ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";
import { GETTERS_TYPE } from "@/store/share/uploadMaterial/getters";
import {
  apiGetSpareMaterialPresignedurl,
  apiPostSpareMaterialUploadZip
} from "@/apis/spareMaterial";
import {
  apiGetMaterialPresignedurl,
  apiPostMaterialUploadZip
} from "@/apis/material";
import { filterSpecifiedSymbols } from "@/directives/filterSpecifiedSymbols";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";
import preview from "./config/preview";
import Type_1 from "./formRightReview/Type_1.vue";
import Type_2 from "./formRightReview/Type_2.vue";
import Type_3 from "./formRightReview/Type_3.vue";
import Type_4 from "./formRightReview/Type_4.vue";
import Type_5 from "./formRightReview/Type_5.vue";
import Type_6 from "./formRightReview/Type_6.vue";
import Type_7 from "./formRightReview/Type_7.vue";
import Type_8 from "./formRightReview/Type_8.vue";
import Type_9 from "./formRightReview/Type_9.vue";
import Type_10 from "./formRightReview/Type_10.vue";
import Type_11 from "./formRightReview/Type_11.vue";
import Type_14 from "./formRightReview/Type_14.vue";
import Type_15 from "./formRightReview/Type_15.vue";
import Type_16_1 from "./formRightReview/Type_16_1.vue";
import Type_16_2 from "./formRightReview/Type_16_2.vue";
import Type_17 from "./formRightReview/Type_17.vue";
import Type_18_1 from "./formRightReview/Type_18_1.vue";
import Type_18_2 from "./formRightReview/Type_18_2.vue";
import Type_18_3 from "./formRightReview/Type_18_3.vue";
import Type_19_1 from "./formRightReview/Type_19_1.vue";
import Type_19_2 from "./formRightReview/Type_19_2.vue";
import Type_20 from "./formRightReview/Type_20.vue";
import Type_21 from "./formRightReview/Type_21.vue";
import Type_22_1 from "./formRightReview/Type_22_1.vue";
import Type_22_2 from "./formRightReview/Type_22_2.vue";
import Type_23 from "./formRightReview/Type_23.vue";
import Type_24 from "./formRightReview/Type_24.vue";
import Type_25 from "./formRightReview/Type_25.vue";
import Type_26 from "./formRightReview/Type_26.vue";
import Type_27 from "./formRightReview/Type_27.vue";
import Type_28 from "./formRightReview/Type_28.vue";
import Type_29 from "./formRightReview/Type_29.vue";

let unsubsribe = null;
//let bodyShadow = null;

const AD_FORM_COMPOMENT_TYPE = {
  file: "AdTypeFile",
  image: "AdTypeImage",
  text: "AdTypeTextarea"
};

const baseRequestParam = {
  materialId: "",
  status: 1,
  title: "",
  contents: []
};

export default {
  name: "UploadMaterialForm",
  data() {
    return {
      AD_FORM_COMPOMENT_TYPE,
      materialTitle: "",
      isDialogShow: false,
      openPreviewDialog: false,
      requestParam: { ...baseRequestParam },
      inValidateLinkList: [],
      waringDialogShow: false,
      showPreviewPopup: false
    };
  },
  props: {
    showLoading: {
      type: Boolean
    },
    changeShowLoading: {
      type: Function
    },
    changeHideLoading: {
      type: Function
    },
    storeName: {
      type: String,
      required: true
    },
    allowMaterial: {
      type: Boolean,
      default: true
    },
    isTempTabCreate: {
      type: Boolean
    },
    userSitePermissions: {
      type: Boolean,
      default: true
    },
    device: {
      type: String
    },
    updateUserName: {
      type: String
    },
    updateDate: {
      type: String
    },
    boardId: {
      type: Number,
      required: true
    },
    accountId: {
      type: String
    },
    materialName: {
      type: String
    }
  },
  components: {
    AdTypeImage,
    AdTypeTextarea,
    AdTypeFile,
    Dialog,
    PreviewPopup,
    Type_1,
    Type_2,
    Type_3,
    Type_4,
    Type_5,
    Type_6,
    Type_7,
    Type_8,
    Type_9,
    Type_10,
    Type_11,
    Type_14,
    Type_15,
    Type_16_1,
    Type_16_2,
    Type_17,
    Type_18_1,
    Type_18_2,
    Type_18_3,
    Type_19_1,
    Type_19_2,
    Type_20,
    Type_21,
    Type_22_1,
    Type_22_2,
    Type_23,
    Type_24,
    Type_25,
    Type_26,
    Type_27,
    Type_28,
    Type_29
  },
  directives: { filterSpecifiedSymbols },
  mounted() {
    const { updateRequestParam } = this;
    updateRequestParam();
    unsubsribe = this.$store.subscribe(mutation => {
      const type =
        this.storeName + "/" + MUTATIONS_TYPE.UPDATE_MATERIAL_RESERVATION;
      if (mutation.type === type) {
        updateRequestParam();
        this.inValidateLinkList = [];
      }
    });
  },
  beforeDestroy() {
    // if (bodyShadow instanceof HTMLElement) {
    //   document.body.removeChild(bodyShadow);
    //   bodyShadow = null;
    // }
    unsubsribe();
  },
  computed: {
    ...mapGetters("user", ["getUserStatus"]),
    ...mapState({
      materialReservation(state) {
        return state[this.storeName].materialReservation;
      },
      materialType(state) {
        return state[this.storeName].materialType;
      },
      materialForm(state) {
        return state[this.storeName].materialForm;
      },
      isEditable(state, getters) {
        return getters[
          this.storeName + "/" + GETTERS_TYPE.GET_MATERIAL_RESERVATION_EDITABLE
        ];
      },
      isDeleteAble(state, getters) {
        return getters[
          this.storeName + "/" + GETTERS_TYPE.GET_MATERIAL_RESERVATION_DELETABLE
        ];
      },
      getMaterialFormRequestParam(state, getters) {
        return getters[
          this.storeName + "/" + GETTERS_TYPE.GET_MATERIAL_FORM_REQUEST_PARAM
        ];
      }
    }),
    getUserRole() {
      return this.getUserStatus.role;
    },
    idKey() {
      return this.storeName === "material" ? "reservationId" : "boardId";
    },
    getMaterialPresginedUrl() {
      return this.storeName === "material"
        ? apiGetMaterialPresignedurl
        : apiGetSpareMaterialPresignedurl;
    },
    postMaterialUploadZip() {
      return this.storeName === "material"
        ? apiPostMaterialUploadZip
        : apiPostSpareMaterialUploadZip;
    },
    isUploadMaterialEditing() {
      const {
        materialTitle,
        requestParam: {
          contents: requestParamData,
          title: requestMaterialTitle
        },
        getMaterialFormRequestParam,
        materialType
      } = this;
      const nameCompare = materialTitle === requestMaterialTitle;
      const formCompare = requestParamData.reduce((acc, item) => {
        // 不檢查的欄位(型態 18、21 靜態文字)
        const dontCheck =
          (materialType.typeId === 18 &&
            item.typeGroupNo - 1 === 1 &&
            item.sort - 1 === 7) ||
          (materialType.typeId === 21 &&
            item.typeGroupNo - 1 === 0 &&
            item.sort - 1 === 0);
        const materialFormRequestParam =
          getMaterialFormRequestParam[
            `${item.typeGroupNo - 1}_${item.sort - 1}`
          ] || {};
        const isInnerTextChanged = dontCheck
          ? false
          : item.innerText !== materialFormRequestParam.innerText;
        const isLinkChanged = item.link !== materialFormRequestParam.link;

        if (isInnerTextChanged || isLinkChanged) acc = false;

        return acc;
      }, true);
      return nameCompare && formCompare;
    },
    isDeleteButtonDisabled() {
      return (
        !this.isTempTabCreate &&
        (!this.isEditable ||
          !this.isDeleteAble ||
          !this.allowMaterial ||
          !this.userSitePermissions)
      );
    },
    isPreviewButtonDisabled() {
      return !this.isUploadMaterialEditing || this.isMaterialInCompleted;
    },
    isSaveButtonDisabled() {
      return (
        !this.isEditable || !this.allowMaterial || !this.userSitePermissions
      );
    },
    currentPreview() {
      return preview[`type_${this.materialType.typeId}`] || { list: [] };
    },
    isMaterialInCompleted() {
      if (this.materialReservation.materialResponse.length === 0) return false;
      return !this.materialReservation.materialResponse[0].status;
    },
    warningText() {
      if (
        !this.isEditable ||
        !this.allowMaterial ||
        !this.userSitePermissions
      ) {
        return "無法上傳素材!! (素材已曝光 或 刊期已過 或 沒有拉cue 或 您沒有上傳權限)";
      } else if (!this.isUploadMaterialEditing && this.isTempTabCreate) {
        return "您新增的資料尚未儲存";
      } else if (!this.isUploadMaterialEditing) {
        return "您修改的資料尚未儲存";
      } else if (this.isMaterialInCompleted) {
        return "此素材尚未完整";
      } else {
        return "";
      }
    },
    getMaterialPreviewForEngineer() {
      const { materialType, boardId, requestParam, storeName } = this;
      let materialStoreName =
        storeName === "material" ? "material" : "spareMaterial";
      let typeStatus = materialType.typeId === 18 ? "&status=1" : "";

      return (
        `https://${process.env.VUE_APP_MSC_URL}proof.html` +
        `?typeId=${materialType.typeId}` +
        `&boardId=${boardId}` +
        `&materialId=${requestParam.materialId}` +
        `&materialType=${materialStoreName}` +
        `&mode=snapshot` +
        `${typeStatus}`
      );
    }
  },
  methods: {
    ...mapActions({
      postMaterialReservation(dispatch, payload) {
        return dispatch(
          this.storeName + "/" + ACTIONS_TYPE.POST_MATERIAL_RESERVATION,
          payload
        );
      },
      putMaterialReservation(dispatch, payload) {
        return dispatch(
          this.storeName + "/" + ACTIONS_TYPE.PUT_MATERIAL_RESERVATION,
          payload
        );
      },
      deleteMaterialReservation(dispatch, payload) {
        return dispatch(
          this.storeName + "/" + ACTIONS_TYPE.DELETE_MATERIAL_RESERVATION,
          payload
        );
      }
    }),
    ...mapMutations({
      updateMaterialForm(commit, payload) {
        return commit(
          this.storeName + "/" + MUTATIONS_TYPE.UPDATE_MATERIAL_FORM,
          payload
        );
      }
    }),
    // 更新素材資料請求參數
    updateRequestParam() {
      let contents = [];
      const { materialReservation, materialType, idKey } = this;
      if (
        materialReservation.materialResponse &&
        materialReservation.materialResponse.length > 0
      ) {
        contents = materialReservation.materialResponse[0].contents.map(
          item => {
            return {
              innerText: item.innerText,
              link: item.link,
              sort: item.sort,
              typeGroupNo: item.typeGroupNo
            };
          }
        );
        this.requestParam = {
          ...this.requestParam,
          contents,
          [idKey]: materialType[idKey],
          title: materialReservation.materialResponse[0].title,
          status: materialReservation.materialResponse[0].status,
          materialId: materialReservation.materialResponse[0].id,
          edible: materialReservation.materialResponse[0].edible
        };

        // 新增素材的複製素材選項會有沒傳 title
        if (materialReservation.materialResponse[0].title) {
          this.materialTitle = materialReservation.materialResponse[0].title;
        } else {
          this.materialTitle = this.materialName || "新增素材001";
        }
      } else {
        contents = materialType.groupList.reduce((acc, item, index) => {
          item.elementList.forEach((elementItem, elementIndex) => {
            acc.push({
              innerText: "",
              link: "",
              sort: elementIndex + 1,
              typeGroupNo: item.groupNo
            });
          });
          return acc;
        }, []);
        this.requestParam = {
          ...baseRequestParam,
          contents,
          [idKey]: materialType[idKey]
        };
        this.materialTitle = this.materialName || "新增素材001";
      }
    },
    // 存圖片 file name
    async uploadImage() {
      const {
        materialType,
        materialForm,
        updateMaterialForm,
        getMaterialPresginedUrl,
        idKey
      } = this;
      const adTypeData = materialForm[`typeData_${materialType.typeId}`];
      const imageFile = Object.keys(adTypeData).reduce((acc, key) => {
        if (
          key.match(/image_file/g) &&
          Object.keys(adTypeData[key]).length > 0
        ) {
          acc.push({
            file: adTypeData[key],
            resetKey: key,
            updateKey: key.replace(/_file/g, "")
          });
        }
        return acc;
      }, []);
      const imageFileNameStr = imageFile.map(item => item.file.name).join(",");
      if (imageFileNameStr.length === 0) return;
      try {
        const {
          data: { response: apiResponse }
        } = await getMaterialPresginedUrl({
          fileName: imageFileNameStr,
          [idKey]: materialType[idKey]
        });
        for (let [resIndex, resItem] of apiResponse.entries()) {
          await axios({
            method: "put",
            url: resItem.url,
            data: imageFile[resIndex].file,
            headers: { "content-type": `${imageFile[resIndex].file.type}` }
          });
          updateMaterialForm({
            updateType: materialType.typeId,
            updateKey: imageFile[resIndex].updateKey,
            value: resItem.imgSrc
          });
          updateMaterialForm({
            updateType: materialType.typeId,
            updateKey: imageFile[resIndex].resetKey,
            value: ""
          });
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async uploadZipFile() {
      const {
        materialType,
        materialForm,
        idKey,
        postMaterialUploadZip,
        updateMaterialForm
      } = this;
      const adTypeData = materialForm[`typeData_${materialType.typeId}`];
      const fileAry = Object.keys(adTypeData).reduce((acc, key) => {
        if (key.match(/file_file/g) && adTypeData[key] instanceof FormData) {
          acc.push({
            file: adTypeData[key],
            resetKey: key,
            updateKey: key.replace(/_file/g, "")
          });
        }
        return acc;
      }, []);
      if (fileAry.length === 0) return;
      try {
        for (let fileItem of fileAry) {
          const {
            data: { response: apiResponse }
          } = await postMaterialUploadZip({
            file: fileItem.file,
            id: materialType[idKey]
          });
          updateMaterialForm({
            updateType: materialType.typeId,
            updateKey: fileItem.updateKey,
            value: apiResponse.imgSrc
          });
          updateMaterialForm({
            updateType: materialType.typeId,
            updateKey: fileItem.resetKey,
            value: ""
          });
        }
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    },
    // 儲存
    async handleSubmit() {
      const {
        changeShowLoading,
        uploadImage,
        changeHideLoading,
        materialTitle,
        requestParam,
        postMaterialReservation,
        putMaterialReservation,
        uploadZipFile,
        updateInValidateLinkList,
        device,
        materialType: { typeId },
        isKeywordValid
      } = this;
      // 檢查連結欄位是否符合http格式
      if (
        device !== "APP" &&
        (updateInValidateLinkList() || this.inValidateLinkList.length > 0)
      )
        return;

      // 型態7驗證文案是否包含關鍵字
      if (typeId === 7 && !isKeywordValid()) return;

      // 秀 loading 圖
      changeShowLoading();
      try {
        // 上傳圖片
        await uploadImage();
        // 上傳壓縮檔
        await uploadZipFile();
        //更新上傳參數資料
        requestParam.title = materialTitle;
        requestParam.contents = requestParam.contents.map(item => {
          return {
            ...item,
            ...this.getMaterialFormRequestParam[
              `${item.typeGroupNo - 1}_${item.sort - 1}`
            ]
          };
        });
        // 有 materialId 代表新增過，用修改 api，無 materialId 代表是新增，用新增 api
        if (requestParam.materialId) {
          await putMaterialReservation(requestParam);
        } else {
          await postMaterialReservation(requestParam);
        }
        this.$emit("materialSubmit");
      } catch (error) {
        changeHideLoading();
        console.log(error);
      }
    },
    // 刪除素材
    async deleteMaterial() {
      const {
        deleteMaterialReservation,
        materialType: { reservationId },
        requestParam: { materialId },
        $route: { name: pageName }
      } = this;
      if (materialId) {
        const payload =
          pageName !== "Material"
            ? { materialId }
            : { materialId, reservationId };
        try {
          await deleteMaterialReservation(payload);
          this.$emit("materialDelete");
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$emit("materialDelete");
      }
    },
    // 開啟預覽
    changeOpenPreviewDialog() {
      this.showPreviewPopup = true;
    },
    // 關閉預覽
    closePreviewDialog(value) {
      this.openPreviewDialog = value;
    },
    // dialog 確認鈕
    dialogConfirmClick() {
      this.deleteMaterial();
      this.isDialogShow = false;
    },
    // dialog 取消鈕
    dialogCancelClick() {
      this.isDialogShow = false;
    },
    updateInValidateLinkList() {
      const { getMaterialFormRequestParam } = this;
      this.inValidateLinkList = [];
      Object.keys(getMaterialFormRequestParam).forEach(key => {
        if (
          getMaterialFormRequestParam[key].link &&
          !getMaterialFormRequestParam[key].link.match(/(http(s?)):\/\//)
        ) {
          this.inValidateLinkList = [key, ...this.inValidateLinkList];
        }
      });
    },
    openWarningDialog(e) {
      this.waringDialogShow = true;
    },
    filterValue($el, dataName) {
      if ($el.key === "Enter") return;
      return (this.$data[dataName] = utilsFilterSpecifiedSymbols(
        $el.target.value
      ));
    },
    // 型態7檢查文案是否包含關鍵字
    isKeywordValid() {
      const { getMaterialFormRequestParam } = this;
      if (
        getMaterialFormRequestParam["0_1"].innerText &&
        getMaterialFormRequestParam["0_0"].innerText &&
        getMaterialFormRequestParam["0_1"].innerText
          .toLowerCase()
          .indexOf(
            getMaterialFormRequestParam["0_0"].innerText.toLowerCase()
          ) === -1
      )
        return false;
      return true;
    }
  }
};
</script>

<style>
.body_shadow {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background-color: transparent;
  z-index: 999;
}
</style>
<style lang="scss" scoped>
@import "~@/scss/component/variables.scss";

.top_block {
  &::after {
    content: "";
    clear: both;
    display: block;
  }

  .warning_text {
    float: left;
    line-height: 35px;
    color: $red;
    font-size: 14px;
  }

  .delete_block {
    float: right;
    .exposed {
      margin-right: 8px;
      color: #ea475b;
      font-size: 16px;
      font-weight: initial;
    }
  }
}

.publish_form {
  display: flex;
  margin-top: 24px;

  .publish_form_left_block {
    min-width: 420px;

    .material_id {
      margin-bottom: 24px;
      display: flex;

      span {
        &:first-child {
          font-size: 14px;
          font-weight: bold;
          line-height: 1.43;
          letter-spacing: 1.43px;
          color: #292929;
          border-radius: 12px;
          background-color: #eee;
          padding: 2px 12px;
        }

        &:nth-child(2) {
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;

          img {
            margin: 0 4px 0 12px;
            width: 24px;
          }

          a {
            color: #0e66c7;

            &:hover {
              text-decoration: none;
            }
          }
        }
      }
    }

    .material_name_block {
      border-bottom: 1px solid #e2e1e1;
      padding-bottom: 24px;

      .material_name {
        font-size: 16px;
        font-weight: bold;
        line-height: 1.38;
        letter-spacing: 1.38px;
        color: #292929;
        margin-bottom: 8px;
      }
    }

    .group_list_block {
      padding-bottom: 30px;
      border-bottom: 1px solid #ddd;

      .group_list_title {
        font-size: 18px;
        font-weight: bold;
        color: #00afb8;
        margin-top: 20px;
      }

      &:last-child {
        padding-bottom: 0px;
        border-bottom: 0px;
      }
    }
  }

  .img_view_block {
    margin-left: 24px;
    border: solid 1px #e2e1e1;
    background-color: #f8f8f8;
    padding: 14px 18px;
    width: 456px;
    min-height: 360px;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #2d2d2d;
      justify-content: flex-start;
      align-items: baseline;
      margin: 15px 0 0;

      span {
        font-size: 12px;
        margin-left: 15px;
      }
    }

    .review_content {
      border: dashed 1px #e2e1e1;
      background-color: #fff;
      margin-top: 16px;
      padding: 20px 35px;
      min-height: 313px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.narrow {
        padding: 20px 8px;
      }

      img {
        margin-left: 0;
      }
    }
  }
}

.last_edit_user {
  font-size: 14px;
  color: #ea475b;
  text-align: right;
  margin-top: 24px;
  letter-spacing: 1.43px;
  line-height: 1.43;
}

.button_block {
  text-align: right;
  margin-top: 24px;
  position: relative;
  height: 35px;

  button {
    position: absolute;

    &:nth-child(1) {
      right: 138px;
    }
    &:nth-child(2) {
      right: 69px;
      z-index: 1;
    }
    &:nth-child(3) {
      right: 0;
    }
  }
}
</style>
