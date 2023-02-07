import Promise from 'bluebird';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, browserHistory } from 'react-router';
import update from 'react-addons-update';
import { TextField, DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import IconFlyout from '../flyout/iconFlyout';
import ConnectionAlertList from '../flyout/connectionAlertList';
import MessageAlertList from '../flyout/messageAlertList';
import NotificationAlertList from '../flyout/notificationAlertList';
import ApplicationList from '../flyout/applicationList';
import BCAlertList from '../flyout/bcAlertList';
import Search from '../search';
import { initBubbleData, triggerClickBubble } from '../../actions/bubbles';
import clientConfig from '../../../configs/client';
import css from './style.css';
import { getBubbleCount } from '../../reducers/navigation/selectors';

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function base64EncodeUrl(str) {
	if(str != undefined) {
		return Base64.encodeURI(str.toString());
	} else {
		return "";
	}
}

class Header extends Component {
	constructor(props, context) {
		super(props, context);
		this.clickHeader = this.clickHeader.bind(this);
	}
	// componentWillMount() {
	// 	return Promise.all([
	// 		this.props.triggerClickBubble({type: 1}),
	// 		this.props.triggerClickBubble({type: 8}),
	// 		this.props.triggerClickBubble({type: 2}),
	// 		this.props.triggerClickBubble({type: 3})
	// 	]);
	// }
	componentDidMount() {
		if(this.props.user.isLogin) {
			setTimeout(()=> {
				this.props.initBubbleData();
			}, 10000);
		}
	}
	clickHeader(logEvent) {
		if(canUseDOM && window._elog) {
			window._elog = window._elog || [];
			window._elog.push({
				web: "plus",
				track: ["clickMegamenu"],
				ext: {
					event: logEvent,
					pid: this.props.user.pid,
					device: 'pc',
					ts: (new Date()).getTime()
				}
			});
		}
	}
	dropdownMenuLayout(isLogin, props) {
		if(!isLogin) {
			return (
				<ul className={ css.account_not_login }>
					<li>
						<a 
							href={ "/sso/saml-login?r=" + window.encodeURIComponent(props.history.currentUrl) }
							data-gtm-common="Header - 登入"
							className={ css.login }>
							登入
						</a>
					</li>
					{/* <li>
						<a 
							href={ "/sso/saml-signup?r=" + window.encodeURIComponent(props.history.currentUrl) }
							data-gtm-common="Header - 註冊"
							className={ css.login }>
							註冊
						</a>
					</li> */}
				</ul>
			);
		} else {
			return (
				<ul className={ css.account }>
					<li>
						<span className={ css.name_length }>
							<a 
								href={ "/profile/" + props.user.pid }
								onClick={ this.clickHeader('profile') }
								data-gtm-header="顯示名稱"
							>
								{ props.user.userName }
							</a>
						</span>
					</li>
					<li>
						<DropdownMenu>
							<DropdownTarget>
								<i className={ 'dropdown icon ' + css.arrow } data-gtm-header="更多"></i>
							</DropdownTarget>
							<DropdownList>
								<ul className={ css.dropdown }>
									<li><a href={ 'https:' + clientConfig.params.accountsUrl } target="_blank">會員中心</a></li>
									{/* <li><a href={ '/privacy' }>隱私設定</a></li> */}
									<li><a href={ '/newsletter' }>管理電子報</a></li>
									<hr />
									<li><a href={ clientConfig.params.staticWapUrl + '/html/statute/' } target="_blank">服務條款</a></li>
									<li><a href={ `https:${clientConfig.params.e104Url}/jobs/search/showLogin?return_url=https%3A%2F%2F${clientConfig.params.e104Domain}%2Fquestion_admin%2Freaction.cfm%3Ffaq_from%3Dplus` } target="_blank">意見反映</a></li>
									<li><a href={ clientConfig.params.staticWapUrl + '/html/commonProblem/' } target="_blank">常見問題</a></li>
									<hr />
									<li><a href="/sso/saml-logout?r=/">登出</a></li>
								</ul>
							</DropdownList>
						</DropdownMenu>
					</li>
				</ul>
			);
		}
	}
	iconLayout(isLogin, props, type) {
		const { 
			getParamMap,
			triggerClickBubble,
			connectionBubbles,
			bcBubbles,
			messageBubbles,
			notificationBubbles,
			params,
			router
		} = props;

		if(!isLogin) return null;

		switch (type) {
			case 'search':
				return (
					<li className={ css['global-search'] }>
						<Search 
							params={ params } 
							clickHeader={ this.clickHeader } 
							router={ router }
						/>
					</li>
				);
				break;
			case 'application':
				return (
					<li className={ css['global-options'] } onClick={ () => this.clickHeader('application') }>
						<IconFlyout className="grid icon" data-gtm-header="測評 Icon">
							<ApplicationList getParamMap={ getParamMap } />
						</IconFlyout>
					</li>
				);
				break;
			case 'peopleMgmt':
				return (
					<li className="connection-alert" onClick={ () => this.clickHeader('peopleMgmt') }>
						<IconFlyout
							className="icon social"
							bubbles={ connectionBubbles }
							data-gtm-header="人脈管理"
							triggerClick={ triggerClickBubble.bind(null, { type: 1 }) }
						>
							<ConnectionAlertList getParamMap={ getParamMap } />
						</IconFlyout>
					</li>
				);
				break;
			case 'messagesB2C':
				return (
					<li className="briefcase-alert" onClick={ () => this.clickHeader('messagesB2C') }>
						<IconFlyout
							className="icon briefcase"
							bubbles={ bcBubbles }
							data-gtm-header="B2C 訊息"
							triggerClick={ triggerClickBubble.bind(null, { type: 8 }) }
						>
							<BCAlertList getParamMap={ getParamMap } />
						</IconFlyout>
					</li>
				);
				break;
			case 'messagesC2C':
				return (
					<li className="message-alert">
						<IconFlyout
							className="icon notification"
							bubbles={ messageBubbles }
							data-gtm-header="C2C 訊息"
							triggerClick={ triggerClickBubble.bind(null, { type: 2 }) }
						>
							<MessageAlertList getParamMap={ getParamMap } />
						</IconFlyout>
					</li>
				);
				break;
			case 'notic':
				return (
					<li className="notification-alert" onClick={ () => this.clickHeader('notic') }>
						<IconFlyout
							className="icon alarm"
							bubbles={ notificationBubbles }
							data-gtm-header="通知"
							triggerClick={ triggerClickBubble.bind(null, { type: 3 }) }
						>
							<NotificationAlertList getParamMap={ getParamMap } />
						</IconFlyout>
					</li>
				);
				break;
			default:
				return null;
				break;
		}
	}
	render() {
		const { isLogin } = this.props.user;
		return (
			<div className={ css.header_background }>
				<header className={ css.header }>
					<h1 className={ css.logo }>
						<a href="/">
							<img
								onClick={ () => this.clickHeader('index') }
								data-gtm-header="Logo"
								src={ clientConfig.params.staticUrl + '/logo/104logo_plus_180x26.png' }
								alt="104職涯社群"
							/>
						</a>
					</h1>
					<ul className={ css.user }>
						{ this.iconLayout(isLogin, this.props, 'search') }
						{ /* { this.iconLayout(isLogin, this.props, 'application') } */ }
						{ this.iconLayout(isLogin, this.props, 'peopleMgmt') }
						{ this.iconLayout(isLogin, this.props, 'messagesB2C') }
						{ this.iconLayout(isLogin, this.props, 'messagesC2C') }
						{ this.iconLayout(isLogin, this.props, 'notic') }
					</ul>
					{ this.dropdownMenuLayout(isLogin, this.props) }
				</header>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		user: state.user,
		//language: state.language,
		history: state.history,
		//profile: state.profile,
		connectionBubbles: getBubbleCount(state, 'connectionBubbleCount'),
		bcBubbles: getBubbleCount(state, 'bcCommunicationCount'),
		messageBubbles: getBubbleCount(state, 'messageBubbleCount'),
		notificationBubbles: getBubbleCount(state, 'notificationBubbleCount')
	};
}

const HeaderCss = CSSModules(Header, css, { allowMultiple: true });

export default connect(mapStateToProps, { initBubbleData, triggerClickBubble })(HeaderCss);
