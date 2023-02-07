"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import * as connectionActions from '../../../../actions/connection';
import css from './style.css';

class AnswerRequest extends Component {
	componentWillMount(){
		this.setState({
			isShowMsg: false,
			msgType: 0 // 0:nothing,1:yes,2:no,3:error,4:error&msg
		});
	}
	
	setShowMsg(isAccept){
		this.setState({
			isShowMsg: true,
			msgType: isAccept
		});
	}
	
	connectionAccept(){
		this.setShowMsg(1);
		this.props.connectionAccept({
			targetPid: this.props.person.pid
		}).then(function(result){
			if(result.hasOwnProperty('response') && result.response.hasOwnProperty('errorCode')){
				this.setShowMsg(3);
			}
		}.bind(this));
	}
	
	connectionReject(){
		this.setShowMsg(2);
		this.props.connectionReject({
			targetPid: this.props.person.pid
		}).then(function(result){
			if(result.hasOwnProperty('response') && result.response.hasOwnProperty('errorCode')){
				this.setShowMsg(3);
			}
		}.bind(this));
		
	}
	
	renderBtn() {
		return !this.state.isShowMsg && (
			<div className={css['btn-wrap']}>
				<button type="button" className="main-btn" onClick={this.connectionAccept}>確認</button>
				<button type="button" className="normal-btn" onClick={this.connectionReject}>拒絕邀請</button>
			</div>
		);
	}
	
	renderMsg(){
		return this.state.isShowMsg && (
			<div className={css['text-wrap']}>
				{this.state.msgType === 1 && '已成為朋友'}
				{this.state.msgType === 2 && '已拒絕邀請'}
				{this.state.msgType === 3 && '系統忙碌，請稍候再試'}
			</div>
		);
	}
	
	render() {
		return (
			<div className={css['operating-area']}>
				<a href="#" className={css['subscribe']}>{this.props.person.mutualFriendCount}個共同朋友</a>
				{this.renderBtn()}
				{this.renderMsg()}
			</div>
		);
	}
}

const AnswerRequestCss = CSSModules( AnswerRequest, css, { allowMultiple : true } )
//const AnswerRequestTranslate = translate( [] )( AnswerRequestCss );
export default connect(null, {connectionActions})(AnswerRequestCss);