# C Profile 專案概覽

## [產品規格](https://github.com/104corp/104fp-cprofile-doc#%E7%94%A2%E5%93%81%E8%A6%8F%E6%A0%BC)

## 前端開發介紹

![系統架構圖](https://raw.githubusercontent.com/104corp/104fp-cprofile-doc/master/architecture/system-architecture-diagram.jpg?token=AIe-v7HwVJyguhEkGg9k2AqkOH0zisk0ks5cdh4bwA%3D%3D)

> 前端只負責 Client Side SPA，沒有 Node.js Server

### 相關專案

- [104fp-cprofile-doc](https://github.com/104corp/104fp-cprofile-doc)：產品文件 & E2E Test
- [104fp-f2e-cprofile](https://github.com/104corp/104fp-f2e-cprofile)：前端主程式
- [104fp-profile-be](https://github.com/104corp/104fp-profile-be)：後端主程式

### 環境

- [協作資源](https://github.com/104corp/104fp-f2e-cprofile/#%E5%8D%94%E4%BD%9C%E8%B3%87%E6%BA%90)
- 開發工具：[create-react-app 2.1.1](https://facebook.github.io/create-react-app/docs/getting-started) ejected
    - prerender landing page
    - resource hint with prefetch or preload
    - [Mock RESTful API Server](https://github.com/104corp/104fp-f2e-cprofile/#mock-server)
- git precommit hook
    - related unit test
    - prettier
    - image compression
- [Travis CI 部署](https://github.com/104corp/104fp-f2e-cprofile/#ci-%E4%B8%8A%E7%B7%9A%E6%B5%81%E7%A8%8B)
    - 主程式
    - UI Demo 文件

### 版控

- development branch：dev
- deploy branch：lab (push)、staging (PR)、master (PR)

### 開發細節

- javascript es6
- style (RWD)
    - css
    - inline style for UI Framework
    - scss
    - styled-component
- 元件開發
    - React 16.8.6
        - 使用新的生命週期
        - local UI 狀態 with this.state
        - global UI 狀態存 redux state > ui
    - Ant Design 3.10.10 (主要)
    - Ant Design Mobile 2.2.6
    - Material Design 0.20.0 (少量)
    - [XState](https://github.com/davidkpiano/xstate) (少量)
    - [Storybook](https://storybook.js.org/) (未正式加入開發流程)
- 路由
    - react-router 4
- 裝置偵測
    - 104 瀏覽器偵測套件
    - react-device-detect
- 全局狀態管理
    - redux-immutable
        - state 內一律為 immutable data structure
        - 元件內一律為原生資料結構
        - ui、others data 結構
    - local storage (少量，只存圖片裁切座標)
- 非同步處理
    - 商務邏輯：redux-saga (common saga + flow saga)
    - 底層模組：redux-observable
    - loading 狀態判斷：processing reducer + selector
- 資料格式檢查
    - [AJV](https://ajv.js.org/)：JSON schema validator
- API Request
    - 客製化 redux-api-middleware
        - before、next、error for custom action sequences
        - processMethod for request debounce
    - apollo client for graphql query
- 靜態資源
    - 圖片直接 import，非放在 public
    - 沒有放檔案在 104 static server (除了全公司共用的元件以外)
    - 圖片尺寸： w600、w960、w1920、avatar(300x300)
- 上傳檔案
    - Document API
- SEO
    - meta tag：react-helmet
    - landing page
        - build with prerender-spa-plugin
        - AWS cloudfront setting
    - profile page
        - 後端排程建 search index 順便建立 static html in S3
        - 前端部署時清除 static html in S3
- 互動性
    - 拖曳：react-dnd + react-dnd-html5-backend
    - 錨點定位：react-scrollchor
    - 捲動行為：自製元件 + react-sticky-el
    - 動畫效果：react-transition-group
- 瀏覽器相容性
    - 預定[支援 IE 11 以上](https://browserl.ist/?q=%3E0.2%25%2C+not+dead%2C+not+ie+%3C%3D+10%2C+not+op_mini+all)，但還在努力 Orz...
    - [polyfill](http://jira.104.com.tw/browse/BIGC-3440)
- 第三方服務
    - Wootric：滿意度問卷
    - Drift：即時客服
    - LogRocket：使用者操作錄製 & 除錯工具
    - Pusher：WebSocket for OAuth 認證流程
- [目錄結構說明](https://github.com/104corp/104fp-f2e-cprofile/#%E7%9B%AE%E9%8C%84%E7%B5%90%E6%A7%8B%E8%AA%AA%E6%98%8E)

## 未來改善項

> 如果還有未來的話...

- 改善 Git 協作流程
- 提升一致性
    - 建立開發規範
    - 技術收斂
        - 只用 scss、inline style (for UI framework)
        - 移除 redux-observable，用 redux-saga 取代
        - 移除 apollo client，用 redux-api-middleware 處理 GraphQL request
        - UI Framework 只留一套 (留 antd，移除 material-design)
- 瀏覽器支援度
- 效能調校
