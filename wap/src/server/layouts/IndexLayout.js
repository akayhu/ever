import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonScript, commonLink, commonMetaData } from './CommonLayout';

class IndexLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const renewTime = global.latestPRenewTime;
		const envCode = `window.env='${clientConfig.env}';window.latestPRenewTime = ${global.latestPRenewTime};window.dataLayer=[{pid:${this.props.reduxState.user.pid},isLogin:${this.props.reduxState.user.isLogin}}]`;
		// const goCode = `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;})(window,document.documentElement,'async-hide','dataLayer',1000,{'${clientConfig.params.GOID}':true});`;
		const activtyMetaData = this.props.reduxState.metaData && this.props.reduxState.metaData.index ? this.props.reduxState.metaData.index : {};
		const userIsLogin = this.props.reduxState.user && this.props.reduxState.user.isLogin ? this.props.reduxState.user.isLogin : false;
		const browserFixed = userIsLogin ? ",fixedHeight:'59px'" : '';
		const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'IE10',lowest:['10'],support:['ie']${browserFixed}});`;
		const reduxState = serialize(this.props.reduxState, {isJSON: true});
		const CommonScript = commonScript(browserDataCode, envCode, reduxState);
		const CommonLink = commonLink();
		const CommonMetaData = commonMetaData();

		// TODO remove one draft.css
		return (
			<html lang="zh-Hant-TW">
				<head>
					<title>104 職涯社群</title>
					{ CommonMetaData }
					<meta name="description" content={ activtyMetaData.description || '在 104 職涯社群，你將可以看到同職類或相關職類專業人才都在關注哪些產業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你平日在個人頁或社團熱情分享與專業見解、在展示櫥窗上傳影音等作品，讓更多人肯定你的專業，看見你的智慧、經驗及氣度，進而與對你職涯有幫助的貴人不期而遇，發掘更多潛在機會。' } />
					<meta property="og:title" content="104 職涯社群" />
					<meta property="og:url" content={ `https:${clientConfig.params.wapUrl}` } />
					<meta property="og:image" content={ activtyMetaData.image ? `https:${activtyMetaData.image}` : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:description" content={ activtyMetaData.description || '在 104 職涯社群，你將可以看到同職類或相關職類專業人才都在關注哪些產業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你平日在個人頁或社團熱情分享與專業見解、在展示櫥窗上傳影音等作品，讓更多人肯定你的專業，看見你的智慧、經驗及氣度，進而與對你職涯有幫助的貴人不期而遇，發掘更多潛在機會。' } />
					{ CommonLink }
					{ (clientConfig.env !== 'dev') && <link rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/build/${clientConfig.name}.css?_=${renewTime}` } /> }
					<link rel="canonical" href={ `${clientConfig.params.wapUrl}` } />
					{ /* (!userIsLogin) && <script dangerouslySetInnerHTML={ {__html: goCode} } /> */ }
				</head>
				<body className="ui dimmable">
					<div className="ui simple dimmer">
						<div className="ui loader" />
					</div>
					<div id="root" dangerouslySetInnerHTML={ {__html: this.props.children} } />
					<div id="fb-root" />
					{ CommonScript }
				</body>
			</html>
		);
	}
}

export default IndexLayout;
