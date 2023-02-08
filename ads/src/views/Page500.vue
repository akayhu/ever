<template>
  <div class="wrapper_main_500">
    <div>
      <img src="@/assets/error_500.svg" />
    </div>
    <div class="wrapper_main_content">
      <div class="title">網頁暫時壞掉了</div>
      <p>
        抱歉！網頁暫時出狀況，請您稍後再試
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page500"
};
</script>

<style lang="scss" scoped>
.wrapper_main_500 {
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
  }
}
</style>
