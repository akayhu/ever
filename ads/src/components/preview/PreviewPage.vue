<template>
  <div class="preview">
    <slot name="title" />
    <div class="preview__type mb-5">
      <p v-if="title" class="m-0">
        版位：<span>{{ title }}</span>
      </p>
      <div v-else class="preview__type__bar--loading" />
    </div>
    <div class="preview__wrapper mx-auto mb-5 overflow-hidden mw-100">
      <iframe class="w-100" :src="iframeUrl" frameborder="0"></iframe>
    </div>
    <div class="preview__info mb-5">
      <template v-if="boardData">
        <div class="preview__info__tag">ID：{{ boardData.id }}</div>
        <table class="preview__info__table">
          <tr>
            <td>素材</td>
            <td>{{ boardData.title }}</td>
          </tr>
          <template v-for="(url, index) in urlList">
            <template v-if="url.decodeArray">
              <tr v-for="decodeLink in url.decodeArray" :key="decodeLink">
                <td>APP</td>
                <td>
                  <a :href="decodeLink" target="_blank">{{ decodeLink }}</a>
                </td>
              </tr>
            </template>
            <tr v-if="url.errMsg" :key="'appErrMsg' + index">
              <td>AppLink errMsg</td>
              <td>{{ url.errMsg }}</td>
            </tr>
            <tr :key="'link' + index">
              <td><icon iconName="icon-link" /></td>
              <td>
                <a :href="url.link" target="_blank">{{ url.link }}</a>
              </td>
            </tr>
          </template>
          <tr>
            <td><icon iconName="icon-ad-icon-autouapdte" /></td>
            <td>{{ boardData.updateDate }}</td>
          </tr>
        </table>
      </template>
      <div v-else class="preview__info__bar--loading">
        <div class="first mb-5" />
        <div class="second mb-5" />
        <div class="third" />
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetSingleMaterial } from "@/apis/material.js";
import { apiGetSingleSpareMaterial } from "@/apis/spareMaterial.js";
import { apiAppDecode } from "@/apis/app.js";

export default {
  name: "PreviewPage",
  props: {
    title: {
      type: String,
      require: true
    },
    device: {
      type: String,
      require: true
    },
    typeId: {
      type: [String, Number],
      required: true
    },
    boardId: {
      type: [String, Number],
      required: true
    },
    materialId: {
      type: [String, Number],
      required: true
    },
    materialType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      boardData: null
    };
  },
  computed: {
    iframeUrl() {
      return (
        `https://${process.env.VUE_APP_MSC_URL}proof.html` +
        `?typeId=${this.typeId}` +
        `&boardId=${this.boardId}` +
        `&materialId=${this.materialId}` +
        `&materialType=${this.materialType}` +
        `&mode=normal` +
        `&status=0`
      );
    },
    urlList() {
      if (!this.boardData) return [];
      let linkList = this.boardData.contents.reduce((acc, item) => {
        if (item.link) acc.push(item);
        return acc;
      }, []);
      return linkList;
    }
  },
  async created() {
    await this.updateBoardData();
  },
  watch: {
    materialId: "updateBoardData",
    materialType: "updateBoardData",
    device: "updateBoardData"
  },
  methods: {
    async updateBoardData() {
      if (!(this.materialId && this.materialType && this.device)) {
        return false;
      }
      this.boardData = await this.getBoardData(
        this.materialType,
        this.materialId
      );
      if (this.device === "APP") {
        this.boardData = await this.mergeAppDecodeLink(this.boardData);
      }
    },
    async getBoardData(apiPath, materialId) {
      let fetchApi;
      if (apiPath === "material") {
        fetchApi = apiGetSingleMaterial;
      } else if (apiPath === "spareMaterial") {
        fetchApi = apiGetSingleSpareMaterial;
      } else {
        return {};
      }
      const { data } = await fetchApi(materialId);
      return data.response;
    },
    async mergeAppDecodeLink(boardData) {
      const { contents } = boardData;
      let apiGetDecodelinks = [];
      const undo = function() {
        return {};
      };
      contents.forEach(material => {
        apiGetDecodelinks.push(
          material.link
            ? apiAppDecode({
                ad_input: material.link,
                board_id: 0,
                channel_id: 0,
                return_ad: false,
                return_info: true,
                return_rule: false
              })
            : undo()
        );
      });
      const values = await Promise.all(apiGetDecodelinks);
      values.forEach((linkObject, index) => {
        if (linkObject && linkObject.data) {
          if (linkObject.data.response.SUCCESS) {
            contents[index].decodeArray =
              linkObject.data.response.DATA.INFO.WEB_LINK;
          } else {
            contents[index].errMsg = linkObject.data.response.ERR.ERR_MSG;
          }
        }
      });
      return {
        ...boardData,
        contents
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/loading";

%bar-loading-size {
  width: 300px;
  height: 20px;
  @extend %bar-loading-effect;
}

.preview {
  max-width: 1064px;
  &__type {
    > p {
      @include font-common(18px, $font-weight-bold);

      > span {
        @include font-common(16px, $font-weight-bold, $blue-lake);
      }
    }

    &__bar--loading {
      @extend %bar-loading-size;
    }
  }

  @function customPreviewBorder($direction) {
    $to: "";
    $repeat: "";
    @if ($direction == top or $direction == bottom) {
      $to: to right;
      $repeat: $direction/10px 1px repeat-x;
    }
    @if ($direction == left or $direction == right) {
      $to: to top;
      $repeat: $direction/1px 10px repeat-y;
    }
    @return linear-gradient($to, $gray-600 33%, $white 0%) $repeat;
  }

  &__wrapper {
    box-sizing: content-box;
    padding: 20px;
    background: customPreviewBorder(top), customPreviewBorder(right),
      customPreviewBorder(bottom), customPreviewBorder(left);

    > iframe {
      max-width: 1024px;
      min-height: 420px;
    }
  }

  &__info {
    &__tag {
      background-color: $gray-400;
      border-radius: 12px;
      padding: 2px 12px;
      width: max-content;
      margin-bottom: 20px;
      @include font-common(14px, $font-weight-bold, $gray-900);
      line-height: 1.43;
      letter-spacing: 1.43px;
    }

    &__table {
      tr {
        td {
          &:first-child {
            @include font-common(18px, $font-weight-bold);
            width: 68px;
          }
          &:last-child,
          a {
            @include font-common(16px, $font-weight-bold, $blue-turquoise);
          }
        }
        &:not(:last-child) {
          td {
            padding-bottom: 12px;
          }
        }
      }
    }

    &__bar--loading {
      .first {
        @extend %bar-loading-size;
      }

      .second {
        @extend %bar-loading-size;
        width: 350px;
      }

      .third {
        @extend %bar-loading-size;
        width: 400px;
      }
    }
  }
}
</style>
