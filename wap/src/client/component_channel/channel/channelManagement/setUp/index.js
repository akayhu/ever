import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

import { TextField } from 'c_wap_module';
import Validators from 'src/util/validator';

import { saveChannelUpdate } from 'src/client/actions/channel';
import { getChannelInfoData } from 'src/client/reducers/channel';

import {actions as CPlatformActions} from "c_platform";
const CPlatformActionsAlert = CPlatformActions.alert;

const config = {
	data: {
		groupIntroduction: ['notEmpty', { maxLength: 1000 }]
	}
};

const val = new Validators(config);

class SetUp extends Component {
	constructor(props, context) {
		super(props, context);
		const { id, fid, picDrag, avatarFileId, description } = props.dataInfo;
		this.state = {
			channelId: id,
			coverFid: fid,
			coverPicDrag: picDrag,
			mediaFid: avatarFileId,
			description:description||""
		};
	}
	onChange(key, value) {
		this.setState({
			description: value
		});
	}
	onBlur(key, value) {
		this.setState({
			description: value
		});
	}
	fillAllNeeded() {
		const { description } = this.state;
		if (!description)
			return false;
		return true;
	}
	updateChannelData() {
		const { saveChannelUpdate } = this.props;
		this.setState({loading: true});
		saveChannelUpdate(this.state).then(() => {
			this.setState({loading: false});
			this.props.showAlert('','','資料已儲存');
		});
	}
	render() {
		const { loading } = this.state;
		const submitDisabled = !this.fillAllNeeded() || loading;
		
		return (
			<div styleName="associations_set">
				<table>
					<tbody>
						<tr>
							<td><span styleName="need">*</span> 頻道簡介：</td>
							<td styleName="pt5">
								<TextField
									name="description"
									value={ this.state.description }
									validator={ val }
									allowMultiLine
									height={ 200 }
									placeHolder="請輸入1000個中文字內的頻道介紹，讓其他人可以更了解頻道經營方向。"
									maxWords={ 1000 }
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<div styleName="button">
					<button
						className="ui primary button"
						onClick={ this.updateChannelData.bind(this) }
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
	const nowState = state.channel;
	return {
		dataInfo: getChannelInfoData(nowState)
	};
}

export default compose(
	connect(null, { saveChannelUpdate , showAlert:CPlatformActionsAlert.showAlert }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SetUp);
