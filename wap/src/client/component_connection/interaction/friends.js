import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { Link } from 'react-router';
import css from './index.css';

// actions
import {disconnect, subscribe, unsubscribe, notice} from 'src/client/actions/connection';
import { accuseTrigger } from 'src/client/actions/accuse';
// components
import { LightBox, DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import SendMessageBtn from 'src/client/component_common/sendMessageBtn';
import AccusePerson from 'src/client/component_common/accuse/person';
import { AddBlockAlert } from 'src/client/component_privacy/block';
import errorHandle from 'src/util/errorHandle';

class Friends extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disconnectLightbox: false,
			blockLightboxOpen: false,
			subscribed: false,
			notified: false,
		};
	}
	componentDidMount() {
		if (this.props.subscribeStatus === true) {
			this.setState({ subscribed: true});
		}

		if (this.props.notificationStatus === true) {
			this.setState({ notified: true});
		}
	}
	handleDisconnect() {
		this.setState({
			disconnectLightbox: true
		});
	}
	handleDisconnectSubmit() {
		const { disconnect, targetPid, pid } = this.props;
		disconnect({
			pid,
			targetPid
		}).then(() => {
			// this.handleLightBoxCancel();

			/**
			 * 抱歉這邊完全是workaround 的解法
			 * 理應當是去reducer調整整塊connection的結構，但真的是沒有時間了....
			 */

			location.reload();
		});
	}
	handleLightBoxCancel() {
		this.setState({
			blockLightboxOpen: false,
			disconnectLightbox: false
		});
	}
	changeNotification() {
		const parameters = {
			pid: this.props.pid,
			targetPid: this.props.targetPid,
		};
		if (this.state.notified) {
			parameters.status = false;
			this.props.notice(parameters).then((msg) => {
				if (errorHandle(msg)) return;
				this.setState({ notified: false });
			});
		} else {
			parameters.status = true;
			this.props.notice(parameters).then((msg) => {
				if (errorHandle(msg)) return;
				this.setState({ notified: true });
			});
		}
	}
	changeSubscription() {
		const parameters = {
			pid: this.props.pid,
			targetPid: this.props.targetPid,
		};
		if (this.state.subscribed) {
			this.props.unsubscribe(parameters).then((msg) => {
				if (errorHandle(msg)) return;
				this.setState({
					subscribed: false,
					notified: false,
				});
			});
		} else {
			this.props.subscribe(parameters).then((msg) => {
				if (errorHandle(msg)) return;
				this.setState({
					subscribed: true,
					notified: true
				});
			});
		}
	}
	handleBlockOpen() {
		this.setState({
			blockLightboxOpen: true
		});
	}
	handleReportOpen() {
		this.props.accuseTrigger('user', {pid: this.props.targetPid});
	}
	render() {
		const blockLightboxOption = {
			closeIcon: true,
			title: `你確定要把${this.props.name}加入黑名單嗎？`
		};
		return (
			<div>
				<div className="ui buttons">
					<SendMessageBtn targetPid={ this.props.targetPid } btnStyle={ `primary ${css.send_message}` } />
					<DropdownMenu>
						<DropdownTarget className={ css.icon_btn }>
							<button className="ui primary button">
								<i className="ellipsis horizontal icon" />
							</button>
						</DropdownTarget>
						<DropdownList>
							<ul className="dropdown" styleName="other_actions">
								<li onClick={ this.changeSubscription.bind(this) }>{this.state.subscribed ? '取消關注' : '關注對方'}</li>
								<li onClick={ this.changeNotification.bind(this) }>{this.state.notified ? '取消通知' : '接收通知'}</li>
								<li >
									<Link
										to={ {
											pathname: `/profile/${this.props.targetPid}`,
											state: {anchorTo: 'endorse'}
										} }
										style={ {color: 'black'} }
									>
										肯定
									</Link>
								</li>
								<li onClick={ this.handleDisconnect.bind(this) }>刪除名片</li>
								<li onClick={ this.handleReportOpen.bind(this, 'checkBoxs') }>帳號檢舉</li>
								<li onClick={ this.handleBlockOpen.bind(this) }>黑名單</li>
							</ul>
						</DropdownList>
					</DropdownMenu>
				</div>
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
					this.state.blockLightboxOpen &&
					<LightBox refs="lightbox" option={ blockLightboxOption } onClose={ this.handleLightBoxCancel.bind(this) }>
						<AddBlockAlert
							pid={ this.props.pid }
							targetPid={ this.props.targetPid }
							userName={ this.props.name }
							avatarWebUrl={ this.props.avatarWebUrl }
							connect={ this.props.connectionStatus }
							handleOnClose={ this.handleLightBoxCancel.bind(this) }
							haveDoubleLightbox
						/>
					</LightBox>
				}
				<AccusePerson />
			</div>
		);
	}
}
export default compose(
	connect(null, {
		subscribe,
		unsubscribe,
		disconnect,
		notice,
		accuseTrigger
	}),
	[CSSModules, '_', css]
)(Friends);
