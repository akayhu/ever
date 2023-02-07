'use strict';

import React, { Component } from 'react';
import clientConfig from 'src/configs/client';
import serialize from 'serialize-javascript';
import { commonMetaData, commonScript, commonLink } from './CommonLayout';

class BeAGiverLayout extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			title: 'Be A Giver - 台灣需要一場以幫助為名的社會運動',
			type: 'website',
			description: '請加入我們的行列，一起感受改變。讓你我在互相give & take 之間，擦出火花、攜手向前走！【Giver】找出能感動你的故事，以你的自豪能力帶領努力中的taker前進！【Taker】說出你需要被幫助的故事，為自己找到引領你前進的giver！',
			url: `${clientConfig.params.wapUrl}/m/104beagiver`,
		};
	}
	componentWillMount() {
		switch (this.props.reduxState.history.currentUrl) {
			case '/m/104beagiver/resumeclinic':
				this.setState({
					title: '線上履歷健診 - 履歷診療室 - 104 Be A Giver',
					type: 'article',
					url: `${clientConfig.params.wapUrl}/m/104beagiver/resumeclinic`,
				});
				break;
			case '/m/104beagiver/story':
				this.setState({
					url: `${clientConfig.params.wapUrl}/m/104beagiver/story`,
				});
				break;
			case '/m/104beagiver/live':
				this.setState({
					url: `${clientConfig.params.wapUrl}/m/104beagiver/live`,
				});
				break;
		}
	}
	render() {
		const renewTime = global.latestPRenewTime;
		const { title, type, description, url } = this.state;
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

		

		return (
			<html lang="zh-Hant">
				<head>
					<title>{ title }</title>
					{ CommonMetaData }
					<meta property="og:site_name" content="Be A Giver - 台灣需要一場以幫助為名的社會運動" />
					<meta property="og:title" content={ title } />
					<meta property="og:description" content={ description } />
					<meta property="og:type" content={ type } />
					<meta property="og:locale" content="zh_TW" />
					<meta property="og:url" content={ url } />
					<meta property="og:image" content="https://static.104.com.tw/104main/jb/area/beagiver/images/og.jpg" />
					{ CommonLink }
					<link rel="canonical" href={ `https:${clientConfig.params.wapUrl}/104beagiver` } />
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

export default BeAGiverLayout;
