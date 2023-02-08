<template>
  <div>
    <div class="material_wrapper_title">上傳素材</div>

    <!-- 委刊單 -->
    <OrderList
      @edit="currentFocusComponent = componentList.ORDER_LIST"
      @selectCommitteeNumber="selectCommitteeNumber"
      @selectCommitteeTime="selectCommitteeTime"
      :class="
        currentFocusComponent === componentList.ORDER_LIST
          ? 'machineFocus'
          : 'machineNoFocus'
      "
    />

    <div class="material_content">
      <!-- 廣告版位(新呈現) -->
      <NewADSlot
        @selectADSlot="selectADSlot"
        :isFocus="currentFocusComponent === componentList.AD_SLOT"
        :device="device"
        :orderId="reservationOrderId"
      />
      <div class="material_content_right">
        <BoardContent
          v-if="Object.keys(tagData).length !== 0"
          :tagData="tagData"
        />
        <!-- 廣告素材上傳 -->
        <ADUploadMaterial
          ref="ad_upload_material"
          @onMaterialSubmit="onMaterialSubmit"
          @onMaterialDelete="onMaterialDelete"
          @edit="currentFocusComponent = componentList.AD_UPLOAD_MATERIAL"
          :isActive="isADUploadMaterialAactive"
          :isFocus="currentFocusComponent === componentList.AD_UPLOAD_MATERIAL"
          :tagName="tagName"
          :allowMaterial="allowMaterial"
          :userSitePermissions="userSitePermissions"
          :device="device"
          :exposuresListLength="materialExposuresList.length"
          :boardId="tagData.boardId"
          :reservationId="reservationId"
          :adShowLoading="showLoading"
          storeName="material"
          title="廣告素材上傳"
          description="設定廣告名稱、廣告刊期並選擇頻道＆版位"
        />

        <!-- 設定素材曝光日期 -->
        <AppointmentSchedule
          ref="ad_appintment_schedule"
          @appointmentScheduleSubmit="appointmentScheduleSubmit"
          @edit="currentFocusComponent = componentList.APPOINTMENT_SCHEDULE"
          :isActive="isAppointmentScheduleActive"
          :isFocus="
            currentFocusComponent === componentList.APPOINTMENT_SCHEDULE
          "
          :committeeTime="committeeTime"
          :reservationId="reservationId"
          :tagData="tagData"
          :userSitePermissions="userSitePermissions"
          :reservationOrderId="reservationOrderId"
        />

        <!-- 緊急上下架 -->
        <Emergency
          v-if="emergencyPublish.permission && userSitePermissions"
          @onPublishSubmit="publishSubmit"
          @edit="currentFocusComponent = componentList.AD_UPLOAD_MATERIAL"
          :emergencyPublish="emergencyPublish"
          :isFocus="currentFocusComponent === componentList.AD_UPLOAD_MATERIAL"
          :isActive="isEmergencyActive"
          :reservationId="reservationId"
        />

        <!-- 設定曝光條件 -->
        <ExposureConditions :isActive="isExposureConditionsActive" />

        <!-- 複製素材至其他檔期 -->
        <CopyMaterialToOtherSchedule
          @dialogCancel="resetAll"
          @edit="
            currentFocusComponent = componentList.AD_UPLOAD_MATERIAL && finished
          "
          :isActive="isCopyMaterialSchduleAactive"
          :isFocus="
            currentFocusComponent === componentList.AD_UPLOAD_MATERIAL &&
              finished
          "
          :reservationId="reservationId"
        />
      </div>
    </div>

    <!-- 確認是否繼續新增上傳素材 dialog -->
    <Dialog
      @dialogCancel="clearAll"
      @dialogConfirm="resetToADslot"
      :isShow="isDialogShow"
      title="您已完成上傳素材設定，是否要繼續上傳這張委刊單其他版位的素材?"
    />

    <!-- 提醒文案:曝光日期已清除 -->
    <Dialog
      @dialogCancel="resetAll"
      @dialogConfirm="resetAll"
      :isShow="isAlertDialogShow"
      :cancelButton="false"
      title="已清除日期設定，狀態恢復為【1已拉cue】，素材不會曝光。"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import OrderList from "@/components/material/OrderList.vue";
import NewADSlot from "@/components/material/NewADSlot.vue";
import BoardContent from "@/components/material/BoardContent.vue";
import AppointmentSchedule from "@/components/material/AppointmentSchedule.vue";
import ExposureConditions from "@/components/material/ExposureConditions.vue";
import ADUploadMaterial from "@/components/share/uploadMaterial/ADUploadMaterial.vue";
import CopyMaterialToOtherSchedule from "@/components/material/CopyMaterialToOtherSchedule.vue";
import Emergency from "@/components/material/Emergency.vue";
import Dialog from "@/components/Dialog.vue";
import { commonMixins } from "@/mixins/commonMixins";
import { ACTIONS_TYPE as UPLPAD_MATERIAL_ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";
import {
  MATERIAL_COMPONENT_LIST,
  materialActiveComponentMixin
} from "@/mixins/activeComponentMixin";

export default {
  name: "Material",
  data() {
    return {
      reservationOrderId: "",
      reservationOrderStartTime: "",
      reservationOrderEndTime: "",
      reservationId: 0,
      committeeTime: {
        timeStart: "",
        timeEnd: ""
      },
      tagData: {},
      tagName: "",
      allowMaterial: true,
      emergencyPublish: { permission: false },
      userSitePermissions: true,
      isDialogShow: false,
      isAlertDialogShow: false,
      currentFocusComponent: MATERIAL_COMPONENT_LIST.ORDER_LIST,
      device: "",
      finished: false,
      showLoading: false
    };
  },
  components: {
    OrderList,
    NewADSlot,
    BoardContent,
    AppointmentSchedule,
    ExposureConditions,
    ADUploadMaterial,
    Emergency,
    CopyMaterialToOtherSchedule,
    Dialog
  },
  beforeDestroy() {
    this.resetPageState();
  },
  computed: {
    ...mapGetters("material", ["getMaterialExposuresListData"]),
    ...mapState({
      materialReservation: state => state.material.materialReservation,
      materialType: state => state.material.materialType,
      materialExposuresList: state => state.material.materialExposuresList
    }),
    isADSlotActice() {
      return (
        this.activeComponetList.includes(this.componentList.AD_SLOT) ||
        this.activeComponetList.includes(
          this.componentList.AD_UPLOAD_MATERIAL
        ) ||
        this.activeComponetList.includes(
          this.componentList.APPOINTMENT_SCHEDULE
        )
      );
    },
    isADUploadMaterialAactive() {
      return this.activeComponetList.includes(
        this.componentList.AD_UPLOAD_MATERIAL
      );
    },
    isAppointmentScheduleActive() {
      return this.activeComponetList.includes(
        this.componentList.APPOINTMENT_SCHEDULE
      );
    },
    isExposureConditionsActive() {
      return this.activeComponetList.includes(
        this.componentList.AD_UPLOAD_MATERIAL
      );
    },
    isEmergencyActive() {
      return this.activeComponetList.includes(this.componentList.EMERGENCY);
    },
    isCopyMaterialSchduleAactive() {
      return this.activeComponetList.includes(
        this.componentList.COPY_MATERIAL_SCHEDULE
      );
    }
  },
  mixins: [commonMixins, materialActiveComponentMixin],
  inject: ["reload"],
  methods: {
    ...mapMutations("material", ["resetPageState"]),
    ...mapActions("material", [
      "getMaterialFinalReservation",
      "getMaterialReservationGrouping",
      "getMaterialReservationSchedule",
      "getTwentyMaterialReservation"
    ]),
    ...mapActions("material", {
      getMaterialReservation:
        UPLPAD_MATERIAL_ACTIONS_TYPE.GET_MATERIAL_RESERVATION,
      getMaterialType: UPLPAD_MATERIAL_ACTIONS_TYPE.GET_MATERIAL_TYPE
    }),
    ...mapActions("reservation", ["getReservationOrderId"]),
    ...mapActions("exposure", ["getExposureReservation"]),
    // 委刊單期間
    selectCommitteeTime(time) {
      this.committeeTime = time;
    },
    // 委刊單(內部服務單)選擇好後
    selectCommitteeNumber(query) {
      this.reservationOrderId = query.id;
      this.reservationOrderStartTime = query.start;
      this.reservationOrderEndTime = query.end;
      const { updateActiveComponentList, componentList } = this;
      updateActiveComponentList(componentList.ORDER_LIST);
      this.$nextTick(() => {
        updateActiveComponentList(componentList.AD_SLOT);
        this.currentFocusComponent = componentList.AD_SLOT;
      });
    },
    // 廣告版位選擇後
    async selectADSlot({ tagData }) {
      const {
        getMaterialType,
        getMaterialFinalReservation,
        updateActiveComponentList,
        getMaterialReservation,
        componentList,
        getUserSitePermissions,
        getMaterialExposuresListData,
        getMaterialReservationGrouping,
        getExposureReservation,
        getReservationSchedule,
        getTwentyMaterialReservation
      } = this;

      this.currentFocusComponent = componentList.AD_UPLOAD_MATERIAL;
      this.userSitePermissions = getUserSitePermissions(tagData.siteId);
      this.reservationId = tagData.reservationId;
      this.tagData = tagData;
      this.tagName = tagData.name;
      this.allowMaterial = tagData.allowMaterial;
      this.emergencyPublish = { ...tagData.emergencyPublish };
      this.device = tagData.device;
      let page = 1;
      let title = "";

      try {
        await getMaterialType(tagData);

        await getTwentyMaterialReservation({
          reservationId: tagData.reservationId,
          size: 20,
          page: 1
        });

        this.showLoading = true;

        // 有正式素材，有可以直接設定曝光日期與緊急上下架，沒有則下一步上傳素材
        await getMaterialFinalReservation({
          reservationId: tagData.reservationId
        }).then(res => {
          if (res.length > 0) {
            updateActiveComponentList(componentList.APPOINTMENT_SCHEDULE);
          }
        });

        updateActiveComponentList(componentList.AD_UPLOAD_MATERIAL);
        updateActiveComponentList(componentList.EMERGENCY);

        // 取得廣告素材上傳可複製素材選項
        await getMaterialReservationGrouping(
          getMaterialExposuresListData.copyMaterialData
        );

        // 有完成設定素材曝光日期，可直接設定複製素材至其他檔期
        await getExposureReservation({
          reservationId: tagData.reservationId
        }).then(res => {
          this.finished = res.finished;
          if (res.finished) {
            updateActiveComponentList(componentList.COPY_MATERIAL_SCHEDULE);
            getReservationSchedule();
          }
          res.materialExposures.some((item, index) => {
            if (
              item.today === 0 ||
              (index === res.materialExposures.length - 1 && item.today === -1)
            ) {
              title = item.title;
              return true;
            }
          });
          getMaterialExposuresListData.materialReservationTwenty.materialResponse.forEach(
            (item, index) => {
              if (title === item.title) page = index + 1;
            }
          );
        });

        await getMaterialReservation({
          reservationId: tagData.reservationId,
          size: 1,
          page
        }).then(() => {
          this.showLoading = false;
        });
      } catch (e) {
        console.log(e);
      }
    },
    // 素材修改後
    async onMaterialSubmit({ isCreateFisrtMaterial }) {
      const {
        updateActiveComponentList,
        componentList,
        getMaterialFinalReservation,
        tagData
      } = this;
      try {
        await getMaterialFinalReservation({
          reservationId: tagData.reservationId
        });
        this.$refs["ad_upload_material"].changeHideLoading();
        if (this.materialExposuresList.length > 0) {
          updateActiveComponentList(componentList.EMERGENCY);
          updateActiveComponentList(componentList.APPOINTMENT_SCHEDULE);
          this.currentFocusComponent = componentList.APPOINTMENT_SCHEDULE;
          if (isCreateFisrtMaterial) {
            await this.$nextTick();
            this.$refs["ad_appintment_schedule"].autoOpenHandler(
              this.materialExposuresList[0].id
            );
          }
        } else {
          // force adUploadMaterial close
          this.currentFocusComponent = "";
          await this.$nextTick();
          this.currentFocusComponent = componentList.AD_UPLOAD_MATERIAL;
          updateActiveComponentList(componentList.AD_UPLOAD_MATERIAL);
        }
      } catch (e) {
        this.$refs["ad_upload_material"].changeHideLoading();
        console.log(e);
      }
      if (this.finished)
        updateActiveComponentList(componentList.COPY_MATERIAL_SCHEDULE);
    },
    // 刪除素材
    async onMaterialDelete() {
      const {
        componentList,
        updateActiveComponentList,
        getMaterialFinalReservation,
        tagData
      } = this;
      try {
        await getMaterialFinalReservation({
          reservationId: tagData.reservationId
        });

        this.materialExposuresList.length > 0
          ? updateActiveComponentList(componentList.EMERGENCY)
          : updateActiveComponentList(componentList.AD_UPLOAD_MATERIAL);
      } catch (e) {
        console.log(e);
      }
      if (this.finished)
        updateActiveComponentList(componentList.COPY_MATERIAL_SCHEDULE);
    },
    // 確認繼續新增上傳素材後要打開的區塊
    onHold() {
      const { updateActiveComponentList, componentList } = this;
      updateActiveComponentList(componentList.AD_SLOT);
      updateActiveComponentList(componentList.APPOINTMENT_SCHEDULE);
      updateActiveComponentList(componentList.AD_UPLOAD_MATERIAL);
      updateActiveComponentList(componentList.EMERGENCY);
      updateActiveComponentList(componentList.COPY_MATERIAL_SCHEDULE);
      this.currentFocusComponent = componentList.AD_SLOT;
      this.isDialogShow = false;
    },
    // dialog 不新增其他版位
    resetToADslot() {
      const {
        getReservationOrderData,
        updateActiveComponentList,
        componentList,
        onHold
      } = this;
      getReservationOrderData();
      updateActiveComponentList(componentList.ORDER_LIST);

      if (this.emergencyPublish.permission && this.userSitePermissions) {
        onHold();
        return;
      }

      this.$nextTick(() => {
        onHold();
      });
    },
    // dialog 新增其他版位
    resetAll() {
      this.reload();
      this.isDialogShow = false;
      this.isAlertDialogShow = false;
    },
    clearAll() {
      this.$router.replace({ query: {} });
      this.resetAll();
    },
    // 重打委刊單拿新狀態廣告版位
    getReservationOrderData() {
      const {
        getReservationOrderId,
        reservationOrderId,
        reservationOrderStartTime,
        reservationOrderEndTime
      } = this;
      getReservationOrderId({
        id: reservationOrderId,
        start: reservationOrderStartTime,
        end: reservationOrderEndTime
      });
    },
    // 請急上架
    publishSubmit() {
      this.getReservationOrderData();
    },
    // 設定素材曝光日期送出
    appointmentScheduleSubmit(res) {
      if (res.clearAll) {
        this.isAlertDialogShow = true;
        return;
      }

      this.isDialogShow = true;
      this.emergencyPublish = res.emergencyPublish;
    },
    // 取複製素材至其他檔期的已預約檔期
    getReservationSchedule() {
      this.getMaterialReservationSchedule({
        reservationId: this.reservationId
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.material_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}

.material_content {
  display: flex;
  justify-content: space-between;

  .material_content_right {
    width: 1000px;
  }
}

.machineFocus {
  border: solid 1.5px #00afb8;
}

.machineNoFocus {
  border: solid 1.5px #e2e1e1;
}
</style>
