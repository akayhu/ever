import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import errorHandle from 'src/util/errorHandle';
// style
import css from './index.css';
// actions
import {
subscribe, unsubscribe, notice
} from 'src/client/actions/connection';
import { setDirectPanel } from 'src/client/actions/alert';

// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

class SubscribePeople extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subscribed: props.subscribeStatus || false,
			notified: props.notificationStatus || false,
			loading: false
		};
		this.gtmTag = this.getGTMTag();
		this.subscribedPeople = this.subscribedPeople.bind(this);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.changeNotification = this.changeNotification.bind(this);
		// for button style
		this.sizeStyle = props.small ? 'small' : '';
	}
	getButtonStyle() {
		const { loading } = this.state;
		const { primary, normal, line } = this.props;
		let style;
		if (primary) style = 'primary';
		if (normal) style = 'normal';
		if (line) style = 'line';
		if (!style) style = 'primary';
		return `${style} ${loading ? 'disabled loading' : ''}`;
	}
	subscribedPeople() {
		const {targetPid, subscribe, unsubscribe} = this.props;
		const parameters = {targetPid};

		this.setState({ loading: true });
		if (!this.state.subscribed) {
			subscribe(parameters).then((msg) => {

				if (errorHandle(msg)) {
					return this.setState({ loading: false });
				}
				else {
					this.setState({
						subscribed: true,
						notified: true,
						loading: false
					});
				}
				
			});
		} else {
			unsubscribe(parameters).then((msg) => {
				if (errorHandle(msg)) {
					return this.setState({ loading: false });
				}
				else {
					this.setState({
						subscribed: false,
						notified: false,
						loading: false
					});
				}
				
			});
		}
	}
	changeNotification() {
		const {notified} = this.state;
		const {targetPid, notice} = this.props;
		const parameters = {targetPid};

		parameters.status = !notified;
		notice(parameters).then((msg) => {
			if (errorHandle(msg)) return;
			this.setState({ notified: !notified });
		});
	}
	toggleOpen() {
		if (!this.props.user.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}
	}
	getGTMTag() {
		const gtmPostText = 'connect';
		return {
			subscribeTag: {[`data-gtm-${gtmPostText}`]: '關注'},
			subscribingTag: {[`data-gtm-${gtmPostText}`]: '關注中'},
			notSubscribeTag: {[`data-gtm-${gtmPostText}`]: '取消關注'},
			notifyTag: {[`data-gtm-${gtmPostText}`]: '接收通知'},
			notNotifyTag: {[`data-gtm-${gtmPostText}`]: '取消通知'},
		};
	}
	renderUnSubButton() {
		const { subscribeTag } = this.gtmTag;
		return (
			<button
				className={ `ui normal button ${this.sizeStyle}` }
				onClick={ this.subscribedPeople }
			>
				<span { ...subscribeTag }>關注</span>
			</button>
		);
	}
	renderSubedButton() {
		const { fullModeButton, alwaysShow, reversible } = this.props;
		const { subscribed, notified } = this.state;
		const { subscribingTag, notSubscribeTag, notifyTag, notNotifyTag } = this.gtmTag;
		// 已關注是否要顯示
		if (!alwaysShow) return null;
		// 已關注但不可取消(只顯示文字)
		if (!reversible) {
			return <button className={ `ui normal button disabled ${this.sizeStyle}` }>已關注</button>;
		}
		// 已關注可取消(顯示普通按鈕)
		if (!fullModeButton) {
			return (
				<button
					className={ `ui normal button ${this.sizeStyle}` }
					onClick={ this.subscribedPeople }
				>
					取消關注
				</button>
			);
		}
		// 已關注可取消(顯示下拉按鈕)
		return (
			<DropdownMenu
				className={ `ui button ${this.getButtonStyle()} ${this.sizeStyle}` }
				toggleOpen={ this.toggleOpen }
			>
				<DropdownTarget>
					<span { ...subscribingTag }>關注中</span>
				</DropdownTarget>
				<DropdownList>
					<ul className="dropdown" styleName="other_actions">
						{notified
							? <li { ...notNotifyTag } onClick={ this.changeNotification }>
									取消通知
								</li>
							: <li { ...notifyTag } onClick={ this.changeNotification }>
									接收通知
								</li>
						}
						{subscribed &&
							<li { ...notSubscribeTag } onClick={ this.subscribedPeople }>
								取消關注
							</li>
						}
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
	render() {
		const { subscribed} = this.state;
		const { pid, targetPid, subscribeStatus } = this.props;
		if (pid === targetPid) return null;

		if (!subscribed && !subscribeStatus) {
			return this.renderUnSubButton();
		}
		return this.renderSubedButton();
	}
}

SubscribePeople.defaultProps = {
	fullModeButton: true,
	alwaysShow: true,
	reversible: true,
	primary: false,
	normal: false,
	line: false,
	small: false
};

SubscribePeople.propTypes = {
	pid: PropTypes.number,
	targetPid: PropTypes.number.isRequired,
	fullModeButton: PropTypes.bool,
	alwaysShow: PropTypes.bool,
	reversible: PropTypes.bool,
	primary: PropTypes.bool,
	normal: PropTypes.bool,
	line: PropTypes.bool,
	small: PropTypes.bool
};
export default compose(
	connect(state => ({user: state.user}), { subscribe, unsubscribe, notice, setDirectPanel }),
	[CSSModules, '_', css]
)(SubscribePeople);
