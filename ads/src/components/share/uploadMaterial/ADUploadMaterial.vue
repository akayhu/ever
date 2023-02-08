<template>
  <DropDownRow
    @onEditBtnClick="handleEdit"
    @onFocusOff="storeName === 'material' ? '' : (edit = false)"
    @onActiveOff="resetComponentData"
    :title="title"
    :tipText="activeText.text"
    :tipTextStatus="activeText.status"
    :subTitle="description"
    :isEditBtnClickAble="!showLoading"
    :isActive="isActive"
    :isEdit="edit"
    :isFocus="isFocus"
    :toolTipText="
      `請上傳預${
        storeName === 'material' ? '刊登' : '墊檔'
      }版位的廣告素材，並可上傳多組素材`
    "
    class="mb-6"
  >
    <div class="ad_upload_material">
      <div v-show="showLoading" class="loading_block">
        <Loading />
        <div>素材處理中，請稍候...</div>
      </div>

      <div
        v-if="
          (getMaterialReservationTwenty.length > 0 ||
            getCushionMaterialReservationTwenty.length > 0) &&
            !showLoading
        "
        class="quick_selection_material"
      >
        <div class="title">選擇素材</div>
        <div>
          <SelectDropdown
            @value-changed="setQuickSelectionMaterial($event)"
            :value="quickSelectionMaterialValue"
            :options="quickSelectionMaterialOptions"
            :optionsAllData="true"
            placeholder="請選擇"
          />
        </div>
        <div class="ml-2 quantity">
          共<span>{{ quickSelectionMaterialOptions.length }}</span
          >筆
        </div>
      </div>

      <div v-show="!showLoading" class="material_tab">
        <div class="left">
          <div class="material_tab_content d-flex align-items-center">
            <switch-tabs
              :tabs-data="newTab"
              :value="newTabId"
              :style-type="'secondary'"
              @select-tab="changeMaterialTab($event)"
            />
            <icon
              v-show="
                !isTempTabCreate &&
                  allowMaterial &&
                  materialReservation.totalPage > 0 &&
                  userSitePermissions
              "
              @click.native="createMaterialTab"
              iconName="icon-plus-border"
              size="28"
            />
          </div>
        </div>
      </div>

      <div
        v-if="storeName === 'material' && !showLoading"
        class="copy-material-block"
      >
        <div class="copy-material-title">複製素材</div>
        <div class="other-material">
          <label class="ad-radio-label">
            <input
              v-model="otherMaterials"
              :value="0"
              type="radio"
              name="otherMaterials"
              @change="changeOtherMaterials"
              :disabled="materialMonthMockData.length > 0 ? false : true"
            />
            <span class="ad-radio"></span>其他檔期素材
          </label>
        </div>
        <div v-if="otherMaterials === 0" class="other-material-content">
          <ul v-if="materialMonthMockData.length > 0">
            <li :class="{ scrollY: materialMonthMockData.length > 10 }">
              <dl>
                <dd
                  v-for="(item, index) in materialMonthMockData"
                  :key="item.reservationId"
                  @click="changeMonth(index, item.reservationId)"
                  :class="{ focus: materialMonthFocus === index }"
                >
                  <span v-if="item.reservationId">
                    {{ item.startDate && item.startDate.substring(4) }} ~
                    {{ item.endDate && item.endDate.substring(4) }}
                    (ID: {{ item.reservationId }})
                    <img src="@/assets/icon/icon-arrow-right-disable.svg" />
                  </span>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dd
                  v-for="(item, index) in materialTagMockData"
                  :key="item.id || index"
                >
                  <span v-if="item.id">
                    <label class="ad-radio-label" :title="item.title">
                      <input
                        v-model="materialTag"
                        :value="item.id"
                        type="radio"
                        name="materialTag"
                        @click="changeMaterialId(item.id)"
                      />
                      <span class="ad-radio"></span>{{ item.title }}
                    </label>
                  </span>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
        <div class="same-period-material">
          <div>
            <label class="ad-radio-label">
              <input
                v-model="otherMaterials"
                :value="1"
                type="radio"
                name="otherMaterials"
                @change="changeOtherMaterials"
                :disabled="samePeriodMaterialOptions.length > 0 ? false : true"
              />
              <span class="ad-radio"></span>同檔期其他素材
            </label>
          </div>
          <div class="same-period-material-select">
            <SelectDropdown
              @value-changed="setSamePeriodMaterial($event)"
              :value="samePeriodMaterial"
              :options="samePeriodMaterialOptions"
              :optionsAllData="true"
              :disabled="samePeriodMaterialOptions.length > 0 ? false : true"
              placeholder="請選擇"
            />
          </div>
        </div>
        <div class="apply">
          <button
            @click="apply"
            :disabled="!samePeriodMaterialId && !materialTag"
            :class="{ disabled: !samePeriodMaterialId && !materialTag }"
          >
            套用
          </button>
        </div>
      </div>

      <UploadMaterialForm
        v-show="!showLoading"
        @materialSubmit="onMaterialSubmit"
        @materialDelete="onMaterialDelete"
        v-bind="{
          storeName,
          allowMaterial,
          isTempTabCreate,
          showLoading,
          changeShowLoading,
          changeHideLoading,
          userSitePermissions,
          device,
          updateUserName,
          updateDate,
          boardId,
          accountId,
          materialName
        }"
        ref="upload_material_form"
      />
    </div>
  </DropDownRow>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import UploadMaterialForm from "./UploadMaterialForm.vue";
import DropDownRow from "@/components/share/DropDownRow";
import { ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";
import { MUTATIONS_TYPE } from "@/store/share/uploadMaterial/mutations";
import { GETTERS_TYPE as ROOT_GETTERS_TYPE } from "@/store/index";
import { MUTATIONS_TYPE as ROOT_MUTATIONS_TYPE } from "@/store/index";
import {
  CUSHION_UPLOAD_MATERIAL_WATCHED_API_LIST as CUSION_API_WATCHED_LIST,
  MATERIAL_UPLOAD_MATERIAL_WATCHED_API_LIST as MATERIAL_API_WATCHED_LIST
} from "@/apis/config/index";
import SelectDropdown from "@/components/share/SelectDropdown";
import SwitchTabs from "@/components/share/SwitchTabs.vue";

const API_WATCH_LIST = {
  material: MATERIAL_API_WATCHED_LIST,
  cushion: CUSION_API_WATCHED_LIST
};

const state = () => {
  return {
    accountId: "",
    edit: false,
    showLoading: false,
    isTempTabCreate: false,
    apiWatchedList: API_WATCH_LIST,
    updateUserName: "",
    updateDate: "",
    otherMaterials: "",
    materialBookmarkId: "",
    materialBookmarkStatus: "",
    materialTagMockData: [],
    materialTag: "",
    materialMonthMockData: [],
    materialMonthFocus: 0,
    samePeriodMaterial: "",
    samePeriodMaterialId: "",
    samePeriodMaterialOptions: [],
    quickSelectionMaterialValue: "",
    quickSelectionMaterialOptions: [],
    newTab: [{ key: "create", label: "新增素材001", index: 0 }],
    newTabId: { key: 0, label: null },
    newTabIndex: 0,
    exposureInfo: {
      materialId: null,
      title: null,
      index: 0
    },
    materialName: ""
  };
};

export default {
  name: "ADUploadMaterial",
  data() {
    return {
      ...state()
    };
  },
  props: {
    storeName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    },
    tagName: {
      type: String
    },
    allowMaterial: {
      type: Boolean,
      default: true
    },
    isFocus: {
      type: Boolean,
      required: true
    },
    userSitePermissions: {
      type: Boolean,
      default: true
    },
    device: {
      type: String
    },
    exposuresListLength: {
      type: Number,
      required: true
    },
    boardId: {
      type: Number,
      default: 0
    },
    reservationId: {
      type: Number
    },
    adShowLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loading,
    UploadMaterialForm,
    DropDownRow,
    SelectDropdown,
    SwitchTabs
  },
  computed: {
    ...mapState({
      materialReservation(state) {
        return state[this.storeName].materialReservation;
      },
      materialType(state) {
        return state[this.storeName].materialType;
      }
    }),
    ...mapGetters({
      getApiInLastApiList: [ROOT_GETTERS_TYPE.GET_API_IN_LAST_API_LIST]
    }),
    ...mapGetters("material", ["getMaterialExposuresListData"]),
    ...mapGetters("cushion", ["getCushionExposuresListData"]),
    getMaterialReservationStore() {
      return this.materialReservation;
    },
    activeText() {
      if (this.materialReservation.totalPage > 0) {
        if (this.exposuresListLength === 0) {
          return { text: "素材上傳尚未設定", status: "danger" };
        } else if (
          this.exposuresListLength < this.materialReservation.totalPage
        ) {
          return { text: "部分素材上傳未設定", status: "danger" };
        } else if (
          this.materialReservation.totalPage === this.exposuresListLength
        ) {
          return { text: "素材上傳已設定", status: "normal" };
        }
      }
      return { text: "請設定", status: "normal" };
    },
    idKey() {
      return this.storeName === "material" ? "reservationId" : "boardId";
    },
    materialReservationGrouping() {
      return this.getMaterialExposuresListData.materialReservationGrouping;
    },
    getMaterialReservationTwenty() {
      return this.getMaterialExposuresListData.materialReservationTwenty
        .materialResponse;
    },
    getCushionMaterialReservationTwenty() {
      return this.getCushionExposuresListData.materialReservationTwenty
        .materialResponse;
    }
  },
  methods: {
    ...mapMutations({
      updateMaterialReservation(commit, payload) {
        return commit(
          this.storeName + "/" + MUTATIONS_TYPE.UPDATE_MATERIAL_RESERVATION,
          payload
        );
      }
    }),
    ...mapMutations({
      updateLastApiList: ROOT_MUTATIONS_TYPE.UPDATE_LAST_API_LIST
    }),
    ...mapActions({
      getMaterialReservation(dispatch, payload) {
        return dispatch(
          this.storeName + "/" + ACTIONS_TYPE.GET_MATERIAL_RESERVATION,
          payload
        );
      },
      resetMaterialForm(dispatch, payload) {
        return dispatch(
          this.storeName + "/" + ACTIONS_TYPE.RESET_MATERIAL_FORM,
          payload
        );
      },
      resetMaterialType(dispatch) {
        return dispatch(
          this.storeName + "/" + ACTIONS_TYPE.RESET_MATERIAL_TYPE
        );
      },
      resetMaterialReservation(dispatch) {
        return dispatch(
          this.storeName + "/" + ACTIONS_TYPE.RESET_MATERIAL_RESERVATION
        );
      }
    }),
    ...mapActions("account", ["getAccountId"]),
    ...mapActions("material", [
      "getSingleMaterial",
      "getMaterialReservationGrouping",
      "getTwentyMaterialReservation"
    ]),
    ...mapActions("cushion", ["getCushionTwentyMaterialReservation"]),
    ...mapActions("exposure", ["getExposureReservation"]),
    // 取得新增素材的名稱
    getMaterialUniqueName(index = 1) {
      const name = "新增素材" + index.toString().padStart(3, "0");
      const isDuplicate = this.quickSelectionMaterialOptions.some(
        o => o.label === name
      );
      return isDuplicate ? this.getMaterialUniqueName(++index) : name;
    },
    // 切換素材
    changeMaterialTab(tabIndex) {
      if (this.newTabId.key === tabIndex.key) return;
      this.newTab = [
        {
          index: tabIndex.index,
          key: tabIndex.key,
          label: tabIndex.label
        }
      ];
      const { getMaterialReservationAction } = this;
      this.materialMonthFocus = 0;
      this.materialTagMockData = [];
      this.newTabId.key = tabIndex.key;
      getMaterialReservationAction({
        page: tabIndex.index + 1,
        resolveAction: function() {
          this.isTempTabCreate = false;
        }
      });
    },
    setQuickSelectionMaterial(data) {
      const { changeMaterialTab, getQuickSelectionMaterialValue } = this;
      changeMaterialTab({
        index: data.index,
        key: data.value,
        label: data.label
      });
      this.newTabId = {
        key: data.value,
        label: "submit"
      };
      this.newTabIndex = data.index;
      getQuickSelectionMaterialValue(data.index);
    },
    getQuickSelectionMaterialValue(index) {
      if (this.quickSelectionMaterialOptions.length > 0) {
        this.quickSelectionMaterialValue = this.quickSelectionMaterialOptions.find(
          option => option.index === index
        ).label;
      }
    },
    // 新增素材
    createMaterialTab() {
      const {
        updateMaterialReservation,
        materialReservation,
        resetMaterialForm,
        materialType: { typeId },
        getReservationGrouping,
        resetCopyMaterialOptions
      } = this;
      this.isTempTabCreate = true;
      const newName = this.getMaterialUniqueName();
      this.materialName = newName;
      this.newTab.push({
        key: 0,
        label: newName,
        index: 1
      });
      this.newTabId.key = 0;
      this.newTabId.label = "create";
      this.newTabIndex = this.quickSelectionMaterialOptions.length;
      this.$nextTick(() => {
        updateMaterialReservation({
          ...materialReservation,
          materialResponse: []
        });
        resetMaterialForm(typeId);
        getReservationGrouping();
        resetCopyMaterialOptions();
      });
    },
    // 刪除素材（接 uploadMaterialForm 拋上來的事件）
    async onMaterialDelete() {
      const { getMaterialReservationAction, getReservationGrouping } = this;
      this.newTabId.label = "delete";
      this.newTabIndex = 0;
      if (this.isTempTabCreate) {
        await getMaterialReservationAction({
          page: 1,
          isSkipHideLoading: true,
          resolveAction: function() {
            this.isTempTabCreate = false;
            this.$emit("onMaterialDelete");
          }
        });
      } else {
        getMaterialReservationAction({
          page: this.exposureInfo.index + 1,
          isSkipHideLoading: true,
          resolveAction: function() {
            this.$emit("onMaterialDelete");
          }
        });
      }
      if (this.storeName === "material") {
        await this.getTwentyMaterialReservation({
          reservationId: this.reservationId,
          size: 20,
          page: 1
        });
      } else {
        await this.getCushionTwentyMaterialReservation({
          boardId: this.boardId,
          size: 20,
          page: 1
        });
      }
      getReservationGrouping();
    },
    // 上傳素材（接 uploadMaterialForm 拋上來的事件）
    async onMaterialSubmit() {
      const {
        getMaterialReservationAction,
        getReservationGrouping,
        getTwentyMaterialReservation,
        getCushionTwentyMaterialReservation
      } = this;

      let page = this.newTabIndex + 1;

      await getMaterialReservationAction({
        page,
        isSkipHideLoading: true,
        resolveAction: function() {
          this.isTempTabCreate = false;
          this.$emit("onMaterialSubmit", {
            isCreateFisrtMaterial:
              this.exposuresListLength === 0 &&
              this.materialReservation.totalPage === 1
          });
        }
      });

      // 複製素材至其他檔期 要抓到最新同檔期素材，故上傳後再打一次
      getReservationGrouping();

      if (this.storeName === "material") {
        await getTwentyMaterialReservation({
          reservationId: this.reservationId,
          size: 20,
          page: 1
        });
      } else {
        await getCushionTwentyMaterialReservation({
          boardId: this.boardId,
          size: 20,
          page: 1
        });
      }
    },
    // 編輯
    handleEdit() {
      if (!this.isActive || this.showLoading) return;
      const {
        getMaterialReservationAction,
        storeName,
        apiWatchedList,
        getApiInLastApiList
      } = this;
      this.edit = !this.edit;
      this.$emit("edit");
      const matchedApi = getApiInLastApiList(apiWatchedList[storeName]) || {};
      if (this.edit && Object.keys(matchedApi).length > 0) {
        getMaterialReservationAction({
          page: 1,
          resolveAction: function() {
            this.isTempTabCreate = false;
            this.updateLastApiList({
              type: "delete",
              param: matchedApi
            });
          }
        });
      }
    },
    async getMaterialReservationAction({
      page = 1,
      isSkipHideLoading = false,
      resolveAction = () => {}
    }) {
      const {
        getMaterialReservation,
        changeShowLoading,
        changeHideLoading,
        idKey,
        materialType,
        getReservationGrouping,
        resetCopyMaterialOptions
      } = this;
      try {
        changeShowLoading();
        const response = await getMaterialReservation({
          page,
          size: 1,
          [idKey]: materialType[idKey]
        });
        if (typeof resolveAction === "function")
          resolveAction.call(this, response);
        if (!isSkipHideLoading) changeHideLoading();
      } catch (e) {
        console.log(e);
        changeHideLoading();
      }
      getReservationGrouping();
      resetCopyMaterialOptions();
    },
    // 出現 loading 圖
    changeShowLoading() {
      this.showLoading = true;
    },
    // 隱藏 loading 圖
    changeHideLoading() {
      this.showLoading = false;
    },
    resetComponentData() {
      this.resetMaterialForm(this.materialType.typeId);
      this.resetMaterialType();
      this.resetMaterialReservation();
      Object.assign(this.$data, state());
    },
    // 切換 其他檔期素材 與 同檔期其他素材 選項
    changeOtherMaterials() {
      this.materialTag = "";
      this.samePeriodMaterialId = "";
      this.samePeriodMaterial = "";
    },
    // 切換 其他檔期素材 週期
    changeMonth(index, reservationId) {
      const { materialMonthMockData } = this;
      if (reservationId) {
        this.materialMonthFocus = index;
        this.materialTagMockData = [];
        materialMonthMockData[index].materials.forEach(item => {
          this.materialTagMockData.push(item);
        });
      }
    },
    // 選擇 同檔期其他素材 選單
    setSamePeriodMaterial(data) {
      this.samePeriodMaterial = this.samePeriodMaterialOptions.find(
        option => option.value === data.value
      ).label;
      this.samePeriodMaterialId = this.samePeriodMaterialOptions.find(
        option => option.value === data.value
      ).value;
      this.otherMaterials = 1;
    },
    // 選擇 其他檔期素材 的素材
    changeMaterialId(materialTagId) {
      this.materialTag = materialTagId;
    },
    // 套用
    apply() {
      const {
        otherMaterials,
        getSingleMaterial,
        materialTag,
        samePeriodMaterialId,
        materialReservation,
        materialBookmarkId,
        materialBookmarkStatus
      } = this;

      // 若沒素材則為新增素材
      if (materialReservation.materialResponse.length < 1)
        this.isTempTabCreate = true;

      otherMaterials === 0
        ? getSingleMaterial({
            materialId: materialTag,
            create: this.isTempTabCreate,
            materialBookmarkId,
            materialBookmarkStatus
          })
        : getSingleMaterial({
            materialId: samePeriodMaterialId,
            create: this.isTempTabCreate,
            materialBookmarkId,
            materialBookmarkStatus
          });
    },
    // 取複製素材資訊
    getReservationGrouping() {
      const {
        getMaterialReservationGrouping,
        getMaterialExposuresListData
      } = this;
      getMaterialReservationGrouping(
        getMaterialExposuresListData.copyMaterialData
      );
    },
    // 清空複製素材選項
    resetCopyMaterialOptions() {
      this.otherMaterials = "";
      this.materialTag = "";
      this.samePeriodMaterialId = "";
      this.samePeriodMaterial = "";
    }
  },
  watch: {
    adShowLoading(newVal) {
      const { changeShowLoading, changeHideLoading } = this;
      newVal ? changeShowLoading() : changeHideLoading();
    },
    isActive(newVal) {
      if (newVal && this.storeName === "material") this.edit = true;
    },
    materialType() {
      Object.assign(this.$data, state());
      if (this.storeName === "material") {
        setTimeout(() => {
          this.edit = true;
        }, 200);
      }
    },
    getMaterialReservationStore(newVal) {
      if (newVal.materialResponse.length > 0) {
        this.materialBookmarkStatus = newVal.materialResponse[0].status;
        this.materialBookmarkId = newVal.materialResponse[0].id;
      }
    },
    // 監聽上傳素材最後修改者資訊
    materialReservation(newVal) {
      if (newVal.materialResponse.length > 0) {
        if (newVal.materialResponse[0].updateBy) {
          this.accountId = newVal.materialResponse[0].updateBy;
          this.getAccountId({
            accountId: newVal.materialResponse[0].updateBy
          }).then(res => {
            this.updateUserName = res.name;
          });
        }
        this.updateDate = newVal.materialResponse[0].updateDate;
      } else {
        this.updateUserName = "";
        this.updateDate = "";
      }
    },
    // 監聽 其他檔期素材 與 同檔期其他素材 資料
    materialReservationGrouping(newVal) {
      this.materialMonthMockData = [];
      this.materialTagMockData = [];
      this.samePeriodMaterialOptions = [];
      let materialOptions = [];

      newVal.forEach(item => {
        if (!item.current) {
          this.materialMonthMockData.push(item);
        } else {
          materialOptions.push(item);
        }
      });

      if (this.materialMonthMockData[0]) {
        this.materialMonthMockData[0].materials.forEach(item => {
          this.materialTagMockData.push(item);
        });
      }

      // 同檔期其他素材資料
      if (materialOptions.length > 0) {
        this.samePeriodMaterialOptions = materialOptions[0].materials.map(
          item => {
            return {
              value: item.id,
              label: item.title
            };
          }
        );
      }
    },
    async getMaterialReservationTwenty(newVal) {
      const {
        changeShowLoading,
        getExposureReservation,
        changeHideLoading
      } = this;

      if (newVal.length > 0) {
        changeShowLoading();
        await getExposureReservation({
          reservationId: this.reservationId
        }).then(res => {
          res.materialExposures.some((item, index) => {
            if (
              res.finished &&
              (item.today === 0 ||
                (index === res.materialExposures.length - 1 &&
                  item.today === -1))
            ) {
              this.exposureInfo = {
                ...this.exposureInfo,
                materialId: item.materialId,
                title: item.title
              };
              return true;
            }
          });
        });

        this.quickSelectionMaterialOptions = newVal.map((item, index) => {
          if (item.title === this.exposureInfo.title)
            this.exposureInfo = { ...this.exposureInfo, index };
          return {
            index,
            value: item.id,
            label: item.title
          };
        });

        const indexType = {
          submit: this.newTabIndex,
          create: this.quickSelectionMaterialOptions.length - 1,
          delete: this.exposureInfo.index
        };
        let index = indexType[this.newTabId.label] || this.exposureInfo.index;

        this.newTab = [
          {
            index,
            key:
              this.newTabId.label === "create"
                ? this.quickSelectionMaterialOptions[index].value
                : newVal[index].id,
            label:
              this.newTabId.label === "create"
                ? this.quickSelectionMaterialOptions[index].label
                : newVal[index].title
          }
        ];

        this.quickSelectionMaterialValue = this.quickSelectionMaterialOptions[
          index
        ].label;

        this.newTabId.key =
          this.newTabId.label === "create"
            ? this.quickSelectionMaterialOptions[index].value
            : newVal[index].id;
        if (!this.newTabId.label || this.newTabId.label === "create") {
          this.newTabIndex = index;
        }

        changeHideLoading();
      } else {
        this.quickSelectionMaterialValue = "";
        this.quickSelectionMaterialOptions = [];
      }
    },
    getCushionMaterialReservationTwenty(newVal) {
      if (newVal.length > 0) {
        this.quickSelectionMaterialOptions = newVal.map((item, index) => {
          return {
            index,
            value: item.id,
            label: item.title
          };
        });

        this.newTab = [
          {
            index: 0,
            key: newVal[0].id,
            label: newVal[0].title
          }
        ];
        this.newTabId.key = newVal[0].id;
        this.newTabIndex = 0;
        this.quickSelectionMaterialValue = this.quickSelectionMaterialOptions[0].label;
      } else {
        this.quickSelectionMaterialValue = "";
        this.quickSelectionMaterialOptions = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ad_upload_material {
  .quick_selection_material {
    display: flex;
    align-items: center;
    margin-top: 20px;

    .title {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #292929;
      margin-right: 12px;
    }

    .quantity {
      font-size: 16px;
      font-weight: bold;

      span {
        color: #19b9c0;
        margin: 0 4px;
      }
    }

    ::v-deep .el-select {
      width: 315px;
    }
  }

  .description {
    font-size: 16px;
    letter-spacing: 1.38px;
    color: #8f8f8f;
    margin-top: 6px;
    line-height: 1.38;
  }

  .loading_block {
    margin: 180px 0;
    text-align: center;
    color: #8f8f8f;
  }

  .copy-material-block {
    margin-top: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #ddd;

    .copy-material-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #292929;
    }

    .other-material {
      margin-top: 8px;
    }

    .other-material-content {
      padding-left: 28px;

      ul {
        display: inline-flex;
        border: 1px solid #ddd;
        margin-top: 16px;
        margin-bottom: 0;

        li {
          &.scrollY {
            overflow-y: scroll;
            height: 380px;
          }
          dl {
            margin-bottom: 0;

            dd {
              width: 300px;
              height: 38px;
              border-bottom: 1px solid #eee;
              margin-bottom: 0;
              display: flex;
              align-items: center;
              font-size: 16px;
              line-height: 1.38;
              letter-spacing: 1.38px;

              &:last-child {
                border-bottom: 0;
              }
            }
          }

          &:nth-child(1) {
            dl {
              position: relative;

              dd {
                border-right: 1px solid #ddd;
                background-color: #f3f3f3;
                color: #8f8f8f;
                padding-left: 44px;
                cursor: pointer;
                border: 1px solid #eee;

                img {
                  position: absolute;
                  right: 16px;
                }

                &.focus {
                  background-color: #fff;
                  color: #00afb8;
                }
              }
            }
          }

          &:nth-child(2) {
            dl {
              dd {
                padding-left: 16px;
                color: #00afb8;
                border: 1px solid #eee;

                .ad-radio-label {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  width: 270px;
                  line-height: 1.5;
                  margin-top: 7px;
                }
              }
            }
          }
        }
      }
    }

    .same-period-material {
      margin-top: 16px;
      display: inline-flex;
      align-items: center;

      div {
        &:nth-child(1) {
          margin-right: 28px;
        }
      }

      .same-period-material-select {
        width: 480px;
      }
    }

    .apply {
      margin-top: 16px;
      text-align: right;

      button {
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        color: #fff;
        padding: 6px 34px;
        border-radius: 4px;
        background-color: #00afb8;
        border: 0;

        &.disabled {
          background-color: #a9a9a9;
          color: #fff;
        }
      }
    }
  }

  .material_tab {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
    position: relative;
    height: 48px;
    z-index: 1;

    .left {
      .material_tab_content {
        display: flex;
        width: 900px;
        overflow: hidden;
        flex-wrap: wrap;
        position: absolute;
        top: 2px;
        z-index: 2;

        .switch_tabs_secondary {
          margin-bottom: 0;
          border-bottom: 0;

          ::v-deep .switch_tabs_element {
            padding: 12px 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 780px;

            &.focus {
              padding: 9px 16px 12px;
            }
          }
        }
      }

      img {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
