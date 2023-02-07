import React from 'react';
import { ActivityDataList } from '../data';
import Button from '../button/index';
import css from './index.css';
import CSSModules from 'react-css-modules';
import clientConfig from 'src/configs/client';

const ActivityField = () => {
	const activityHotStyle = {
		background: `url(${clientConfig.params.staticWapUrl}/images/prelogin/activity/hot.png) no-repeat center`,
	};
	let dataList = [];
	switch (clientConfig.env) {
		case 'staging':
			dataList = ActivityDataList.staging;
			break;
		case 'production':
			dataList = ActivityDataList.production;
			break;
		case 'dev':
		case 'lab':
		default:
			dataList = ActivityDataList.lab;
	}
	return (
		<div styleName="block">
			<h2>文章</h2>
			<ul>
				{dataList.map((data, key) => (
					<li styleName={ (data.isHotArticle) ? 'hot-activity' : '' } key={ key }>
						<a href={ data.articleUrl } target="_blank" rel="noopener noreferrer">
							<img src={ `${clientConfig.params.staticWapUrl}${data.imgUrl}` } data-gtm-ab="Activity - 看" />
						</a>
						<div styleName="content-main">
							{ (data.isHotArticle) ? (<div styleName="hot-decoration" style={ activityHotStyle } />) : '' }
							<a href={ data.articleUrl } target="_blank" rel="noopener noreferrer">
								<h3 styleName="title text-wrap" data-gtm-ab="Activity - 看">{data.title}</h3>
								<p styleName="content text-wrap" data-gtm-ab="Activity - 看">{data.content}</p>
							</a>
						</div>
					</li>
				))}
			</ul>
			<div styleName="block-button">
				<Button btnClass="btn btn-call" text="我想看更多" gtmTag="Activity - 我想看更多" url="/sso/saml-login" />
			</div>
		</div>
	);
};

export default CSSModules(ActivityField, css, {allowMultiple: true});
