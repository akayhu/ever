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
    /* banner連結css */
    var linkCss = function(linkTag) {
      createElementCss(linkTag, {
        margin: '10px',
        textDecoration: 'none',
        styleFloat: 'left',
        float: 'left',
        color: '#000',
        fontSize: '14px'
      });
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
    /* 繁體中文 */
    var chineseTraditional = function(urlData) {
      return '親愛的使用者，為了您的資料安全及更好的使用體驗，從 ' + urlData.date + ' 起，我們將不再支援 ' + urlData.browserVersion + ' (含)以下的瀏覽器，建議您點選下面連結盡快升級安裝以下瀏覽器';
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
    var windowWidth = function(urlData, outerFrame, browserSupport, linkTag, bsOverlayHeight) {
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
        href: 'https://support.microsoft.com/zh-tw/help/17621/internet-explorer-downloads',
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
        href: 'https://www.google.com.tw/chrome/browser/desktop/index.html',
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
        href: 'https://www.apple.com/tw/safari/',
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
        href: 'https://www.mozilla.org/zh-TW/firefox/new/',
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

      // 顯示語言
      var p = createElementTag('p');
      var p_Text = document.createTextNode(chineseTraditional(urlData));
      languageCssＭain(p)
      p.appendChild(p_Text);
      outerFrame.appendChild(p);

      // 顯示四張連結圖
      outerFrame.appendChild(allLinkDiv);

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
    /* 執行 */
    var run = function(urlData) {
      var nowVersion = getVersion();
      var fixedHeight = (urlData.fixedHeight) ? urlData.fixedHeight : '';
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
      var browserId = document.getElementById('browser-support-alert');
      var browserIdVars = (browserId) ? getSrcVars() : '';
      browserData = browserObj || browserIdVars;

      if (browserObj) {
        return run(browserObj);
      } else {
        if (!browserId) {
          console.log('browser.min.js找不到id browser-support-alert');
          return 'browser.min.js找不到id browser-support-alert';
        } else {
          return run(getSrcVars());
        }
      }
    }
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
      browserSupportStatusLog: browserSupportStatusLog
    };
  }
));