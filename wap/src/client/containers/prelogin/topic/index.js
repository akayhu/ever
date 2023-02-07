import React from 'react';
import css from './index.css';
import CSSModules from 'react-css-modules';
import LoginField from '../loginField/index';
import GroupField from '../groupField/index';
import ActivityField from '../activityField/index';
import ConnectionField from '../connectionField/index';
import clientConfig from 'src/configs/client';

/*
	分成A、B版頁面，A版為 feature ，B版為 topic
*/
const TopicPage = () => {
	location.href = "/"; // 首頁目前固定為A版頁，故B版導回A版頁
	const headerBgStyle = {
		background: `url(${clientConfig.params.staticWapUrl}/images/prelogin/header.jpg)`,
		backgroundSize: 'cover',
	};
	return (
		<div styleName="container">
			<header styleName="header" style={ headerBgStyle }>
				<LoginField />
			</header>
			<main styleName="bg-style-1 main">
				<div styleName="row">
					<GroupField />
				</div>
				<div styleName="row bg-style-2">
					<ActivityField />
				</div>
				<div styleName="row">
					<ConnectionField />
				</div>
			</main>
		</div>
	);
};
export default CSSModules(TopicPage, css, {allowMultiple: true});
