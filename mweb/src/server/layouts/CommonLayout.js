import React from 'react';
import clientConfig from 'src/configs/client';

const renewTime = global.latestPRenewTime;

const commonMetaData = () => ([
	<meta key="language" name="language" content="zh-tw" />,
	<meta key="charSet" charSet="UTF-8" />,
	<meta key="apple-itunes-app" name="apple-itunes-app" content="app-id=770520900, app-argument=m104plus://switch" />,
	<meta key="google-play-app" name="google-play-app" content="app-id=com.m104plus" />,
	<meta key="viewport" name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />,
	<meta key="X-UA-Compatible" httpEquiv="X-UA-Compatible" content="IE=edge" />,
	<meta key="cache-control" httpEquiv="cache-control" content="no-store, no-cache, post-check=0, pre-check=0" />,
	<meta key="pragma" httpEquiv="pragma" content="no-cache" />,
	<meta key="expires" httpEquiv="expires" content="-1" />,
	<meta key="og:ttl" property="og:ttl" content="345600" />,
	<meta key="og:site_name" property="og:site_name" content="104 職涯社群" />,
	<meta key="google-site-verification" name="google-site-verification" content="lK0uOjYblrkGJHOnGSF2ayvDh-epbyzfLAmii8x823s" />,
	<meta key="msvalidate" name="msvalidate.01" content="8726D5AD7B78D431596FA6BB030C3605" />,
	<meta key="fb-pages" property="fb:pages" content="277429262382774" />,
]);

const commonScript = (reduxStateStr) => {
	const reduxState = JSON.parse(reduxStateStr);
	const xsrfCode = 'if(top!=self){top.location=encodeURI(self.location);}';
	const envCode = `window.env='${clientConfig.env}';window.GAID='${clientConfig.params.GAID}';window.latestPRenewTime = ${renewTime};window.latestWRenewTime = ${renewTime};window.dataLayer=[{pid:${reduxState.user.pid},isLogin:${reduxState.user.isLogin}}];`;
	const gaCode = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${clientConfig.params.GTMID}');`;
	const fbCode = "(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = '//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.7&appId=764801763582382';fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));";
	const logApiCode = `var _elog = _elog||[];(function(){var SRV_104i_STATIC_ROOT = window.SRV_104i_STATIC_ROOT||'${clientConfig.params.staticUrl}/104i';var elog = document.createElement('script');elog.type = 'text/javascript';elog.id = 'logjsapi';elog.async = true;elog.src = SRV_104i_STATIC_ROOT+'/js/api/log/e104.log.latest.js?v=20140327 ';var statusQueue = [];elog.onreadystatechange = function() {statusQueue.push(this.readyState);if (this.readyState === 'loaded' && !Array.prototype.indexOf) {var testString = new RegExp('interactive');if (!testString.test(statusQueue.join(','))) {if (_elog[0] && _elog[0].callback && typeof _elog[0].callback === 'function') {_elog[0].callback.call(this);}}}};elog.onerror = function() {if (_elog[0] && _elog[0].callback && typeof _elog[0].callback === 'function') {_elog[0].callback.call(this);}};var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(elog, s);})();`;
	const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'Safari 4 及 Chrome 37',lowest:[37,4],support:['chrome','safari'],fixedHeight: '0px'});`;

	return ([
		<script key="browser.2.0.min" type="text/javascript" src={ `${clientConfig.params.staticUrl}/104main/common/browser.2.0.min.js?_=${renewTime}` } />,
		<script key="xsrfCode" dangerouslySetInnerHTML={ {__html: xsrfCode} } />,
		<script key="envCode" dangerouslySetInnerHTML={ {__html: envCode} } />,
		<script key="reduxState" type="application/json" id="reduxState" charSet="utf-8" dangerouslySetInnerHTML={ {__html: reduxStateStr} } />,
		<script key="adsbygoogle" async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />,
		<script key="modernizr" type="text/javascript" src={ `${clientConfig.params.staticMWapUrl}/js/modernizr.js?_=${renewTime}` } />,
		<script key="jquery-3.1.0.min" type="text/javascript" src={ `${clientConfig.params.staticMWapUrl}/js/jquery-3.1.0.min.js?_=${renewTime}` } />,
		<script key="jquery-ui.min" type="text/javascript" src={ `${clientConfig.params.staticMWapUrl}/js/jquery-ui.min.js?_=${renewTime}` } />,
		<script key="jsonJobCat" type="text/javascript" src={ `${clientConfig.params.e104Url}/public/function01/utf8/jsonJobCat.js?_=${renewTime}` } />,
		<script key="e104menu2011" type="text/javascript" src={ `${clientConfig.params.e104Url}/public/function01/menu/js/e104menu2011.js?_=${renewTime}` } />,
		<script key="lib" type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/lib.js?_=${renewTime}` } />,
		<script key="client" type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/c_platform/client.js?_=${renewTime}` } />,
		<script key="_en" type="text/javascript" src={ `${clientConfig.params.staticMWapUrl}/build/${clientConfig.name}_en.js?_=${renewTime}` } />,
		<script key="_zhTW" type="text/javascript" src={ `${clientConfig.params.staticMWapUrl}/build/${clientConfig.name}_zhTW.js?_=${renewTime}` } />,
		<script key="_bundle" type="text/javascript" src={ `${clientConfig.params.staticMWapUrl}/build/${clientConfig.name}_bundle.js?_=${renewTime}` } />,
		<script key="welcomeInit" type="text/javascript" src={ `${clientConfig.params.staticMWapUrl}/js/welcomeInit.js?_=${renewTime}` } />,
		<noscript key="noscript"><iframe src={ `//www.googletagmanager.com/ns.html?id=${clientConfig.params.GTMID}` } height="0" width="0" style={ {display: 'none', visibility: 'hidden'} } /></noscript>,
		<script key="gaCode" type="text/javascript" dangerouslySetInnerHTML={ {__html: gaCode} } />,
		<script key="fbCode" dangerouslySetInnerHTML={ {__html: fbCode} } />,
		<script key="logApiCode" dangerouslySetInnerHTML={ {__html: logApiCode} } />,
		<script key="browserDataCode" dangerouslySetInnerHTML={ {__html: browserDataCode} } />,
		<script key="announcementContent" type="text/javascript" src={ `${clientConfig.params.staticUrl}/plus/js/announcementContent.js?_=${renewTime}` }></script>
	]);
};

const commonLink = () => (
	[
		<link key="shortcut" rel="shortcut icon" type="image/png" href={ `${clientConfig.params.staticMWapUrl}/favicon.ico` } />,
		<link key="icon" rel="icon" type="image/png" href={ `${clientConfig.params.staticMWapUrl}/favicon.ico` } />,
		<link key="apple-touch-icon-60" rel="apple-touch-icon" type="image/png" href={ `${clientConfig.params.staticMWapUrl}/img/favicon/fav_60.png` } />,
		<link key="apple-touch-icon-76" rel="apple-touch-icon" type="image/png" sizes="76x76" href={ `${clientConfig.params.staticMWapUrl}/img/favicon/fav_76.png` } />,
		<link key="apple-touch-icon-120" rel="apple-touch-icon" type="image/png" sizes="120x120" href={ `${clientConfig.params.staticMWapUrl}/img/favicon/fav_120.png` } />,
		<link key="apple-touch-icon-152" rel="apple-touch-icon" type="image/png" sizes="152x152" href={ `${clientConfig.params.staticMWapUrl}/img/favicon/fav_152.png` } />,
		<link key="reset" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/reset.css?_=${renewTime}` } />,
		<link key="icon-css" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/icon/icon.css?_=${renewTime}` } />,
		<link key="button" rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/button.css?_=${renewTime}` } />,
		<link key="staticWapDraft" rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/css/ui/draft.css?_=${renewTime}` } />,
		<link key="staticWapGlobal" rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/css/global.css?_=${renewTime}` } />,
		<link key="welcome834" rel="stylesheet" href={ `${clientConfig.params.staticMWapUrl}/css/welcome834.css?_=${renewTime}` } />,
		<link key="unsubscribe" rel="stylesheet" href={ `${clientConfig.params.staticMWapUrl}/css/unsubscribe.css?_=${renewTime}` } />,
	]
);

export { commonScript, commonLink, commonMetaData };
