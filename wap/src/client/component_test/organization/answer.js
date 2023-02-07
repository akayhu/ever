import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

import { nextPage, prevPage, readyAnswerPoAPI } from 'src/client/actions/test/po';

class Answer extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { page } = this.props;

		return (
			<div className="original_panel">
				<div className="header clearfix">
					<div className="title">
						<h2>組織適性測驗</h2>
					</div>
				</div>
				<div className="body" styleName="test_content">
					{
						page === 1 &&
						<div>
							<p>你好，</p>
							<p>
								本測驗目的在幫助您瞭解個人的價值觀，以評估您未來較適合在何種類型的企業工作，完成該測驗後，可以瞭解你適合的組織特性及注意事項。<br />
								因此不用考慮別人的想法是什麼，答案並沒有所謂的對或錯，請您以一般日常生活中的實際狀況，不需要做過多思考，依直覺反應作答即可。
							</p>
						</div>
					}
					<div styleName="answer_content">
						{
							page === 1 &&
							<p>您期望的組織特性為何?<br />1.請從下列10個選項中，挑選出5項您期望的組織特性。</p>
						}
						{
							page === 2 &&
							<p>您期望的組織特性為何?<br />2.請從下列5個選項中，挑選出2項您最期望的組織特性。</p>
						}
						{
							page === 3 &&
							<p>您期望的組織特性為何?<br />3.請從下列5個選項中，挑選出2項您最不期望的組織特性。</p>
						}
						<hr />
						{ this.props.children }
					</div>
					<div styleName="test_footer">
						{
							page > 1 &&
							<button className="mini ui primary button" onClick={ () => this.props.prevPage() }>上一頁</button>
						}
						{
							page !== 3 &&
							<button className="mini ui primary button" onClick={ () => this.props.nextPage() }>下一頁</button>
						}
						{
							page === 3 &&
							<button className="mini ui primary button" onClick={ () => this.props.readyAnswerPoAPI() }>確定送出</button>
						}
					</div>
				</div>
			</div>
		);
	}
}

export default compose(
	connect(null, { nextPage, prevPage, readyAnswerPoAPI }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Answer);
