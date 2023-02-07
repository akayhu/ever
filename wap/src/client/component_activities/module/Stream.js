import React from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import DOMPurify from 'dompurify';
import { Link } from 'react-router';
// components
import { LightBox } from 'c_wap_module';
import ActivityEditor from 'src/client/component_activities/module/Editor';
import Header from 'src/client/component_activities/activity/header';
import Title from 'src/client/component_activities/activity/title';
import Browse from 'src/client/component_activities/activity/browse';
import Behavior from 'src/client/component_activities/activity/behavior';
import Comment from 'src/client/component_activities/activity/comment/comment';
import AdvanceDropDown from 'src/client/component_activities/module/AdvanceDropDown';
import { ListItem } from 'src/client/component_activities/activity/activityList';
import Ignore from 'src/client/component_activities/module/Ignore';
import CollectButton from 'src/client/component_common/collectBtn';
// actions
import { activityLightboxOpen } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activityLog.js';

/**
 * 登入或未登入都會出現
 */
class Stream extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			relative: false,
			comment: '',
			getMoreCommentLoading: false,
			createCommentLoading: false,
			hintMsgLightbox: false,
			editMode: false,
			hideIgnore: false
		};

		this.hideIgnore = (e) => { this.setState({ hideIgnore: true }); };
	}
	redirect() {
		const url = '/sso/saml-login';
		location.href = url;
	}
	alertHint() {
		this.setState({
			hintMsgLightbox: !this.state.hintMsgLightbox
		});
	}
	handleEditActivity() {
		this.setState({
			editMode: true
		});
	}
	handleCloseActivityEditor(isEdit) {
		this.setState({
			editMode: false
		});
	}
	render() {
		const { itemData, isAdmin, isHead, isEditor } = this.props;
		const PreImage = (typeof (itemData.extraInfo) === 'object') ? attachPreImage(itemData.extraInfo.attachmentList) : false;
		const haveLoginLightboxOption = { closeIcon: false };
		const hideIgnoreStyle = this.state.hideIgnore ? { display: 'none' } : {};
		const viewActivityLog = { pid: this.props.user.pid, page: this.props.pageName ? this.props.pageName : '', filter: this.props.filterName ? this.props.filterName:'' }
		return (
			<div>
				{
					this.props.itemData.hasOwnProperty('ignore') && !this.props.itemData.ignore &&
					<div>
						<div styleName="activity_stream">
							<Header itemData={ itemData } user={ this.props.user }>
								{
									this.props.user.isLogin &&
									<AdvanceDropDown
										author={ this.props.itemData.editable }
										itemData={ this.props.itemData }
										mode={ 'stream' }
										handleEdit={ this.handleEditActivity.bind(this) }
										handleDelete={ () => {} }
										category={ this.props.category }
										isAdmin={ isAdmin }
										isHead={ isHead }
										isEditor={ isEditor }
									/>
								}
							</Header>
							<div
								style={ { cursor: 'pointer' } }
								onClick={ () => { this.props.activityLightboxOpen(itemData), activityLog(this.props.itemData, viewActivityLog) } }
							>
								<Title itemData={ itemData } area="river" user={ this.props.user } />
								<div
									styleName="pre_content"
									dangerouslySetInnerHTML={ {
										__html: DOMPurify.sanitize(this.props.itemData.content, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
									} }
								/>
								{
									PreImage &&
									<div styleName="pre_image_container">
										<img src={ PreImage } styleName="pre_image" />
									</div>
								}
								<div styleName="activity_stream_more">查看更多</div>
							</div>
							<Browse itemData={ itemData } user={ this.props.user } showHint={ this.alertHint.bind(this) } />
							<Behavior itemData={ itemData } user={ this.props.user } showHint={ this.alertHint.bind(this) } />
							<Comment
								itemData={ itemData }
								user={ this.props.user }
								index={ this.props.index }
								ref={ _ref => this.comment = _ref }
								showHint={ this.alertHint.bind(this) }
								pageName={this.props.pageName}
								filterName={this.props.filterName}
							/>
						</div>
						{
							this.props.itemData.hasOwnProperty('relativeList') && this.props.itemData.relativeList.length > 0 &&
							<div styleName="activity_stream relative_activiy_block">
								<div className="h3" styleName="title_block">你可能會有興趣的文章</div>
								<div styleName="list_block">
									{
										this.props.itemData.relativeList.map((aid, index) => {
											if (this.props.activity.activityPool.hasOwnProperty(aid) && index < 3) {
												const relativeData = this.props.activity.activityPool[aid];
												return (
													<ListItem
														itemData={ relativeData }
														user={ this.props.user }
														key={ relativeData.aid }
													/>
												);
											}
										})
									}
								</div>
							</div>
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
								galleryMode={ this.props.itemData.extra.hasOwnProperty('source') && this.props.itemData.extra.source === 'gallery' }
							/>
						}
					</div>
				}
				{
					this.props.itemData.hasOwnProperty('ignore') && this.props.itemData.ignore &&
					<Ignore itemData={ this.props.itemData } style={ hideIgnoreStyle } hideIgnore={ this.hideIgnore } />
				}
			</div>
		);
	}
}

function attachPreImage(attachment) {
	if (attachment && attachment.length !== 0) {
		for (const index in attachment) {
			if (attachment[index].activityFileUrl !== null) return attachment[index].activityFileUrl;
		}
	}
	return false;
}

// class RelativeActivity extends React.Component {
// 	constructor(props) {
// 		super(props);
// 	}
// 	renderAuthor(isChannel) {
// 		const { channelId, channelInfo, userInfo } = this.props.itemData;
// 		return isChannel ? <Link to={ `/channel/${channelId}` }><div styleName="author">{channelInfo.name}</div></Link> :
// 		<Link to={ `/profile/${userInfo.pid}` }><div styleName="author">{userInfo.userName}</div></Link>;
// 	}
// 	render() {

// 		const { itemData, index } = this.props;
// 		const { channelId, channelInfo, userInfo } = this.props.itemData;
// 		const isChannel = channelId !== null && typeof (channelId) !== 'undefined' && channelInfo.type === 10;
// 		const preImg = (typeof (itemData.extraInfo) === 'object') ? attachPreImage(itemData.extraInfo.attachmentList) : null;
// 		return (
// 			<div styleName="relative_activity_item">
// 				<div styleName="imgSection">
// 					<img src={ preImg } />
// 				</div>
// 				<div styleName="title" onClick={ () => this.props.activityLightboxOpen(this.props.itemData) }>{ this.props.itemData.title }</div>
// 				{
// 					this.renderAuthor(isChannel)
// 				}
// 				<div className="clearfix" styleName="viewcount">{ this.props.itemData.viewCount }次瀏覽
// 					<CollectButton
// 						itemData={ itemData }
// 						index={ index }
// 						styleName="collect_icon"
// 						user={ this.props.user }
// 					/>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// const RelativeActivityItem = compose(
// 	connect(null, { activityLightboxOpen }),
// 	[CSSModules, '_', css, { allowMultiple: true }]
// )(RelativeActivity);

// TODO 如果時間允許請改成 pure component 且 activityLightboxOpen 其實可以從外部傳入

function mapStateToProps(state) {
	return {
		user: state.user,
		activity: state.activity
	};
}

export default compose(
	connect(mapStateToProps, { activityLightboxOpen }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Stream);
