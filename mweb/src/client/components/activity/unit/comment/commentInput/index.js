import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { convertToRaw, convertFromRaw } from 'draft-js';
import { FileUploader, CommentEditor } from 'c_wap_module';
import classnames from 'classnames';
import css from './index.css';
import compose from 'src/util/compose';
// components
import clientConfig from 'src/configs/client';
import mediaInfo from 'src/client/components/activity/config/mediaInfo.js';
import convertPattern from 'src/client/components/activity/config/convertPattern.js';
import activityUnit from './activityUnit';
// actions
import { prepareCreateComment } from 'src/client/actions/activity';
import { checkLogin } from  'src/client/actions/user';
import { activityEventLog } from 'src/client/actions/activity/activity_log.js';
import $ from 'jquery';


class CommentInput extends React.Component {
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
			content: props.content || '',
		};
		this.extra = { tagUser: [], attachmentList: [] };
		this.currentContent = null;
	}
	componentWillMount() {
		if (this.props.updateMode && this.props.itemData.representativeFile !== null) {
			const attachdata = { fid: this.props.itemData.representativeFile.activityFileId, contentType: this.props.itemData.representativeFile.contentType };
			this.extra.attachmentList.push(attachdata);
		}
	}
	componentDidMount() {
		try{
			this.refs.comment.editor.refs.editor.refs.editor.addEventListener('click', (e) => {
				setTimeout(() => {
					var target = document.getElementById("main_layer");
					var related = document.getElementById("related");
					var leftSide = document.getElementById("left_side");

					if(target){
						// console.log("layer mode");
						if(related){
							// console.log("related mode");
							// console.log("related.clientHeight : "+ related.clientHeight);
							// console.log("leftSide.clientHeight : "+ leftSide.clientHeight);
							target.scrollTop = target.scrollHeight - related.clientHeight - leftSide.clientHeight;
						}else{
							target.scrollTop = target.scrollHeight;
						}
						// console.log("target.scrollHeight : "+ target.scrollHeight);
					}else{
						// console.log("page mode");
						var body = document.body,
						    html = document.documentElement;

						var height = Math.max( body.scrollHeight, body.offsetHeight,
						                       html.clientHeight, html.scrollHeight, html.offsetHeight );

						if(related){
							// console.log("related mode");
							// console.log("related.clientHeight : "+ related.clientHeight);
							// console.log("leftSide.clientHeight : "+ leftSide.clientHeight);
							window.scrollTo(0, (height - related.clientHeight - leftSide.clientHeight));
						}else{
							window.scrollTo(0, height);
						}

						// console.log("height : "+ height);
					}
				}, 700);
			});
		}catch(e){
			console.log(e);
		}
	}
	onChange(contentState) {
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
		});
		this.refs.comment.cleanData();
		this.extra.attachmentList = [];
	}
	addComment() {
		// 沒有登入 且 (沒有輸入任何東西 且 沒有上傳附件時) 無法送出留言
		if(!this.props.checkLogin() || (!this.currentContent.blocks[0].text && this.extra.attachmentList.length === 0)){
			return;
		}

		const commentHtml = convertToHTML(convertPattern)(convertFromRaw(this.currentContent));
		this.setState({buttonStatus: 'create', attachUploading: false, uploadingLongTimeHint: false});
		this.extra.tagUser = activityUnit.getMentionList(this.currentContent);

		const params = {
			pid: this.props.user.pid,
			aidParent: this.props.itemData.aid,
			content: commentHtml,
			extra: JSON.stringify(this.extra),
		};

		this.props.prepareCreateComment(params).then((success) => {
			this.cleanData();
		}, (fail) => {
			this.cleanData();
			this.setState({
				buttonStatus: 'normal'
			})
		});

		const eventLog = { pid: this.props.user.pid, page: this.props.pageName ? this.props.pageName : '', filter: this.props.filter ? this.props.filter : '', event: 'comment' }
		activityEventLog( this.props.itemData, eventLog );
	}
	getFileInfo(fileSystem) {
		this.setState({
			buttonStatus: 'uploadAttachment',
			hasAttachment: true,
			attachmentFileName: fileSystem.originFile.name,
			attachUploading: true
		}, () => {
			// console.log(this.hasAttachment.offset);
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
			fid: fileSystem.signature.fileId,
		};

		this.extra.attachmentList.push(extraObject);
		clearTimeout(this.setTIME);
	}
	cancelUpload() {
		this.cleanData();
	}
	render() {
		return (
			<div styleName="comment_input_wrap">
				<div styleName="comment_input">
					<div styleName="self_message">
						{
							this.props.user.isLogin &&
							<CommentEditor
								ref="comment"
								placeholder="聊些什麼吧～"
								onChange={ this.onChange.bind(this) }
							/>
						}
						{
							!this.props.user.isLogin &&
							<input type="text" placeholder="聊些什麼吧～" style={{"line-height": "22px"}} onClick={ this.props.checkLogin } />
						}
						{
							this.props.user.isLogin &&
							<FileUploader
								styleName="file_uploader"
								apnum={ clientConfig.params.apnum }
								pid={ this.props.user.pid }
								mediaInfo={ mediaInfo }
								getFileInfo={ this.getFileInfo.bind(this) }
								uploadToS3Done={ this.uploadToS3Done.bind(this) }
							>
								<div><i className="icon camera" data-gtm-activity="上傳檔案" onClick={ this.props.checkLogin } /></div>
							</FileUploader>
						}
						{
							!this.props.user.isLogin &&
							<div styleName="file_uploader"><i className="icon camera" data-gtm-activity="上傳檔案" onClick={this.props.checkLogin} /></div>
						}
					</div>
					<button
						className={ classnames('ui', 'primary', 'button', {
							loading: (this.state.buttonStatus === 'create' || this.state.buttonStatus === 'uploadAttachment'),
							disabled: (this.state.buttonStatus === 'create' || this.state.buttonStatus === 'uploadAttachment')
						}) }
						onClick={ this.addComment.bind(this) }
						data-gtm-activity="留言"
					>
						留言
					</button>
				</div>
				{
					this.state.hasAttachment &&
					<div styleName="hasAttachment" ref={ _ref => this.hasAttachment = _ref }>
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
							<div className="ui loading"></div>
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


export default compose(
	connect(null, { prepareCreateComment, checkLogin }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(CommentInput);
