# C web application

* [Environment](#Environment)
* [Setting 設定](#Setting-設定)
* [Install 安裝](#Install-安裝)
* [Install 安裝](#Install-安裝)

## Environment

    [+] nodeJS v6
    [+] npm 4


## Setting 設定

1. 安裝 NodeJS

[官網](https://nodejs.org/en/)

2. 建立SSH KEY

用https去連github的話，每次都會要你重新輸入密碼，建議使用ssh連線會比較安全，也比較有效率。

* MAC方式
顯示你的家目錄下有那些ssh的key，~代表home目錄
```bash
$ ls ~/.ssh
```
沒有ssh key的話，可用下列語法產生ssh key
```bash
$ ssh-keygen -t rsa -C "{loginname}@104.com.tw"
```
會叫你再輸入passphrase(這個key的密碼)，可以不要輸入。會產生兩個檔案id_rsa.pub(公鑰)跟id_rsa(私鑰)

⇢顯示公鑰的檔案內容
```bash
$ cat ~/.ssh/id_rsa.pub
```
到github個人檔案中將ssh的公鑰建立上去
http://gitlab.e104.com.tw/
title取個可以識別的名字就好
將cat出來的內容，貼到key中

* Windows方式
只要你有git bash 操作方法同上 (BY倚韓)
所以灌個git bash吧


3. 建立專案資料夾與複製

```bash
// 1. 建立專案資料夾
$ mkdir {104_big_c}
// 2. 進入 104_big_c 資料夾目錄下  
$ cd 104_big_c
// 3. clone 專案
// clone c_wap ,c_wap為前端互動相關程式碼
$ git clone git clone git@gitlab.e104.com.tw:NCC-Plus-APP/C_wap.git
// clone plus_rest ,json api相關程式碼
$ git clone git@gitlab.e104.com.tw:NCC-Plus-APP/plus_rest.git
// 切換分支
$ git checkout lab
```

## Hosts 設定

把127.0.0.1  指向 pluslocal.104-dev.com.tw
windows 請修改這隻檔案 --- > C:\Windows\System32\drivers\etc
```bash
$ vim /etc/hosts
```
```bash
$ 127.0.0.1 pluslocal.104-dev.com.tw
```

## Install 安裝

⇢安裝相關套件(兩個資料夾都要)
```bash
$ npm install
```

⇢設置環境變量命令(兩個資料夾都要)
```bash
$ export NODE_ENV=dev
```

⇢起專案囉!(兩個資料夾都要)
```bash
$ npm run dev
```

本機 [執行網址](http://pluslocal.104-dev.com.tw:3000/)

## Unit Test

```
// 執行測試
npm run test
// 測試並產生覆蓋率文件
npm run test:coverage
```

測試文件請放置於要測試的 js 對象的同一層目錄 `__tests__` 中，檔名規則為 `{測試文件名}.spec.js`

```
.
├── src
│   └── server
│        └── utils
│             ├── __tests__
│             │    └── IpUtil.spec.js
│             └── IpUtil.js
└── node_modules
```

當需要 mocks 資料時請寫入在緊鄰對象 module 的目錄 `__mocks__` 中，命名保持一至，假如 mock 對象於 node_modules 中則放於相鄰的 `__mocks__` 中

```
.
├── src
│   ├── __mocks__
│   │   └── user.js
│   └── user.js
├── node_modules
│       └──  fs 
└── __mocks__
        └── fs.js
```

## 打包

[google doc](https://docs.google.com/document/d/1pxMH2g7y4VHgjmlfxzfdEn6qGjwjFWSvOndetpa1_-0/edit)

gitlab 上的 c_war  、 plus_rest 、c_platform

merge ```lab branch``` to ```staging branch```

本地沒有 staging 時執行
```bash
# local 沒有 staging 分支
# 查看遠端分支
$ git branch --remote
# 抓取遠端 staging 分支
$ git checkout --track -b staging origin/staging
```

打包的所有 repository 都要做

```bash
# 確定目前分支在 lab
$ git branch
# 拉下最新的遠端版本，如果有衝突請解決
$ git pull origin/lab
# 切換到 staging 分支
$ git checkout staging
# 在 staging 分支 merge lab 分支
$ git merge lab
# 將本地 staging 分支推到 romote
$ git push origin/staging
```

## 請確認 merge進staging 並 push

```bash
$ ssh root@172.19.1.50
## password : 1qaz2wsx
$ cd /root/dev
```

+ 執行

```bash
$ ./build.sh update lab server client c_platform c_wap plus_mweb_wap plus_rest
# 後面四個跟原本一樣
```
- #### update: 
> 不給預設走 clone，給了就走git pull & npm update

- #### lab:
> 不給預設走 master，同時會推 lab

- #### server:
> 只打包 server

- #### client:
> 只打包 client

#### （都要就 server client 都不用給，或是都給）

```bash
lab打包：
clone ./build.sh lab c_wap
update ./build.sh update lab c_wap

master 只更新 server：
update ./build.sh update server c_wap
```

+ 檢查

```bash
$ cd /mnt/tmp_deploy/ITPMCPLUSREQ-508/ && ll
```

+ 再次檢查

打包完後到50那台機器：

```bash
c_wap-staging /
plus_rest-staging /
c_platform-staging /
plus_mweb_wap-staging /
check git head
```
確保commit為最新的狀態

再次檢查 4 隻檔案
```bash
ajax.zip
index_static.zip
index.zip
platform_static.zip

// 確定時間(剛剛打包時間差距是否太大)，檔案大小(打包錯誤)
// 有問題請回到資料夾（ $cd ~/root/dev ），重新執行打包動作。
```

+ 成功更新
http://jira.104.com.tw/browse/ITPMCPLUSREQ-508

## 系統 server




## node modules

+ [express](http://expressjs.com/zh-tw/)

  NodeJS Server Framework

+ [serve-static](https://github.com/expressjs/serve-static)

  express 處理建靜資源的模組

+ [serve-favicon](https://github.com/expressjs/serve-favicon)

  Node.js middleware for serving a favicon.

+ [log4js](https://www.npmjs.com/package/log4js)

  log 工具


## 測試帳號

account: w100000092  
password: jeremy5795

[測試帳號列表](https://docs.google.com/spreadsheets/d/1Eyq7OllaHIAVSb4Gyj1xV596L2VzwEdQRBwW8U-1oeA/edit#gid=1503048470)


## 本機登入測試

1.請至 [plus](https://plus.s104.com.tw/) 進行登入

2.遇到權限問題，請開啟開發者工具，對無法讀取靜態資源，另開新頁，進階同意憑證

3.重新回到本機 [測試頁](http://dev.s104.com.tw:3000/)

4.重新整理畫面。


## 後端 API docs

[API docs](http://172.19.7.201/apidoc/opengine/)


## 登入 API

[AC 登入 doc](https://accounts.s104.com.tw/doc/underground_api/api/index.html)

