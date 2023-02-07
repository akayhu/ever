# 104fp-f2e-cprofile

[![Node version](https://img.shields.io/badge/node-%3E%3D8.10.0-brightgreen.svg)](http://nodejs.org/) [![Build Status](https://travis-ci.com/104corp/104fp-f2e-cprofile.svg?token=EftGb2fH8NzrFRgmV3zn&branch=master)](https://travis-ci.com/104corp/104fp-f2e-cprofile)

104個人檔案，公司內簡稱為 Plus(原 myBrand 與 104職涯社群) 專案。

## 協作資源

- 網站 ( [lab](https://plus.104-dev.com.tw) | [staging](https://plus.104-staging.com.tw) | [production](https://plus.104.com.tw) )
- 元件 Demo 文件 ( [lab](https://plus.104-dev.com.tw/reference/index.html) | [staging](https://plus.104-staging.com.tw/reference/index.html) )
- [Icon Font Demo](https://plus.104-dev.com.tw/reference/icon/demo.html)
- [Plus(原 C Profile) 執行文件 & E2E 測試](https://github.com/104corp/104fp-cprofile-doc)
- BDD E2E Test 報告 ( [lab](https://s3-ap-northeast-1.amazonaws.com/104fp-cprofile-end2end-test-report/index.html) )
- Jira ( [Scrum Board](http://jira.104.com.tw/secure/RapidBoard.jspa?rapidView=197&view=planning&selectedIssue=BIGC-3306&quickFilter=1870&epics=visible&selectedEpic=BIGC-2810) | [SOC 單](http://jira.104.com.tw/browse/SOC-3560?filter=13446) | [ITPM 上線單](http://jira.104.com.tw/browse/ITPMCPLUSREQ-916?filter=13448) )
- Trello ( [Sprint Board](https://trello.com/b/oenxoFJa/cprofile-sprint-board) )
- UI 設計稿 ( [Zeplin](https://app.zeplin.io/project/5ac34c2cd8098ae531b0c6a8) )
- 測試案例 ( [test case](https://104tcm.testrail.net/index.php?/suites/view/418&group_by=cases:section_id&group_order=asc) | [test run](https://104tcm.testrail.net/index.php?/runs/view/2210&group_by=cases:section_id&group_order=asc&group_id=14000) )
- API 文件
  - RESTful ( [lab](https://c1.plus.104-dev.com.tw/swagger-ui.html#) | [staging](https://c1.plus.104-staging.com.tw/swagger-ui.html#) | [production](https://c1.plus.104.com.tw/swagger-ui.html#) )
  - GraphQL ( [lab](https://c1.plus.104-dev.com.tw/ajax/graphql) | [staging](https://c1.plus.104-staging.com.tw/ajax/graphql) | [production](https://c1.plus.104.com.tw/ajax/graphql) )
    > 請先安裝 Chrome 擴充套件 [ChromeiQL](https://chrome.google.com/webstore/detail/chromeiql/fkkiamalmpiidkljmicmjfbieiclmeij)，endpoint 設定為上面的 url 即可
  - [Other Endpoints](https://github.com/104corp/104fp-cprofile-doc/issues/3#issuecomment-391961780)
- Slack
  - 部署狀態 ( [#c-profile-deploy](https://104corp.slack.com/messages/c-profile-deploy/) )
  - 即時錯誤通知 ( [#104_alert_cprofile](https://104corp.slack.com/messages/104_alert_cprofile/) )
  - 即時客服 ( [#c-profile-customer](https://104corp.slack.com/messages/c-profile-customer/) )
  - 設計稿更新通知 & 外單位協作討論 ( [#c-profile-working](https://104corp.slack.com/messages/c-profile-working/) )
  - 開發團隊 ( [#c-profile-dev](https://104corp.slack.com/messages/c-profile-dev/)， Private )
  - Trello 更新通知 ( [#c-profile-trello](https://104corp.slack.com/messages/c-profile-trello/) )
- 第三方服務
  - 滿意度問卷 ( [Wootric](https://app.wootric.com/) )
  - 即時客服 ( [Drift](https://app.drift.com/) )
  - 使用者操作錄製 & 除錯工具 ( [LogRocket](https://app.logrocket.com/74k1bh) )
  - WebSocket for OAuth 認證流程 ( [Pusher](https://dashboard.pusher.com/) )

## 專案介紹

- [Plus(原 C Profile) 概覽](docs/overview.md)
- [開發知識分享紀錄](docs/knowledge.md)


## 專案建置流程

新增本機開發的網域

```bash
vim /etc/hosts

# 新增下面這行到 /etc/hosts
# 127.0.0.1       local.plus.104-dev.com.tw
```

運行開發環境

```bash
npm install
npm start
```

precommit 前處理

> 由於使用 [husky](https://www.npmjs.com/package/husky)、[lint-staged](https://www.npmjs.com/package/lint-staged) 處理 precommit 行為，每個 commit 前都會執行 **程式碼排版**、**圖片壓縮**，因此每次 commit 時會花比較久的時間。

## Package Script 說明

程式碼打包，個別檔案的用途請參考 [create-react-app 官方說明](https://facebook.github.io/create-react-app/docs/production-build)

```bash
npm run build
```

測試

```bash
npm run test          # 本機測試
npm run test:coverage # 測試 & 計算覆蓋率
```

產生分析 bundle 檔案大小報表

```bash
npm run analyze
```

元件開發預覽

```bash
npm run styleguide       # 本機預覽
npm run styleguide:build # 產生文件
```

src底下所有程式碼自動排版

```bash
npm run prettier
```

---

## CI 上線流程

本專案有串 CI 部署，只需透過 PR 即可完成部署。
請注意，`master` 與 `staging` 已設定只接受 PR，不能任意 git push。

### Staging

1. 程式 merge 進 Lab 分支，完成 Lab 驗證
2. 新建 Pull Request **into `staging` from `lab`**，加上 Labels `Staging`
3. 標題為「產品上線大單單號」，而非前端上限小單單號，ex: ITPMCPLUSREQ-901
4. 壓上 **1 位團隊開發成員**作為 Reviewer
5. 待 Review Approve & CI Build 測試跑完，即可點選 Merge 開始自動部署

### Production

1. Staging 驗證完畢
2. 新建 Pull Request **into `master` from `staging`**，加上 Labels `Production`
3. 標題為「產品上線大單單號」，而非前端上限小單單號，ex: ITPMCPLUSREQ-901
4. 壓上 **1 位團隊開發成員** 與 **1 位 QA** 作為 Reviewer
5. 待 Review Approve & CI Build 測試跑完，即可點選 Merge 開始自動部署

---

## 開發細節

### 目錄結構說明

採用 [Rails-style](https://redux.js.org/faq/codestructure) 劃分資料夾，與以下套件有關的資料夾就不多贅述。

- Core
  - [create-react-app@2.1.1](https://github.com/facebook/create-react-app)
  - [redux](https://github.com/reduxjs/redux)
- RESTful API
  - [redux-api-middleware](https://github.com/agraboso/redux-api-middleware)
- GraphQL API
  - [react-apollo](https://www.apollographql.com/docs/react/api/react-apollo.html)
- 非同步邏輯
  - [redux-observable](https://github.com/redux-observable/redux-observable)
  - [redux-saga](https://github.com/redux-saga/redux-saga)
- Style
  - [styled-components](https://github.com/styled-components/styled-components)
  - [node-sass](https://github.com/sass/node-sass)

| 資料夾 / 檔案 | 說明 |
| --- | --- |
| `src/actions` | 包含 [Redux Standard API-calling Actions (RSAAs)](https://github.com/agraboso/redux-api-middleware#redux-standard-api-calling-actions) |
| `src/components/autoComplete/setting.js` | 自動完成設定檔 |
| `src/components/defaultImage` | 範例圖庫 |
| `src/components/defaultSmallImage` | 範例圖庫 (小尺寸) |
| `src/config/autoComplete.js` | 自動完成設定檔 |
| `src/config/category.js` | 類目選單設定檔 |
| `src/config/general.js` | Domain 設定檔 |
| `src/config/graphql.js` | GraphQL Query 與設定 |
| `src/config/nameMap.js` | 區塊名稱、資料更新設定 |
| `src/config/schema.js` | 區塊必填欄位檢查設定 |
| `src/config/sample.js` | 預設文案設定 |
| `src/config/placeholder.js` | placeholder 文案設定 |
| `src/config/featureFlags.js` | 功能開關設定 |
| `src/share` | 共用的 styled-component 與樣式 |
| `src/templates` | 區塊模板 UI 元件 |
| `src/templates/images` | 區塊模板縮圖、預覽圖 |
| `src/templates/setting.js` | 區塊模板設定 |
| `mockServer/` | 開發用本機 server，mock 後端 API 資料 (待補齊) |
| `public/` | 靜態資源 |
| `public/redirect.html` | OAuth 認證轉導過場頁面 |

### Mock Server

將自定義的 Route 塞入 webpack-dev-server ，用以 mock 後端的 RESTful API，適用於無網路 or 後端 API 服務中斷時本機開發使用。(API 上班時間：週一至週五 08:00 - 00:00)

開關 MockServer

```bash
# .env.development
TOGGLE_MOCK_API_SERVER=true # 開啟
TOGGLE_MOCK_API_SERVER=false # 關閉
```

(全部 / 部分) 載入 Route Controller

```bash
# .env.development

# 全部載入
MOCK_ALL_API=true

# 部分載入
MOCK_ALL_API=false
MOCK_CONNECTOR_API=true
MOCK_SORT_API=false
```

請按需求自由修改 `mockServer/`。

### Feature Toggle

因每次上線都是抓 Lab 分支最新的 commit，但有時會有部分功能沒有要正式對外的情況，就需要 Feature Toggle 功能。

#### 使用方式

```js
/**
 * 定義功能名稱 (src/config/featureFlags.js)
 */
const initFeatures = {
    // 根據執行環境
    myFeature: flags => isValidStage(['local', 'lab']),

    // 或是預設關閉
    myFeature: false,
}

/**
 * 使用 Flag 包住你的元件 (src/<path>/myComponent.js)
 */
import { Flag } from 'flag';

const MyFeature = props => (
    <Flag name="myFeature">
        <h1>This is my awesome feature!</h1>
    </Flag>
);

export default MyFeature;
```

更詳細用法請參考 [garbles/flag](https://github.com/garbles/flag) 的文件。

#### Url Query String 開啟功能

Production 以外的環境，可以使用 Query String 開啟某個功能

```bash
# 以下會開啟 myFeatures1, articles, login 三項功能
https://plus.104-dev.com.tw/?features=myFeatures1,articles,login
```

### 新增 Lab 測試帳號

1. lab 登入頁面選註冊新帳號，填寫完email之後會進到接收驗證信頁面
2. 進入到這個網址 http://www.e104.com.tw/jobbank/_test/_sean/tools/ac/d.cfm
3. 在 /services/ac/getPidInfoByEmail/ 這欄輸入你的email，然後按go
4. 下方的資料結構中找到你的pid
5. 在 /services/ac/getAccount/ 這欄輸入你的pid，然後按go
6. 在下方的資料結構中找到 emailVcode
7. 輸入Vcode，送出驗證
8. 就可以登入囉～


### IPVPN

若需要遠端開發，可以使用公司的 IPVPN
1. 請至 eportal 填「資訊設備使用申請單」申請並設定 VPN
2. 登入並連上 [ipvpn](https://ipvpn.104.com.tw/vpn/index.html)
3. 可以開始開發了~

### 手機測試

想要使用手機測試，必須填寫申請單讓手機可以連到公司內網。
1. 請至 eportal 填「資訊設備使用申請單」申請手機測試
2. 連上公司內網 wifi 即可測試

### IE VM 測試機

若需要測不同瀏覽器相容性，目前只能自己安裝對應的瀏覽器測試。若為 Mac 需要測 IE，可以使用公司的 IE VM 測試機。
請至 eportal 填「內外服務連線申請單」，服務名稱為「遠端桌面連線」，並填上相關資訊

```
Windows 7    IE8   10.10.3.41
Windows 7    IE9   10.10.3.42
Windows 7    IE10  10.10.3.43
Vista        IE8   10.10.3.44
Vista        IE9   10.10.3.45
```
