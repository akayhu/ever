<template>
  <div>
    <!-- 查詢版位 -->
    <SearchBoardBlock :changePropsDeviceNav="changeDeviceNav" />

    <div class="bottom_create_block">
      <button
        v-if="getUserAuthority.webSiteEdit"
        @click="createWeb"
        class="button_bg_white_large"
      >
        + 新增網站
      </button>
    </div>

    <!-- 網站維護 -->
    <WebsiteMaintenance
      :changeWebSiteList="changeWebSiteList"
      :changePropsSort="changeSort"
      :changePropsDeviceNav="changeDeviceNav"
      :deviceNav="getDeviceTag"
      :createWeb="createWeb"
      :openADCodeDialogFunc="handleOpenADCodeDialog"
    />

    <Dialog v-if="openCreateWebDialog" :showDialog="openCreateWebDialog">
      <h2>新增網站</h2>
      <table cellpadding="0" cellspacing="0" class="create_web_table">
        <tr>
          <td>載具<span class="necessary">*</span></td>
          <td>
            <label class="ad-radio-label">
              <input v-model="device" type="radio" name="device" value="PC" />
              <span class="ad-radio"></span>PC
            </label>
            <label class="ad-radio-label">
              <input v-model="device" type="radio" name="device" value="APP" />
              <span class="ad-radio"></span>APP
            </label>
            <label class="ad-radio-label">
              <input
                v-model="device"
                type="radio"
                name="device"
                value="MOBILE"
              />
              <span class="ad-radio"></span>Mobile
            </label>
          </td>
        </tr>
        <tr>
          <td>網站名稱<span class="necessary">*</span></td>
          <td>
            <input
              v-model="name"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: v$.name.$error }"
              widthType="480"
              placeholder="請填寫"
              @paste="filterValue($event, 'name')"
              @keydown="filterValue($event, 'name')"
            />
            <ValidationError
              :vData="v$.name"
              text="請填入網站名稱"
              maxLengthText="50"
            />
          </td>
        </tr>
        <tr>
          <td>網址</td>
          <td>
            <input
              v-model="url"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: v$.url.$error }"
              widthType="480"
              placeholder="請先輸入https://"
              @paste="filterValue($event, 'url')"
              @keydown="filterValue($event, 'url')"
            />
            <ValidationError :vData="v$.url" maxLengthText="100" />
          </td>
        </tr>
        <tr>
          <td>網站識別</td>
          <td>
            <input v-model="identify" widthType="480" placeholder="請填寫" />
          </td>
        </tr>
      </table>

      <div class="button_block">
        <button class="button_bg_white_large" @click="cancel">取消</button>
        <button class="button_bg_blue_large" @click="save">確定</button>
      </div>
    </Dialog>

    <Dialog
      v-if="openAddedDialog"
      :showDialog="openAddedDialog"
      :delayTime="true"
      :closeFunc="closeFunc"
      title="已新增網站。"
      content="您已完成新增網站。"
    />

    <Dialog
      v-if="openADCodeDialog"
      :showDialog="openADCodeDialog"
      :closeFunc="handlecloseADCodeDialog"
    >
      <div class="ad_code">
        <div class="top">
          <span class="title">廣告代碼</span>
          <span @click="handlecloseADCodeDialog">
            <img src="@/assets/icon/icon-delete-big.svg" />
          </span>
        </div>
        <div>
          <p>廣告原始碼文件網址</p>
          <div class="doc_link mb20">
            <a
              href="https://msc.adsmart.104-dev.com.tw/storybook/index.html"
              target="_blank"
              title="https://msc.adsmart.104-dev.com.tw/storybook/index.html"
              rel="noopener noreferrer"
            >
              https://msc.adsmart.104-dev.com.tw/storybook/index.html
            </a>
          </div>
        </div>
        <hr />
        <div>
          <p>代碼及型態</p>
          <textarea
            v-text="getAPPCode()"
            id="APPCode"
            readonly="readonly"
            class="mb20"
          ></textarea>
          <button @click="copyCode('APPCode')" class="button_bg_white_small">
            複製代碼
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, nextTick } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import WebsiteMaintenance from "@/components/webList/WebsiteMaintenance.vue";
import SearchBoardBlock from "@/components/webList/SearchBoardBlock.vue";
import Dialog from "@/components/Dialog.vue";
import ValidationError from "@/components/ValidationError.vue";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useSiteStore } from "@/storesPinia/site.js";

export default {
  name: "WebList",
  components: {
    Dialog,
    ValidationError,
    SearchBoardBlock,
    WebsiteMaintenance
  },
  validations: {
    name: { required, maxLength: maxLength(50) },
    url: { maxLength: maxLength(100) }
  },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const siteStore = useSiteStore();
    const { user } = storeToRefs(userStore);
    const { deviceTag } = storeToRefs(siteStore);
    const { postSite, postChangeDeviceTag, getSite } = siteStore;
    const getUserStatus = computed(() => user.value);
    const getWebListDeviceTag = computed(() => deviceTag.value || "PC");
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const getDeviceTag = computed(() => getWebListDeviceTag.value);
    const v$ = useVuelidate();
    const openCreateWebDialog = ref(false);
    const device = ref("PC");
    const name = ref("");
    const url = ref(null);
    const siteIdentify = ref(null);
    const channelIdentify = ref(null);
    const identify = ref(null);
    const status = ref(true);
    const sort = ref("status_desc");
    const openAddedDialog = ref(false);
    const openADCodeDialog = ref(false);
    const siteId = ref("");
    const channelId = ref("");
    const boardId = ref("");
    const typeId = ref("");

    // 新增網站
    const createWeb = () => {
      openCreateWebDialog.value = true;
    };

    // 新增網站確定
    const save = () => {
      const validation = v$.value;
      const patt = /^https?:\/\/.+/;
      validation.$touch();

      if (validation.name.$error || validation.url.$error) return;
      if (url.value) {
        if (url.value.search("http://") !== -1) {
          url.value = url.value.replace(/http/g, "https");
        } else if (!patt.test(url.value)) {
          url.value = `https://${url.value}`;
        }
      }

      const query = {
        device: device.value,
        name: name.value,
        url: url.value || null,
        status: status.value,
        identify: identify.value || null
      };

      postSite(query)
        .then(() => {
          openCreateWebDialog.value = false;
          changeWebSiteList();
          nextTick(() => {
            openAddedDialog.value = true;
          });
        })
        .catch(error => {
          console.log("error", error);
        });
    };

    // 新增網站取消
    const cancel = () => {
      v$.value.$reset();
      device.value = "PC";
      name.value = "";
      url.value = null;
      identify.value = null;
      openCreateWebDialog.value = false;
    };

    // 關閉 Dialog
    const closeFunc = () => {
      openAddedDialog.value = false;
    };

    // 變更狀態
    const changeSort = sortValue => {
      sort.value = sortValue;
    };

    // 變更 tab 值
    const changeDeviceNav = deviceNavValue => {
      postChangeDeviceTag(deviceNavValue);
    };

    // 取網站列表資料
    const changeWebSiteList = () => {
      const page = route.query.page || 1;
      const siteListQuery = {
        device: getDeviceTag.value,
        sort: sort.value,
        size: 20,
        page
      };
      getSite(siteListQuery);
    };

    // 打開廣告代碼 Dialog
    const handleOpenADCodeDialog = data => {
      siteId.value = data.siteId;
      channelId.value = data.channelId;
      boardId.value = data.id;
      typeId.value = data.typeId;
      siteIdentify.value = data.siteIdentify;
      channelIdentify.value = data.channelIdentify;
      identify.value = data.identify;
      openADCodeDialog.value = true;
    };

    // 關閉廣告代碼 Dialog
    const handlecloseADCodeDialog = () => {
      openADCodeDialog.value = false;
    };

    // 取得 APP 使用代碼
    const getAPPCode = () => {
      let text = `siteId: ${siteId.value}\nchannelId: ${channelId.value}\nboardId: ${boardId.value}\ntypeId: ${typeId.value}\nsiteIdentify: ${siteIdentify.value}\nchannelIdentify: ${channelIdentify.value}\nboardIdentify: ${identify.value}`;
      return text;
    };

    // 複製代碼
    const copyCode = domId => {
      var copyText = document.querySelector(`#${domId}`);
      copyText.select();
      document.execCommand("copy");
    };

    const filterValue = ($el, dataName) => {
      switch (dataName) {
        case "name":
          return (name.value = utilsFilterSpecifiedSymbols($el.target.value));
        case "url":
          return (url.value = utilsFilterSpecifiedSymbols($el.target.value));
        default:
          return;
      }
    };

    return {
      openCreateWebDialog,
      device,
      name,
      url,
      identify,
      status,
      sort,
      openAddedDialog,
      openADCodeDialog,
      siteId,
      channelId,
      boardId,
      typeId,
      getUserAuthority,
      getDeviceTag,
      createWeb,
      save,
      v$,
      cancel,
      closeFunc,
      changeSort,
      changeDeviceNav,
      changeWebSiteList,
      handleOpenADCodeDialog,
      handlecloseADCodeDialog,
      getAPPCode,
      copyCode,
      filterValue
    };
  }
};
</script>

<style lang="scss" scoped>
.bottom_create_block {
  margin: 24px 0;
  text-align: right;
}

.create_web_table {
  margin-top: 24px;
  display: inline-block;

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
  }
}

.button_block {
  text-align: center;
  margin-top: 32px;

  button {
    &:nth-child(1) {
      margin-right: 20px;
    }
  }
}

.ad_code {
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    .title {
      font-size: 24px;
      font-weight: bold;
      line-height: 1.33;
      letter-spacing: 1.5px;
      color: #333333;
    }

    img {
      cursor: pointer;
    }
  }

  p {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #000;
    margin-bottom: 10px;
  }

  textarea {
    width: 96%;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 0;
    color: #292929;
    padding: 12px;
    height: 150px;
  }

  .doc_link {
    margin-top: 11px;
    align-items: center;
    font-size: 16px;
    color: #292929;
    letter-spacing: 1.38px;

    img {
      margin-right: 4px;
    }
  }

  .mb20 {
    margin-bottom: 20px;
  }

  button {
    display: block;
    margin: 0 auto;
    font-size: 14px;
    width: 152px;
    margin-bottom: 10px;
  }

  hr {
    border: 1px solid #d6d6d6;
    margin: 30px 0;
  }
}
</style>
