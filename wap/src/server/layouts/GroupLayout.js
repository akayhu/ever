import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonScript, commonLink, commonMetaData } from './CommonLayout';
import { groupMeta } from 'c_platform/lib/client/actions/metadata';

class GroupLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const renewTime = global.latestPRenewTime;
		const envCode = `window.env='${clientConfig.env}';window.latestPRenewTime = ${global.latestPRenewTime};window.dataLayer=[{pid:${this.props.reduxState.user.pid},isLogin:${this.props.reduxState.user.isLogin}}]`;
		const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'IE10',lowest:['10'],support:['ie'],fixedHeight:'59px'});`;
		const groupMetaData = this.props.reduxState.metaData && this.props.reduxState.metaData.group ? this.props.reduxState.metaData.group : groupMeta;
		const reduxState = serialize(this.props.reduxState, {isJSON: true});
		const CommonScript = commonScript(browserDataCode, envCode, reduxState);
		const CommonLink = commonLink();
		const CommonMetaData = commonMetaData();

		// TODO remove one draft.css
		return (
			<html lang="zh-Hant-TW">
				<head>
					<title>{ groupMetaData.title || '社團 - 104 職涯社群' }</title>
					{ CommonMetaData }
					<meta name="description" content={ groupMetaData.description || '匯集最多同行的線上社團等你加入，與廿萬用戶一起交流產業資訊、經驗與專業' } />
					<meta property="og:title" content={ groupMetaData.title || '社團 - 104 職涯社群' } />
					<meta property="og:url" content={ groupMetaData.url || `https:${clientConfig.params.wapUrl}/group` } />
					<meta property="og:image" content={ groupMetaData.image ? groupMetaData.image.url : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:image:width" content={ groupMetaData.image ? groupMetaData.image.width : 200 } />
					<meta property="og:image:height" content={ groupMetaData.image ? groupMetaData.image.height : 200 } />
					<meta property="og:description" content={ groupMetaData.description || '匯集最多同行的線上社團等你加入，與廿萬用戶一起交流產業資訊、經驗與專業' } />
					<link rel="canonical" href={ groupMetaData.url } />
					<link rel="alternate" href={ groupMetaData.mUrl } media="only screen and (max-width: 640px)" />
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

export default GroupLayout;
