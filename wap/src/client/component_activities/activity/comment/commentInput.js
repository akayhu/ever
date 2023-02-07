import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { LightBox, FileUploader, CommentEditor } from 'c_wap_module';
import { createComment, updateComment } from 'src/client/actions/activity';
import { showPlatformAlert } from 'src/client/actions/alert';
import clientConfig from 'src/configs/client';
import mediaInfo from 'src/client/component_activities/config/mediaInfo.js';
import convertPattern from 'src/client/component_activities/config/convertPattern.js';
import Attachment from './attachment';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { convertToRaw, convertFromRaw } from 'draft-js';
import activityUnit from '../activityUnit';
import Validates from 'src/util/validator/validates';

import { activityEventLog } from 'src/client/actions/activity/activityLog.js';


// 會傳是否不可以送出， 可以為 true
const checkComment = function checkComment(blocks) {
	let checksLeng = 0;
	let cannotComment = true;
	let count = 0;

	const checks = blocks.map((item) => {
		const text = item.text;
		let isViolation = false;
		const isEmpty = Validates.checkIsEmpty(text);
		const isBlank = Validates.checkValueNotBlank(text);
		if (isEmpty || isBlank) {
			isViolation = true;
		}
		return isViolation;
	});
	checksLeng = checks.length;
	for (let i = 0; i < checksLeng; i += 1) {
		if (checks[i] === true) {
			count++;
		}
	}
	if (count !== checksLeng) {
		cannotComment = false;
	}
	return cannotComment;
};


const filterCharacterEntityReference = function filterCharacterEntityReference(html) {
	const re01 = /&amp;/g;
	const re02 = /&quot;/g;
	const re03 = /&lt;/g;
	const re04 = /&gt;/g;
	const re05 = /&#x27;/g;
	let resultHtml = '';
    html = html.replace(re01, '&');
    html = html.replace(re02, '"');
    html = html.replace(re03, '<');
    html = html.replace(re04, '>');
    html = html.replace(re05, '\'');
	resultHtml = html;
	return resultHtml;
};

class CommentInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buttonStatus: 'normal', // normal 一般狀態 // uploadAttachment 上傳物件中 // create 發送中
			hasExAttachment: props.hasAttachment, // for comment edit mode use
			hasAttachment: props.hasAttachment,
			attachmentFileName: '',
			attachUploading: false,
			uploadingLongTimeHint: false, // 讀取過久flag,
			deleteCheck: false,
			contentString: props.content || '',
			initContentString: null,
			inputIllegalComment: false // 輸入檢查
		};

		this.state.initContentString = convertToRaw(convertFromHTML(convertPattern)(this.state.contentString));
		this.currentContent = null;
		this.setTIME = null;
		this.extra = { tagUser: [], attachmentList: [] };
		this.illegalComment = this.illegalComment.bind(this);
	}
	componentWillMount() {
		if (this.props.updateMode && this.props.itemData.representativeFile !== null) {
			const attachdata = {
				fid: this.props.itemData.representativeFile.activityFileId,
				contentType: this.props.itemData.representativeFile.contentType
			};
			this.extra.attachmentList.push(attachdata);
		}
	}
	onChange(contentState) {
		this.setState({inputIllegalComment: false});
		this.currentContent = convertToRaw(contentState);
	}
	cleanData() {
		this.setState({
			buttonStatus: 'normal', // normal 一般狀態 // uploadAttachment 上傳物件中 // create 發送中
			hasExAttachment: false,
			hasAttachment: false,
			attachmentFileName: '',
			attachUploading: false,
			uploadingLongTimeHint: false, // 讀取過久flag,
			contentString: ''
		});
		// 清除 input value
		this.currentContent = null;
		this.extra.attachmentList = [];
	}
	illegalComment() {
		const warring = 'self_message_warning';
		this.setState({inputIllegalComment: true});
	}
	addComment() {
		const blocks = this.currentContent.blocks;
		const cannotComment = checkComment(blocks);
		let commentHtml = convertToHTML(convertPattern)(convertFromRaw(this.currentContent));
		const extraAttachmentListLength = this.extra.attachmentList.length;

		// commentHtml = filterCharacterEntityReference(commentHtml);

		if (cannotComment && extraAttachmentListLength === 0) {
			this.illegalComment();
			return false;
		}

		this.setState({
			buttonStatus: 'create',
			attachUploading: false,
			uploadingLongTimeHint: false
		});

		this.extra.tagUser = activityUnit.getMentionList(this.currentContent);
		const params = {
			// productKey: clientConfig.params.apnum,
			pid: this.props.user.pid,
			aidParent: this.props.itemData.aid,
			content: commentHtml,
			extra: JSON.stringify(this.extra)
		};

		this.refs.comment.cleanData();
			
		// 黑名單時擋住不送
		// 頻道文章不受黑名單限制 http://jira.104.com.tw/browse/BIGC-1526
		const isChannelActivity = this.props.itemData.channelInfo && this.props.itemData.channelInfo.type === 10;
		if (this.props.itemData.userInfo.blockStatus && !isChannelActivity) {
			this.props.showPlatformAlert('權限不足，無法操作這個動作');
			return this.cleanData();
		}

		if (this.props.user.pid === -3) {
			this.props.showHint();
			return this.cleanData();
		}

		this.props.createComment(params).then(() => {
			this.cleanData();
		});

		const clickActivityLog = { 
				pid: this.props.user.pid, 
				page: this.props.pageName ? this.props.pageName : '', 
				filter: this.props.filterName? this.props.filterName:'',
				event:'comment'
			};
		activityEventLog(this.props.itemData, clickActivityLog)
	}
	sendUpdate(commentHtml) {
		if (!commentHtml) {
			commentHtml = convertToHTML(convertPattern)(convertFromRaw(this.currentContent));
		}

		this.extra.tagUser = activityUnit.getMentionList(this.currentContent);
		const params = {
			// productKey: clientConfig.params.apnum,
			pid: this.props.user.pid,
			aidParent: this.props.itemData.aidParent,
			aid: this.props.itemData.aid,
			activity: JSON.stringify({ content: commentHtml, extra: this.extra })
		};

		this.setState({
			deleteCheck: false
		});

		return this.props.updateComment(params).then(() => {
			this.props.finishUpdate();
		});
	}
	updateCommentSubmit() {
		const regex = /(<([^>]+)>)/ig;
		const commentHtml = convertToHTML(convertPattern)(convertFromRaw(this.currentContent));
		const pureHtml = commentHtml.replace(regex, '');

		if (!pureHtml && this.extra.attachmentList.length === 0) {
			this.props.deleteComment();
			return;
		}
		return this.sendUpdate(commentHtml);
	}
	fileClick(e) {
		if (this.props.user.pid === -3) {
			e.preventDefault();
			this.props.showHint();
			return this.cleanData();
		}
	}
	getFileInfo(fileSystem) {
		this.setState({
			buttonStatus: 'uploadAttachment',
			hasAttachment: true,
			attachmentFileName: fileSystem.originFile.name,
			attachUploading: true
		});

		this.setTIME = setTimeout(() => {
			this.setState({
				uploadingLongTimeHint: true
			});
		}, 5000);
	}
	uploadToS3Done(fileSystem) {
		this.setState({
			buttonStatus: 'normal',
			attachUploading: false,
			uploadingLongTimeHint: false
		});

		const extraObject = {
			contentType: attachmentTypeFilter(fileSystem.type),
			fid: fileSystem.signature.fileId
		};

		this.extra.attachmentList.push(extraObject);
		clearTimeout(this.setTIME);
	}
	cancelUpload() {
		this.cleanData();
	}
	render() {
		let selfMessageStyle;
		if (this.state.inputIllegalComment) {
			selfMessageStyle = 'self_message_warning';
		} else {
			selfMessageStyle = 'self_message';
		}
		
		return (
			<div styleName="self_message_main" className="clearfix">
				<div
					styleName={ selfMessageStyle }
					ref={ (selfMessage) => { this.message = selfMessage; } }
				>
					<CommentEditor
						ref="comment"
						placeholder="聊些什麼吧～"
						content={ this.state.initContentString }
						mentions={ this.props.mentions }
						onChange={ this.onChange.bind(this) }
					/>
					{
						!this.state.hasAttachment &&
						<div onClick={ this.fileClick.bind(this) }>
							<FileUploader
								styleName="file_uploader"
								apnum={ clientConfig.params.apnum }
								pid={ this.props.user.pid }
								mediaInfo={ mediaInfo }
								getFileInfo={ this.getFileInfo.bind(this) }
								uploadToS3Done={ this.uploadToS3Done.bind(this) }
							>
								<div styleName="attachment_icon"><i className="icon attachment" data-gtm-activity="上傳檔案" /></div>
							</FileUploader>
						</div>
					}
					{
						this.state.hasAttachment &&
						<span styleName="file_uploader"><div styleName="attachment_icon"><i className="icon attachment disabled" /></div></span>
					}
				</div>
				{
					this.state.buttonStatus === 'normal' && !this.props.updateMode &&
					<button className="ui primary button " onClick={ this.addComment.bind(this) } data-gtm-activity="留言">留言</button>
				}
				{
					this.state.buttonStatus === 'uploadAttachment' && !this.props.updateMode &&
					<button className="ui primary disabled button">留言</button>
				}
				{
					this.state.buttonStatus === 'create' && !this.props.updateMode &&
					<button className="ui primary button loading">留言</button>
				}
				{
					this.props.updateMode &&
					<div className="clearfix" styleName="btn_row">
						<button className="ui primary button" onClick={ this.updateCommentSubmit.bind(this) }>確定</button>
						<button className="ui button" onClick={ this.props.updateCommentCancel }>取消</button>
					</div>
				}
				{
					this.state.hasExAttachment && this.props.updateMode &&
					<Attachment attachment={ this.props.itemData.representativeFile } />
				}
				{
					this.state.hasAttachment &&
					<div styleName="hasAttachment">
						{
							!this.state.uploadingLongTimeHint &&
							<div styleName="attachmentName">{this.state.attachmentFileName}</div>
						}
						{
							this.state.uploadingLongTimeHint &&
							<div styleName="attachmentName slow">
								<span>{this.state.attachmentFileName}</span>
								<span>現在網路速度似乎有點慢，請耐心等候</span>
							</div>
						}
						{
							this.state.attachUploading &&
							<div className="ui loading" />
						}
						{
							!this.state.attachUploading &&
							<div styleName="cancel_upload_btn" onClick={ () => this.cancelUpload() }>刪除</div>
						}
						{
							this.state.uploadingLongTimeHint && this.state.attachUploading &&
							<div styleName="cancel_upload_btn" onClick={ () => this.cancelUpload() }>取消上傳</div>
						}
					</div>
				}
				{
					this.state.inputIllegalComment &&
					<p styleName="warning_text">請輸入標題</p>
				}
			</div>
		);
	}
}

function attachmentTypeFilter(type) {
	switch (type) {
		case 'IMAGE':
			return 2;
		case 'VIDEO':
			return 3;
		case 'DOCUMENT':
			return 4;
		case 'AUDIO':
			return 5;
		default:
			return 1;
	}
}

CommentInput.defaultProps = {
	content: '',
	hasAttachment: false,
	updateMode: false
};

CommentInput.propTypes = {
	index: PropTypes.number,
	content: PropTypes.string,
	hasAttachment: PropTypes.bool,
	updateMode: PropTypes.bool,
	updateCommentCancel: PropTypes.func
};

export default compose(
	connect(null, { createComment, updateComment, showPlatformAlert }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(CommentInput);
