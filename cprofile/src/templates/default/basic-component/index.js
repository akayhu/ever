import React, { Component } from 'react';
import EditableText from 'components/editableText';
import DraftEditor from 'components/draft-md-editor';
import defaultCover from './coverDefault.png';
import CropUploader from 'components/cropUploader';
import styled from 'styled-components';
import { Image } from 'share/styledComponents';
import avatarDef from './man.png';
import avatarDark from './avatarDark.png';
import avatarCom from './avatarCom.png';
import ACInput from 'components/autoComplete';
// import { basic as sample }  from 'config/sample';
import { basic as placeHolder } from 'config/placeholder';
import loremIpsum from 'lorem-ipsum';
import './style.scss';

const Dash = styled.span`
	display: block;
	font-size: 40px;
	line-height: 0.7;
`;

const FullCover = styled.div`
	position: relative;
	background-image: ${props => `url(${props.cover})`};
	background-position: center;
	background-size: cover;
	margin: 0 auto;

	&::before {
		content: ' ';
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute;
	}

	@media only screen and (max-width: 414px) {
		background-position: top;
		background-repeat: no-repeat;
		background-size: auto 200px;
	}
`;

const IconContent = styled.div`
	position: relative;
`;

const Avatar = Image.extend`
	border-radius: 50%;
`;

const AvatarCom = Image.extend`
	border-radius: 8px;
	object-fit: cover;
	object-position: 30%;
`;

// 大頭圖
const RenderCropUploader = ({
	width,
	height,
	cssName = '',
	data,
	meta,
	children,
}) => {
	const { avatarFileUrls, avatarFileId } = data;
	const { editable, imageUpload } = meta;
	return (
		<CropUploader
			aspect={1}
			width={width}
			height={height}
			fileId={avatarFileId}
			oriFile={(avatarFileUrls && avatarFileUrls.origin.toString()) || ''}
			onBeforeProcessing={imageUpload.bind(this, {
				hook: 'onBeforeProcessing',
				meta: {
					urlModelName: 'avatarFileUrls',
					coordinateModelName: 'avatarCoordinate',
				},
			})}
			onStartProcessing={imageUpload.bind(this, {
				hook: 'onStartProcessing',
				meta: { idModelName: 'avatarFileId' },
			})}
			onFinishProcessing={imageUpload.bind(this, {
				hook: 'onFinishProcessing',
				meta: { urlModelName: 'avatarFileUrls' },
			})}
			convertType="avatar"
			editable={editable}
			buttonPosition="center"
			className={cssName}
		>
			{children}
		</CropUploader>
	);
};

class UserAch extends Component {
	constructor(props) {
		super(props);
		this.sampleText = loremIpsum({ units: 'paragraphs' });
	}

	// 個人介紹
	renderDraftEditor = () => {
		const { data, meta, config } = this.props;
		const { blockType } = config;
		const { introduction } = data;
		const { editable, feildOnChange } = meta;
		return (
			<DraftEditor
				blockType={blockType}
				drafEditorName="introduction"
				html={introduction}
				placeHolder={placeHolder.introduction}
				showFirstUseSample={true}
				sampleText={this.sampleText}
				onUpdateContent={feildOnChange.bind(this, undefined, ['introduction'])}
				editable={editable}
			/>
		);
	};

	// 姓名、地址
	renderEditableText = (text, cssName) => {
		const { data, meta, config } = this.props;
		const { userName, location } = data;
		const { blockType } = config;
		const { editable, feildOnChange } = meta;
		return (
			<EditableText
				text={text === 'userName' ? userName : location}
				blockType={blockType}
				editableName={text}
				placeHolder={
					text === 'userName' ? placeHolder.userName : placeHolder.location
				}
				className={`${cssName} _lr-hide`}
				onUpdateData={
					text === 'userName'
						? feildOnChange.bind(this, undefined, ['userName'])
						: feildOnChange.bind(this, undefined, ['location'])
				}
				editable={editable}
			/>
		);
	};

	// 公司名稱、職業名稱
	renderACInput = (autoCompleteName, cssName, wrapperCssName = '') => {
		const { data, meta, config } = this.props;
		const { organization, title } = data;
		const { blockType } = config;
		const { editable, feildOnChange } = meta;
		return (
			<ACInput
				blockType={blockType}
				value={autoCompleteName === 'companyName' ? organization : title}
				placeHolder={
					autoCompleteName === 'companyName'
						? placeHolder.organization
						: placeHolder.title
				}
				onUpdateData={
					autoCompleteName === 'companyName'
						? feildOnChange.bind(this, undefined, ['organization'])
						: feildOnChange.bind(this, undefined, ['title'])
				}
				autoCompleteName={
					autoCompleteName === 'companyName' ? 'companyName' : 'jobTitle'
				}
				editable={editable}
				inputClassName={cssName}
				wrapperClassName={wrapperCssName}
			/>
		);
	};

	// 第一個模板
	_userDefTemplate = () => {
		const { data, meta, config } = this.props;
		if (!data) return null;
		const { mask, uniKey } = config;
		const { editable, imageUpload } = meta;
		const { avatarFileUrls, coverFileUrls, coverFileId } = data;

		return (
			<CropUploader
				uniKey={uniKey}
				aspect={16 / 5}
				fileId={coverFileId}
				oriFile={(coverFileUrls && coverFileUrls.origin.toString()) || ''}
				editable={editable}
				onBeforeProcessing={imageUpload.bind(this, {
					hook: 'onBeforeProcessing',
					meta: {
						urlModelName: 'coverFileUrls',
						coordinateModelName: 'coverCoordinate',
					},
				})}
				onStartProcessing={imageUpload.bind(this, {
					hook: 'onStartProcessing',
					meta: { idModelName: 'coverFileId' },
				})}
				onFinishProcessing={imageUpload.bind(this, {
					hook: 'onFinishProcessing',
					meta: { urlModelName: 'coverFileUrls' },
				})}
				mask={true}
				templateType="def"
				maskAlpha={(mask && mask.getIn(['def', 'maskAlpha'])) || 0}
				maskName={(mask && mask.getIn(['def', 'maskName'])) || 'blackMask'}
			>
				<FullCover
					cover={
						(coverFileUrls &&
							(coverFileUrls.w1920 ||
								coverFileUrls.w960 ||
								coverFileUrls.w600)) ||
						defaultCover
					}
				>
					<section className="user-container" id="profile_basicblock_div">
						<div className="user-block-mid">
							<div className="user-image-wrapper">
								<RenderCropUploader
									width={155}
									height={155}
									data={data}
									meta={meta}
									cssName="black-avatar"
								>
									<Image
										src={
											(avatarFileUrls &&
												(avatarFileUrls.avatarWeb || avatarFileUrls.w600)) ||
											avatarDef
										}
										onError={e => {
											e.target.src = avatarDef;
										}}
										width={155}
										height={155}
									/>
								</RenderCropUploader>
							</div>
						</div>
						<div className="user-block-mid">
							{this.renderEditableText(
								'userName',
								'text-title name',
								'userName'
							)}
							{this.renderACInput(
								'companyName',
								'user-def-company-icon-domain'
							)}
							<Dash>-</Dash>
							{this.renderACInput('jobTitle', 'user-def-jobTitle__input')}
							<div className="user-def-summary">{this.renderDraftEditor()}</div>
						</div>
					</section>
				</FullCover>
			</CropUploader>
		);
	};

	// 第二個模板
	_userNewTemplate = () => {
		const { data, meta } = this.props;
		if (!data) return null;
		const { editable } = meta;
		const { avatarFileUrls, location, organization } = data;
		return (
			<div
				className={
					editable ? 'user-new-container' : 'user-new-container user-preview'
				}
				id="profile_basicblock_div"
			>
				<div className="user-new-left">
					<RenderCropUploader
						width={287}
						height={287}
						data={this.props.data}
						meta={this.props.meta}
					>
						<Avatar
							src={
								(avatarFileUrls &&
									(avatarFileUrls.avatarWeb || avatarFileUrls.w600)) ||
								avatarDef
							}
							onError={e => {
								e.target.src = avatarDef;
							}}
							width={287}
							height={287}
						/>
					</RenderCropUploader>
				</div>
				<div className="user-new-right">
					{this.renderEditableText('userName', 'user-new-title')}
					<div className="user-new-jobTitle">
						{this.renderACInput('jobTitle', 'user-new-jobTitle__input')}
					</div>
					<div className="user-new-summary">{this.renderDraftEditor()}</div>
					<IconContent>
						{organization && <i className="icon-icon_company" />}
						{this.renderACInput('companyName', 'user-new-company')}
					</IconContent>
					{location && <i className="icon-icon-card_travel" />}
					{this.renderEditableText('location', 'user-new-location')}
				</div>
			</div>
		);
	};

	// 第三個模板
	_userComTemplate = () => {
		const { data, meta } = this.props;
		if (!data) return null;
		const { editable } = meta;
		const { avatarFileUrls, location, organization } = data;
		return (
			<div
				className={
					editable ? 'user-com-container' : 'user-com-container user-preview'
				}
				id="profile_basicblock_div"
			>
				<div className="user-com-left">
					<RenderCropUploader width={300} height={300} data={data} meta={meta}>
						<AvatarCom
							src={
								(avatarFileUrls &&
									(avatarFileUrls.avatarWeb || avatarFileUrls.w600)) ||
								avatarCom
							}
							onError={e => {
								e.target.src = avatarDef;
							}}
							width={300}
							height={300}
						/>
					</RenderCropUploader>
				</div>
				<div className="user-com-right">
					<div className="user-com-jobTitle">
						{this.renderACInput(
							'jobTitle',
							'user-com-jobTitle__input',
							'com-jobTitle'
						)}
					</div>
					{this.renderEditableText('userName', 'user-com-title')}
					<div className="user-com-summary">{this.renderDraftEditor()}</div>
					<IconContent>
						{organization && <i className="icon-icon_company" />}
						{this.renderACInput('companyName', 'user-com-company')}
					</IconContent>
					{location && <i className="icon-icon-card_travel" />}
					{this.renderEditableText('location', 'user-com-location')}
				</div>
			</div>
		);
	};

	// 第四個模板
	_userDarkTemplate = () => {
		const { data, meta } = this.props;
		if (!data) return null;
		const { editable } = meta;
		const { avatarFileUrls, location, organization } = data;
		return (
			<div className="user-dark-block" id="profile_basicblock_div">
				<div
					className={
						editable
							? 'user-dark-container'
							: 'user-dark-container user-preview'
					}
				>
					<div className="user-dark-left">
						<div className="user-dark-jobTitle">
							{this.renderACInput('jobTitle', 'user-dark-jobTitle__input')}
						</div>
						{this.renderEditableText('userName', 'user-dark-title')}
						<div className="user-dark-summary">{this.renderDraftEditor()}</div>
						<IconContent>
							{organization && <i className="icon-icon_company" />}
							{this.renderACInput('companyName', 'user-dark-company')}
						</IconContent>
						{location && <i className="icon-icon-card_travel" />}
						{this.renderEditableText('location', 'user-dark-location')}
					</div>
					<div className="user-dark-right">
						<RenderCropUploader
							width={300}
							height={300}
							data={data}
							meta={meta}
						>
							<Image
								src={
									(avatarFileUrls &&
										(avatarFileUrls.avatarWeb || avatarFileUrls.w600)) ||
									avatarDark
								}
								onError={e => {
									e.target.src = avatarDark;
								}}
								width={300}
								height={300}
							/>
						</RenderCropUploader>
					</div>
				</div>
			</div>
		);
	};

	render() {
		const { templateType } = this.props.config;
		const template = {
			new: this._userNewTemplate(),
			com: this._userComTemplate(),
			dark: this._userDarkTemplate(),
			def: this._userDefTemplate(),
		};
		return template[templateType] || template['def'];
	}
}

export default {
	def: UserAch,
	new: UserAch,
	com: UserAch,
	dark: UserAch,
};
