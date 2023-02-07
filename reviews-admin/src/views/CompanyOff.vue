<template>
  <div class="company-off">
    <div class="title">公司下架</div>
    <p>下架公司在前台會直接呈現下架狀態，無法供使用者查詢和瀏覽評論</p>

    <div class="company-off-condition">
      <div class="company-off-input-block">
        公司 custno：
        <el-input v-model="custno" placeholder="custno"></el-input>
        <el-button type="primary" @click="handleSearchCompany">查詢</el-button>
      </div>
      <div
        v-if="companyData.companyName && companyData.searchLoadingEnd"
        class="company-off-confirm"
      >
        {{ companyData.companyName }}
        <span v-if="companyData.isPublic === 1">
          <el-checkbox
            :true-label="1"
            :false-label="0"
            v-model="companyOffChecked"
          >
            確定下架
          </el-checkbox>
          <el-button type="primary" @click="handleCompanyOff(0)"
            >送出</el-button
          >
        </span>
        <span v-if="companyData.isPublic === 0">已下架</span>
      </div>
      <div
        v-if="!companyData.companyName && companyData.searchLoadingEnd"
        class="no-company"
      >
        查無此公司，請重新輸入
      </div>
    </div>

    <div class="loading" v-if="!companyListData.loadingEnd">
      <Loading />
    </div>

    <div
      class="no-pending-company"
      v-if="getCompanyList.length < 1 && companyListData.loadingEnd"
    >
      目前無下架公司資料
    </div>

    <table
      width="100%"
      border="0"
      v-if="getCompanyList.length > 0 && companyListData.loadingEnd"
    >
      <tr>
        <th>被下架公司</th>
        <th>custno</th>
        <th>查看/審核</th>
      </tr>
      <company-off-item
        v-for="(item, index) in getCompanyList"
        :item="item"
        :index="index + 1"
        :key="index"
        @company-on="handleCompanyOn($event, 1)"
      />
    </table>

    <div
      class="pagination"
      v-if="getCompanyList.length > 0 && companyListData.loadingEnd"
    >
      <Pages path="company_off" :maxPage="getLastPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CompanyOffItem from "@/components/CompanyOffItem.vue";
import Pages from "@/components/Pages.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "CompanyOff",
  data() {
    return {
      custno: "",
      companyOffChecked: 0
    };
  },
  components: {
    CompanyOffItem,
    Pages,
    Loading
  },
  inject: ["reload"],
  computed: {
    ...mapGetters("company", ["getCompanyData"]),
    companyListData() {
      return this.getCompanyData.companyList;
    },
    getCompanyList() {
      return this.getCompanyData.companyList.items;
    },
    getLastPage() {
      return this.getCompanyData.companyList.lastPage;
    },
    companyData() {
      return this.getCompanyData.companyData;
    }
  },
  methods: {
    ...mapActions("company", [
      "getCompany",
      "postCompanyOnOff",
      "getCompanyOffLists"
    ]),
    handleSearchCompany() {
      const { custno } = this;
      this.getCompany(custno);
    },
    handleCompanyOff(isPublic) {
      const { custno, companyOffChecked } = this;
      if (!companyOffChecked) return alert("請勾選確定下架");
      this.postCompanyOnOff({ custno, isPublic });
      this.getCompanyOffListsFunc();
    },
    handleCompanyOn(custno, isPublic) {
      this.postCompanyOnOff({ custno, isPublic });
      this.getCompanyOffListsFunc();
    },
    getCompanyOffListsFunc() {
      this.reload();
      setTimeout(() => {
        this.getCompanyOffLists({
          perPage: 10,
          page: 1
        });
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.company-off {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 895px;
  border-radius: 5px;
  color: #333;
  letter-spacing: 1px;

  .loading,
  .no-pending-company {
    text-align: center;
    padding: 150px 0;
  }

  .title {
    padding: 15px 15px 0;
    font-weight: bold;
    font-size: 20px;
  }

  p {
    padding: 15px 15px;
    color: #9a9a9a;
    font-weight: 400;
  }

  .company-off-condition {
    margin: 0 15px 40px;
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;

    .company-off-input-block {
      display: flex;
      align-items: center;

      .el-input {
        width: 200px;
        margin-left: 10px;
      }

      .el-button {
        margin-left: 10px;
      }
    }

    .company-off-confirm {
      margin-top: 15px;

      .el-checkbox {
        margin: 0 10px;
      }
    }

    .no-company {
      color: red;
      margin-top: 15px;
    }
  }

  table {
    tr {
      &:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.05);
      }

      th {
        color: #9a9a9a;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        padding-bottom: 12px;
        vertical-align: middle;
        text-align: center;
      }
    }
  }

  .pagination {
    margin: 50px 0 30px;
    text-align: center;
  }
}
</style>
