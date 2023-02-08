<template>
  <div class="wrapper_main_503">
    <div>
      <img src="@/assets/error_503.svg" />
    </div>
    <div class="wrapper_main_content">
      <div class="title">網站維護中</div>
      <p>
        親愛的用戶您好：<br />
        為提供更優質的網站∕系統服務，網站處理內部更新作業中，將暫停網站服務，造成不便，敬請見諒；
        若作業提前完成，也會提前恢復所有服務；在此感謝您的諒解與配合。<br /><br /><br />
        <!-- 維護時間：<br />
        3/17(六) 00:30am ~ 15:00pm<br /> -->
        如有需要改善的地方，請聯絡管理員：1244陳頤萱、3059徐文達
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page503"
};
</script>

<style lang="scss" scoped>
.wrapper_main_503 {
  width: 1278px;
  height: 438px;
  margin: 30px auto 0;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper_main_content {
    margin-left: 55px;
    width: 457px;

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
    }
  }
}
</style>
