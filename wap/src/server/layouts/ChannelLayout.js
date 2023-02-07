import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonScript, commonLink, commonMetaData } from './CommonLayout';
import { channelMeta } from 'c_platform/lib/client/actions/metadata';

class ChannelLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const renewTime = global.latestPRenewTime;
		const envCode = `window.env='${clientConfig.env}';window.latestPRenewTime = ${global.latestPRenewTime};window.dataLayer=[{pid:${this.props.reduxState.user.pid},isLogin:${this.props.reduxState.user.isLogin}}]`;
		const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'IE10',lowest:['10'],support:['ie'],fixedHeight:'59px'});`;
		const channelMetaData = this.props.reduxState.metaData && this.props.reduxState.metaData.channel ? this.props.reduxState.metaData.channel : channelMeta;
		const reduxState = serialize(this.props.reduxState, {isJSON: true});
		const CommonScript = commonScript(browserDataCode, envCode, reduxState);
		const CommonLink = commonLink();
		const CommonMetaData = commonMetaData();

		// TODO remove one draft.css
		return (
			<html lang="zh-Hant-TW">
				<head>
					<title>{ channelMetaData.title || '頻道 - 104 職涯社群' }</title>
					{ CommonMetaData }
					<meta name="description" content={ channelMetaData.description || '彙整職場動態、產業新知、活動講座、好書等泛職場專業資訊，協助你時時刻刻可以線上充電頻道。' } />
					<meta property="og:title" content={ channelMetaData.title || '頻道 - 104 職涯社群' } />
					<meta property="og:url" content={ channelMetaData.url || `https:${clientConfig.params.wapUrl}/channel` } />
					<meta property="og:image" content={ channelMetaData.image ? channelMetaData.image.url : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:image:width" content={ channelMetaData.image ? channelMetaData.image.width : 200 } />
					<meta property="og:image:height" content={ channelMetaData.image ? channelMetaData.image.height : 200 } />
					<meta property="og:description" content={ channelMetaData.description || '彙整職場動態、產業新知、活動講座、好書等泛職場專業資訊，協助你時時刻刻可以線上充電頻道。' } />
					<link rel="canonical" href={ channelMetaData.url } />
					<link rel="alternate" href={ channelMetaData.mUrl } media="only screen and (max-width: 640px)" />
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

export default ChannelLayout;
