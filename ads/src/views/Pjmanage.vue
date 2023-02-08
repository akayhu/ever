<template>
  <div>
    <div class="pjmanage_wrapper_title">專案及版位維護</div>

    <section class="pjmanage_wrapper">
      <div class="project_inquiry">
        <h2>專案查詢</h2>
        <div>
          <router-link
            to="/newpj"
            rel="noopener noreferrer"
            target="_blank"
            title="新增預約專案"
            class="button_bg_white_large"
          >
            新增預約專案
          </router-link>
        </div>
      </div>
      <div class="query_conditions">
        查詢條件
        <span>
          <SelectDropdown
            @value-changed="setSelectedProjectStaff($event)"
            @set-history-record="searchedprojectOptions = $event"
            :value="project.name"
            :options="searchedprojectOptions"
            :asncSearchCb="projectSuggestionSearch"
            :focusAction="resetErrorFocus"
            :filterable="true"
            :remote="true"
            :class="{ error_message_border: $v.project.name.$error }"
            class="query_conditionsAC"
            placeholder="請輸入企業或專案名稱"
            :type="'getProjectSuggestion'"
          />
        </span>
        <div class="product-error">
          <ValidationError :vData="$v.project.name" text="請填寫查詢條件" />
        </div>
      </div>
      <div class="query_date">
        查詢日期
        <span class="datePicker">
          <DatePicker :getSearchTime="getSearchTime" />
        </span>
      </div>
      <div class="inquire_button">
        <button @click="() => searchProject()" class="button_bg_blue_large">
          查詢
        </button>
      </div>
    </section>

    <section class="project_list">
      <h2>專案列表</h2>
      <div
        v-if="status === 'SEARCH_BEFOR' && projectList.content.length < 1"
        class="center copywriting"
      >
        無專案列表資料，請在上方專案查詢進行查詢
      </div>
      <div v-if="status === 'LOADING'" class="center">
        <Loading />
      </div>
      <table
        v-if="status === 'SEARCH_AFTER' && projectList.content.length > 0"
        cellpadding="0"
        cellspacing="0"
      >
        <tr>
          <td>企業名稱</td>
          <td>專案名稱</td>
          <td>開始日期</td>
          <td>結束日期</td>
        </tr>
        <tr v-for="item in projectList.content" :key="item.projectId">
          <td>
            <div>
              <span
                v-tooltip="{
                  offset: 5,
                  content: item.customerName,
                  placement: 'bottom-start',
                  trigger: 'hover'
                }"
              >
                {{ item.customerName }}
              </span>
            </div>
          </td>
          <td>
            <div class="link">
              <router-link
                :to="`/editpj?projectId=${item.projectId}`"
                v-tooltip="{
                  offset: 5,
                  content: item.projectName,
                  placement: 'bottom-start',
                  trigger: 'hover'
                }"
              >
                {{ item.projectName }}
              </router-link>
            </div>
          </td>
          <td>{{ item.startDate }}</td>
          <td>{{ item.closeDate ? item.closeDate : "---" }}</td>
        </tr>
      </table>

      <Pages
        v-if="projectList.content.length > 0"
        :pageData="projectList"
        :isUsedEmit="true"
        :reloadPage="false"
        @pageChange="({ page }) => searchProject(page)"
        path="pjmanage"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import DatePicker from "@/components/DatePicker.vue";
import Pages from "@/components/Pages.vue";
import ValidationError from "@/components/ValidationError";
import Loading from "@/components/Loading.vue";
import SelectDropdown from "@/components/share/SelectDropdown";

export default {
  name: "Pjmanage",
  components: {
    DatePicker,
    ValidationError,
    Loading,
    Pages,
    SelectDropdown
  },
  data() {
    return {
      status: "SEARCH_BEFOR",
      searchAddress: "",
      searchTimeStart: "",
      searchTimeEnd: "",
      searchedprojectOptions: [],
      project: { name: "", id: "" }
    };
  },
  computed: {
    ...mapGetters("project", ["getProjectData"]),
    projectList() {
      return this.getProjectData.projectList;
    }
  },
  validations: {
    project: { name: { required } }
  },
  methods: {
    ...mapActions("project", ["getProject", "getProjectSuggestion"]),
    // 查詢條件
    async projectSuggestionSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getProjectSuggestion } = this;
        const responseData = await getProjectSuggestion({ keyword });
        this.searchedprojectOptions = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: `${item.name}(${item.id})`,
            name: `${item.name}(${item.id})`
          };
        });
      }
    },
    // 查詢條件 AC
    setSelectedProjectStaff(data) {
      if (!data) {
        this.project = { name: "", id: "" };
        this.searchAddress = "";
        return;
      }

      this.project = {
        ...this.searchedprojectOptions.find(option => option.id === data)
      };
      this.searchAddress = data;
    },
    // cb 時間
    getSearchTime(time) {
      this.searchTimeStart = time.searchTimeStart;
      this.searchTimeEnd = time.searchTimeEnd;
    },
    // 查詢專案
    searchProject(page = 1) {
      const projectValidation = this.$v.project;
      const {
        getProject,
        searchAddress,
        searchTimeStart,
        searchTimeEnd
      } = this;
      projectValidation.$touch();

      if (projectValidation.name.$error) return;

      this.status = "LOADING";
      const query = {
        page,
        size: 20,
        condition: searchAddress
      };

      if (searchTimeStart && searchTimeEnd) {
        query.start = searchTimeStart;
        query.end = searchTimeEnd;
      }

      getProject(query).then(response => {
        response.content.length > 0
          ? (this.status = "SEARCH_AFTER")
          : (this.status = "SEARCH_BEFOR");
      });
    },
    // 清除錯誤紅框
    resetErrorFocus() {
      this.$v.project.$reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.pjmanage_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 12px;
}

.pjmanage_wrapper {
  font-size: 18px;

  .project_inquiry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .query_conditions {
    margin-bottom: 20px;

    .query_conditionsAC {
      display: inline-block;
      margin-left: 20px;
      width: 482px;
    }

    .inline-input {
      margin-left: 20px;
    }

    .product-error {
      padding-left: 99px;
      letter-spacing: 1px;
    }
  }

  .inquire_button {
    text-align: center;
  }

  .query_date {
    margin-bottom: 24px;

    .datePicker {
      margin-left: 20px;
    }

    .product-error {
      padding-left: 121px;
      letter-spacing: 1px;
    }
  }
}

.project_list {
  font-size: 18px;
  margin-top: 24px;

  .center {
    text-align: center;
    padding: 150px 0;
  }

  .copywriting {
    font-size: 16px;
    color: #ea475b;
  }

  h2 {
    margin-bottom: 40px;
  }

  table {
    width: 100%;
    color: #000;
    letter-spacing: 1px;
    line-height: 1.38;
    font-size: 16px;
    text-align: left;
    margin-bottom: 24px;

    tr {
      border-bottom: 1px solid #eee;

      &:hover {
        background-color: #e6f9fa;
      }

      &:nth-child(1) {
        &:hover {
          background-color: #fff;
        }

        td {
          font-weight: bold;

          &:nth-child(1) {
            width: 390px;
          }
          &:nth-child(2) {
            width: 390px;
          }
          &:nth-child(3) {
            width: 200px;
          }
          &:nth-child(4) {
            width: 200px;
          }
        }
      }

      td {
        padding: 12px 12px 11px 18px;
        letter-spacing: 1.38px;
        border-bottom: 1px solid #eee;
        word-break: normal;

        div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          max-width: 390px;
        }

        .link {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          max-width: 390px;
          display: block;
        }
      }
    }
  }
}
</style>
