import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonScript, commonLink } from './CommonLayout';

class BeAGiverLayout extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			title: 'Be A Giver - 台灣需要一場以幫助為名的社會運動',
			type: 'website',
			description: '請加入我們的行列，一起感受改變。讓你我在互相give & take 之間，擦出火花、攜手向前走！【Giver】找出能感動你的故事，以你的自豪能力帶領努力中的taker前進！【Taker】說出你需要被幫助的故事，為自己找到引領你前進的giver！',
			url: `${clientConfig.params.wapUrl}/104beagiver`
		};
	}
	componentWillMount() {
		switch (this.props.reduxState.history.currentUrl) {
			case '/104beagiver/resumeclinic':
				this.setState({
					title: '線上履歷健診 - 履歷診療室 - 104 Be A Giver',
					type: 'article',
					url: `${clientConfig.params.wapUrl}/104beagiver/resumeclinic`
				});
				break;
			case '/104beagiver/story':
				this.setState({
					url: `${clientConfig.params.wapUrl}/104beagiver/story`
				});
				break;
			case '/104beagiver/live':
				this.setState({
					url: `${clientConfig.params.wapUrl}/104beagiver/live`
				});
				break;
		}
	}
	render() {
		const renewTime = global.latestPRenewTime;
		const envCode = `window.env='${clientConfig.env}';window.latestPRenewTime = ${global.latestPRenewTime};window.dataLayer=[{pid:${this.props.reduxState.user.pid},isLogin:${this.props.reduxState.user.isLogin}}]`;
		const browserDataCode = `window.commonBrowser104.init({date:'2018年01月01日',browserVersion:'IE10',lowest:['10'],support:['ie'],fixedHeight:'59px'});`;
		const { title, type, description, url } = this.state;
		const reduxState = serialize(this.props.reduxState, {isJSON: true});
		const CommonScript = commonScript(browserDataCode, envCode, reduxState);
		const CommonLink = commonLink();

		return (
			<html lang="zh-Hant-TW">
				<head>
					<title>{ title }</title>
					<meta charSet="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta httpEquiv="cache-control" content="no-store, no-cache, post-check=0, pre-check=0" />
					<meta httpEquiv="pragma" content="no-cache" />
					<meta httpEquiv="expires" content="-1" />
					<meta name="description" content={ description } />
					<meta name="google-site-verification" content="lK0uOjYblrkGJHOnGSF2ayvDh-epbyzfLAmii8x823s" />
					<meta name="msvalidate.01" content="8726D5AD7B78D431596FA6BB030C3605" />
					<meta property="og:site_name" content="Be A Giver - 台灣需要一場以幫助為名的社會運動" />
					<meta property="og:title" content={ title } />
					<meta property="og:description" content={ description } />
					<meta property="og:type" content={ type } />
					<meta property="og:locale" content="zh_TW" />
					<meta property="og:url" content={ url } />
					<meta property="og:image" content="//static.104.com.tw/104main/jb/area/beagiver/images/og.jpg" />
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

export default BeAGiverLayout;
