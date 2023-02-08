<template>
  <div class="pages_main">
    <span class="page">
      共 {{ pageData.totalElements }} 筆 {{ pageData.totalPages }} 頁
    </span>
    <span v-if="pageData.page > 1">
      <img @click="prevNextPage('prev')" src="@/assets/icon/chevron-left.svg" />
    </span>
    <span
      v-for="(item, index) in pageArr"
      @click="prevNextPage('', item)"
      :key="index"
      :class="{ focus: item === pageData.page }"
      class="pageNumber"
    >
      {{ item }}
    </span>
    <span v-if="pageData.page < pageData.totalPages">
      <img
        @click="prevNextPage('next')"
        src="@/assets/icon/chevron-right.svg"
      />
    </span>
    前往頁面
    <input
      v-model="page"
      v-numberOnly
      @keypress="keypress"
      @keyup.enter="prevNextPage('', page)"
      :max="pageData.totalPages"
      type="number"
      min="1"
      widthType="40"
      heightType="32"
    />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, watch, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { numberOnly } from "@/directives/numberOnly";

export default defineComponent({
  name: "Pages",
  // directives: { numberOnly },
  props: {
    pageData: {
      type: Object,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    displayActionQuery: {
      type: Object
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    let page = ref(1);
    let order = ref("desc");
    let pageArr = ref([]);

    const getPage = () => {
      let pageNumber = props.pageData.page;
      let totalPages = props.pageData.totalPages;
      if (pageNumber <= 2) {
        for (let i = 1; i <= 5; i++) {
          if (i <= totalPages) pageArr.value.push(i);
        }
      } else if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pageArr.value.push(i);
        }
      } else if (
        totalPages === pageNumber ||
        (pageNumber + 1 <= totalPages &&
          pageNumber + 2 <= totalPages &&
          pageNumber - 1 >= totalPages &&
          pageNumber - 2 >= totalPages)
      ) {
        for (let i = 0; i <= 4; i++) {
          if (pageNumber >= 1) pageArr.value.push(totalPages - i);
        }
        pageArr.value = pageArr.value.reverse();
      } else {
        if (totalPages - pageNumber === 1) pageNumber = pageNumber - 1;
        if (totalPages - pageNumber >= 2) pageNumber = pageNumber - 2;
        for (let i = 0; i <= 4; i++) {
          if (pageNumber >= 1 && pageNumber + i <= totalPages)
            pageArr.value.push(pageNumber + i);
        }
      }
    };

    const keypress = e => {
      if (e.key === "+" || e.key === "e" || e.key === "-") {
        e.preventDefault();
      }
    };

    const prevNextPage = (goToPage, number) => {
      let historyQuery = props.displayActionQuery
        ? props.displayActionQuery
        : route.query;

      if (number) {
        page.value = number;
      } else {
        page.value = historyQuery.page
          ? goToPage === "next"
            ? Number(historyQuery.page) + 1
            : Number(historyQuery.page) - 1
          : goToPage === "next"
          ? Number(page.value) + 1
          : Number(page.value) - 1;
      }

      router
        .push({
          path: `/${props.path}`,
          query: {
            ...historyQuery,
            page: page.value
          }
        })
        .catch(() => {});
    };

    onBeforeMount(() => {
      const query = route.query;
      page.value = query.page || 1;
      order.value = query.order || "desc";
    });

    onMounted(() => {
      getPage();
    });

    watch(
      () => route.query,
      () => {
        page.value = route.query.page;
      }
    );

    watch(
      () => props.pageData,
      () => {
        pageArr.value = [];
        getPage();
      }
    );

    return {
      page,
      pageArr,
      keypress,
      prevNextPage
    };
  }
});
</script>

<style lang="scss" scoped>
.pages_main {
  font-size: 14px;
  color: #292929;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  span {
    width: 24px;

    img {
      cursor: pointer;
    }

    &.page {
      margin-right: 16px;
      width: auto;
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
