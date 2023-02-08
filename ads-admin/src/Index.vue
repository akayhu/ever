<template>
  <Header />
  <article :class="articleClass">
    <el-config-provider :locale="locale">
      <router-view v-if="isRouterAlive" />
    </el-config-provider>
  </article>
  <Footer />
  <Dialog
    v-if="openErrorDialog"
    :showDialog="openErrorDialog"
    :closeFunc="closeFunc"
    :content="errorDialogContent"
    title="錯誤"
  />
</template>

<script>
import { ref, computed, defineComponent, nextTick, provide } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Dialog from "@/components/Dialog.vue";
import { EventBus } from "@/utils/eventBus.js";
import { ElConfigProvider } from "element-plus";
import zhTw from "element-plus/lib/locale/lang/zh-tw";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";

export default defineComponent({
  name: "index",
  components: {
    Header,
    Footer,
    Dialog,
    ElConfigProvider
  },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const getUserStatus = computed(() => user.value);
    const getRouterName = computed(() => route.name);
    const articleClass = computed(() => {
      return getUserStatus.value.type !== 0 &&
        (getRouterName.value === "Home" || getRouterName.value === "LoginHome")
        ? "login_home"
        : "";
    });
    let isRouterAlive = ref(true);
    let openErrorDialog = ref(false);
    let errorDialogContent = ref("");

    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => (isRouterAlive.value = true));
    };

    // 關閉 Dialog
    const closeFunc = () => {
      errorDialogContent.value = "";
      openErrorDialog.value = false;
    };

    provide("reload", reload);

    EventBus.on("openErrorDialog", resError => {
      errorDialogContent.value = resError.data.warning.desc;
      openErrorDialog.value = true;
    });

    return {
      isRouterAlive,
      openErrorDialog,
      errorDialogContent,
      articleClass,
      closeFunc,
      locale: zhTw
    };
  }
});
</script>

<style lang="scss">
@import "~scss/component/variables";

article {
  min-height: calc(100vh - 102px);
  min-width: 1200px;
  padding-top: 70px;

  &.login_home {
    background-color: #cfdee8;
    padding-top: 71px;
  }
}
</style>
