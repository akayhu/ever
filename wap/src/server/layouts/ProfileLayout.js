import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonScript, commonLink, commonMetaData } from './CommonLayout';
import { profileMeta } from 'c_platform/lib/client/actions/metadata';

class ActivityLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const renewTime = global.latestPRenewTime;
		const envCode = `window.env='${clientConfig.env}';window.latestPRenewTime = ${global.latestPRenewTime};window.dataLayer=[{pid:${this.props.reduxState.user.pid},isLogin:${this.props.reduxState.user.isLogin}}]`;
		const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'IE10',lowest:['10'],support:['ie'],fixedHeight:'59px'});`;
		const profileMetaData = this.props.reduxState.metaData && this.props.reduxState.metaData.profile ? this.props.reduxState.metaData.profile : profileMeta;
		const name = profileMetaData.name || '';
		const reduxState = serialize(this.props.reduxState, {isJSON: true});
		const CommonScript = commonScript(browserDataCode, envCode, reduxState);
		const CommonLink = commonLink();
		const CommonMetaData = commonMetaData();

		// TODO remove one draft.css
		return (
			<html lang="zh-Hant-TW">
				<head>
					<title>{ profileMetaData.name || '個人檔案' } - 104 職涯社群</title>
					{ CommonMetaData }
					<meta name="description" content={ `查看 ${name} 的個人檔案，104 職涯社群能讓你透過完整呈現職涯成就及影音圖文作品集，輕鬆經營個人品牌、拓展人脈。` } />
					<meta property="og:title" content={ `${profileMetaData.name || '個人檔案'} - 104 職涯社群` } />
					<meta property="og:url" content={ `https:${clientConfig.params.wapUrl}` } />
					<meta property="og:image" content={ profileMetaData.image ? `https:${profileMetaData.image}` : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:description" content={ `查看 ${name}的個人檔案，104 職涯社群能讓你透過完整呈現職涯成就及影音圖文作品集，輕鬆經營個人品牌、拓展人脈。` } />
					<link rel="canonical" href={ `https:${clientConfig.params.wapUrl}/profile/${profileMetaData.pid}` } />
					<link rel="alternate" href={ `https:${clientConfig.params.wapUrl}/m/profile/${profileMetaData.pid}` } media="only screen and (max-width: 640px)" />
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
