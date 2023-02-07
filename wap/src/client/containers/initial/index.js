import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { has } from 'lodash/object';
import compose from 'src/util/compose';
import { initialAccount } from 'src/client/actions/user';
import { loadUserConfigByType, updatePersonalConfig } from 'src/client/actions/profile';
import clientConfig from 'src/configs/client';
import {components as CPlatformComponents, actions as CPlatformActions} from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;
const getACUserName = CPlatformActions.user.getACUserName;

class Initial extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			ACUserName: '',
			isConfirm: false,
		};
	}
	componentDidMount() {
		// 取得104主網userName
		this.props.getACUserName().then((res) => {
			this.setState({
				ACUserName: res.data
			});
		});
	}

	// 切換勾選同意的狀態
	confirmServiceTerm = (event) => {
		this.setState({ isConfirm: event.target.checked });
	};

	// 跑啟用 Plus 服務流程
	initialAccountStep = () => {
		const { pid } = this.props.user;
		const params = {
			pid,
			userName: this.state.ACUserName
		};
		// 未確認啟用，忽略不動作
		if (!this.state.isConfirm) return;

		/**
		 * 如果 userName 有值則就代表是 plus 的舊 user 跳過 initialUser
		 * 1. 第一次 initialUser 拿到的 model
		 *   { isNewMember: true, isInit }
		 *
		 * 2. 往後 initialUser 拿到的 model
		 *   { isNewMember: false, isDelMember }
		 */
		this.props.initialAccount(params)
			.then((res) => {
				// 初始化失敗
				if (!res.response || has(res.response, 'warning')) return browserHistory.push('/sso/saml-logout?r=/error/500/init');
				if (res.response.isNewMember && !res.response.isInit) return browserHistory.push('/sso/saml-logout?r=/error/500/init');

				// 如果 user 被 initial 過，轉導回其他路徑 or /
				location.href = this.props.location.query.r || '/';
			})
			.catch((e) => {
				console.error(e);
				return browserHistory.push('/error/500');
			});
	}
	render() {
		return (
			<ViewWrapper { ...this.props } >
				<div className="container_wrap">
					<div styleName="no_head_wrapper">
						<div styleName="header">
							<img src={ `${clientConfig.params.staticUrl}/logo/104logo_o_76x76_appletouchicon.png` } width="60" />
						</div>
						<img src={ `${clientConfig.params.staticWapUrl}/images/initial/initial.png` } styleName="nt_img" />
						<div style={ {paddingLeft: '30%', marginTop: '20px', fontSize: '16px'} }>
							用戶您好，<br />
							我們正在進行產品調整，期望提供更好的職場工具及服務；<br />
							調整期間暫時停止加入會員，造成不便請見諒。
						</div>
						<br /><br />
						<div style={ {textAlign: 'center'} }>
							<a
								href={ `https:${clientConfig.params.e104Url}` }
								rel="noopener noreferrer"
								style={ {color: '#fe7e17', fontSize: '18px', textDecoration: 'underline'} }
							>
								返回104人力銀行
							</a>
						</div>
						{/* <div styleName="nt_layer">加入104職涯社群，<br />探索、交流、學習與分享，打造自己的職場</div>
						<div styleName="nt_confirm">
							<input type="checkbox" styleName="nt_checkbox" checked={ this.state.isConfirm } onChange={ this.confirmServiceTerm } />
							我了解並同意遵守
							<a styleName="nt_term" href={ `${clientConfig.params.staticWapUrl}/html/statute/` } target="_blank" rel="noopener noreferrer">
								服務條款
								<img src={ `${clientConfig.params.staticWapUrl}/images/initial/wave-line.svg` } styleName="nt_wave_line" />
							</a>
						</div>
						<div styleName="nt_button_div">
							<span styleName={ this.state.isConfirm ? 'nt_button' : 'nt_button_disable' } onClick={ this.initialAccountStep }>開始使用</span>
						</div> */}
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

const actions = {loadUserConfigByType, updatePersonalConfig, initialAccount, getACUserName};

export default compose(
		connect(mapStateToProps, actions),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Initial);
