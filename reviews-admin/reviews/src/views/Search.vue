<template>
  <div>
    <div class="search-block pt-md-8 bg-white" v-once>
      <SearchBar />
    </div>

    <!-- search loading -->
    <div
      v-if="!getLoading"
      class="loading d-flex justify-content-center align-items-center"
    >
      <Loading />
    </div>

    <ContainerSidebar
      v-else-if="getCompanies.length > 0 && getLoading"
      class="mx-auto mt-3 mt-md-6"
    >
      <div class="search-bottom_main bg-white rounded" slot="main">
        <div
          class="search-list_page paddingX-rwd py-3 d-flex justify-content-between align-items-center border-bottom"
        >
          <h3 class="title t2 font-weight-bold mb-0">搜尋結果</h3>
        </div>

        <search-list
          v-for="(company, index) in getCompanies"
          :key="index"
          :company="company"
        />

        <Pagination
          class="paddingX-rwd py-3"
          :currentPage="getSearchData.searchCompanyList.currentPage"
          :total="getSearchData.searchCompanyList.total"
          @page-change="changePage"
        />
      </div>
      <seen-company slot="side" />
    </ContainerSidebar>

    <SearchNotFound v-else-if="getCompanies.length < 1 && getLoading" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ContainerSidebar from "@/components/ContainerSidebar.vue";
import SearchBar from "@/components/SearchBar.vue";
import SeenCompany from "@/components/SeenCompany.vue";
import SearchList from "@/components/SearchList.vue";
import SearchNotFound from "@/components/SearchNotFound.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "Search",
  data() {
    return {
      keyword: this.getKeywordName || ""
    };
  },
  components: {
    ContainerSidebar,
    SearchBar,
    SeenCompany,
    SearchList,
    SearchNotFound,
    Loading,
    Pagination
  },
  computed: {
    ...mapGetters("search", ["getSearchData"]),
    getCompanies() {
      return this.getSearchData.searchCompanyList.items;
    },
    getKeywordName() {
      return this.$router.history.current.query.keyword;
    },
    getLoading() {
      return this.getSearchData.searchCompanyList.loadingEnd;
    }
  },
  methods: {
    changePage(page) {
      const query = this.$route.query;
      this.$router.push({
        path: "search",
        query: { ...query, page: page }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.loading {
  min-height: calc(100vh - 192px);
  @include media-breakpoint-up(md) {
    min-height: 430px;
  }
}

.search-bottom_main {
  .search-list_page {
    .title {
      color: #292929;
    }
  }
}
</style>
