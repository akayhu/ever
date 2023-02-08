<template>
  <section>
    <h2>{{ title }}</h2>

    <div class="user_data_block">
      <div>員編<span class="necessary">*</span></div>
      <div>
        <SelectDropdown
          @value-changed="setSelectedAccount($event)"
          :value="v$.accountName.$model"
          :options="searchedAccountOptions"
          :asncSearchCb="accountSearch"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          :class="{ error_message_border: v$.accountName.$error }"
          noDataText="查不到對應人員"
          placeholder="請輸入員編"
        />
        <ValidationError
          :vData="v$.accountName"
          text="請輸入員編"
          minLengthText="4"
        />
      </div>
      <div></div>
      <div v-if="logonId">帳號</div>
      <div v-if="logonId">{{ logonId }}</div>
      <div v-if="name">姓名</div>
      <div v-if="name">{{ name }}</div>
      <div v-show="$route.path !== '/useradd'">
        狀態<span class="necessary">*</span>
      </div>
      <div v-show="$route.path !== '/useradd'">
        <SwitchCheckbox :checked="status" @handleChange="handleChange" />
      </div>
    </div>

    <div class="job_category">
      <div class="title">職務類別<span class="necessary">*</span></div>
      <div class="job_category_wrapper">
        <div v-for="item in jobCategory" :key="item.value">
          <label class="ad-radio-label">
            <input
              v-model="role"
              @change="changeRole"
              type="radio"
              name="role"
              :value="item.value"
            />
            <span class="ad-radio"></span>{{ item.name }}
          </label>
        </div>
      </div>
    </div>

    <div class="business_settings">
      <div class="special_needs">
        <span>特殊需求：</span>
        <span>
          <input v-model="emergency" type="checkbox" id="emergency" />
          <label class="emergency-label" for="emergency">
            <span class="emergency"></span>緊急上下架
          </label>
        </span>
      </div>
    </div>

    <div class="published">
      <div class="title">
        可上刊的廣告素材版位：
        <span> <img src="@/assets/icon/icon-info-warmgray.svg" /> 可複選 </span>
      </div>
      <div class="device_title">
        <img src="@/assets/icon/icon-note.svg" /><span>PC</span>
      </div>
      <div v-if="sitePcMenu.length > 0" class="published_block">
        <div v-for="(item, index) in sitePcMenu" :key="item.id">
          <input
            v-model="allowedSite"
            :value="item.id"
            :id="`allowedPcSite_${index}`"
            type="checkbox"
          />
          <label :for="`allowedPcSite_${index}`">
            <span></span>{{ item.name }}
          </label>
        </div>
      </div>
      <div v-if="sitePcMenu.length < 1">無</div>

      <div class="device_title">
        <img src="@/assets/icon/icon-note.svg" /><span>APP</span>
      </div>
      <div v-if="siteAppMenu.length > 0" class="published_block">
        <div v-for="(item, index) in siteAppMenu" :key="item.id">
          <input
            v-model="allowedSite"
            :value="item.id"
            :id="`allowedAppSite_${index}`"
            type="checkbox"
          />
          <label :for="`allowedAppSite_${index}`">
            <span></span>{{ item.name }}
          </label>
        </div>
      </div>
      <div v-if="siteAppMenu.length < 1">無</div>

      <div class="device_title">
        <img src="@/assets/icon/icon-note.svg" /><span>Mobile</span>
      </div>
      <div v-if="siteMobileMenu.length > 0" class="published_block">
        <div v-for="(item, index) in siteMobileMenu" :key="item.id">
          <input
            v-model="allowedSite"
            :value="item.id"
            :id="`allowedMobileSite_${index}`"
            type="checkbox"
          />
          <label :for="`allowedMobileSite_${index}`">
            <span></span>{{ item.name }}
          </label>
        </div>
      </div>
      <div v-if="siteMobileMenu.length < 1">無</div>
    </div>

    <div class="button_block">
      <button @click="jump('/userinfo')" class="button_bg_white_large">
        取消
      </button>
      <button @click="send()" class="button_bg_blue_large">
        {{ isEdit ? "儲存" : "確定" }}
      </button>
    </div>

    <Dialog
      v-if="userEditStatus"
      :showDialog="userEditStatus ? true : false"
      :delayTime="true"
      :title="`${isEdit ? '已更動' : '已開啟'} ${logonId} 帳號使用權限。`"
      :content="`您已完成${isEdit ? '修改' : '開啟'} ${logonId} 帳號。`"
      jumpPath="/userinfo"
    />
  </section>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import Dialog from "@/components/Dialog.vue";
import useMixins from "@/mixins/useMixins.js";
import ValidationError from "@/components/ValidationError.vue";
import SelectDropdown from "@/components/SelectDropdown.vue";
import { encodeHandler } from "@/utils/keywordEncode";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import { storeToRefs } from "pinia";
import { useAccountStore } from "@/storesPinia/account.js";
import { useSiteStore } from "@/storesPinia/site.js";

export default defineComponent({
  name: "UserEdit",
  setup() {
    const route = useRoute();
    const { jump, jumpToFirstErr } = useMixins();

    const accountStore = useAccountStore();
    const siteStore = useSiteStore();
    const { postAccount, putAccountId, getPhoneUser } = accountStore;
    const { getSiteMenu } = siteStore;
    const { storeAccountId } = storeToRefs(accountStore);
    const accountIdData = computed(() => storeAccountId.value);

    let sitePcMenu = ref([]);
    let siteAppMenu = ref([]);
    let siteMobileMenu = ref([]);
    let accountName = ref("");
    let searchedAccountOptions = ref([]);
    let noAccountId = ref(false);
    let title = ref("");
    let isEdit = ref(false);
    let logonId = ref("");
    let accountId = ref("");
    let name = ref("");
    let status = ref(true);
    let role = ref("");
    let emergency = ref(false);
    let allowedSite = ref([]);
    let userEditStatus = ref(false);
    let jobCategory = ref([
      {
        name: "系統管理者",
        value: 1
      },
      {
        name: "產品管理企劃",
        value: 23
      },
      {
        name: "產品管理VM",
        value: 21
      },
      {
        name: "產品主管",
        value: 22
      },
      {
        name: "整召營運企劃",
        value: 12
      },
      {
        name: "整召業務銷售人員",
        value: 11
      },
      {
        name: "整召營運同仁",
        value: 13
      },
      {
        name: "整召主管",
        value: 14
      }
    ]);
    let v$ = useVuelidate();

    onMounted(() => {
      const routePath = route.path;
      if (routePath === "/useredit")
        status.value = accountIdData.value.status === 0 ? false : true;
      title.value = routePath === "/useradd" ? "新增會員" : "編輯會員狀態";
      isEdit.value = routePath === "/useradd" ? false : true;
      logonId.value = accountIdData.value.logonId || "";
      accountId.value = accountIdData.value.accountId || "";
      accountName.value = accountIdData.value.accountId
        ? `${accountIdData.value.accountId}(${accountIdData.value.name})`
        : "";
      name.value = accountIdData.value.name || "";
      emergency.value = accountIdData.value.emergency || false;
      role.value = `${accountIdData.value.role}` || "23";
      allowedSite.value = accountIdData.value.allowedSite || [];
    });

    // 選取員編
    const setSelectedAccount = data => {
      accountName.value = searchedAccountOptions.value.find(
        option => option.name === data.name
      ).label;
      logonId.value = data.account;
      name.value = data.name;
      accountId.value = data.id;
    };

    // 員編 AC
    const accountSearch = async queryStr => {
      if (!queryStr) return;
      const responseData = await getPhoneUser({
        queryStr: encodeHandler(queryStr)
      });
      searchedAccountOptions.value = [...responseData].map(item => {
        return {
          ...item,
          value: item.id,
          label: `${item.id}(${item.name})`
        };
      });
    };

    // 儲存確定操作後，更改 userEditMachine 狀態
    const send = () => {
      const routeQuery = route.query;
      const query = {
        accountId: accountId.value,
        allowedSite: allowedSite.value,
        emergency: emergency.value,
        logonId: logonId.value,
        name: name.value,
        role: Number(role.value),
        status: status.value ? 1 : 0
      };

      // 員編是否有填
      v$.value.$touch();
      if (v$.value.accountName.$error) {
        jumpToFirstErr();
        return;
      }
      // 修改
      if (routeQuery && routeQuery.accountId) {
        putAccountId(query).then(status => {
          if (status) userEditStatus.value = true;
        });
        return;
      }
      // 新增
      postAccount(query).then(status => {
        if (status) userEditStatus.value = true;
      });
    };

    // 選職務類別，系統管理者權限都打勾
    const changeRole = () => {
      allowedSite.value = [];

      // 非系統管理員
      if (role.value !== 1) {
        emergency.value = false;
        return;
      }
      // 統管理員
      emergency.value = true;
      [
        ...sitePcMenu.value,
        ...siteAppMenu.value,
        ...siteMobileMenu.value
      ].forEach(item => allowedSite.value.push(item.id));
    };

    const handleChange = val => {
      status.value = val;
    };

    watch(accountId, newVal => {
      if (!newVal) noAccountId.value = false;
    });

    const siteMenuQuery = {
      page: 1,
      size: 100,
      status: true
    };

    getSiteMenu({ device: "PC", ...siteMenuQuery }).then(res => {
      sitePcMenu.value = res.content;
    });

    getSiteMenu({ device: "APP", ...siteMenuQuery }).then(res => {
      siteAppMenu.value = res.content;
    });

    getSiteMenu({ device: "MOBILE", ...siteMenuQuery }).then(res => {
      siteMobileMenu.value = res.content;
    });

    return {
      title,
      accountName,
      accountId,
      searchedAccountOptions,
      logonId,
      name,
      status,
      role,
      emergency,
      sitePcMenu,
      allowedSite,
      siteAppMenu,
      siteMobileMenu,
      isEdit,
      userEditStatus,
      jobCategory,
      v$,
      setSelectedAccount,
      accountSearch,
      send,
      changeRole,
      handleChange,
      jump
    };
  },
  components: {
    Dialog,
    ValidationError,
    SelectDropdown,
    SwitchCheckbox
  },
  validations() {
    return {
      accountName: { required, minLength: minLength(4) }
    };
  }
});
</script>

<style lang="scss" scoped>
section {
  h2 {
    margin-bottom: 24px;
  }

  .user_data_block {
    display: grid;
    grid-template-columns: 70px 208px 38px 62px 160px 62px 122px;
    align-items: center;
    margin-bottom: 16px;

    > div {
      margin-bottom: 16px;
    }
  }

  .more_settings {
    text-align: right;
    color: #333;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1px;

    > span {
      cursor: pointer;
    }

    #more_span {
      .more_icon {
        margin-left: 8px;
        vertical-align: top;
      }
    }
  }

  .job_category {
    .title {
      font-weight: bold;
      margin-bottom: 24px;
      font-size: 18px;
    }

    &_wrapper {
      display: grid;
      grid-template-columns: 300px 300px 300px;
      margin-bottom: 24px;

      > div {
        margin-bottom: 16px;

        &:nth-child(7),
        &:nth-child(8) {
          margin-bottom: 0;
        }
      }
    }
  }

  .business_settings {
    margin-bottom: 24px;

    .special_needs {
      > span {
        &:nth-child(1) {
          font-size: 16px;
          line-height: 1.38;
          letter-spacing: 1px;
          color: #000;
          font-weight: bold;
          font-size: 18px;
        }
        &:nth-child(2) {
          margin-left: 6px;
          font-size: 18px;
        }
      }
    }
  }

  .published {
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1px;
    color: #000;

    .title {
      font-weight: bold;
      margin-bottom: 16px;
      font-size: 18px;
      display: inline-flex;
      align-items: center;

      span {
        color: #8f8f8f;
        font-weight: normal;
        display: inline-flex;
        align-items: center;

        img {
          margin: 0 10px 0 5px;
        }
      }
    }

    .device_title {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #00afb8;
      display: flex;
      align-items: center;
      margin: 8px 0 24px;

      &:first-child {
        margin-top: 0;
      }

      span {
        margin-left: 4px;
      }
    }

    .published_block {
      display: grid;
      grid-template-columns: 300px 300px 300px;

      > div {
        margin-bottom: 16px;

        label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          width: 280px;
        }
      }
    }
  }

  .button_block {
    margin-top: 80px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1.33px;

    button {
      &:nth-child(1) {
        margin-right: 20px;
      }
    }
  }

  .collapse_main {
    padding: 71px 29px;

    img {
      float: left;
      margin: -2px 16px 70px 0;
      width: 38px;
    }

    .collapse_main_title {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 1.5px;
      color: #333;
      margin-bottom: 15px;
    }

    .collapse_main_content {
      font-size: 16px;
      line-height: 1.38;
      letter-spacing: 1px;
      color: #8f8f8f;
      margin-bottom: 48px;
    }

    .collapse_main_button {
      text-align: center;

      button {
        &:first-child {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
