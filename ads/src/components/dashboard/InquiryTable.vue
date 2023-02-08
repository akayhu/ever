<template>
  <div>
    <div class="top_section">
      <div class="title">Dashboard查詢表</div>
      <div class="subtitle">
        <span>重要程度</span>
        <Priority :priorityObject="priorityType.high" class="mr-4" />
        <Priority :priorityObject="priorityType.medium" class="mr-4" />
        <Priority :priorityObject="priorityType.low" />
      </div>
    </div>
    <table class="table_section">
      <thead>
        <tr>
          <th rowspan="2">Dashboard項目</th>
          <th rowspan="2">Priority</th>
          <th rowspan="2">PM</th>
          <th rowspan="2">VM</th>
          <th rowspan="2">主管</th>
          <th colspan="4">整招</th>
        </tr>
        <tr>
          <th>業務</th>
          <th>營運</th>
          <th>企劃</th>
          <th>主管</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>(7天內)未上傳素材檔期</td>
          <td><Priority :priorityObject="priorityType.high" /></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><icon iconName="icon-line-on" /></td>
          <td><div class="dash"></div></td>
          <td><icon iconName="icon-line-on" /></td>
        </tr>
        <tr>
          <td>(7天內)未拉CUE檔期</td>
          <td><Priority :priorityObject="priorityType.high" /></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><icon iconName="icon-line-on" /></td>
          <td><div class="dash"></div></td>
          <td><icon iconName="icon-line-on" /></td>
        </tr>
        <tr>
          <td>過期預約未刪除</td>
          <td><Priority :priorityObject="priorityType.low" /></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><div class="dash"></div></td>
          <td><icon iconName="icon-line-on" /></td>
          <td><icon iconName="icon-line-on" /></td>
          <td><div class="dash"></div></td>
          <td><icon iconName="icon-line-on" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { priorityType } from "@/utils/dashboard/util";
import Priority from "@/components/dashboard/Priority";

export default {
  name: "InquiryTable",
  components: {
    Priority
  },
  data() {
    return {
      priorityType
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.top_section {
  margin-bottom: 12px;

  .title {
    @include font-common(16px, $font-weight-bold);
    margin-bottom: 16px;
  }

  .subtitle {
    display: flex;
    align-items: center;
    @include font-common(16px, $font-weight-bold);
    margin-right: 8px;

    span {
      margin-right: 16px;
    }
  }
}

.table_section {
  @include font-common(14px);

  th,
  td {
    border: 1px solid #e2e1e1;
    vertical-align: middle;
    text-align: center;
  }

  thead {
    th {
      padding: 23px 0px 21px 12px;
    }

    tr {
      &:nth-child(1) {
        th {
          padding-top: 8px;
          padding-bottom: 4px;

          &:nth-child(1) {
            width: 260px;
            text-align: left;
          }

          &:nth-child(2) {
            width: 109px;
            text-align: left;
          }

          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5) {
            padding-right: 12px;
            width: 59px;
          }
        }
      }

      &:nth-child(2) {
        th {
          padding: 6px 12px;
          width: 60px;
        }
      }
    }
  }

  td {
    padding: 14px 0;

    &:nth-child(1) {
      color: $gray-900;
      text-align: left;
      padding-left: 12px;
    }

    &:nth-child(2) {
      color: $gray-700;
      text-align: left;
      padding-left: 12px;
    }

    div.dash {
      display: inline-block;
      width: 20px;
      height: 2px;
      background-color: #d8d8d8;
      vertical-align: super;
    }
  }
}
</style>
