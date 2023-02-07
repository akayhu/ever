import React, { Component } from 'react';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonMetaData, commonScript, commonLink } from './CommonLayout';

const { actions: { metadata: { activityMeta } } } = require('c_platform');

class ActivityLayout extends Component {
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
		const CommonScript = commonScript(serialize(reduxState, { isJSON: true }));
		const CommonLink = commonLink();
		const activtyMetaData = this.props.reduxState.metaData && typeof this.props.reduxState.metaData.activity === 'object' ? this.props.reduxState.metaData.activity : activityMeta;

		return (
			<html lang="zh-Hant">
				<head>
					<title>{ activtyMetaData.title }</title>
					{ CommonMetaData }
					<meta name="description" content={ activtyMetaData.description.substr(0, 150) } />
					<meta property="og:title" content={ activtyMetaData.title } />
					<meta property="og:url" content={ activtyMetaData.url } />
					<meta property="og:type" content="article" />
					<meta property="og:image" content={ activtyMetaData.image ? `https:${activtyMetaData.image}` : `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:description" content={ activtyMetaData.description.substr(0, 150) } />
					{ CommonLink }
					<link rel="canonical" href={ activtyMetaData.url } />
					{ (clientConfig.env !== 'dev') && <link rel="stylesheet" href={ `${clientConfig.params.staticMWapUrl}/build/${clientConfig.name}.css?_=${renewTime}` } /> }
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

export default ActivityLayout;
