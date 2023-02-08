<template>
  <div>
    <span
      v-if="typeId === 7 && !isEditable && elementIndex === 0"
      class="exposed_warning"
      >關鍵字已曝光</span
    >
    <div class="textarea_title">{{ itemData.title }}</div>
    <div
      :class="[
        getHiddenBlock ? 'hidden' : 'textarea_block',
        isKeywordValid ? '' : 'warning'
      ]"
    >
      <el-input
        @input="immediate"
        @focus="immediateFocus"
        @blur="immediateBlur"
        :value="content"
        :disabled="!isEditable || !allowMaterial || !userSitePermissions"
        :maxlength="itemData.textLimit"
        :autosize="{ minRows: 1, maxRows: 3 }"
        :resize="itemData.textLimit <= 20 ? 'none' : ''"
        show-word-limit
        type="textarea"
        placeholder="請輸入"
      >
      </el-input>
    </div>
    <span
      class="keyword-warning"
      v-if="typeId === 7 && !isKeywordValid && elementIndex === 1"
    >
      文案無關鍵字
    </span>
    <div v-if="itemData.linkable === 1" class="textarea_link">
      <input
        @change="changeUrl"
        :class="{ warning: isLinkValidate }"
        :value="url"
        :disabled="!isEditable || !allowMaterial || !userSitePermissions"
        heightType="38"
        widthType="360"
        placeholder="https://"
        maxlength="1500"
      />
      <span
        v-if="elementIndex !== 0 && typeId !== 7"
        @click="setPreviousLink"
        :class="
          !getPreviousUrl ||
          !isEditable ||
          !allowMaterial ||
          !userSitePermissions
            ? 'ditto ditto_disabled'
            : 'ditto'
        "
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
import { removeJobSource } from "@/utils/handler/urlHandler";
import {
  utilsFilterSpecifiedSymbols,
  utilsFilterEnterSymbols
} from "@/utils/utilsFilterSpecifiedSymbols";

export default {
  name: "AdTypeTextarea",
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
  computed: {
    ...mapGetters("cushion", ["getCushionExposuresListData"]),
    ...mapGetters("material", ["getMaterialExposuresListData"]),
    ...mapState({
      content(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `content_${typeDataIndex}_${elementIndex}`;
        return state[this.storeName].materialForm[type][key];
      },
      url(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `content_url_${typeDataIndex}_${elementIndex}`;
        return state[this.storeName].materialForm[type][key];
      },
      typeId(state) {
        return state[this.storeName].materialType.typeId;
      },
      getPreviousUrl(state) {
        const { typeDataIndex, elementIndex, typeId } = this;
        const type = `typeData_${typeId}`;
        const key = `content_url_${typeDataIndex}_${elementIndex - 1}`;
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
    },
    isKeywordValid() {
      const {
        typeDataIndex,
        typeId,
        storeName,
        getCushionExposuresListData,
        getMaterialExposuresListData
      } = this;
      if (typeId === 7) {
        const type = `typeData_${typeId}`;
        const keywordKey = `content_${typeDataIndex}_0`;
        const contentKey = `content_${typeDataIndex}_1`;
        let keyword = "";
        let content = "";

        if (storeName === "cushion") {
          keyword = getCushionExposuresListData.materialForm[type][keywordKey];
          content = getCushionExposuresListData.materialForm[type][contentKey];
        } else if (storeName === "material") {
          keyword = getMaterialExposuresListData.materialForm[type][keywordKey];
          content = getMaterialExposuresListData.materialForm[type][contentKey];
        }
        if (
          keyword &&
          content &&
          content.toLowerCase().indexOf(keyword.toLowerCase()) === -1
        )
          return false;
      }
      return true;
    },
    // 型態 18、21 直接帶入欄位內容，隱藏輸入框不可更改，只能輸入網址
    getHiddenBlock() {
      const { immediate, itemData, typeId, typeDataIndex, elementIndex } = this;
      const isHidden =
        (typeId === 18 && typeDataIndex === 1 && elementIndex === 7) ||
        (typeId === 21 && typeDataIndex === 0 && elementIndex === 0);
      if (isHidden) immediate(itemData.title);
      return isHidden;
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
    // 內容
    immediate(textValue) {
      const { typeDataIndex, elementIndex, updateMaterialType, typeId } = this;
      updateMaterialType({
        updateType: typeId,
        updateKey: `content_${typeDataIndex}_${elementIndex}`,
        value: utilsFilterSpecifiedSymbols(utilsFilterEnterSymbols(textValue))
      });
    },
    // 內容網址
    changeUrl(e, previousUrl) {
      const { typeDataIndex, elementIndex, updateMaterialType, typeId } = this;
      if (e && e.target.value)
        e.target.value = e.target.value.replace(/\%E2%80%8B/g, "").trim();
      updateMaterialType({
        updateType: typeId,
        updateKey: `content_url_${typeDataIndex}_${elementIndex}`,
        value: previousUrl
          ? previousUrl.replace(/\u200B/g, "")
          : removeJobSource(
              e.target.value
                .replace(/[\u4e00-\u9fa5]/gi, "")
                .replace(/\u200B/g, "")
            )
      });
    },
    // 獲取焦點
    immediateFocus() {
      const { typeDataIndex, elementIndex } = this;
      const contentDom = document.querySelectorAll(
        `.content_${typeDataIndex}_${elementIndex}`
      );
      contentDom.forEach(item => {
        item.style.border = "1px solid #00afb8";
        item.style.backgroundColor = "rgba(57, 200, 208, 0.1)";
      });
    },
    // 移除焦點
    immediateBlur() {
      const { typeDataIndex, elementIndex } = this;
      const contentDom = document.querySelectorAll(
        `.content_${typeDataIndex}_${elementIndex}`
      );
      contentDom.forEach(item => {
        item.removeAttribute("style");
      });
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
      const key = `content_url_${typeDataIndex}_${elementIndex - 1}`;
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

<style>
.textarea_block textarea {
  background-color: #f3f3f3 !important;
  border: 1px dashed #ddd;
  font-size: 16px;
}
.textarea_block .el-input__count {
  color: #7e7e7e !important;
  background-color: #f3f3f3 !important;
}
.textarea_block .el-textarea__inner {
  padding: 5px !important;
}
.textarea_block .el-textarea__inner:focus {
  border: 1px dashed #00afb8 !important;
}
</style>

<style lang="scss" scoped>
.textarea_title {
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  letter-spacing: 1.38px;
  color: #292929;
  margin: 20px 0 10px;
}

.textarea_block {
  width: 360px;
  border-radius: 4px;
  border: solid 1px #ddd;
  background-color: #f3f3f3;
  padding: 10px 6px;
  margin-bottom: 10px;

  &.warning {
    border: 1px solid #ea475b;
  }
}

.hidden {
  display: none;
}

.textarea_link {
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

.exposed_warning {
  @extend .link-warning;
  padding-top: 30px;
  font-size: 14px;
  letter-spacing: 1.38px;
}

.keyword-warning {
  @extend .link-warning;
  font-size: 14px;
  letter-spacing: 1.38px;
  padding: 8px 0;
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
