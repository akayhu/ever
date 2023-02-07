<template>
  <div
    class="about-main container-rwd rounded mx-auto mt-md-6 px-4 py-4 py-md-8 bg-white"
    v-once
  >
    <div class="about-main-content mx-auto">
      <div class="title text-center text-md-left t2 font-weight-bold mb-6">
        關於我們
      </div>
      <p>改善職場環境的初衷， 104 不曾忘記。</p>
      <p>
        人的一生平均會換七次工作，每一個工作經驗，你可能有許多故事值得分享；
        而每一次的求職經驗，你可能都需要透過各式平台，蒐集了許多資訊才能決定，
        於是 104 一直在想，身為人力銀行，我們可以怎麼做，職場環境會更好。
      </p>
      <p>
        這一次，我們建立了 104公司評論
        這個平台，一個讓所有人都能夠免費使用的網站，
        透過在職者和曾任職的員工心得分享，讓求職者可以更了解公司的真實樣貌；
        我們也期待，藉由這個平台能使台灣的職場產生正向改變，
        讓願意照顧員工的好企業，被更多求職者看見。
      </p>
      <p>
        104 希望每一位求職者都能夠找到合適的工作、進入彼此理念認同的公司。
        藉由每一個人的分享，我們就能產生更大的影響力，讓在職者的意見、
        求職者的疑慮、企業主的想法，有一個良性溝通的管道。
        期許這一股能量會轉化為改善的力量，鼓勵企業變得更好，
        也讓台灣的職場環境變得更好！
      </p>
      <p>
        在對職場失望之前，讓我們一起努力改變，<br />
        邀請你共同參與，讓職場變得更好的評論運動！
      </p>
      <div class="name">104 公司評論</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style lang="scss" scoped>
.about-main {
  &-content {
    max-width: 500px;
  }

  .title {
    color: #292929;
  }

  p {
    font-size: 16px;
    line-height: 1.75;
    color: #292929;
    font-weight: 400;
    margin-bottom: 30px;
    text-align: justify;
  }

  .name {
    font-size: 16px;
    color: #292929;
  }
}
</style>
