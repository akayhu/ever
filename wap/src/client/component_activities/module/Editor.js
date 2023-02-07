import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from 'src/client/component_activities/editor/index.css';
import compose from 'src/util/compose';
import { convertToRaw, convertFromRaw } from 'draft-js';
// import { stateFromHTML } from 'draft-js-import-html';
// import { convertToHTML } from 'draft-convert';
import { fromJS } from 'immutable';
import { LightBox, Editor, TextField, RadioGroup } from 'c_wap_module';

import Endorse from 'src/client/component_activities/editor/endorse';
import Tag from 'src/client/component_common/tag';
import PrivacySetting from 'src/client/component_activities/editor/privacySetting.js';

import { showPlatformAlert } from 'src/client/actions/alert';
import { createArticle, deleteArticle, updateArticle, createGallery, updateGallery, deleteGallery } from 'src/client/actions/activity';
import clientConfig from 'src/configs/client';
import activityUnit from 'src/client/component_activities/activity/activityUnit.js';
import mediaInfo from 'src/client/component_activities/config/mediaInfo.js';
import convertPattern from 'src/client/component_activities/config/convertPattern.js';
import articleTags from 'src/client/component_activities/config/articleTag.js';

import { convertToHTML, convertFromHTML } from 'draft-convert';

import SubmitButton from 'src/client/component_activities/module/SubmitButton';


// 新增區塊
class ActivityEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			aid: props.itemData ? props.itemData.aid : '',
			title: props.itemData ? props.itemData.title : '',
			privacySetting: props.itemData ? props.itemData.privacySetting : 0,
			contentString: props.itemData ? props.itemData.content : '',
			initContentString: null,
			errorMessageTitle: '',
			errorMessageContent: '',
			errorMessageArticleTags: '',
			uploading: false,
			tagList: props.itemData ? props.itemData.tagList.slice() : [],
			endorsePreferences: props.itemData ? props.itemData.expectEndorseList : [],
			submitBtnStatus: true,
			mode: 'main', // main, articleTag
			// extra: {},
			articleTag: [],
			isSelf: props.itemData ? props.itemData.pid === props.user.pid : false,
			confirmDeleteLightBox: false,
			confirmHasDataLeaveLightBox: false,
			isEditor: props.itemData !== null,
			isSubmit: false
		};

		this.state.initContentString = null;//convertToRaw(convertFromHTML(convertPattern)(this.state.contentString));
		this.currentContent = null;
		this.extra = { tagUser: [], attachmentList: [] };
		this.preSelectArticleTags = [];
		this.mentions = fromJS(props.myFriendList.list);
		if (props.itemData) {
			const tagList = props.itemData.tagList;
			articleTags.map((item) => {
				const newItem = Object.assign({}, item);

				for (const index in tagList) {
					if (tagList[index] === item.value) {
						newItem.checked = true;

						this.state.articleTag.push(item.value);
						this.state.tagList.splice(index, 1);
					}
				}
				this.preSelectArticleTags.push(newItem);
			});
		} else {
			this.preSelectArticleTags = articleTags.slice();
		}
	}
	componentDidMount() {
		this.setState({
			initContentString: convertToRaw(convertFromHTML(convertPattern)(this.state.contentString))
		})
	}
	setTitle(key, title) {
		if (title.length > 100) {
			this.setState({
				title,
				errorMessageTitle: `標題長度上限100字，現為${title.length}字`
			});

			return false;
		}

		this.setState({
			title,
			errorMessageTitle: ''
		});
	}
	setPrivacy(value) {
		this.setState({
			privacySetting: value
		});
	}
	setEndorse(value) {
		this.setState({
			endorsePreferences: value
		});
	}
	setTag(value) {
		this.setState({
			tagList: value
		});
	}
	setContent(content) {
		
		if (this.editor) {
			const fileObject = this.editor.fileSystemObject;
			let allUploaded = true;

			for (const key in fileObject) {
				const obj = fileObject[key];

				if (obj.fileData.status !== 'uploadDone') {
					allUploaded = false;

					this.changeBtnStatus(false);
					break;
				}
			}

			if (allUploaded) {
				this.changeBtnStatus(true);
			}
		}

		this.currentContent = convertToRaw(content);
	}
	setRadioSelect(selectTag) {
		this.setState({
			articleTag: selectTag.map(tag => tag.value)
		}, () => {
			if (this.state.articleTag.length > 3) {
				this.setState({ errorMessageArticleTags: '最多選擇 3 個主題' });
			}else {
				this.setState({ errorMessageArticleTags: '' });
			}
		});
	}
	changeBtnStatus(status) {
		this.setState({
			submitBtnStatus: status
		});
	}
	changeMode(mode) {
		if (this.state.articleTag.length > 3) {
			this.setState({ mode, errorMessageArticleTags: '最多選擇 3 個主題' });
		} else {
			this.setState({ mode, errorMessageArticleTags: '' });
		}
	}
	validateFields() {
		if (this.state.title.trim() === '') {
			this.setState({ errorMessageTitle: '請輸入標題' });
			return false;
		}

		if (this.state.title.length > 100) {
			this.setState({ errorMessageTitle: `標題長度上限100字，現為${this.state.title.length}字` });
			return false;
		}

		const regex = /(<([^>]+)>)/ig;
		const testHtml = convertToHTML(convertPattern)(convertFromRaw(this.currentContent));
		const pureHtml = testHtml.replace(regex, '');
		const attachment = activityUnit.makeExtra(this.currentContent.entityMap);

		if (!pureHtml && attachment.attachmentList.length === 0) {
			this.setState({ errorMessageContent: '請輸入內文' });
			return false;
		}

		if (pureHtml.length > 10000) {
			this.setState({ errorMessageContent: `內文長度上限10000字，現為${pureHtml.length}字` });
			return false;
		}

		if (this.state.mode === 'articleTag') {
			if (this.state.articleTag.length === 0) {
				this.setState({ errorMessageArticleTags: '請至少選擇 1 個主題' });
				return false;
			}

			if (this.state.articleTag.length > 3) {
				this.setState({ errorMessageArticleTags: '最多選擇 3 個主題' });
				return false;
			}
		}

		return true;
	}
	fixExtra() {
		if (this.currentContent) {
			this.extra = activityUnit.makeExtra(this.currentContent.entityMap);

			if(!this.extra || !this.extra.attachmentList ) return false;

			for( var i=0; i< this.extra.attachmentList.length; i++) {
				if(!this.extra.attachmentList[i].fid) return false;
			}
			return true;
		}else {
			return false;
		}
	}
	submitGallery() {
		this.setState({ isSubmit: true });
		if(!this.fixExtra()) {
			this.setState({ isSubmit: false });
			return this.props.showPlatformAlert("檔案正在上傳中，請稍後");
		} 

		this.changeBtnStatus(false);
		let tags = this.state.tagList.concat(this.state.articleTag);
		tags = tags.filter((el, i, arr) => { return arr.indexOf(el) === i});
		if (this.props.itemData) {
			const tempExtra = Object.assign({}, this.props.itemData.extra, this.extra);
			const activity = {
				title: this.state.title,
				content: convertToHTML(convertPattern)(convertFromRaw(this.currentContent)),
				privacySetting: this.state.privacySetting,
				tagList: tags,
				expectEndorseList: this.state.endorsePreferences,
				extra: tempExtra
			};
 
			const params = {
				aidParent: this.props.itemData.aid,
				aid: this.props.itemData.aid,
				activity: JSON.stringify(activity)
			};

			this.props.updateGallery(params).then(() => {
				this.leaveLightbox(true);
				this.changeBtnStatus(true);
			});
		} else {
			this.extra.source = 'gallery';
			const params = {
				title: this.state.title,
				content: convertToHTML(convertPattern)(convertFromRaw(this.currentContent)),
				privacySetting: this.state.privacySetting,
				tagList: tags,
				expectEndorseList: this.state.endorsePreferences,
				extra: JSON.stringify(this.extra)
			};
			if (this.state.isSubmit) {
				return false;
			}
			this.props.createGallery(params).then(() => {
				this.leaveLightbox(true);
				this.changeBtnStatus(true);
			});
		}
	}
	submitActivity() {
		this.setState({ isSubmit: true });
		this.fixExtra();
		if (this.props.itemData) {

			let taglist = this.state.tagList.concat(this.state.articleTag);
            taglist = taglist.filter((el, i, arr) => { return arr.indexOf(el) === i; });
			const tempExtra = Object.assign({}, this.props.itemData.extra, this.extra);
			const activity = {
				title: this.state.title,
				content: convertToHTML(convertPattern)(convertFromRaw(this.currentContent)),
				privacySetting: this.state.privacySetting,
				tagList: taglist,
				expectEndorseList: this.state.endorsePreferences,
				extra: tempExtra
			};
			const params = {
				aidParent: this.props.itemData.aid,
				aid: this.props.itemData.aid,
				activity: JSON.stringify(activity)
			};

			this.props.updateArticle(params).then(() => {
				this.leaveLightbox(true);
			});
		} else {
			const params = {
				title: this.state.title,
				content: convertToHTML(convertPattern)(convertFromRaw(this.currentContent)),
				privacySetting: this.state.privacySetting,
				channelId: this.props.channelId,
				tagList: this.state.tagList.concat(this.state.articleTag),
				expectEndorseList: this.state.endorsePreferences,
				extra: JSON.stringify(this.extra)
			};
			if (!this.props.hasOwnProperty('channelId')) {
				delete params.channelId;
			}
			if (this.state.isSubmit) {
				return false;
			}
			this.props.createArticle(params).then(() => {
				this.setState({ isSubmit: false });
				this.leaveLightbox(true);
			});
		}
	}
	submit() {
		if (!this.validateFields()) {
			return;
		}
		if (!this.props.user.allowPublish) {
			return this.props.showPlatformAlert("您因違反平台會員規約，暫時無法發表任何內容。如有疑問可透過意見反映詢問。");
		}
		// 展示櫥窗模式
		if (this.props.galleryMode) {
			return this.submitGallery();
		}
		if (this.state.aid === '' && this.state.mode === 'main') {
			this.changeMode('articleTag');
			return;
		}
		if (this.state.aid !== '' && this.state.mode === 'articleTag') {
			if (this.state.articleTag.length === 0) {
				this.setState({ errorMessageArticleTags: `請至少選擇 1 個主題` });
				return;
			}
			this.changeMode('main'); // 編輯模式下
			this.preSelectArticleTags = [];
			articleTags.map((item) => {
				const newItem = Object.assign({}, item);
				for (const index in this.state.articleTag) {
					if (this.state.articleTag[index] === item.value) newItem.checked = true;
				}
				this.preSelectArticleTags.push(newItem);
			});
			return;
		}
		return this.submitActivity();
	}
	deleteActivity() {
		if (this.props.galleryMode) {
			this.props.deleteGallery(this.props.itemData).then(() => {
				this.cancelDeleteLightbox();
				this.leaveLightbox(false);
			});
		}	else {
			this.props.deleteArticle(this.props.itemData).then(() => {
				this.cancelDeleteLightbox();
				this.leaveLightbox(false);
			});
		}
	}
	reSelectArticleTag() {
		this.changeMode('articleTag');
	}
	leaveLightbox(check) {
		this.props.close(check);
	}
	openDeleteLightBox() {
		this.setState({
			confirmDeleteLightBox: true
		});
	}
	cancelDeleteLightbox() {
		this.setState({
			confirmDeleteLightBox: false
		});
	}
	cancelNewActivityLightbox() {
		if (this.state.mode === 'main') {
			const regex = /(<([^>]+)>)/ig;
			const testHtml = convertToHTML(convertPattern)(convertFromRaw(this.currentContent));
			const pureHtml = testHtml.replace(regex, '');
			const contentState = this.currentContent;
			let extra = null;

			if (contentState) {
				extra = activityUnit.makeExtra(contentState.entityMap);
			}

			if (extra.attachmentList.length > 0 || pureHtml) {
				this.setState({
					confirmHasDataLeaveLightBox: true
				});
			} else {
				this.leaveLightbox();
			}
		} else {
			this.changeMode('main');
			if (this.state.aid === '') { // 新增模式
				this.preSelectArticleTags = [];
				articleTags.map((item) => {
					const newItem = Object.assign({}, item);
					for (const index in this.state.articleTag) {
						if (this.state.articleTag[index] === item.value) newItem.checked = true;
					}
					this.preSelectArticleTags.push(newItem);
				});
			}
		}
	}
	cancelHasDataLeaveLightBox() {
		this.setState({
			confirmHasDataLeaveLightBox: false
		});
	}

	render() {
		if(!this.state.initContentString){
			return null;
		}
		
		const lightboxOption = {
			closeIcon: true
		};
		const deleteLightboxOption = {
			closeIcon: true,	// 有無close ICON,
			title: '確認刪除文章',
			submit: {
				text: '確定',
				action: this.deleteActivity.bind(this)
			},
			cancel: {
				text: '取消'
			}
		};
		const hasDataLeaveLightboxOption = {
			closeIcon: true,	// 有無close ICON,
			title: '確認離開',
			submit: {
				text: '確定',
				action: this.leaveLightbox.bind(this)
			},
			cancel: {
				text: '取消'
			}
		};
		const showPrivacy = showPrivacySetting(this.props.channelId, this.props.itemData);
		const panal1ClassName = this.state.mode === 'main' ? '' : 'hide';
		const locationArr = location.pathname.split('/');
		const inChannel = locationArr[1] && locationArr[1] === 'channel';
		const channelType = (this.props.channelInfo) ? this.props.channelInfo.type : '';

		return (
			<div>
				{
					// this.state.mode === 'main' &&
					<LightBox
						option={ lightboxOption }
						onClose={ this.cancelNewActivityLightbox.bind(this) }
						clickOverlayToClose={ true }
						styleName="lightbox_root"
					>
						<div styleName="main-editor" className={ panal1ClassName }>
							<div styleName="header" className="clearfix">
								<div styleName="left">
									<TextField
										name="title"
										value={ this.state.title }
										placeHolder="標題"
										onChange={ this.setTitle.bind(this) }
										styleName="title_textfield"
										errorMessage={ this.state.errorMessageTitle }
										allowMultiLine
										height={ 150 }
									/>
								</div>
								<div styleName="right">
									{
										showPrivacy &&
										<PrivacySetting privacySetting={ this.state.privacySetting } setPrivacy={ this.setPrivacy.bind(this) } />
									}
								</div>
							</div>
							<hr styleName="hr" />
							<div styleName="editor_main">
								{
									<Editor
										// ref="editor"
										ref={ (_ref) => { this.editor = _ref; } }
										// editor={ (editor) => { this.editor = editor; } }
										readOnly={ false }
										placeholder="分享的內容…"
										mediaInfo={ mediaInfo }
										mentions={ this.mentions }
										apnum={ clientConfig.params.apnum }
										pid={ this.props.user.pid }
										content={ this.state.initContentString }
										onChange={ this.setContent.bind(this) }
									/>
								}
							</div>
							<Tag
								tagList={ this.state.tagList }
								activitySetTag={ this.setTag.bind(this) }
							/>
							{
								!inChannel &&
								<Endorse
									pid={ this.props.user.pid }
									contentString={ this.currentContent }
									endorsePreferences={ this.state.endorsePreferences }
									activitySetEndorse={ this.setEndorse.bind(this) }
									changeBtnStatus={ this.changeBtnStatus.bind(this) }
								/>
							}
							<hr styleName="hr" />
							{
								// 只有私人社團才出現
								channelType && channelType === 7 && locationArr[1] && locationArr[1] === 'group' &&
								<div styleName="remind">
									只有社團成員能看到文章內容。
									{ /* <a href="https://static.104.com.tw/bigc/c_wap/html/statute/" target="_blank" rel="noopener noreferrer">詳細內容</a> */ }
								</div>
							}
							<div styleName="btnRow">
								{
									this.props.itemData && !this.props.galleryMode &&
									<a href="javascript:;" onClick={ this.reSelectArticleTag.bind(this) } styleName="reselectArticleTag">重新選擇主題</a>
								}
								<SubmitButton
									onClick={ this.submit.bind(this) }
									isLoading={ this.state.isSubmit || !this.state.submitBtnStatus }
									dataGtmActivity={ '發佈文章' }
									buttonValue={ this.state.isEditor ? '確定' : '發佈' }
								/>
								{
									this.props.itemData &&
									<button className="ui normal button" onClick={ this.openDeleteLightBox.bind(this) }>刪除</button>
								}
								{
									this.state.errorMessageContent !== '' &&
									<span styleName="error_message">{this.state.errorMessageContent}</span>
								}
							</div>
						</div>
						{
							this.state.mode === 'articleTag' &&
							<div styleName="article-tag">
								<RadioGroup
									group={ this.preSelectArticleTags }
									name="radio"
									onSelected={ this.setRadioSelect.bind(this) }
									checkBox
									styleName="radioGroup"
								/>
								<div styleName="articleTagHint">最多三個主題</div>
								<div styleName="hr" />
								<div styleName="btnRow">
									<SubmitButton
										onClick={ this.submit.bind(this) }
										isLoading={ this.state.isSubmit || !this.state.submitBtnStatus }
										dataGtmActivity={ '選主題完成' }
										buttonValue={ '發佈' }
									/>
									<button className="ui normal button" onClick={ this.cancelNewActivityLightbox.bind(this) }>取消</button>
									{
										this.state.errorMessageArticleTags !== '' &&
										<span styleName="error_message">{this.state.errorMessageArticleTags}</span>
									}
								</div>
							</div>
						}
					</LightBox>
				}
				{
					this.state.confirmDeleteLightBox &&
					<LightBox option={ deleteLightboxOption } onClose={ this.cancelDeleteLightbox.bind(this) }>
						<div>請問確定要刪除此{ (this.props.galleryMode) ? '作品' : '文章' }?</div>
					</LightBox>
				}
				{
					this.state.confirmHasDataLeaveLightBox &&
					<LightBox option={ hasDataLeaveLightboxOption } onClose={ this.cancelHasDataLeaveLightBox.bind(this) }>
						<div>您尚未編輯完成，確定要放棄編輯?</div>
					</LightBox>
				}
			</div>
		);
	}
}

function showPrivacySetting(channelId, itemData) {
	if (typeof (channelId) !== 'undefined') { return false; }
    if (itemData !== null && typeof (itemData.channelId) === 'undefined') { return true; }
    if (itemData !== null && itemData.channelId !== null) {
		return false;
	}
	return true;
}

function mapStateToProps(state) {
	return {
		user: state.user,
		myFriendList: state.global.myFriendList
	};
}

ActivityEditor.propTypes = {
	galleryMode: PropTypes.bool,
};

ActivityEditor.defaultProps = {
	galleryMode: false,
};

const action = { createArticle, updateArticle, deleteArticle, createGallery, deleteGallery, updateGallery, showPlatformAlert };
export default compose(
	connect(mapStateToProps, action),
	// translate([]),
	[CSSModules, '_', css]
)(ActivityEditor);
