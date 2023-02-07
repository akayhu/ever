import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import Validators from 'src/util/validator';
import css from './index.css';
// actions
// components
import mediaInfo from 'src/client/component_activities/config/mediaInfo';
import { TextField, FileUploader } from 'c_wap_module';
import clientConfig from 'src/configs/client';

const config = {
	data: {
		bcMsg : [{ maxLength: 1000 } ]
	}
};

const val = new Validators( config );
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
			accept: true,
			withPhone: false,
			bcMsg: '',
			disableAction: false,
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
		this.handleWithPhone = this.handleWithPhone.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.afterSubmit = this.afterSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}
	handleCheckBoxChange() {
		this.setState({
			bindEnter: !this.state.bindEnter
		});
	}
	handleWithPhone() {
		this.setState({
			withPhone: !this.state.withPhone
		})
	}
	handleRadioChange(type) {
		if(type === 1){
			this.setState({
				accept: true,
				disableAction: false,
				disableTextField: false,
				disableSubmit: true,
			});
		}else if(type === 2){
			this.setState({
				bcMsg: '',
				withPhone: false,
				accept: false,
				disableAction: true,
				disableTextField: true,
				disableSubmit: false,
				hasAttachment: false,
				attachmentFileName: '',
				attachUploading: false,
				uploadingLongTimeHint: false
			});
			this.extra.attachmentList = [];
		}
	}
	handleSubmit() {
    const isOverLength = checkMaxLength(1001, this.state.bcMsg);

    if(isOverLength) {
      return false;
    }

		this.setState({
			disableTextField: true,
			disableSubmit: true
		});

		if(this.props.accepted){
			this.props.handleSendMsg(this.state.bcMsg, this.extra).then(this.afterSubmit);
		}else{
			this.props.handleSetContactInfo(this.state.accept, this.state.withPhone);
			if(this.state.accept){
				this.props.handleSendMsg(this.state.bcMsg, this.extra, this.state.accept, this.state.withPhone).then(this.afterSubmit);
			}else{
				this.props.handleSendMsg('不好意思，我暫時不提供聯絡方式，謝謝貴公司的青睞。', this.extra, this.state.accept, this.state.withPhone).then(this.afterSubmit);
			}
		}
	}
	afterSubmit(msg) {
		this.cleanData();
		this.setState({
			bcMsg: '',
			loading: false,
			disableTextField: false,
			disableSubmit: true
		});
	}
	onChange(key, value) {
		this.setState({
			bcMsg: value,
			disableSubmit: value === ''
		});
	}
	onBlur(key, value) {
		this.setState({
			bcMsg: value,
			disableSubmit: value === '' && this.state.accept !== false
		});
	}
	onKeyDown(value) {
		this.setState({
			bcMsg: value
		}, ()=>{
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
			disableSubmit: this.state.bcMsg === '' ? (this.props.accepted && this.props.acceptStatus.status === 6 ? false : true) : false
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
			disableSubmit: this.state.bcMsg === '' ? true : false,
		});
		this.extra.attachmentList = [];
	}
	render() {
		return (
			<div styleName="bccommunication_reply bccommunication_reply_bc">
				{
					this.props.accepted && this.props.acceptStatus.status === 6 &&
					<div styleName="bccommunication_reply_remind">提醒：你已同意此公司透過手機與站內訊息與你聯絡。</div>
				}
				{
					!this.props.accepted &&
					<div styleName="bccommunication_reply_remind">在你未同意前，企業無法取得你的聯絡資訊。建議與該公司建立聯絡管道，讓更好的機會找上你。</div>
				}
				{
					!this.props.accepted &&
					<div styleName="bccommunication_reply_checkPanel_top">
						<input
							type="radio"
							name="accept"
							checked={this.state.accept}
							onChange={this.handleRadioChange.bind(this, 1)}
						/>我願意在站上保持聯絡，還可用：<br/>
						<input
							type="checkbox"
							checked={this.state.withPhone}
							onChange={this.handleWithPhone}
							disabled={!this.state.accept}
						/> 手機(<a href={'https:' + clientConfig.params.accountsUrl + '/hello?p=' + this.props.user.aesPid} target="_blank">修改號碼</a>)
			    </div>
				}
		    <div styleName="bccommunication_reply_mid">
		      <TextField
		        name="bcMsg"
		        value={ this.state.bcMsg }
		        validator={ val }
		        allowMultiLine={ true }
		        height={ 150 }
		        placeHolder="回覆......"
		        maxWords={ 1000 }
						checked={ this.state.accept === true }
		        onChange={ this.onChange }
		        onBlur={ this.onBlur }
						onKeyDown={{
							keyName:'Enter',
							action:this.onKeyDown,
							ignoreShift:false
						}}
						disabled={ this.state.disableTextField }
		      />
					<div styleName="bccommunication_reply_block">
					 	<div styleName="upload_block">
					 		{/*{
								!this.state.hasAttachment && !this.state.disableAction &&
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
							}*/}
							{
								this.state.hasAttachment && !this.state.disableAction &&
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
		      </div>
		    </div>
		    {
					!this.props.accepted &&
					<div styleName="bccommunication_reply_checkPanel_bot">
			    	<input
							type="radio"
							name="accept"
							checked={ this.state.accept === false }
							onChange={this.handleRadioChange.bind(this, 2)}
						/>不好意思，我暫時不提供聯絡方式，謝謝貴公司的青睞。
			    </div>
				}
        <div styleName="bccommunication_reply_button">
          <button
						ref="submit"
						onClick={ this.handleSubmit }
						className={"mini ui primary button" + (this.state.loading ? " loading" :'')}
						disabled={ this.state.disableSubmit }
					>
						回覆
					</button>
        </div>
		  </div>
		)
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

export default CSSModules( ReplyPanel, css, { allowMultiple: true } );
