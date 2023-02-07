import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';

class License extends Component {
	constructor(props) {
		super(props);
		const d = new Date();
		this.nowYear = d.getFullYear();
	}
	render() {
		return (
			<div styleName="license_content">
				<div styleName="app_text">
					<a href="http://corp.104.com.tw" target="_blank">一零四資訊科技股份有限公司</a>
					　版權所有 © { this.nowYear }<br />建議瀏覽器IE10.0以上
				</div>
			</div>
		);
	}
}

const LicenseCss = CSSModules( License, css, { allowMultiple: true } )

export default LicenseCss;
