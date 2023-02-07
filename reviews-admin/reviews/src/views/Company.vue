<template>
  <div>
    <!-- 公司專頁 NavBar -->
    <div
      class="company-nav-block container-rwd mx-auto d-none d-md-flex py-6 t4"
    >
      <router-link
        to="/"
        data-gtm-breadcrumb="首頁"
        rel="noopener noreferrer"
        v-once
        >104公司評論</router-link
      >/
      <router-link
        v-if="reviewsVotesId"
        :to="{
          name: 'companyReviews',
          params: {
            custno: getCustno
          }
        }"
        data-gtm-breadcrumb="公司"
        rel="noopener noreferrer"
        >{{ getCompanyName || "企業公司" }}</router-link
      >
      <span v-if="!reviewsVotesId">{{ getCompanyName || "企業公司" }}</span>
      <template v-if="reviewsVotesId">
        /
        <span>{{ name }}</span>
      </template>
    </div>

    <ContainerCompany class="mx-auto">
      <!-- 公司專頁左 -->
      <template slot="side">
        <company-left v-if="getCompanyName" />
        <company-left-loading v-else />
      </template>

      <!-- 公司專頁右 -->
      <template slot="main">
        <router-view />
      </template>
    </ContainerCompany>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ContainerCompany from "@/components/ContainerCompany.vue";
import CompanyLeft from "@/components/CompanyLeft.vue";
import CompanyLeftLoading from "@/components/CompanyLeftLoading.vue";
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "Company",
  components: {
    ContainerCompany,
    CompanyLeft,
    CompanyLeftLoading
  },
  mixins: [commonMixins],
  data: function() {
    return {
      custno: "",
      reviewsVotesId: "",
      routerName: "singleReview",
      name: "匿名評論"
    };
  },
  created() {
    this.checkNav();
  },
  updated() {
    this.checkNav();
  },
  computed: {
    ...mapGetters("company", ["getCompanyData"]),
    getCompanyName() {
      return this.getCompanyData.companyData.companyName;
    },
    getCustno() {
      return this.encodeCustno(this.getCompanyData.companyData.custno);
    }
  },
  methods: {
    checkNav: function() {
      this.routerName = this.$route.name;

      if (this.$route.params.reviewsId || this.$route.params.votesId) {
        this.reviewsVotesId = this.$route.params.reviewsId
          ? this.$route.params.reviewsId
          : this.$route.params.votesId;
      } else {
        this.reviewsVotesId = "";
      }

      this.$route.name === "singleVote"
        ? (this.name = "匿名投票")
        : (this.name = "匿名評論");
    }
  }
};
</script>

<style lang="scss" scoped>
.company-nav-block {
  color: #a9a9a9;

  a,
  span {
    margin: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    max-width: 112px;
  }

  a {
    color: #1654b9;

    &:hover {
      color: #4e91ff;
    }

    &:nth-child(1) {
      margin-left: 0;
    }
  }

  span {
    color: #292929;
  }
}
</style>
