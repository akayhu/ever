"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import clientConfig from '../../../../configs/client';
import { checkPjAPI, checkPoAPI, checkPiAPI } from '../../../actions/test';
import css from './style.css';
import compose from '../../../../util/compose';

class ApplicationList extends Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
		const params = {
			pid: this.props.user.pid
		};
		this.props.checkPjAPI(params);
		this.props.checkPoAPI(params);
		this.props.checkPiAPI(params);
	}
	render(){
		return (
			<div className={css.application_list}>
				<div className={css.job}>
					<div className={css.title}>職務適性測驗</div>
					<div className={css.detail+' clearfix'}>
						<img src={clientConfig.params.staticPlatformUrl+"/images/test/app_img1.png"}/>
						<div  className={css.detailTxt}>
							本測驗目的在幫助您了解個人的個性，偏好，以評估你適合從事的工作，完成該測驗後，可以查看各職類的特性。
						</div>
						<div className={css.actions}>
						{
							this.props.test.pj.status &&
							this.props.test.pj.status.status === "1" &&
							<a href="/test/job?step=simple_intro" className="ui primary button">立即施測</a>
						}
						{
							this.props.test.pj.status &&
							this.props.test.pj.status.status === "2" &&
							<a href="/test/job?step=report" className="ui primary button">看完整版報告</a>
						}
						{
							this.props.test.pj.status &&
							this.props.test.pj.status.status === "3" &&
							<span>
								<a href="/test/job?step=report" className="ui primary button">看完整版報告</a>
								<a href="/test/job?step=simple_intro" className="ui normal button">重新測驗</a>
							</span>
						}
						{
							this.props.test.pj.status &&
							this.props.test.pj.status.status === "4" &&
							<span>
								<a href="/test/job?step=report" className="ui primary button">看簡易版報告</a>
								<a href="/test/job?step=advanced_intro" className="ui normal button">施測進階版</a>
							</span>
						}
						</div>
					</div>

				</div>
				<div>
					<div className={css.title}>組織適性測驗</div>
					<div className={css.detail+' clearfix'}>
						<img src={clientConfig.params.staticPlatformUrl+"/images/test/app_img2.png"}/>
						<div className={css.detailTxt}>
							本測驗目的在幫助您了解個人的價值觀，以評估您未來較適合在何種類型的企業工作，完成該測驗後，可以瞭解您適合的組織特性以及注意事項。
						</div>
						<div className={css.actions}>
						{
							this.props.test.po &&
							this.props.test.po.status &&
							this.props.test.po.status.status === 1 &&
							<a href="/test/org?step=answer" className="ui primary button">立即施測</a>
						}
						{
							this.props.test.po &&
							this.props.test.po.status &&
							this.props.test.po.status.status === 2 &&
							<a href="/test/org?step=report" className="ui primary button">看報告</a>
						}
						{
							this.props.test.po &&
							this.props.test.po.status &&
							this.props.test.po.status.status === 3 &&
							<span>
								<a href="/test/org?step=report" className="ui primary button">看完整版報告</a>
								<a href="/test/org?step=answer" className="ui normal button">重新測驗</a>
							</span>
						}
						</div>
					</div>

				</div>
				<div>
					<div className={css.title}>產業適性測驗</div>
					<div className={css.detail+' clearfix'}>
						<img src={clientConfig.params.staticPlatformUrl+"/images/test/app_img3.png"}/>
						<div className={css.detailTxt}>
							本測驗目的在幫助您了解個人的興趣，以判斷您未來較適合在何種類型的產業發展，完成該測驗後，可以了解適合的產業及注意事項。
						</div>
						<div className={css.actions}>
						{
							this.props.test.pi &&
							this.props.test.pi.status &&
							this.props.test.pi.status.status === 1 &&
							<a href="/test/industry?step=answer" className="ui primary button">立即施測</a>
						}
						{
							this.props.test.pi &&
							this.props.test.pi.status &&
							this.props.test.pi.status.status === 2 &&
							<a href="/test/industry?step=report" className="ui primary button">看報告</a>
						}
						{
							this.props.test.pi &&
							this.props.test.pi.status &&
							this.props.test.pi.status.status === 3 &&
							<span>
								<a href="/test/industry?step=report" className="ui primary button">看完整版報告</a>
								<a href="/test/industry?step=answer" className="ui normal button">重新測驗</a>
							</span>
						}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props){
	return {
		user: state.user,
		test: state.test
	};
}

export default compose(
	connect(mapStateToProps, { checkPjAPI, checkPoAPI, checkPiAPI }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ApplicationList);
