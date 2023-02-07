import React from 'react';
import { GroupDataList } from '../data';
import Button from '../button/index';
import css from './index.css';
import CSSModules from 'react-css-modules';
import clientConfig from 'src/configs/client';

const GroupField = () => {
	let dataList = [];

	switch (clientConfig.env) {
		case 'staging':
			dataList = GroupDataList.staging;
			break;
		case 'production':
			dataList = GroupDataList.production;
			break;
		case 'dev':
		case 'lab':
		default:
			dataList = GroupDataList.lab;
	}
	return (
		<div styleName="block">
			<h2>社團</h2>
			<ul>
				{dataList.map((data, key) => (
					<li key={ key }>
						<a href={ data.groupUrl } target="_blank" rel="noopener noreferrer">
							<img src={ `${clientConfig.params.staticWapUrl}${data.imgUrl}` } data-gtm-ab="社團 - 看" />
						</a>
						<div styleName="content-main">
							<a href={ data.groupUrl } target="_blank" rel="noopener noreferrer">
								<div styleName="title" data-gtm-ab="社團 - 看">{ data.name }</div>
								<div styleName="content" data-gtm-ab="社團 - 看">{ data.description }</div>
							</a>
							<div styleName="subscribe">
								<Button btnClass="btn btn-join" text="加入社團" gtmTag="社團 - 加入社團" url="/sso/saml-login" />
							</div>
						</div>
					</li>
				))}
			</ul>
			<div styleName="block-button">
				<Button btnClass="btn btn-call" text="立刻加入" gtmTag="社團 - 立刻加入" url="/sso/saml-login" />
			</div>
		</div>
	);
};

export default CSSModules(GroupField, css, {allowMultiple: true});
