import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import {setDirectPanel} from 'src/client/actions/alert';
import errorHandle from 'src/util/errorHandle';

// style
import css from './index.css';
// actions
import {
subscribe, unsubscribe, notice
} from 'src/client/actions/connection';
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
		if (!this.checkLogin()) {
			return this.directToLogin();
		}
		const {targetPid, subscribe, unsubscribe} = this.props;
		const parameters = {targetPid};

		this.setState({ loading: true });
		if (!this.state.subscribed) {
			subscribe(parameters).then((msg) => {
				if (errorHandle(msg)) {
					return this.setState({ loading: false });
				}
				this.setState({
					subscribed: true,
					notified: true,
					loading: false
				});
			});
		} else {
			unsubscribe(parameters).then((msg) => {
				if (errorHandle(msg)) {
					return this.setState({ loading: false });
				}
				this.setState({
					subscribed: false,
					notified: false,
					loading: false
				});
			});
		}
	}
	changeNotification() {
		if (!this.checkLogin()) {
			return this.directToLogin();
		}
		const {notified} = this.state;
		const {targetPid, notice} = this.props;
		const parameters = {targetPid};

		parameters.status = !notified;
		notice(parameters).then((msg) => {
			if (errorHandle(msg)) return;
			this.setState({ notified: !notified });
		});
	}
	checkLogin() {
		return this.props.isLogin;
	}
	directToLogin() {
		this.props.setDirectPanel(true);
	}
	getGTMTag() {
		const gtmPostText = 'connect';
		return {
			subscribeTag: {[`data-gtm-${gtmPostText}`]: '??????'},
			subscribingTag: {[`data-gtm-${gtmPostText}`]: '?????????'},
			notSubscribeTag: {[`data-gtm-${gtmPostText}`]: '????????????'},
			notifyTag: {[`data-gtm-${gtmPostText}`]: '????????????'},
			notNotifyTag: {[`data-gtm-${gtmPostText}`]: '????????????'},
		};
	}
	renderUnSubButton() {
		const { subscribeTag } = this.gtmTag;
		return (
			<button
				className={ `ui normal button ${this.sizeStyle}` }
				onClick={ this.subscribedPeople }
			>
				<span { ...subscribeTag }>??????</span>
			</button>
		);
	}
	renderSubedButton() {
		const { fullModeButton, alwaysShow, reversible } = this.props;
		const { subscribed, notified } = this.state;
		const { subscribingTag, notSubscribeTag, notifyTag, notNotifyTag } = this.gtmTag;
		// ????????????????????????
		if (!alwaysShow) return null;
		// ????????????????????????(???????????????)
		if (!reversible) {
			return <button className={ `ui normal button disabled ${this.sizeStyle}` }>?????????</button>;
		}
		// ??????????????????(??????????????????)
		if (!fullModeButton) {
			return (
				<button
					className={ `ui normal button ${this.sizeStyle}` }
					onClick={ this.subscribedPeople }
				>
					????????????
				</button>
			);
		}
		// ??????????????????(??????????????????)
		return (
			<DropdownMenu
				className={ `ui button ${this.getButtonStyle()} ${this.sizeStyle}` }
			>
				<DropdownTarget>
					<span { ...subscribingTag }>?????????</span>
				</DropdownTarget>
				<DropdownList>
					<ul className="dropdown" styleName="other_actions">
						{notified
							? <li { ...notNotifyTag } onClick={ this.changeNotification }>
									????????????
								</li>
							: <li { ...notifyTag } onClick={ this.changeNotification }>
									????????????
								</li>
						}
						{subscribed &&
							<li { ...notSubscribeTag } onClick={ this.subscribedPeople }>
								????????????
							</li>
						}
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
	render() {
		const { subscribed} = this.state;
		const { userPid, targetPid, subscribeStatus } = this.props;
		if (userPid === targetPid) return null;

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
	connect(state => ({
		isLogin: state.user.isLogin,
		userPid: state.user.pid
	}),
	{ subscribe, unsubscribe, notice, setDirectPanel }),
	[CSSModules, '_', css]
)(SubscribePeople);
