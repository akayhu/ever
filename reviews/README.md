# 104fp-f2e-reviews

[![Node version](https://img.shields.io/badge/node-%3E%3D10.15.0-brightgreen.svg)](http://nodejs.org/)
[![Vue CLI version](https://img.shields.io/badge/Vue%20CLI-%3E%3D3.12.1-brightgreen.svg)](https://cli.vuejs.org/)

104公司評論前台
求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！

## 協作支援

- 網站 ( [lab](https://reviews.104-dev.com.tw) | [staging](https://reviews.104-staging.com.tw) | [production](https://reviews.104.com.tw) )
- 相關文件 ( [Project](https://bit.ly/328JrGy) | [Axshare](https://bit.ly/2ZJGGy9) )
- 使用案例文件 ( [UseCase](https://bit.ly/2LmpXr8) )
- UI 設計稿 ( [Zeplin](https://bit.ly/2ZF5zGQ) )
- API 文件
  - RESTful ( [Swagger UI](http://be.reviews.104-dev.com.tw/api/documentation) )
- Slack
  - 部署狀態 ( [#reviews-deploy](https://app.slack.com/client/T0675A0CX/CNNCF910U) )
  - 開發團隊 ( [#companies_reviews](https://app.slack.com/client/T0675A0CX/GMVGZFF1B)，Prvate )

## 專案建置流程

新增本機開發的網域
```
For Windows -
C:\WINDOWS\system32\drivers\etc  打開 host 檔案

For Mac -
sudo vim /etc/hosts

# 新增下面這行到 /etc/hosts
# 127.0.0.1       local.review.104-dev.com.tw
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

本專案有串 CI 部署，只需透過 PR 即可完成部署。
請注意，`master` 與 `staging` 已設定只接受 PR，不能任意 git push。

### 特別注恴
專案內 nginx.conf 有使用 DNS resolver ip, 若有更換 ip 切記要調整設定檔, 否則 prerender 會失效
prerender 使用主網服務 prerender.104.com.tw

### Staging

1. 程式 merge 進 Lab 分支，完成 Lab 驗證
2. 新建 Pull Request **into `staging` from `lab`**，加上 Labels `Staging`
3. 標題為「產品上線大單單號」，而非前端上限小單單號，ex: ITPMCPLUSREQ-901
4. 壓上 **1 位團隊開發成員**作為 Reviewer
5. 待 Review Approve，即可點選 Merge 開始自動部署

### Production

1. Staging 驗證完畢
2. 新建 Pull Request **into `master` from `staging`**，加上 Labels `Production`
3. 標題為「產品上線大單單號」，而非前端上限小單單號，ex: ITPMCPLUSREQ-901
4. 壓上 **1 位團隊開發成員** 與 **1 位 QA** 作為 Reviewer
5. 待 Review Approve，即可點選 Merge 開始自動部署

## 開發細節

- UI
  - [element-ui](https://element.eleme.io/#/zh-CN)
  - [ant-design-vue](https://www.antdv.com/docs/vue/introduce/)
  - [bootstrap-vue](https://bootstrap-vue.js.org/)
- Core
  - [vue/cli@3.11.0](https://cli.vuejs.org/)
  - [vuex](https://vuex.vuejs.org/)
- RESTful API
  - [axios](https://github.com/axios/axios)
- Css Style
  - [vue-styled-components](https://github.com/styled-components/vue-styled-components)
- SEO
  - [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)
  - [vue-meta](https://github.com/nuxt/vue-meta)

### 目錄結構說明

| 資料夾 / 檔案 | 說明 |
| --- | --- |
| `src/apis` | API管理及封裝 |
| `src/assets` | 圖庫 |
| `src/components` | 元件庫 |
| `src/directive` | 自定義指令 |
| `src/layouts` | Router 路由配置 |
| `src/locale` | 錯誤訊息資訊 |
| `src/middleware` | 中介層 |
| `src/mixins` | 共用 methods |
| `src/mockData` | 假資料 |
| `src/mutations` | 狀態管理 |
| `src/scss` | scss |
| `src/store` | 儲存庫 |
| `src/styleComponents` | Style Components 相關 css |
| `src/utils` | js 相關共用檔 |
| `src/views` | containers |
| `tests/unit` | 單元測試 |

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
