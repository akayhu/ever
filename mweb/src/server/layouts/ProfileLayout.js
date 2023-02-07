'use strict';

import React, { Component } from 'react';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonMetaData, commonScript, commonLink } from './CommonLayout';

const { actions: { metadata: { profileMeta } } } = require('c_platform');

class ProfileLayout extends Component {
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
		const profileMetaData = this.props.reduxState.metaData && typeof this.props.reduxState.metaData.profile === 'object' ? this.props.reduxState.metaData.profile : profileMeta;

		return (
			<html lang="zh-Hant">
				<head>
					<title>{profileMetaData.title}</title>
					{ CommonMetaData }
					<meta name="description" content={ profileMetaData.description } />
					<meta property="og:title" content={ profileMetaData.title } />
					<meta property="og:url" content={ `https:${profileMetaData.url}` } />
					<meta property="og:type" content="website" />
					<meta property="og:image" content={ profileMetaData.image ? `https:${profileMetaData.image}` : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:description" content={ profileMetaData.description } />
					{ CommonLink }
					<link rel="canonical" href={ profileMetaData.url } />
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

export default ProfileLayout;
