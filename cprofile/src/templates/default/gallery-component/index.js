import React, { Component, Fragment } from 'react';
import EditableText from 'components/editableText';
import DraftEditor from 'components/draft-md-editor';
import CropUploader from 'components/cropUploader';
import DndElement from 'components/dnd-element';
import Toolbar from 'containers/toolbar/element';
import FileViewer from 'containers/fileViewer';
import { Image } from 'share/styledComponents';
import defaultImg7 from 'components/defaultImage/default_7.jpg';
import defaultImg9 from 'components/defaultImage/default_9.jpg';
import defaultImg12 from 'components/defaultImage/default_12.jpg';
import defaultImg13 from 'components/defaultImage/default_13.jpg';
import defaultImg14 from 'components/defaultImage/default_14.jpg';
import defaultAudio from 'components/defaultSmallImage/defaultAudio.png';
import defaultDoc from 'components/defaultSmallImage/defaultDoc.png';
import { gallery as placeHolder } from 'config/placeholder';
import loremIpsum from 'lorem-ipsum';
import { isMobile } from 'react-device-detect';
import './style.scss';

class GalleryAch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			switchTransition: {
				fromTop: null,
				fromBottom: null,
				dndElementFromTopHeight: null,
				dndElementFromBottomHeight: null,
				position: 0,
				pending: false,
				loadingGalleryId: '',
				indexNumber: 0,
			},
		};
		this.sampleText = loremIpsum({ units: 'paragraphs' });
	}

	componentDidUpdate(prevProps, prevState) {
		const { position } = this.state.switchTransition;
		const { data } = this.props;

		if (prevProps.data[position].galleryId !== data[position].galleryId) {
			this.setState({
				switchTransition: {
					fromTop: null,
					fromBottom: null,
					dndElementFromTopHeight: null,
					dndElementFromBottomHeight: null,
					position: 0,
				},
			});
		}
	}

	// 圖片呈現
	_renderShowImage = (elm, index, defaultImg, width, height) => {
		const { pending, indexNumber = 0 } = this.state;
		const { templateType } = this.props.config;
		const noPictureClass = {
			new: ['gallery-no-picture gallery-no-picture--new'],
			def: ['gallery-no-picture gallery-no-picture--def'],
			dark: ['gallery-no-picture gallery-no-picture--dark'],
		};

		if (pending && indexNumber === index) {
			return (
				<div className="loading-preset" style={{ height: '250px' }}>
					<div className="loading" />
					<p className="handleText">檔案處理中</p>
				</div>
			);
		}

		if (!elm.fileUrlMap) {
			return <div className={`${noPictureClass[templateType]}`}>上傳檔案</div>;
		}

		return (
			<Image
				key={`gallery-${index}-fileId-${elm.fileId}-${Date.now()}`}
				src={this.newFileUrl(elm.fileUrlMap, 'newFileUrlMapW600') || defaultImg}
				onError={e => {
					e.target.src = defaultDoc;
				}}
				width={width}
				height={height}
			/>
		);
	};

	// 上傳檔案完取到的縮圖
	newFileUrl = (fileUrlMap, type, defaultImg) => {
		if (!fileUrlMap) return '';
		if (type === 'newOriFile' && fileUrlMap.origin) {
			return fileUrlMap.origin.toString();
		}
		if (
			type === 'newFileUrlMapW600' &&
			fileUrlMap.origin &&
			fileUrlMap['128k']
		) {
			return defaultAudio;
		}
		if (type === 'newFileUrlMapW600' && fileUrlMap.origin && fileUrlMap.w600) {
			return fileUrlMap.w600.toString();
		}
		return defaultImg;
	};

	getFileData = type => {
		this.setState({ pending: type.pending });
	};

	nowChangeLoadingFileId = (fileId, index) => {
		this.setState({
			loadingGalleryId: fileId,
			indexNumber: index,
		});
	};

	// 上傳檔案
	_renderCropUploader = (
		elm,
		index,
		editable,
		imageUpload,
		defaultImg,
		width,
		height
	) => {
		return (
			<CropUploader
				aspect={16 / 9}
				width={500}
				height={280}
				fileData={elm}
				fileId={elm.fileId}
				indexNumber={index}
				oriFile={this.newFileUrl(elm.fileUrlMap, 'newOriFile', defaultImg)}
				onBeforeProcessing={imageUpload.bind(this, {
					hook: 'onBeforeProcessing',
					meta: { index },
				})}
				onStartProcessing={imageUpload.bind(this, {
					hook: 'onStartProcessing',
					meta: { index },
				})}
				onFinishProcessing={imageUpload.bind(this, {
					hook: 'onFinishProcessing',
					meta: { index },
				})}
				editable={editable}
				buttonPosition="center"
				multiMediaAllow={true}
				convertType={elm.convertType}
				mediaType={
					elm.convertType && elm.convertType !== 'cover'
						? elm.convertType.toUpperCase()
						: 'IMAGE'
				}
				isGallery={true}
				getFileData={this.getFileData}
				componentType="gallery"
				pending={this.state.pending}
				nowChangeLoadingFileId={this.nowChangeLoadingFileId}
				defaultFileUpload={{
					blockType: 'gallery',
					image: elm.fileUrlMap,
				}}
			>
				{editable ? (
					this._renderShowImage(elm, index, defaultImg, width, height)
				) : (
					<FileViewer
						fileData={elm}
						fileUrl={elm.fileUrlMap && elm.fileUrlMap.origin}
						fileId={elm.fileId}
						mediaType={
							elm.convertType && elm.convertType !== 'cover'
								? elm.convertType.toUpperCase()
								: 'IMAGE'
						}
						isGallery={true}
					>
						{this._renderShowImage(elm, index, defaultImg, width, height)}
					</FileViewer>
				)}
			</CropUploader>
		);
	};

	// 作品名稱
	renderEditableText = (
		elm,
		feildOnChange,
		index,
		editable,
		propsClassName
	) => {
		const { blockType } = this.props.config;
		return (
			<EditableText
				text={elm.title}
				blockType={blockType}
				editableName="gallery"
				placeHolder={placeHolder.title}
				className={propsClassName}
				onUpdateData={feildOnChange.bind(this, index, [index, 'title'])}
				editable={editable}
				isRequired={true}
				convertType={elm.convertType}
			/>
		);
	};

	// 作品說明
	renderDraftEditor = (elm, feildOnChange, index, editable) => {
		return (
			<DraftEditor
				html={elm.description}
				md={elm.description}
				placeHolder={placeHolder.description}
				// showFirstUseSample={true}
				sampleText={this.sampleText}
				onUpdateContent={feildOnChange.bind(this, index, [
					index,
					'description',
				])}
				editable={editable}
				convertType={elm.convertType}
			/>
		);
	};

	// 第一個模板
	renderDefTemplate = (elm, index) => {
		const { meta } = this.props;
		const { feildOnChange, editable, imageUpload } = meta;
		const defaultDefImg =
			elm.convertType === 'audio'
				? defaultAudio
				: index % 3 === 0
				? defaultImg12
				: index % 3 === 1
				? defaultImg13
				: defaultImg14;

		return (
			<div
				className={
					editable ? 'gallery-def-main' : 'gallery-def-main gallery-preview'
				}
			>
				<div className="gallery-def-img">
					{this._renderCropUploader(
						elm,
						index,
						editable,
						imageUpload,
						defaultDefImg,
						278,
						156
					)}
				</div>
				{this.renderEditableText(
					elm,
					feildOnChange,
					index,
					editable,
					'gallery-def-title'
				)}
				<div className="gallery-def-description">
					{this.renderDraftEditor(elm, feildOnChange, index, editable)}
				</div>
			</div>
		);
	};

	// 第二個模板
	renderNewTemplate = (elm, index) => {
		const { meta } = this.props;
		const { feildOnChange, editable, imageUpload } = meta;
		const defaultNewImg =
			elm.convertType === 'audio'
				? defaultAudio
				: index % 3 === 0
				? defaultImg7
				: index % 3 === 1
				? defaultImg9
				: defaultImg13;

		return (
			<div
				className={
					editable ? 'gallery-new-main' : 'gallery-new-main gallery-preview'
				}
			>
				<div className="gallery-new-img">
					{this._renderCropUploader(
						elm,
						index,
						editable,
						imageUpload,
						defaultNewImg,
						500,
						280
					)}
				</div>
				<div className="gallery-new-content">
					{this.renderEditableText(
						elm,
						feildOnChange,
						index,
						editable,
						'gallery-new-title'
					)}
					<div className="gallery-new-bottom">
						{this.renderDraftEditor(elm, feildOnChange, index, editable)}
					</div>
				</div>
			</div>
		);
	};

	// 第三個模板
	renderDarkTemplate = (elm, index) => {
		const { meta } = this.props;
		const { feildOnChange, editable, imageUpload } = meta;
		const defaultDarkImg =
			elm.convertType === 'audio'
				? defaultAudio
				: index % 3 === 0
				? defaultImg7
				: index % 3 === 1
				? defaultImg9
				: defaultImg13;

		return (
			<div
				className={
					editable ? 'gallery-dark-main' : 'gallery-dark-main gallery-preview'
				}
			>
				<div className="gallery-dark-img">
					{this._renderCropUploader(
						elm,
						index,
						editable,
						imageUpload,
						defaultDarkImg,
						500,
						280
					)}
				</div>
				<div className="gallery-dark-content">
					{this.renderEditableText(
						elm,
						feildOnChange,
						index,
						editable,
						'gallery-dark-title'
					)}
					<div className="gallery-dark-bottom">
						{this.renderDraftEditor(elm, feildOnChange, index, editable)}
					</div>
				</div>
			</div>
		);
	};

	// 呈現模板
	_renderTemplate = (elm, index) => {
		const { templateType } = this.props.config;
		const template = {
			new: this.renderNewTemplate(elm, index),
			dark: this.renderDarkTemplate(elm, index),
			def: this.renderDefTemplate(elm, index),
		};
		return template[templateType] || template['def'];
	};

	// 單筆資料轉場效果
	changeSwitchTransition = (fromTop, fromBottom, index) => {
		this.setState({
			switchTransition: {
				fromTop: fromTop,
				fromBottom: fromBottom,
				dndElementFromTopHeight: document.getElementsByClassName(
					'gallery-displayFlex'
				)[fromTop].offsetHeight,
				dndElementFromBottomHeight: document.getElementsByClassName(
					'gallery-displayFlex'
				)[fromBottom].offsetHeight,
				position: index,
			},
		});
	};

	shouldComponentUpdate = (nextProps, nextState) => {
		if (nextProps.data === this.props.data) return false;
		return true;
	};

	render() {
		const { data, meta, config, commonMode } = this.props;
		const {
			fromTop,
			fromBottom,
			dndElementFromTopHeight,
			dndElementFromBottomHeight,
		} = this.state.switchTransition;
		const { blockType, uniKey, templateType } = config;
		const { editable } = meta;
		const dataLength = data.length;
		const elementClass = {
			new: 'gallery-new-main gallery-preview',
			dark: 'gallery-dark-main gallery-preview',
			def: 'gallery-def-main gallery-preview',
		};
		const dndElementClass = elementClass[templateType];
		return (
			<div className="gallery-container">
				{data.map((elm, index) => {
					const isUnSaved = /tmp-/.test(elm.galleryId);
					return editable ? (
						<DndElement
							{...{ blockType, uniKey, index }}
							{...elm}
							canDrag={true}
							key={elm.galleryId}
							dndElementClass={dndElementClass}
							fromTop={fromTop}
							fromBottom={fromBottom}
							dndElementFromTopHeight={dndElementFromTopHeight}
							dndElementFromBottomHeight={dndElementFromBottomHeight}
						>
							<Toolbar
								toolBarType="blockElem"
								key={`${uniKey}-${index}`}
								dataLength={dataLength}
								displayFlex={true}
								editable={editable}
								isUnSaved={isUnSaved}
								{...{ blockType, uniKey, elm, templateType }}
								index={index}
								changeSwitchTransition={this.changeSwitchTransition}
								commonMode={commonMode}
							>
								{elmDragPreview =>
									!isMobile
										? elmDragPreview(this._renderTemplate(elm, index))
										: this._renderTemplate(elm, index)
								}
							</Toolbar>
						</DndElement>
					) : (
						<Fragment key={elm.galleryId}>
							{this._renderTemplate(elm, index)}
						</Fragment>
					);
				})}
			</div>
		);
	}
}

export default {
	def: GalleryAch,
	new: GalleryAch,
	dark: GalleryAch,
};
