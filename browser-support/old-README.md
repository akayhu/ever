# 104fp-f2e-browser-support

提供瀏覽器版本偵測、顯示不支援警告

## Release 1.0

https://static.104.com.tw/104main/common/browser.min.js

### 使用說明

1. 在`<body>`嵌入一個script標籤，必須有屬性`id="browser-support-alert"`（只能放在`<body>`）
2. src的url帶入query string參數
```jacascript
<script id="browser-support-alert" src="https://static.104.com.tw/104main/common/browser.min.js?date=[到期日文案]&browserVersion=[支援度文案]&lowest=[最低支援版本號]&support=[要偵測的瀏覽器]"></script>
```
3. 完成了！當判斷為不支援的瀏覽器時，自動在`<body>`最上方插入警告的HTML

### 參數說明

|參數|值|說明|範例|
|-|-|-|-|
|date|任意文字|必填，顯示文案：`從{date}起`|`date=2017/11/11`|
|browserVersion|任意文字|必填，顯示文案：`不再支援{browserVersion}以下瀏覽器`|`browserVersion=IE7`|
|lowest|string，格式為`1,10,20`|必填，最低支援的瀏覽器版本，目前只支援大版號判斷|`lowest=7,62`|
|support|string，格式為`ie,chrome`|必填，要偵測的瀏覽器種類，選項有：`firefox`、`chrome`、`ie`、`edge`、`opera`、`safari`|`support=ie,chrome`|
|fixedHeight|string，格式為`30px`|選填，有填表示該元件`position: fixed`，未填表示`position: static`|`fixedHeight=30px`|

### lowest與support的對照

`lowest` 和 `support` 會相應對照，例如：`lowest=7,62&support=ie,chrome`，代表偵測IE 7、chrome 62，低於該版本就會顯示警告。其餘未設定的瀏覽器就忽略無作用。

### API DOCS

browser.min.js 提供相關browser查詢的參考資料API

|API|需傳入參數|說明|範例|
|-|-|-|-|
|userAgentMatch|navigator.userAgent|查詢瀏覽器與瀏覽器版本|commonBrowser104.userAgentMatch(navigator.userAgent);|
|getVersion|無|查詢瀏覽器版本|commonBrowser104.getVersion();|
|getBrowser|string，格式為`chrome,mozilla,webkit,edge,msie,rv,opr,opera`(參數備註)|查詢目前開啟的瀏覽器是否符合|commonBrowser104.getBrowser('chrome');|
|getSrcVars|無|查詢browser.min.js src的url帶入string參數|commonBrowser104.getSrcVars();|

參數備註: 
* 查詢opera： opr、opera
* 查詢ie6~ie10： msie
* 查詢ie11： rv
* 查詢edge： edge
* 查詢firefox： mozilla
* 查詢safari： webkit
* 查詢chrome： chrome

### 圖片說明

IE、Chrome、Firefox、Safari 四張 Banner 圖，
因做法是直接引入browser.2.0.min.js擋，而不好判斷環境問題，
所以 lab 環境圖片位置連到 static.104.com.tw 線上的 static 主機，
staging 環境圖檔也有放相同位置，
所以 lab staging 測試環境不會有破圖相關問題

## Release 2.0

https://static.104.com.tw/104main/common/browser.2.0.min.js

### 使用說明
基本上 Release 1.0 有的方法 Release 2.0 都有，但 Release 2.0 script 標籤可不用帶參數與屬性，使用方法如下：

1. 在`<head>`或`<body>`嵌入一個script標籤（ Release 2.0支援可放在`<head>`裡 ）
2. 引入 script 如下:

```jacascript
<script src="https://static.104.com.tw/104main/common/browser.2.0.min.js"></script>
```

3. 加入 javascript 程式碼，範例如下:

``` javascript
<script>
  commonBrowser104.init({
    date: '2018年01月01日', // 必填 - 到期日文案
    browserVersion: 'IE11', // 必填 - 支援度文案
    lowest: [11, 63], // 必填 - 最低支援版本號(Array格式)
    support: ['ie', 'chrome'], // 必填 - 要偵測的瀏覽器(Array格式)
    fixedHeight: '10px', // 選填 - 要fixed的高度
    appendId: 'browserId', // 選填 - 要提示顯示插入到id裡(default: body最上面)
    closeFun: myFunction // 選填 - 點選關閉後要執行的function
  });
</script>
```

4. 若直接 `commonBrowser104.init()` 而未帶值，則使用方法為 Release 1.0 ，src 的 url 需帶入 query 與 必要屬性 `id="browser-support-alert"` ， 使用方法可參考 Release 1.0 

### 參數說明

Release 1.0 有的 Release 2.0 都有，額外新增如下：

|參數|值|說明|範例|
|-|-|-|-|
|appendId|string，格式為自取|選填，把不支援警告視窗塞入id裡|`<div id="browserId"></div><script src="https://static.104.com.tw/104main/common/browser.2.0.min.js"></script>`|
|closeFun|function，格式為自取|選填，按下關閉鈕會執行您自訂的function|commonBrowser104.init帶入closeFun參數與function name|

init 記得傳入 appendId 

### 與 Release 1.0 差異

1. 解決id可能會被重複宣告問題
2. 新增可用id塞入 browser 不支援警告
3. 有 fixedHeight 時，點選關閉會 removeChild 掉不支援警告視窗的 code
4. 引入 script 的 url 可不帶入 query 跟 必要屬性，可自行 init
5. browser.2.0 js 支援可放入 `<head>` 裡
6. 增加點選關閉鈕後可以執行自訂的function，讓產品點選關閉後可自行執行後續動作

## Release 3.0

https://static.104.com.tw/104main/common/browser.3.0.min.js

### 使用說明
Release 1.0 與 2.0 有的方法，Release 3.0 都有，3.0 新增自訂顯示的語系，使用方法如下：

1. 在`<head>`或`<body>`嵌入一個script標籤
2. 引入 script 如下:

```jacascript
<script src="https://static.104.com.tw/104main/common/browser.3.0.min.js"></script>
```

3. 加入`預設語言`顯示規則 javascript 程式碼，範例如下:
``` javascript
<script>
  commonBrowser104.init({
    language: 5, // 選填 - 要顯示的語系
    date: '2018年01月01日', // 必填 - 到期日文案
    date_en: 'January 1, 2018', // 選填 - 到期日英文文案
    browserVersion: 'IE11', // 必填 - 支援度文案
    lowest: [11, 63], // 必填 - 最低支援版本號(Array格式)
    support: ['ie', 'chrome'], // 必填 - 要偵測的瀏覽器(Array格式)
    fixedHeight: '10px', // 選填 - 要fixed的高度
    appendId: 'browserId' // 選填 - 要提示顯示插入到id裡(default: body最上面)
  });
</script>
```

語系參數備註(二進位儲存模式): 
* 1： 繁體中文
* 2： 簡體中文
* 3： 繁體中文 + 簡體中文
* 4： 英文
* 5： 繁體中文 + 英文
* 6： 簡體中文 + 英文
* 7： 繁體中文 + 簡體中文 + 英文

備註:
* 未給 language 參數，預設則為繁體中文
* 未給 date_en 參數，預設則為 date 參數值

4. 若要`自訂顯示語言順序` javascript 程式碼，範例如下:
``` javascript
<script>
  commonBrowser104.init({
    language: [4, 1], // 選填 - 要顯示的語系(Array格式)，此範例為先顯示英文再顯示繁體中文
    date: '2018年01月01日', // 必填 - 到期日文案
    date_en: 'January 1, 2018', // 選填 - 到期日英文文案
    browserVersion: 'IE11', // 必填 - 支援度文案
    lowest: [11, 63], // 必填 - 最低支援版本號(Array格式)
    support: ['ie', 'chrome'], // 必填 - 要偵測的瀏覽器(Array格式)
    fixedHeight: '10px', // 選填 - 要fixed的高度
    appendId: 'browserId' // 選填 - 要提示顯示插入到id裡(default: body最上面)
  });
</script>
```

備註:
* language 參數需給陣列格式，先給的參數則優先顯示
* 參數只能填入二進制數字(1: 繁體中文、2: 簡體中文、4: 英文)
* 若 language 參數重複傳入，會過濾重複數字
* 若 language 參數傳入非二進制數字，則濾掉
* 未給 language 參數，預設則為繁體中文
* 未給 date_en 參數，預設則為 date 參數值

### Unit test

使用套件為Qunit，參考網址：https://qunitjs.com/

### End to End

使用套件為WebdriverIO，參考網址：http://webdriver.io/