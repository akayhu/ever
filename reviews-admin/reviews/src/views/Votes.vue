<template>
  <div>
    <div class="votes-top-block position-relative d-none d-md-block" v-once>
      <div class="votes-top-img d-flex flex-column align-items-center">
        <div class="votes-top_content">
          <h2 class="votes-top_title text-center font-weight-bold mb-2">
            匿名問你想知道的！
          </h2>
          <div class="votes-top_introduction">
            找不到想看的評論？歡迎舉手發問，讓未來同事幫你解答！
          </div>
        </div>
        <Button
          class="btn-secondary t2"
          path="/form/vote"
          data-gtm-btn="發起投票"
          btn-text="發起投票"
        />
      </div>
    </div>

    <ContainerSidebar class="mx-auto mt-md-6">
      <div slot="main" class="votes-bottom_main bg-white rounded">
        <div
          class="votes-list_page paddingX-rwd py-3 d-flex justify-content-between align-items-center border-bottom"
        >
          <h3 class="title t2 font-weight-bold mb-0">所有匿名投票</h3>
        </div>
        <!-- votes list loading -->
        <div
          v-if="votesList.length < 1"
          class="loading d-flex justify-content-center align-items-center"
        >
          <Loading />
        </div>
        <dl>
          <votes-list
            v-for="(votes, index) in votesList"
            :key="votes.id"
            :votes="votes"
            :index="index"
            page="votes"
          />
        </dl>
        <Pagination
          class="paddingX-rwd py-3"
          :currentPage="getVotesData.currentPage"
          :total="getVotesData.total"
          @page-change="changePage"
        />
      </div>
      <seen-company slot="side" />
    </ContainerSidebar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ContainerSidebar from "@/components/ContainerSidebar.vue";
import VotesList from "@/components/VotesList.vue";
import SeenCompany from "@/components/SeenCompany.vue";
import Button from "@/components/Button.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "Votes",
  components: {
    ContainerSidebar,
    VotesList,
    SeenCompany,
    Button,
    Loading,
    Pagination
  },
  computed: {
    ...mapGetters("votes", ["getVotesData"]),
    votesList() {
      return this.getVotesData.items;
    }
  },
  methods: {
    changePage(page) {
      const query = this.$route.query;
      this.$router.push({
        path: "votes",
        query: { ...query, page: page }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.votes-top-block {
  background-color: #ffeedf;
  height: 308px;

  .votes-top-img {
    height: 316px;
    padding-top: 80px;
    background-image: url(~@/assets/vote-top_bg.png);
    background-repeat: no-repeat;
    background-position: center 0px;
    background-size: 1440px;
    zoom: 1;

    .votes-top_content {
      color: #292929;
      margin-bottom: 42px;

      .votes-top_title {
        font-size: 24px;
        line-height: 32px;
      }

      .votes-top_introduction {
        font-size: 16px;
        line-height: 22px;
      }
    }
  }
}

.votes-bottom_main {
  .loading {
    min-height: 100vh;
    @include media-breakpoint-up(md) {
      min-height: 430px;
    }
  }

  .votes-list_page {
    .title {
      color: #292929;
    }
  }
}
</style>
