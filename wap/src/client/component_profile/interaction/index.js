import React, {Component} from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { withRouter } from 'react-router';
import compose from 'src/util/compose';
import css from './index.css';
import Exenv from 'exenv';

// actions
import { createFromPromotion, initialFromPromotion } from 'src/client/actions/global';
import { viewAs, loadProfile } from 'src/client/actions/profile';
import { getConnectionStatus, subscribe, unsubscribe, notice, disconnect } from 'src/client/actions/connection';
import { accuseTrigger } from 'src/client/actions/accuse';
import { setDirectPanel } from 'src/client/actions/alert';

// components
import { LightBox, DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import SendMessageBtn from 'src/client/component_common/sendMessageBtn';
import ChangeCard from 'src/client/component_common/changeCard';
import AccusePerson from 'src/client/component_common/accuse/person';
import { AddBlockAlert } from 'src/client/component_privacy/block';

class Interaction extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			disconnectLightbox: false,
			blockLightboxOpen: false,
			interactionLockLightbox: false,
			profileEdittingHintLightbox: false,
			profileEdittingType: '',
		};
	}
	sendMessage() {
		if (!this.props.user.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}

		if (this.props.interactionLock) {
			this.state.interactionLockLightbox = true;
			this.setState(this.state);
			return;
		}
	}
	toggleSubscribe(subscribeStatus) {
		if (!this.props.user.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}

		if (this.props.interactionLock) {
			this.setState({interactionLockLightbox: true});
			return;
		}

		if (subscribeStatus) {
			this.props.unsubscribe({targetPid: this.props.params.pid});
		} else {
			this.props.subscribe({targetPid: this.props.params.pid});
		}
	}
	toggleNotification(notificationStatus) {
		if (!this.props.user.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}

		if (this.props.interactionLock) {
			this.state.lightbox = true;
			this.setState(this.state);
			return;
		}

		const params = {};
		params.pid = this.props.user.pid;
		params.targetPid = this.props.params.pid;
		params.status = !notificationStatus;

		this.props.notice(params);
	}

	handleViewAs(viewas, interactionLock) {
		if (this.state.profileEdittingHintLightbox) {
			this.setState({ profileEdittingHintLightbox: false });
		}
		this.props.viewAs(viewas, interactionLock);
		this.props.initialFromPromotion();
		this.props.router.push('/profile/' + this.props.params.pid);
	}
	handleLightBoxOpen() {
		if (!this.props.user.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}
		if (this.props.interactionLock) {
			this.state.interactionLockLightbox = true;
			this.setState(this.state);
			return;
		}

		this.props.accuseTrigger('user', this.props.profile);
	}
	handleBlockOpen() {
		if (!this.props.user.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}
		if (this.props.interactionLock) {
			this.state.interactionLockLightbox = true;
			this.setState(this.state);
			return;
		}
		this.setState({
			blockLightboxOpen: true
		});
	}
	handleLightBoxCancel() {
		this.setState({
			blockLightboxOpen: false,
			interactionLockLightbox: false,
			disconnectLightbox: false,
			profileEdittingHintLightbox: false
		});
	}
	handleDisconnect() {
		if (this.props.interactionLock) {
			this.state.interactionLockLightbox = true;
			this.setState(this.state);
			return;
		}
		this.setState({disconnectLightbox: true});
	}
	onViewpointSelected(e) {
		if (this.props.interactionLock) {
			this.state.interactionLockLightbox = true;
			this.setState(this.state);
			return;
		}

		if (this.props.global.onChange === true) {
			this.state.profileEdittingType = e;
			this.setState({ profileEdittingHintLightbox: true });
		} else {
			this.handleViewAs.call(this, e, 1);
		}
	}
	getTitle() {
		const { companyName, jobTitle, schoolName, major} = this.props.profile;
		if (companyName && jobTitle !== null) {
			return (`${jobTitle} ${companyName}`);
		} else if (schoolName && major !== null) {
			return (`${major} ${schoolName}`);
		} else {
			return ('');
		}
	}
	handleDisconnectSubmit() {
		const params = {
			pid: this.props.user.pid,
			targetPid: this.props.params.pid
		};

		this.props.disconnect(params).then(() => {
			this.handleLightBoxCancel();
			this.props.getConnectionStatus(params);
			Exenv.canUseDOM && window.location.reload();
		});
	}
	runderViewasSelf() {
		return (
			<div styleName="interaction">
				<DropdownMenu >
					<DropdownTarget>
						<button className="ui primary button" data-gtm-profile="檢視角度">檢視角度&nbsp;<i className="caret down icon" /></button>
					</DropdownTarget>
					<div className="dropdownList">
						<DropdownList>
							<ul className="dropdown" styleName="viewpoint">
								<li onClick={ this.onViewpointSelected.bind(this, 'other') }>
									<i />公開
							</li>
								<li onClick={ this.onViewpointSelected.bind(this, 'friend') }>
									<i />朋友
							</li>
							</ul>
						</DropdownList>
					</div>
				</DropdownMenu>
			</div>
		);
	}
	runderViewasOtherOrFriend() {
		const	blockLightboxOption = {
			closeIcon: true,
			title: `你確定要把${this.props.profile.userName}加入黑名單嗎？`
		};
		const	edittingHintOption = {
			submit: {
				text: '確定',
				action: this.handleViewAs.bind(this, this.state.profileEdittingType, 1)
			},
			cancel: {
				text: '取消',
				action: this.handleLightBoxCancel.bind(this)
			},
			closeIcon: true
		};

		return (
			<div styleName="interaction">
				{
					this.props.viewas === 'other' && this.props.interactionLock !== 1 && this.props.params.pid &&
					<ChangeCard
						pid={ this.props.user.pid }
						targetPid={ this.props.params.pid }
						connectionStatus={ this.props.connectionStatus }
						mutualFriendCount={ 0 }
					/>
				}
				{
					this.props.viewas === 'other' && this.props.interactionLock === 1 &&
					<button className="ui primary button" onClick={ this.sendMessage.bind(this) } data-gtm-connect="交換名片">交換名片</button>
				}
				{
					this.props.viewas === 'friend' && this.props.interactionLock !== 1 &&
					<SendMessageBtn targetPid={this.props.params.pid } />
				}
				{
					this.props.viewas === 'friend' && this.props.interactionLock === 1 &&
					<button className="ui primary button" onClick={ this.sendMessage.bind(this) }>傳送訊息</button>
				}
				<div styleName="more_interaction" className="ui transparent buttons">
					<button
						className="ui transparent button"
						onClick={ this.toggleSubscribe.bind(this, this.props.subscribeStatus) }
					>
						{
							this.props.subscribeStatus &&
							<span data-gtm-connect="取消關注">取消關注</span>
						}
						{
							this.props.subscribeStatus === false &&
							<span data-gtm-connect="關注">關注</span>
						}
					</button>
					<DropdownMenu className="ui transparent icon button">
						<DropdownTarget>
							<i className="ellipsis horizontal icon" />
						</DropdownTarget>
						<DropdownList>
							<ul className="dropdown" styleName="other_actions">
								{
									this.props.subscribeStatus &&
									<li onClick={ this.toggleNotification.bind(this, this.props.notificationStatus) }>
										{
											this.props.notificationStatus &&
											<span data-gtm-connect="取消通知">取消通知</span>
										}
										{
											this.props.notificationStatus === false &&
											<span data-gtm-connect="接收通知">接受通知</span>
										}
									</li>
								}
								{
									this.props.viewas === 'friend' &&
									<li onClick={ this.handleDisconnect.bind(this) } data-gtm-connect="刪除名片">刪除名片</li>
								}
								<li onClick={ this.handleLightBoxOpen.bind(this, 'checkBoxs') } data-gtm-connect="帳號檢舉">帳號檢舉</li>
								<li onClick={ this.handleBlockOpen.bind(this) } data-gtm-connect="黑名單">黑名單</li>
							</ul>
						</DropdownList>
					</DropdownMenu>
				</div>
				{
					this.state.interactionLockLightbox &&
					<LightBox refs="lightbox" option={ {closeIcon: true} } onClose={ this.handleLightBoxCancel.bind(this) }>
						<div className="h3" styleName="interactionLock">
						預覽模式不提供使用
						</div>
					</LightBox>
				}
				{
					this.state.blockLightboxOpen &&
					<LightBox refs="lightbox" option={ blockLightboxOption } onClose={ this.handleLightBoxCancel.bind(this) }>
						<AddBlockAlert
							pid={ this.props.user.pid }
							targetPid={ this.props.params.pid }
							userName={ this.props.profile.userName }
							avatarWebUrl={ this.props.profile.avatarWebUrl }
							connect={ this.props.connectionStatus }
							handleOnClose={ this.handleLightBoxCancel.bind(this) }
							haveDoubleLightbox
						/>
					</LightBox>
				}
				{
					this.state.disconnectLightbox &&
					<LightBox 
						option={ {
							closeIcon: true,
							submit: {
								text: '確定',
								action: this.handleDisconnectSubmit.bind(this)
							},
							cancel: {text: '取消'}
						} }
						onClose={ this.handleLightBoxCancel.bind(this) }
					>
						<div>確定要跟此人解除關係?</div>
					</LightBox>
				}
				{
					this.state.profileEdittingHintLightbox &&
					<LightBox option={ edittingHintOption } onClose={ this.handleLightBoxCancel.bind(this) }>
						<h3>正在編輯個人檔案，確定要離開此頁面嗎？</h3>
					</LightBox>
				}
				<AccusePerson />
			</div>
		);
	}
	render() {
		if (this.props.viewas === 'self') {
			return this.runderViewasSelf();
		} else if (this.props.viewas === 'other' || this.props.viewas === 'friend') {
			return this.runderViewasOtherOrFriend();
		}
	}
}

function mapStateToProps(state, props) {
	const targetPid = parseInt(props.params.pid);
	const pid = parseInt(state.user.pid);
	return {
		connectionStatus: state.connection.connection_status[props.params.pid] ? state.connection.connection_status[props.params.pid].connectionStatus : 0,
		subscribeStatus: state.connection.connection_status[props.params.pid] ? state.connection.connection_status[props.params.pid].subscribeStatus : false,
		notificationStatus: state.connection.connection_status[props.params.pid] ? state.connection.connection_status[props.params.pid].notificationStatus : false,
		interactionLock: state.profile.interactionLock,
		viewas: state.profile.viewas, // self,  friend, other
		user: state.user,
		profile: pid === targetPid ? state.profile.user_info : state.profile.profile_pool[targetPid],
		global: state.global,
		// targetPid: state.profile.user_info.pid,
		// accuseItem: state.accuse.accuseItem.user,
	};
}

const actions = {
	loadProfile,
	viewAs,
	subscribe,
	unsubscribe,
	accuseTrigger,
	createFromPromotion,
	initialFromPromotion,
	notice,
	disconnect,
	getConnectionStatus,
	setDirectPanel
};

export default compose(
	connect(mapStateToProps, actions),
	withRouter,
	[CSSModules, '_', css],
)(Interaction);
