import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';

class ADAppBanner extends Component {
	render() {
		return (
			<div styleName="app_banner_content">
				<div styleName="app_banner">
					<a href="//play.google.com/store/apps/details?id=com.m104plus" target="_blank">
						<img src="//static.104.com.tw/plus/images/aside/p7.png" styleName="left" data-gtm-app="Android" />
					</a>
					<a href="//itunes.apple.com/tw/app/104+/id770520900?mt=8" target="_blank">
						<img src="//static.104.com.tw/plus/images/aside/p8.png" styleName="right" data-gtm-app="iOS" />
					</a>
				</div>
			</div>
		);
	}
}

const ADAppBannerCss = CSSModules(ADAppBanner, css, { allowMultiple: true });

export default ADAppBannerCss;
