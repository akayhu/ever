import React, {Component} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import cx from 'classnames';
import css from './index.css';
// function data
import {funcList} from './data';
// actions
import {triggerSubscribe, triggerUnsubscribe} from 'src/client/actions/topic';
// components
import { LightBox, RadioGroup } from 'c_wap_module';

class SubscribePanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: false
		};
		this.funcList = funcList;
		this.topList = [];
		this.topArr = [];
		this.otherList = [];
		this.otherArr = [];
		this.updateList = this.updateList.bind(this);
		this.handleShowMore = this.handleShowMore.bind(this);
		this.selectTop = this.selectTop.bind(this);
		this.selectBot = this.selectBot.bind(this);
	}
	selectTop(obj) {
		const newArr = obj.map(item => item.value);
		this.topArr = [...newArr];
	}
	selectBot(obj) {
		const newArr = obj.map(item => item.value);
		this.otherArr = [...newArr];
	}
	updateList() {
		const {triggerSubscribe, triggerUnsubscribe, close, subscribedList} = this.props;
		const newArr = [...this.topArr, ...this.otherArr];
		const add = newArr.filter(item => subscribedList.indexOf(item) === -1);
		const remove = subscribedList.filter(item => newArr.indexOf(item) === -1);

		if (add.length) triggerSubscribe(add);
		if (remove.length) triggerUnsubscribe(remove);

		close();
	}
	handleShowMore() {
		this.setState({
			showMore: !this.state.showMore
		});
	}
	getLightboxOption() {
		return {
			submit: {
				text: '更新',
				action: this.updateList
			},
			cancel: {
				text: '取消'
			},
			title: '職務訂閱管理'
		};
	}
	precheckFuncList() {
		const {subscribedList} = this.props;
		const length = subscribedList.length;
		// if (!length) return;

		for (let i = 0; i < this.funcList.length; i += 1) {
			if (subscribedList.indexOf(this.funcList[i].value) !== -1) {
				this.funcList[i].checked = true;
			} else {
				this.funcList[i].checked = false;
			}
		}
		this.topList = this.funcList.slice(0, 10);
		this.topArr = this.topList.filter(item => item.checked).map(item => item.value);
		this.otherList = this.funcList.slice(10);
		this.otherArr = this.otherList.filter(item => item.checked).map(item => item.value);
	}
	render() {
		const {show, close} = this.props;
		const {showMore} = this.state;

		if (!show) return null;
		this.precheckFuncList();

		return (
			<LightBox
				option={ this.getLightboxOption() }
				onClose={ close }
			>
				<div styleName="panel_wrapper">
					<div styleName="title">請勾選想要訂閱的職類別</div>
					<div styleName="top_ten_list">
						<RadioGroup
							name="topTen"
							group={ this.topList }
							onSelected={ this.selectTop }
							checkBox
						/>
					</div>
					<div
						styleName="show_more"
						onClick={ this.handleShowMore }
					>
						{showMore ? '收合更多' : '顯示更多'}
					</div>
					<div styleName={ cx('other_list', {hide: !showMore}) }>
						<RadioGroup
							name="other"
							group={ this.otherList }
							onSelected={ this.selectBot }
							checkBox
						/>
					</div>
				</div>
			</LightBox>
		);
	}
}

export default compose(
	connect(null, {triggerSubscribe, triggerUnsubscribe}),
	[CSSModules, '_', css, {allowMultiple: true}],
)(SubscribePanel);
