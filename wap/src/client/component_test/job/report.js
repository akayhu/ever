import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { has } from 'lodash/object';
import { forEach, keyBy } from 'lodash/collection';

import clientConfig from 'src/configs/client';
// actions
import { initReport, readyUpdatePersonlConfig, changePage, reStartPj, toggleLightbox } from 'src/client/actions/test/pj';

const jobcatDatas = require('src/client/component_test/job/jobcat_data.js').JOBCAT_DATA;
const jobcatNameDatas = keyBy(require('src/client/component_test/job/jobcat_data.js').JOBCAT_DATA, 'name');

class Report extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobcat: props.config.jobcat,
			jobcatName: props.config.jobcatName,
			showSaveJobBtn: false
		};
	}
	componentDidMount() {
		const { jobcat, jobcatName } = this.state;
		if (!jobcat && !jobcatName) {
			this.openE104Menu2011();
		}
		this.props.initReport();
	}
	openE104Menu2011() {
		const myconfig = {
			id: 'menu001',
			init_Div: 'divorg',
			DataSource: 'JobCatRoot',
			maxChoose: '1',
			title: '選擇類目',
			chooseHelperMsg: '請選擇想察看報告的職務',
			searchBox: '1',
			se_URL: `${clientConfig.params.e104Url}/ifeeds/helper/searchbox.cfm?type=2`,
			se_SearchLevel: '3',
			main_ColumnType: '2',
			sub_ContentType: '23',
			sub_ColumnType: '2',
			se_ShowDetail: 'yes',
			lightBox: '0',
			hiddenCheckBox: '2[0-9]{3}[0-9]{3}000',
			choiceNumber: '2',
			mscb: '1',
			chooseItems: [{no: this.state.jobcat}]
		};
		const that = this;
		const { initReport, toggleLightbox } = this.props;
		window.E104Menu2011.prototype.callBack = function () {
			if (this.config.chooseItems.length === 0) {
				return toggleLightbox(true, '請選擇一個職類能看報告');
			}
			const { des, no } = this.config.chooseItems[0];
			initReport(no, des);
			that.setState({
				jobcat: no,
				jobcatName: des,
				showSaveJobBtn: true
			});
		};
		window.openE104Menu2011(myconfig);
	}
	reInitReport(dmsName) {
		// 點擊下方未來職務時重新送report api
		const { future, initReport } = this.props;
		// 因為白癡API讓report.dmsDet的順序跟future的順序是對不起來的，所以只好跑迴圈Orz
		forEach(future, (value) => {
			if (value.descript === dmsName) {
				this.setState({
					jobcat: value.jobcat,
					jobcatName: value.descript,
					showSaveJobBtn: true
				});
				return initReport(value.jobcat, value.descript);
			}
			return null;
		});
	}
	handelSaveJob() {
		// 儲存成預設報告
		const { readyUpdatePersonlConfig } = this.props;
		const { jobcat, jobcatName } = this.state;
		readyUpdatePersonlConfig({
			jobcat,
			jobcatName,
			haveReload: false
		});
	}
	render() {
		const { status, changePage, loading, report, future, reStartPj, report: { dmsDet = [], conformDetNumY, conformDetNumN, conformDetDescY, conformDetDescN } } = this.props;
		const { jobcat, showSaveJobBtn } = this.state;
		const imgUrl = `${clientConfig.params.staticWapUrl}/images/test/jobcategory_wawa__${getJobcatPic(jobcat)}.png`;
		return (
			<div className="original_panel">
				<div id="divorg" />
				<div className="header clearfix">
					<div className="title">
						<h2>職務適性報告</h2>
					</div>
					<div className="options">
						{	// 4:C端未完成PART4
							status === '4' &&
							<button
								className="ui line button"
								onClick={ () => changePage('advanced_intro') }
							>
								想更精準了解自己，加做進階測驗
							</button>
						}
						{
							// 3:C端已完成PART4且超過3個月
							status === '3' &&
							<button
								className="ui line button"
								onClick={ () => reStartPj(dmsDet, jobcat) }
							>
								重新測驗
							</button>
						}
					</div>
				</div>
				<div className="body">
					<div styleName="report">
						{
							report && report.isSuccess === 'false' &&
							<div styleName="re_choose_dmsname">
								<button className="ui primary button" onClick={ this.openE104Menu2011.bind(this) }>選擇職能</button>
							</div>
						}
						{ // report尚未load完成前不做render 主要是因為action initReport的loading無法持續 會中斷
							(!loading && report) && report.isSuccess === 'true' &&
							<div>
								<div styleName="top">
									<div>
										<img src={ imgUrl } />
										<div styleName="dmsDet_section">
											<span styleName="dmsDet_title">
												{ decodeURI(dmsDet[0].dmsName) }
											</span>
											<span styleName="dmsDet_percent">
												{ dmsDet[0].userScore }%
											</span>
										</div>
										<div styleName="save_default_sectoin">
											{ // 已經是config裡面的職務就不顯示儲存按鈕
												(showSaveJobBtn && this.state.jobcat !== this.props.config.jobcat) &&
												<button
													className="ui primary button"
													onClick={ this.handelSaveJob.bind(this) }
												>
													儲存成預設報告
												</button>
											}
										</div>
									</div>
									<div>
										<div
											styleName="top_title"
											dangerouslySetInnerHTML={ {
												__html: decodeURI(
												report.fitDesc
												.replace(dmsDet[0].dmsName, `<b>${dmsDet[0].dmsName}</b>`)
												.replace(/%(?![\s\S]*%)/, '％')).replace(/╱/g, '／')
											} }
										/>
										<div styleName="top_desc">
											<div styleName="desc_sub_title">
											你有
											<span styleName="number">{ conformDetNumY || 0 }</span>
											項性格適合此職務特性
										</div>
											<div dangerouslySetInnerHTML={ {__html: decodeURI(conformDetDescY) || ''} } />
											<div styleName="desc_sub_title">
											你有
											<span styleName="number">{ conformDetNumN || 0 }</span>
											項性格不適合此職務特性
										</div>
											<div dangerouslySetInnerHTML={ {__html: decodeURI(conformDetDescN) || ''} } />
										</div>
										<a
											styleName="more_btn"
											href="javascript:void(0)"
											onClick={ this.openE104Menu2011.bind(this) }
										>
										我想看其他職類適合度
									</a>
									</div>
								</div>
								<div styleName="bottom">
									{
										future.length === 0
										?
											<div styleName="bottom_title">
												在這個領域已經找不到更好的下一個職務了。
											</div>
										:
											<div styleName="bottom_title">
												{	`『${decodeURI(dmsDet[0].dmsName).replace(/╱/g, '／')}』` || '' }
												可能的職涯下一步，以及你的性格適合度：
											</div>
									}
									<div styleName="bottom_container">
										{ // 圖的那邊之所以要接future是因為在report dmsDet裡面並沒有jobcat，沒有jobcat無法去換到圖
											future.length === 0
											?	// 當future為空時，顯示呵呵呵的圖
												<div styleName="future champion">
													<img src={ `${clientConfig.params.staticWapUrl}/images/test/app_end_man.png` } />
												</div>
											:
												dmsDet.map((data, index) =>	{
													if (index === 0) return null;
													return (
														<div
															key={ index }
															styleName="future"
															onClick={ this.reInitReport.bind(this, decodeURI(dmsDet[index].dmsName)) }
														>
															<img src={ `${clientConfig.params.staticWapUrl}/images/test/jobcategory_wawa__${futureGetJobcatPic(decodeURI(dmsDet[index].dmsName))}.png` } />
															<div>
																{	decodeURI(dmsDet[index].dmsName).replace(/╱/g, '／') || '' }
															</div>
															<div styleName="future_percent">
																{	dmsDet[index].userScore || '0'}%
															</div>
														</div>
													);
												})
										}
									</div>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

function getJobcatPic(jobcat) {
	if (has(jobcatDatas, jobcat)) return jobcatDatas[jobcat].pic_id;
	return '1';
}

function futureGetJobcatPic(jobcatName) {
	if (has(jobcatNameDatas, jobcatName)) return jobcatNameDatas[jobcatName].pic_id;
	return '1';
}

const actions = { initReport, readyUpdatePersonlConfig, changePage, reStartPj, toggleLightbox };

export default compose(
	connect(null, actions),
	[CSSModules, '_', css, { allowMultiple: true}]
)(Report);
