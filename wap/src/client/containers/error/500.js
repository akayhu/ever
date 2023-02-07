import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import clientConfig from 'src/configs/client';

class Error500 extends Component {
	constructor( props ){
		super( props );
	}
	render() {
		return (
			<div styleName="error_main">
				<img src={ clientConfig.params.staticWapUrl + "/images/bg_500.png" } />
				<div styleName="error_content">
					{
						this.props.error_status &&
						this.props.error_status === 'init' &&
						<h1>抱歉，帳號系統似乎出了點問題</h1>
					}
					{
						typeof this.props.error_status === 'undefined' &&
						<h1>抱歉，系統忙碌中</h1>
					}
					你可以：
					<ul className="main_text">
						{
							this.props.error_status &&
							this.props.error_status === 'init' &&
							<li><a href={"/saml/login?r="+(this.props.query ? this.props.query.r : "/")}>再登入一次試試</a></li>
						}
						{
							typeof this.props.error_status === 'undefined' &&
							<li><a href="/">回首頁</a></li>
						}
						<li><a href={clientConfig.params.e104Url+"/question_admin/reaction.cfm?faq_from=plus"}>透過意見反應回報使用問題</a></li>
					</ul>
					<div className="statics_text">若造成您的不便，敬請見諒  104職涯社群客服中心　敬上</div>
				</div>
			</div>
		);
	}
}

export default compose(
		//connect(mapStateToProps, { addEndorsement }),
		//translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Error500);