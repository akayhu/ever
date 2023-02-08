<template>
  <div>
    <div class="img_title">{{ itemData.title }}</div>
    <p class="img_explanation">
      {{ itemData.title }}：{{ itemData.width }} x
      {{ itemData.height }} 像素，檔案大小上限：{{
        itemData.fileLimit
      }}KB，圖片格式：png、jpg、gif
    </p>
    <div class="img_file">
      <input
        @change="fileChange($event)"
        :id="`upload_file_${typeDataIndex}_${elementIndex}`"
        :disabled="!isEditable || !allowMaterial || !userSitePermissions"
        multiple
        type="file"
        accept=".png,.jpg,.jpeg,.gif"
        style="display: none;"
      />
      <span
        @click="fileClick"
        :class="{
          disabled: !isEditable || !allowMaterial || !userSitePermissions
        }"
        class="avatar-uploader"
      >
        <template>
          <img
            v-if="isEditable && allowMaterial && userSitePermissions"
            src="@/assets/icon/icon-photo-empty-blue.svg"
          />
          <img v-else src="@/assets/icon/icon-icon-photo.svg" />
        </template>
        上傳檔案
      </span>
      <span v-if="!imgName" class="imgName">
        {{ imgName ? `${imgName}` : "未上傳檔案" }}
      </span>
      <span v-else class="imgName">{{ imgName }}</span>
      <div v-show="errorMsg" v-text="errorMsg" class="img_file_warning" />
    </div>
    <div class="img_link" v-if="itemData.linkable === 1">
      <input
        :class="{ warning: isLinkValidate }"
        :value="imgLink"
        @input="changeUrl"
        :disabled="!isEditable || !allowMaterial || !userSitePermissions"
        class="upload_file"
        heightType="38"
        widthType="360"
        placeholder="https://"
        maxlength="1500"
      />
      <span
        v-if="elementIndex !== 0"
        @click="setPreviousLink"
        class="ditto"
        :class="{
          ditto_disabled:
            !getPreviousLink ||
            !isEditable ||
            !allowMaterial ||
            !userSitePermissions
        }"
      >
        同上
      </span>
      <span class="link-warning" v-show="isLinkValidate">
        請輸入正確網址
      </span>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from "vuex";
import { MUTATIONS_TYPE } from "@/store/share/uploadMaterial/mutations";
import { ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";
import { removeJobSource } from "@/utils/handler/urlHandler";

let unsubsribe = null;

const ERROR = {
  EXCEED_SIZE: "超過檔案大小上限，請重新上傳",
  WRONG_FORMAT: "檔案格式錯誤，請重新上傳",
  IMAGE_WRONG_SIZE: "尺寸錯誤，請重新上傳",
  WORD_COUNT_LONG: "檔案名稱過長"
};

export default {
  name: "AdTypeImage",
  data() {
    return {
      errorMsg: ""
    };
  },
  props: {
    storeName: {
      type: String,
      required: true
    },
    itemData: {
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
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    userSitePermissions: {
      type: Boolean,
      required: true
    },
    allowMaterial: {
      type: Boolean,
      default: true
    },
    inValidateLinkList: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    unsubsribe = this.$store.subscribeAction(actions => {
      const type = this.storeName + "/" + ACTIONS_TYPE.GET_MATERIAL_RESERVATION;
      if (actions.type === type) {
        this.errorMsg = "";
      }
    });
  },
  beforeDestroy() {
    unsubsribe();
  },
  computed: {
    ...mapGetters("cushion", ["getCushionExposuresListData"]),
    ...mapGetters("material", ["getMaterialExposuresListData"]),
    ...mapState({
      imgLink(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `image_url_${typeDataIndex}_${elementIndex}`;
        return state[this.storeName].materialForm[type][key];
      },
      imgName(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `image_name_${typeDataIndex}_${elementIndex}`;
        return state[this.storeName].materialForm[type][key];
      },
      typeId(state) {
        return state[this.storeName].materialType.typeId;
      },
      getPreviousLink(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `image_url_${typeDataIndex}_${elementIndex - 1}`;
        const contentKey = `content_url_${typeDataIndex}_${elementIndex - 1}`;
        if (state[this.storeName].materialForm[type][key]) {
          return state[this.storeName].materialForm[type][key];
        } else {
          return state[this.storeName].materialForm[type][contentKey];
        }
      }
    }),
    isLinkValidate() {
      const { inValidateLinkList, elementIndex, typeDataIndex } = this;
      return (
        inValidateLinkList.indexOf(`${typeDataIndex}_${elementIndex}`) > -1
      );
    }
  },
  methods: {
    ...mapMutations({
      updateMaterialType(commit, payload) {
        return commit(
          this.storeName + "/" + MUTATIONS_TYPE.UPDATE_MATERIAL_FORM,
          payload
        );
      }
    }),
    fileCheck(file, width, height) {
      const {
        itemData,
        itemData: { fileLimit },
        bytesToSize
      } = this;
      console.log(`容量: ${file.size} Byte`);
      console.log(`容量: ${bytesToSize(file.size)} KB`);
      console.log(`圖片寬: ${width}`);
      console.log(`圖片高: ${height}`);
      if (file.name.length >= 100) {
        this.errorMsg = ERROR["WORD_COUNT_LONG"];
      } else if (!file.type.match(/image\/(png|jpg|jpeg|gif)/)) {
        this.errorMsg = ERROR["WRONG_FORMAT"];
      } else if (bytesToSize(file.size) > fileLimit) {
        this.errorMsg = ERROR["EXCEED_SIZE"];
      } else if (width > itemData.width || height > itemData.height) {
        this.errorMsg = ERROR["IMAGE_WRONG_SIZE"];
      } else {
        this.errorMsg = "";
      }
    },
    // 上傳檔案
    fileChange(el) {
      const { fileCheck, changePreviewImage } = this;
      const _URL = window.URL || window.webkitURL;
      if (!el.target.files[0].size) return;
      let img = new Image();
      img.src = _URL.createObjectURL(el.target.files[0]);
      img.onload = () => {
        if (
          fileCheck(el.target.files[0], img.width, img.height) ||
          this.errorMsg
        ) {
          return (el.target.value = "");
        }
        changePreviewImage(el.target.files[0]);
        el.target.value = "";
      };
    },
    // 打開上傳 file
    fileClick() {
      const { typeDataIndex, elementIndex } = this;
      document
        .querySelector(`#upload_file_${typeDataIndex}_${elementIndex}`)
        .click();
    },
    // 即時預覽圖
    changePreviewImage(file) {
      let self = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        file.src = this.result;
        const {
          typeDataIndex,
          elementIndex,
          updateMaterialType,
          typeId
        } = self;
        updateMaterialType({
          updateType: typeId,
          updateKey: `image_${typeDataIndex}_${elementIndex}`,
          value: file.src
        });
        updateMaterialType({
          updateType: typeId,
          updateKey: `image_file_${typeDataIndex}_${elementIndex}`,
          value: file
        });
        updateMaterialType({
          updateType: typeId,
          updateKey: `image_name_${typeDataIndex}_${elementIndex}`,
          value: file.name
        });
      };
    },
    // 圖片網址
    changeUrl(e, previousUrl) {
      const { typeDataIndex, elementIndex, updateMaterialType, typeId } = this;
      if (e && e.target.value)
        e.target.value = e.target.value.replace(/\%E2%80%8B/g, "").trim();
      const imgUrlData = {
        updateType: typeId,
        updateKey: `image_url_${typeDataIndex}_${elementIndex}`,
        value: previousUrl
          ? previousUrl.replace(/\u200B/g, "")
          : removeJobSource(
              e.target.value
                .replace(/[\u4e00-\u9fa5]/gi, "")
                .replace(/\u200B/g, "")
            )
      };
      updateMaterialType(imgUrlData);
    },
    // 容量的多少
    bytesToSize(bytes) {
      if (bytes === 0) return "0 B";
      return bytes / 1024;
    },
    // 同上網址
    setPreviousLink() {
      const {
        isEditable,
        allowMaterial,
        userSitePermissions,
        getCushionExposuresListData,
        getMaterialExposuresListData,
        storeName,
        typeDataIndex,
        elementIndex,
        typeId,
        changeUrl
      } = this;
      const type = `typeData_${typeId}`;
      const key = `image_url_${typeDataIndex}_${elementIndex - 1}`;
      const contentKey = `content_url_${typeDataIndex}_${elementIndex - 1}`;
      if (!isEditable || !allowMaterial || !userSitePermissions) return;
      if (storeName === "cushion") {
        if (getCushionExposuresListData.materialForm[type][key]) {
          changeUrl("", getCushionExposuresListData.materialForm[type][key]);
        } else if (getCushionExposuresListData.materialForm[type][contentKey]) {
          changeUrl(
            "",
            getCushionExposuresListData.materialForm[type][contentKey]
          );
        }
      } else if (storeName === "material") {
        if (getMaterialExposuresListData.materialForm[type][key]) {
          changeUrl("", getMaterialExposuresListData.materialForm[type][key]);
        } else if (
          getMaterialExposuresListData.materialForm[type][contentKey]
        ) {
          changeUrl(
            "",
            getMaterialExposuresListData.materialForm[type][contentKey]
          );
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.img_title {
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  letter-spacing: 1.38px;
  color: #292929;
  margin: 24px 0 8px;
}

.img_explanation {
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 1.43px;
  color: #7e7e7e;
  margin-bottom: 16px;
  width: 380px;
}

.img_file_warning {
  color: #ea475b;
  font-size: 14px;
  padding-top: 5px;
}

.upload_file {
  margin-top: 16px;
}

.avatar-uploader {
  border-radius: 4px;
  border: dashed 1px #00afb8;
  width: 124px;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.43;
  letter-spacing: 1.38px;
  color: #00afb8;
  padding: 7px 6px;
  text-align: center;
  display: inline-block;
  cursor: pointer;

  img {
    margin-top: -2px;
  }

  &:hover {
    background-color: #e6f9fa;
  }

  &.disabled {
    cursor: not-allowed;
    color: #a9a9a9;
    border-color: #a9a9a9;
    font-weight: normal;

    &:hover {
      background-color: #fff;
    }
  }
}

.imgName {
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 1px;
  color: #7e7e7e;
  margin-left: 10px;

  img {
    vertical-align: text-bottom;
  }
}

.img_link {
  > input {
    &.warning {
      border: 1px solid #ea475b;
    }
  }
}

.link-warning {
  display: block;
  color: #ea475b;
  font-size: 16px;
  padding-top: 5px;
}

.ditto {
  border-radius: 4px;
  border: solid 1px #30a9b0;
  color: #30a9b0;
  background-color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 8px 10px;
  margin-left: 8px;
  display: inline-block;
  cursor: pointer;
}

.ditto_disabled {
  border: solid 1px #a9a9a9;
  color: #a9a9a9;
  background-color: #fff;
  cursor: not-allowed;
}
</style>
