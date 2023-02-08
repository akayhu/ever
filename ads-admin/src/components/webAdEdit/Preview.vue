<template>
  <div class="content">
    <div class="title" :class="getBoardTypeId16 ? 'mb10' : 'mb16'">
      預覽<span v-if="getMoreThanOne">一</span>
    </div>
    <div v-if="getBoardTypeId16 || getBoardTypeId18" class="remarks mb16">
      {{ getBoardTypeId16 ? "收合" : "大圖" }}
    </div>
    <img :src="getPreviewImage(boardTypeId)" />

    <div
      v-if="getMoreThanOne"
      class="title"
      :class="getBoardTypeId16 ? 'mt30 mb10' : 'above'"
    >
      預覽二
    </div>
    <div v-if="getBoardTypeId16" class="remarks mb16">展開</div>
    <img v-if="getMoreThanOne" :src="getPreviewImage(`${boardTypeId}-1`)" />

    <div v-if="getBoardTypeId18" class="title above">
      預覽三
    </div>
    <img v-if="getBoardTypeId18" :src="getPreviewImage(`${boardTypeId}-2`)" />
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Preview",
  props: {
    boardTypeId: {
      required: true
    }
  },
  setup(props) {
    const getBoardTypeId16 = computed(() => props.boardTypeId === 16);
    const getBoardTypeId18 = computed(() => props.boardTypeId === 18);
    const getMoreThanOne = computed(() => {
      return (
        props.boardTypeId === 16 ||
        props.boardTypeId === 18 ||
        props.boardTypeId === 19 ||
        props.boardTypeId === 22
      );
    });

    // 顯示圖片
    const getPreviewImage = imageNumber => {
      return !imageNumber
        ? require("@/assets/ad/ad-s-preview.svg")
        : require(`@/assets/ad/ad-s-preview-${imageNumber}.svg`);
    };

    return {
      getBoardTypeId16,
      getBoardTypeId18,
      getMoreThanOne,
      getPreviewImage
    };
  }
});
</script>

<style lang="scss" scoped>
.content {
  padding: 25px 20px;

  div {
    &.title {
      font-size: 16px;
      font-weight: bold;
      color: #2d2d2d;
      display: inline-block;
    }

    &.mt30 {
      margin-top: 30px;
    }

    &.mb10 {
      margin-bottom: 10px;
    }

    &.mb16 {
      margin-bottom: 16px;
    }

    &.above {
      margin: 30px 0 20px;
    }

    &.remarks {
      font-size: 16px;
      font-weight: normal;
    }
  }

  img {
    width: 100%;
  }
}
</style>
