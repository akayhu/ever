<template>
  <div>
    <section class="newpj_wrapper">
      <div class="title">
        <div class="title-left">
          <h2>
            {{ newPjServiceValue === "create" ? "新增預約專案" : "專案內容" }}
          </h2>
          <icon
            v-if="newPjServiceValue !== 'create'"
            v-tooltip="{
              placement: 'right-start',
              offset: 5,
              content:
                '根據身分權限，特定功能限制如下 :<br />1.無「編輯他人專案」權限 : 無法「編輯/刪除」他人專案。<br />2.專案狀態為「合約簽回」 : 無法更改狀態回「提案中」。<br />3.專案狀態為「已結案」 : 無法「編輯/刪除」該專案。',
              trigger: 'hover',
              classes: ['calendar-question-mark']
            }"
            iconName="ic-help-outline"
          />
        </div>
        <div v-if="projectIdData.status !== -1">
          <icon
            v-if="newPjServiceValue !== 'create' && !canEdit && haveEditIcon"
            @click.native="pjEdit"
            iconName="edit"
          />
          <img
            v-if="newPjServiceValue !== 'create' && haveEditIcon"
            @click="pjDelete"
            :src="projectDeleteIcon"
          />
        </div>
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <th>選擇企業<span class="necessary">*</span></th>
          <td>
            <div class="w480">
              <SelectDropdown
                data-e2e="company"
                @value-changed="setSelectedCompany($event)"
                @set-history-record="searchedCompanyOptions = $event"
                :value="selectedCompany.name"
                :options="searchedCompanyOptions"
                :asncSearchCb="companySuggestSearch"
                :filterable="true"
                :remote="true"
                :optionsAllData="true"
                :class="{ error_message_border: $v.customerId.$error }"
                :disabled="
                  !canEditCustomer
                    ? true
                    : newPjServiceValue !== 'create' && !canEdit
                "
                :focusAction="resetCustomerIdErrorFocus"
                :type="'getCustomerSuggestion'"
                placeholder="輸入企業統編或企業名稱"
              />
            </div>
            <div class="product-error">
              <ValidationError
                :vData="$v.customerId"
                text="請選擇正確企業名稱"
              />
            </div>
          </td>
        </tr>
        <tr>
          <th>專案名稱<span class="necessary">*</span></th>
          <td>
            <input
              v-model="projectName"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: $v.projectName.$error }"
              :disabled="
                !canEditProjectName
                  ? true
                  : newPjServiceValue !== 'create' && !canEdit
              "
              placeholder="建議：企業名稱-今日日期，信義房屋20200103"
              widthType="480"
              @paste="filterValue($event, 'projectName')"
              @keydown="filterValue($event, 'projectName')"
              @focus="resetProjectNameErrorFocus"
            />
            <div class="product-error">
              <ValidationError
                :vData="$v.projectName"
                text="請填入專案名稱"
                maxLengthText="50"
              />
            </div>
          </td>
        </tr>
        <tr>
          <th>狀態<span class="necessary">*</span></th>
          <td>
            <label class="ad-radio-label">
              <input
                v-model="status"
                :value="0"
                :disabled="
                  !getCanEditStatus.includes(0) || projectIdData.status > 0
                    ? true
                    : newPjServiceValue !== 'create' && !canEdit
                "
                type="radio"
                name="projectStatus"
              />
              <span class="ad-radio"></span>提案中
            </label>
            <label v-if="newPjServiceValue !== 'create'" class="ad-radio-label">
              <input
                v-model="status"
                :value="1"
                :disabled="
                  !getCanEditStatus.includes(1) ||
                  (projectIdData.status === 2 && !getCanEditStatus.includes(1))
                    ? true
                    : newPjServiceValue !== 'create' && !canEdit
                "
                type="radio"
                name="projectStatus"
              />
              <span class="ad-radio"></span>合約簽回
            </label>
            <label
              v-if="newPjServiceValue !== 'create' && projectIdData.status > 0"
              class="ad-radio-label"
            >
              <input
                v-model="status"
                :value="2"
                :disabled="
                  !getCanEditStatus.includes(2) ||
                  (projectIdData.status === 2 && !getCanEditStatus.includes(2))
                    ? true
                    : newPjServiceValue !== 'create' && !canEdit
                "
                type="radio"
                name="projectStatus"
              />
              <span class="ad-radio"></span>結案
            </label>
            <label
              v-if="
                (newPjServiceValue !== 'create' && projectIdData.status > 0) ||
                  projectIdData.status === -1
              "
              class="ad-radio-label"
            >
              <input
                v-model="status"
                :value="-1"
                :disabled="
                  getCanEditStatus.indexOf(-1) === -1 ||
                  projectIdData.status === 2
                    ? true
                    : newPjServiceValue !== 'create' && !canEdit
                "
                type="radio"
                name="projectStatus"
              />
              <span class="ad-radio"></span>作廢
            </label>
          </td>
        </tr>
        <tr>
          <th>備註</th>
          <td>
            <input
              v-model="note"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: $v.note.$error }"
              :disabled="
                !canEditNote ? true : newPjServiceValue !== 'create' && !canEdit
              "
              placeholder="如果是幫內部PR做預約，可以加註需求部門名稱，例：家教網..."
              widthType="680"
              @paste="filterValue($event, 'note')"
              @keydown="filterValue($event, 'note')"
            />
            <div class="product-error">
              <ValidationError :vData="$v.note" maxLengthText="200" />
            </div>
          </td>
        </tr>
        <tr>
          <th>成交價(含稅)</th>
          <td>
            <input
              v-model="price"
              :disabled="
                !canEditPrice
                  ? true
                  : newPjServiceValue !== 'create' && !canEdit
              "
              placeholder="請輸入"
              type="number"
              widthType="122"
              max="1000000000"
              :class="{ error_message_border: $v.price.$error }"
            />
            元
            <div class="product-error">
              <ValidationError
                :vData="$v.price"
                :text="`${price < 0 ? '不可為負數' : '成交價超過上限'}`"
              />
            </div>
          </td>
        </tr>
        <tr v-if="canCreateFreeProject">
          <th>空版專案</th>
          <td>
            <label class="ad-radio-label">
              <input
                v-model="freeProject"
                :disabled="
                  !canEditFreeProject
                    ? true
                    : newPjServiceValue !== 'create' && !canEdit
                "
                type="radio"
                name="airProject"
                value="true"
              />
              <span class="ad-radio"></span>是
            </label>
            <label class="ad-radio-label">
              <input
                v-model="freeProject"
                :disabled="
                  !canEditFreeProject
                    ? true
                    : newPjServiceValue !== 'create' && !canEdit
                "
                type="radio"
                name="airProject"
                value="false"
              />
              <span class="ad-radio"></span>否
            </label>
          </td>
        </tr>
        <tr>
          <th>預約人員</th>
          <td class="account">
            <span v-if="!canEditOwner" class="user_name">
              {{ ownerName }}({{ owner }})
            </span>
            <div v-if="canEditOwner" class="w150">
              <SelectDropdown
                @value-changed="setSelectedAccount($event)"
                :value="selectedAccount"
                :options="searchedAccountOptions"
                :asncSearchCb="accountSuggestSearch"
                :filterable="true"
                :remote="true"
                :optionsAllData="true"
                :class="{ error_message_border: $v.selectedAccount.$error }"
                :disabled="newPjServiceValue !== 'create' && !canEdit"
              />
            </div>
            <div class="product-error">
              <ValidationError
                :vData="$v.selectedAccount"
                text="請選擇正確名稱"
              />
            </div>
          </td>
        </tr>
      </table>

      <div v-if="contractDate" class="sign_back_time">
        <icon iconName="icon-ad-icon-autouapdte-off" size="20" />
        合約簽回時間<span>{{ contractDate }}</span>
      </div>

      <div
        v-if="newPjServiceValue === 'create' || canEdit"
        class="button_block"
      >
        <button class="button_bg_white_large" @click="cancelProject">
          取消
        </button>
        <button class="button_bg_blue_large" @click="createProject">
          儲存
        </button>
      </div>
    </section>

    <Dialog
      v-if="projectEdit"
      @dialogCancel="closeFunc"
      @dialogConfirm="closeFunc"
      :isShow="projectEdit"
      :cancelButton="false"
      :title="`您${canEdit ? '已修改' : '已新增'} ${projectName} 完成`"
      :content="
        `${
          prepareCount > 0
            ? `已預約成功 ${formalCount} 筆版位，備取 ${prepareCount} 筆版位`
            : `您已完成${canEdit ? '修改' : '新增'} ${projectName} 專案。`
        }`
      "
      :theEssential="`${prepareCount > 0 ? ' 提醒您有檔期為備取' : ''}`"
      componentKey="projectEdit"
      key="projectEdit"
    />

    <Dialog
      v-if="openCompletedDeleteProject"
      @dialogCancel="deleteProjectFunc"
      @dialogConfirm="deleteProjectFunc"
      :isShow="openCompletedDeleteProject"
      :cancelButton="false"
      componentKey="openCompletedDeleteProject"
      key="openCompletedDeleteProject"
      title="已刪除完成。"
      content="您已刪除完成專案。"
    />

    <Dialog
      v-if="projectDelete"
      @dialogCancel="handleCancel"
      @dialogConfirm="handleSaveDeleteProject"
      :isShow="projectDelete"
      componentKey="projectDelete"
      key="projectDelete"
      title="您要刪除專案嗎?"
      content="確認刪除專案。"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";
import { required, maxLength, between } from "vuelidate/lib/validators";
import SelectDropdown from "@/components/share/SelectDropdown";
import Dialog from "@/components/Dialog.vue";
import ValidationError from "@/components/ValidationError";
import newPjMachine from "@/views/stateMachine/newPj";
import userAuthority from "@/utils/userAuthority";
import { filterSpecifiedSymbols } from "@/directives/filterSpecifiedSymbols";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";

export default {
  name: "ProjectContent",
  data() {
    return {
      canEdit: false,
      projectDelete: false,
      openCompletedDeleteProject: false,
      searchedCompanyOptions: [],
      searchedAccountOptions: [],
      selectedCompany: { name: "", id: 0 },
      selectedAccount: "",
      customerId: "",
      projectName: "",
      status: 0,
      note: "",
      price: "",
      freeProject: "",
      ownerName: "",
      owner: "",
      newPjService: newPjMachine,
      projectEdit: false,
      addProjectId: "",
      canDeleteProject: true,
      canEditCustomer: true,
      canEditProjectName: true,
      canEditStatus: [0],
      canEditNote: true,
      canEditPrice: true,
      canEditFreeProject: true,
      canEditOwner: false,
      accountMenu: [],
      logonId: "",
      contractDate: "",
      formalCount: 0,
      prepareCount: 0
    };
  },
  props: {
    newPjServiceValue: {
      type: String
    },
    projectId: {
      type: Number
    },
    changePropsStatus: {
      type: Function
    }
  },
  components: {
    ValidationError,
    SelectDropdown,
    Dialog
  },
  directives: { filterSpecifiedSymbols },
  mixins: [commonMixins],
  validations: {
    customerId: { required },
    projectName: { required, maxLength: maxLength(50) },
    note: { maxLength: maxLength(200) },
    price: { between: between("", 1000000000) },
    selectedAccount: { required }
  },
  computed: {
    ...mapGetters("user", ["getUserStatus"]),
    ...mapGetters("project", ["getProjectData"]),
    projectIdData() {
      return this.getProjectData.projectId;
    },
    getProjectIdProp() {
      return this.projectId;
    },
    projectDeleteIcon() {
      return this.canDeleteProject
        ? require("@/assets/icon/delete.svg")
        : require("@/assets/icon/delete-disable.svg");
    },
    // 是否出現編輯 icon
    haveEditIcon() {
      const { getUserStatus, owner } = this;
      const userAuthorityData = userAuthority[getUserStatus.role];
      if (userAuthorityData.pjmanageEdit) {
        if (
          userAuthorityData.pjmanageEdit_3 ||
          userAuthorityData.pjmanageEdit_4 ||
          (userAuthorityData.pjmanageEdit_2 &&
            owner === getUserStatus.accountId)
        ) {
          return true;
        }
      }
      return false;
    },
    canCreateFreeProject() {
      // 有特定權限的人才可以新增空版專案
      return userAuthority[this.getUserStatus.role].pjmanageEdit_4;
    },
    getCanEditStatus() {
      return this.canEditStatus;
    }
  },
  beforeMount() {
    const {
      $route,
      newPjService,
      getDefaultValue,
      patchCanEditOwner,
      getUserStatus
    } = this;
    const userAuthorityData = userAuthority[getUserStatus.role];

    // 若是新增 path，切回到新增狀態
    if ($route.path === "/newpj") newPjService.send("BACK_CREATE");
    if ($route.path === "/editpj") newPjService.send("CREATE_PERFECTION");

    // 預設有特定權限的人新增專案可編輯預約人員
    if (userAuthorityData.pjmanageEdit_4) patchCanEditOwner();
    // 讀取 store 專案資料值
    getDefaultValue();
  },
  methods: {
    ...mapActions("account", ["getAccountSearch"]),
    ...mapActions("reservation", ["getReservation"]),
    ...mapActions("project", [
      "getProjectId",
      "postProject",
      "patchProject",
      "deleteProjectId",
      "getCustomerSuggestion",
      "patchCanEditOwner"
    ]),
    // 預設專案內容值
    getDefaultValue() {
      const { getUserStatus, changePropsStatus } = this;
      this.projectId = this.projectIdData.projectId;
      this.customerId = this.projectIdData.customerId;
      this.selectedCompany.name = this.projectIdData.customerName
        ? `${this.projectIdData.customerName}(${this.projectIdData.customerId})`
        : "";
      this.projectName = this.projectIdData.projectName;
      this.status = this.projectIdData.status;
      this.note = this.projectIdData.note;
      this.price = this.projectIdData.price;
      this.freeProject = this.projectIdData.freeProject;
      this.ownerName = this.projectIdData.ownerName || getUserStatus.name;
      this.owner = this.projectIdData.owner || getUserStatus.accountId;
      this.selectedAccount = `${this.ownerName}(${this.owner})`;
      this.canDeleteProject = this.projectIdData.canDeleteProject;
      this.canEditCustomer = this.projectIdData.canEditCustomer;
      this.canEditProjectName = this.projectIdData.canEditProjectName;
      this.canEditStatus = this.projectIdData.canEditStatus || [0];
      this.canEditNote = this.projectIdData.canEditNote;
      this.canEditPrice = this.projectIdData.canEditPrice;
      this.canEditFreeProject = this.projectIdData.canEditFreeProject;
      this.canEditOwner = this.projectIdData.canEditOwner;
      this.contractDate = this.projectIdData.contractDate;
      changePropsStatus(this.projectIdData.status);
    },
    // 選擇企業
    async companySuggestSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getCustomerSuggestion } = this;
        let query = !isNaN(Number(keyword))
          ? { invoice: keyword }
          : { keyword };
        const responseData = await getCustomerSuggestion(query);
        this.searchedCompanyOptions = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      }
    },
    // 選擇企業
    setSelectedCompany(data) {
      if (!data) {
        this.selectedCompany = { name: "", id: 0 };
        this.searchedCompanyOptions = [];
        this.customerId = "";
        this.projectName = "";
        return;
      }
      const replaceCostno = /\([^)]*\)/g; // 過濾 costno
      const companyName = data.name.replace(replaceCostno, "");
      this.selectedCompany = {
        ...this.searchedCompanyOptions.find(option => option.id === data.value)
      };
      this.customerId = data.value;
      this.projectName = `${companyName}_${this.getDate()}`;
    },
    // 預約人員
    async accountSuggestSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getAccountSearch } = this;
        const responseData = await getAccountSearch({ keyword });
        this.searchedAccountOptions = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.name}(${item.accountId})`
          };
        });
      }
    },
    // 預約人員
    setSelectedAccount(data) {
      this.selectedAccount = this.searchedAccountOptions.find(
        option => option.accountId === data.accountId
      ).label;
      this.ownerName = data.name;
      this.owner = data.accountId;
    },
    // 專案編輯
    pjEdit() {
      this.canEdit = true;
    },
    // 專案刪除
    pjDelete() {
      if (!this.canDeleteProject) return false;
      this.projectDelete = true;
    },
    // 取消刪除
    handleCancel() {
      this.projectDelete = false;
    },
    // 確定刪除
    handleSaveDeleteProject() {
      const { deleteProjectId, getProjectIdProp } = this;
      deleteProjectId({ id: getProjectIdProp }).then(() => {
        this.projectDelete = false;
        setTimeout(() => {
          this.openCompletedDeleteProject = true;
        }, 100);
      });
    },
    // 取消專案
    cancelProject() {
      const { $route, jump, getDefaultValue } = this;
      if ($route.path === "/newpj") jump(`/pjmanage`);
      if ($route.path === "/editpj") {
        getDefaultValue(); // 編修過的值回之前的狀態
        this.canEdit = false;
      }
    },
    // 新增預約專案
    createProject() {
      const {
        $v,
        patchProject,
        postProject,
        $route,
        getProjectId,
        getProjectIdProp,
        customerId,
        freeProject,
        note,
        price,
        projectName,
        status,
        owner,
        getReservation,
        getDefaultValue,
        changePropsStatus
      } = this;
      const customerIdValidation = $v.customerId;
      const projectNameValidation = $v.projectName;
      const accountValidation = $v.selectedAccount;
      const priceValidation = $v.price;
      const noteValidation = $v.note;
      customerIdValidation.$touch();
      projectNameValidation.$touch();
      accountValidation.$touch();
      priceValidation.$touch();
      noteValidation.$touch();

      if (
        !customerIdValidation.$error &&
        !projectNameValidation.$error &&
        !accountValidation.$error &&
        !priceValidation.$error &&
        !noteValidation.$error
      ) {
        let query = {
          customerId,
          freeProject,
          note,
          price: Number(price),
          projectName,
          status: Number(status),
          owner
        };
        const reservationQuery = {
          page: 1,
          size: 20,
          type: 1
        };

        if ($route.path === "/editpj") {
          query.id = getProjectIdProp || this.addProjectId;
          // 讓新增版位可及時是否可選銷用
          changePropsStatus(Number(status));
          patchProject(query).then(() => {
            getProjectId({ projectId: query.id }).then(() => {
              getDefaultValue();
            });
            this.$emit("editProject");
            // 重新讀取列表資料，取得正取資料列表
            getReservation({ ...reservationQuery, projectId: query.id }).then(
              res => {
                if (res.content.length > 0)
                  this.formalCount = res.content.length;
              }
            );
            // 重新讀取列表資料，取得備取資料列表
            getReservation({
              ...reservationQuery,
              projectId: query.id,
              type: 0
            }).then(res => {
              if (res.content.length > 0)
                this.prepareCount = res.content.length;
              this.projectEdit = true;
            });
          });
        } else {
          postProject(query).then(response => {
            getProjectId({ projectId: response }).then(() => {
              getDefaultValue();
            });
            this.addProjectId = response;
            this.projectEdit = true;
            this.$emit("createProjectId", response);
          });
        }
      }
    },
    // 關閉 Dialog
    closeFunc() {
      const { $route, $router, addProjectId, newPjService } = this;
      if ($route.path === "/newpj") {
        $router.push({
          path: `/editpj`,
          query: {
            projectId: addProjectId
          }
        });
        newPjService.send("CREATE_PERFECTION");
      }
      this.projectEdit = false;
      this.canEdit = false;
    },
    // 刪除確認
    deleteProjectFunc() {
      this.jump(`/pjmanage`);
    },
    // 過濾特殊符號
    filterValue($el, dataName) {
      return (this.$data[dataName] = utilsFilterSpecifiedSymbols(
        $el.target.value
      ));
    },
    // 清除選擇企業錯誤紅框
    resetCustomerIdErrorFocus() {
      this.$v.customerId.$reset();
    },
    // 清除專案名稱錯誤紅框
    resetProjectNameErrorFocus() {
      this.$v.projectName.$reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.newpj_wrapper {
  font-size: 18px;

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    .title-left {
      display: inline-flex;

      img {
        width: 16px;
        margin-left: 8px;
        vertical-align: initial;
      }
    }

    img {
      margin-left: 15px;
      cursor: pointer;
    }
  }

  table {
    width: 100%;

    tr {
      th {
        font-size: 18px;
        letter-spacing: 1.36px;
        color: #333;
        width: 125px;
        text-align: left;
      }

      td {
        padding-bottom: 24px;

        .user_name {
          padding-top: 10px;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.07px;
          color: #a9a9a9;
          display: inline-block;
        }

        .w480 {
          width: 480px;
        }

        .w150 {
          width: 150px;
        }
      }

      &:last-child {
        td {
          padding-bottom: 0;
        }
      }
    }
  }

  .sign_back_time {
    text-align: right;
    border-top: 1px solid #eee;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #333;
    padding-top: 24px;
    margin-top: 24px;

    span {
      font-weight: normal;
      color: #292929;
      margin-left: 12px;
    }
  }

  .button_block {
    text-align: center;
    margin-top: 24px;

    button {
      &:nth-child(1) {
        margin-right: 30px;
      }
    }
  }
}

.dialog_title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #333;
  text-align: center;
  margin-top: 90px;
}

.dialog_annotation {
  font-size: 16px;
  line-height: 1.38;
  letter-spacing: 1px;
  color: #8f8f8f;
  margin-top: 7px;
  text-align: center;
}

.dialog_button_block {
  margin: 50px 0 62px;
  text-align: center;

  button {
    &:first-child {
      margin-right: 30px;
    }
  }
}
</style>
