# 104fp-f2e-ads

[![Node version](https://img.shields.io/badge/node-%3E%3D10.15.0-brightgreen.svg)](http://nodejs.org/)
[![Vue CLI version](https://img.shields.io/badge/Vue%20CLI-%3E%3D4.1.0-brightgreen.svg)](https://cli.vuejs.org/)

104廣告平台前台

## Ads Document
更多相關說明文件可至 [Wiki](https://github.com/104corp/104fp-f2e-ads/wiki)

## 協作支援 

- 網站 ( [lab](https://adsmart.104-dev.com.tw) | [staging](https://adsmart.104-staging.com.tw) | [production](https://adsmart.104.com.tw) )
- 後台專案 ( [104fp-f2e-ads-admin](https://github.com/104corp/104fp-f2e-ads-admin) )
- 元件專案 ( [104fp-f2e-ads-components](https://github.com/104corp/104fp-f2e-ads-components) )
- 相關文件 ( [phase 1 企劃規格書](https://32l6xw.axshare.com/)(84598349) | [phase 1.5 企劃規格書](https://hd66x2.axshare.com/) | [Wireframe](https://zpl.io/adNK5d7) | [Guideline](https://zpl.io/bWnDPnj) | [使用者權限](https://104cloud.sharepoint.com/:x:/s/104pjdocs2/EQzjHf5-fzRGiuKiN-SQWL8BdQZCzLo6-5Fco5ZcWQ_dyw?e=yqPkeY) )
- Jira ( [Scrum Board](http://jira.104.com.tw/secure/RapidBoard.jspa?rapidView=197&view=planning.nodetail&quickFilter=1870&epics=visible&issueLimit=100&selectedEpic=BIGC-3774) )
- API 文件
  - RESTful ( [Swagger UI](https://be.adsmart.104-dev.com.tw/swagger-ui.html) )
- Slack
  - 部署狀態 ( [#adsmart-deploy](https://app.slack.com/client/T0675A0CX/C010D355SHZ) )
  - 開發團隊 ( [#ad_platform](https://app.slack.com/client/T0675A0CX/GMK94K1NC)，Private )

## 專案建置流程

新增本機開發的網域
```
For Windows -
C:\WINDOWS\system32\drivers\etc  打開 host 檔案

For Mac -
sudo vim /etc/hosts

# 新增下面這行到 /etc/hosts
127.0.0.1       local.adsmart.104-dev.com.tw
```

運行開發環境
```
yarn install
yarn serve
```

precommit 前處理

> 由於使用 [yorkie](https://github.com/yyx990803/yorkie)、[lint-staged](https://www.npmjs.com/package/lint-staged) 處理 precommit 行為，每個 編輯檔案後存擋 前都會執行 **程式碼排版**。

## Package Script 說明

程式碼打包，個別檔案的用途請參考 [vue-cli 官方說明](https://cli.vuejs.org/zh/guide/cli-service.html#%E4%BD%BF%E7%94%A8%E5%91%BD%E4%BB%A4)

```bash
npm run build
```

## CI 上線流程
參考 wiki [上線流程](https://github.com/104corp/104fp-f2e-ads/wiki#ci-%E4%B8%8A%E7%B7%9A%E6%B5%81%E7%A8%8B)

## 開發細節

- UI
  - [element-ui](https://element.eleme.io/#/zh-CN)
- Core / Library
  - [vue/cli@4.1.0](https://cli.vuejs.org/)
  - [vuex](https://vuex.vuejs.org/)
  - [lodash](https://lodash.com/)
  - [moment](https://momentjs.com/)
  - [v-tooltip](https://akryum.github.io/v-tooltip/#/)
- RESTful API
  - [axios](https://github.com/axios/axios)

### 目錄結構說明

| 資料夾 / 檔案 | 說明 |
| --- | --- |
| `public` | 靜態資源 |
| `src/apis` | API管理及封裝 |
| `src/assets` | 圖庫 |
| `src/components` | 元件庫 |
| `src/directive` | 自定義指令 |
| `src/middleware` | 中介層 |
| `src/mixins` | 共用 methods |
| `src/mockData` | 假資料 |
| `src/plugin` | 廣告元件預覽層 |
| `src/router` | Router 路由配置 |
| `src/scss` | scss |
| `src/store` | 儲存庫 & 狀態管理 |
| `src/utils` | js 相關共用檔 |
| `src/views` | containers |
| `tests` | 單元測試 |