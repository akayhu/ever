<template>
  <div class="proof_board" :class="{ isCollapsed: isCollapsed }">
    <div class="title_section">
      <span>
        <span class="mr-4 font-weight-bold">版位</span>
        <span :id="`board_${proofItems[0].boardId}`" class="title_content">{{
          proofItems[0].boardName
        }}</span>
        <a
          :href="
            `${apiURL}api/proof/download?publishDate=${publishDate}&boardId=${proofItems[0].boardId}`
          "
          class="font-weight-bold"
        >
          <icon iconName="icon-download" />
          全部下載
        </a>
      </span>
      <span>
        <icon
          :iconName="isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up'"
          style="cursor:pointer"
          @click.native="isCollapsed = !isCollapsed"
        />
      </span>
    </div>

    <div class="screenshot_container" v-show="!isCollapsed">
      <div
        v-for="(carouselGroup, key, index) in filterProofByReservation(
          proofItems
        )"
        :key="key"
      >
        <div class="title_content">輪播{{ index | numberConverter }}</div>
        <div class="mb-3">
          {{ carouselGroup[0].customerName }}/{{ carouselGroup[0].projectName }}
        </div>
        <div class="image_content_container">
          <div v-for="(proof, key2) in carouselGroup" :key="key2">
            <div>
              <div
                class="material_id"
                :class="{ active: selectedProof === proof.materialUrl }"
              >
                ID : {{ proof.materialId }}
              </div>
              <div class="image_wrapper">
                <div
                  class="image_preview"
                  :class="{ active: selectedProof === proof.materialUrl }"
                  @click="selectPreviewImage(proof)"
                >
                  <img
                    v-if="proof.materialUrl && proof.proof === 100"
                    :src="proof.materialUrl"
                    alt="proof_image"
                  />
                  <div v-else-if="proof.proof === 99" class="empty_preview">
                    <icon iconName="demo-icon-p" size="16" />
                    樣張產生失敗
                  </div>
                  <div v-else class="empty_preview">
                    <icon iconName="demo-icon-p" size="16" />
                    樣張產生中
                  </div>
                </div>
                <span class="pt-2 d-flex justify-content-end">
                  <a
                    v-if="
                      publishDate === getIsToDay &&
                        key2 === carouselGroup.length - 1
                    "
                    href="javascript:void(0)"
                    @click.prevent="rerenderProofSnapshot(proof.id)"
                    :class="{ disabled: !proof.materialUrl }"
                    class="mr-auto"
                  >
                    <icon
                      iconName="icon-icon-refresh"
                      class="mr-2 image_refresh"
                      v-tooltip="{
                        placement: 'right',
                        content: '重新產生樣張',
                        offset: 5,
                        trigger: 'hover'
                      }"
                    />
                  </a>
                  <a
                    href="javascript:void(0)"
                    @click.prevent="copyLinkHandler(proof.materialUrl)"
                    :class="{ disabled: !proof.materialUrl }"
                  >
                    <icon
                      iconName="icon-link"
                      class="mr-2"
                      v-tooltip="{
                        placement: 'right',
                        content: '複製連結',
                        offset: 5,
                        trigger: 'hover'
                      }"
                    />
                  </a>
                  <a
                    :href="
                      `${apiURL}api/proof/download?publishDate=${publishDate}&shelfId=${proof.id}`
                    "
                    :class="{ disabled: proof.proof != 100 }"
                  >
                    <icon
                      iconName="icon-download"
                      v-tooltip="{
                        placement: 'right',
                        content: '下載檔案',
                        offset: 5,
                        trigger: 'hover'
                      }"
                    />
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupBy from "lodash/groupBy";
import { copyLink } from "@/utils/copyLink.js";
import { mapState, mapMutations, mapActions } from "vuex";
import { MUTATIONS_TYPE } from "@/store/modules/proof";
import { getToday } from "@/utils/dateFormat.js";
import { getNumberConverter } from "@/utils/util.js";

export default {
  name: "ProofsReportBlock",
  props: {
    proofItems: [Object, Array],
    publishDate: String
  },
  data() {
    return {
      apiURL: `https:${process.env.VUE_APP_API_DOMAIN_URL}`,
      isCollapsed: false
    };
  },
  computed: {
    ...mapState("proof", {
      selectedProof: state => state.selectedProof
    }),
    getIsToDay() {
      return getToday("/");
    }
  },
  filters: {
    numberConverter: function(value) {
      return getNumberConverter(value);
    }
  },
  methods: {
    ...mapMutations("proof", {
      selectProof: MUTATIONS_TYPE.SELECT_PROOF,
      setCurrentBoardImages: MUTATIONS_TYPE.SET_CURRENT_BOARD_IMAGES
    }),
    ...mapActions("proof", ["rerenderProofSnapshot"]),
    filterProofByReservation(proofs) {
      return groupBy(proofs, "reservationId");
    },
    openCollaspe() {
      this.isCollapsed = false;
    },
    copyLinkHandler(link) {
      copyLink(link);
    },
    selectPreviewImage(proof) {
      if (proof.proof !== 100) return;
      this.selectProof(proof.materialUrl);
      this.setCurrentBoardImages(
        this.proofItems
          .filter(item => item.proof === 100)
          .map(item => item.materialUrl)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.proof_board.isCollapsed:not(:last-child) {
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.proof_board {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.title_section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .title_content {
    color: #292929;
    margin-right: 12px;
  }
}

.screenshot_container {
  position: relative;
  padding: 12px 30px 0 24px;
  border-top: 1px solid #eee;

  > div {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .title_content {
    font-weight: bold;
    margin-bottom: 12px;
  }

  .image_content_container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 150px));
    column-gap: 24px;

    &:last-child {
      .image_wrapper {
        margin-bottom: 0;
      }
    }

    .material_id {
      width: max-content;
      height: 24px;
      padding: 2px 12px;
      margin-bottom: 8px;
      border-radius: 12px;
      background-color: #eee;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.43;
      letter-spacing: 1.43px;
      color: #292929;
      text-align: center;

      &.active {
        background-color: #00afb8;
        color: #fff;
      }
    }

    .image_wrapper {
      width: max-content;
      background-color: #fff;
      padding: 4px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .image_refresh {
        width: 22px;
      }

      .image_preview {
        width: 150px;
        height: 120px;
        border: 1px dashed #d8d8d8;
        position: relative;
        cursor: pointer;

        &.active {
          border: 1px dashed #00afb8;
        }

        img {
          position: absolute;
          max-width: 100%;
          max-height: 100%;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
        }

        > img {
          cursor: pointer;
        }

        .empty_preview {
          display: flex;
          justify-content: center;
          line-height: 150px;
          height: 100%;
          color: #a9a9a9;
          cursor: initial;

          img {
            top: -20px;
          }
        }
      }

      .disabled {
        cursor: not-allowed !important;
        pointer-events: none;
      }
    }
  }
}
</style>
