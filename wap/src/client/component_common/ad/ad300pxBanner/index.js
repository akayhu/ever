import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';

// 登入後首頁左欄行銷區塊; 未登入文章右欄區塊
class AD300pxBanner extends Component {
	render() {
		return (
			<div styleName="banner_content">
				<div styleName="banner">
          <a href="http://bit.ly/2tlBtZO" target="_brank" title="Be A Giver Cafe">
            <img src="//static.104.com.tw/plus/images/Giver.jpg" data-gtm-index="左欄 - 行銷區塊" />
          </a>
        </div>
			</div>
		);
	}
}

const AD300pxBannerCss = CSSModules(AD300pxBanner, css, { allowMultiple: true });

export default AD300pxBannerCss;
