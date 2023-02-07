(function(window, name, definition) {
  if(!window[name]) {
    window[name] = definition();
  }
  window.onload = function() {
    window[name].init();
  }
}(window, 'commonBrowser104', function() {
    /* 取用戶代理 */
    var userAgent = window.navigator.userAgent;
    /* 取瀏覽器與版本號 */
    var userAgentMatch = function(ua) {
      if(!ua) {
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
      mobileDevice: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    };
    /* 關閉 */
    var browserSupportClose = function() {
      document.getElementById('browserSupport').style.display = 'none';
    };
    /* html頁面 */
    var htmlRender = function(date, browserVersion, fixedHeight) {
      var fixedStyle = (fixedHeight) ? ' position: fixed; z-index: 10000; left: 0; top: ' + fixedHeight + ';' : '';
      var fixedClose = (fixedHeight) ? '<span title="關閉" id="browserSupportClose" style="float: right; margin-right: 20px; margin-top:10px; cursor: pointer;"><img src="https://static.104.com.tw/104main/common/close-icon.png" style="vertical-align: middle; width: 13px;" title="關閉" /> 關閉</span>' : '';
      var html = '<div id="browserSupport" style="background: #eee; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; font-family: Arial, sans-serif; width: 100%; letter-spacing: 1px; line-height: 1.5; text-align: center;' + fixedStyle + '">'
              + fixedClose + '<div style="max-width: 960px; margin: 0 auto; padding: 5px 20px 10px; text-align: center; overflow: hidden;">'
              + '<h2 style="font-size: 19px; color: #c74708; font-weight: bold; margin-top: 5px; line-height: 1.5;">親愛的使用者，為了您的資料安全及更好的使用體驗，從 ' + date + ' 起，我們將不再支援 ' + browserVersion + ' (含)以下的瀏覽器，建議您點選下面連結盡快升級安裝以下瀏覽器</h2>'
              + '<div style="margin: 20px auto 0; max-width: 510px; overflow: hidden;">'
              + '<a target="_blank" href="https://support.microsoft.com/zh-tw/help/17621/internet-explorer-downloads" rel="noopener noreferrer" title="Internet Explorer" style="margin: 10px; text-decoration: none; float: left; color: #000; font-size: 14px;">'
              + '<img src="https://static.104.com.tw/104main/common/ie11.png" alt="Internet Explorer" title="Internet Explorer" width="100" height="100" style="border: 0px;" /><br />Internet Explorer</a>'
              + '<a target="_blank" href="https://www.google.com.tw/chrome/browser/desktop/index.html" rel="noopener noreferrer" title="Chrome" style="margin: 10px; text-decoration: none; float: left; color: #000; font-size: 14px;">'
              + '<img src="https://static.104.com.tw/104main/common/chrome.png" alt="Chrome" title="Chrome" width="101" height="100" style="border: 0px;" /><br />Chrome</a>'
              + '<a target="_blank" href="https://www.apple.com/tw/safari/" rel="noopener noreferrer" title="Safari" style="margin: 10px; text-decoration: none; float: left; color: #000; font-size: 14px;">'
              + '<img src="https://static.104.com.tw/104main/common/safari.png" alt="Safari" title="Safari" width="100" height="100" style="border: 0px;" /><br />Safari</a>'
              + '<a target="_blank" href="https://www.mozilla.org/zh-TW/firefox/new/" rel="noopener noreferrer" title="Firefox" style="margin: 10px; text-decoration: none; float: left; color: #000; font-size: 14px;">'
              + '<img src="https://static.104.com.tw/104main/common/firefox.png" alt="Firefox" title="Firefox" width="107" height="100" style="border: 0px;" /><br />Firefox</a>'
              + '</div></div></div>';

      if(document.body) {
        if(!document.getElementById('browserSupport')) document.body.innerHTML = html + document.body.innerHTML;
      }

      if(fixedHeight) {
        var closeButtonId = document.getElementById('browserSupportClose');
        if(window.attachEvent) { /* for IE */
          closeButtonId.attachEvent('onclick', browserSupportClose);
        } else if(window.addEventListener) {
          closeButtonId.addEventListener('click', browserSupportClose);
        }
      }
    };
    /* 取引入檔案後面的參數 */
    var getSrcVars = function() {
      var vars = {}, hash, more;
      var scriptsId = document.getElementById('browser-support-alert');
      var srcVal = scriptsId.getAttribute('src');
      var hashes = srcVal.slice(srcVal.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++) {
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
    /* 執行 */
    var run = function(urldata) {
      window.onload = function() {
        var nowVersion = getVersion();
        var fixedHeight = (urldata.fixedHeight) ? urldata.fixedHeight : '';
        if(!urldata || !urldata.support || !urldata.lowest || !urldata.date || !urldata.browserVersion) {
          console.log('browser.min.js參數輸入不完全');
          return 'browser.min.js參數輸入不完全';
        } else if(urldata && urldata.support.length !== urldata.lowest.length) {
          console.log('browser.min.js參數輸入錯誤');
          return 'browser.min.js參數輸入錯誤';
        } else {
          for(var i = 0; i < urldata.support.length; i++) {
            if(!urldata.support[i] || !urldata.lowest[i]) continue;
            if(detectBrowser[urldata.support[i]] && parseInt(nowVersion) <= parseInt(urldata.lowest[i])) {
              htmlRender(urldata.date, urldata.browserVersion, fixedHeight);
              return '成功執行htmlRender';
            }
          }
        }
      }
    };
    /* init */
    var init = function() {
      var browserId = document.getElementById('browser-support-alert');
      if(!browserId) {
        console.log('browser.min.js找不到id browser-support-alert');
        return 'browser.min.js找不到id browser-support-alert';
      } else {
        return run(getSrcVars());
      }
    };

    return {
      init: init,
      userAgentMatch: userAgentMatch,
      getVersion: getVersion,
      getBrowser: getBrowser,
      getSrcVars: getSrcVars,
      run: run
    };
  }
));