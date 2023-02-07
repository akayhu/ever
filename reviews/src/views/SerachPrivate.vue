<template>
  <div>
    <div class="bg-white pt-md-8">
      <SearchBar />
    </div>
    <SearchCollect />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SearchBar from "@/components/SearchBar";
import SearchCollect from "@/components/SearchCollect";

export default {
  name: "SerachPrivate",
  computed: {
    ...mapGetters("search", ["getSearchData"]),
    getConpanyReviews() {
      return this.getSearchData.companyList;
    },
    getKeywordName() {
      return this.$router.history.current.query.keyword;
    }
  },
  data() {
    return {
      keyword: this.getKeywordName || ""
    };
  },
  components: {
    SearchBar,
    SearchCollect
  }
};
</script>
