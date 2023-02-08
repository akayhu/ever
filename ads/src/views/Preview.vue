<template>
  <div class="preview__container">
    <PreviewPage
      v-if="boardInfo"
      class="mx-auto mt-6 mb-15"
      :title="title"
      :device="boardInfo.device"
      :boardId="$route.query.boardId"
      :typeId="$route.query.typeId"
      :materialId="$route.query.materialId"
      :materialType="$route.query.apiPath"
    >
      <template v-slot:title>
        <div class="mb-5">
          <p class="h4 mb-0 font-weight-bold">
            預覽<span class="pl-2 h6 mb-0 font-weight-bold">廣告版型預覽</span>
          </p>
        </div>
      </template>
    </PreviewPage>
  </div>
</template>

<script>
import { apiGetBoardInfo } from "@/apis/board";
import PreviewPage from "@/components/preview/PreviewPage.vue";

export default {
  name: "Preview",
  components: {
    PreviewPage
  },
  data() {
    return {
      boardInfo: null
    };
  },
  computed: {
    title() {
      return [
        this.boardInfo.device,
        this.boardInfo.channelName,
        this.boardInfo.name
      ].join(" / ");
    }
  },
  async created() {
    const { typeId, boardId } = this.$route.query;
    if (!(typeId && boardId)) return;
    this.boardInfo = await this.getBoardInfo(boardId, typeId);
  },
  methods: {
    async getBoardInfo(boardId, typeId) {
      const { data } = await apiGetBoardInfo({ boardId, typeId });
      return data.response;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.preview__container {
  margin-top: 77px;
  margin-bottom: 100px;
  background-color: $white;
  border: 1px solid $gray-400;
  border-radius: 8px;
}
</style>
