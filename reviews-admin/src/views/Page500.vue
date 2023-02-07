<template>
  <div class="error-block">
    <div>
      <img src="@/assets/error-500.png" />
    </div>
    <div class="error-content">
      <div>QQ… 網頁暫時壞掉了～</div>
      <p>
        請稍等我們把它修好，或透過
        <a :href="get104Url()" rel="noopener noreferrer">
          意見回饋
        </a>
        反映。
      </p>
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
  name: "Page500",
  methods: {
    get104Url() {
      return `${process.env.VUE_APP_104_URL}question_admin/reaction.cfm`;
    }
  }
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

      a {
        font-weight: bold;
        color: #1654b9;
      }
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
