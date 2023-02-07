<template>
  <div>
    <div class="seen-company_block">
      <div
        class="bg-white rounded p-4 mb-4"
        v-if="getBrowsesCompany.length > 0"
      >
        <div class="t3 font-weight-bold">你看過的公司</div>
        <router-link
          v-for="(item, index) in getBrowsesCompany"
          :key="index"
          class="d-block t4 font-weight-bold"
          :to="`/company/${encodeCustno(item.custno)}/reviews`"
          :title="item.companyName"
          data-gtm-sidebar="你看過的公司"
          rel="noopener noreferrer"
        >
          {{ item.companyName }}
        </router-link>
      </div>
      <a
        v-if="getADImageData.showImg"
        :href="getADImageData.href"
        :title="getADImageData.title"
        rel="noopener noreferrer"
        data-gtm-sidebar="廣告版位"
        :target="getADImageData.target"
      >
        <img
          class="w-100 rounded"
          :src="getADImageData.imgSrc"
          :alt="getADImageData.title"
        />
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "SeenCompany",
  computed: {
    ...mapGetters("user", ["getUserData"]),
    getBrowsesCompany() {
      return this.getUserData.browsesCompany;
    },
    getADImageData() {
      return window.reviewsAnnouncement.rightImageData;
    }
  },
  mixins: [commonMixins]
};
</script>

<style lang="scss" scoped>
.seen-company_block {
  color: #292929;

  a {
    color: #7e7e7e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;

    &:first-of-type {
      margin-top: 16px;
    }

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &:hover {
      color: #ff7800;
    }
  }
}
</style>
