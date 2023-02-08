<template>
  <div class="pages_main">
    <span class="page">
      共 {{ pageData.totalElements }} 筆 {{ pageData.totalPages }} 頁
    </span>
    <span v-if="pageData.page > 1">
      <icon iconName="icon-arrow-left" @click.native="prevNextPage('prev')" />
    </span>
    <span
      v-for="item in pageArr"
      @click="prevNextPage('', item)"
      :key="item"
      :class="{ focus: item === pageData.page }"
      class="pageNumber"
    >
      {{ item }}
    </span>

    <span v-if="pageData.page < pageData.totalPages">
      <icon iconName="icon-arrow-right" @click.native="prevNextPage('next')" />
    </span>
    前往頁面
    <input
      v-model="page"
      v-numberOnly
      @keypress="keypress"
      @keyup.enter="prevNextPage('', page)"
      :max="pageData.totalPages"
      min="1"
      type="number"
      widthType="40"
      heightType="32"
    />
  </div>
</template>

<script>
import { numberOnly } from "@/directives/numberOnly";

export default {
  name: "Pages",
  data() {
    return {
      page: 1,
      order: "desc",
      pageArr: []
    };
  },
  props: {
    pageData: {
      type: Object,
      required: true
    },
    path: {
      type: String,
      required: false
    },
    reloadPage: {
      type: Boolean,
      default: true,
      required: false
    },
    befaoreDisplayAction: {
      type: String,
      required: false
    },
    befaoreDisplayActionQuery: {
      type: Object,
      required: false
    },
    displayAction: {
      type: String,
      required: false
    },
    displayActionQuery: {
      type: Object,
      required: false
    },
    isUsedEmit: {
      type: Boolean,
      default: false
    }
  },
  directives: { numberOnly },
  mounted() {
    const { $route, pageData, getPage } = this;
    const query = $route.query;
    if (query && query.page) {
      this.page = query.page || 1;
      this.order = query.order || "desc";
    } else {
      this.page = pageData.page || 1;
      this.order = "desc";
    }
    getPage();
  },
  methods: {
    getPage() {
      if (this.pageArr.length > 0) this.pageArr = [];
      const { pageData } = this;
      let pageNumber = pageData.page;
      let totalPages = pageData.totalPages;
      this.page = pageData.page;
      if (pageNumber <= 2) {
        for (let i = 1; i <= 5; i++) {
          if (i <= totalPages) this.pageArr.push(i);
        }
      } else if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          this.pageArr.push(i);
        }
      } else if (
        totalPages === pageNumber ||
        (pageNumber + 1 <= totalPages &&
          pageNumber + 2 <= totalPages &&
          pageNumber - 1 >= totalPages &&
          pageNumber - 2 >= totalPages)
      ) {
        for (let i = 0; i <= 4; i++) {
          if (pageNumber >= 1) this.pageArr.push(totalPages - i);
        }
        this.pageArr = this.pageArr.reverse();
      } else {
        if (totalPages - pageNumber === 1) pageNumber = pageNumber - 1;
        if (totalPages - pageNumber >= 2) pageNumber = pageNumber - 2;
        for (let i = 0; i <= 4; i++) {
          if (pageNumber >= 1 && pageNumber + i <= totalPages)
            this.pageArr.push(pageNumber + i);
        }
      }
    },
    keypress(e) {
      if (e.key === "+" || e.key === "e" || e.key === "-") {
        e.preventDefault();
      }
    },
    prevNextPage(goToPage, number) {
      const {
        $route,
        reloadPage,
        $router,
        path,
        displayActionQuery,
        befaoreDisplayAction,
        befaoreDisplayActionQuery,
        displayAction,
        getPage,
        isUsedEmit
      } = this;
      let historyQuery = $route.query;

      if (number) {
        this.page = number;
      } else {
        this.page = historyQuery.page
          ? goToPage === "next"
            ? Number(historyQuery.page) + 1
            : Number(historyQuery.page) - 1
          : goToPage === "next"
          ? Number(this.page) + 1
          : Number(this.page) - 1;
      }

      // 換頁重整頁面
      if (reloadPage) {
        $router
          .push({
            path: `/${path}`,
            query: {
              ...historyQuery,
              page: this.page
            }
          })
          .catch(error => {
            console.error("error", error);
          });
      }

      // 不換頁不重整頁面，打 api 方式只換內容
      if (!reloadPage) {
        let query = {
          page: this.page,
          ...displayActionQuery
        };

        // 先打 api
        if (befaoreDisplayAction) {
          this.$store.dispatch(befaoreDisplayAction, befaoreDisplayActionQuery);
        }

        // 後打 api
        if (displayAction) {
          this.$store.dispatch(displayAction, query);
        }

        if (isUsedEmit) {
          this.$emit("pageChange", {
            page: this.page
          });
        }

        getPage();
      }
    }
  },
  watch: {
    $route(to) {
      if (to.query.page) {
        this.page = to.query.page;
      }
    },
    pageData() {
      this.getPage();
    }
  }
};
</script>

<style lang="scss" scoped>
.pages_main {
  text-align: right;
  font-size: 14px;
  color: #292929;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  span {
    width: 24px;

    &.page {
      margin-right: 16px;
      width: auto;
      cursor: initial;
    }

    &.focus {
      color: #00afb8;
      font-weight: bold;
    }

    &.pageNumber {
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    img {
      cursor: pointer;
    }

    &:hover {
      background-color: #e6f9fa;
    }

    &:first-child,
    &:last-of-type {
      &:hover {
        background-color: #fff;
      }
    }
  }

  input {
    text-align: center;
    margin-left: 6px;
    padding: 0;
  }
}
</style>
