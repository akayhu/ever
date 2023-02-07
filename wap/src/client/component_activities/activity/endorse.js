import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { TextField } from 'c_wap_module';
import { addEndorsement } from 'src/client/actions/activity';
import { showPlatformAlert } from 'src/client/actions/alert';
import activityUnit from 'src/client/component_activities/activity/activityUnit';
import EndorseItem from './endorseItem';

class Endorse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			endorseTextfield: false,
			newEndorse: '',
			errorMessage: '',
			endorseACData: [],
		};
	}
	endorseTextfieldTrigger() {
		// 為黑名單時無法操作
		// 頻道文章不受黑名單限制 http://jira.104.com.tw/browse/BIGC-1526
		const isChannelActivity = !!this.props.itemData.channelInfo && this.props.itemData.channelInfo.type === 10;
		if (this.props.itemData.userInfo.blockStatus && !isChannelActivity) {
			return this.props.showPlatformAlert('權限不足，無法操作這個動作');
		}
		if (!this.props.user.isLogin) {
			this.props.showHint();
			return;
		}
		this.setState({ endorseTextfield: true });
	}
	endorseChange(key, value) {
		if (value.length === 0) {
			this.setState({ endorseACData: [] });
		} else {
			activityUnit.endorseAC(value).then(res =>
				this.setState({
					endorseACData: res.result,
					errorMessage: ''
				})
			);
		}
		this.setState({ newEndorse: value });
	}
	endorseBlur() {
		this.setState({ newEndorse: '', endorseACData: [] });
	}
	ACItemSelected(value) {
		if (value === '搜尋不到符合的項目，請重新輸入') {
			this.setState({ endorseACData: [], newEndorse: '' });
			return;
		}
		if (endorseCheck(value, this.props.itemData.endorseHoneyPot)) {
			this.props.addEndorsement(this.props.itemData, {
				item: value, 
				count: 1, 
				endorseIt: true
			});
			this.setState({ newEndorse: '' });
		} else {
			this.setState({
				newEndorse: '',
				endorseACData: [],
				errorMessage: '此肯定項目已經存在'
			});
		}
	}
	render() {
		const endorseText = (this.props.itemData.endorseHoneyPot.length === 0) ? '成為第一個給予這篇文章肯定的人' : '+新增項目';
		const gtmValue = (this.props.itemData.endorseHoneyPot.length === 0) ? '第一個肯定' : '+新增項目';
		return (
			<div styleName="endorse_block">
				{
					!this.props.author &&
					<h2 styleName="endorse_title">根據這篇分享，你想肯定{ this.props.itemData.userInfo.userName }什麼專業?</h2>
				}
				<div styleName="endorse_row">
					{
						this.props.itemData.endorseHoneyPot.map((item, index) => {
							// 是isExpectEndorse(是作者預設的肯定)
							// 拿來做在作者看自己文章時預設的肯定不能做刪除
							// 編輯時才能刪除預設的肯定
							let isExpectEndorse = false;
							if (this.props.author && (this.props.itemData.expectEndorseList.indexOf(item.item) !== -1)) {
								isExpectEndorse = true;
							}
							return (
								<EndorseItem
									key={ item.item }
									index={ index }
									user={ this.props.user }
									data={ item }
									author={ this.props.author }
									itemData={ this.props.itemData }
									isExpectEndorse={ isExpectEndorse }
									showHint={ this.props.showHint }
								/>
							);
						})
					}
				</div>
				{
					!this.props.author && !this.state.endorseTextfield &&
					<div
						onClick={ this.endorseTextfieldTrigger.bind(this) }
						styleName="endorse_btn"
						data-gtm-endorse={ gtmValue }
					>
						{ endorseText }
					</div>
				}
				{
					!this.props.author && this.state.endorseTextfield &&
					<TextField
						name="newEndorse"
						value={ this.state.newEndorse }
						placeHolder="請輸入要新增的肯定專長或特質"
						onChange={ this.endorseChange.bind(this) }
						onBlur={ this.endorseBlur.bind(this) }
						ACData={ this.state.endorseACData }
						onSelected={ this.ACItemSelected.bind(this) }
						styleName="endorse_textfield"
						errorMessage={ this.state.errorMessage }
						filterArray={ [';', ','] }
					/>
				}
			</div>
		);
	}
}

function endorseCheck(newEndorse, endorsePreferences) {
	let result = true;
	endorsePreferences.forEach((obj) => {
		if (obj.item === newEndorse) result = false;
	});
	return result;
}

// function mapStateToProps(state) {
// 	return {
// 		pid: state.user.pid
// 	};
// }

export default compose(
	connect(null, { addEndorsement, showPlatformAlert }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Endorse);
