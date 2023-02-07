import React from 'react';
import css from './index.css';
import CSSModules from 'react-css-modules';
import LoginField from '../loginField/index';
import FeatureField from '../featureField/index';
import clientConfig from 'src/configs/client';

/*
	分成A、B版頁面，A版為 feature ，B版為 topic
*/

const FeaturePage = () => {
	const headerBgStyle = {
		background: `url(${clientConfig.params.staticWapUrl}/images/prelogin/header.png) 0% 0% / cover`,
	};
	return (
		<div styleName="container">
			<header styleName="header" style={ headerBgStyle }>
				<LoginField />
			</header>
			<main styleName="main">
				<div styleName="row">
					<FeatureField />
				</div>
			</main>
		</div>
	);
};

export default CSSModules(FeaturePage, css, { allowMultiple: true });
