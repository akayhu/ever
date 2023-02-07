"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import * as connectionActions from '../../../../actions/connection';
import css from './style.css';

class InviteRequest extends Component {
	componentWillMount(){
		this.setState({
			isShowInviteMsg: false,
			inviteType: 0, // 0:nothing,1:yes,2:error,3:error&msg
			isShowSubscribeMsg: false,
			subscribeType: 0 // 0:nothing,1:yes,2:error,3:error&msg
		});
	}
	
	setShowInviteMsg(isInvite){
		this.setState({
			isShowInviteMsg: true,
			inviteType: isInvite
		});
	}
	
	setShowSubscribeMsg(isSubscribe){
		this.setState({
			isShowSubscribeMsg: true,
			subscribeType: isSubscribe
		});
	}
	
	connectionInvite(){
		this.setShowInviteMsg(1);
		this.props.connectionInvite({
			targetPid: this.props.person.pid,
			relationType: 3,
			memo: ""
		}).then(function(result){
			if(result.hasOwnProperty('response') && result.response.hasOwnProperty('errorCode')){
				this.setShowInviteMsg(2);
			}
		}.bind(this));
	}
	
	connectionSubscribe(){
		this.setShowSubscribeMsg(1);
		this.props.connectionSubscribe({
			targetPid: this.props.person.pid,
			type: 1
		}).then(function(result){
			if(result.hasOwnProperty('response') && result.response.hasOwnProperty('errorCode')){
				this.setShowSubscribeMsg(2);
			}
		}.bind(this));
	}
	
	renderMutualFriendCount(){
		return this.props.mutualFriendCount && (<a href="#" className={css['subscribe']}>{this.props.mutualFriendCount}共同朋友</a>);
	}
	
	renderSubscribeCount(){
		return this.props.subscribeCount && (<a href="#" className={css['subscribe']}>{this.props.subscribeCount}人關注</a>);
	}
	
	renderInviteBtn() {
		return this.props.invite !== false && !this.state.isShowInviteMsg && (
			<button type="button" className="main-btn" onClick={this.connectionInvite}>交換名片</button>
		);
	}
	
	renderInviteMsg(){
		return this.props.invite !== false && this.state.isShowInviteMsg && (
			<span className={css['msg']}>
				{this.state.inviteType === 1 && '已送出邀請'}
				{this.state.inviteType === 2 && '系統忙碌，請稍候再試'}
			</span>
		);
	}
	
	renderSubscribeBtn() {
		return !this.state.isShowSubscribeMsg && (
			<button type="button" className="normal-btn" onClick={this.connectionSubscribe}>加關注</button>
		);
	}
	
	renderSubscribeMsg(){
		return this.state.isShowSubscribeMsg && (
			<span className={css['msg']}>
				{this.state.subscribeType === 1 && '已關注'}
				{this.state.subscribeType === 2 && '系統忙碌，請稍候再試'}
			</span>
		);
	}
	
	render() {
		return (
			<div className={css['operating-area']}>
				{this.renderMutualFriendCount()}{this.renderSubscribeCount()}
				<div className={css['btn-wrap']}>
					{this.renderInviteBtn()}{this.renderInviteMsg()}
					{this.renderSubscribeBtn()}{this.renderSubscribeMsg()}
				</div>
			</div>
		);
	}
}

const InviteRequestCss = CSSModules( InviteRequest, css, { allowMultiple : true } )
//const InviteRequestTranslate = translate( [] )( InviteRequestCss );
export default connect(null, {connectionActions})(InviteRequestCss);