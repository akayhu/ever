<template>
  <div
    class="questions-main container-rwd rounded mx-auto mt-md-6 px-4 py-4 py-md-8 bg-white"
    v-once
  >
    <div class="questions-main-content mx-auto">
      <div class="title text-center text-md-left t2 font-weight-bold mb-6">
        常見問答
      </div>
      <div class="questions-list t3">
        <div class="questions-term mb-6">
          <div class="questions-title font-weight-bold" data-sort="1.">
            我發表的評論是匿名的嗎？
          </div>
          <div class="questions-ans">
            您在 104公司評論
            上分享的所有資訊皆完全匿名！企業主也看不到是誰留下評論的喔！
          </div>
        </div>
        <div class="questions-term mb-6">
          <div class="questions-title font-weight-bold" data-sort="2.">
            分享後可以修改嗎？
          </div>
          <div class="questions-ans">
            為維護資料的真實、完整性，用戶送出評論後將無法自行修改內容。
          </div>
        </div>
        <div class="questions-term mb-6">
          <div class="questions-title font-weight-bold" data-sort="3.">
            為什麼我只能評論我曾經任職過的公司？
          </div>
          <div class="questions-ans">
            為確保評論真實性，您只能評論
            <a
              :href="`https:${getPdaUrl}my104/resume/manage/index`"
              target="_blank"
              rel="noopener noreferrer"
              title="104履歷表"
            >
              104履歷表
            </a>
            中曾經任職或者在職的公司。請確認您在履歷表經歷的公司名稱，務必和公司在
            <a
              href="https://findbiz.nat.gov.tw/fts/query/QueryBar/queryInit.do"
              target="_blank"
              rel="noopener noreferrer"
              title="經濟部商業司"
            >
              經濟部商業司
            </a>
            登記之名稱完全相同，才能在評論時選取該公司喔！
          </div>
        </div>
        <div class="questions-term mb-6">
          <div class="questions-title font-weight-bold" data-sort="4.">
            我提供的評論、投票等內容會出現在哪裡？
          </div>
          <div class="questions-ans">
            您上傳的內容經客服審核通過後，將會發布在
            104公司評論服務中，供其他求職者查詢；
            您的個資完全匿名，不會公開呈現。職稱和薪資等資訊須經過您同意公開，才會呈現在評論頁面中。
          </div>
        </div>
        <div class="questions-term mb-6">
          <div class="questions-title font-weight-bold" data-sort="5.">
            為什麼我發表的內容，沒有出現在公司評論的頁面上？
          </div>
          <div class="questions-ans">
            每間公司在收集到足夠評論份數後，才會顯示所有審核通過的評論；
            每一筆公司評論都會由104客服專人審核，審核的結果我們皆會發信通知您；
            若您的評論內容不夠充分或完整，導致未通過審核，該則內容不會出現在公司評論中。
          </div>
        </div>
        <div class="questions-term mb-6">
          <div class="questions-title font-weight-bold" data-sort="6.">
            為什麼我無法針對同一間公司評論兩次？
          </div>
          <div class="questions-ans">
            為避免大量評論針對單一公司，導致分數失真、評論不夠客觀，
            同一會員於90天內無法針對同一間公司進行重複評論。
          </div>
        </div>
      </div>
      <div class="contact t3 font-weight-bold">
        若有其他問題或合作事宜，歡迎來信
        <a href="mailto:reviews@104.com.tw">reviews@104.com.tw</a> 詢問
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Questions",
  computed: {
    getPdaUrl() {
      return process.env.VUE_APP_PDA_URL;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.questions-main {
  &-content {
    max-width: 500px;
  }

  .title {
    color: #292929;
  }

  .questions-term {
    color: #292929;

    .questions-title {
      display: flex;
      &::before {
        content: attr(data-sort);
        display: block;
        margin-right: 8px;
      }
    }

    .questions-ans {
      margin-left: 22px;
    }
  }

  .contact {
    color: #292929;
  }

  a {
    color: #1654b9;
    font-weight: bold;
    &:hover {
      color: #4e91ff;
    }
  }
}
</style>
