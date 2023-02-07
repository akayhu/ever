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
		const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'IE10',lowest:['10'],support:['ie'],fixedHeight:'59px'});`;
		const reduxState = serialize(this.props.reduxState, {isJSON: true});
		const CommonScript = commonScript(browserDataCode, envCode, reduxState);
		const CommonLink = commonLink();
		const CommonMetaData = commonMetaData();

		// TODO remove one draft.css
		return (
			<html className="full_height" lang="zh-Hant-TW">
				<head>
					<title>{ this.props.title ? this.props.title : '104 職涯社群' }</title>
					<meta property="og:title" content={ this.props.title ? this.props.title : '104 職涯社群' } />
					<meta property="og:image" content={ `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					<meta property="og:description" content="description" />
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
				</body>
			</html>
		);
	}
}

export default IndexLayout;
