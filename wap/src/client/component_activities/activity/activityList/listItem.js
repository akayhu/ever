import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import DOMPurify from 'dompurify';
import highlight from 'src/util/StringUtil';
import compose from 'src/util/compose';
import ActivityEditor from 'src/client/component_activities/module/Editor';
import { GroupCard, ChannelCard } from 'src/client/component_common/card';
import { LightBox } from 'c_wap_module';
import { Link } from 'react-router';
import { activityLightboxClose, activityLightboxOpen, collectNotcollect } from 'src/client/actions/activity';
import { activityLog, activityEventLog } from 'src/client/actions/activity/activityLog.js';

class ListItem extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			lightbox: false,
			editMode: false,
			previewImgStatus: false,
			previewImgUrl: '',
			searchKeyword: props.searchKeyword || '',
			searchSplat: props.searchSplat || '',
			hintMsgLightbox: false
		};

		this.alertHint = this.alertHint.bind(this);
	}
	componentWillMount() {
		const result = previewImg(this.props.itemData.extraInfo.attachmentList);
		if (result.status) {
			this.setState({
				previewImgStatus: result.status,
				previewImgUrl: result.url
			});
		}
	}
	alertHint() {
		if (this.props.user.isLogin === true) {
			if (this.props.hasOwnProperty('handleInteractionLock')) {
				// 預覽模式
				if (this.props.handleInteractionLock && this.props.handleInteractionLock()) return;
			}
			this.props.collectNotcollect(this.props.itemData);
			const collectIt = this.props.itemData.collectIt;
			const clickActivityLog = {
				pid: this.props.user.pid,
				page: this.props.pageName,
				filter: this.props.filterName !== 'occupaTag' ? this.props.filterName : this.props.tabName,
				event: 'collect'
			};
			if (collectIt && !this.props.commitAid) activityEventLog(this.props.itemData, clickActivityLog);
		} else {
			this.setState({
				hintMsgLightbox: !this.state.hintMsgLightbox
			});
		}
	}
	lightboxOpen() {
		if (this.props.hasOwnProperty('handleInteractionLock')) {
			// 預覽模式
			if (this.props.handleInteractionLock && this.props.handleInteractionLock()) return;
		}
		const itemData = this.props.itemData;
		const pageName = this.props.pageName;
		const filterName = this.props.filterName;
		const viewActivityLog = {
			pid: this.props.user.pid,
			page: pageName,
			filter: filterName !== 'occupaTag' ? filterName : this.props.tabName
		};
		this.props.activityLightboxOpen(itemData);
		activityLog(this.props.itemData, viewActivityLog);
	}
	handleEditActivity() {
		this.setState({
			editMode: true
		});
	}
	handleCloseActivityEditor() {
		this.setState({
			editMode: false
		});
	}
	redirect() {
		const url = `/sso/saml-login?r=/activity/${this.props.itemData.aid}`;
		location.href = url;
	}
	render() {
		const {
			collectIt,
			privacySetting,
			title,
			userInfo: {
				userName,
				pid,
				userJobTitle,
				userCompany
			},
			createDateStr,
			content,
			viewCount,
			channelId,
			channelInfo
		} = this.props.itemData;
		const { searchSplat, searchKeyword, previewImgUrl, previewImgStatus } = this.state;
		const bookmarkStyle = (collectIt) ? { color: '#0192b5' } : {};
		// channelInfo.type類型 - 7:私人社團 8:公開社團 10:媒體頻道
		const privacyIcon = (channelInfo && channelInfo.type === 7) ? 'protect icon' : setPrivacyIcon(privacySetting);
		const lightboxObtion = { closeIcon: false };
		const isChannel = channelInfo && channelInfo.type === 10;
		const searchKeywords = searchSplat ? `${searchKeyword}/${searchSplat}` : searchKeyword;
		return (
			<div styleName="list_item">
				<div styleName="list_item_title">
					{
						previewImgStatus &&
						<div styleName="imgSection" onClick={ this.lightboxOpen.bind(this) }>
							<img src={ previewImgUrl } />
						</div>
					}
					<div styleName="textSection">
						<h3 styleName="main_title" onClick={ this.lightboxOpen.bind(this) } title={ title }>
							{ title }
							<i className={ privacyIcon } />
						</h3>
						<div styleName="subtitle" className="clearfix">
							<div styleName="left">
								{
									!isChannel &&
									<span title={ `${userName || ''} ${userJobTitle || ''} ${userCompany || ''}` } >
										<Link to={ `/profile/${pid}` }>{userName} </Link>
										{userJobTitle}
										{userCompany}
									</span>
								}
							</div>
							<div styleName="right" title={ createDateStr }>{ createDateStr.substring(0, 10).replace(/-/g, '/') }</div>
						</div>
					</div>
				</div>
				<h3
					styleName="pre_content"
					onClick={ this.lightboxOpen.bind(this) }
					title={ DOMPurify.sanitize(content, { ALLOWED_TAGS: [], KEEP_CONTENT: true }) }
					dangerouslySetInnerHTML={ {
						__html: highlight(
							DOMPurify.sanitize(content, { ALLOWED_TAGS: [], KEEP_CONTENT: true }),
							searchKeywords)
					} }
				/>
				<hr style={ { margin: 0 } } />
				<div styleName="bottom_info">
					{
						viewCount > 0 &&
						<span styleName="info_count">{ viewCount }次瀏覽</span>
					}
					{
						channelId && channelInfo &&
						<span styleName="info_groupCard">
							{
								channelInfo.type === 10 ?
									<ChannelCard
										name={ channelInfo.name }
										id={ channelId }
										textMode
									/>
								:
									<GroupCard
										name={ channelInfo.name }
										id={ channelId }
										textMode
									/>
							}
						</span>
					}
					{
						!this.props.author && 
						<span styleName="info_btn" style={ bookmarkStyle } onClick={ this.alertHint.bind(this) }>
							<i className="bookmark icon" />收藏
						</span>
					}
					{/* {
						this.props.author ?
							<span styleName="info_btn" onClick={ this.handleEditActivity.bind(this) }>
								<i className="edit icon" />編輯
							</span>
						:
							<span styleName="info_btn" style={ bookmarkStyle } onClick={ this.alertHint.bind(this) }>
								<i className="bookmark icon" />收藏
							</span>
					} */}
				</div>
				{
					this.state.hintMsgLightbox &&
					<LightBox option={ lightboxObtion } onClose={ this.alertHint.bind(this) } >
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
		);
	}
}

function setPrivacyIcon(setting) {
	switch (setting) {
		case 0:
			return 'world icon';
		case 1:
			return 'friends icon';
		case 2:
			return 'lock icon';
		default:
			return 'world icon';
	}
}

function previewImg(attachmentList) {
	const result = {
		status: false,
		url: ''
	};
	if (attachmentList && attachmentList.length !== 0) {
		for (let i = 0; i < attachmentList.length; i += 1) {
			if (attachmentList[i].contentType === 2 && attachmentList[i].activityFileUrl) {
				result.status = true;
				result.url = attachmentList[i].activityFileUrl;
				break;
			}
		}
	}
	return result;
}

export default compose(
	connect(null, {
		activityLightboxClose,
		activityLightboxOpen,
		collectNotcollect
	}),
	[CSSModules, '_', css]
)(ListItem);
