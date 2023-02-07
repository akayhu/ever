import React, { Component } from 'react';
import styled from 'styled-components';
import EditableText from 'components/editableText';
import DraftEditor from 'components/draft-md-editor';
import CropUploader from 'components/cropUploader';
import FileViewer from 'containers/fileViewer';
import defaultImg18 from 'components/defaultImage/default_18.jpg';
import defaultImg19 from 'components/defaultImage/default_19.jpg';
import defaultImg20 from 'components/defaultImage/default_20.jpg';
import { Image } from 'share/styledComponents';
import { custom as placeHolder } from 'config/placeholder';
import loremIpsum from 'lorem-ipsum';
import MobileBlockToolBar from 'components/mobileBlockToolBar';
import { BrowserView, MobileView } from 'react-device-detect';
import './style.scss';

const CustomDarkMain = styled.div`
	position: relative;
	border-radius: 8px;
	background: ${props => `url(${props.cover})`};
	min-height: 530px;
	width: 100%;
	text-align: center;
	background-position: center;
	background-size: cover;

	@media (max-width: 668px) {
		background-size: initial;
		overflow-y: auto;
	}
`;

const RenderBackgroundCropUploader = ({
	data,
	oriFile,
	editable,
	imageUpload,
	mask,
	uniKey,
	templateName,
	children,
}) => {
	return (
		<CropUploader
			uniKey={uniKey}
			aspect={16 / 9}
			width={956}
			height={534}
			fileId={data.fileId}
			oriFile={oriFile}
			editable={editable}
			onBeforeProcessing={imageUpload.bind(this, {
				hook: 'onBeforeProcessing',
			})}
			onStartProcessing={imageUpload.bind(this, {
				hook: 'onStartProcessing',
			})}
			onFinishProcessing={imageUpload.bind(this, {
				hook: 'onFinishProcessing',
			})}
			mask={true}
			templateType={templateName}
			maskAlpha={(mask && mask.getIn([templateName, 'maskAlpha'])) || 0}
			maskName={(mask && mask.getIn([templateName, 'maskName'])) || 'blackMask'}
		>
			{children}
		</CropUploader>
	);
};

class CustomAch extends Component {
	constructor(props) {
		super(props);
		this.sampleText = loremIpsum({ units: 'paragraphs' });
	}

	renderEditableText = cssName => {
		const { data, meta } = this.props;
		const { editable, feildOnChange } = meta;
		const { blockType } = this.props.config;
		return (
			<EditableText
				text={data.title}
				editableName="custom"
				placeHolder={placeHolder.title}
				blockType={blockType}
				className={cssName}
				onUpdateData={feildOnChange.bind(this, undefined, ['title'])}
				editable={editable}
				isRequired={true}
			/>
		);
	};

	renderDraftEditor = () => {
		const { data, meta } = this.props;
		const { editable, feildOnChange } = meta;
		return (
			<DraftEditor
				html={data.description}
				md={data.description}
				placeHolder={placeHolder.description}
				// showFirstUseSample={true}
				sampleText={this.sampleText}
				onUpdateContent={feildOnChange.bind(this, undefined, ['description'])}
				editable={editable}
			/>
		);
	};

	renderCropUploader = () => {
		const { data, meta } = this.props;
		const { editable, imageUpload } = meta;
		return (
			<CropUploader
				aspect={16 / 9}
				fileId={data.fileId}
				oriFile={(data.fileUrlMap && data.fileUrlMap.origin.toString()) || ''}
				onBeforeProcessing={imageUpload.bind(this, {
					hook: 'onBeforeProcessing',
				})}
				onStartProcessing={imageUpload.bind(this, {
					hook: 'onStartProcessing',
				})}
				onFinishProcessing={imageUpload.bind(this, {
					hook: 'onFinishProcessing',
				})}
				editable={editable}
				buttonPosition="center"
			>
				{editable ? (
					<Image
						src={
							(data.fileUrlMap && data.fileUrlMap.w600.toString()) ||
							defaultImg20
						}
						onError={e => {
							e.target.src = defaultImg20;
						}}
						width={520}
					/>
				) : (
					<FileViewer
						fileData={data}
						fileUrl={data.fileUrlMap && data.fileUrlMap.origin}
						fileId={data.fileId}
					>
						<Image
							src={(data.fileUrlMap && data.fileUrlMap.w600) || defaultImg20}
							onError={e => {
								e.target.src = defaultImg20;
							}}
							width={520}
						/>
					</FileViewer>
				)}
			</CropUploader>
		);
	};

	_customDefTemplate = () => {
		const { data, config, meta } = this.props;
		const { editable, isUnSaved } = meta;
		return (
			<div
				className={`${
					editable ? 'custom-def-main' : 'custom-def-main custom-preview'
				} ${isUnSaved ? 'unsave-hightlight' : ''}`}
				id={data.uniKey}
			>
				<BrowserView>{this.renderEditableText('custom-def-title')}</BrowserView>
				<MobileView>
					<div className="mobile-custom-def-title">
						<div>{this.renderEditableText('custom-def-title')}</div>
						{editable && (
							<div className="mobile-toolbar-custom-menu">
								<MobileBlockToolBar config={config} />
							</div>
						)}
					</div>
				</MobileView>
				<div>{this.renderDraftEditor()}</div>
			</div>
		);
	};

	_customNewTemplate = () => {
		const { data, config, meta } = this.props;
		const { editable, isUnSaved } = meta;
		return (
			<div
				className={`${
					editable ? 'custom-new-main' : 'custom-new-main custom-preview'
				} ${isUnSaved ? 'unsave-hightlight' : ''}`}
				id={data.uniKey}
			>
				<BrowserView>{this.renderEditableText('custom-new-title')}</BrowserView>
				<MobileView>
					<div className="mobile-custom-new-title">
						<div>{this.renderEditableText('custom-new-title')}</div>
						{editable && (
							<div className="mobile-toolbar-custom-menu">
								<MobileBlockToolBar config={config} />
							</div>
						)}
					</div>
				</MobileView>
				<div className="custom-new-content">
					<div className="custom-new-left">
						<div>{this.renderDraftEditor()}</div>
					</div>
					<div className="custom-new-right">{this.renderCropUploader()}</div>
				</div>
			</div>
		);
	};

	_customNewContraryTemplate = () => {
		const { data, config, meta } = this.props;
		const { editable, isUnSaved } = meta;
		return (
			<div
				className={`${
					editable
						? 'custom-new-contrary-main'
						: 'custom-new-contrary-main custom-preview'
				} ${isUnSaved ? 'unsave-hightlight' : ''}`}
				id={data.uniKey}
			>
				<BrowserView>
					{this.renderEditableText('custom-new-contrary-title')}
				</BrowserView>
				<MobileView>
					<div className="mobile-custom-contrary-title">
						<div>{this.renderEditableText('custom-new-contrary-title')}</div>
						{editable && (
							<div className="mobile-toolbar-custom-menu">
								<MobileBlockToolBar config={config} />
							</div>
						)}
					</div>
				</MobileView>
				<div className="custom-new-contrary-content">
					<div className="custom-new-contrary-left">
						<div>{this.renderCropUploader()}</div>
					</div>
					<div className="custom-new-contrary-right">
						{this.renderDraftEditor()}
					</div>
				</div>
			</div>
		);
	};

	_customDarkTemplate = () => {
		const { data, config, meta } = this.props;
		const { uniKey, mask } = config;
		const { editable, isUnSaved, imageUpload } = meta;
		return (
			<div className="custom-dark-main">
				<RenderBackgroundCropUploader
					data={data}
					editable={editable}
					imageUpload={imageUpload}
					mask={mask}
					uniKey={uniKey}
					oriFile={(data.fileUrlMap && data.fileUrlMap.origin.toString()) || ''}
					templateName="customDark"
				>
					<CustomDarkMain
						cover={
							(data.fileUrlMap && data.fileUrlMap.w600.toString()) ||
							defaultImg18
						}
						className={isUnSaved ? 'unsave-hightlight' : ''}
					>
						<div className="custom-dark-content">
							<BrowserView>
								{this.renderEditableText('custom-dark-title')}
							</BrowserView>
							<MobileView>
								<div className="mobile-custom-dark-title">
									<div>{this.renderEditableText('custom-dark-title')}</div>
									{editable && (
										<div className="mobile-toolbar-custom-menu">
											<MobileBlockToolBar config={this.props.config} />
										</div>
									)}
								</div>
							</MobileView>
							<div>{this.renderDraftEditor()}</div>
						</div>
					</CustomDarkMain>
				</RenderBackgroundCropUploader>
			</div>
		);
	};

	_customPaiTemplate = () => {
		const { data, config, meta } = this.props;
		const { uniKey, mask } = config;
		const { editable, isUnSaved, imageUpload } = meta;
		return (
			<div className="custom-pai-main">
				<RenderBackgroundCropUploader
					data={data}
					editable={editable}
					imageUpload={imageUpload}
					mask={mask}
					uniKey={uniKey}
					oriFile={(data.fileUrlMap && data.fileUrlMap.origin.toString()) || ''}
					templateName="customPai"
				>
					<CustomDarkMain
						cover={
							(data.fileUrlMap && data.fileUrlMap.w600.toString()) ||
							defaultImg19
						}
						className={isUnSaved ? 'unsave-hightlight' : ''}
					>
						<div className="custom-pai-content">
							<BrowserView>
								{this.renderEditableText('custom-pai-title')}
							</BrowserView>
							<MobileView>
								<div className="mobile-custom-pai-title">
									<div>{this.renderEditableText('custom-pai-title')}</div>
									{editable && (
										<div className="mobile-toolbar-custom-menu">
											<MobileBlockToolBar config={config} />
										</div>
									)}
								</div>
							</MobileView>
							<div>{this.renderDraftEditor()}</div>
						</div>
					</CustomDarkMain>
				</RenderBackgroundCropUploader>
			</div>
		);
	};

	render() {
		const { templateType } = this.props.config;
		const template = {
			def: this._customDefTemplate(),
			new: this._customNewTemplate(),
			newContrary: this._customNewContraryTemplate(),
			dark: this._customDarkTemplate(),
			pai: this._customPaiTemplate(),
		};
		return template[templateType] || template['def'];
	}
}

export default {
	def: CustomAch,
	new: CustomAch,
	newContrary: CustomAch,
	dark: CustomAch,
	pai: CustomAch,
};
