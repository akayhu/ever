<template>
  <fragment>
    <div class="board_title" :class="{ isCollapsed: isCollapsed }">
      <div :id="`${proof[0].device}_${proof[0].boardId}`">
        {{ proof[0].boardName }}
      </div>
      <span class="d-flex align-items-center"
        >{{ isCollapsed ? "展開" : "收合" }}
        <icon
          :iconName="isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up'"
          @click.native="isCollapsed = !isCollapsed"
        />
      </span>
    </div>
    <div class="preview_content" v-show="!isCollapsed">
      <div v-for="board in proof" :key="board.id">
        <div
          class="board_customer"
          :class="{
            board_customer_project_type_14:
              board.boardName === '熱門企業' ||
              board.boardName === '熱門企業(2022新版)'
          }"
          v-tooltip="{
            content: `${board.customerName}`,
            offset: 4,
            placement: 'right',
            trigger: 'hover'
          }"
        >
          {{ board.customerName }}
        </div>
        <div
          class="board_project"
          :class="{
            board_customer_project_type_14:
              board.boardName === '熱門企業' ||
              board.boardName === '熱門企業(2022新版)'
          }"
          v-tooltip="{
            content: `${board.projectName}`,
            offset: 4,
            placement: 'right',
            trigger: 'hover'
          }"
        >
          {{ board.projectName }}
        </div>
        <div>
          <span
            v-if="
              getUserStatus.role === 1 &&
                board.materialId &&
                renderPreviewCount < 3 &&
                !board.isReloading
            "
            class="material_id regenerate"
            @click="rerenderProofPreview(board.materialId)"
            >ID : {{ board.materialId }}</span
          >
          <span v-else class="material_id"
            >ID : {{ board.materialId || "無" }}</span
          >
          <span
            v-if="
              typeof board.materialUrlList[0] === 'string' ||
                board.status === 2 ||
                board.status === 3
            "
          >
            <router-link
              :to="
                `/material?id=${board.orderId}&device=${board.device}&reservationId=${board.id}`
              "
              rel="noopener noreferrer"
              title="上傳素材"
              target="_blank"
            >
              <icon
                iconName="icon-icon-note"
                class="upload_material_icon"
                alt="上傳素材"
                v-tooltip="{
                  content: '上傳素材',
                  offset: 4,
                  placement: 'right',
                  trigger: 'hover'
                }"
              />
            </router-link>
          </span>
        </div>
        <div class="snapshot_container">
          <div
            class="snapshot_item"
            v-for="(img, index) in board.materialProcessedUrlList"
            :key="index"
          >
            <span v-if="board.isReloading" class="overlay"><Loading /></span>
            <img v-if="img" :src="img" alt="proof_image" />
            <div
              v-else
              class="empty_item"
              :class="{
                empty_item_type_14:
                  board.boardName === '熱門企業' ||
                  board.boardName === '熱門企業(2022新版)'
              }"
            >
              <div class="cube">
                <div class="persudo-block"></div>
              </div>
              <div class="empty_content">
                {{ board.status === 1 ? "未拉cue" : "未完成素材設定" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Loading from "@/components/Loading.vue";

export default {
  name: "ProofsBlock",
  props: {
    proof: Array
  },
  components: {
    Loading
  },
  data() {
    return {
      isCollapsed: false
    };
  },
  computed: {
    ...mapGetters("user", ["getUserStatus"]),
    ...mapState("proof", ["renderPreviewCount"])
  },
  methods: {
    ...mapActions("proof", ["getProofPreview", "rerenderProofPreview"]),
    openCollaspe() {
      this.isCollapsed = false;
    }
  }
};
</script>

<style lang="scss" scoped>
%persudo-css {
  display: inline-block;
  position: absolute;
  content: "";
  background-color: #d8d8d8;
  z-index: 0;
}
@mixin persudo-size($width, $height) {
  @extend %persudo-css;
  width: $width;
  height: $height;
}

.board_title {
  display: flex;
  justify-content: space-between;

  ~ .board_title {
    border-top: 1px solid #ddd;
    padding-top: 24px;
  }

  &.isCollapsed {
    margin-bottom: 24px;
  }

  > span > img {
    margin-left: 10px;
    cursor: pointer;
  }
}

.preview_content {
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;

  .material_id {
    display: inline-block;
    width: max-content;
    height: 24px;
    padding: 2px 12px;
    margin: 16px 8px 0 0;
    border-radius: 12px;
    background-color: #eee;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    font-size: 14px;
    text-align: center;

    &.regenerate {
      color: #fff;
      background-color: #00afb8;
      cursor: pointer;

      &:hover {
        color: #00afb8;
        background-color: #e6f9fa;
      }
    }
  }

  .upload_material_icon {
    cursor: pointer;
  }

  .board_customer {
    margin-top: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 260px;
    width: max-content;
  }

  .board_project {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 260px;
    width: max-content;
  }

  .board_customer_project_type_14 {
    max-width: 145px !important;
  }

  .snapshot_container {
    display: flex;
    flex-wrap: wrap;

    .snapshot_item {
      position: relative;
      width: max-content;
      height: max-content;
      padding: 4px;
      box-shadow: 0 2px 10px 0 rgba(41, 41, 41, 0.5);
      margin-top: 16px;
      margin-right: 20px;

      .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.25);
      }
    }

    .empty_item_type_14 {
      width: 145px !important;
      height: 100px !important;
    }

    .empty_item {
      width: 260px;
      height: 210px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .cube {
        background-color: #fff;
        width: 30px;
        height: 30px;
        border: 1px solid #979797;
        border-radius: 2px;
        position: relative;

        &::before {
          @include persudo-size(18px, 4px);
          bottom: 6px;
          left: 5px;
        }

        &::after {
          @include persudo-size(7px, 11px);
          top: 5px;
          left: 5px;
        }

        .persudo-block {
          &::before {
            @include persudo-size(8px, 4px);
            top: 5px;
            right: 5px;
          }

          &::after {
            @include persudo-size(8px, 5px);
            bottom: 12px;
            right: 5px;
          }
        }
      }

      .empty_content {
        padding: 5px;
        font-size: 12px;
        letter-spacing: 1.18px;
        color: #a9a9a9;
      }
    }
  }
}
</style>
