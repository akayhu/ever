<template>
  <div>
    <div class="file_title">{{ itemData.title }}</div>
    <p class="file_explanation">
      檔案大小上限：{{ itemData.fileLimit }}KB，檔案格式：zip
    </p>
    <div class="file_file">
      <input
        @change="fileChange($event)"
        :id="`upload_file_${typeDataIndex}_${elementIndex}`"
        :disabled="!isEditable || !allowMaterial || !userSitePermissions"
        accept="application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream"
        multiple
        type="file"
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
      <span v-if="!fileName" class="fileName">
        {{ fileName ? `${fileName}` : "未上傳檔案" }}
      </span>
      <span v-else class="fileName">{{ fileName }}</span>
      <div v-show="errorMsg" v-text="errorMsg" class="file_file_warning" />
    </div>
    <div v-if="itemData.linkable === 1" class="file_link">
      <input
        :class="{ warning: isLinkValidate }"
        :value="url"
        :disabled="!isEditable || !allowMaterial || !userSitePermissions"
        @change="changeUrl"
        class="link"
        heightType="38"
        widthType="360"
        placeholder="https://"
        maxlength="1500"
      />
      <span
        v-if="elementIndex !== 0"
        @click="setPreviousUrl"
        class="ditto"
        :class="{
          ditto_disabled:
            !getPreviousUrl ||
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
  EXCEED_SIZE: "上傳超過限制尺寸",
  WRONG_FORMAT: "上傳錯誤檔案格式",
  WORD_COUNT_LONG: "檔案名稱過長"
};

export default {
  name: "AdTypeFile",
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
      required: true
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
      fileName(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `file_name_${typeDataIndex}_${elementIndex}`;
        return state[this.storeName].materialForm[type][key];
      },
      url(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `file_url_${typeDataIndex}_${elementIndex}`;
        return state[this.storeName].materialForm[type][key];
      },
      typeId(state) {
        return state[this.storeName].materialType.typeId;
      },
      getPreviousUrl(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `file_url_${typeDataIndex}_${elementIndex - 1}`;
        const imgKey = `image_url_${typeDataIndex}_${elementIndex - 1}`;
        if (state[this.storeName].materialForm[type][key]) {
          return state[this.storeName].materialForm[type][key];
        } else {
          return state[this.storeName].materialForm[type][imgKey];
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
    fileCheck(file) {
      const {
        itemData: { fileLimit },
        bytesToSize
      } = this;
      console.log(`容量: ${file.size} Byte`);
      console.log(`容量: ${bytesToSize(file.size)} KB`);
      console.log(file);
      if (file.name.length >= 100) {
        this.errorMsg = ERROR["WORD_COUNT_LONG"];
      } else if (
        !file.type.match(
          /application\/(zip|x-zip-compressed|x-zip|octet-stream)/g
        )
      ) {
        this.errorMsg = ERROR["WRONG_FORMAT"];
      } else if (bytesToSize(file.size) > fileLimit) {
        this.errorMsg = ERROR["EXCEED_SIZE"];
      } else {
        this.errorMsg = "";
      }
    },
    // 上傳檔案
    fileChange(el) {
      const { fileCheck, changePreviewFile } = this;
      if (!el.target.files[0].size) return;
      if (fileCheck(el.target.files[0]) || this.errorMsg) {
        return (el.target.value = "");
      }
      changePreviewFile(el.target.files[0]);
      el.target.value = "";
    },
    // 打開上傳 file
    fileClick() {
      const { typeDataIndex, elementIndex } = this;
      document
        .querySelector(`#upload_file_${typeDataIndex}_${elementIndex}`)
        .click();
    },
    // 上傳 zip 檔
    changePreviewFile(file) {
      const { typeDataIndex, elementIndex, updateMaterialType, typeId } = this;
      const formData = new FormData();
      formData.append("zip", file);
      updateMaterialType({
        updateType: typeId,
        updateKey: `file_${typeDataIndex}_${elementIndex}`,
        value: ""
      });
      updateMaterialType({
        updateType: typeId,
        updateKey: `file_file_${typeDataIndex}_${elementIndex}`,
        value: formData
      });
      updateMaterialType({
        updateType: typeId,
        updateKey: `file_name_${typeDataIndex}_${elementIndex}`,
        value: file.name
      });
    },
    // 容量的多少
    bytesToSize(bytes) {
      if (bytes === 0) return "0 B";
      return bytes / 1024;
    },
    // 內容網址
    changeUrl(e) {
      const { typeDataIndex, elementIndex, updateMaterialType, typeId } = this;
      if (e && e.target.value)
        e.target.value = e.target.value.replace(/\%E2%80%8B/g, "").trim();
      updateMaterialType({
        updateType: typeId,
        updateKey: `file_url_${typeDataIndex}_${elementIndex}`,
        value: removeJobSource(
          e.target.value.replace(/[\u4e00-\u9fa5]/gi, "").replace(/\u200B/g, "")
        )
      });
    },
    // 同上網址
    setPreviousUrl() {
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
      const key = `file_url_${typeDataIndex}_${elementIndex - 1}`;
      const imgKey = `image_url_${typeDataIndex}_${elementIndex - 1}`;
      if (!isEditable || !allowMaterial || !userSitePermissions) return;
      if (storeName === "cushion") {
        if (getCushionExposuresListData.materialForm[type][key]) {
          changeUrl("", getCushionExposuresListData.materialForm[type][key]);
        } else if (getCushionExposuresListData.materialForm[type][imgKey]) {
          changeUrl("", getCushionExposuresListData.materialForm[type][imgKey]);
        }
      } else if (storeName === "material") {
        if (getMaterialExposuresListData.materialForm[type][key]) {
          changeUrl("", getMaterialExposuresListData.materialForm[type][key]);
        } else if (getMaterialExposuresListData.materialForm[type][imgKey]) {
          changeUrl(
            "",
            getMaterialExposuresListData.materialForm[type][imgKey]
          );
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.file_title {
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  letter-spacing: 1.38px;
  color: #292929;
  margin: 20px 0 10px;
}

.file_explanation {
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 1.43px;
  color: #7e7e7e;
  margin-bottom: 20px;
  width: 380px;
}

.file_file_warning {
  color: #ea475b;
  font-size: 14px;
  padding-top: 5px;
}

.upload_file {
  margin-top: 10px;
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

  &.disabled {
    cursor: not-allowed;
    color: #a9a9a9;
    border-color: #a9a9a9;
    font-weight: normal;
  }
}

.fileName {
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 1px;
  color: #7e7e7e;
  margin-left: 10px;

  img {
    vertical-align: text-bottom;
  }
}

.file_link {
  > input {
    &.warning {
      border: 1px solid #ea475b;
    }
  }
}

.link {
  margin-top: 10px;
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
