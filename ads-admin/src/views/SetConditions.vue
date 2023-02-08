<template>
  <div>
    <section class="set_conditions_search">
      <h2>查詢條件</h2>
      <div class="set_conditions_search_form">
        <div>條件名稱</div>
        <div>
          <SelectDropdown
            @value-changed="setConditionContent($event)"
            @value-clear="clearConditionContent"
            :value="conditionContent"
            :options="searchedConditionOptions"
            :asncSearchCb="conditionSearch"
            :filterable="true"
            :remote="true"
            :optionsAllData="true"
            :clearable="true"
            placeholder="請輸入"
          />
        </div>
        <div>
          <button @click="searchCondition" class="button_bg_blue_large">
            查詢
          </button>
        </div>
      </div>
    </section>

    <section class="set_conditions_list">
      <div class="set_conditions_add">
        <h2>所有條件</h2>
        <button
          v-if="canEdit"
          @click="handleCreate"
          class="button_bg_white_large"
        >
          + 新增
        </button>
      </div>
      <div v-if="isLoading" class="loading">
        <Loading />
      </div>
      <div v-if="!isLoading && conditionsItem.length > 0" class="list">
        <div
          v-for="item in conditionsItem"
          :key="item.conditionId"
          class="list_content_main"
        >
          <div class="list_content">
            <div class="title">條件名稱</div>
            <div class="content">{{ item.name }}</div>
            <div>
              <img
                v-if="canEdit"
                @click="conditionsEdit(item)"
                src="@/assets/icon/edit.svg"
              />
              <img
                v-else
                @click="conditionsEdit(item)"
                src="@/assets/icon/eye-show-g.svg"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!isLoading && conditionsItem.length < 1"
        class="no_condition_content"
      >
        無條件內容
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SelectDropdown from "@/components/SelectDropdown.vue";
import Loading from "@/components/Loading.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useConditionSettingStore } from "@/storesPinia/conditionSetting.js";

export default defineComponent({
  name: "SetConditions",
  components: {
    SelectDropdown,
    Loading
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const conditionSettingStore = useConditionSettingStore();
    const { user } = storeToRefs(userStore);
    const { getConditions } = conditionSettingStore;
    const getUserStatus = computed(() => user.value);
    const canEdit = computed(
      () => getUserStatus.value.userAuthority.setConditionsEdit
    );
    let isLoading = ref(true);
    let conditionContent = ref("");
    let searchedConditionOptions = ref([]);
    let conditionsItem = ref([]);

    onMounted(() => {
      getConditionsList();
    });

    const getConditionsList = async () => {
      isLoading.value = true;
      conditionsItem.value = [];
      let apiResponse = await getConditions({
        keyword: conditionContent.value
      });
      conditionsItem.value = apiResponse.content;
      isLoading.value = false;
    };

    // 選擇搜尋條件內容
    const setConditionContent = data => {
      if (!!data) {
        conditionContent.value = searchedConditionOptions.value.find(
          option => option.id === data.id
        ).name;
      }
    };

    // 清空搜尋條件內容
    const clearConditionContent = () => {
      conditionContent.value = "";
      searchedConditionOptions.value = [];
    };

    // 條件名稱 AC
    const conditionSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const responseData = await getConditions({
          keyword
        });
        searchedConditionOptions.value = [...responseData.content].map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      }
    };

    // 查尋
    const searchCondition = () => {
      getConditionsList();
    };

    // 新增
    const handleCreate = () => {
      router.push("/conditionadd");
    };

    // 編輯
    const conditionsEdit = item => {
      router.push(`/conditionedit/${item.id}`);
    };

    return {
      isLoading,
      conditionContent,
      searchedConditionOptions,
      conditionsItem,
      canEdit,
      setConditionContent,
      clearConditionContent,
      conditionSearch,
      searchCondition,
      handleCreate,
      conditionsEdit
    };
  }
});
</script>

<style lang="scss" scoped>
.set_conditions_search {
  margin-bottom: 24px;

  h2 {
    margin-bottom: 24px;
  }

  .set_conditions_search_form {
    display: grid;
    grid-template-columns: 98px 508px 154px;
    align-items: center;

    > div {
      &:nth-child(1),
      &:nth-child(2) {
        margin-right: 28px;
      }
    }
  }
}

.set_conditions_list {
  .set_conditions_add {
    display: flex;
    justify-content: space-between;
    justify-items: center;
    margin-bottom: 24px;

    h2 {
      display: inline-flex;
      align-items: center;
    }
  }

  .loading {
    margin: 150px 0;
  }

  .list {
    display: flex;
    flex-wrap: wrap;

    > div {
      &.list_content_main {
        margin: 24px 19px 0 0;

        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          margin: 0 19px 0 0;
        }

        &:nth-child(3n) {
          &.list_content_main {
            margin-right: 0;
          }
        }

        .list_content {
          display: flex;
          border: solid 1px #e2e1e1;
          border-radius: 8px;
          padding: 16px 24px;

          .title {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1.38px;
            color: #000;
            margin-right: 16px;
            width: 70px;
          }

          .content {
            font-size: 16px;
            letter-spacing: 1.38px;
            color: #292929;
            width: 174px;
            margin-right: 42px;
          }

          img {
            cursor: pointer;
          }
        }
      }
    }
  }

  .no_condition_content {
    color: red;
    text-align: center;
    margin: 150px 0;
  }
}
</style>
