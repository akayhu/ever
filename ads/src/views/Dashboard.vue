<template>
  <div>
    <LoadingPage v-if="isLoading" />
    <fragment v-else>
      <div v-if="isEmpty" class="dashboard_empty">
        <div class="info">
          <div>
            <img src="@/assets/before_login.svg" width="285" />
          </div>
          <div>
            <div class="title">太棒了！目前一切如期進行喔～</div>
            <p>
              Dashboard (狀態儀表板) 提供不同身分的自動提示功能，
              <br />
              請參考下方 <span>Dashboard查詢表</span>
            </p>
            <p>
              您的Dashboard狀態顯示：一切正常！
            </p>
          </div>
        </div>
        <div class="inquiry_table">
          <InquiryTable class="mb-4" />
        </div>
      </div>
      <fragment v-else>
        <div class="dashboard_wrapper_title">
          <span class="mr-2">重要程度</span>
          <Priority
            class="mr-2"
            :priorityObject="priorityType.high"
            :showText="false"
          />
          <Priority
            class="mr-2"
            :priorityObject="priorityType.medium"
            :showText="false"
          />
          <Priority
            class="mr-4"
            :priorityObject="priorityType.low"
            :showText="false"
          />
          <a
            href="javascript:void(0)"
            @click="
              showInquiryTableDialog = true;
              $refs.inquiryTableDialog.openModal();
            "
            >Dashboard查詢表</a
          >
        </div>

        <div class="dashboard_wrapper">
          <fragment v-for="cardInfo in cardInfos" :key="cardInfo.id">
            <Card :info="cardInfo"></Card>
          </fragment>
        </div>

        <Modal
          ref="inquiryTableDialog"
          @close="showInquiryTableDialog = false"
          :isShow="showInquiryTableDialog"
          title=""
        >
          <template #body>
            <InquiryTable class="inquiry_table_dialog" />
          </template>
        </Modal>
      </fragment>
    </fragment>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import LoadingPage from "@/components/LoadingPage.vue";
import Modal from "@/components/share/Modal.vue";
import InquiryTable from "@/components/dashboard/InquiryTable.vue";
import { priorityType } from "@/utils/dashboard/util.js";
import Priority from "@/components/dashboard/Priority.vue";
import Card from "@/components/dashboard/Card.vue";

export default {
  name: "Dashboard",
  components: {
    LoadingPage,
    Modal,
    InquiryTable,
    Priority,
    Card
  },
  data() {
    return {
      priorityType,
      isLoading: true,
      showInquiryTableDialog: false,
      cardInfos: {
        unUpload: {
          title: "未上傳素材檔期",
          priority: priorityType.high,
          tableHeader: [
            { key: "name", label: "版位名稱" },
            { key: "start_date", label: "開始時間" },
            { key: "end_date", label: "結束時間" },
            { key: "other", label: "剩餘天數" }
          ],
          stateName: "unUpload",
          action: this.getUnUploadReservation
        },
        unCue: {
          title: "未拉cue檔期",
          priority: priorityType.high,
          tableHeader: [
            { key: "name", label: "版位名稱" },
            { key: "start_date", label: "開始時間" },
            { key: "end_date", label: "結束時間" },
            { key: "other", label: "剩餘天數" }
          ],
          stateName: "unCue",
          action: this.getUnCueReservation
        },
        expired: {
          title: "過期預約未刪除",
          priority: priorityType.low,
          tableHeader: [
            { key: "name", label: "版位名稱" },
            { key: "start_date", label: "開始時間" },
            { key: "end_date", label: "結束時間" },
            { key: "other", label: "過期天數" }
          ],
          stateName: "expired",
          action: this.getExpiredReservation
        }
      }
    };
  },
  computed: {
    ...mapState("dashboard", ["unUpload", "unCue", "expired"]),
    ...mapGetters("dashboard", ["isEmpty"]),
    ...mapGetters("user", ["getUserStatus"])
  },
  created() {
    this.fetchData();
    window.addEventListener("focus", this.fetchData);
    // window.addEventListener("visibilitychange", this.fetchData);
  },
  methods: {
    ...mapActions("dashboard", [
      "getUnUploadReservation",
      "getUnCueReservation",
      "getExpiredReservation"
    ]),
    async fetchData() {
      if (document.hidden) return;
      let query = {
        page: 1,
        size: 10
      };
      this.isLoading = true;
      if (this.getUserStatus.role !== 11) {
        await this.getUnUploadReservation({ ...query, stateName: "unUpload" });
        await this.getUnCueReservation({ ...query, stateName: "unCue" });
      }
      await this.getExpiredReservation({ ...query, stateName: "expired" });
      this.isLoading = false;
    }
  },
  destroyed: function() {
    window.addEventListener("focus", this.fetchData);
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

@mixin table_width($table_config) {
  @each $name, $width in $table_config {
    div[class*="_#{$name}"] {
      width: $width;
    }
  }
}

$table_width_config: (
  name: 230px,
  start_date: 144px,
  end_date: 144px,
  other: 38px
);

.dashboard_empty {
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: $white;
  padding: 120px 0px 120px 246px;

  .info {
    display: flex;
    margin-bottom: 36px;

    > div {
      margin-right: 55px;
    }

    .title {
      @include font-common(20px);
      margin-bottom: 15px;
    }

    p {
      @include font-common(16px, $font-weight-normal, #8f8f8f);
      span {
        @include font-common(16px, $font-weight-bold);
      }
    }
  }
}

.dashboard_wrapper_title {
  @include font-common(16px);
  display: flex;
  margin-bottom: 20px;
}

.dashboard_wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.inquiry_table_dialog {
  padding: 0px 71px 77px 70px;
}
</style>
