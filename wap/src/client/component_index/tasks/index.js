import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import ChronicleEditFormEdu from 'src/client/component_profile/chronicle/editformEdu';
import ChronicleEditFormExp from 'src/client/component_profile/chronicle/editformExp';
import ChronicleEditFormHonor from 'src/client/component_profile/chronicle/editformHonor';
import SummaryEditForm from 'src/client/component_profile/summary/editform';
import EndorsePanel from 'src/client/component_profile/endorse/endorsePanel';

import { createEndorse } from 'src/client/actions/endorse';
import { updatePersonalConfig, loadUserConfigByType, loadedUserInfo, loadProfile, checkIdentity, viewAs } from 'src/client/actions/profile';

class Tasks extends Component {
	constructor( props, context ){
		super( props, context );
		this.state = {};
		this.state.defaultFreekey = "";
		this.state.currentCompleteIndex = 0;
		this.state.completeSequence = ['', 'experience', 'education', 'endorse', 'introduction', 'honor'];
		this.state.completeStatus = {
			avatar:0,
			introduction:0,
			education:0,
			experience:0,
			honor:0,
			gallery:0,
			endorse:0,
			activity:0
		};
		this.state.configType = '51a3297a-c173-47e9-8f8b-8d43b479a61e';
		this.state.ignore = [];
		this.state.mainCloseTime = 0;
		this.state.closeTime = 0;
	}
	componentDidMount() {
		let params = {};
		params.pid = this.props.user.pid
		params.typeList = this.state.configType;

		this.props.loadUserConfigByType(params).then(function (res) {
			if (res.response && res.response[0]) {
				this.state.ignore = res.response[0].value.ignore;
			}
		}.bind(this));
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.profile && nextProps.profile.completeStatus && nextProps.config[this.state.configType] ) {
			this.state.completeStatus = nextProps.profile.completeStatus;
			this.state.ignore = nextProps.config[this.state.configType].value.ignore;
			this.state.closeTime = nextProps.config[this.state.configType].value.closeTime;
			this.state.mainCloseTime = nextProps.config[this.state.configType].value.mainCloseTime || 0;

			var date = (new Date()).getTime();
			var mainSkipTime = this.state.mainCloseTime+2592000000;

			if (this.state.mainCloseTime !==0 && date<mainSkipTime) {
				this.state.currentCompleteIndex = -1;
				return;
			}

			for (var index = 1; index <= this.state.completeSequence.length; index++) {
				var seq = this.state.completeSequence[index];
				var status = this.state.completeStatus[seq];
				var skipTime = this.state.closeTime + 2592000000;
				var skip = false;

				if (this.state.ignore.indexOf(index)>=0) {
					if( date<skipTime) {
						skip = true;
					}
				}

				if ((status===null || status === 0) && !skip ) {
					this.state.currentCompleteIndex = index;
					break;
				}
			}
		}
	}
  syncUserInfo() {
		let paramsConfig = {};
		let updateData = [];

		updateData = {};
		updateData.pid = this.props.user.pid;
		updateData.type = this.state.configType;
		updateData.value = {mainCloseTime: this.state.mainCloseTime, closeTime: this.state.closeTime, ignore: this.state.ignore.sort()};

		paramsConfig.updateData = JSON.stringify([updateData]);
		paramsConfig.pid = this.props.user.pid;

		this.props.updatePersonalConfig(paramsConfig).then(function(res) {
			if(res.response) {
				let paramsc = {};
				paramsc.pid = this.props.user.pid
				paramsc.typeList = this.state.configType;
				this.props.loadUserConfigByType(paramsc);
				let params = {};
				params.pid = -3;
				params.targetPid = this.props.user.pid;
				this.props.loadedUserInfo(params);
			} else {
				alert('some error');
			}
		}.bind(this));
	}
	handleExpEdit (e) {
		var date = new Date();
		this.state.closeTime = date.getTime();
		this.state.ignore.push(1);
		this.state.currentCompleteIndex = -1;
		this.syncUserInfo();
	}
	handleEduEdit (e) {
		var date = new Date();
		this.state.closeTime = date.getTime();
		this.state.ignore.push(2);
		this.state.currentCompleteIndex = -1;
		this.syncUserInfo();

	}
	handleHonorEdit(e) {
		var date = new Date();
		this.state.closeTime = date.getTime();
		this.state.ignore.push(5);
		this.state.currentCompleteIndex = -1;
		this.syncUserInfo();
  }
	handleEditIntroduction(e) {
		switch(e) {
			case 'none':
			var date = new Date();
			this.state.closeTime = date.getTime();
			this.state.ignore.push(4);
			this.state.currentCompleteIndex = -1;
			this.syncUserInfo();
			break;
		}
	}
	handleCreateEndorse ({title, desc, type}) {
		this.props.createEndorse({
			targetPid: this.props.user.pid,
			item: title,
			type: type,
			desc: desc,
			pid: this.props.user.pid
		});
		var date = new Date();
		this.state.closeTime = date.getTime();
		this.state.ignore.push(3);
		this.state.currentCompleteIndex = -1;
		this.syncUserInfo();
	}
	skipCreateEndorse () {
		var date = new Date();
		this.state.closeTime = date.getTime();
		this.state.ignore.push(3);
		this.state.currentCompleteIndex = -1;
		this.syncUserInfo();
	}
	closeAllTask() {
		var date = new Date();
		this.state.mainCloseTime = date.getTime();
		this.state.currentCompleteIndex = -1;
		this.syncUserInfo();
	}
	updateDefaultFreekey(str) {
		this.state.defaultFreekey = str;
		this.setState({	defaultFreekey: this.state.defaultFreekey	});
	}
	render() {
		const renderAry = [];
		// this.state.currentCompleteIndex === 1 && renderAry.push(
		// <div styleName="task">
		// 	<i className="cross icon" onClick={this.closeAllTask.bind(this)} data-gtm-index="關閉 經歷"></i>
		// 	<div styleName="task_title" className="h2">新增工作經歷</div>
		// 	<div styleName="task_desc">增加多筆工作經歷，讓企業能了解您這樣的頂尖人士！</div>
		// 	<ChronicleEditFormExp
		// 		changeStatus={()=>this.handleExpEdit()}
		// 		editformClass="add"
		// 		params={ {pid: this.props.user.pid } }
		// 		user={ this.props.user }
		// 		cancelButtonText="略過"
		// 		mode="simple" />
		// </div>)

		// this.state.currentCompleteIndex === 2 && renderAry.push(
		// <div styleName="task">
		// 	<i className="cross icon" onClick={this.closeAllTask.bind(this)} data-gtm-index="關閉 學歷"></i>
		// 	<div styleName="task_title" className="h2">新增學歷背景</div>
		// 	<div styleName="task_desc">完成學歷背景，讓你輕易的拓展職場人脈</div>
		// 	<ChronicleEditFormEdu
		// 		changeStatus={()=>this.handleEduEdit()}
		// 		editformClass="add"
		// 		params={ {pid: this.props.user.pid } }
		// 		user={ this.props.user }
		// 		cancelButtonText="略過"
		// 		mode="simple" />
		// </div>)

		// this.state.currentCompleteIndex === 3 && renderAry.push(
		// <div styleName="task">
		// 	<i className="cross icon" onClick={this.closeAllTask.bind(this)} data-gtm-index="關閉 肯定"></i>
		// 	<div styleName="task_title" className="h2">新增專長特質與證照</div>
		// 	<div styleName="task_desc">新增專長、特質或證照可以讓大家來肯定你的專業！</div>
		// 	<EndorsePanel
		// 		add={ true }
		// 		isEdit={ true }
		// 		desc=""
		// 		viewas={ this.props.viewas}
		// 		handleSubmit={ this.handleCreateEndorse.bind(this) }
		// 		handleCancel={ this.skipCreateEndorse.bind(this) }
		// 		params={ {pid: this.props.user.pid } }
		// 		user={ this.props.user }
		// 		cancelButtonText="略過"
		// 		simpleMode
		// 	/>
		// </div>)

		// this.state.currentCompleteIndex === 4 && renderAry.push(
		// <div styleName="task">
		// 	<i className="cross icon" onClick={this.closeAllTask.bind(this)} data-gtm-index="關閉 個人摘要"></i>
		// 	<div styleName="task_title" className="h2">新增個人摘要</div>
		// 	<div styleName="task_desc">新增個人摘要，清楚傳達個人價值和想法。</div>
		// 	<SummaryEditForm
		// 		changeEditStatus={ this.handleEditIntroduction.bind(this) }
		// 		pid={ this.props.user.pid }
		// 		privacySetting={ 1 }
		// 		defaultFreekey={ ( this.state.defaultFreekey ) ? this.state.defaultFreekey : this.props.profile.introduction }
		// 		updateDefaultFreekey={ this.updateDefaultFreekey.bind(this) }
		// 		user={ this.props.user }
		// 		cancelButtonText="略過"
		// 		simpleMode
		// 	/>
		// </div>)

		// this.state.currentCompleteIndex === 5 && renderAry.push(
		// <div styleName="task">
		// 	<i className="cross icon" onClick={this.closeAllTask.bind(this)} data-gtm-index="關閉 職涯成就"></i>
		// 	<div styleName="task_title" className="h2">新增職涯成就</div>
		// 	<div styleName="task_desc">新增職涯成就，展現專業能力及團隊合作能力！</div>
		// 	<ChronicleEditFormHonor
		// 		changeStatus={()=>this.handleHonorEdit()}
		// 		editformClass="add"
		// 		user={ this.props.user }
		// 		chronicle={ this.props.chronicle }
		// 		cancelButtonText="略過"
		// 		simpleMode
		// 	/>
		// </div>)

		return renderAry.shift();
	}
}

function mapStateToProps( state, props ) {
	return {
		profile: state.profile.user_info,
		config: state.profile.config,
		viewas: state.profile.viewas,
		user: state.user,
		chronicle: state.chronicle,
	}
}

const actions = {updatePersonalConfig, loadUserConfigByType, loadedUserInfo, loadProfile, checkIdentity, viewAs,createEndorse}

export default compose(
	connect(mapStateToProps, actions),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Tasks);
