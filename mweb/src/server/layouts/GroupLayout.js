'use strict';

import React, { Component } from 'react';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { groupMeta } from 'c_platform/lib/client/actions/metadata';
import { commonMetaData, commonScript, commonLink } from './CommonLayout';

class GroupLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const renewTime = global.latestPRenewTime;
		const reduxState = this.props.reduxState;
		if (reduxState.entities) {
			for (let entity in reduxState.entities) {
				for (let item in reduxState.entities[entity]) {
					reduxState.entities[entity][item].hasLoaded = false;
				}
			}
		}
		const CommonMetaData = commonMetaData();
		const CommonScript = commonScript(serialize(reduxState, {isJSON: true}));
		const CommonLink = commonLink();
		const groupMetaData = this.props.reduxState.metaData && this.props.reduxState.metaData.group ? this.props.reduxState.metaData.group : groupMeta;

		return (
			<html lang="zh-Hant">
				<head>
					<title>{ groupMetaData.title || '社團 - 104 職涯社群' }</title>
					{ CommonMetaData }
					<meta name="description" content={ groupMetaData.description || '匯集最多同行的線上社團等你加入，與廿萬用戶一起交流產業資訊、經驗與專業' } />
					<meta property="og:title" content={ groupMetaData.title || '社團 - 104 職涯社群' } />
					<meta property="og:url" content={ groupMetaData.mUrl || `https:${clientConfig.params.wapUrl}/m/group` } />
					<meta property="og:type" content="website" />
					<meta property="og:image" content={ groupMetaData.image ? groupMetaData.image.url : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:image:width" content={ groupMetaData.image ? groupMetaData.image.width : 200 } />
					<meta property="og:image:height" content={ groupMetaData.image ? groupMetaData.image.height : 200 } />
					<meta property="og:description" content={ groupMetaData.description || '匯集最多同行的線上社團等你加入，與廿萬用戶一起交流產業資訊、經驗與專業' } />
					{ CommonLink }
					<link rel="canonical" href={ groupMetaData.mUrl } />
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

export default GroupLayout;
