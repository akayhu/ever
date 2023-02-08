<template>
  <div>
    <!-- 網站內容 -->
    <SiteContent />

    <!-- 新增頻道 -->
    <section v-if="isChanneladd">
      <h2>{{ channelTitle }}</h2>
      <div
        v-for="(item, index) in requestChannelList"
        :key="item.id"
        class="web_abb_table_main"
      >
        <div class="web_abb_table">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>頻道名稱<span class="necessary">*</span></td>
              <td>
                <input
                  v-model="item.name"
                  v-filterSpecifiedSymbols
                  :class="{
                    error_message_border:
                      v$.requestChannelList.$error &&
                      v$.requestChannelList.$each.$response.$data[index].name
                        .$error
                  }"
                  widthType="480"
                  placeholder="請填寫"
                  @paste="filterValue($event, 'name', index)"
                  @keydown="filterValue($event, 'name', index)"
                />
                <ValidationError
                  v-if="
                    v$.requestChannelList.$error &&
                    v$.requestChannelList.$each.$response.$data[index].name
                      .$error
                  "
                  :vData="
                    v$.requestChannelList.$each.$response.$data[index].name
                  "
                  text="請填入頻道名稱"
                  maxLengthText="50"
                />
              </td>
            </tr>
            <tr>
              <td>網址</td>
              <td>
                <input
                  v-model="item.url"
                  widthType="480"
                  placeholder="請先輸入https://"
                />
              </td>
            </tr>
            <tr>
              <td>尺寸<span class="necessary">*</span></td>
              <td class="size">
                <input
                  v-model="item.width"
                  :class="{
                    error_message_border:
                      v$.requestChannelList.$error &&
                      v$.requestChannelList.$each.$response.$data[index].width
                        .$error
                  }"
                  widthType="78"
                  placeholder="請填寫"
                />
                <span>寬</span>
                <input
                  v-model="item.height"
                  :class="{
                    error_message_border:
                      v$.requestChannelList.$error &&
                      v$.requestChannelList.$each.$response.$data[index].height
                        .$error
                  }"
                  widthType="78"
                  placeholder="請填寫"
                />
                <span>高</span>
                <span>像素(px)</span>
                <ValidationError
                  v-if="
                    v$.requestChannelList.$error &&
                    (v$.requestChannelList.$each.$response.$data[index].width
                      .$error ||
                      v$.requestChannelList.$each.$response.$data[index].height
                        .$error)
                  "
                  :vData="
                    v$.requestChannelList.$each.$response.$data[index].width ||
                    v$.requestChannelList.$each.$response.$data[index].height
                  "
                  text="請填入寬高"
                />
              </td>
            </tr>
            <tr>
              <td>延遲時間<span class="necessary">*</span></td>
              <td class="millisecond">
                <input
                  v-model="item.sleep"
                  :class="{
                    error_message_border:
                      v$.requestChannelList.$error &&
                      v$.requestChannelList.$each.$response.$data[index].sleep
                        .$error
                  }"
                  widthType="78"
                  placeholder="請填寫"
                />
                <span>毫秒(ms)</span>
                <ValidationError
                  v-if="
                    v$.requestChannelList.$error &&
                    v$.requestChannelList.$each.$response.$data[index].sleep
                      .$error
                  "
                  :vData="
                    v$.requestChannelList.$each.$response.$data[index].sleep
                  "
                  text="請填入延遲時間"
                />
              </td>
            </tr>
            <tr>
              <td>頻道識別</td>
              <td>
                <input
                  v-model="item.identify"
                  widthType="480"
                  placeholder="請填寫"
                />
              </td>
            </tr>
            <tr>
              <td>上線狀態</td>
              <td>
                <SwitchCheckbox
                  :checked="item.status"
                  @handleChange="handleChange($event, index)"
                />
              </td>
            </tr>
          </table>
        </div>
        <div class="web_abb_block">
          <span
            v-if="requestChannelList.length > 1"
            @click="deleteWebPage(item.id)"
            :data="item.id"
          >
            ×
          </span>
          <span
            v-if="requestChannelList.length === index + 1"
            @click="creatWebPage(Number(item.id + 1))"
            :data="item.id + 1"
          >
            +
          </span>
        </div>
      </div>

      <div class="button_block">
        <button @click="jump('/weblist')" class="button_bg_white_large">
          取消
        </button>
        <button @click="saveChannel()" class="button_bg_blue_large">
          {{ $route.path === "/channeladd" ? "確定" : "儲存" }}
        </button>
      </div>
    </section>

    <Dialog
      v-if="openCompletedCreateDialog"
      :showDialog="openCompletedCreateDialog"
      :delayTime="true"
      :closeFunc="closeFunc"
      :complete="true"
      title="已新增完成。"
      content="您已新增完成頻道。"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers, required, maxLength } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import useMixins from "@/mixins/useMixins.js";
import SiteContent from "@/components/webPageEdit/SiteContent.vue";
import Dialog from "@/components/Dialog.vue";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";
import ValidationError from "@/components/ValidationError.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import { useChannelStore } from "@/storesPinia/channel.js";

export default {
  name: "WebEdit",
  components: {
    SiteContent,
    ValidationError,
    SwitchCheckbox,
    Dialog
  },
  setup() {
    const route = useRoute();
    const channelStore = useChannelStore();
    const { postChannel } = channelStore;
    const { jump } = useMixins();
    const v$ = useVuelidate();
    const isChanneladd = ref(false);
    const channelTitle = ref("新增頻道");
    const openCompletedCreateDialog = ref(false);
    const site = ref({ siteId: "" });
    const requestChannelList = ref([
      {
        id: 0,
        siteId: route.query.siteId ? Number(route.query.siteId) : "",
        name: "",
        status: true,
        url: null,
        width: "",
        height: "",
        identify: null,
        sleep: ""
      }
    ]);

    onMounted(() => {
      site.value.siteId = Number(route.query.siteId);
      switch (route.path) {
        case "/channeladd":
          isChanneladd.value = true;
          break;
        case "/channeledit":
          isChanneladd.value = true;
          channelTitle.value = "編輯頻道";
          break;
      }
    });

    // 新增頻道列表
    const creatWebPage = id => {
      requestChannelList.value.push({
        id,
        siteId: site.value.siteId,
        name: "",
        status: true,
        url: null,
        width: "",
        height: "",
        identify: null,
        sleep: ""
      });
    };

    // 刪除頻道列表
    const deleteWebPage = id => {
      requestChannelList.value = requestChannelList.value.filter(
        e => id !== e.id
      );
    };

    // 關閉已確定刪除後導頁
    const closeJumpFunc = () => {
      jump("/weblist");
    };

    // 關閉已確定刪除 Dialog
    const closeFunc = () => {
      const routePath = route.path;
      openCompletedCreateDialog.value = false;
      if (routePath === "/webedit" || routePath === "/channeladd") {
        closeJumpFunc();
      }
    };

    // 儲存頻道列表
    const saveChannel = () => {
      const patt = /^https?:\/\/.+/;
      const validation = v$.value.requestChannelList;
      validation.$touch();

      requestChannelList.value.forEach((item, index) => {
        if (!item.url) requestChannelList.value[index].url = null;
        if (item.url) {
          if (item.url.search("http://") !== -1) {
            requestChannelList.value[index].url = item.url.replace(
              /http/g,
              "https"
            );
          } else if (!patt.test(item.url)) {
            requestChannelList.value[index].url = `https://${item.url}`;
          }
        }

        // 若是新增，不用帶 id key 值
        if (!route.query.hasOwnProperty("id"))
          delete requestChannelList.value[index].id;
      });

      if (!validation.$error) {
        postChannel(requestChannelList.value).then(() => {
          openCompletedCreateDialog.value = true;
        });
      }
    };

    // 過濾指定符號與 emoji 表情
    const filterValue = ($el, dataName, index) => {
      return (requestChannelList.value[index][dataName] =
        utilsFilterSpecifiedSymbols($el.target.value));
    };

    // 變更頻道上線狀態
    const handleChange = (val, index) => {
      requestChannelList.value[index].status = val;
    };

    return {
      isChanneladd,
      channelTitle,
      requestChannelList,
      openCompletedCreateDialog,
      creatWebPage,
      deleteWebPage,
      closeJumpFunc,
      closeFunc,
      saveChannel,
      v$,
      filterValue,
      handleChange,
      jump
    };
  },
  validations: {
    requestChannelList: {
      $each: helpers.forEach({
        name: {
          required,
          maxLength: maxLength(50)
        },
        width: { required },
        height: { required },
        sleep: { required }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  background-color: #fff;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  padding: 23px 50px 33px;
  clear: both;
  margin-bottom: 20px;

  h2 {
    margin-bottom: 30px;
  }

  .web_abb_table_main {
    margin-bottom: 24px;

    .web_abb_table {
      border-bottom: solid 1px #d6d6d6;

      table {
        td {
          font-size: 18px;
          letter-spacing: 1px;
          color: #333;
          padding-bottom: 20px;

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
            font-weight: initial;
          }
        }
      }
    }

    .web_abb_block {
      text-align: right;
      padding-top: 9px;

      span {
        width: 26px;
        height: 26px;
        border: solid 1px #eee;
        background-color: #fff;
        display: inline-flex;
        justify-content: center;
        line-height: 1.3;
        font-size: 22px;
        letter-spacing: 0.78px;
        color: #7e7e7e;
        cursor: pointer;

        &:last-child {
          margin-left: 10px;
        }
      }
    }
  }

  .button_block {
    text-align: center;

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
