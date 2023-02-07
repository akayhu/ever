import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import Validators from 'src/util/validator';
import css from './index.css';
// import docApi_upload from 'src/util/docApi';
// components
import mediaInfo from 'src/client/component_activities/config/mediaInfo';
import { TextField, FileUploader } from 'c_wap_module';
import clientConfig from 'src/configs/client';

const config = {
	data: {
		ccMsg: ['notEmpty', { maxLength: 1000 }]
	}
};

const val = new Validators(config);
/**
 *
 * @param limit 最高字數
 * @param words 數入字串
 * @returns {boolean} 是否超過字數
 */
const checkMaxLength = function checkMaxLength(limit, words) {
	let isOverLength = false;
	const worddLeng = words.length;
	if (limit < worddLeng) {
        isOverLength = true;
	}
	return isOverLength;
};

class ReplyPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ccMsg: '',
			disableTextField: false,
			disableSubmit: true,
			hasAttachment: false,
			attachmentFileName: '',
			attachUploading: false,
			uploadingLongTimeHint: false, // 讀取過久flag,
			bindEnter: false,
			loading: false
		};
		this.setTIME = null;
		this.extra = { attachmentList: [] };

		this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.afterSubmit = this.afterSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.disableAction !== this.props.disableAction) {
			this.setState({
				disableTextField: nextProps.disableAction,
				disableSubmit: nextProps.disableAction
			});
		}
	}

	handleCheckBoxChange() {
		this.setState({
			bindEnter: !this.state.bindEnter
		});
	}
	handleSubmit() {
		const isOverLength = checkMaxLength(1001, this.state.ccMsg);

		if (isOverLength) {
        	return false;
		}

		this.setState({
			disableTextField: true,
			disableSubmit: true
		});

		this.props.handleSendMsg(this.state.ccMsg, this.extra).then(this.afterSubmit);
	}
	afterSubmit(msg) {
		this.cleanData();
		this.setState({
			ccMsg: '',
			loading: false,
			disableTextField: false,
			disableSubmit: true
		});
	}
	onChange(key, value) {
		this.setState({
			ccMsg: value,
			disableSubmit: value === ''
		});
	}
	onBlur(key, value) {
		if (this.extra.attachmentList.length > 0) {
			return;
		}

		this.setState({
			ccMsg: value,
			disableSubmit: value === ''
		});
	}
	onKeyDown(value) {
		this.setState({
			ccMsg: value
		}, () => {
			this.handleSubmit();
		});
	}
	getFileInfo(fileSystem) {
		this.setState({
			hasAttachment: true,
			attachmentFileName: fileSystem.originFile.name,
			attachUploading: true,
			disableSubmit: true
		});
		this.setTIME = setTimeout(() => {
			this.setState({
				uploadingLongTimeHint: true
			});
		}, 5000);
	}
	uploadToS3Done(fileSystem) {
		const extraObject = {
			contentType: attachmentTypeFilter(fileSystem.type),
			fid: fileSystem.signature.fileId,
			name: fileSystem.originFile.name
		};
		this.extra.attachmentList.push(extraObject);
		this.setState({
			attachUploading: false,
			uploadingLongTimeHint: false,
			disableSubmit: false
		});
		clearTimeout(this.setTIME);
	}
	cancelUpload() {
		this.cleanData();
	}
	cleanData() {
		this.setState({
			hasAttachment: false,
			attachmentFileName: '',
			attachUploading: false,
			uploadingLongTimeHint: false, // 讀取過久flag,
			disableSubmit: this.state.ccMsg === '',
		});
		this.extra.attachmentList = [];
	}
	render() {
		const {disableAction} = this.props;
		return (
			<div styleName="bccommunication_reply bccommunication_reply_cc">
				<div styleName="bccommunication_reply_mid">
					<TextField
						name="ccMsg"
						value={ this.state.ccMsg }
						validator={ val }
						allowMultiLine
						height={ 150 }
						placeHolder={ this.props.placeHolder || '回覆......' }
						maxWords={ 1000 }
						onChange={ this.onChange }
						onBlur={ this.onBlur }
						onKeyDown={ {
							keyName: 'Enter',
							action: this.onKeyDown,
							ignoreShift: true
						} }
						disabled={ this.state.disableTextField }
					/>
					<div styleName="bccommunication_reply_block">
						<div styleName="upload_block">
							{
								!this.state.hasAttachment && !disableAction &&
								<FileUploader
									styleName="upload_text"
									apnum={ clientConfig.params.apnum }
									pid={ this.props.user.pid }
									mediaInfo={ mediaInfo }
									getFileInfo={ this.getFileInfo.bind(this) }
									uploadToS3Done={ this.uploadToS3Done.bind(this) }
								>
									上傳附件
								</FileUploader>
							}
							{
								this.state.hasAttachment && !disableAction &&
								<div styleName="hasAttachment">
									{
										!this.state.uploadingLongTimeHint &&
										<div styleName="attachmentName">{this.state.attachmentFileName}123</div>
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
						</div>
					</div>
				</div>
				<div styleName="bccommunication_reply_button">
					<button
						onClick={ this.handleSubmit }
						className={ `mini ui primary button${this.state.loading ? ' loading' : ''}` }
						disabled={ this.state.disableSubmit || this.state.disableTextField || disableAction || this.state.ccMsg.length === 0 }
					>
						回覆
					</button>
				</div>
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

export default CSSModules(ReplyPanel, css, { allowMultiple: true });
