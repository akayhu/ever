import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { has, assign, mapValues } from 'lodash/object';
import { keyBy } from 'lodash/collection';
import { cloneDeep } from 'lodash/lang';
import compose from 'src/util/compose';
import css from './index.css';
import {LightBox} from 'c_wap_module';
import {answerPiAPI} from 'src/client/actions/test/pi';
const rawDatas = require('./pi_data.js').PI_DATA;

class Answer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,// 0,1
			answerCount: 0,
			lightbox: false,
			nextLocationPathname: ','
		};
		this.answerQuestion = cloneDeep(rawDatas);
		this.viewQuestions = randomArray(cloneDeep(rawDatas));
	}
	previousPage() {
		this.state.page = 0;
		this.refs.page0.classList.remove('hide');
		this.refs.page1.classList.add('hide');
		this.setState(this.state);
	}
	nextPage() {
		if (this.state.answerCount < 12) {
			this.state.lightbox = true;
			this.setState(this.state);
			return false;
		}
		this.state.page = 1;
		this.refs.page0.classList.add('hide');
		this.refs.page1.classList.remove('hide');
		this.setState(this.state);
	}
	gotoReport() {
		if (this.state.answerCount !== 23) {
			return this.setState({lightbox: true});
		}
		// pid=209928&custno=0&jobIndustryId=1001000000&role=1&sex=0&age=25&education=11&eduDepId=0&eduDepName=+&industryId=0&industryName=+
		// &positionId=0&positionName=+&title=+&source=C
		// &IC01=2&IC02=2&IC03=3&IC04=4&IC05=4&IC06=5&IC07=2&IC08=2&IC09=3&IC10=4&IC11=3&IC12=4&IC13=3&IC14=1&IC15=3&IC16=4&IC17=1&IC18=3&IC19=3&IC20=2&IC21=3&IC22=1&IC23=3
		const params = {
			pid: this.props.user.pid,
			custno: 0,
			sex: 0,
			age: 0,
			role: 1,
			education: 11,
			eduDepId: 0,
			eduDepName: '+',
			industryId: 0,
			industryName: '+',
			positionId: 0,
			positionName: '+',
			title: '+',
			jobIndustryId: 1001000000,
			source: 'C',
			// 做補零、補IC字串、keyBy取出key值、只留point值
			...mapValues(keyBy(this.answerQuestion, key => `IC${padLeft(key.id, 2)}`), o => o.point)
		};
		this.props.answerPiAPI(params).then(() => {
			this.props.next('report');
		});
	}
	answer(id, point) {
		this.props.handleAnswerQuestion(); // 偵測是否有答題，控制跳離時的提醒
		const whichQ = this.answerQuestion[id - 1];
		if (!has(whichQ, 'point')) this.state.answerCount += 1;
		assign(whichQ, {point});
	}
	handleLightBoxCancel() {
		this.setState({
			lightbox: false
		});
	}
	render() {
		return (
			<div className="original_panel">
				<div className="header clearfix">
					<div className="title">
						<h2>產業適性測驗</h2>
					</div>
				</div>
				<div className="body" styleName="test_content">
					<p>
						您好，
					</p>
					<p>
						本測驗目的在幫助您瞭解個人的興趣，以判斷您未來較適合在何種類型的產業發展，完成該測驗後，可以了解適合的產業及注意事項。<br />
						因此不用考慮別人的想法是什麼，答案並沒有所謂的對或錯，請您以一般日常生活中的實際狀況，不需要做過多思考，依直覺反應作答即可。
					</p>
					<table ref="page0">
						<thead>
							<tr styleName="test_head">
								<td colSpan="2" rowSpan="2">請針對以下各項描述判斷符合你的程度</td>
								<td><div>完全不喜歡</div>0%</td>
								<td><div>不喜歡</div>20%</td>
								<td><div>有點不喜歡</div>40%</td>
								<td><div>有點喜歡</div>60%</td>
								<td><div>喜歡</div>80%</td>
								<td><div>非常喜歡</div>100%</td>
							</tr>
							<tr>
								<td>1</td>
								<td>2</td>
								<td>3</td>
								<td>4</td>
								<td>5</td>
								<td>6</td>
							</tr>
						</thead>
						<tbody>
							{
								this.viewQuestions.slice(0, 12).map((item, key) => (
									<tr key={ key }>
										<td>{key + 1}</td>
										<td>{item.desc}</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}1` } type="radio" name={ `r${item.id}` } value="1" />
											<label htmlFor={ `${item.id}1` } onClick={ this.answer.bind(this, item.id, 1) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}2` } type="radio" name={ `r${item.id}` } value="2" />
											<label htmlFor={ `${item.id}2` } onClick={ this.answer.bind(this, item.id, 2) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}3` } type="radio" name={ `r${item.id}` } value="3" />
											<label htmlFor={ `${item.id}3` } onClick={ this.answer.bind(this, item.id, 3) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}4` } type="radio" name={ `r${item.id}` } value="4" />
											<label htmlFor={ `${item.id}4` } onClick={ this.answer.bind(this, item.id, 4) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}5` } type="radio" name={ `r${item.id}` } value="5" />
											<label htmlFor={ `${item.id}5` } onClick={ this.answer.bind(this, item.id, 5) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}6` } type="radio" name={ `r${item.id}` } value="6" />
											<label htmlFor={ `${item.id}6` } onClick={ this.answer.bind(this, item.id, 6) }>
												<div styleName="check" />
											</label>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
					<table ref="page1" className="hide">
						<thead>
							<tr styleName="test_head">
								<td colSpan="2" rowSpan="2">請針對以下各項描述判斷喜歡你的程度</td>
								<td><div>完全不喜歡</div>0%</td>
								<td><div>不喜歡</div>20%</td>
								<td><div>有點不喜歡</div>40%</td>
								<td><div>有點喜歡</div>60%</td>
								<td><div>喜歡</div>80%</td>
								<td><div>非常喜歡</div>100%</td>
							</tr>
							<tr>
								<td>1</td>
								<td>2</td>
								<td>3</td>
								<td>4</td>
								<td>5</td>
								<td>6</td>
							</tr>
						</thead>
						<tbody>
							{
								this.viewQuestions.slice(12, 23).map((item, key) => (
									<tr key={ key }>
										<td>{key + 13}</td>
										<td>{item.desc}</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}1` } type="radio" name={ `r${item.id}` } value="1" />
											<label htmlFor={ `${item.id}1` } onClick={ this.answer.bind(this, item.id, 1) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}2` } type="radio" name={ `r${item.id}` } value="2" />
											<label htmlFor={ `${item.id}2` } onClick={ this.answer.bind(this, item.id, 2) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}3` } type="radio" name={ `r${item.id}` } value="3" />
											<label htmlFor={ `${item.id}3` } onClick={ this.answer.bind(this, item.id, 3) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}4` } type="radio" name={ `r${item.id}` } value="4" />
											<label htmlFor={ `${item.id}4` } onClick={ this.answer.bind(this, item.id, 4) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}5` } type="radio" name={ `r${item.id}` } value="5" />
											<label htmlFor={ `${item.id}5` } onClick={ this.answer.bind(this, item.id, 5) }>
												<div styleName="check" />
											</label>
										</td>
										<td styleName="radioGroup">
											<input id={ `${item.id}6` } type="radio" name={ `r${item.id}` } value="6" />
											<label htmlFor={ `${item.id}6` } onClick={ this.answer.bind(this, item.id, 6) }>
												<div styleName="check" />
											</label>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
					<div styleName="button_div">
						{
							this.state.page === 0 &&
							<button onClick={ this.nextPage.bind(this) } className="ui primary button">下一頁</button>
						}
						{
							this.state.page === 1 &&
							<span>
								<button onClick={ this.previousPage.bind(this) } className="ui normal button">上一頁</button>
								<button onClick={ this.gotoReport.bind(this) } className="ui primary button">送出</button>
							</span>
						}
					</div>
				</div>
				{
					this.state.lightbox &&
					<LightBox
						option={ {
							closeIcon: true,
							submit: {
								text: '確定',
								action: this.handleLightBoxCancel.bind(this)
							}
						} }
						onClose={ this.handleLightBoxCancel.bind(this) }
					>
						<div>您有題目尚未填寫</div>
					</LightBox>
				}
			</div>
		);
	}
}

function padLeft(str, max) { // 數字補零
	if (String(str).length >= max) {
		return String(str);
	}
	return padLeft(`0${str}`, max);
}

function randomArray(array) {
	for (let i = array.length - 1; i > 0; i--) { // 做隨機排序
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

export default compose(
	connect(null, { answerPiAPI }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Answer);
