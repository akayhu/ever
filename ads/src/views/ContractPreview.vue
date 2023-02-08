<template>
  <section>
    <div class="renderPdfMain">
      <div class="header">
        <div>
          <img :src="logoSrc" />
        </div>
        <div>{{ title }}</div>
        <div>
          <span>聯絡人：{{ quotationData.salesInfo.name }}</span>
          <span>聯絡電話：(02)29126104</span>
          <span>分機：{{ quotationData.salesExtension }}</span>
        </div>
      </div>

      <table cellpadding="0" cellspacing="0" border="1">
        <tr>
          <th rowspan="4">委<br />託<br />公<br />司</th>
          <td>公司名稱</td>
          <td colspan="3">{{ quotationData.customerName }}</td>
          <td>委託單號</td>
          <td colspan="2">{{ quotationData.id }}</td>
        </tr>
        <tr>
          <td>案件名稱</td>
          <td colspan="3">{{ quotationData.name }}</td>
          <td>案件期間</td>
          <td colspan="2">
            {{
              `${quotationData.orderExecutionStartDate} ~ ${quotationData.orderExecutionEndDate}`
            }}
          </td>
        </tr>
        <tr>
          <td>聯絡人</td>
          <td colspan="3">{{ quotationData.companyContact }}</td>
          <td>職稱</td>
          <td colspan="2">{{ quotationData.companyContactJobTitle }}</td>
        </tr>
        <tr>
          <td>電話/傳真</td>
          <td colspan="3">{{ telephoneFax }}</td>
          <td>E-mail</td>
          <td colspan="2">{{ quotationData.companyContactEmail }}</td>
        </tr>

        <tr>
          <th rowspan="7">開<br />據<br />內<br />容</th>
          <td>發票抬頭</td>
          <td colspan="3">{{ quotationData.invoiceTitle }}</td>
          <td>統一編號</td>
          <td colspan="2">{{ quotationData.invoice }}</td>
        </tr>
        <tr>
          <td>通訊地址</td>
          <td colspan="3">{{ quotationData.invoicePaperRecipientAddress }}</td>
          <td rowspan="2">發票收件人</td>
          <td rowspan="2" colspan="2">
            {{ quotationData.invoiceRecipientName }}
          </td>
        </tr>
        <tr>
          <td>發票收件 E-mail</td>
          <td colspan="3">{{ quotationData.invoiceRecipientEmail }}</td>
        </tr>
        <tr>
          <td rowspan="2">發票資訊</td>
          <td>發票聯式</td>
          <td class="textAlignLeft">
            {{ quotationData.invoicePaperType === 2 ? "二聯" : "三聯" }}
          </td>
          <td>發票日期</td>
          <td class="textAlignLeft">
            {{
              quotationData.invoiceSendNote
                ? "分期開立"
                : quotationData.invoiceSendDate
            }}
          </td>
          <td>金額</td>
          <td>NT$ {{ quotationData.totalPriceIncludeTax }}</td>
        </tr>
        <tr>
          <td>發票品名</td>
          <td class="textAlignLeft">網路廣告費</td>
          <td>發票期數</td>
          <td
            v-html="quotationData.invoiceSendNote || '單期'"
            class="textAlignLeft"
            style="white-space: pre-line;"
            colspan="3"
          />
        </tr>
        <tr>
          <td>付款方式</td>
          <td class="textAlignLeft" colspan="5">
            <div>
              {{ quotationData.paymentMethod === 2 ? "■" : "□" }} 支票
              戶名：一零四資訊科技股份有限公司
            </div>
            <div>
              {{ quotationData.paymentMethod === 1 ? "■" : "□" }}
              使用電匯或ATM，匯款帳號：兆豐國際商業銀行(新店分行) 046-09-01210-4
            </div>
            <div>
              {{ quotationData.paymentMethod === 3 ? "■" : "□" }} 信用卡
            </div>
          </td>
          <td>
            簽約後不立即開發票，發票開立後，{{
              paymentTermsType[quotationData.paymentTerms]
            }}
          </td>
        </tr>
        <tr>
          <td>合約金額</td>
          <td>NT$ {{ quotationData.totalPrice }}</td>
          <td colspan="2">營業稅</td>
          <td class="textAlignLeft">
            NT$ {{ quotationData.totalPrice * 0.05 }}
          </td>
          <td>含稅總額</td>
          <td class="textAlignLeft">
            NT$ {{ quotationData.totalPriceIncludeTax }}
          </td>
        </tr>

        <tr>
          <th>委<br />託<br />同<br />意<br />事<br />項</th>
          <td class="consent_matters_td textAlignLeft" colspan="7">
            <ul>
              <li v-for="item in entrustedMatters" :key="item.index">
                {{ item.content }}
              </li>
            </ul>
          </td>
        </tr>

        <tr>
          <th rowspan="2">說<br />明</th>
          <td class="textAlignLeft" colspan="7">
            說明：此為本月專案優惠價，僅限一次使用。刊登素材請於上刊前3日交付確認。
          </td>
        </tr>
        <tr>
          <td colspan="7">
            <table
              cellpadding="0"
              cellspacing="0"
              border="1"
              class="illustrate_table"
            >
              <tbody v-for="project in projectGroups" :key="project.id">
                <tr>
                  <th
                    class="illustrate_table_title"
                    :rowspan="
                      project.bannerContent.length +
                        project.otherContent.length +
                        2
                    "
                  >
                    {{ project.name }}
                  </th>
                  <th>no</th>
                  <th>載具</th>
                  <th>頻道</th>
                  <th>名稱</th>
                  <th>輪播數</th>
                  <th>預估<br />曝光/週</th>
                  <th>預估<br />點擊/週</th>
                  <th>預估<br />點擊率</th>
                  <th>單價(未稅)</th>
                  <th>數量</th>
                  <th>單位</th>
                  <th>總價</th>
                  <th>優惠價(未稅)</th>
                </tr>
                <tr
                  v-for="(banner, rowIndex) in project.bannerContent"
                  :key="rowIndex"
                >
                  <td>{{ rowIndex + 1 }}</td>
                  <td>{{ banner.device }}</td>
                  <td>{{ banner.channel }}</td>
                  <td>{{ banner.name }}</td>
                  <td>{{ banner.rotate }}</td>
                  <td>{{ banner.impression }}</td>
                  <td>{{ banner.click }}</td>
                  <td>{{ banner.ratio }}</td>
                  <td>{{ banner.unitPrice }}</td>
                  <td>{{ banner.quantity }}</td>
                  <td>{{ banner.unit }}</td>
                  <td>{{ banner.price }}</td>
                  <td
                    class="illustrate_table_price"
                    v-if="rowIndex === 0"
                    :rowspan="project.bannerContent.length"
                  >
                    {{ project.bannerPrice }}
                  </td>
                </tr>
                <template v-if="project.otherContent.length > 0">
                  <tr>
                    <th>no</th>
                    <th>項目</th>
                    <th colspan="6">內容</th>
                    <th>單價(未稅)</th>
                    <th>數量</th>
                    <th>單位</th>
                    <th>總價</th>
                    <th>優惠價(未稅)</th>
                  </tr>
                  <tr
                    v-for="(otherProduct, index) in project.otherContent"
                    :key="otherProduct.id"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ otherProduct.name }}</td>
                    <td
                      colspan="6"
                      v-html="convertToParagraph(otherProduct.content)"
                    ></td>
                    <td>{{ otherProduct.unitPrice }}</td>
                    <td>{{ otherProduct.quantity }}</td>
                    <td>{{ otherProduct.unit }}</td>
                    <td>{{ otherProduct.price }}</td>
                    <td class="illustrate_table_price">
                      {{ otherProduct.discountPrice }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div class="price_grid">
              <div>原價(含稅)</div>
              <div>{{ totalMarketPrice.toLocaleString() }}</div>
              <div>成交價(含稅)</div>
              <div>{{ totalPrice.toLocaleString() }}</div>
              <div>折扣</div>
              <div>{{ round((totalPrice / totalMarketPrice) * 100, 0) }}%</div>
            </div>
          </td>
        </tr>

        <tr>
          <th rowspan="2">
            <span>委<br />託<br />單<br />位</span>
          </th>
          <td
            class="entrusting_company_requester textAlignLeft"
            colspan="5"
            rowspan="2"
          >
            <p>
              承辦人即授權簽約人茲保證確有代理委託公司簽訂本委託單之權限，並於簽訂前已詳閱並接受本委託單之約定內容。若委託公司有修改者，需經本公司書面同意後，始發生效力。
            </p>

            <div class="signature_block">
              <div class="sign">※承辦人即授權簽約人中文正楷親簽：</div>
              <div class="bottom_line"></div>
            </div>

            <div class="department_block">
              <div class="mr-12 content">
                <span class="mr-16">
                  部門： {{ quotationData.companyContactDepartment }}
                </span>
                職稱： {{ quotationData.companyContactJobTitle }}<br />
                <span class="stamp">※請蓋章</span>
                (委託公司及負責人章或發票章/部門章)
              </div>
              <div><img src="@/assets/print.png" /></div>
            </div>
          </td>
          <td class="company_name" rowspan="2">
            {{
              `一零四${
                quotationData.account104 === 4 ? "管理顧問" : "資訊科技"
              }股份有限公司`
            }}
          </td>
          <td>經辦人</td>
        </tr>
        <tr>
          <td class="textAlignLeft">
            <div>聯絡人：{{ quotationData.salesInfo.name }}</div>
            <div>聯絡電話：29126104 #{{ quotationData.salesExtension }}</div>
            <div>E-mail：{{ quotationData.salesEmail }}</div>
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, toRefs } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useRoute } from "@/router/useRouter.js";
import {
  paymentTermsType,
  usePreview
} from "@/composables/quotation/usePreview";
import {
  projectOrderData,
  projectOrderVipData,
  consultantData
} from "@/utils/contractContent.js";
import html2pdf from "html2pdf.js";
import { round } from "@/utils/quotation";

const { route } = useRoute();
const salesOrderStore = useSalesOrderStore();
const { quotationData } = toRefs(salesOrderStore);
const { projectGroups, totalMarketPrice, totalPrice } = usePreview();
const logoSrc = ref(require("@/assets/104logo_o_180x26.svg"));
const title = ref("整合性行銷專案委託單");
const type = ref(1);
const entrustedMatters = ref(projectOrderData);
const telephoneFax = ref("");

onMounted(async () => {
  quotationData.value.account104 === 4
    ? (logoSrc.value = require("@/assets/logo_104.png"))
    : (logoSrc.value = require("@/assets/104logo_o_180x26.svg"));

  if (route.query?.type) {
    type.value = route.query.type;
    const entrustedMattersType = {
      1: projectOrderData,
      2: projectOrderVipData,
      4: consultantData
    };
    entrustedMatters.value =
      entrustedMattersType[route.query.type] || entrustedMattersType[1];

    const titleType = {
      1: "整合性行銷專案委託單",
      2: "整合性行銷專案委託單(VIP)",
      4: "一零四管理顧問股份有限公司整合性行銷專案委託單"
    };
    title.value = titleType[route.query.type] || titleType[1];
  }

  if (quotationData.value.companyPhone && quotationData.value.companyFax) {
    telephoneFax.value = `${quotationData.value.companyPhone}/${quotationData.value.companyFax}`;
  } else if (quotationData.value.companyPhone) {
    telephoneFax.value = quotationData.value.companyPhone;
  } else if (quotationData.value.companyFax) {
    telephoneFax.value = quotationData.value.companyFax;
  }

  if (route.query.download === "1") {
    let body = document.body;
    let html = document.documentElement;
    let width = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    );
    let widthCM = width / 35.35;
    var element = document.querySelector("section");
    var opt = {
      margin: [1, 0],
      filename: "pdf_file.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 192,
        letterRendering: true
      },
      jsPDF: {
        orientation: "landscape",
        unit: "cm",
        format: [widthCM, 40]
      },
      pagebreak: {
        mode: ["css"],
        after: [".page_break"],
        avoid: ["img", "p", "div", "span"]
      }
    };
    const doc = await html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get("pdf");
    doc.save();
  }
});

const convertToParagraph = content => {
  return "<p>" + (content ? content.replace(/\n/g, "</p>\n<p>") : "") + "</p>";
};
</script>

<style lang="scss" scoped>
section {
  width: 1280px;
  // margin: 30px auto 80px;
  margin: auto;
  border: none;

  .renderPdfMain {
    width: 1178px;

    ::v-deep p {
      margin-bottom: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      > div {
        &:nth-child(2) {
          color: #339;
          font-weight: bold;
          font-size: 16px;
          margin-left: 24px;
        }
        &:nth-child(3) {
          span {
            font-size: 14px;
            margin-right: 20px;
            color: #339;

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }

    table {
      width: 100%;
      border: 1px solid;
      letter-spacing: 1px;
      line-height: 1.5;
      page-break-inside: auto;

      tr {
        th {
          border-right: 1px solid;
          border-bottom: 1px solid;
          vertical-align: middle;
          text-align: center;
          min-width: 36px;
          padding: 7px 0;
        }

        td {
          border-right: 1px solid;
          border-bottom: 1px solid;
          vertical-align: middle;
          text-align: center;
          height: 36px;
          font-size: 14px;
          padding: 7px 0;

          .illustrate_table {
            width: 95%;
            margin: 0px auto;

            th {
              background-color: #fffd54;

              &:nth-child(2) {
                width: 20px;
              }
              &:nth-child(4) {
                width: 150px;
              }
              &:nth-child(5) {
                width: 170px;
              }
              &:nth-child(6) {
                width: 65px;
              }
              &:nth-child(7) {
                width: 100px;
              }
              &:nth-child(8) {
                width: 100px;
              }
              &:nth-child(9) {
                width: 100px;
              }
              &:nth-child(10) {
                width: 120px;
              }
              &:nth-child(11) {
                width: 50px;
              }
              &:nth-child(12) {
                width: 50px;
              }
              &:nth-child(14) {
                width: 120px;
              }
            }

            td {
              text-align: left;
              padding: 12px;
              color: #eb3323;
              white-space: pre-wrap;

              ul {
                list-style-type: decimal;
                margin: 0 0 0 24px;
                line-height: 1.5;
              }
            }

            .illustrate_table_title,
            .illustrate_table_price {
              background-color: #94b3de;
            }
          }

          .price_grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            width: 200px;
            margin-left: auto;
            margin-right: 24px;
            margin-top: 12px;
            text-align: right;
          }

          &.textAlignLeft {
            text-align: left;
            padding: 7px 0 7px 20px;
          }

          &.consent_matters_td {
            border-bottom: 1px solid;
            padding: 20px;

            ul {
              list-style-type: decimal;
              font-size: 14px;
              margin: 0 0 0 24px;

              li {
                padding-left: 1rem;
              }
            }
          }

          &.entrusting_company_requester {
            border-right: 1px solid;
            font-size: 14px;
            padding: 8px;

            .signature_block {
              display: flex;
              text-align: left;
              margin: 12px 0;

              .sign {
                color: #0066cc;
                padding-right: 32px;
              }

              .bottom_line {
                border-bottom: 1px solid #000;
                width: 300px;
              }
            }

            .department_block {
              display: flex;
              text-align: left;
              margin: 12px 0;

              .content {
                line-height: 2.5;
              }

              .stamp {
                color: #0066cc;
              }
            }
          }

          &.company_name {
            padding: 0 12px;
          }
        }
      }
    }
  }
}
</style>
