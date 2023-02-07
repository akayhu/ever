import React from 'react';
import { findDOMNode } from 'react-dom';
// import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { LightBox } from 'c_wap_module';
import parseStrToElements from 'src/util/parseStrToElements';
// components
import ActivityEditor from 'src/client/component_activities/module/Editor';
import Header from 'src/client/component_activities/activity/header';
import Title from 'src/client/component_activities/activity/title';
import AdvanceDropDown from 'src/client/component_activities/module/AdvanceDropDown';
import Browse from 'src/client/component_activities/activity/browse';
import Tag from 'src/client/component_activities/activity/tag';
import Endorse from 'src/client/component_activities/activity/endorse';
import Behavior from 'src/client/component_activities/activity/behavior';
import Comment from 'src/client/component_activities/activity/comment/comment';
import Relative from 'src/client/component_activities/activity/relative';
import AccuseActivity from 'src/client/component_common/accuse/activity';
// actions
import { viewActivity, activityLightboxClose } from 'src/client/actions/activity';
import { loadProfile } from 'src/client/actions/profile';

/**
 * 登入或未登入都會出現
 */
class ActivityLightbox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUrl: '',
			editMode: false,
			createType: props.createType || 'activity',
			hintMsgLightbox: false
		};
	}
	componentDidMount() {
		const itemData = this.props.itemData;
		this.state.currentUrl = document.location.pathname;
		window.history.replaceState({}, '', `/activity/${this.props.itemData.aid}`);
		this.props.viewActivity(this.props.itemData);
		window.elogPage = 'activity';

		// 傳送開啟的文章到 GTM DataLayer
		// gtmDataLayer.sendToDataLayer('Activity', itemData);
	}
	componentWillReceiveProps(nextProps) {
		// 當router改變時將關注點回到最上方
		if (this.props.activity.lightbox !== nextProps.activity.lightbox) {
			const node = findDOMNode(this.lightbox);
			node.scrollTop = 0;
			window.history.replaceState({}, '', `/activity/${nextProps.activity.lightbox}`);
		}
		if (this.props.createType === 'activity') {
			window.history.replaceState({}, '', `/activity/${nextProps.itemData.aid}`);
		}
	}
	componentWillUnmount() {
		window.history.replaceState({}, '', this.state.currentUrl);
	}
	handleEditActivity() {
		this.setState({
			editMode: true
		});
	}
	handleDeleteDropDown() {
		this.props.loadProfile({pid: this.props.user.pid});
		this.cancelLightbox();
	}
	handleCloseActivityEditor(isEdit) {
		if (isEdit === true) {
			this.setState({
				editMode: false
			});
		} else if (isEdit === false) {
			this.cancelLightbox();
		} else {
			this.setState({
				editMode: false
			});
		}
	}
	cancelLightbox() {
		this.props.activityLightboxClose();
	}
	alertHint() {
		this.setState({
			hintMsgLightbox: !this.state.hintMsgLightbox
		});
	}
	redirect() {
		const url = `/sso/saml-login?r=/activity/${this.props.itemData.aid}`;
		location.href = url;
	}
	scrollToTarget() {
		const lightbox = findDOMNode(this.lightbox);
		const element = findDOMNode(this.comment);
		var $body = $(lightbox);
		$body.animate({
			scrollTop: $(element).offset().top
		}, 500);
	}
	render() {
		const { itemData, user, isAdmin, isHead, isEditor } = this.props;
		const lightboxOption = {
			closeIcon: true,	// 有無close ICON,
			contentHeight: 'auto'
		};
		const haveLoginLightboxOption = { closeIcon: false };
		const isChannel = itemData.channelInfo && itemData.channelInfo.type === 10;
		return (
			<div>
				{
					!this.state.editMode &&
					<LightBox
						option={ lightboxOption }
						onClose={ this.cancelLightbox.bind(this) }
						ref={ (_ref) => this.lightbox = _ref }
						styleName="lightbox_root"
					>
						<div styleName="activity_lightbox">
							<Header itemData={ itemData } user={ user }>
								{
									this.props.user.isLogin &&
									<AdvanceDropDown
										author={ this.props.author }
										itemData={ this.props.itemData }
										mode={ 'lightbox' }
										handleEdit={ this.handleEditActivity.bind(this) }
										handleDelete={ this.handleDeleteDropDown.bind(this) }
										userPid={this.props.user.pid}
										pageName={this.props.pageName}
										filterName={this.props.filterName}
										category={ this.props.category }
										isAdmin={ isAdmin }
										isHead={ isHead }
										isEditor={ isEditor }
									/>
								}
							</Header>
							<Title itemData={ itemData } user={ this.props.user } />
							<Browse
								itemData={ itemData }
								user={ this.props.user }
								showHint={ this.alertHint.bind(this) }
								scrollToTarget={ this.scrollToTarget.bind(this) }
							/>
							<div styleName="activity_content">
								<div className="list" styleName="content_main">
									{ parseStrToElements(itemData.content) }
								</div>
							</div>
							<Tag itemData={ itemData } user={ this.props.user } />
							{
								!isChannel &&
								<Endorse itemData={ this.props.itemData } user={ this.props.user } author={ this.props.author } showHint={ this.alertHint.bind(this) } />
							}
							<Behavior 
								itemData={ itemData }
								user={ this.props.user } 
								showHint={ this.alertHint.bind(this) } 
								pageName={this.props.pageName}
								filterName={this.props.filterName}
							/>
							<Comment 
								itemData={ itemData } 
								user={ this.props.user } 
								index={ this.props.index } 
								ref={(_ref)=>this.comment=_ref} 
								showHint={ this.alertHint.bind(this) }
								pageName={this.props.pageName}
								filterName={this.props.filterName}
							/>
							<Relative itemData={ itemData } user={ this.props.user } type="lightbox" />
						</div>
					</LightBox>
				}
				{
					this.state.hintMsgLightbox &&
					<LightBox option={ haveLoginLightboxOption } onClose={ this.alertHint.bind(this) } >
						<h3>此為會員功能，請先登入</h3>
						<button className="ui primary button" data-gtm-common="Dialog - 我要登入" onClick={ this.redirect.bind(this) }>我要登入</button>
						<button onClick={ this.alertHint.bind(this) } data-gtm-common="Dialog - 稍後再說">稍後再說</button>
					</LightBox>
				}
				{
					this.state.editMode &&
					<ActivityEditor
						close={ this.handleCloseActivityEditor.bind(this) }
						itemData={ this.props.itemData }
						galleryMode={ itemData.extra.hasOwnProperty('source') && itemData.extra.source === 'gallery' }
					/>
				}
				<AccuseActivity />
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		user: state.user,
		activity: state.activity,
	};
}

const action = {
	viewActivity,
	activityLightboxClose,
	loadProfile
};

export default compose(
	connect(mapStateToProps, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ActivityLightbox);
