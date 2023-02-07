'use strict';

import React, { Component } from 'react';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonMetaData, commonScript, commonLink } from './CommonLayout';

class IndexLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const renewTime = global.latestPRenewTime;
		const reduxState = this.props.reduxState;
		if (reduxState.entities) {
			for (const entity in reduxState.entities) {
				for (const item in reduxState.entities[entity]) {
					reduxState.entities[entity][item].hasLoaded = false;
				}
			}
		}
		const CommonMetaData = commonMetaData();
		const CommonScript = commonScript(serialize(reduxState, {isJSON: true}));
		const CommonLink = commonLink();

		return (
			<html lang="zh-Hant">
				<head>
					<title>{this.props.title ? this.props.title : '104 職涯社群'}</title>
					{ CommonMetaData }
					<meta name="description" content="在 104 職涯社群，你將可以看到同職類或相關職類專業人才都在關注哪些產業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你平日在個人頁或社團熱情分享與專業見解、在展示櫥窗上傳影音等作品，讓更多人肯定你的專業，看見你的智慧、經驗及氣度，進而與對你職涯有幫助的貴人不期而遇，發掘更多潛在機會。" />
					<meta property="og:title" content="104職涯社群｜專業人才交流分享平台！" />
					<meta property="og:url" content={ `https:${clientConfig.params.wapUrl}` } />
					<meta property="og:type" content="website" />
					<meta property="og:image" content={ `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:description" content="在 104 職涯社群，你將可以看到同職類或相關職類會員們都在關注哪些專業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你的熱情分享與專業見解、在展示櫥窗上傳影音等作品，，讓更多人肯定你的專業，讓眾人看到你的智慧、經驗及氣度，進而與對你職涯有裨益的貴人不期而遇，發掘更多潛在機會。" />
					{ CommonLink }
					<link rel="canonical" href={ `https:${clientConfig.params.wapUrl}` } />
					{(clientConfig.env !== 'dev') && <link rel="stylesheet" href={ `${clientConfig.params.staticMWapUrl}/build/${clientConfig.name}.css?_=${renewTime}` } />}
					
				</head>
				<body className="ui dimmable">
					<div id="root" dangerouslySetInnerHTML={ {__html: this.props.children} } />
					<div id="fb-root" />
					{ CommonScript }
				</body>
			</html>
		);
	}
}

export default IndexLayout;
