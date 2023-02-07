import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import clientConfig from 'src/configs/client';

class Error404 extends Component {
	constructor( props ){
		super( props );
	}
	render() {
		return (
			<div styleName="error_main">
				<img src={ clientConfig.params.staticWapUrl + "/images/bg_404.png" } />
				<div styleName="error_content">
					{
						this.props.error_status && this.props.error_status === 'member' &&
						<h1>此帳號不存在或權限不足無法瀏覽</h1>
					}
					{
						this.props.error_status && this.props.error_status === 'group' &&
						<h1>此社團不存在或權限不足無法瀏覽</h1>
					}
					{
						this.props.error_status && this.props.error_status === 'channel' &&
						<h1>此頻道不存在或權限不足無法瀏覽</h1>
					}
					{
						this.props.error_status && this.props.error_status === 'activity' &&
						<h1>此動態不存在或權限不足無法瀏覽</h1>
					}
					{
						this.props.error_status && this.props.error_status === 'block' &&
						<h1>無法瀏覽他的個人頁</h1>
					}
					{
						typeof this.props.error_status === 'undefined' &&
						<h1>抱歉，這個頁面不存在</h1>
					}
					你可以：
					<ul className="main_text">
						<li><a href="/">回首頁</a></li>
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
	)(Error404);
