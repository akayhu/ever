<template>
  <nav
    class="body-left"
    :style="{
      backgroundImage: `url(${require('@/assets/sidebar-5.jpg')})`
    }"
  >
    <div class="aside">
      <div>
        <router-link to="/review_list">評論審核</router-link>
      </div>
      <div>
        <router-link to="/review_vote">投票審核</router-link>
      </div>
      <div>
        <router-link to="/review_complain">申訴審核</router-link>
      </div>
      <hr />
      <div>
        <router-link to="/search_review">評論查詢</router-link>
      </div>
      <div>
        <router-link to="/search_vote">投票查詢</router-link>
      </div>
      <hr />
      <div>
        <router-link to="/company_off">公司下架</router-link>
      </div>
      <hr />
      <div>
        <router-link to="/log">審核紀錄</router-link>
      </div>
      <div>
        <router-link to="/account">帳號權限</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Aside"
};
</script>

<style lang="scss" scoped>
.body-left {
  width: 260px;
  margin-right: 45px;
  height: 570px;
  background-size: cover;
  background-position: center center;
  color: #fff;
  border-radius: 10px;

  .aside {
    border-radius: 10px;
    height: 555px;
    padding-top: 15px;
    background: #ffa534;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0, #ffa534),
      color-stop(100%, rgba(236, 22, 87, 0.7))
    );
    background: -webkit-linear-gradient(top, #ffa534, rgba(236, 22, 87, 0.7));
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#ffa534),
      to(rgba(236, 22, 87, 0.7))
    );
    background: linear-gradient(180deg, #ffa534 0, rgba(236, 22, 87, 0.7));
    background-size: 150% 150%;

    div {
      height: 50px;
      margin-bottom: 15px;
    }

    a {
      color: #fff;
      display: block;
      text-align: center;
      font-size: 22px;
      width: 230px;
      height: 20px;
      padding: 15px;
      outline: none;

      &:hover {
        background: rgba(255, 255, 255, 0.23);
      }
    }

    hr {
      width: 70%;
    }
  }
}
</style>
