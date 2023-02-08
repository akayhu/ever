<template>
  <div>
    <section class="web_ad_edit_page_main" :class="{ focus: canEdit }">
      <div class="web_ad_edit_title">
        <h2>{{ title }}</h2>
        <div>
          <img
            v-if="!canEdit && getUserAuthority.webChannelEdit"
            @click="edieWeb"
            src="@/assets/icon/edit.svg"
            class="pointer"
          />
          <img
            v-if="channel.boardCount === 0 && getUserAuthority.webChannelEdit"
            @click="deleteChannel"
            src="@/assets/icon/delete.svg"
            class="pointer"
          />
          <img v-else src="@/assets/icon/delete-disable.svg" />
        </div>
      </div>

      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>載具</td>
          <td>
            <label class="ad-radio-label">
              <input
                v-model="site.device"
                type="radio"
                name="device"
                value="PC"
                disabled
              />
              <span class="ad-radio"></span>PC
            </label>
            <label class="ad-radio-label">
              <input
                v-model="site.device"
                type="radio"
                name="device"
                value="APP"
                disabled
              />
              <span class="ad-radio"></span>APP
            </label>
            <label class="ad-radio-label">
              <input
                v-model="site.device"
                type="radio"
                name="device"
                value="MOBILE"
                disabled
              />
              <span class="ad-radio"></span>Mobile
            </label>
          </td>
        </tr>
        <tr>
          <td>網站名稱</td>
          <td>
            <input
              v-model="site.name"
              widthType="480"
              placeholder="請填寫"
              disabled
            />
          </td>
        </tr>
        <tr>
          <td>
            頻道名稱
            <span
              v-if="canEdit && getUserAuthority.webChannelEdit"
              class="necessary"
            >
              *
            </span>
          </td>
          <td>
            <input
              v-model="v$.channel.channelName.$model"
              :disabled="!canEdit || !getUserAuthority.webChannelEdit"
              :class="{ error_message_border: v$.channel.channelName.$error }"
              widthType="480"
              placeholder="請填寫"
            />
            <ValidationError
              :vData="v$.channel.channelName"
              text="請填入頻道名稱"
              maxLengthText="50"
            />
          </td>
        </tr>
        <tr>
          <td>網址</td>
          <td>
            <input
              v-model="channel.url"
              widthType="480"
              placeholder="請先輸入https://"
              :disabled="!canEdit || !getUserAuthority.webChannelEdit"
            />
          </td>
        </tr>
        <tr>
          <td>
            尺寸
            <span
              v-if="canEdit && getUserAuthority.webChannelEdit"
              class="necessary"
            >
              *
            </span>
          </td>
          <td class="size">
            <input
              v-model="v$.channel.width.$model"
              :disabled="!canEdit || !getUserAuthority.webChannelEdit"
              :class="{ error_message_border: v$.channel.width.$error }"
              widthType="78"
              placeholder="請填寫"
            />
            <span>寬</span>
            <input
              v-model="v$.channel.height.$model"
              :disabled="!canEdit || !getUserAuthority.webChannelEdit"
              :class="{ error_message_border: v$.channel.height.$error }"
              widthType="78"
              placeholder="請填寫"
            />
            <span>高</span>
            <span>像素(px)</span>
            <ValidationError
              :vData="v$.channel.width || v$.channel.height"
              text="請填入寬高"
              maxLengthText="50"
            />
          </td>
        </tr>
        <tr>
          <td>
            延遲時間
            <span
              v-if="canEdit && getUserAuthority.webChannelEdit"
              class="necessary"
            >
              *
            </span>
          </td>
          <td class="millisecond">
            <input
              v-model="v$.channel.sleep.$model"
              :disabled="!canEdit || !getUserAuthority.webChannelEdit"
              :class="{ error_message_border: v$.channel.sleep.$error }"
              widthType="78"
              placeholder="請填寫"
            />
            <span>毫秒(ms)</span>
            <ValidationError
              :vData="v$.channel.sleep"
              text="請填入延遲時間"
              maxLengthText="50"
            />
          </td>
        </tr>
        <tr>
          <td>頻道識別</td>
          <td>
            <input
              v-model="channel.identify"
              :disabled="!canEdit || !getUserAuthority.webChannelEdit"
              widthType="480"
              placeholder="請填寫"
            />
          </td>
        </tr>
        <tr>
          <td>上線狀態</td>
          <td class="switch_checkbox_block">
            <SwitchCheckbox
              :checked="channel.status"
              :disabled="
                !canEdit ||
                !getUserAuthority.webChannelEdit ||
                !siteIdData.status
              "
              @handleChange="handleChange"
            />
            <span v-if="!siteIdData.status" class="website_offline">
              網站已下線，不可變更頻道狀態
            </span>
          </td>
        </tr>
      </table>

      <div
        v-if="canEdit && getUserAuthority.webChannelEdit"
        class="button_block"
      >
        <button
          @click="isBannerEdit ? cancel() : jump('/weblist')"
          class="button_bg_white_large"
        >
          取消
        </button>
        <button @click="saveChannel()" class="button_bg_blue_large">
          儲存
        </button>
      </div>
    </section>

    <Dialog v-if="openDeleteDialog" :showDialog="openDeleteDialog">
      <div class="dialog_title">
        <img src="@/assets/icon/icon-line.svg" /> 您要刪除頻道嗎?
      </div>
      <div class="dialog_annotation">確認頻道刪除狀態。</div>
      <div class="dialog_button_block">
        <button @click="handleCancel" class="button_bg_white_large">
          取消
        </button>
        <button @click="handleSaveDelete()" class="button_bg_blue_large">
          確定
        </button>
      </div>
    </Dialog>

    <Dialog
      v-if="openCompletedDeleteDialog"
      :showDialog="openCompletedDeleteDialog"
      :delayTime="true"
      :complete="true"
      :closeFunc="closeJumpFunc"
      :content="`您已刪除完成頻道。`"
      title="已刪除完成。"
    />

    <Dialog
      v-if="openCompletedCreateDialog"
      :showDialog="openCompletedCreateDialog"
      :delayTime="true"
      :closeFunc="closeFunc"
      :complete="true"
      :title="`已編輯完成。`"
      :content="`您已編輯完成頻道。`"
    />
  </div>
</template>

<script>
import { ref, onBeforeMount, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import useMixins from "@/mixins/useMixins.js";
import ValidationError from "@/components/ValidationError.vue";
import Dialog from "@/components/Dialog.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useChannelStore } from "@/storesPinia/channel.js";

export default {
  name: "ChannelContent",
  components: {
    ValidationError,
    SwitchCheckbox,
    Dialog
  },
  props: {
    siteIdData: {
      type: Object,
      required: true
    },
    channeIdData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const userStore = useUserStore();
    const channelStore = useChannelStore();
    const { user } = storeToRefs(userStore);
    const { deleteChannelId, patchChannel, getChannelId } = channelStore;
    const { jump } = useMixins();
    const v$ = useVuelidate();
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const getPath = computed(() => route.path);
    const title = ref("頻道內容");
    const site = ref({
      siteId: "",
      device: "",
      name: ""
    });
    const channel = ref({
      channelId: "",
      channelName: "",
      status: true,
      boardCount: "",
      url: null,
      width: "",
      height: "",
      sleep: "",
      identify: null
    });
    const canEdit = ref(false);
    const isBannerEdit = ref(false);
    const openCompletedCreateDialog = ref(false);
    const openDeleteDialog = ref(false);
    const openCompletedDeleteDialog = ref(false);

    onBeforeMount(() => {
      // 網站資訊
      site.value.device = props.siteIdData.device;
      site.value.name = props.siteIdData.name;
      site.value.siteId = props.channeIdData.siteId;
      // 頻道資訊
      channelInfo();

      switch (getPath.value) {
        case "/channeledit":
          canEdit.value = true;
          title.value = "編輯頻道";
          break;
        case "/banneredit":
        case "/banneradd":
          isBannerEdit.value = true;
          break;
      }
    });

    // 頻道初始化
    const channelInfo = () => {
      channel.value.status = props.channeIdData.status;
      channel.value.channelName = props.channeIdData.name;
      channel.value.channelId = props.channeIdData.id;
      channel.value.boardCount = props.channeIdData.boardCount || 0;
      channel.value.url = props.channeIdData.url;
      channel.value.width = props.channeIdData.width;
      channel.value.height = props.channeIdData.height;
      channel.value.sleep = props.channeIdData.sleep;
      channel.value.identify = props.channeIdData.identify;
    };

    // 編輯頻道內容
    const edieWeb = () => {
      canEdit.value = true;
    };

    // 刪除頻道內容 icon
    const deleteChannel = () => {
      openDeleteDialog.value = true;
    };

    // 刪除頻道
    const handleSaveDelete = () => {
      const siteId = site.value.siteId;
      const channelId = channel.value.channelId;
      deleteChannelId({
        siteId,
        channelId
      }).then(() => {
        closeDeleteDialog();
      });
    };

    // 關閉確認刪除 Dialog
    const closeDeleteDialog = () => {
      openDeleteDialog.value = false;
      nextTick(() => {
        openCompletedDeleteDialog.value = true;
      });
    };

    // 取消編輯
    const cancel = () => {
      channelInfo();
      canEdit.value = false;
    };

    // 取消刪除
    const handleCancel = () => {
      openDeleteDialog.value = false;
    };

    // 儲存頻道
    const saveChannel = () => {
      const patt = /^https?:\/\/.+/;
      const channelNameValidation = v$.value.channel.channelName;
      const widthValidation = v$.value.channel.width;
      const heightValidation = v$.value.channel.height;
      const sleepValidation = v$.value.channel.sleep;
      channelNameValidation.$touch();
      widthValidation.$touch();
      heightValidation.$touch();
      sleepValidation.$touch();

      if (
        channelNameValidation.$error ||
        widthValidation.$error ||
        heightValidation.$error ||
        sleepValidation.$error
      )
        return;

      if (channel.value.url) {
        if (channel.value.url.search("http://") !== -1) {
          channel.value.url = channel.value.url.replace(/http/g, "https");
        } else if (!patt.test(channel.value.url)) {
          channel.value.url = `https://${channel.value.url}`;
        }
      }

      const query = {
        siteId: site.value.siteId,
        id: channel.value.channelId,
        name: channel.value.channelName,
        status: channel.value.status,
        url: channel.value.url || null,
        width: channel.value.width,
        height: channel.value.height,
        sleep: channel.value.sleep,
        identify: channel.value.identify || null
      };

      patchChannel(query).then(() => {
        canEdit.value = false;
        openCreateDialog();
        // 讓在編輯時按取消可以得知正確的頻道名，再打一次取得單筆頻道 api
        getChannelId({
          siteId: site.value.siteId,
          channelId: channel.value.channelId
        });
      });
    };

    // 打開已完成 Dialog
    const openCreateDialog = () => {
      openCompletedCreateDialog.value = true;
    };

    // 關閉已確定 Dialog
    const closeFunc = () => {
      openCompletedCreateDialog.value = false;
      if (getPath.value === "/webedit" || getPath.value === "/channeledit")
        closeJumpFunc();
    };

    // 關閉已確定刪除後導頁
    const closeJumpFunc = () => {
      jump("/weblist");
    };

    // 變更上線狀態
    const handleChange = val => {
      channel.value.status = val;
    };

    return {
      getUserAuthority,
      title,
      site,
      channel,
      canEdit,
      isBannerEdit,
      openCompletedCreateDialog,
      openDeleteDialog,
      openCompletedDeleteDialog,
      edieWeb,
      deleteChannel,
      handleSaveDelete,
      closeDeleteDialog,
      cancel,
      handleCancel,
      saveChannel,
      openCreateDialog,
      closeFunc,
      handleChange,
      closeJumpFunc,
      v$,
      jump
    };
  },
  validations: {
    channel: {
      channelName: { required, maxLength: maxLength(50) },
      width: { required },
      height: { required },
      sleep: { required }
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  &.web_ad_edit_page_main {
    margin-bottom: 24px;

    .web_ad_edit_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      img {
        width: 35px;

        &.pointer {
          cursor: pointer;
        }

        &:last-child {
          margin-left: 20px;
        }
      }
    }

    table {
      width: 100%;

      tr {
        td {
          font-size: 18px;
          letter-spacing: 1px;
          color: #333;
          padding-bottom: 24px;

          &:nth-child(1) {
            width: 104px;
            font-weight: bold;
          }

          &.size {
            span {
              font-size: 14px;
              margin-left: 7px;

              &:nth-child(2) {
                margin-right: 16px;
              }
              &:nth-child(5) {
                color: #7e7e7e;
              }
            }
          }

          &.millisecond {
            span {
              font-size: 14px;
              margin-left: 7px;

              &:nth-child(2) {
                color: #7e7e7e;
              }
            }
          }

          label {
            margin-right: 16px;
          }

          .website_offline {
            font-size: 14px;
            color: #ea475b;
            font-weight: normal;
            margin-left: 10px;
          }

          &.switch_checkbox_block {
            vertical-align: bottom;
          }
        }

        &:last-child {
          td {
            padding-bottom: 0;
          }
        }
      }
    }

    .button_block {
      text-align: center;
      margin-top: 24px;

      button {
        &:nth-child(1) {
          margin-right: 20px;
        }
      }
    }
  }

  &.focus {
    border: solid 1px #00afb8;
  }
}

.dialog_title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #333;
  text-align: center;
  margin-top: 90px;

  img {
    vertical-align: text-top;
  }
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
