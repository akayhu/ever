import { connect } from 'react-redux';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// import { translate } from 'react-i18next';
import { LightBox } from 'c_wap_module';
import { components as CPlatformComponents } from 'c_platform';

import { loadProfile } from 'src/client/actions/profile';
import { getConnectionStatus } from 'src/client/actions/connection';
import { createFromPromotion, initialFromPromotion, onchangeFromPromotion } from 'src/client/actions/global';

import Completion from 'src/client/component_profile/completion';
import Summary from 'src/client/component_profile/summary';
// import Chronicle from 'src/client/component_profile/chronicleRefactory';
import Chronicle from 'src/client/component_profile/chronicle';
import Gallery from 'src/client/component_profile/gallery';
import Endorse from 'src/client/component_profile/endorse';
import Appraise from 'src/client/component_profile/appraise';
import WhoSeeMe from 'src/client/component_profile/whoSeeMe';
import Friend from 'src/client/component_profile/friend';
import MutualFriends from 'src/client/component_profile/friend/mutualFriends';
import Attention from 'src/client/component_profile/attention';
import CollectArticle from 'src/client/component_profile/collectArticle';
import Group from 'src/client/component_profile/group';
import Praise from 'src/client/component_profile/praise';
import RecentArticle from 'src/client/component_profile/recentArticle';
import Create from 'src/client/component_profile/create';
import ActivityEditor from 'src/client/component_activities/module/Editor';
import ActivityLightbox from 'src/client/component_activities/module/Lightbox';

import hasPermission from 'src/client/services/viewas.js';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class ProfileMain extends Component {
	constructor(props) {
		super(props);

		this.state = {
			anchorTo: '',
			edittingHintBox: false,
			nextLocationPathname: ''
		};
		this.onUnload = this.onUnload.bind(this);
	}
	componentWillMount() {
		this.routerWillLeave = this.routerWillLeave.bind(this);
	}
	componentDidMount() {
		const {location: {state}} = this.props;
		// ?????????spa link??????profile?????????????????????
		window.scroll(0, 0);
		if (state && state.anchorTo) {
			this.scrollInto(state.anchorTo);
		}
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
	}
	scrollInto(blockName) {
		// ??????config???????
		let node;
		if (blockName === 'endorse') {
			node = findDOMNode(this.endorseBlock);
		} else if (blockName === 'honor') {
			// node = findDOMNode(this.chronicleBlock);
			this.setState({anchorTo: 'honor'});
		}
		if (node) {
			node.scrollIntoView();
		}
	}
	routerWillLeave(nextLocation) {
		this.state.nextLocationPathname = nextLocation.pathname;
		if (this.props.global.onChange) {
			this.setState({edittingHintBox: true});
			this.props.createFromPromotion({ promotion: this.props.global.promotion, onChange: false });
			return false;
		}
		this.props.initialFromPromotion();
	}
	componentWillReceiveProps(nextProps) {
		if (typeof this.props.global.onChange === 'undefined' && nextProps.global.onChange === true) {
			window.addEventListener('beforeunload', this.onUnload);
		} else if(this.props.global.onChange === true && nextProps.global.onChange === false) {
			window.removeEventListener('beforeunload', this.onUnload);
		}
	}
	onUnload(event) {
		// chrome 51??????????????????dialog????????????
		// https://www.chromestatus.com/feature/5349061406228480
		event.returnValue = '';
	}
	submitLightbox() {
		this.props.createFromPromotion({ promotion: this.props.global.nextPromotion, onChange: false });
	}
	cancelLightbox() {
		this.props.createFromPromotion({ promotion: this.props.global.promotion, onChange: true });
	}
	submitLightbox2() {
		this.props.router.push(this.state.nextLocationPathname);
		this.props.initialFromPromotion();
	}
	cancelLightbox2() {
		this.setState({edittingHintBox: false});
		this.props.onchangeFromPromotion();
	}
	editorCloseTrigger() {
		this.props.createFromPromotion({ promotion: 'none', onChange: false });
		this.props.loadProfile({pid: this.props.params.pid});
	}
	renderActivityLightbox(lightbox) {
		if(typeof (lightbox) === 'string' && this.props.activity.activityPool[lightbox] ) {
			return (
				<ActivityLightbox
					close={ this.editorCloseTrigger.bind(this) }
					itemData={ this.props.activity.activityPool[lightbox] }
					index={ 0 }
					author={ this.props.activity.activityPool[lightbox].editable }
				/>
			);
		}
	}
	render() {
		const lightboxOption = {
			closeIcon: true,  // ??????close ICON,
			submit: {
				text: '??????',
				action: this.submitLightbox.bind(this)
			},
			cancel: {
				text: '??????'
			}
		};
		const lightboxOption2 = {
			closeIcon: true,  // ??????close ICON,
			submit: {
				text: '??????',
				action: this.submitLightbox2.bind(this)
			},
			cancel: {
				text: '??????'
			}
		};
		const myProfile = parseInt(this.props.params.pid) === parseInt(this.props.user.pid); 

		return (
			
			<div>
				{
					hasPermission(this.props.viewas, this.props.privacy.introduction, this.props.user.pid, this.props.params.pid) &&
					<Summary
						params={ this.props.params }
						user={ this.props.user }
						viewas={ this.props.viewas }
						profile={ this.props.profile }
						promotion={ this.props.global.promotion }
						privacy={ this.props.privacy.introduction }
					/>
				}
				<div className="wrap_w300_m20_w640" styleName="personal_content">
					<div className="left_side" styleName="social_main">

						{
							myProfile && hasPermission(this.props.viewas, 0, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<Completion
									params={ this.props.params }
									profile={ this.props.profile }
									user={ this.props.user }
									route={ this.props.route }
									router={ this.props.router }
								/>
							</div>
						}


						{
							hasPermission(this.props.viewas, 0, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<WhoSeeMe params={ this.props.params } user={ this.props.user } accessRecord={ this.props.accessRecord } />
							</div>
						}


						{
							hasPermission(this.props.viewas, this.props.privacy.recentActivity, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<RecentArticle
									params={ this.props.params }
									viewas= { this.props.viewas }
									user={ this.props.user }
									activity={ this.props.activity }
									privacy={ this.props.privacy.recentActivity }
								/>
							</div>
						}


						{
							/* friend ??????????????? ??????key???????????????mutualFriend ??????????????????????????? ???????????????????????? */
							hasPermission(this.props.viewas, this.props.privacy.mutualFriend, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<Friend
									params={ this.props.params }
									user={ this.props.user }
									viewas={ this.props.viewas }
									friend={ this.props.connection.friend }
									privacy={ this.props.privacy.mutualFriend }
									gtmTitleName="????????????"
								/>
							</div>
						}


						{
							this.props.viewas !== 'self' && parseInt(this.props.params.pid) !== this.props.user.pid &&
							<div styleName="personal_social_content">
								<MutualFriends
									params={ this.props.params }
									user={ this.props.user }
									connection={ this.props.connection }
								/>
							</div>
						}


						{
							hasPermission(this.props.viewas, this.props.privacy.colleague, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<Praise
									userName={ this.props.profile.userName }
									params={ this.props.params }
									user={ this.props.user }
									colleague={ this.props.social.colleague }
									connectionStatus={ this.props.connection.connection_status[this.props.params.pid] }
								/>
							</div>
						}


						{
							hasPermission(this.props.viewas, this.props.privacy.appraise, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<Appraise
									params={ this.props.params }
									user={ this.props.user }
									userName={ this.props.profile.userName }
									viewas={this.props.viewas}
									interactionLock= {this.props.interactionLock}
								/>
							</div>
						}


						{
							hasPermission(this.props.viewas, this.props.privacy.group, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<Group
									params={ this.props.params }
									user={ this.props.user }
									viewas={ this.props.viewas }
									privacy={ this.props.privacy.group }
									gtmTitleName="????????????"
								/>
							</div>
						}


						{
							hasPermission(this.props.viewas, this.props.privacy.subscribe, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<Attention
									params={ this.props.params }
									user={ this.props.user }
									viewas={ this.props.viewas }
									privacy={ this.props.privacy.subscribe }
									attention={ this.props.connection.attention }
									gtmTitleName="????????????"
								/>
							</div>
						}


						{
							hasPermission(this.props.viewas, this.props.privacy.collectActivity, this.props.user.pid, this.props.params.pid) &&
							<div styleName="personal_social_content">
								<CollectArticle
									params={ this.props.params }
									user={ this.props.user }
									viewas={ this.props.viewas }
									activity={ this.props.activity }
									privacy={ this.props.privacy.collectActivity }
									gtmTitleName="????????????"
								/>
							</div>
						}

					</div>
					<div className="right_side" styleName="personal_info_main">

						{/* {
							hasPermission(this.props.viewas, 0, this.props.user.pid, this.props.params.pid) &&
							<div styleName="profile_component">
								<Create
									params={ this.props.params }
									profile={ this.props.profile }
								/>
							</div>
						} */}

						<div styleName="profile_component">
							<Chronicle
								anchorTo={ this.state.anchorTo === 'honor' ? this.state.anchorTo : '' }
								chronicle={ this.props.chronicle }
								params={ this.props.params }
								viewas={ this.props.viewas }
								promotion={ this.props.global.promotion }
								privacy={ this.props.privacy }
								pid= {this.props.user.pid}
							/>
						</div>

						{
							hasPermission(this.props.viewas, this.props.privacy.gallery, this.props.user.pid, this.props.params.pid) &&
							<div styleName="profile_component">
								<Gallery
									params={ this.props.params }
									user={ this.props.user }
									viewas={ this.props.viewas }
									privacy={ this.props.privacy.gallery }
									activity={ this.props.activity }
								/>
							</div>
						}

						{
							hasPermission(this.props.viewas, this.props.privacy.endorse, this.props.user.pid, this.props.params.pid) &&
							<div styleName="profile_component">
								<Endorse
									ref={ ref => (this.endorseBlock = ref) }
									params={ this.props.params }
									endorse={ this.props.endorse }
									userName={ this.props.profile.userName }
									viewas={this.props.viewas}
									user={ this.props.user }
									privacy={ this.props.privacy.endorse }
									promotion={ this.props.global.promotion }
								/>
							</div>
						}
					</div>
				</div>
				{
					this.props.global.edittingHintBox &&
					<LightBox refs="lightbox" option={ lightboxOption } onClose={ this.cancelLightbox.bind(this) }>
						<h3> ???????????????????????? ??????????????????</h3>
					</LightBox>
				}
				{
					this.state.edittingHintBox &&
					<LightBox refs="lightbox" option={ lightboxOption2 } onClose={ this.cancelLightbox2.bind(this) }>
						<h3> ?????????????????????????????????????????????????????????</h3>
					</LightBox>
				}
				{
					this.props.global.promotion === 'gallery' &&
					<ActivityEditor
						close={ this.editorCloseTrigger.bind(this) }
						itemData={ null }
						galleryMode
					/>
				}
				{
					/**
					 * ?????????????????????????????????????????????????????????
					 */
				}
				{ this.renderActivityLightbox(this.props.activity.lightbox) }

			</div>
		);
	}
}


function mapStateToProps(state, props) {
	state.history = {...state.history, ...props.history};
	const targetPid = parseInt(props.params.pid);
	const pid = parseInt(state.user.pid);
	return {
		activity: state.activity,
		chronicle: state.chronicle,
		profile: pid === targetPid ? state.profile.user_info : state.profile.profile_pool[targetPid] || {},
		viewas: state.profile.viewas,
		interactionLock: state.profile.interactionLock,
		privacy: state.privacy.pid === targetPid? state.privacy : {},
		social: state.social,
		history: state.history,
		global: state.global,
		connection: state.connection,
		accessRecord: state.accessRecord,
		user: state.user
	};
}

const actions = {
	loadProfile,
	getConnectionStatus,
	createFromPromotion,
	initialFromPromotion,
	onchangeFromPromotion
};

export default compose(
		connect(mapStateToProps, actions),
		// translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(ProfileMain);
