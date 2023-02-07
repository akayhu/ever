import Promise from 'bluebird';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { loadUserConfigByType, loadedUserInfo } from '../actions/profile';
import { loadUser, getMembershipInfo } from '../actions/user';
import { clreaAlert, closeAlert, createAlert } from '../actions/alert';
import Nav from '../components/nav';
import Announcement from '../components/announcement';
import AlertMessage from '../components/alertMessage';
import Header from '../components/header/index.js';
import Footer from '../components/footer/index.js';
import DirectPanel from '../components/directPanel';
import sendErrorToSlack from '../../util/SendErrorToSlackUtil';
import { LightBox } from 'c_wap_module';
import {
	PusherConnectAction as pusherConnectAction,
	PusherSubscribeChannelAction as pusherSubscribeChannelAction
} from '../actions/pusher';
import clientConfig from '../../configs/client';

const globalHook = [];

class ViewWrapper extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			onlyContent: !(props.location.pathname === '/initial'),
			checkConfig: false
		};
		this.initialConfig = {
			pid: this.props.user.pid || -3,
		}
		this.alertSubmit = (e) => {
			this.props.closeAlert();
		}
	}
	componentDidMount() {
		const { pid, isLogin, showErrorPage } = this.props.user;

		if (showErrorPage) {
			var title = document.title;
			this.props.router.replace(showErrorPage);
			window.history.replaceState({}, title, `${this.props.history.currentUrl}`);
		}

		if (isLogin) {
			this.props.loadUser({ pid });
			this.props.loadedUserInfo({
				pid,
				targetPid: pid
			});
			// 未初始化的使用者，會拿到 {"response": { "warning": ..... }} 的回應，並導入 initial 程序
			this.props.getMembershipInfo(this.initialConfig).then((result) => {
				if (result.response && result.response.warning && location.pathname !== '/initial'){
					browserHistory.push( "/initial?r="+ encodeURIComponent("/"));
					return false;
				}
			});
			this.props.pusherConnectAction({
				key: clientConfig.params.pusher.key,
				options: {
					cluster: clientConfig.params.pusher.cluster,
					authEndpoint: '/ajax/pusher/auth',
					encrypted: true
				}
			});
		}

		globalHook.map((callback) => {
			if (typeof callback === 'function') {
				callback.call(this);
			}
		});
	}
	// componentWillReceiveProps( nextProps ) {
	// 	if (
	// 		nextProps.user.isLogin === true &&
	// 		typeof nextProps.profile.config !== 'undefined' && 
	// 		typeof nextProps.profile.config[this.state.configType] !== 'undefined' && 
	// 		!this.state.checkConfig &&
	// 		nextProps.location.pathname !== '/initial'
	// 	) {
	// 		this.state.checkConfig = true;
			
	// 		var config = nextProps.profile.config[this.state.configType];
	// 		var type = config.type;
	// 		var value = config.value;
	// 		var url = nextProps.location.pathname ? nextProps.location.pathname+nextProps.location.search : "/";
	// 		// var diver_user = Object.keys(nextProps.profile.user_info).length === 0 && nextProps.profile.user_info_loaded;
			
	// 		if (value === 0 ) { 
	// 			var logData = {
	// 				user_info: nextProps.profile.user_info,
	// 				loaded: nextProps.profile.user_info_loaded,
	// 				config: config
	// 				// diver_user: diver_user
	// 			}
	// 			sendErrorToSlack(logData, '#anonymous_test');
	// 			location.href = "/initial?r="+ encodeURIComponent(url);
	// 			return;
	// 		}
	// 	}
	// }
	render() {
		const alertLightboxOption = {
			closeIcon: true,
			submit: {
				text: '確定',
				action: this.alertSubmit
			}
		};
		return (
			<div className="wrap">
				{
					this.state.onlyContent &&
					<Header 
						getParamMap={ this.props.getParamMap }
						router={ this.props.router }
						location={ this.props.location }
						params={ this.props.params }
						hostory={ this.props.hostory }
					/>
				}
				{
					this.state.onlyContent &&
					<Nav 
						getParamMap={ this.props.getParamMap }
						router={ this.props.router }
						location={ this.props.location }
						params={ this.props.params }
						hostory={ this.props.hostory }
					/>
				}
				{
					this.state.onlyContent &&
					<Announcement 
						getParamMap={ this.props.getParamMap }
						router={ this.props.router }
						location={ this.props.location }
						params={ this.props.params }
						hostory={ this.props.hostory }
					/>
				}
				<div className="container">
					{ this.props.children }
				</div>
				{
					this.state.onlyContent &&
					<Footer 
						getParamMap={ this.props.getParamMap }
						router={ this.props.router }
						location={ this.props.location }
						params={ this.props.params }
						hostory={ this.props.hostory }
					/>
				}
				{
					this.state.onlyContent &&
					<AlertMessage />
				}
				{
					this.props.showDirectPanel &&
					<DirectPanel />
				}
				{
					this.props.alert && this.props.alert.desc &&
					<LightBox
						option={ alertLightboxOption }
						onClose={ this.alertSubmit }
					>
						<div>{ this.props.alert.desc }</div>
					</LightBox>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		profile: state.profile,
		user: state.user,
		showDirectPanel: state.alert.showDirectPanel,
		alert: state.alert,
		history: state.history,
		metadata: state.metadata
	};
}

export default connect(mapStateToProps, {
	loadUserConfigByType,
	loadedUserInfo,
	loadUser,
	getMembershipInfo,
	closeAlert,
	createAlert,
	pusherConnectAction,
	pusherSubscribeChannelAction
})(ViewWrapper);
