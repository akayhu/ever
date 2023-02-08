<template>
  <div class="wrapper_main_404">
    <div>
      <img src="@/assets/error_404.svg" />
    </div>
    <div class="wrapper_main_content">
      <div class="title">找不到任何頁面</div>
      <p>
        抱歉！您要找的頁面已不存在
      </p>
      <div class="button_block">
        <button class="button_bg_white_error" @click="jump('/')">
          回廣告平台首頁
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "Page404",
  mixins: [commonMixins]
};
</script>

<style lang="scss" scoped>
.wrapper_main_404 {
  width: 1280px;
  height: 440px;
  margin: 30px auto 0;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper_main_content {
    margin-left: 55px;
    width: 405px;

    .title {
      font-size: 20px;
      line-height: 1.4;
      letter-spacing: 1.4px;
      color: #292929;
      margin-bottom: 16px;
    }

    p {
      font-size: 14px;
      line-height: 1.57;
      letter-spacing: 1.21px;
      color: #8f8f8f;
      margin-bottom: 0;
    }

    .button_block {
      margin-top: 20px;
    }
  }
}
</style>
