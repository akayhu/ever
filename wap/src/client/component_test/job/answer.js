import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import { merge } from 'lodash/object';
import { slice } from 'lodash/array';
import { filter, sortBy } from 'lodash/collection';

// actions
import { changePage, nextIndex, submit, toggleLightbox } from 'src/client/actions/test/pj';
// components
import AnswerTable from '../util/answerTable';
import AnswerInfo from './answer_info';
import CountDown from './countDown';
import SimpleIntro from './simple_intro';
import AdvancedIntro from './advanced_intro';
// datas
const rawDatas = require('./pj_data.js').PJ_DATA;

class Answer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			introDatas: {},
			thisPartAlldatas: filterDatas(props.part, props.question),
			duration: 0,
			count: 0,
			// 計算做答每一頁所花的時間
			secPage: [],
			pageStartTime: 0
		};
		this.initAnswer = this.initAnswer.bind(this);
		this.onUnload = this.onUnload.bind(this);
	}
	componentWillMount() {
		const { page, part, question } = this.props;
		this.initAnswer(page, part, question);
	}
	componentWillReceiveProps(nextProps) {
		const { page, part, question } = nextProps;
		if (this.props.page === 'advanced_answer' && nextProps.page === 'advanced_answer' && this.props.part !== nextProps.part) {
			this.setState({
				thisPartAlldatas: filterDatas(part, question)
			});
		}
		if (this.props.page !== nextProps.page) {
			this.initAnswer(page, part, question);
		}
	}
	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.onUnload);
	}
	onUnload(event) {
		// chrome 51之後不再支援dialog顯示文字
		// https://www.chromestatus.com/feature/5349061406228480
		event.returnValue = '';
	}
	initAnswer(page, part, question) {
		switch (page) {
			case 'simple_answer':
				// 當進入簡易題目時
				this.setState({
					duration: 300,
					pageStartTime: new Date().getTime(),
					thisPartAlldatas: filterDatas(part, question)
				});
				break;
			case 'advanced_answer':
				this.setState({
					// 總共有5個part 進階從2~4 每一part是330秒
					duration: 330 * (5 - part),
					pageStartTime: new Date().getTime(),
					thisPartAlldatas: filterDatas(part, question)
				});
				break;
			default:
				break;
		}
	}
	startAnswer(where) {
		const { changePage, toggleLightbox } = this.props;
		if (Object.keys(this.state.introDatas).length === 2) {
			changePage(where);
		} else {
			toggleLightbox(true, '例題尚未試做');
		}
	}
	handleNextIndex(index, isAnswerDone) {
		// 做題時的下一頁
		if (!this.haveAllQuestionDone(isAnswerDone)) return;
		const { nextIndex } = this.props;
		const now = new Date().getTime();
		nextIndex(index);
		this.setState(previousState =>
			merge({}, previousState, {
				// 記錄每頁做答所花的時間
				secPage: {
					[index]: Math.ceil((now - this.state.pageStartTime) / 1000)
				},
				pageStartTime: now
			})
		);
	}
	haveAllQuestionDone(isAnswerDone) {
		// 檢查這個PART有沒有所有題目都做完
		const { index, toggleLightbox } = this.props;
		const { count, thisPartAlldatas } = this.state;
		// 最後一頁
		if (isAnswerDone && (count !== thisPartAlldatas.length)) {
			toggleLightbox(true, '您有題目尚未填寫');
			return false;
		}
		// 非最後一頁
		if (!isAnswerDone && (count !== (index * 10) + 10)) {
			toggleLightbox(true, '您有題目尚未填寫');
			return false;
		}
		return true;
	}
	handleAnswer(index, point) {
		const { page } = this.props;
		// 導讀頁的那兩題
		if (page === 'simple_intro' || page === 'advanced_intro') {
			return this.setState({
				...this.state,
				introDatas: {
					...this.state.introDatas,
					[index]: point,
				}
			});
		}
		// 已填寫的題目數量
		if (this.state.thisPartAlldatas[index].point === '') {
			this.state.count += 1;
		}
		// 回答問題時根據index直接返回新的state以更新畫面
		this.setState(previousState =>
			merge({}, previousState, {
				thisPartAlldatas: {
					[index]: {
						point
					}
				},
				count: this.state.count
			})
		);
	}
	handleSubmit(isAnswerDone) {
		if (!this.haveAllQuestionDone(isAnswerDone)) return;
		// 送出答案
		const { secPage, thisPartAlldatas } = this.state;
		// 刷掉已填題目數量
		this.setState({count: 0});
		this.props.submit(secPage, thisPartAlldatas);
	}
	render() {
		const { index, page, question, part, loading } = this.props;
		const	{ thisPartAlldatas, count, duration } = this.state;
		const datas = getDatas(thisPartAlldatas, index, page);
		// 是否為此部分最後一頁
		const isAnswerDone = thisPartAlldatas.length - (index * 10) <= 10;
		if (page === 'simple_answer' || page === 'advanced_answer') {
			// 當是作答狀態時才擋dialog，提醒使用者即將跳出作答頁面
			window.addEventListener('beforeunload', this.onUnload);
		}
		return (
			<div className="original_panel" styleName="test_container">
				<div className="header clearfix">
					<div className="title">
						<h2>{ titleSelector(page) }</h2>
					</div>
					{
						(page === 'simple_answer' || page === 'advanced_answer') &&
						<AnswerInfo
							part={ part }
							count={ count }
						>
							<CountDown duration={ duration } />
						</AnswerInfo>
					}
				</div>
				{
					!loading &&
					<div>
						<AnswerTable
							page={ page }
							question={ `SN${question}` }
							datas={ datas }
							answer={ this.handleAnswer.bind(this) }
						>
							{
								page === 'simple_intro' &&
								<button
									className="mini ui primary button"
									onClick={ this.startAnswer.bind(this, 'simple_answer') }
								>
									開始簡易版測驗
								</button>
							}
							{
								page === 'advanced_intro' &&
								<button
									className="mini ui primary button"
									onClick={ this.startAnswer.bind(this, 'advanced_answer') }
								>
									開始進階版測驗
								</button>
							}
							{ // 不是最後一頁時
								((page === 'simple_answer' || page === 'advanced_answer') && !isAnswerDone) &&
								<button
									className="mini ui primary button"
									onClick={ this.handleNextIndex.bind(this, index, isAnswerDone) }
								>
									下一頁
								</button>
							}
							{ // 是最後一頁時
								((page === 'simple_answer' || page === 'advanced_answer') && isAnswerDone) &&
								<button
									className="mini ui primary button"
									onClick={ this.handleSubmit.bind(this, isAnswerDone) }
								>
									確認送出
								</button>
							}
							{
								page === 'simple_intro' &&
								<SimpleIntro />
							}
							{
								page === 'advanced_intro' &&
								<AdvancedIntro part={ part } />
							}
						</AnswerTable>
						</div>
					}
			</div>
		);
	}
}

function titleSelector(page) {
	switch (page) {
		case 'simple_intro':
			return '簡易版職務適性測驗';
		case 'advanced_intro':
			return '進階版職務適性測驗';
		case 'simple_answer':
			return '簡易版正式做答';
		case 'advanced_answer':
			return '進階版正式做答';
		default:
			return '';
	}
}

function getDatas(thisPartAlldatas, index, page) {
	if (page === 'simple_intro' || page === 'advanced_intro') {
		// 做題目前的導言，及兩題試做的題目
		return [
			{
				QST_ID: '1',
				SN0: 1,
				SN1: 1,
				SN2: 1,
				SN3: 1,
				SN4: 1,
				SN5: 1,
				SN6: 1,
				QST_DESC: '別人都認為我是信守承諾的人。',
				index: 'intro_1'
			}, {
				QST_ID: '2',
				SN0: 2,
				SN1: 2,
				SN2: 2,
				SN3: 2,
				SN4: 2,
				SN5: 2,
				SN6: 2,
				QST_DESC: '我是一個相當守本分的人。',
				index: 'intro_2'
			}
		];
	}
	// 根據頁面的index切割題目
	return slice(thisPartAlldatas, index * 10, (index * 10) + 10);
}

function filterDatas(part, question) {
	// 根據part使用者做到第幾部分 及 question為一開始 random 0~6題組其中一個題組 製作出的題目
	return sortBy(filter(rawDatas, ['PART', String(part)]), `SN${question}`).map(
		(data, index) => {
			// 給予索引，加速回答問題時的修改state時間
			data.index = index;
			data.point = '';
			return data;
		}
	);
}

const actions = { changePage, nextIndex, submit, toggleLightbox };

export default compose(
	connect(null, actions),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Answer);
