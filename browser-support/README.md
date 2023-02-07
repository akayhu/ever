# 104fp-f2e-browser-support

提供舊瀏覽器版本偵測、顯示不支援警告

## Release 1.0

https://static.104.com.tw/104main/common/browser.min.js

因版本過舊，在此不多做說明，若要使用請查看[舊說明](old-README.md)。

## Release 2.0 (含Release 1.0的方法)

https://static.104.com.tw/104main/common/browser.2.0.min.js

### 與 Release 1.0 差異

1. 解決 id 可能會被重複宣告問題。
2. 新增可用 id 塞入 browser 不支援警告。
3. 有 fixedHeight 時，點選關閉會 removeChild 掉不支援警告視窗的 code。
4. 引入 script 的 url 可不帶入 query 跟 必要屬性，可自行 init。
5. browser.2.0 js 支援可放入 `<head>` 裡，但commonBrowser104.init function需放在body裡。
6. 增加點選關閉鈕後可以執行自訂的 function，讓產品點選關閉後可自行執行後續動作。
7. 若直接 `commonBrowser104.init()` 而未帶值，則使用方法為 Release 1.0 ，src 的 url 需帶入 query 與 必要屬性 `id="browser-support-alert"`， 使用方法可參考Release 1.0[舊說明](old-README.md)

### javascript 使用說明

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.2.0.min.js"></script>
<script>
  commonBrowser104.init({
    date: '2018年01月01日', // 必填 - 到期日文案
    browserVersion: 'IE11', // 必填 - 支援度文案
    lowest: [11, 63], // 必填 - 最低支援版本號(Array格式)
    support: ['ie', 'chrome'] // 必填 - 要偵測的瀏覽器(Array格式)
  });
</script>
```

### 顯示結果

``` html
親愛的使用者，為了您的資料安全及更好的使用體驗，從 2018年01月01日 起，我們將不再支援 IE11 (含)以下的瀏覽器，
建議您點選下面連結盡快升級安裝以下瀏覽器
```

### 參數說明

|參數|值|是否必填|說明|
|-|-|-|-|
|date|任意字串文字|必填|到期日文案|
|browserVersion|任意字串文字|必填|支援度文案|
|lowest|陣列字串數值|必填|最低支援版本號|
|support|陣列字串文字|必填|要偵測的瀏覽器，可偵測opera、ie、edge、firefox、safari、chrome瀏覽器|

### lowest與support的對照

`lowest` 和 `support` 會相應對照，`lowest: [11, 63], support: ['ie', 'chrome']`，順序代表偵測IE 11、chrome 63，低於該版本就會顯示警告。其餘未設定的瀏覽器就忽略無作用。


### 不支援警告視窗fixed height使用說明

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.2.0.min.js"></script>
<script>
  commonBrowser104.init({
    date: '2018年01月01日',
    browserVersion: 'IE11',
    lowest: [11],
    support: ['ie'],
    fixedHeight: '10px' // 非必填 - 要fixed height的高度
  });
</script>
```

### 參數說明

|參數|值|是否必填|說明|
|-|-|-|-|
|fixedHeight|高度值|非必填|要fixed height的高度|

### 不支援警告視窗塞入自訂id標籤裡使用說明

``` html
  <body>
    <div id="browserId"></div>
  <body>
```

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.2.0.min.js"></script>
<script>
  commonBrowser104.init({
    date: '2018年01月01日',
    browserVersion: 'IE11',
    lowest: [11],
    support: ['ie'],
    appendId: 'browserId' // 非必填 - 要提示顯示塞入到id裡(default: body最上面)
  });
</script>
```

### 參數說明

|參數|值|是否必填|說明|
|-|-|-|-|
|appendId|html id name|非必填|要提示顯示塞入到id裡(default: body最上面)|

### 選關閉後可自行執行後續動作使用說明

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.2.0.min.js"></script>
<script>
  function myFunction() {
    // 做什麼事
  }

  commonBrowser104.init({
    date: '2018年01月01日',
    browserVersion: 'IE11',
    lowest: [11],
    support: ['ie'],
    closeFun: myFunction // 非必填 - 點選關閉後要執行的function
  });
</script>
```

|參數|值|是否必填|說明|
|-|-|-|-|
|closeFun|function name|非必填|按下關閉鈕會執行您自訂的function|

## Release 3.0 (含Release 1.0、Release 2.0的方法)

https://static.104.com.tw/104main/common/browser.3.0.min.js

### 與 Release 2.0 差異

1. 新增多語系語言(繁體中文、簡體中文、英文)
2. 新增點選關閉後存Cookie動作

### 預設語系使用說明

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.3.0.min.js"></script>
<script>
  commonBrowser104.init({
    date: '2018年01月01日',
    browserVersion: 'IE11',
    lowest: [11],
    support: ['ie'],
    language: 4, // 非必填 - 要顯示的語系
    date_en: 'January 1, 2018' // 非必填 - 到期日英文文案
  });
</script>
```

|參數|值|是否必填|說明|
|-|-|-|-|
|language|數值|非必填|語系參數備註(二進位儲存模式)|
|date_en|任意字串文字|非必填|英文到期日文案|

#### language 值說明

* 1： 繁體中文
* 2： 簡體中文
* 3： 繁體中文 + 簡體中文
* 4： 英文
* 5： 繁體中文 + 英文
* 6： 簡體中文 + 英文
* 7： 繁體中文 + 簡體中文 + 英文

### 顯示結果

``` html
After January 1, 2018 we will stop support IE11 and older versions. 
For your security and better browsing experience, please update your browser. 
Install one of the following browsers.
```

### 備註:

* 未給 language 參數，預設則為繁體中文
* 未給 date_en 參數，預設則為 date 參數值

### 自訂顯示語言順序使用說明

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.3.0.min.js"></script>
<script>
  commonBrowser104.init({
    date: '2018年01月01日',
    browserVersion: 'IE11',
    lowest: [11],
    support: ['ie'],
    language: [4, 1], // 非必填 - 要顯示的語系
    date_en: 'January 1, 2018' // 非必填 - 到期日英文文案
  });
</script>
```

|參數|值|是否必填|說明|
|-|-|-|-|
|language|陣列數值|非必填|二進位儲存模式數字(1: 繁體中文、2: 簡體中文、4: 英文)|
|date_en|任意字串文字|非必填|英文到期日文案|

### 備註:

* language 參數需給陣列格式，先給的參數則優先顯示
* 參數只能填入二進制數字(1: 繁體中文、2: 簡體中文、4: 英文)
* 若 language 參數重複傳入，會過濾重複數字
* 若 language 參數傳入非二進制數字，則濾掉
* 未給 language 參數，預設則為繁體中文
* 未給 date_en 參數，預設則為 date 參數值

### 關閉後存Cookie後，1天內不顯示

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.3.0.min.js"></script>
<script>
  commonBrowser104.init({
    date: '2018年01月01日',
    browserVersion: 'IE11',
    lowest: [11],
    support: ['ie'],
    closeCookieTime: 1 // 非必填 - 關閉後1天內不再出現不支援提示
  });
</script>
```

|參數|值|是否必填|說明|
|-|-|-|-|
|closeCookieTime|數值|非必填|要存入的天數(以天為單位)|

備註：存入的Cookie值為`browserSupportTime`。

### 關閉後存cookie後到今晚12點前不顯示

``` javascript
<script src="https://static.104.com.tw/104main/common/browser.3.0.min.js"></script>
<script>
  commonBrowser104.init({
    date: '2018年01月01日',
    browserVersion: 'IE11',
    lowest: [11],
    support: ['ie'],
    closeCookieTime: 'tonight' // 非必填 - 關閉後到今晚12點前不顯示
  });
</script>
```

|參數|值|是否必填|說明|
|-|-|-|-|
|closeCookieTime|字串為`tonight`|非必填|關閉後到今晚12點前不顯示|

備註：存入的Cookie值為`browserSupportTime`。

### TLS偵測(已拔除)

Release 2.0 與 Release 3.0 支援 TLS偵測，若 TLS 為 1.0 則顯示文案如下：

``` html
您使用的作業系統或瀏覽器存在安全性風險，將導致個人身分、信用卡或銀行帳號等資訊有被竊之可能。 
104人力銀行為了保護您的資料安全，將於 2018/8/31 停止支援您所使用的作業系統或瀏覽器。 
更多詳細說明請參考：如何升級/設定作業系統或瀏覽器
```

TLS支援版本網址參考：https://help.salesforce.com/articleView?id=000220586&language=en_US&type=1

提醒：Release 2.0 與 Release 3.0有多呼叫一個特定網域為 tls-detect.support.104.com.tw，CSP設定過於嚴格的產品會無法取得該網域的資料，造成誤判為不支援 TLS。請開發者記得檢查CSP設定！

## mobile套用裝置說明

手機版套用此套件，Android只出現 Chrome 跟 Firefox 的 下載連結，iOS (iPad,iPhone)只出現Chrome 跟 Firefox 跟 Safari。

## 圖片說明

IE、Chrome、Firefox、Safari 四張 Banner 圖，
因做法是直接引入browser.min.js擋，而不好判斷環境問題，
所以 lab 環境圖片位置連到 static.104.com.tw 線上的 static 主機，
staging 環境圖檔也有放相同位置，
所以 lab staging 測試環境不會有破圖相關問題

## API 提供

|API|需傳入參數|說明|範例|
|-|-|-|-|
|userAgentMatch|navigator.userAgent|查詢瀏覽器與瀏覽器版本|commonBrowser104.userAgentMatch(navigator.userAgent);|
|getVersion|無|查詢瀏覽器版本|commonBrowser104.getVersion();|
|getBrowser|string，格式為 `chrome,mozilla,webkit,edge,msie,rv,opr,opera` (參數備註)|查詢目前開啟的瀏覽器是否符合|commonBrowser104.getBrowser('chrome');|
|getSrcVars|無|查詢browser.min.js src的url帶入string參數|commonBrowser104.getSrcVars();|
|browserSupportStatusLog|無|查詢browser support所有狀態 (僅限於Console查詢，無法抓取)|commonBrowser104.browserSupportStatusLog();|
|delCookie|無|刪除browserSupportTime cookie (3.0才有)|commonBrowser104.delCookie();|

## browserSupportStatusLog 參數說明

|參數|說明|備註|
|-|-|-|
|appendChildBody|是否出現提醒瀏覽器不支援視窗||
|tls|是否TLS為1.0，出現TLS1.0警告|已拔除|
|isMobileDevice|是否為平板與手機裝置||
|isAndroid|是否為安卓系統||
|isIOS|是否為IOS系統||
|userAgent|userAgent狀態||
|browserData|帶入init的參數||
|browserLink|banner連結資訊|Release 3.0版本才有|
|browserVersion|瀏覽器版本||
|userAgentBrowser|開啟的瀏覽器與瀏覽器版本||

### 參數備註: 
* 查詢opera： opr、opera
* 查詢ie6~ie10： msie
* 查詢ie11： rv
* 查詢edge： edge
* 查詢firefox： mozilla
* 查詢safari： webkit
* 查詢chrome： chrome

## Unit test

使用套件為Qunit，參考網址：https://qunitjs.com/

## End to End

使用套件為WebdriverIO，參考網址：http://webdriver.io/