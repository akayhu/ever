import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

// actions
import { loadDataCenter } from 'src/client/actions/privacy';

// components
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import { PersonalPrivacy } from 'src/client/component_privacy/personal';
import { BlockPrivacy } from 'src/client/component_privacy/block';
import { LightBox } from 'c_wap_module';

import {components as CPlatformComponents} from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class Privacy extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: props.location.query.category || 'personal',
			openLightbox: false,
			lightboxPackage: '',
			lightboxTitle: '',
			lightboxDesc: ''
		};
	}
	componentDidMount() {
		this.props.loadDataCenter('getMemberIdentityList', { pidList: this.props.pid });
		this.props.loadDataCenter('queryPrivacyInfo', { targetPid: this.props.pid });
	}
	componentWillReceiveProps(nextProps) {
		const activeTab = nextProps.location.query.category || 'personal';

		if (this.state.category !== activeTab) {
			this.setState({category: activeTab});
		}
	}
	handleLightBoxOpen(value, lightboxPackage, lightboxTitle, lightboxDesc) {
		this.setState({
			openLightbox: value,
			lightboxPackage,
			lightboxTitle,
			lightboxDesc
		});
	}
	handleUpdatePrivacy(result) {
		this.props.loadDataCenter('updatePrivacy', result).then(() => {
			this.handleLightBoxOpen(false);
		});
	}
	createLeftSideNavigation() {
		const navSetting = {
			activeTab: this.state.category,
			navList: [
				{
					title: '個人檔案',
					itemKey: 'personal',
					count: 0,
					url: '/privacy?category=personal',
					subItems: []
				},
				/* {
					title: "搜尋設定",
					itemKey: "profile",
					count: 0,
					url: "/privacy?category=profile",
					subItems:[]
				},*/
				{
					title: '黑名單',
					itemKey: 'block',
					count: 0,
					url: '/privacy?category=block',
					subItems: []
				}
			]
		};

		// if (this.props.privacy.hasOwnProperty(this.props.pid) && this.props.privacy[this.props.pid].identity.code === 201) {
		// 	navSetting.navList.push({
		// 		title: '解除隱身',
		// 		itemKey: 'stealth',
		// 		count: 0,
		// 		url: '/privacy?category=stealth',
		// 		subItems: []
		// 	});
		// }

		return navSetting;
	}
	render() {
		const navSetting = this.createLeftSideNavigation();
		const lightboxOption = {
			closeIcon: true,
			contentHeight: '600px',
			title: this.state.lightboxTitle
		};
		return (
			<ViewWrapper { ...this.props } >
				<div className="container_wrap original_panel">
					<div className="header clearfix">
						<div className="title">
							<h2>隱私設定</h2>
						</div>
						<div className="options">
							{/* BIGC-1770決議遮蔽  */}
							{/* <span
								onClick={ this.handleLightBoxOpen.bind(this, true, 'contacts', '「迅速拓展人脈」', '建議調整以下資訊可以讓你達成「迅速拓展人脈」的目的哦!') }
								data-gtm-privacy="拓展人脈"
							>
								迅速拓展人脈
							</span>
							&nbsp;&nbsp;|&nbsp;&nbsp; */}
							<span
								onClick={ this.handleLightBoxOpen.bind(this, true, 'opportunity', '個人檔案曝光度設定', '當您關閉 104 履歷表，企業人資將可透過以下設定，搜尋到您在職涯社群個人檔案中的開放資料。') }
								data-gtm-privacy="個人檔案曝光度設定"
							>
								個人檔案曝光度設定
							</span>
							{/* BIGC-1767決議遮蔽  */}
							{/* &nbsp;&nbsp;|&nbsp;&nbsp;
							<span
								onClick={ this.handleLightBoxOpen.bind(this, true, 'notUse', '「不想使用社群」', '關閉個人檔案各區塊隱私，他人將不會看到你的相關資料，但不包含顯示名稱與個人照，你也可以進一步修改個人顯示名稱、移除個人照，讓他人無法辨識。') }
								data-gtm-privacy="不用社群"
							>
								不想使用社群
							</span> */}
							{/*<i className="help circle icon" />*/}
						</div>
					</div>
					<div className="wrap_w300_m0_w660 body">
						<div className="left_side aside">
							<LeftSideNavigation navSetting={ navSetting } />
						</div>
						<div className="right_side main">
							{
								this.state.category === 'personal' &&
								<PersonalPrivacy
									useLightbox={ false }
									handleUpdatePrivacy={ this.handleUpdatePrivacy.bind(this) }
									handleLightBoxOpen={ this.handleLightBoxOpen.bind(this) }
								/>
							}
							{
								this.state.category === 'block' &&
								<BlockPrivacy
									location={ this.props.location }
								/>
							}
						</div>
						{
							this.state.openLightbox &&
							<LightBox
								option={ lightboxOption }
								onClose={ this.handleLightBoxOpen.bind(this, false) }
							>
								<PersonalPrivacy
									useLightbox={ true }
									lightboxPackage={ this.state.lightboxPackage }
									lightboxDesc={ this.state.lightboxDesc }
									handleUpdatePrivacy={ this.handleUpdatePrivacy.bind(this) }
									handleLightBoxOpen={ this.handleLightBoxOpen.bind(this) }
								/>
							</LightBox>
						}
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		pid: state.user.pid,
	};
}

const actions = {
	loadDataCenter
};

export default compose(
		connect(mapStateToProps, actions),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Privacy);
