<template>
  <div class="search-bar-main bg-white pt-6 pt-md-0 pb-7 pb-md-8">
    <div class="search-input-block mx-auto px-4">
      <a-auto-complete
        :dataSource="dataSource"
        :backfill="true"
        :defaultValue="keyword"
        placeholder="搜尋 公司名稱、品牌名稱"
        @select="onSelect"
        @search="handleSearch"
        @change="onChangeValue"
        :defaultActiveFirstOption="false"
        @blur="addPlaceholder"
        @focus="removePlaceholder"
      />
      <i
        class="jb_icon_search search-input-icon"
        data-gtm-search="放大鏡"
        @click="magnifierClick"
      />
    </div>
    <slot>
      <div
        class="highest-discussion d-none d-md-block t4 mt-2 text-center"
        v-if="getSearchDiscussionList.length > 0"
      >
        討論度最高：
        <ul class="d-inline-flex">
          <li
            v-for="(item, index) in getSearchDiscussionList"
            :key="index"
            class="ml-4"
          >
            <router-link
              :to="item.link"
              data-gtm-search="討論度最高"
              rel="noopener noreferrer"
            >
              {{ item.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </slot>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";
import lodashArray from "lodash";
import debounce from "debounce";

export default {
  name: "SearchBar",
  data() {
    return {
      inputKeyword: "",
      keyword: this.$router.history.current.query.keyword || "",
      dataSource: [],
      dataSourceValue: []
    };
  },
  mixins: [commonMixins],
  computed: {
    ...mapGetters("search", ["getSearchData"]),
    getSearchDiscussionList() {
      return window.reviewsAnnouncement.searchHighestDiscussion;
    }
  },
  mounted() {
    if (document.querySelector(".ant-input")) {
      document
        .querySelector(".ant-input")
        .addEventListener("keydown", this.inputKeydown);
    }
  },
  methods: {
    ...mapActions("search", ["changeKeyword"]),
    handleSearch: debounce(function(value) {
      if (!value) return;
      let dataSource = [];
      this.changeKeyword({ keyword: value }).then(response => {
        const res = response.data.response;
        // unionByName = 過濾重複公司名
        // const unionByName = lodashArray.unionBy(res, "name");
        if (res.length < 1) return;
        dataSource = lodashArray.map(res, "name");
        this.dataSource = dataSource;
        this.dataSourceValue = res;

        // 塞 GTM
        setTimeout(() => {
          const searchInputAc = document.querySelectorAll(
            ".ant-select-dropdown-menu-item"
          );
          for (
            let searchAcIndex = 0;
            searchAcIndex < searchInputAc.length;
            searchAcIndex++
          ) {
            searchInputAc[searchAcIndex].setAttribute("data-gtm-search", "AC");
          }
        }, 0);
      });
    }, 300),
    onChangeValue(value) {
      if (!value) this.removePlaceholder();
      this.inputKeyword = value;
    },
    magnifierClick() {
      this.searchJudgment(this.inputKeyword);
    },
    onSelect(value) {
      this.searchJudgment(value);
    },
    inputKeydown(e) {
      if (e.keyCode !== 13) return;
      this.searchJudgment(e.target.value);
    },
    searchJudgment(value) {
      const valueReplace = this.filterSearch();
      if (!valueReplace) return;

      const sourceValue = lodashArray.filter(this.dataSourceValue, {
        name: value
      });

      if (this.dataSourceValue.length < 1 || sourceValue.length < 1) {
        return this.routePush(`/search?keyword=${valueReplace}`);
      }

      this.routePush(
        `/company/${this.encodeCustno(sourceValue[0].custno)}/reviews`
      );
    },
    routePush(path) {
      this.$router.push({ path }).catch(err => {});
    },
    filterSearch() {
      return this.inputKeyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, "");
    },
    addPlaceholder(value) {
      if (!value) {
        document.querySelector(
          ".ant-select-selection__placeholder"
        ).style.display = "block";
      }
    },
    removePlaceholder(value) {
      if (!value) {
        setTimeout(() => {
          document.querySelector(
            ".ant-select-selection__placeholder"
          ).style.display = "none";
        }, 50);
      }
    }
  }
};
</script>

<style lang="scss">
.search-bar-main {
  .search-input-block {
    position: relative;
    @include device-up(md) {
      max-width: 812px;
    }

    .search-input-icon {
      position: absolute;
      right: 16px;
      z-index: 10;
      width: 44px;
      padding: 14px;
      font-size: 16px;
      color: get-color(text-info);

      .jb_icon_search {
        margin-right: 1px;
      }
    }
  }

  .highest-discussion {
    color: get-color(text);

    a {
      color: get-color(text);

      &:hover {
        color: get-color(primary);
      }
    }
  }

  .ant-select-auto-complete.ant-select {
    width: 100%;
    .ant-input {
      font-size: 16px;
      line-height: 1.75;
      padding: 8px 12px;
      height: 44px !important;
      color: get-color(text);
      border: 1px solid get-color(border) !important;
      border-right-width: 1px !important;
      background-color: get-color(bg-gray) !important;
      transition: none !important;

      &:hover {
        border: 1px solid get-color(bg-gray) !important;
      }

      &:focus {
        border: 1px solid get-color(primary) !important;
        border-right-width: 1px !important;
        box-shadow: inset 0 0 0 1px get-color(primary) !important;
      }
    }

    &.ant-select-focused {
      .ant-input {
        border: 1px solid get-color(primary) !important;
        border-right-width: 1px !important;
        box-shadow: inset 0 0 0 1px get-color(primary) !important;
      }
    }
    @include device-up(md) {
      .ant-input {
        font-weight: bold;
      }
    }
  }
}

.ant-select-dropdown-content {
  border-radius: 4px;
  margin-top: -6px;
  background-color: #fff;
  border: 2px solid get-color(primary) !important;
}
.ant-select-dropdown-menu {
  max-height: calc(44px * 6) !important;
}
.ant-select-dropdown-menu-item {
  font-size: 16px;
  padding: 8px 12px !important;
  line-height: 1.75 !important;
  height: 44px;
  color: get-color(text) !important;
}
.ant-select-dropdown-menu-item:hover,
.ant-select-dropdown-menu-item-active {
  background-color: get-color(bg-primary) !important;
  // margin: 0 1.5px 0.5px 0;
  // margin: 0 1.5px 0 0;
}

.ant-select-dropdown-menu-item-selected {
  font-weight: 400 !important;
  background-color: get-color(bg-primary) !important;
}

.ant-select-selection__placeholder {
  color: get-color(placeholder) !important;
  z-index: 2 !important;
  top: 23px !important;
  font-weight: bold;
}

.ant-select-selection--single {
  cursor: text !important;
}
</style>
