import React, { Component } from 'react';
import update from 'react-addons-update';
// import { connect } from 'react-redux';
// import { stateToHTML } from 'draft-js-export-html';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField } from 'c_wap_module';
import activityUnit from 'src/client/component_activities/activity/activityUnit.js';
import EndorseItem from './endorseItem';
import { convertToHTML } from 'draft-convert';
import { convertFromRaw } from 'draft-js';
import convertPattern from 'src/client/component_activities/config/convertPattern.js';

class Endorse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			endorseTextfield: false,
			endorseACData: [],
			newEndorse: '',
			errorMessage: '',
			haveUpDown: false
		};
		this.addItem = this.addItem.bind(this);
	}
	setEndorse() {
		const { changeBtnStatus } = this.props;
		if (this.state.endorseTextfield && !this.props.hasOwnProperty('itemData')) {
			if (changeBtnStatus) {
				changeBtnStatus(false);
			}
			const content = convertToHTML(convertPattern)(convertFromRaw(this.props.contentString)); // stateToHTML(contentString);
			activityUnit.suggestEndorseByContent(content).then((res) => {
				this.setState({ endorseTextfield: true });
				if (Array.isArray(res.response)) {
					this.props.activitySetEndorse(res.response);
				}
				if (changeBtnStatus) {
					changeBtnStatus(true);
				}
			});
		} else {
			this.setState({ endorseTextfield: true });
		}
	}
	endorseChange(key, value) {
		if (value.length === 0) {
			this.setState({ endorseACData: [] });
		} else {
			activityUnit.endorseAC(value).then((res) => {
				this.setState({
					endorseACData: res.result,
					errorMessage: ''
				});
			});
		}
		// 處理分號及逗號的狀態
		const lastChar = value.slice(-1);
		if (lastChar === ';' || lastChar === ',') {
			// slice是為了去掉分號或逗號
			this.addItem(value.slice(0, -1));
			return;
		}
		this.setState({ newEndorse: value });
	}
	ACItemSelected(value) {
		// 判斷是不是顯示 "搜尋不到符合的項目，請重新輸入"
		if (value === '搜尋不到符合的項目，請重新輸入') {
			this.setState({ endorseACData: [], newEndorse: '' });
			return;
		}
		this.addItem(value);
	}
	endorseBlur() {
		// onBlur時會自動新增  **這是spec唷**
		this.addItem();
	}
	endorseKeyDown(e) {
		switch (e.keyCode) {
			// 處理點擊Enter時的狀態
			case 13:
				if (this.state.haveUpDown) {
					// enter事件回給AC 用TextField的AC Select去選擇
					this.setState({
						haveUpDown: false
					});
				} else {
					// 代表沒去選過AC 所以就是送出現在輸入的字元
					this.addItem();
				}
				break;
			// 有選擇上下時 enter事件回歸給AC
			case 38: case 40:
				this.setState({
					haveUpDown: true
				});
				break;
			// 冒號與逗號時做新增
			case 186: case 188:
				this.addItem();
				break;
			default:
				break;
		}
	}
	addItem(value = this.state.newEndorse) {
		const { endorsePreferences } = this.props;
		// 空值判斷及空白判斷
		if (value.length !== 0 && value.trim() !== '') {
			// 判斷是否有重複的肯定
			if (endorseCheck(value, endorsePreferences)) {
				const newEndorseArray = update(endorsePreferences, {$push: [value]});
				this.props.activitySetEndorse(newEndorseArray);
				this.setState({ endorseACData: [], newEndorse: '' });
			} else {
				this.setState({
					newEndorse: '',
					endorseACData: [],
					errorMessage: '此肯定項目已經存在'
				});
			}
		} else {
			// 滑鼠離開輸入框AC會消失
			this.setState({
				endorseACData: []
			});
		}
	}
	deleteItem(key, index) {
		const newArray = this.props.endorsePreferences.slice();
		newArray.splice(index, 1);
		this.props.activitySetEndorse(newArray);
	}
	render() {
		const { endorsePreferences } = this.props;
		return (
			<div styleName="sub_function_row">
				<div styleName="container">
					{
						endorsePreferences &&
						endorsePreferences.map((item, index) =>
							<EndorseItem
								text={ item }
								key={ index }
								deleteItem={ () => this.deleteItem('endorsePreferences', index) }
							/>
						)
					}
				</div>
				{
					!this.state.endorseTextfield &&
					<div
						styleName="endorse_btn"
						onClick={ this.setEndorse.bind(this) }
						title="你可以設定要讓他人肯定的專業與特質"
						data-gtm-endorse="設定肯定"
					>
						設定肯定項目
					</div>
				}
				{
					this.state.endorseTextfield &&
					<div>
						<TextField
							name="newEndorse"
							value={ this.state.newEndorse }
							placeHolder="請輸入要新增的肯定專長或特質"
							onKeyDown={ e => this.endorseKeyDown(e) }
							onChange={ this.endorseChange.bind(this) }
							onBlur={ this.endorseBlur.bind(this) }
							ACData={ this.state.endorseACData }
							onSelected={ this.ACItemSelected.bind(this) }
							styleName="endorse_textfield"
							errorMessage={ this.state.errorMessage }
							filterArray={ [';', ','] }
						/>
					</div>
				}
			</div>
		);
	}
}

function endorseCheck(newEndorse, endorsePreferences) {
	let result = true;
	endorsePreferences.forEach((obj) => {
		if (obj === newEndorse)	result = false;
	});
	return result;
}

export default CSSModules(Endorse, css, { allowMultiple: true });
