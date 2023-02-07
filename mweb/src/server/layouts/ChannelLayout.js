'use strict';

import React, { Component } from 'react';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { channelMeta } from 'c_platform/lib/client/actions/metadata';
import { commonMetaData, commonScript, commonLink } from './CommonLayout';

class ChannelLayout extends Component {
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
		const channelMetaData = this.props.reduxState.metaData && this.props.reduxState.metaData.channel ? this.props.reduxState.metaData.channel : channelMeta;

		return (
			<html lang="zh-Hant">
				<head>
					<title>{ channelMetaData.title || '頻道 - 104 職涯社群' }</title>
					{ CommonMetaData }
					<meta name="description" content={ channelMetaData.description || '彙整職場動態、產業新知、活動講座、好書等泛職場專業資訊，協助你時時刻刻可以線上充電頻道。' } />
					<meta property="og:title" content={ channelMetaData.title || '頻道 - 104 職涯社群' } />
					<meta property="og:url" content={ channelMetaData.mUrl || `https:${clientConfig.params.wapUrl}/m/channel` } />
					<meta property="og:type" content="website" />
					<meta property="og:image" content={ channelMetaData.image ? channelMetaData.image.url : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:image:width" content={ channelMetaData.image ? channelMetaData.image.width : 200 } />
					<meta property="og:image:height" content={ channelMetaData.image ? channelMetaData.image.height : 200 } />
					<meta property="og:description" content={ channelMetaData.description || '彙整職場動態、產業新知、活動講座、好書等泛職場專業資訊，協助你時時刻刻可以線上充電頻道。' } />
					{ CommonLink }
					<link rel="canonical" href={ channelMetaData.mUrl } />
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

export default ChannelLayout;
