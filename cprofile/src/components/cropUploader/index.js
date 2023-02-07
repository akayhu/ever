import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAtomicType } from '../fileUploader/fileUpload.js';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import FontIcon from 'material-ui/FontIcon';
import getCroppedImg from './getCroppedImg';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadCroppedImage } from 'actions/document';
import { updateCard } from 'actions/ui/card';
import { Tabs, Tooltip, Slider, Row, Col, Popover } from 'antd';
import blackImg from 'components/defaultSmallImage/black.png';
import whiteImg from 'components/defaultSmallImage/white.png';
import gradationBlackImg from 'components/defaultSmallImage/gradation_black.png';
import gradationWhiteImg from 'components/defaultSmallImage/gradation_white.png';
import {
	CropImgMask,
	ModalTitle,
	ModalButton,
	Loading,
} from 'share/styledComponents';
import { saveMask } from 'actions/ui/card';
import persistState from 'localStorage';
import { isMobile } from 'react-device-detect';
import { tagsMap, mediaTypeMap } from 'config/document';
import MediaPlayer from 'components/mediaPlayer';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import { TriggerButton, UploadPane, LoadingWrapper } from './styledComponents';
import './style.scss';

const TabPane = Tabs.TabPane;

const fileUrlMapConvertMap = (fileId, mediaInfo, isGallery, uploading) => {
	const page = mediaInfo.convertType === 'document' ? -1 : '';

	if (uploading) {
		return (
			<div className="loading-preset">
				<div className="loading" />
				<p className="handleText">檔案處理中</p>
			</div>
		);
	}

	return (
		<MediaPlayer
			fileId={fileId || ''}
			mediaType={mediaInfo.mediaType || 'IMAGE'}
			convertType={mediaInfo.convertType || 'cover'}
			meta={{}}
			page={page}
			isGallery={isGallery}
		/>
	);
};

class CropUploader extends Component {
	static propTypes = {
		aspect: PropTypes.number.isRequired,
		width: PropTypes.number,
		height: PropTypes.number,
		fileId: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf([null, undefined]),
		]),
		oriFile: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf([null, undefined]),
		]),
		editable: PropTypes.bool.isRequired,
		buttonPosition: PropTypes.string,
		onBeforeProcessing: PropTypes.func,
		onStartProcessing: PropTypes.func,
		onFinishProcessing: PropTypes.func,
		maskName: PropTypes.string,
		maskAlpha: PropTypes.number,
		templateType: PropTypes.string,
		multiMediaAllow: PropTypes.bool.isRequired,
		mediaType: PropTypes.oneOf(Object.keys(mediaTypeMap)).isRequired,
		customProp: ({ mediaType, convertType }, propName, componentName) => {
			if (propName === 'convertType') {
				const convertTypeMap = tagsMap[mediaType];
				if (!convertTypeMap || !convertTypeMap.hasOwnProperty(convertType))
					throw new Error(`
					Invalid prop convertType supplied to ${componentName}.
				`);
			}
		},
	};

	static defaultProps = {
		maskName: 'blackMask',
		maskAlpha: 0,
		editable: false,
		oriFile: null,
		fileId: null,
		multiMediaAllow: false,
		mediaType: 'IMAGE',
		convertType: 'cover',
		templateType: 'def',
		isGallery: false,
	};

	constructor(props) {
		super(props);
		this.state = {
			oriFile: props.oriFile,
			fileId: props.fileId,
			mediaInfo: {
				mediaType: props.mediaType,
				convertType: props.convertType,
			},
			cropping: false,
			crop: {},
			open: false,
			activeKey: '1',
			editWrapperHoverDisplay: false,
			maskName: props.maskName,
			maskAlpha: props.maskAlpha,
			loading: false,
			uploading: false,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.oriFile !== prevState.oriFile && !prevState.open) {
			return {
				...prevState,
				oriFile: nextProps.oriFile,
				fileId: nextProps.fileId,
			};
		}

		if (
			(nextProps.maskName !== prevState.maskName ||
				nextProps.maskAlpha !== prevState.maskAlpha) &&
			!prevState.editWrapperHoverDisplay
		) {
			return {
				...prevState,
				maskName: nextProps.maskName,
				maskAlpha: nextProps.maskAlpha,
			};
		}

		return null;
	}

	open = () => {
		const { fileId, uploading } = this.state;
		let crop = this.state.crop || {};

		if (fileId) {
			const previousCrop = persistState.loadState(['crop', fileId]);
			if (previousCrop && !uploading) {
				crop = previousCrop;
			}
		}
		//TODO
		this.setState(state => ({
			open: true,
			activeKey: state.fileId ? '2' : '1', // 有上傳過圖片，自動切到調整圖片
			crop, // 讀取上次儲存的座標
			loading: state.fileId ? true : false,
		}));
	};

	openFile = () => {
		this.refs.fileInput.click();
	};

	fileInputSetState = (f, e2, AtomicType) => {
		this.setState({
			f: f,
			oriFile: e2.target.result,
			fileId: null,
			crop: {},
			cropping: false,
			activeKey: '2',
			mediaInfo: {
				mediaType: AtomicType,
				convertType:
					AtomicType !== 'IMAGE' ? AtomicType.toLowerCase() : 'cover',
			},
			uploading: AtomicType !== 'IMAGE' ? true : false,
			loading: AtomicType !== 'IMAGE' ? true : false,
		});
	};

	handleFileInput = e => {
		const files = Array.prototype.slice.call(e.target.files, 0);
		const {
			multiMediaAllow,
			nowChangeLoadingFileId,
			fileId,
			indexNumber,
			pushSystemMessage,
		} = this.props;
		this.setState({ loading: true });

		files.forEach(f => {
			let AtomicType = getAtomicType(f.type);
			if (AtomicType) {
				if (multiMediaAllow && AtomicType !== 'IMAGE') {
					const reader = new FileReader();
					reader.readAsDataURL(f);
					reader.onload = e2 => {
						this.handleFileUploadOnly(
							f,
							{},
							AtomicType,
							AtomicType.toLowerCase()
						);
						setTimeout(() => {
							this.fileInputSetState(f, e2, AtomicType);
						}, 500);
					};
				} else if (AtomicType === 'IMAGE') {
					const reader = new FileReader();
					reader.readAsDataURL(f);
					reader.onload = e2 => {
						this.fileInputSetState(f, e2, AtomicType);
					};
				} else {
					pushSystemMessage(
						`不支援的檔案格式 ${AtomicType} 請再重新上傳!`,
						'error'
					);
					return false;
				}
			}
		});

		if (nowChangeLoadingFileId) {
			nowChangeLoadingFileId(fileId, indexNumber);
		}
	};

	completeCrop = obj => {};

	onComplete = (crop, pixelCrop) => {
		this.pixelCrop = pixelCrop;
		this.setState({ crop });
	};

	onChange = crop => {
		this.setState({ crop });
	};

	onImageLoaded = image => {
		const crop = makeAspectCrop(
			{
				x: this.state.crop.x || 0,
				y: this.state.crop.y || 0,
				aspect: this.props.aspect,
				width: this.state.crop.width || 50,
			},
			image.naturalWidth / image.naturalHeight
		);

		this.setState({ crop, image, loading: false }, () => {
			const pixelCrop = {
				x: Math.round(image.naturalWidth * (crop.x / 100)),
				y: Math.round(image.naturalHeight * (crop.y / 100)),
				width: Math.round(image.naturalWidth * (crop.width / 100)),
				height: Math.round(image.naturalHeight * (crop.height / 100)),
			};
			this.onComplete(crop, pixelCrop);
		});
	};

	onFinishProcessing = ({ fileId, fileUrlMap, coordinate }) => {
		// 更新 or 新增 crop 物件到 localStorage
		persistState.saveState(['crop', fileId], this.state.crop);
		this.setState(
			{
				uploading: false,
				fileId,
				oriFile: fileUrlMap.origin[0],
			},
			() => {
				// hook: 完成所有上傳程序並提供 fileId & file URI
				if (typeof this.props.onFinishProcessing === 'function') {
					this.props.onFinishProcessing({ fileId, fileUrlMap, coordinate });
				}
			}
		);
	};

	onBeforeForDoc = ({ fileId, fileUrlMap, coordinate }) => {
		// hook: 完成所有上傳程序並提供 fileId & file URI
		// hook: 提供 data URI & 座標
		this.props.onBeforeProcessing({
			fileId: fileId,
			fileUrlMap,
			coordinate,
		});
	};

	onFinishForDoc = ({
		fileId,
		fileUrlMap,
		coordinate,
		convertType,
		mediaType,
	}) => {
		// 更新 or 新增 crop 物件到 localStorage
		persistState.saveState(['crop', fileId], this.state.crop);
		this.setState(
			{
				// open: false,
				uploading: false,
				fileId,
				oriFile: fileUrlMap.origin[0],
				mediaInfo: {
					mediaType: mediaType,
					convertType: convertType,
				},
			},
			() => {
				if (typeof this.props.onFinishProcessing === 'function') {
					this.props.onFinishProcessing({ fileId, fileUrlMap, coordinate });
				}
			}
		);
	};

	handleFileUploadOnly = (f, coordinate, mediaType, convertType) => {
		const {
			uploadCroppedImage,
			onStartProcessing,
			componentType,
			getFileData,
		} = this.props;
		// 上傳 & 更新 fileId
		uploadCroppedImage(f, {
			contentType: f && f.type,
			fileName: f && f.name,
			fileId: null,
			coordinate,
			mediaType,
			convertType,
			componentType: componentType || '',
			getFileData: getFileData || '', // 作品集判斷是否正在轉擋中用
			onBeforeProcessing: this.onBeforeForDoc,
			onStartProcessing: onStartProcessing, //fileID 從這丟
			onFinishProcessing: this.onFinishForDoc,
		});
	};

	handleSubmit = e => {
		const { image, f, loading, uploading, mediaInfo, crop } = this.state;
		if (loading || uploading) return;
		const {
			fileId,
			componentType,
			getFileData,
			onStartProcessing,
			onBeforeProcessing,
			uploadCroppedImage,
		} = this.props;
		const { convertType, mediaType } = mediaInfo;
		const convertTypeMap = tagsMap[mediaType] || {};
		const dataURI = getCroppedImg(image, this.pixelCrop, '123');
		const coordinate = {
			ltx: this.pixelCrop.x,
			lty: this.pixelCrop.y,
			rbx: this.pixelCrop.x + this.pixelCrop.width,
			rby: this.pixelCrop.y + this.pixelCrop.height,
		};

		let fileUrlMap = (convertTypeMap[convertType] || []).reduce(
			(map, tag) => ({ ...map, [tag]: dataURI }),
			{}
		);

		// hook: 提供 data URI & 座標
		onBeforeProcessing({
			fileId: fileId,
			fileUrlMap,
			coordinate,
		});

		// 上傳 & 更新 fileId
		uploadCroppedImage(f, {
			contentType: f && f.type,
			fileName: f && f.name,
			fileId: this.state.fileId,
			coordinate,
			mediaType,
			convertType,
			componentType: componentType || '',
			getFileData: getFileData || '', // 作品集判斷是否正在轉擋中用
			onStartProcessing: onStartProcessing,
			onFinishProcessing: this.onFinishProcessing,
		});

		// 調整圖片的話，更新 crop 物件到 localStorage
		if (this.state.fileId) {
			persistState.saveState(['crop', this.state.fileId], crop);
		}

		this.setState({ uploading: true, loading: true, open: false });
	};

	handleCancel = () => {
		this.pixelCrop = undefined;
		this.setState({
			cropping: false,
			open: false,
			activeKey: '1',
		});
	};

	onTabClick = value => this.setState({ activeKey: value });

	onSliderChange = value => {
		this.setState({ maskAlpha: value });
	};

	handleMaskChange = value => {
		this.setState({ maskName: value });
	};

	handleMaskSubmit = () => {
		this.props.saveMask(
			this.props.uniKey,
			this.props.templateType,
			this.state.maskName,
			this.state.maskAlpha
		);
		this.maskContent();
	};

	formatter = value => {
		return `${value}%`;
	};

	maskContent = () => {
		this.setState({
			editWrapperHoverDisplay: !this.state.editWrapperHoverDisplay,
		});
	};

	// 調整透明度
	transparency = () => {
		const { editWrapperHoverDisplay, maskAlpha, maskName } = this.state;

		return (
			<Popover
				placement="topRight"
				content={
					<Fragment>
						<div className="crop_mask_menu">
							<div
								onClick={() => this.handleMaskChange('blackMask')}
								className={
									maskName === 'blackMask'
										? 'crop_mask_focus'
										: 'crop_mask_on_focus'
								}
							>
								<img src={blackImg} alt="black" width="30" height="30" />
							</div>
							<div
								onClick={() => this.handleMaskChange('whiteMask')}
								className={
									maskName === 'whiteMask'
										? 'crop_mask_focus'
										: 'crop_mask_on_focus'
								}
							>
								<img src={whiteImg} alt="black" width="30" height="30" />
							</div>
							<div
								onClick={() => this.handleMaskChange('blackGradientMask')}
								className={
									maskName === 'blackGradientMask'
										? 'crop_mask_focus'
										: 'crop_mask_on_focus'
								}
							>
								<img
									src={gradationBlackImg}
									alt="black"
									width="30"
									height="30"
								/>
							</div>
							<div
								onClick={() => this.handleMaskChange('WhiteGradientMask')}
								className={
									maskName === 'WhiteGradientMask'
										? 'crop_mask_focus'
										: 'crop_mask_on_focus'
								}
							>
								<img
									src={gradationWhiteImg}
									alt="black"
									width="30"
									height="30"
								/>
							</div>
						</div>
						<div>
							<Row>
								<Col span={33}>
									<Slider
										min={0}
										max={100}
										onChange={this.onSliderChange}
										value={maskAlpha || 0}
										step={1}
										tipFormatter={this.formatter}
									/>
								</Col>
							</Row>
						</div>
						<div className="submit-div">
							<ModalButton onClick={this.handleMaskSubmit}>
								儲存變更
							</ModalButton>
						</div>
					</Fragment>
				}
				title="調整透明度"
				trigger="click"
				onVisibleChange={this.maskContent}
				visible={editWrapperHoverDisplay}
			>
				<Tooltip placement="bottom" title="調整透明度">
					<span className="icon-overlay_icon">
						<span className="path1" />
						<span className="path2" />
					</span>
				</Tooltip>
			</Popover>
		);
	};

	// 變更檔案
	changeFile = () => {
		const { buttonPosition, mask, componentType } = this.props;
		const { editWrapperHoverDisplay } = this.state;

		return (
			<div
				className={
					!editWrapperHoverDisplay
						? 'crop-icon'
						: 'crop-icon force-display-block'
				}
			>
				<TriggerButton buttonPosition={buttonPosition} isMask={mask}>
					<Tooltip
						placement="bottom"
						title={
							componentType && componentType === 'gallery'
								? '變更檔案'
								: '變更圖片'
						}
					>
						<i className="icon-crop_icon" onClick={this.open} />
					</Tooltip>
					{mask && !isMobile && this.transparency()}
				</TriggerButton>
			</div>
		);
	};

	// 上傳圖片
	uploadImage = () => {
		const { loading, uploading, oriFile } = this.state;
		return (
			<Fragment>
				<div className="crop-wrapper">
					{loading && (
						<LoadingWrapper>
							<h4>{uploading ? '上傳中 ...' : '讀取中 ...'}</h4>
							<Loading />
						</LoadingWrapper>
					)}
					<ReactCrop
						src={oriFile || ''}
						crop={this.state.crop}
						onImageLoaded={this.onImageLoaded}
						onComplete={this.onComplete}
						onChange={this.onChange}
						imageStyle={{ maxHeight: '60vh' }}
						style={loading ? { display: 'none' } : {}}
						keepSelection={true}
						crossorigin="anonymous"
					/>
				</div>
				{!loading && (
					<div className="submit-div">
						<ModalButton onClick={this.handleSubmit}>儲存</ModalButton>
					</div>
				)}
			</Fragment>
		);
	};

	// 上傳檔案
	uploadFile = () => {
		const { componentType, isGallery } = this.props;
		const { uploading, oriFile, mediaInfo, fileId } = this.state;

		return (
			<div className="modal-upload tag-position">
				<ModalTitle>
					{componentType && componentType === 'gallery' ? '檔案' : '圖像'}
				</ModalTitle>
				<Tabs
					activeKey={this.state.activeKey}
					onTabClick={this.onTabClick}
					defaultActiveKey="1"
					size="large"
				>
					<TabPane
						tab={
							componentType && componentType === 'gallery'
								? '上傳檔案'
								: '上傳圖片'
						}
						key="1"
						disabled={uploading}
					>
						<UploadPane>
							<ModalButton onClick={this.openFile}>選擇檔案</ModalButton>
						</UploadPane>
					</TabPane>
					<TabPane
						tab={
							componentType && componentType === 'gallery'
								? '檔案預覽'
								: '圖片預覽'
						}
						key="2"
						disabled={!oriFile}
					>
						{mediaInfo.mediaType === 'IMAGE' && this.uploadImage()}
						{mediaInfo.convertType !== 'cover' &&
							mediaInfo.mediaType !== 'IMAGE' &&
							fileUrlMapConvertMap(fileId, mediaInfo, isGallery, uploading)}
					</TabPane>
				</Tabs>
				<FontIcon
					className={`icon-icon_cancel`}
					style={{
						position: 'absolute',
						top: '20px',
						right: '20px',
						cursor: 'pointer',
					}}
					onClick={this.handleCancel}
				/>
			</div>
		);
	};

	render() {
		const {
			className,
			mask,
			editable,
			children,
			defaultFileUpload,
		} = this.props;
		const { maskAlpha, maskName } = this.state;
		const isDefaultFileUpload =
			defaultFileUpload &&
			(defaultFileUpload.blockType === 'honor' ||
				defaultFileUpload.blockType === 'gallery') &&
			!defaultFileUpload.image
				? true
				: false;
		return (
			<div className={`${className || ''} edit-wrapper`}>
				{editable && this.changeFile()}
				<div
					className={`${
						isDefaultFileUpload
							? 'children-main default-file-upload'
							: 'children-main'
					}`}
					onClick={editable && isDefaultFileUpload ? this.open : null}
				>
					{children}
					{mask && !isMobile && (
						<CropImgMask
							maskName={maskName || 'blackMask'}
							maskAlpha={(maskAlpha || 0) / 100}
						/>
					)}
				</div>
				<input
					type="file"
					ref="fileInput"
					style={{ display: 'none' }}
					onChange={this.handleFileInput}
				/>
				{this.state.open && this.uploadFile()}
			</div>
		);
	}
}

export default connect(
	null,
	{ uploadCroppedImage, updateCard, saveMask, pushSystemMessage }
)(CropUploader);
