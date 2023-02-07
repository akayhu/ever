(function(window, name, definition) {
  if (!window[name]) {
    window[name] = definition();
  }
  window.onload = function() {
    if (document.getElementById('browser-support-alert')) window[name].init();
  }
}(window, 'commonBrowser104', function() {
    /* 防止重複塞進 body */
    var appendChildBody = false;
    /* 取用戶代理 */
    var userAgent = window.navigator.userAgent;
    /* 是否為手機或平板裝置 */
    var isMobileDevice = false;
    /* 是否為 Android */
    var isAndroid = false;
    /* 是否為 IOS */
    var isIOS = false;
    /* 參數資料 */
    var browserData = '';
    /* 連結資料 */
    var linkData = {
      zh_tw: {
        ie: 'https://support.microsoft.com/zh-tw/help/17621/internet-explorer-downloads',
        chrome: 'https://www.google.com.tw/chrome/browser/desktop/index.html',
        safari: 'https://www.apple.com/tw/safari/',
        firefox: 'https://www.mozilla.org/zh-TW/firefox/new/'
      },
      en_us: {
        ie: 'https://support.microsoft.com/en-us/help/17621/internet-explorer-downloads',
        chrome: 'https://www.google.com/intl/en/chrome/',
        safari: 'https://www.apple.com/safari/',
        firefox: 'https://www.mozilla.org/en-US/firefox/new/'
      }
    };
    /* 預設連結(繁中) */
    var browserLink = linkData.zh_tw;
    /* 取瀏覽器與版本號 */
    var userAgentMatch = function(ua) {
      if (!ua) {
        console.log('browser.min.js未帶入navigator.userAgent');
        return 'browser.min.js未帶入navigator.userAgent';
      }
      ua = ua.toLowerCase();
      var match = /(opr)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                  /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                  /(edge)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                  /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                  /(webkit)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                  /(msie) ([\w.]+)/.exec(ua) ||
                  ua.indexOf('trident') > 0 && /(rv)(?:.*version|)[ \:]([\w.]+)/.exec(ua) ||
                  ua.indexOf('compatible') < 0 && ua.indexOf('trident') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                  [];
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    };
    /* 取得瀏覽器版本 */
    var getVersion = function() {
      return userAgentMatch(userAgent).version;
    };
    /* 取開起的瀏覽器 */
    var getBrowser = function(browserValue) {
      return (userAgentMatch(userAgent).browser === browserValue);
    };
    /* 判斷目前開啟的瀏覽器 */
    var detectBrowser = {
      opera: getBrowser('opr') || getBrowser('opera'),
      ie: getBrowser('msie') || getBrowser('rv'),
      edge: getBrowser('edge'),
      firefox: getBrowser('mozilla'),
      safari: getBrowser('webkit'),
      chrome: getBrowser('chrome'),
      mobileDevice: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
      android: (/Android/i.test(navigator.userAgent)),
      ios: (/iPhone|iPad|iPod/i.test(navigator.userAgent))
    };
    /* createElement */
    var createElementTag = function(tag) {
      return document.createElement(tag);
    };
    /* createElement 加 css */
    var createElementCss = function(elem, cssObj) {
      for (var property in cssObj) {
        elem.style[property] = cssObj[property];
      }
    };
    /* createElemen 加 setAttribute */
    var setAttributeAll = function(elem, attr) {
      for (var property in attr) {
        elem.setAttribute(property, attr[property]);
      }
    };
    /* 顯示語言的css - 主要 */
    var languageCssＭain = function(langTag) {
      createElementCss(langTag, {
        fontSize: '19px',
        color: '#c74708',
        fontWeight: 'bold',
        marginTop: '5px',
        lineHeight: '1.5',
        marginBottom: '5px'
      });
    };
    /* 顯示語言的css - 次要 */
    var languageCssSecondary = function(langTag) {
      createElementCss(langTag, {
        margin: '0',
        color: '#c74708',
        fontSize: '14px'
      });
    };
    /* outerFrame css */
    var outerFrameCss = function(outerFrame, width) {
      var paddingCss;
      (width === 736) ? paddingCss = '40px 20px 10px' : paddingCss = '40px 17px 10px';
      if (width === 1024) {
        createElementCss(outerFrame, {
          maxWidth: '960px',
          margin: '0 auto',
          padding: '5px 20px 10px',
          textAlign: 'center',
          overflow: 'hidden',
          display: 'block'
        });
      } else {
        createElementCss(outerFrame, {
          maxWidth: '960px',
          margin: '0 auto',
          padding: paddingCss,
          textAlign: 'center',
          display: 'block'
        });
      }
    };
    /* browserSupport css */
    var browserSupportCss = function(browserSupport, width, urlData) {
      var positionCss;
      (positionCss === 1024) ? positionCss = 'fixed': positionCss = 'absolute';
      createElementCss(browserSupport, {
        position: positionCss,
        zIndex: '10000',
        left: '0',
        top: parseInt(urlData.fixedHeight.replace(/px/ig, '')) + 'px'
      });
    };
    /* linkTag css */
    var linkTagCss = function(linkTag, width) {
      var widthCss;
      (width >= 414) ? (width === 480) ? widthCss = '45%' : widthCss = '44%' : widthCss = '42%';
      if (width >= 736) {
        createElementCss(linkTag, {
          margin: '10px',
          textDecoration: 'none',
          styleFloat: 'left',
          float: 'left',
          color: '#000',
          fontSize: '14px'
        });
      } else {
        createElementCss(linkTag, {
          margin: '10px',
          textDecoration: 'none',
          styleFloat: 'left',
          float: 'left',
          color: '#000',
          fontSize: '13px',
          display: 'block',
          width: widthCss
        });
      }
    };
    /* 過濾陣列重複值且需二進制數字 */
    var filterArrayRepeat = function(array) {
      var n = [];
      for (var i = 0; i < array.length; i++) {
        if (n.indexOf(array[i]) === -1 && (array[i] === 1 || array[i] === 2 || array[i] === 4)) n.push(array[i]);
      }
      return n;
    };
    /* 繁體中文 */
    var chineseTraditional = function(urlData) {
      return '親愛的使用者，為了您的資料安全及更好的使用體驗，從 ' + urlData.date + ' 起，我們將不再支援 ' + urlData.browserVersion + ' (含)以下的瀏覽器，建議您點選下面連結盡快升級安裝以下瀏覽器';
    };
    /* 簡體中文 */
    var chineseSimplified = function(urlData) {
      return '亲爱的使用者，为了您的资料安全及更好的使用体验，从 ' + urlData.date + ' 起，我们将不再支援 ' + urlData.browserVersion + ' (含)以下的浏览器，建议您点选下面连结尽快升级安装以下浏览器';
    };
    /* 英文 */
    var english = function(urlData) {
      // 未輸入 date_en 參數防呆機制會取 date 參數
      var enDate = urlData.date_en || urlData.date;
      return 'After ' + enDate + ' we will stop support ' + urlData.browserVersion + ' and older versions. For your security and better browsing experience, please update your browser. Install one of the following browsers.';
    };
    /* 顯示的語言 */
    var languageBitand = function(urlData, outerFrame) {
      var showLanguageArr = [];
      var p_tw = chineseTraditional(urlData);
      var p_cn = chineseSimplified(urlData);
      var p_us = english(urlData);
      if (urlData.language instanceof Array) {
        var newArr = filterArrayRepeat(urlData.language);
        if (newArr.length === 0) {
          showLanguageArr.push(p_tw);
        } else {
          for (var x = 0; x < newArr.length; x++) {
            if (x === 0 && newArr[0] === 4) browserLink = linkData.en_us;
            switch (newArr[x]) {
              case 1:
                showLanguageArr.push(p_tw);
                break;
              case 2:
                showLanguageArr.push(p_cn);
                break;
              case 4:
                showLanguageArr.push(p_us);
                break;
            }
          }
        }
      } else {
        // 目前只有1、2、4沒有8，所以8是為了做使用者亂輸入數字所做的防呆機制，大於8會固定顯示繁中
        // 未輸入 language 參數的防呆機制顯示繁中
        if ((urlData.language & 1) === 1 || urlData.language >= 8 || !urlData.language) showLanguageArr.push(p_tw);
        if ((urlData.language & 2) === 2 && urlData.language < 8) showLanguageArr.push(p_cn);
        if ((urlData.language & 4) === 4 && urlData.language < 8) showLanguageArr.push(p_us);
        if (urlData.language === 4) browserLink = linkData.en_us;
      }
      // array.map 方法 IE8 以下不支援，所以用 for 迴圈方法
      for (var i = 0; i < showLanguageArr.length; i++) {
        var p = createElementTag('p');
        var p_Text = document.createTextNode(showLanguageArr[i]);
        (i === 0) ? languageCssＭain(p) : languageCssSecondary(p);
        p.appendChild(p_Text);
        outerFrame.appendChild(p);
      }
    };
    /* 自訂關閉扭 function */
    var closeFun = function(callback) {
      if (typeof callback !== 'function') {
        console.log('browser.min.js帶入closeFun格式錯誤，請帶入function格式');
        return 'browser.min.js帶入closeFun格式錯誤，請帶入function格式';
      } else {
        callback();
        return '成功執行callback';
      }
    };
    /* 視窗寬度 RWD */
    var windowWidth = function(urlData, outerFrame, browserSupport, linkTag) {
      var bodyWidth = document.body.clientWidth;
      if (bodyWidth <= 360) {
        if (outerFrame) outerFrameCss(outerFrame, 360);
        if (browserSupport) browserSupportCss(browserSupport, 360, urlData);
        if (linkTag) linkTagCss(linkTag, 360);
      } else if (bodyWidth <= 414) {
        if (outerFrame) outerFrameCss(outerFrame, 414);
        if (browserSupport) browserSupportCss(browserSupport, 414, urlData);
        if (linkTag) linkTagCss(linkTag, 414);
      } else if (bodyWidth <= 480) {
        if (outerFrame) outerFrameCss(outerFrame, 480);
        if (browserSupport) browserSupportCss(browserSupport, 480, urlData);
        if (linkTag) linkTagCss(linkTag, 480);
      } else if (bodyWidth <= 736) {
        if (outerFrame) outerFrameCss(outerFrame, 736);
        if (browserSupport) browserSupportCss(browserSupport, 736, urlData);
        if (linkTag) linkTagCss(linkTag, 736);
      } else {
        if (outerFrame) outerFrameCss(outerFrame, 1024);
        if (browserSupport) browserSupportCss(browserSupport, 1024, urlData);
        if (linkTag) linkTagCss(linkTag, 1024);
      }
    };
    /* html 頁面 */
    var htmlRender = function(urlData) {
      var doc = document;

      var outerFrame = createElementTag('div');
      windowWidth('', outerFrame);

      // 顯示語言
      languageBitand(urlData, outerFrame);

      var allLinkDiv = createElementTag('div');
      createElementCss(allLinkDiv, {
        margin: '20px auto 0',
        maxWidth: '520px',
        overflow: 'hidden'
      });

      var br1 = createElementTag('br');
      var br2 = createElementTag('br');
      var br3 = createElementTag('br');
      var br4 = createElementTag('br');

      // ie 連結
      var ieLink = createElementTag('a');
      setAttributeAll(ieLink, {
        href: browserLink.ie,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: 'Internet Explorer'
      });
      windowWidth('', '', '', ieLink);

      // ie 圖
      var ieImg = createElementTag('img');
      setAttributeAll(ieImg, {
        title: 'Internet Explorer',
        alt: 'Internet Explorer',
        src: 'https://static.104.com.tw/104main/common/ie11.png',
        width: 100,
        height: 100
      });
      createElementCss(ieImg, { border: 0 });

      // ie 圖加文合併
      var ieLinkText = doc.createTextNode('Internet Explorer');
      ieLink.appendChild(ieImg);
      ieLink.appendChild(br1);
      ieLink.appendChild(ieLinkText);

      // chrome 連結
      var chromeLink = createElementTag('a');
      setAttributeAll(chromeLink, {
        href: browserLink.chrome,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: 'Chrome'
      });
      windowWidth('', '', '', chromeLink);

      // chrome 圖
      var chromeImg = createElementTag('img');
      setAttributeAll(chromeImg, {
        title: 'Chrome',
        alt: 'Chrome',
        src: 'https://static.104.com.tw/104main/common/chrome.png',
        width: 101,
        height: 100
      });
      createElementCss(chromeImg, { border: 0 });

      // chrome 圖加文合併
      var chromeLinkText = doc.createTextNode('Chrome');
      chromeLink.appendChild(chromeImg);
      chromeLink.appendChild(br2);
      chromeLink.appendChild(chromeLinkText);

      // safari 連結
      var safariLink = createElementTag('a');
      setAttributeAll(safariLink, {
        href: browserLink.safari,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: 'Safari'
      });
      windowWidth('', '', '', safariLink);

      // safari 圖
      var safariImg = createElementTag('img');
      setAttributeAll(safariImg, {
        title: 'Safari',
        alt: 'Safari',
        src: 'https://static.104.com.tw/104main/common/safari.png',
        width: 100,
        height: 100
      });
      createElementCss(safariImg, { border: 0 });

      // safari 圖加文合併
      var safariLinkText = doc.createTextNode('Safari');
      safariLink.appendChild(safariImg);
      safariLink.appendChild(br3);
      safariLink.appendChild(safariLinkText);

      // firefox 連結
      var firefoxLink = createElementTag('a');
      setAttributeAll(firefoxLink, {
        href: browserLink.firefox,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: 'Firefox'
      });
      windowWidth('', '', '', firefoxLink);

      // firefox 圖
      var firefoxImg = createElementTag('img');
      setAttributeAll(firefoxImg, {
        title: 'Firefox',
        alt: 'Firefox',
        src: 'https://static.104.com.tw/104main/common/firefox.png',
        width: 107,
        height: 100
      });
      createElementCss(firefoxImg, { border: 0 });

      // firefox 圖加文合併
      var firefoxLinkText = doc.createTextNode('Firefox');
      firefoxLink.appendChild(firefoxImg);
      firefoxLink.appendChild(br4);
      firefoxLink.appendChild(firefoxLinkText);

      // 四張圖文合併
      if (!isMobileDevice) allLinkDiv.appendChild(ieLink);
      allLinkDiv.appendChild(chromeLink);
      if ((!isMobileDevice) || (isMobileDevice && isIOS)) allLinkDiv.appendChild(safariLink);
      allLinkDiv.appendChild(firefoxLink);

      // 顯示四張連結圖
      outerFrame.appendChild(allLinkDiv);

      // 最外層
      var browserSupport = createElementTag('div');
      setAttributeAll(browserSupport, {
        id: 'bsOverlay'
      });
      createElementCss(browserSupport, {
        background: '#eee',
        borderTop: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        letterSpacing: '1px',
        lineHeight: '1.5',
        textAlign: 'center',
        display: 'block'
      });

      var closeSpan = createElementTag('span');
      setAttributeAll(closeSpan, {
        title: '關閉'
      });
      createElementCss(closeSpan, {
        styleFloat: 'right',
        float: 'right',
        marginRight: '20px',
        marginTop: '10px',
        cursor: 'pointer'
      });
      closeSpan.onclick = function() {
        if(urlData.closeFun) { // 如有自訂關閉function，則執行
          closeFun(urlData.closeFun);
        }
        if (urlData.appendId && doc.getElementById(urlData.appendId)) {
          doc.getElementById(urlData.appendId).removeChild(browserSupport);
        } else {
          doc.body.removeChild(browserSupport);
        }
        var browserCookie = getCookie('browserSupportTime');
        if (urlData.closeCookieTime && browserCookie === null) setCookie(urlData.closeCookieTime);
      };

      var closeImg = createElementTag('img');
      setAttributeAll(closeImg, {
        src: 'https://static.104.com.tw/104main/common/browser-close.png',
        title: '關閉'
      });
      createElementCss(closeImg, {
        verticalAlign: 'middle',
        width: '30px'
      });

      closeSpan.appendChild(closeImg);

      if (urlData.fixedHeight) {
        windowWidth(urlData, '', browserSupport);
      }

      browserSupport.appendChild(closeSpan);
      browserSupport.appendChild(outerFrame);

      if (doc.body) {
        if (!appendChildBody) {
          appendChildBody = true;
          if (urlData.appendId && doc.getElementById(urlData.appendId)) {
            doc.getElementById(urlData.appendId).appendChild(browserSupport);
          } else {
            var first = doc.body.firstChild;
            doc.body.insertBefore(browserSupport, first);
          }
        }
      }
    };
    /* 取引入檔案後面的參數 */
    var getSrcVars = function() {
      if (!document.getElementById('browser-support-alert')) {
        console.log('browser.min.js找不到id browser-support-alert');
        return 'browser.min.js找不到id browser-support-alert';
      }
      var vars = {}, hash, more;
      var scriptsId = document.getElementById('browser-support-alert');
      var srcVal = scriptsId.getAttribute('src');
      var hashes = srcVal.slice(srcVal.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if(hash[0] === 'support' || hash[0] === 'lowest') {
          more = hash[1].split(',');
          vars[hash[0]] = more;
        } else {
          vars[hash[0]] = hash[1];
        }
      }
      return vars;
    };
    /* 判斷值 */
    var checkUrlData = function(urldata) {
      if (!urldata || !urldata.support || !urldata.lowest || !urldata.date || !urldata.browserVersion) {
        return false;
      }
      return true;
    };
    /* 寫入 cookie */
    var setCookie = function(time) {
      expire_days = time; // 指定天數或今晚
      var d = new Date();
      if (typeof expire_days === 'string' && expire_days === 'tonight') {
        d.setTime(d.getTime() + getExpireTime());
      } else if (typeof expire_days === 'number') {
        d.setTime(d.getTime() + (expire_days * 24 * 60 * 60 * 1000));
      } else {
        console.log('browser.min.js帶入closeCookieTime參數格式錯誤');
        return 'browser.min.js帶入closeCookieTime參數格式錯誤';
      }
      var expires = d.toGMTString();
      document.cookie = 'browserSupportTime=' + d + ';expires=' + expires + ';path=/';
    };
    /* 讀取 cookie */
    var getCookie = function(name) {
      var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
      if (arr != null) return unescape(arr[2]);
      return null;
    };
    /* 刪除 cookie */
    var delCookie = function() {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var expires = exp.toGMTString();
      var cval = getCookie('browserSupportTime');
      if (cval != null) document.cookie = 'browserSupportTime=;expires=' + expires;
    };
    /* 現在距離當天結束時間 */
    var getExpireTime = function() {
      var date = new Date();
      var hour = 23 - date.getHours();
      var min = 59 - date.getMinutes();
      var sec = 59 - date.getSeconds();
      var ms = (3600 * hour + 60 * min + sec) * 1000;
      return ms;
    };
    /* 執行 */
    var run = function(urlData) {
      var nowVersion = getVersion();
      var urlDataValue = checkUrlData(urlData);
      if (!urlDataValue) {
        console.log('browser.min.js參數輸入不完全');
        return 'browser.min.js參數輸入不完全';
      } else if (urlData.support.length !== urlData.lowest.length) {
        console.log('browser.min.js參數輸入錯誤');
        return 'browser.min.js參數輸入錯誤';
      } else {
        for (var i = 0; i < urlData.support.length; i++) {
          if (!urlData.support[i] || !urlData.lowest[i]) continue;
          if (detectBrowser.mobileDevice) isMobileDevice = true;
          if (detectBrowser.android) isAndroid = true;
          if (detectBrowser.ios) isIOS = true;
          if (detectBrowser[urlData.support[i]] && parseInt(nowVersion) <= parseInt(urlData.lowest[i])) {
            htmlRender(urlData);
            return '成功執行htmlRender';
          }
        }
      }
    };
    /* 執行 */
    var execution = function(browserObj) {
      var browserCookie = getCookie('browserSupportTime');
      var browserId = document.getElementById('browser-support-alert');
      var browserIdVars = (browserId) ? getSrcVars() : '';
      browserData = browserObj || browserIdVars;

      if (browserObj) {
        if (browserObj.onlyOneShow && typeof browserObj.onlyOneShow === 'boolean') { // 不管有沒有按關閉都只顯示一次
          if (!browserObj.closeCookieTime) { // 需傳 closeCookieTime 值防呆
            console.log('browser.min.js未傳入參數 closeCookieTime');
            return 'browser.min.js未傳入參數 closeCookieTime';
          } else if (browserCookie === null) {
            setCookie(browserObj.closeCookieTime);
            return run(browserObj);
          }
        } else if (!browserObj.closeCookieTime || (browserObj.closeCookieTime && browserCookie === null)) { // 一直顯示或按關閉後不顯示
          if (!browserObj.closeCookieTime) delCookie();
          return run(browserObj);
        }
      } else {
        if (!browserId) { // 1.0 方式傳入
          console.log('browser.min.js找不到id browser-support-alert');
          return 'browser.min.js找不到id browser-support-alert';
        } else {
          return run(getSrcVars());
        }
      }
    };
    /* init */
    var init = function(browserObj) {
      window.onload = function() {
        execution(browserObj);
        return '成功執行init';
      }
    };
    /* 查詢 browser support 狀態 */
    var browserSupportStatusLog = function() {
      var obj = {
        appendChildBody: appendChildBody,
        isMobileDevice: isMobileDevice,
        isAndroid: isAndroid,
        isIOS: isIOS,
        userAgent: userAgent,
        browserData: browserData,
        browserLink: linkData,
        browserVersion: getVersion(),
        userAgentBrowser: userAgentMatch(userAgent)
      };
      console.log('browserSupportStatusLog', obj);
    };

    return {
      init: init,
      userAgentMatch: userAgentMatch,
      getVersion: getVersion,
      getBrowser: getBrowser,
      getSrcVars: getSrcVars,
      run: run,
      closeFun: closeFun,
      browserSupportStatusLog: browserSupportStatusLog,
      delCookie: delCookie
    };
  }
));