import React from 'react';
import { ConnectionDataList } from '../data';
import Button from '../button/index';
import css from './index.css';
import CSSModules from 'react-css-modules';
import clientConfig from 'src/configs/client';

const ConnectionField = () => {
	let dataList = [];
	switch (clientConfig.env) {
		case 'staging':
			dataList = ConnectionDataList.staging;
			break;
		case 'production':
			dataList = ConnectionDataList.production;
			break;
		case 'dev':
		case 'lab':
		default:
			dataList = ConnectionDataList.lab;
	}
	return (
		<div styleName="block">
			<h2>人脈</h2>
			<ul>
				{dataList.map((data, key) => (
					<li key={ key }>
						<a href={ data.profileUrl } target="_blank" rel="noopener noreferrer">
							<img src={ `${clientConfig.params.staticWapUrl}${data.avatarUrl}` } data-gtm-ab="Profile - 看" />
						</a>
						<div styleName="content-main">
							<div styleName="name text-wrap-one" data-gtm-ab="Profile - 看">
								<a href={ data.profileUrl } target="_blank" rel="noopener noreferrer">{ data.name }</a>
							</div>
							<div styleName="title text-wrap-one">{ data.title }</div>
							<div styleName="company text-wrap-one">
								<i className="travel icon" styleName="icon" />{ data.company }
							</div>
							<Button btnClass="btn btn-subscribe" text="關注" gtmTag="Profile - 關注" url="/sso/saml-login" />
						</div>
					</li>
				))}
			</ul>
			<div styleName="block-button">
				<Button btnClass="btn btn-call" text="我想看更多" gtmTag="Profile - 我想看更多" url="/sso/saml-login" />
			</div>
		</div>
	);
};

export default CSSModules(ConnectionField, css, {allowMultiple: true});
