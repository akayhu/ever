import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonScript, commonLink, commonMetaData } from './CommonLayout';

class WelcomeLayout extends Component {
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
			<html lang="zh-Hant-TW">
				<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#" >
					<title>104 職涯社群</title>
					{ CommonMetaData }
					<meta name="description" content="歡迎來到 104 職涯社群" />
					<meta property="og:title" content="歡迎來到 104 職涯社群" />
					<meta property="og:description" content="104 職涯社群" />
					<meta property="og:locale" content="zh_TW" />
					<meta property="og:url" content={ `https:${clientConfig.params.wapUrl}` } />
					<meta property="og:image" content={ `https:${clientConfig.params.staticUrl}/logo/104logo_plus_200x200.png` } />
					{ CommonLink }
					{ (clientConfig.env !== 'dev') && <link rel="stylesheet" href={ `${clientConfig.params.staticWapUrl}/build/${clientConfig.name}.css` } /> }
				</head>
				<body className="ui dimmable">
					<div className="ui simple dimmer">
						<div className="ui loader" />
					</div>
					<div id="root" dangerouslySetInnerHTML={ {__html: this.props.children} } />
					{ CommonScript }
				</body>
			</html>
		);
	}
}

export default WelcomeLayout;
