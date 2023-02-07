<template>
  <div class="error-block">
    <div>
      <img src="@/assets/error-404.png" />
    </div>
    <div class="error-content">
      <div>QQ… 找不到任何頁面</div>
      <p>你要找的評論或公司不存在～</p>
      <router-link to="/">
        <button>
          回公司評論後台首頁
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page404"
};
</script>

<style lang="scss" scoped>
.error-block {
  background: #fff;
  width: 734px;
  margin: 24px auto 0;
  display: flex;
  justify-content: flex-start;
  padding: 146px 233px;

  .error-content {
    margin-left: 64px;
    padding-top: 40px;

    div {
      font-size: 20px;
      color: #292929;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    p {
      color: #7e7e7e;
      line-height: 1.43;
      font-weight: 400;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .error-button {
      font-size: 14px;
      padding: 6px 13px;
      height: 32px;
      width: 130px;
    }

    button {
      font-size: 14px;
      padding: 6px 13px;
      height: 32px;
      width: 160px;
      color: #ff7800;
      border-color: #ff7800;
      border-radius: 0.25rem;
      background-color: #fff;
    }
  }
}
</style>
