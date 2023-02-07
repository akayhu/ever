import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import update from 'react-addons-update';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// selectors
import { getGroupInfoData } from 'src/client/reducers/group/selectors';
import { TextField, RadioGroup } from 'c_wap_module';
import Validators from 'src/util/validator';
import Tag from 'src/client/component_common/tag';
import { loadDataByCategory, triggerUpdateGroup } from 'src/client/actions/group/custom_api';

import {actions as CPlatformActions} from "c_platform";
const CPlatformActionsAlert = CPlatformActions.alert;

const config = {
	data: {
		description: ['notEmpty', { maxLength: 1000 }]
	}
};

const val = new Validators(config);

class SetUp extends Component {
	constructor(props) {
		super(props);
		const { id, description, joinSetting, fid, picDrag, tags = [], type } = props.dataInfo;
		this.state = {
			params: {
				channelId: id,
				description: description || '',
				tags,
				joinSetting: joinSetting || 0,
				fid, // 風景照
				picDrag // 風景照座標
			},
			loading: false,
			joinSetUpRadioData: [
				{ label: '自由加入', value: 0 }, 
				{ label: '需經過管理員審核', value: 1 }
			],
			privacyRadioData: [
				{ label: '公開社團', value: 1 },
				{ label: '私人社團', value: 2 }
			]
		};
		if( type === 7 ) this.state.joinSetUpRadioData = null;
	}
	setTag(value) {
		this.setState({
			params: update(this.state.params, {
				tags: { $set: value }
			})
		});
	}
	onChange(key, value) {
		this.setState({
			params: update(this.state.params, {
				description: { $set: value }
			})
		});
	}
	onBlur(key, value) {
		this.setState({
			params: update(this.state.params, {
				description: { $set: value }
			})
		});
	}
	joinSetUpRadioSelect(obj) {
		const privacyValue = obj[0].value;
		this.setState({
			params: update(this.state.params, {
				joinSetting: { $set: parseInt(privacyValue, 10) }
			})
		});
	}
	// privacyRadioSelect(obj) { // 社團隱私設定(先不做)
	// 	this.setState({
	// 		privacyStatus: obj[0].value
	// 	});
	// }
	updateGroupData() {
		const { triggerUpdateGroup } = this.props;
		this.setState({loading: true});
		triggerUpdateGroup(this.state.params).then(() => {
			this.setState({loading: false});
			this.props.showAlert('','','資料已儲存');
		});
	}
	fillAllNeeded() {
		const { description } = this.state.params;
		if (!description)
			return false;
		return true;
	}
	render() {
		const { joinSetUpRadioData, loading } = this.state;
		const { description, joinSetting } = this.state.params;
		const submitDisabled = !this.fillAllNeeded() || loading;

		return (
			<div styleName="associations_set">
				<table>
					<tbody>
						<tr>
							<td><span styleName="need">*</span> 社團簡介：</td>
							<td styleName="pt5">
								<TextField
									name="description"
									value={ description }
									validator={ val }
									allowMultiLine
									height={ 200 }
									placeHolder="請輸入1000個中文字內的社團介紹，讓其他人可以更了解社團經營方向。"
									maxWords={ 1000 }
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
								/>
							</td>
						</tr>
						<tr>
							<td>社團標籤：</td>
							<td styleName="tags">
								<Tag
									tagList={ this.state.params.tags }
									activitySetTag={ this.setTag.bind(this) }
								/>
							</td>
						</tr>
						{ joinSetUpRadioData &&
							<tr>
								<td><span styleName="need">*</span> 新成員加入設定：</td>
								<td>
									<RadioGroup
										group={
											joinSetUpRadioData.map((item) => (item.value === joinSetting) ? {...item, checked: true} : {...item, checked: false})
										}
										name={ 'radio' }
										onSelected={ this.joinSetUpRadioSelect.bind(this) }
									/>
								</td>
							</tr>
						}
						{/*
						<tr>
							<td><span styleName="need">*</span> 社團隱私設定：</td>
							<td>
								<RadioGroup
									group={ privacyRadioData }
									name="radio2"
									checkedIndex={ privacyStatus }
									onSelected={ this.privacyRadioSelect.bind(this) }
									custom={ false }>
								</RadioGroup>
							</td>
						</tr>
						*/}
					</tbody>
				</table>
				<div styleName="button">
					<button
						className="ui primary button"
						onClick={ this.updateGroupData.bind(this) }
						disabled={ submitDisabled }
					>
						儲存修改
					</button>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		dataInfo: getGroupInfoData(state.group)
	};
}

export default compose(
	connect(null, { loadDataByCategory, triggerUpdateGroup , showAlert:CPlatformActionsAlert.showAlert }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SetUp);
