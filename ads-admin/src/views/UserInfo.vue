<template>
  <div>
    <section class="search_user_list_block">
      <div class="user_list_title_main">
        <h2>查詢使用者資料維護</h2>
      </div>
      <div class="user_behavior_search">
        <div class="user_account">
          <span>人員</span>
          <SelectDropdown
            @value-changed="setSelectedAccount($event)"
            :value="accountLabel"
            :options="searchedAccountOptions"
            :asncSearchCb="accountSearch"
            :filterable="true"
            :remote="true"
            :optionsAllData="true"
            :itemIndex="1"
            noDataText="查不到對應人員"
            placeholder="請輸入"
          />
        </div>
        <div class="user_account">
          <button @click="handleClearSearch" class="button_bg_white_large">
            清除
          </button>
          <button @click="handleSerach" class="button_bg_blue_large">
            查詢
          </button>
        </div>
      </div>
    </section>

    <section>
      <div class="user_data_title_main">
        <h2>使用者資料維護</h2>
        <button
          data-e2e="useradd"
          v-if="getUserAuthority.userInfoEdit"
          @click="handleCreate"
          class="button_bg_white_large"
        >
          + 新增
        </button>
      </div>
      <div v-if="accountItems.length < 1 && listLoading" class="loading">
        <Loading />
      </div>
      <div v-if="accountItems.length < 1 && !listLoading" class="loading">
        無符合此筆資料
      </div>
      <div v-if="accountItems.length > 0" class="account_items_title">
        <div>帳號</div>
        <div>姓名</div>
        <div>員編</div>
        <div>
          <span @click="getAccountSort" class="status">
            狀態<img src="@/assets/icon/icon-move.svg" />
          </span>
        </div>
        <div>編輯</div>
      </div>
      <div
        v-for="(item, index) in accountItems"
        :key="index"
        :class="{ last: accountItems.length - 1 === index }"
        class="account_items_main"
      >
        <div>{{ item.logonId }}</div>
        <div>{{ item.name }}</div>
        <div>{{ item.accountId }}</div>
        <div>{{ item.status === 1 ? "開啟" : "關閉" }}</div>
        <div>
          <img
            v-if="getUserAuthority.userInfoEdit"
            @click="userEdit(item.accountId)"
            src="@/assets/icon/edit.svg"
            class="pointer"
          />
          <img v-else src="@/assets/icon/edit-disable.svg" />
        </div>
      </div>
      <Pages
        v-if="accountItems.length > 0"
        :pageData="accountList"
        path="userinfo"
      />
      <div class="bottom_create_block">
        <button
          v-if="getUserAuthority.userInfoEdit"
          @click="handleCreate"
          class="button_bg_white_large bottom_create"
        >
          + 新增
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import Pages from "@/components/Pages.vue";
import Loading from "@/components/Loading.vue";
import SelectDropdown from "@/components/SelectDropdown.vue";
import { storeToRefs } from "pinia";
import { useAccountStore } from "@/storesPinia/account.js";
import { useUserStore } from "@/storesPinia/user.js";

export default defineComponent({
  name: "UserInfo",
  components: {
    Pages,
    Loading,
    SelectDropdown
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const accountStore = useAccountStore();
    const { user } = storeToRefs(userStore);
    const { accountList } = storeToRefs(accountStore);
    const { getAccountList, getAccountSearch } = accountStore;

    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const accountItems = computed(() => accountList.value.content);
    const listLoading = computed(() => accountList.value.loading);

    let order = ref("desc");
    let accountId = ref("");
    let accountLabel = ref("");
    let searchedAccountOptions = ref([]);

    let query = {
      size: 20,
      page: route.query.page || 1,
      order: route.query.order || "desc"
    };

    // 切換狀態
    const getAccountSort = () => {
      if (order.value === "asc") order.value = "desc";
      else if (order.value === "desc") order.value = "asc";
      query = { ...query, order: order.value };
      router.push({ query }).catch(() => {});
    };

    // 新增使用者資料
    const handleCreate = () => {
      router.push("/useradd");
    };

    // 編輯使用者資料
    const userEdit = accountId => {
      router.push(`/useredit?accountId=${accountId}`);
    };

    // 選取帳號、姓名、員編
    const setSelectedAccount = data => {
      accountId.value = searchedAccountOptions.value.find(
        option => option.accountId === data.accountId
      ).accountId;
      accountLabel.value = searchedAccountOptions.value.find(
        option => option.accountId === data.accountId
      ).label;
    };

    // 搜尋使用者 AC
    const accountSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const responseData = await getAccountSearch({ keyword });
        searchedAccountOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.logonId}(${item.name}/${item.accountId})`
          };
        });
      }
    };

    // 搜尋
    const handleSerach = () => {
      const query = {
        size: 20,
        page: 1,
        order: order.value,
        id: accountId.value
      };
      getAccountList(query);
    };

    // 清除
    const handleClearSearch = () => {
      accountId.value = "";
      accountLabel.value = "";
      searchedAccountOptions.value = [];
    };

    return {
      accountLabel,
      searchedAccountOptions,
      getUserAuthority,
      accountItems,
      listLoading,
      accountList,
      getAccountSort,
      handleCreate,
      userEdit,
      setSelectedAccount,
      accountSearch,
      handleSerach,
      handleClearSearch
    };
  }
});
</script>

<style lang="scss" scoped>
section {
  &.search_user_list_block {
    margin-bottom: 24px;

    .user_list_title_main {
      display: flex;
    }

    .user_behavior_search {
      display: flex;
      font-size: 16px;
      color: #333;
      margin-top: 24px;
      font-weight: bold;

      .user_account {
        display: flex;
        align-items: center;
        white-space: nowrap;
        width: 340px;
        margin-right: 16px;

        span {
          margin-right: 32px;
        }

        button {
          &:first-child {
            margin-right: 30px;
          }
        }

        :deep(.el-select) {
          width: 260px;

          input {
            height: 38px;
          }
        }
      }
    }
  }

  .loading {
    text-align: center;
    padding: 150px 0;
    color: #a9a9a9;
    font-size: 20px;
  }

  .user_data_title_main {
    display: flex;
    margin-bottom: 24px;
    justify-content: space-between;
    align-items: center;
  }

  .account_items {
    &_title,
    &_main {
      display: grid;
      grid-template-columns: 5fr 2fr 2fr 2fr 1fr;

      div {
        border-bottom: 1px solid #eee;
        height: 47px;
        color: #000;
        font-size: 16px;
        line-height: 1.38;
        letter-spacing: 1.38px;
        display: inline-flex;
        align-items: center;
        padding-left: 18px;

        img {
          cursor: pointer;
        }
      }
    }
    &_title {
      font-weight: bold;
    }
    &_main {
      &.last {
        margin-bottom: 24px;
      }
      &:hover {
        div {
          background-color: #e6f9fa;
        }
      }
    }
  }

  .bottom_create_block {
    text-align: right;
    margin-top: 24px;
  }
}
</style>
