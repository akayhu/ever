<template>
  <div>
    <section :class="{ focus: canEdit }">
      <div class="web_edit_title">
        <h2>{{ title }}</h2>
        <div>
          <img
            v-if="!canEdit && getUserAuthority.webSiteEdit"
            @click="edieWeb"
            src="@/assets/icon/edit.svg"
            class="pointer"
          />
          <img
            v-if="!site.channelCount && getUserAuthority.webSiteEdit"
            @click="deleteSite"
            src="@/assets/icon/delete.svg"
            class="pointer"
          />
          <img v-else src="@/assets/icon/delete-disable.svg" />
        </div>
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            載具
            <span
              v-if="canEdit && getUserAuthority.webSiteEdit"
              class="necessary"
            >
              *
            </span>
          </td>
          <td>
            <label class="ad-radio-label">
              <input
                v-model="site.device"
                :disabled="!canEdit || !getUserAuthority.webSiteEdit"
                type="radio"
                name="device"
                value="PC"
              />
              <span class="ad-radio"></span>PC
            </label>
            <label class="ad-radio-label">
              <input
                v-model="site.device"
                :disabled="!canEdit || !getUserAuthority.webSiteEdit"
                type="radio"
                name="device"
                value="APP"
              />
              <span class="ad-radio"></span>APP
            </label>
            <label class="ad-radio-label">
              <input
                v-model="site.device"
                :disabled="!canEdit || !getUserAuthority.webSiteEdit"
                type="radio"
                name="device"
                value="MOBILE"
              />
              <span class="ad-radio"></span>Mobile
            </label>
          </td>
        </tr>
        <tr>
          <td>
            網站名稱
            <span
              v-if="canEdit && getUserAuthority.webSiteEdit"
              class="necessary"
            >
              *
            </span>
          </td>
          <td>
            <input
              v-model="site.name"
              v-filterSpecifiedSymbols
              :disabled="!canEdit || !getUserAuthority.webSiteEdit"
              :class="{ error_message_border: v$.site.name.$error }"
              widthType="480"
              placeholder="請填寫"
              @paste="filterValue($event, 'name')"
              @keydown="filterValue($event, 'name')"
            />
            <ValidationError
              :vData="v$.site.name"
              text="請填入網站名稱"
              maxLengthText="50"
            />
          </td>
        </tr>
        <tr>
          <td>網址</td>
          <td>
            <input
              v-model="site.url"
              v-filterSpecifiedSymbols
              :disabled="!canEdit || !getUserAuthority.webSiteEdit"
              :class="{ error_message_border: v$.site.url.$error }"
              widthType="480"
              placeholder="請先輸入https://"
              @paste="filterValue($event, 'url')"
              @keydown="filterValue($event, 'url')"
            />
            <ValidationError :vData="v$.site.url" maxLengthText="100" />
          </td>
        </tr>
        <tr>
          <td>網站識別</td>
          <td>
            <input
              v-model="site.identify"
              :disabled="!canEdit || !getUserAuthority.webSiteEdit"
              widthType="480"
              placeholder="請填寫"
            />
          </td>
        </tr>
        <tr>
          <td>
            上線狀態
            <span
              v-if="canEdit && getUserAuthority.webSiteEdit"
              class="necessary"
            >
              *
            </span>
          </td>
          <td class="switch_checkbox_block">
            <SwitchCheckbox
              :checked="site.status"
              :disabled="!canEdit || !getUserAuthority.webSiteEdit"
              @handleChange="handleChange"
            />
          </td>
        </tr>
      </table>

      <div v-if="canEdit && getUserAuthority.webSiteEdit" class="button_block">
        <button
          @click="isChanneladd ? cancelSiteEdit() : jump('/weblist')"
          class="button_bg_white_large"
        >
          取消
        </button>
        <button @click="saveSiteEdit()" class="button_bg_blue_large">
          儲存
        </button>
      </div>
    </section>

    <Dialog v-if="openDeleteDialog" :showDialog="openDeleteDialog">
      <div class="dialog_title">
        <img src="@/assets/icon/icon-line.svg" /> 您要刪除網站嗎?
      </div>
      <div class="dialog_annotation">確認網站刪除狀態。</div>
      <div class="dialog_button_block">
        <button @click="handleCancel" class="button_bg_white_large">
          取消
        </button>
        <button @click="handleSaveDeleteSiteId" class="button_bg_blue_large">
          確定
        </button>
      </div>
    </Dialog>

    <Dialog
      v-if="openCompletedDeleteDialog"
      :showDialog="openCompletedDeleteDialog"
      :delayTime="true"
      :closeFunc="closeJumpFunc"
      :complete="true"
      title="已刪除完成。"
      content="您已刪除完成網站。"
    />

    <Dialog
      v-if="openCompletedCreateDialog"
      :showDialog="openCompletedCreateDialog"
      :delayTime="true"
      :closeFunc="closeFunc"
      :complete="true"
      :title="`已編輯完成。`"
      :content="`您已編輯完成網站。`"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import useMixins from "@/mixins/useMixins.js";
import { required, maxLength } from "@vuelidate/validators";
import Dialog from "@/components/Dialog.vue";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import ValidationError from "@/components/ValidationError.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useSiteStore } from "@/storesPinia/site.js";

export default {
  name: "SiteContent",
  components: {
    SwitchCheckbox,
    Dialog,
    ValidationError
  },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const siteStore = useSiteStore();
    const { user } = storeToRefs(userStore);
    const { siteId } = storeToRefs(siteStore);
    const { patchSite, getSiteId, deleteSiteId } = siteStore;
    const v$ = useVuelidate();
    const { jump } = useMixins();
    const getUserStatus = computed(() => user.value);
    const siteIdData = computed(() => siteId.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const site = ref({
      siteId: "",
      device: "",
      name: "",
      url: null,
      identify: null,
      status: true,
      channelCount: ""
    });
    const title = ref("編輯網站");
    const canEdit = ref(false);
    const isChanneladd = ref(false);
    const openCompletedDeleteDialog = ref(false);
    const openDeleteDialog = ref(false);
    const openCompletedCreateDialog = ref(false);

    onMounted(() => {
      site.value.siteId = Number(route.query.siteId);
      site.value.channelCount = siteIdData.value.channelCount;
      resetSite();

      switch (route.path) {
        case "/webedit":
          title.value = "編輯網站";
          canEdit.value = true;
          break;
        case "/channeladd":
        case "/channeledit":
          title.value = "網站內容";
          isChanneladd.value = true;
          canEdit.value = false;
          break;
      }
    });

    // 編輯網站內容 icon
    const edieWeb = () => {
      canEdit.value = true;
    };

    // 刪除網站內容 icon
    const deleteSite = () => {
      openDeleteDialog.value = true;
    };

    // 還原網站資料
    const resetSite = () => {
      site.value.name = siteIdData.value.name;
      site.value.device = siteIdData.value.device;
      site.value.url = siteIdData.value.url;
      site.value.status = siteIdData.value.status;
      site.value.identify = siteIdData.value.identify;
    };

    // 取消編輯網站
    const cancelSiteEdit = () => {
      resetSite();
      canEdit.value = false;
    };

    // 儲存編輯網站
    const saveSiteEdit = () => {
      const patt = /^https?:\/\/.+/;
      const validation = v$.value.site;
      validation.$touch();

      if (validation.name.$error || validation.url.$error) return;
      if (site.value.url) {
        if (site.value.url.search("http://") !== -1) {
          site.value.url = site.value.url.replace(/http/g, "https");
        } else if (!patt.test(site.value.url)) {
          site.value.url = `https://${site.value.url}`;
        }
      }

      const query = {
        device: site.value.device,
        id: site.value.siteId,
        name: site.value.name,
        status: site.value.status,
        url: site.value.url || null,
        identify: site.value.identify || null
      };

      patchSite(query)
        .then(() => {
          openCompletedCreateDialog.value = true;
          // 讓在編輯時按取消可以得知正確的網站名，再打一次取得單筆網站 api
          getSiteId({ siteId: site.value.siteId });
          if (route.path === "/channeladd") canEdit.value = false;
        })
        .catch(() => {
          if (!site.value.status) site.value.status = true;
        });
    };

    // 關閉已確定刪除 Dialog
    const closeFunc = () => {
      const routePath = route.path;
      openCompletedCreateDialog.value = false;
      if (routePath === "/webedit" || routePath === "/channeladd")
        closeJumpFunc();
    };

    // 取消刪除
    const handleCancel = () => {
      openDeleteDialog.value = false;
    };

    // 確認刪除
    const handleSaveDeleteSiteId = () => {
      deleteSiteId({ siteId: site.value.siteId }).then(() => {
        openDeleteDialog.value = false;
        nextTick(() => {
          openCompletedDeleteDialog.value = true;
        });
      });
    };

    // 關閉已確定刪除後導頁
    const closeJumpFunc = () => {
      jump("/weblist");
    };

    // 過濾指定符號與 emoji 表情
    const filterValue = ($el, dataName) =>
      (site.value[dataName] = utilsFilterSpecifiedSymbols($el.target.value));

    // 上線狀態
    const handleChange = val => {
      site.value.status = val;
    };

    return {
      getUserAuthority,
      site,
      title,
      canEdit,
      isChanneladd,
      openCompletedDeleteDialog,
      openDeleteDialog,
      openCompletedCreateDialog,
      edieWeb,
      deleteSite,
      cancelSiteEdit,
      saveSiteEdit,
      closeFunc,
      handleCancel,
      handleSaveDeleteSiteId,
      closeJumpFunc,
      jump,
      v$,
      filterValue,
      handleChange
    };
  },
  validations: {
    site: {
      name: { required, maxLength: maxLength(50) },
      url: { maxLength: maxLength(100) }
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  margin-bottom: 24px;

  &.focus {
    border: solid 1px #00afb8;
  }

  .web_edit_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    > div {
      text-align: right;

      img {
        width: 35px;
        height: 35px;

        &.pointer {
          cursor: pointer;
        }

        &:last-child {
          margin-left: 20px;
        }
      }
    }
  }

  table {
    tr {
      td {
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 1px;
        color: #333;
        padding-bottom: 24px;

        &:nth-child(1) {
          width: 104px;
        }

        label {
          margin-right: 16px;
          font-weight: initial;
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
