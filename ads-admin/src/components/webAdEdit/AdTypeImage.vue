<template>
  <tbody class="image_tbody">
    <!-- 命名 -->
    <tr>
      <th>命名</th>
      <td>
        <input
          v-model="title"
          :placeholder="`請輸入圖片名稱(顯示於前台)`"
          :class="{
            error_message_border:
              vTypeData[`title_${typeDataIndex}_${elementIndex}`].$error
          }"
          widthType="380"
          :disabled="!getUserAuthority.webBoardEdit"
        />
        <ValidationError
          :vData="vTypeData[`title_${typeDataIndex}_${elementIndex}`]"
          text="請填入命名名稱"
        />
      </td>
    </tr>

    <!-- 屬性 -->
    <tr>
      <th>屬性</th>
      <td>
        <div class="d-flex">
          <div>
            <label class="ad-radio-label lh-radio">
              <input
                type="radio"
                v-model="elementType"
                :disabled="!getUserAuthority.webBoardEdit"
                value="image"
              />
              <span class="ad-radio"></span>
              <span class="title">圖片</span>(GIF/JPG/PNG等)
            </label>
          </div>
          <div>
            <label class="ad-radio-label lh-radio">
              <input
                type="radio"
                v-model="elementType"
                :disabled="!getUserAuthority.webBoardEdit"
                value="file"
              />
              <span class="ad-radio"></span>
              <span class="title">檔案</span>
            </label>
          </div>
        </div>
      </td>
    </tr>

    <!-- 圖片尺寸 -->
    <tr>
      <th>尺寸</th>
      <td>
        <span>
          <input
            v-model="width"
            :class="{
              error_message_border:
                vTypeData[`width_${typeDataIndex}_${elementIndex}`].$error
            }"
            :disabled="!getUserAuthority.webBoardEdit"
            placeholder="請輸入"
            widthType="78"
          />
        </span>
        <span class="ml8 mr16">寬</span>
        <span>
          <input
            v-model="height"
            :class="{
              error_message_border:
                vTypeData[`height_${typeDataIndex}_${elementIndex}`].$error
            }"
            :disabled="!getUserAuthority.webBoardEdit"
            placeholder="請輸入"
            widthType="78"
          />
        </span>
        <span class="ml8">高</span>
        <span class="ml8 annotation">像素(px)</span>
        <ValidationError
          :vData="vTypeData[`width_${typeDataIndex}_${elementIndex}`]"
          text="請填入圖片尺寸寬"
        />
        <ValidationError
          :vData="vTypeData[`height_${typeDataIndex}_${elementIndex}`]"
          text="請填入圖片尺寸高"
        />
      </td>
    </tr>

    <!-- 檔案限制 -->
    <tr class="bb1">
      <th>檔案</th>
      <td>
        <span>
          <input
            v-model="fileLimit"
            v-filterSpecifiedSymbols
            :class="{
              error_message_border:
                vTypeData[`fileLimit_${typeDataIndex}_${elementIndex}`].$error
            }"
            :disabled="!getUserAuthority.webBoardEdit"
            placeholder="請輸入"
            widthType="78"
          />
        </span>
        <span class="annotation ml8 mr28">KB</span>
        <span class="titie pt10 mr16">連結</span>
        <span class="pt10 switch_checkbox_block">
          <SwitchCheckbox
            :checked="linkable"
            :disabled="!getUserAuthority.webBoardEdit"
            @handleChange="handleChange"
          />
        </span>
        <ValidationError
          :vData="vTypeData[`fileLimit_${typeDataIndex}_${elementIndex}`]"
          text="請填入檔案限制"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import { computed, defineComponent } from "vue";
import ValidationError from "@/components/ValidationError.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";

export default defineComponent({
  name: "AdTypeImage",
  props: {
    typeData: {
      type: Object,
      required: true
    },
    v: {
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
    }
  },
  components: {
    SwitchCheckbox,
    ValidationError
  },
  emits: ["changeGroupList"],
  setup(props, { emit }) {
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const vTypeData = computed(() => props.v);
    const elementType = computed({
      get: () =>
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].elementType,
      set: value => {
        emit(
          "changeGroupList",
          "elementType",
          value,
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    const title = computed({
      get: () =>
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].title,
      set: value => {
        emit(
          "changeGroupList",
          "title",
          value,
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    const width = computed({
      get: () =>
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].width,
      set: value => {
        emit(
          "changeGroupList",
          "width",
          value,
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    const height = computed({
      get: () =>
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].height,
      set: value => {
        emit(
          "changeGroupList",
          "height",
          value,
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    const fileLimit = computed({
      get: () =>
        props.typeData.groupList[props.typeDataIndex].elementList[
          props.elementIndex
        ].fileLimit,
      set: value => {
        emit(
          "changeGroupList",
          "fileLimit",
          value,
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });
    const linkable = computed({
      get: () => {
        const linkableValue =
          props.typeData.groupList[props.typeDataIndex].elementList[
            props.elementIndex
          ].linkable;

        return linkableValue === 0 ? false : true;
      },
      set: value => {
        emit(
          "changeGroupList",
          "linkable",
          Number(value),
          props.typeDataIndex,
          props.elementIndex
        );
      }
    });

    const handleChange = (val) => {
      linkable.value = val;
    };

    return {
      getUserAuthority,
      vTypeData,
      elementType,
      title,
      width,
      height,
      fileLimit,
      linkable,
      handleChange
    };
  }
});
</script>

<style lang="scss" scoped>
.image_tbody {
  display: block;
}

tr {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  &.bb1 {
    border-bottom: 1px solid #e2e1e1;
    padding-bottom: 20px;
  }

  th {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #292929;
    padding-right: 28px;
    width: 62px;
  }

  td {
    font-size: 14px;

    span {
      &.ml8 {
        color: #292929;
        font-weight: initial;
        margin-left: 8px;
      }
      &.mr16 {
        margin-right: 16px;
      }
      &.mr28 {
        margin-right: 28px;
      }
      &.pt10 {
        padding-top: 10px;
      }
      &.annotation {
        color: #7e7e7e;
      }
      &.switch_checkbox_block {
        vertical-align: middle;
      }
    }

    .d-flex {
      display: flex;

      div {
        margin-right: 20px;
        font-size: 14px;
        font-weight: normal;
        color: #7e7e7e;

        .title {
          color: #292929;
        }
      }

      .lh-radio {
        line-height: 1.7;
      }
    }
  }
}
</style>
