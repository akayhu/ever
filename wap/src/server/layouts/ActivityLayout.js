import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { actionActivity } from 'lib/server/controllers/ActivityController';
import { activityMeta } from 'c_platform/lib/client/actions/metadata';
import { commonScript, commonLink, commonMetaData } from './CommonLayout';

class ActivityLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const renewTime = global.latestPRenewTime;
		const envCode = `window.env='${clientConfig.env}';window.latestPRenewTime = ${global.latestPRenewTime};window.dataLayer=[{pid:${this.props.reduxState.user.pid},isLogin:${this.props.reduxState.user.isLogin}}]`;
		const activtyMetaData = this.props.reduxState.metaData && this.props.reduxState.metaData.activity ? this.props.reduxState.metaData.activity : activityMeta;
		const ogUrl = activtyMetaData.aid ? `https:${clientConfig.params.wapUrl}/activity/${activtyMetaData.aid}` : `https:${clientConfig.params.wapUrl}`;
		const title = activtyMetaData.title || '文章';
		const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'IE10',lowest:['10'],support:['ie'],fixedHeight:'59px'});`;
		const reduxState = serialize(this.props.reduxState, {isJSON: true});
		const CommonScript = commonScript(browserDataCode, envCode, reduxState);
		const CommonLink = commonLink();
		const CommonMetaData = commonMetaData();
		const defaultDescription = '在 104 職涯社群，你將可以看到同職類或相關職類專業人才都在關注哪些產業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你平日在個人頁或社團熱情分享與專業見解、在展示櫥窗上傳影音等作品，讓更多人肯定你的專業，看見你的智慧、經驗及氣度，進而與對你職涯有幫助的貴人不期而遇，發掘更多潛在機會。';
		console.log('activtyMetaData', activtyMetaData);
		console.log('this.props.reduxState', this.props.reduxState);

		// TODO remove one draft.css
		return (
			<html lang="zh-Hant-TW">
				<head>
					<title>{ `${title} - 104 職涯社群` }</title>
					{ CommonMetaData }
					<meta name="description" content={ activtyMetaData.description.substr(0, 150) || defaultDescription } />
					<meta name="author" content={ activtyMetaData.author || '104 職涯社群' } />
					<meta property="og:title" content={ `${title} - 104 職涯社群` } />
					<meta property="og:url" content={ ogUrl } />
					<meta property="og:type" content="article" />
					<meta property="og:image" content={ activtyMetaData.image ? `https:${activtyMetaData.image}` : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:description" content={ activtyMetaData.description.substr(0, 150) || defaultDescription } />
					<meta property="article:published_time" content={ activtyMetaData.datePublished } />
					<link rel="canonical" href={ `https:${clientConfig.params.wapUrl}/activity/${activtyMetaData.aid}` } />
					<link rel="alternate" href={ `https:${clientConfig.params.wapUrl}/m/activity/${activtyMetaData.aid}` } media="only screen and (max-width: 640px)" />
					{ CommonLink }
					{ (clientConfig.env !== 'dev') && <link rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/build/${clientConfig.name}.css?_=${renewTime}` } /> }
				</head>
				<body className="ui dimmable">
					<div className="ui simple dimmer">
						<div className="ui loader" />
					</div>
					<div id="root" dangerouslySetInnerHTML={ {__html: this.props.children} } />
					<div id="fb-root" />
					{ CommonScript }
					<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
				</body>
			</html>
		);
	}
}

export default ActivityLayout;
