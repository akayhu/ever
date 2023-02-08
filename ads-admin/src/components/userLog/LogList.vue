<template>
  <section class="log_list_block">
    <div v-if="logListLoading" class="loading">
      <Loading />
    </div>

    <div v-if="logItems.length < 1 && !logListLoading" class="noSearch">
      無符合此筆資料
    </div>

    <div v-if="logItems.length > 0 && !logListLoading" class="log_items_title">
      <div>帳號</div>
      <div>姓名</div>
      <div>員編</div>
      <div>時間</div>
      <div class="box5">動作</div>
    </div>
    <div
      v-for="(item, index) in logItems"
      :key="item.id"
      :class="{ last: logItems.length - 1 === index }"
      class="log_items_content"
    >
      <div>{{ item.logonId }}</div>
      <div>{{ item.name }}</div>
      <div>{{ item.accountId }}</div>
      <div>{{ getTime(item.createDate) }}</div>
      <div v-html="item.description.replace(/\n/g, '<br>')"></div>
      <div>
        <span
          @click.prevent="getLogidCompare(item.keyId, item.id, item.logType)"
          >變更差異</span
        >
      </div>
      <div>
        <span @click.prevent="getLogidDataModel(index)">資料欄位</span>
      </div>
    </div>

    <Pages v-if="logItems.length > 0" :pageData="getLogData" path="userlog" />

    <Modal
      ref="contactDialog"
      @close="showContactDialog = false"
      :isShow="showContactDialog"
      title="變更差異"
    >
      <template #body>
        <div class="contact_modal_title">
          <span>修改前</span>
          <span>修改後</span>
        </div>
        <div
          v-if="
            (compareResultItem.onlyOnLeft &&
              compareResultItem.onlyOnLeft.length > 0) ||
            (compareResultItem.onlyOnRight &&
              compareResultItem.onlyOnRight.length > 0) ||
            (compareResultItem.differences &&
              compareResultItem.differences.length > 0)
          "
          class="contact_modal_body"
        >
          <template v-if="compareResultItem.onlyOnLeft.length > 0">
            <div
              v-for="(item, index) in compareResultItem.onlyOnLeft"
              :key="index"
              class="modal_body_content"
            >
              <div>
                <div class="obj_key">{{ item.property }}</div>
                <div class="obj_value">{{ item.value || "- -" }}</div>
              </div>
              <div>
                <div class="obj_key">{{ item.property }}</div>
                <div class="obj_value">- -</div>
              </div>
            </div>
          </template>
          <template v-if="compareResultItem.onlyOnRight.length > 0">
            <div
              v-for="(item, index) in compareResultItem.onlyOnRight"
              :key="index"
              class="modal_body_content"
            >
              <div>
                <div class="obj_key">{{ item.property }}</div>
                <div class="obj_value">- -</div>
              </div>
              <div>
                <div class="obj_key">{{ item.property }}</div>
                <div class="obj_value">{{ item.value || "- -" }}</div>
              </div>
            </div>
          </template>
          <template v-if="compareResultItem.differences.length > 0">
            <div
              v-for="(item, index) in compareResultItem.differences"
              :key="index"
              class="modal_body_content"
            >
              <div>
                <div class="obj_key">{{ item.property }}</div>
                <div class="obj_value">{{ item.before || "- -" }}</div>
              </div>
              <div>
                <div class="obj_key">{{ item.property }}</div>
                <div class="obj_value">{{ item.after || "- -" }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="noData()" class="contact_modal_no_data">無此筆資料！</div>
      </template>
    </Modal>

    <Modal
      ref="dataContactDialogRefs"
      @close="closeLogidDataModel"
      :isShow="dataContactDialog"
      title="資料欄位"
    >
      <template #button>
        <span v-if="copy" class="already_copy">已複製資料！</span>
        <button
          v-if="Object.keys(dataContent).length > 0"
          class="data_modal_copy_data"
          @click="getCopyData"
        >
          複製資料
        </button>
      </template>
      <template #body>
        <div class="data_modal_body">
          <template v-if="Object.keys(dataContent).length > 0">
            <div v-for="(value, name, index) in dataContent" :key="index">
              <span>{{ name }}</span>
              <span>{{ value }}</span>
            </div>
          </template>
          <div v-if="Object.keys(dataContent).length === 0" class="no_data">
            無此筆資料！
          </div>
        </div>
      </template>
    </Modal>
  </section>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import Loading from "@/components/Loading.vue";
import Pages from "@/components/Pages.vue";
import moment from "moment";
import Modal from "./Modal.vue";
import { storeToRefs } from "pinia";
import { useLogStore } from "@/storesPinia/log.js";

export default defineComponent({
  name: "LogList",
  components: {
    Loading,
    Pages,
    Modal
  },
  setup() {
    const logStore = useLogStore();
    const { logList, compareResult } = storeToRefs(logStore);
    const { getLogidCompareResult } = logStore;
    const getLogData = computed(() => logList.value);
    const logItems = computed(() => getLogData.value.content);
    const logListLoading = computed(() => getLogData.value.loading);
    const compareResultItem = computed(() => compareResult.value);
    const dataContactDialogRefs = ref(null);
    const contactDialog = ref(null);
    let showContactDialog = ref(false);
    let dataContactDialog = ref(false);
    let copy = ref(false);
    let dataContent = ref({});

    // 取得時間
    const getTime = createdDate => {
      return moment(createdDate).format("YYYY/MM/DD HH:mm:ss");
    };

    // 打開變更差異
    const getLogidCompare = async (keyId, logId, logType) => {
      await getLogidCompareResult({
        keyId,
        logId,
        logType
      });
      showContactDialog.value = true;
      contactDialog.value.openModal();
    };

    // 開資料欄位
    const getLogidDataModel = index => {
      dataContent.value = {};
      dataContent.value = { ...JSON.parse(logItems.value[index].model) };
      dataContactDialog.value = true;
      dataContactDialogRefs.value.openModal();
    };

    // 關閉資料欄位
    const closeLogidDataModel = () => {
      dataContactDialog.value = false;
      copy.value = false;
    };

    // 複製資料
    const getCopyData = () => {
      const el = document.createElement("textarea");
      el.value = JSON.stringify(dataContent.value);
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      copy.value = true;
      setTimeout(() => {
        copy.value = false;
      }, 3000);
    };

    // 沒資料
    const noData = () =>
      (compareResultItem.value.onlyOnLeft === null &&
        compareResultItem.value.onlyOnRight === null &&
        compareResultItem.value.differences === null) ||
      (compareResultItem.value.onlyOnLeft &&
        compareResultItem.value.onlyOnLeft.length < 1 &&
        compareResultItem.value.onlyOnRight &&
        compareResultItem.value.onlyOnRight.length < 1 &&
        compareResultItem.value.differences &&
        compareResultItem.value.differences.length < 1);

    return {
      contactDialog,
      showContactDialog,
      dataContactDialog,
      getLogData,
      copy,
      dataContent,
      logItems,
      logListLoading,
      compareResultItem,
      getTime,
      getLogidCompare,
      getLogidDataModel,
      closeLogidDataModel,
      getCopyData,
      noData,
      dataContactDialogRefs
    };
  }
});
</script>

<style lang="scss" scoped>
.log_list_block {
  margin-top: 24px;

  .loading,
  .noSearch {
    text-align: center;
    color: #a9a9a9;
    font-size: 20px;
    margin: 150px 0;
  }

  .log_items {
    &_title,
    &_content {
      display: grid;
      grid-template-columns: 216px 100px 86px 262px 347px 85px 85px;

      div {
        border-bottom: 1px solid #eee;
        display: inline-flex;
        align-items: center;
        letter-spacing: 1px;
        padding: 14px 0 14px 12px;
        line-height: 1.38;

        span {
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          line-height: 1.43;
          letter-spacing: 1.43px;
          color: #0e66c7;
        }
      }
    }
    &_title {
      div {
        font-weight: bold;

        &.box5 {
          grid-column-start: 5;
          grid-column-end: 8;
        }
      }
    }
    &_content {
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
}

.contact_modal_title {
  display: flex;
  justify-content: space-between;

  span {
    display: inline-flex;
    align-items: flex-end;
    width: 370px;
    border-bottom: 1px solid #ddd;
    height: 22px;
    padding-bottom: 12px;
    font-size: 16px;
    font-weight: bold;
  }
}

.contact_modal_body {
  border-bottom: 1px solid #ddd;

  .modal_body_content {
    display: flex;
    justify-content: space-between;

    > div {
      padding: 12px;
      width: 346px;
      font-size: 16px;
      line-height: 1.38;
      letter-spacing: 1.38px;

      .obj_key {
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
        word-wrap: break-word;
        word-break: break-all;
      }

      .obj_value {
        color: #00afb8;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.contact_modal_no_data {
  text-align: center;
  color: #ea475b;
  font-size: 14px;
  padding: 125px 0;
}

.already_copy {
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  letter-spacing: 1.43px;
  color: #a9a9a9;
  margin-right: 8px;
}

.data_modal_copy_data {
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  line-height: 1.43;
  letter-spacing: 1.43px;
  border: solid 1px #00afb8;
  background-color: #fff;
  padding: 6px 14px;
  color: #00afb8;
  margin-right: 24px;
}

.data_modal_body {
  div {
    padding: 11px 12px;
    display: flex;
    border-top: 1px solid #ddd;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #333;

    &.no_data {
      justify-content: center;
      color: #ea475b;
      font-size: 14px;
      padding: 125px 0;
    }

    &:last-child {
      border-bottom: 1px solid #ddd;
    }

    span {
      display: inline-block;
      word-wrap: break-word;
      word-break: break-all;

      &:nth-child(1) {
        width: 152px;
        margin-right: 24px;
      }
      &:nth-child(2) {
        width: 452px;
      }
    }
  }
}
</style>
