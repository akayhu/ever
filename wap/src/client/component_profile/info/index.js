import { connect } from 'react-redux';
import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

// actions
import { loadDataCenter } from 'src/client/actions/privacy';
import { loadUserConfigByType, updatePersonalConfig } from 'src/client/actions/profile';

// components
import { LightBox } from 'c_wap_module';
import { PersonalPrivacy } from 'src/client/component_privacy/personal';

import ViewasInfo from './viewasInfo';
import InvisibleInfo from './invisibleInfo';
import hasPermission from 'src/client/services/viewas.js';

class Info extends Component {

	constructor(props) {
		super(props);
		this.state = {
			show: 0,
			openLightbox: '',
			lightboxPackage: '',
			lightboxTitle: '',
			preview: false,
			closeToReturn: false,
			path: 'profile',
			closeTime: 0,
			currentStepIndex: '', // Target, UserName, Group, Member, Base
			configType: '7758a4ba-ff24-4b64-af88-23e6f2285550'
		};
	}
	componentWillMount() {
		this.props.loadDataCenter('queryPrivacyInfo', { pid: this.props.params.pid });
	}
	componentDidMount() {
		// require('jquery');
		// require('jquery-ui');
		// require('src/client/component_common/ui/transition.js');
		// require('src/client/component_common/ui/dimmer.js');
		// const params = this.props.getParamMap();
		// if (params.preview) {
		// 	this.state.preview = params.preview;
		// }
		// if (params.closeToReturn) {
		// 	this.state.closeToReturn = params.closeToReturn;
		// }
		const paramsConfig = {};
		paramsConfig.pid = this.props.user.pid;
		paramsConfig.typeList = this.state.configType;
		this.props.loadUserConfigByType(paramsConfig);

		const path = window.location.pathname.toString().split('/')[1];
		if (path === 'profile') {
			this.state.path = 'profile';
		} else if (path === 'article') {
			this.state.path = 'article';
		} else if (path === 'connection') {
			this.state.path = 'connection';
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.interactionLock > 0) {
			this.refs.info_bar.classList.add(css.show);
		}else {
			this.refs.info_bar.classList.remove(css.show);
		}
		if (nextProps.profile && nextProps.profile.warning) {
			const code = this.props.profile.warning.code;
			switch (code) {
				case '2':
					if (this.props.viewas !== 'self') {
						location.href = '/error/404';
					}
					this.state.show = false;
					this.setState(this.state);
					break;
			}
		}
		if (nextProps.config !== undefined &&
			this.state.configType in nextProps.config) {
			const config = nextProps.config[this.state.configType];
			const type = config.type;
			const value = config.value;
			const skipTime = value.closeTime + 2592000000;
			let currentdate = new Date();
			currentdate = currentdate.getTime();
			if (value.closeTime === 0 || currentdate > skipTime) {
				if (nextProps.privacy) {
					let state_show = 0;

					if (nextProps.privacy.introduction === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.education === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.experience === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.honor === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.gallery === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.endorse === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.subscribe === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.appraise === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.recentActivity === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.mutualFriend === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.group === 0) {
						state_show += 1;
					}
					if (nextProps.privacy.recentActivity === 0) {
						state_show += 1;
					}

					this.setState({
						show: state_show,
					});

					if (state_show >= 2 && nextProps.viewas === 'self' && this.state.path === 'profile') {
						this.refs.info_bar.classList.add(css.show);
						return;
					} else if (state_show < 2 && nextProps.viewas === 'self' && this.state.path === 'profile') {
						this.refs.info_bar.classList.remove(css.show);
						return;
					}
				}
			}
		}
	}
	handleLightBoxOpen(value, lightboxPackage, lightboxTitle) {
		this.setState({
			openLightbox: value,
			lightboxPackage,
			lightboxTitle
		});
	}
	handleUpdatePrivacy(result) {
		this.props.loadDataCenter('updatePrivacy', result).then(() => {
			this.handleLightBoxOpen(false);
		});
	}
	_handleClose() {
		const date = new Date();
		this.state.closeTime = date.getTime();

		const paramsUpdate = {};
		let updateData = [];
		updateData = {};
		updateData.pid = this.props.user.pid;
		updateData.type = this.state.configType;
		updateData.value = {closeTime: this.state.closeTime};

		paramsUpdate.updateData = JSON.stringify([updateData]);
		paramsUpdate.pid = this.props.user.pid;
		this.props.updatePersonalConfig(paramsUpdate);

		this.refs.info_bar.classList.remove(css.show);
	}

	render() {
		const lightboxOption = {
			closeIcon: true,
			contentHeight: '600px',
			title: this.state.lightboxTitle
		};
		const lightboxDesc = '您目前設定為「關閉」，建議調整為「開啟」';

		return (
			<div>
				<div styleName="info_wrap">
					<div ref="info_bar" styleName="info_bar">
						{
							this.props.profile &&
							this.props.profile.warning &&
							this.props.profile.warning.code === '2' &&
							<InvisibleInfo />
						}
						{
						this.props.interactionLock > 0 &&
						this.props.viewas !== 'self' &&
						<ViewasInfo
							close={ this._handleClose.bind(this) }
							closeToReturn={ this.state.closeToReturn }
							history={ this.props.history }
						/>
					}
						{/* {
						(this.state.show >= 2) &&
						hasPermission(this.props.viewas, 0, this.props.user.pid, this.props.params.pid) &&
						this.state.path === 'profile' &&
						<div styleName="viewas_info">
							<span styleName="remove_block">
								<i className="cross icon" styleName="remove" onClick={ this._handleClose.bind(this) } />
							</span>
							<div styleName="content">
								<span className="main_text">目前你的個人檔案曝光度不高，公開有助於擴展人脈及讓貴人看見你、機會找上門</span>
								<a
									onClick={ this.handleLightBoxOpen.bind(this, true, 'connection', '立即迅速拓展人脈，這樣設定就對了！') }
									href="#"
									className="main_text cont"
								>
									迅速擴展人脈
								</a>
								<a
									onClick={ this.handleLightBoxOpen.bind(this, true, 'elegant', '讓貴人看見你，這樣設定就對了！') }
									href="#"
									className="main_text chance"
								>
									個人檔案曝光度設定
								</a>
							</div>
						</div>
					} */}
					</div>
				</div>
				{
					this.state.openLightbox &&
					<LightBox
						option={ lightboxOption }
						onClose={ this.handleLightBoxOpen.bind(this, false) }
					>
						<PersonalPrivacy
							useLightbox
							lightboxPackage={ this.state.lightboxPackage }
							lightboxDesc={ lightboxDesc }
							handleUpdatePrivacy={ this.handleUpdatePrivacy.bind(this) }
							handleLightBoxOpen={ this.handleLightBoxOpen.bind(this) }
						/>
					</LightBox>
				}
				{/* {
					this.state.openLightbox === 'cont' &&
					<ContactsLightBox reloadPrivacy={ this.reloadPrivacy.bind(this) } handleLightBoxOpen={this.handleLightBoxOpen.bind(this)}/>
				}
				{
					this.state.openLightbox === 'chance' &&
					<ChanceLightBox reloadPrivacy={ this.reloadPrivacy.bind(this) } handleLightBoxOpen={this.handleLightBoxOpen.bind(this)}/>
				}*/}
			</div>
		);
	}
}

// function mapStateToProps(state, props) {
// 	const targetPid = parseInt(props.params.pid);
// 	const pid = parseInt(state.user.pid);
// 	return {
// 		privacy: state.privacy,
// 		viewas: state.profile.viewas,
// 		user: state.user,
// 		interactionLock: state.profile.interactionLock,
// 		profile: pid === targetPid ? state.profile.user_info : state.profile.profile_pool[targetPid],
// 		config: state.profile.config
// 	};
// }

const actions = {
	loadUserConfigByType,
	updatePersonalConfig,
	loadDataCenter
};

export default compose(
	connect(null, actions),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Info);
