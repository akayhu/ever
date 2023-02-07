import React, { Component } from 'react';
import clientConfig from 'src/configs/client';

const renewTime = global.latestPRenewTime;
const gaCode = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${clientConfig.params.GTMID}');`;
const fbCode = "(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s);js.id = id;js.src = '//connect.facebook.net/zh_TW/all.js?version=v2.7';fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));";
const logApiCode = `var _elog = _elog||[];(function(){var SRV_104i_STATIC_ROOT = window.SRV_104i_STATIC_ROOT||'${clientConfig.params.staticUrl}/104i';var elog = document.createElement('script');elog.type = 'text/javascript';elog.id = 'logjsapi';elog.async = true;elog.src = SRV_104i_STATIC_ROOT+'/js/api/log/e104.log.latest.js?v=20140327 ';var statusQueue = [];elog.onreadystatechange = function() {statusQueue.push(this.readyState);if (this.readyState === 'loaded' && !Array.prototype.indexOf) {var testString = new RegExp('interactive');if (!testString.test(statusQueue.join(','))) {if (_elog[0] && _elog[0].callback && typeof _elog[0].callback === 'function') {_elog[0].callback.call(this);}}}};elog.onerror = function() {if (_elog[0] && _elog[0].callback && typeof _elog[0].callback === 'function') {_elog[0].callback.call(this);}};var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(elog, s);})();`;

const commonMetaData = () => ([
	<meta key="UTF-8" charSet="UTF-8" />,
	<meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0" />,
	<meta key="X-UA-Compatible" httpEquiv="X-UA-Compatible" content="IE=edge" />,
	<meta key="cache-control" httpEquiv="cache-control" content="no-store, no-cache, post-check=0, pre-check=0" />,
	<meta key="pragma" httpEquiv="pragma" content="no-cache" />,
	<meta key="expires" httpEquiv="expires" content="-1" />,
	<meta key="og:ttl" property="og:ttl" content="345600" />,
	<meta key="og:type" property="og:type" content="website" />,
	<meta key="og:site_name" property="og:site_name" content="104 職涯社群" />,
	<meta key="google-site-verification" name="google-site-verification" content="lK0uOjYblrkGJHOnGSF2ayvDh-epbyzfLAmii8x823s" />,
	<meta key="msvalidate.01" name="msvalidate.01" content="8726D5AD7B78D431596FA6BB030C3605" />,
	<meta key="fb-pages" property="fb:pages" content="277429262382774" />,
]);

const commonScript = (browserDataCode, envCode, reduxState) => ([
	<script key="browser.2.0.min" type="text/javascript" src={ `${clientConfig.params.staticUrl}/104main/common/browser.2.0.min.js?_=${renewTime}` } />,
	<script key="envCode" dangerouslySetInnerHTML={ {__html: envCode} } />,
	<script key="gaCode" type="text/javascript" dangerouslySetInnerHTML={ {__html: gaCode} } />,
	<script key="reduxState" type="application/json" id="reduxState" charSet="utf-8" dangerouslySetInnerHTML={ {__html: reduxState} } />,
	<script key="startsWith" type="text/javascript" src={ `${clientConfig.params.staticWapUrl}/js/startsWith.js?_=${renewTime}` } />,
	<script key="modernizr" type="text/javascript" src={ `${clientConfig.params.staticWapUrl}/js/modernizr.js?_=${renewTime}` } />,
	<script key="jquery-3.1.0.min" type="text/javascript" src={ `${clientConfig.params.staticWapUrl}/js/jquery-3.1.0.min.js?_=${renewTime}` } />,
	<script key="jquery-ui.min" type="text/javascript" src={ `${clientConfig.params.staticWapUrl}/js/jquery-ui.min.js?_=${renewTime}` } />,
	<script key="jsonJobCat" type="text/javascript" src={ `${clientConfig.params.e104Url}/public/function01/utf8/jsonJobCat.js?_=${renewTime}` } />,
	<script key="e104menu2011" type="text/javascript" src={ `${clientConfig.params.e104Url}/public/function01/menu/js/e104menu2011.js?_=${renewTime}` } />,
	<script key="lib" type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/lib.js?_=${renewTime}` } />,
	<script key="client" type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/c_platform/client.js?_=${renewTime}` } />,
	<script key="c_platform_en" type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/c_platform_en.js?_=${renewTime}` } />,
	<script key="c_platform_zhTW" type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/c_platform_zhTW.js?_=${renewTime}` } />,
	<script key="_en" type="text/javascript" src={ `${clientConfig.params.staticWapUrl}/build/${clientConfig.name}_en.js?_=${renewTime}` } />,
	<script key="_zhTW" type="text/javascript" src={ `${clientConfig.params.staticWapUrl}/build/${clientConfig.name}_zhTW.js?_=${renewTime}` } />,
	<script key="_bundle" type="text/javascript" src={ `${clientConfig.params.staticWapUrl}/build/${clientConfig.name}_bundle.js?_=${renewTime}` } />,
	<script key="announcementContent" type="text/javascript" src={ `${clientConfig.params.staticUrl}/plus/js/announcementContent.js?_=${renewTime}` } />,
	<noscript key="noscript"><iframe src={ `//www.googletagmanager.com/ns.html?id=${clientConfig.params.GTMID}` } height="0" width="0" style={ {display: 'none', visibility: 'hidden'} } /></noscript>,
	<script key="fbCode" dangerouslySetInnerHTML={ {__html: fbCode} } />,
	<script key="logApiCode" dangerouslySetInnerHTML={ {__html: logApiCode} } />,
	<script key="browserDataCode" dangerouslySetInnerHTML={ {__html: browserDataCode} } />
]);

const commonLink = () => ([
	<link key="reset" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/reset.css?_=${renewTime}` } />,
	<link key="icon" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/icon/icon.css?_=${renewTime}` } />,
	<link key="button" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/button.css?_=${renewTime}` } />,
	<link key="dropdown" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/dropdown.css?_=${renewTime}` } />,
	<link key="transition" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/transition.css?_=${renewTime}` } />,
	<link key="loader" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/loader.css?_=${renewTime}` } />,
	<link key="dimmer" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/dimmer.css?_=${renewTime}` } />,
	<link key="platformDraft" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/draft.css?_=${renewTime}` } />,
	<link key="cropper" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/cropper.css?_=${renewTime}` } />,
	<link key="componentcommon" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/componentcommon.css?_=${renewTime}` } />,
	<link key="staticPlatformGlobal" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/global.css?_=${renewTime}` } />,
	<link key="staticWapDraft" rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/css/draft.css?_=${renewTime}` } />,
	<link key="staticWapGlobal" rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/css/global.css?_=${renewTime}` } />,
	<link key="category_org" rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/css/category_org.css?_=${renewTime}` } />,
	<link key="client" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/build/c_platform/client.css?_=${renewTime}` } />,
	<link key="favicon" rel="shortcut icon" href={ `${clientConfig.params.staticWapUrl}/favicon.ico` } />,
	<link key="search" rel="search" href={ `${clientConfig.params.wapUrl}/opensearch.xml` } type="application/opensearchdescription+xml" title="104 職涯社群搜尋" />
]);

export { commonScript, commonLink, commonMetaData };
