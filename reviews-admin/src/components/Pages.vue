<template>
  <div class="page-next">
    <div>第 {{ page }} / {{ maxPage }} 頁</div>
    <div v-if="page > 1">
      <button type="button" to="prev" @click="prevNextPage(keyword, 'prev')">
        <i class="jb_icon_left"></i> 上一頁
      </button>
    </div>
    <div v-if="page < maxPage">
      <button type="button" to="next" @click="prevNextPage(keyword, 'next')">
        下一頁 <i class="jb_icon_right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pages",
  data: function() {
    return {
      page: this.$router.history.current.query.page || 1
    };
  },
  props: {
    maxPage: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    keyword: {
      type: String,
      default: ""
    }
  },
  methods: {
    prevNextPage: function(keyword, goToPage) {
      const routerToPage =
        goToPage === "next"
          ? Number(this.$router.history.current.query.page) + 1
          : Number(this.$router.history.current.query.page) - 1;
      const toPage = goToPage === "next" ? this.page + 1 : this.page - 1;

      this.$router.history.current.query.page
        ? (this.page = routerToPage)
        : (this.page = toPage);

      const queryValue = keyword
        ? {
            page: this.page,
            keyword: keyword
          }
        : {
            page: this.page
          };

      this.$router
        .push({
          path: `/${this.path}`,
          query: queryValue
        })
        .catch(err => {});
    }
  },
  watch: {
    $route(to, from) {
      if (to.name !== from.name) {
        this.page = 1;
      }
      if (to.query.page) {
        this.page = to.query.page;
      }
      if (to.query.keyword && to.query.keyword !== from.query.keyword) {
        this.page = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-next {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;

  div {
    &:first-child {
      color: #292929;
      font-size: 12pt;
      line-height: 1.17;
      font-weight: 400;
      margin-right: 10px;
    }
  }

  button {
    border-radius: 4px;
    border: solid 1px #eee;
    background-color: #f3f3f3;
    color: #7e7e7e;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    outline: none;
    margin-left: 14px;
    vertical-align: text-top;

    &[to="prev"] {
      padding: 6px 16px 6px 12px;
    }

    &[to="next"] {
      padding: 6px 12px 6px 16px;
    }
  }
}
</style>
