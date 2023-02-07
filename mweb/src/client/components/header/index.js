import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { has } from 'lodash/object';
import { loadUser, getACUserName, initialUser } from '../../actions/user';
import { loadUserConfigByType, updatePersonalConfig } from '../../actions/global';
import compose from 'src/util/compose';
import config from 'src/configs/client';
import NotifyIcon from './notifyIcon';

class Header extends Component {
	constructor(props) {
		super(props);
		this.config = '9e2b448a-6581-4cfc-9276-e13f1482649a';
		this.toggleMenu = this.toggleMenu.bind(this);
	}
	componentWillMount() {
		if (this.props.user.isLogin) {
			const initialConfig = {
				pid: this.props.user.pid || -3,
				typeList: this.config,
			};

			this.props.loadUserConfigByType(initialConfig).then((res) => {
				// console.log(res.response)
				// console.info(res)
				if (res.response && has(res.response.response, 'warning')) return;
				if (res.response && res.response[0] && (res.response[0].value === 0 || !res.response[0].value)) {
					const updateData = {
						pid: this.props.user.pid,
						type: this.config,
						value: 5,
					};

					this.props.updatePersonalConfig({
						pid: this.props.user.pid,
						updateData: JSON.stringify([updateData]),
					}).then(() => {
						this.props.loadUser({
							pid: this.props.user.pid,
						});
					});

					// no profile
					// this.props.getACUserName().then((resAc) => {
					// 	if (resAc.hasOwnProperty('data') && resAc.data) {
					// 		const params = {
					// 			pid: this.props.user.pid,
					// 			userName: resAc.data,
					// 		};

					// 		this.props.initialUser(params).then((resInit) => {
					// 			if (
					// 				resInit.hasOwnProperty('response') &&
					// 				(
					// 					(resInit.response !== null && !resInit.response.hasOwnProperty('warning')) ||
					// 					resInit.response === null
					// 				)
					// 			) {
					// 				const updateData = {
					// 					pid: this.props.user.pid,
					// 					type: this.config,
					// 					value: 5,
					// 				};

					// 				this.props.updatePersonalConfig({
					// 					pid: this.props.user.pid,
					// 					updateData: JSON.stringify([updateData]),
					// 				}).then(() => {
					// 					this.props.loadUser({
					// 						pid: this.props.user.pid,
					// 					});
					// 				});
					// 			} else {
					// 				console.info(resInit);
					// 			}
					// 		});
					// 	} else {
					// 		console.info(resAc);
					// 	}
					// });
				} else {
					// has profile
					this.props.loadUser({
						pid: this.props.user.pid,
					});
				}
			});
		}
	}
	toggleMenu() {
		this.props.toggleMenu();
	}
	renderNotify(isLogin) {
		if (isLogin) return <NotifyIcon />;
	}
	renderAvatar(isLogin, pid, avatarWebUrl) {
		if (isLogin) {
			return (
				<Link to={ `/m/profile/${pid}` }>
					<img data-gtm-header="Avatar" src={ avatarWebUrl } />
				</Link>
			);
		}
	}
	renderLogin(isLogin) {
		if (!isLogin) {
			return (
				<a id="login_link" href="/sso/saml-login" data-gtm-common="Header - 登入">
					登入
				</a>
			);
		}
	}
	render() {
		const { isLogin, pid, avatarWebUrl } = this.props.user;
		return (
			<header styleName="header">
				<div styleName="left">
					<button onClick={ this.toggleMenu }>
						<i data-gtm-header="漢堡線" className="content icon" />
					</button>
				</div>
				<Link to="/m">
					<img
						src={ `${config.params.staticUrl}/logo/104logo_plus_119x24_edm.png` }
						alt="104 職涯社群"
						data-gtm-header="Logo"
						styleName="logoImg"
					/>
				</Link>
				<div styleName="right">
					{ this.renderNotify(isLogin) }
					{ this.renderAvatar(isLogin, pid, avatarWebUrl) }
					{ this.renderLogin(isLogin) }
				</div>
			</header>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

const actions = {
	loadUser,
	getACUserName,
	initialUser,
	loadUserConfigByType,
	updatePersonalConfig,
};

export default compose(
	connect(mapStateToProps, actions),
	[CSSModules, '_', css, { allowMultiple: true }],
)(Header);
