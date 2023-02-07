<template>
  <div>
    <!-- PC -->
    <div class="pc-device align-items-center justify-content-end">
      <span class="d-inline-block mr-2">共 {{ totalPages }} 頁</span>
      <button
        :disabled="isFirstPage"
        @click="pageHandler(currentPage - 1)"
        data-gtm-list="上一頁"
      >
        <i class="jb_icon_left"></i>
      </button>
      <div class="d-flex">
        <button
          v-for="number in pageList"
          :key="`pc-${number}`"
          class="page d-flex align-items-center justify-content-center"
          :class="{
            active: currentPage === number
          }"
          @click="pageHandler(number)"
          data-gtm-list="下一頁"
        >
          <span>{{ number }}</span>
        </button>
      </div>
      <button :disabled="isLastPage" @click="pageHandler(currentPage + 1)">
        <i class="jb_icon_right"></i>
      </button>
    </div>

    <!-- MW -->
    <div class="mw-device align-items-center justify-content-between w-100">
      <button
        :disabled="isFirstPage"
        :class="{
          'opacity-0': isFirstPage
        }"
        class="font-weight-bold"
        data-gtm-list="上一頁"
        @click="pageHandler(currentPage - 1)"
      >
        上一頁
      </button>
      <div
        class="d-flex align-items-center justify-content-center position-relative"
      >
        <label for="page-select" class="mb-0 font-weight-bold"
          >第{{ currentPage }}/{{ totalPages }}頁
          <i class="jb_icon_down" v-if="totalPages > 1"></i>
        </label>
        <select
          v-if="totalPages > 1"
          id="page-select"
          :value="currentPage"
          class="position-absolute w-100 opacity-0"
          data-gtm-list="頁碼選單"
          @change="pageHandler(parseInt($event.target.value))"
        >
          <option
            v-for="number in totalPages"
            :value="number"
            :key="`mw-${number}`"
            >第{{ number }}頁</option
          >
        </select>
      </div>
      <button
        :disabled="isLastPage"
        :class="{
          'opacity-0': isLastPage
        }"
        class="font-weight-bold"
        data-gtm-list="下一頁"
        @click="pageHandler(currentPage + 1)"
      >
        下一頁
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    limitationPerPage: {
      type: Number,
      default: 10
    },
    // PC 顯示頁數的最大數量
    maxPageCountShow: {
      type: Number,
      default: 5
    }
  },
  computed: {
    totalPages() {
      return this.total === 0
        ? 1
        : Math.ceil(this.total / this.limitationPerPage);
    },
    isFirstPage() {
      return this.currentPage === 1;
    },
    isLastPage() {
      return this.currentPage === this.totalPages;
    },
    pageList() {
      let list = [];
      const pageCountOffset = Math.floor(this.maxPageCountShow / 2);
      // 總頁數小於顯示頁數;
      if (this.totalPages < this.maxPageCountShow) {
        for (let number = this.totalPages; number > 0; number--) {
          list.unshift(number);
        }
      } else {
        // 總頁數大於顯示頁數
        let maxPageNumber = this.currentPage + pageCountOffset;
        // 位於前兩頁
        if (this.currentPage < this.maxPageCountShow - pageCountOffset) {
          maxPageNumber = this.maxPageCountShow;
        }
        // 位於後兩頁
        if (this.currentPage > this.totalPages - pageCountOffset) {
          maxPageNumber = this.totalPages;
        }
        for (
          let number = maxPageNumber;
          number > maxPageNumber - this.maxPageCountShow;
          number--
        ) {
          list.unshift(number);
        }
      }
      return list;
    }
  },
  methods: {
    pageHandler(page) {
      if (page === this.currentPage) return;
      this.$emit("page-change", page);
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }
}

i {
  color: get-color(text-info);
}

.pc-device {
  display: flex;
  color: get-color(text);

  button {
    border-radius: 50%;
    color: get-color(text);
    width: 24px;
    height: 24px;

    &:hover {
      background-color: get-color(bg-primary);
    }

    &:disabled {
      background-color: transparent;
    }
  }

  i {
    font-size: 16px;
    position: relative;
    top: 2px;
  }

  .page {
    padding: 1px 8px;

    &.active {
      color: get-color(primary);
    }
  }

  @include device-down(md) {
    display: none;
  }
}

.mw-device {
  color: get-color(text-info);
  font-size: 16px;
  line-height: 28px;
  display: none;

  .opacity-0 {
    opacity: 0;
  }

  @include device-down(md) {
    display: flex;
  }
}
</style>
