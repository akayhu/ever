import React, { Component, Fragment } from 'react';
import Toolbar from 'containers/toolbar/element';
import DatePicker from 'components/datePicker';
import DraftEditor from 'components/draft-md-editor';
import EditableText from 'components/editableText';
import CropUploader from 'components/cropUploader';
import DndElement from 'components/dnd-element';
import { Image } from 'share/styledComponents';
import Tags from 'components/tags';
import defaultImg7 from 'components/defaultImage/default_7.jpg';
import defaultImg9 from 'components/defaultImage/default_9.jpg';
import defaultImg12 from 'components/defaultImage/default_12.jpg';
import defaultImg13 from 'components/defaultImage/default_13.jpg';
import defaultImg14 from 'components/defaultImage/default_14.jpg';
import { honor as placeHolder } from 'config/placeholder';
import FileViewer from 'containers/fileViewer';
import loremIpsum from 'lorem-ipsum';
import { isMobile } from 'react-device-detect';
import './style.scss';

class HonorAch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			switchTransition: {
				fromTop: null,
				fromBottom: null,
				dndElementFromTopHeight: null,
				dndElementFromBottomHeight: null,
				position: 0,
			},
		};
		this.sampleText = loremIpsum({ units: 'paragraphs' });
	}

	componentDidUpdate(prevProps) {
		const { position } = this.state.switchTransition;
		const { data } = this.props;
		if (prevProps.data[position].honorId !== data[position].honorId) {
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

	handleTimeSubmit = (index, startYear, startMonth, endYear, endMonth) => {
		const { feildOnChange } = this.props.meta;
		const multiFeildsUpdate = true;
		const values = {
			startYear,
			startMonth,
			endYear,
			endMonth,
		};
		feildOnChange(index, [index], values, {}, multiFeildsUpdate);
	};

	// 圖片上傳
	renderCropUploader = (
		elm,
		fileId,
		newOriFile,
		imageUpload,
		index,
		editable,
		newFileUrlMapW600,
		defaultCardImg,
		fileUrlMap,
		width,
		height
	) => {
		const { templateType } = this.props.config;
		const noPictureClass = {
			card: ['honor-no-picture honor-no-picture--card'],
			dou: ['honor-no-picture honor-no-picture--dou'],
			dark: ['honor-no-picture honor-no-picture--dark'],
		};
		return (
			<CropUploader
				aspect={16 / 9}
				width={width}
				height={height}
				fileId={fileId}
				oriFile={newOriFile}
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
				defaultFileUpload={{
					blockType: 'honor',
					image: newFileUrlMapW600,
				}}
			>
				{editable ? (
					newFileUrlMapW600 ? (
						<Image
							src={newFileUrlMapW600 || defaultCardImg}
							onError={e => {
								e.target.src = defaultCardImg;
							}}
							width={width}
							height={height}
						/>
					) : (
						<div className={`${noPictureClass[templateType]}`}>
							上傳檔案
							<br />
							<span>(若無檔案將發佈為文字樣板)</span>
						</div>
					)
				) : (
					<FileViewer
						fileData={elm}
						fileUrl={fileUrlMap && fileUrlMap.origin}
						fileId={fileId}
					>
						<Image
							src={(fileUrlMap && fileUrlMap.w600) || defaultCardImg}
							onError={e => {
								e.target.src = defaultCardImg;
							}}
							width={width}
							height={height}
						/>
					</FileViewer>
				)}
			</CropUploader>
		);
	};

	// 專案成就標題
	renderEditableText = (title, feildOnChange, index, editable) => {
		const { blockType } = this.props.config;
		return (
			<EditableText
				text={title}
				editableName="honor"
				blockType={blockType}
				placeHolder={placeHolder.title}
				className="honor-title"
				onUpdateData={feildOnChange.bind(this, index, [index, 'title'])}
				editable={editable}
				isRequired={true}
			/>
		);
	};

	// 專案時間
	renderDatePicker = (
		startYear,
		startMonth,
		endYear,
		endMonth,
		index,
		editable
	) => {
		return (
			<DatePicker
				startYear={startYear}
				startMonth={startMonth}
				endYear={endYear}
				endMonth={endMonth}
				showSeniority={true}
				onUpdateData={this.handleTimeSubmit.bind(this, index)}
				editable={editable}
				title="執行期間"
			/>
		);
	};

	// 專案成就內容
	renderDraftEditor = (description, feildOnChange, index, editable) => {
		return (
			<DraftEditor
				html={description}
				md={description}
				placeHolder={placeHolder.description}
				// showFirstUseSample={true}
				sampleText={this.sampleText}
				onUpdateContent={feildOnChange.bind(this, index, [
					index,
					'description',
				])}
				editable={editable}
			/>
		);
	};

	// 標籤
	renderTag = (talentList, editable, feildOnChange, index) => {
		const { commonMode } = this.props;
		return (
			<Tags
				tagsData={talentList} // tags array格式資料
				edit={editable} // true = 編輯tags; false = 只做呈現
				onTagsSubmit={feildOnChange.bind(this, index, [index, 'talentList'])} // 要送出的func
				commonMode={commonMode}
			/>
		);
	};

	// 第一個模板
	renderDefTemplate = (elm, index) => {
		const { feildOnChange, editable } = this.props.meta;
		const {
			title,
			description,
			talentList,
			startYear,
			startMonth,
			endYear,
			endMonth,
		} = elm;
		return (
			<div
				className={
					editable
						? 'honor-main honor-main--def'
						: 'honor-main honor-main--def honor-preview'
				}
			>
				{this.renderEditableText(title, feildOnChange, index, editable)}
				<div className="honor-time">
					<span className="honor-time__ball">●</span>
					<span className="honor-time__con">
						{this.renderDatePicker(
							startYear,
							startMonth,
							endYear,
							endMonth,
							index,
							editable
						)}
					</span>
				</div>
				<div className="honor-bottom-line">
					{this.renderDraftEditor(description, feildOnChange, index, editable)}
				</div>
				{this.renderTag(talentList, editable, feildOnChange, index)}
			</div>
		);
	};

	// 第二個模板
	renderCardTemplate = (elm, index) => {
		const { feildOnChange, editable, imageUpload } = this.props.meta;
		const {
			title,
			description,
			talentList,
			startYear,
			startMonth,
			endYear,
			endMonth,
			fileId,
			fileUrlMap,
		} = elm;
		const newOriFile = (fileUrlMap && fileUrlMap.origin.toString()) || '';
		const newFileUrlMapW600 = (fileUrlMap && fileUrlMap.w600.toString()) || '';
		const defaultCardImg =
			index % 3 === 0
				? defaultImg12
				: index % 3 === 1
				? defaultImg14
				: defaultImg7;
		return (
			<div
				className={
					editable
						? 'honor-main honor-main--card'
						: 'honor-main honor-main--card honor-preview'
				}
			>
				<div className="honor-img honor-img--card">
					{this.renderCropUploader(
						elm,
						fileId,
						newOriFile,
						imageUpload,
						index,
						editable,
						newFileUrlMapW600,
						defaultCardImg,
						fileUrlMap,
						278,
						156
					)}
				</div>
				{this.renderEditableText(title, feildOnChange, index, editable)}
				<div className="honor-time">
					<span className="honor-time__ball">●</span>
					<span className="honor-time__con">
						{this.renderDatePicker(
							startYear,
							startMonth,
							endYear,
							endMonth,
							index,
							editable
						)}
					</span>
				</div>
				<div className="honor-bottom-line">
					{this.renderDraftEditor(description, feildOnChange, index, editable)}
				</div>
				{this.renderTag(talentList, editable, feildOnChange, index)}
			</div>
		);
	};

	// 第三個模板
	renderDouTemplate = (elm, index) => {
		const { feildOnChange, editable, imageUpload } = this.props.meta;
		const {
			title,
			description,
			talentList,
			startYear,
			startMonth,
			endYear,
			endMonth,
			fileId,
			fileUrlMap,
		} = elm;
		const newOriFile = (fileUrlMap && fileUrlMap.origin.toString()) || '';
		const newFileUrlMapW600 = (fileUrlMap && fileUrlMap.w600.toString()) || '';
		const defaultDouImg = index % 2 === 0 ? defaultImg12 : defaultImg14;
		return (
			<div
				className={
					editable
						? 'honor-main honor-main--dou'
						: 'honor-main honor-main--dou honor-preview'
				}
			>
				<div className="honor-img honor-img--dou">
					{this.renderCropUploader(
						elm,
						fileId,
						newOriFile,
						imageUpload,
						index,
						editable,
						newFileUrlMapW600,
						defaultDouImg,
						fileUrlMap,
						415,
						239.63
					)}
				</div>
				{this.renderEditableText(title, feildOnChange, index, editable)}
				<div className="honor-time">
					<span className="honor-time__ball">●</span>
					<span className="honor-time__con">
						{this.renderDatePicker(
							startYear,
							startMonth,
							endYear,
							endMonth,
							index,
							editable
						)}
					</span>
				</div>
				<div className="honor-bottom-line">
					{this.renderDraftEditor(description, feildOnChange, index, editable)}
				</div>
				{this.renderTag(talentList, editable, feildOnChange, index)}
			</div>
		);
	};

	// 第四個模板
	renderDarkTemplate = (elm, index) => {
		const { feildOnChange, editable, imageUpload } = this.props.meta;
		const {
			title,
			description,
			talentList,
			startYear,
			startMonth,
			endYear,
			endMonth,
			fileId,
			fileUrlMap,
		} = elm;
		const newOriFile = (fileUrlMap && fileUrlMap.origin.toString()) || '';
		const newFileUrlMapW600 = (fileUrlMap && fileUrlMap.w600.toString()) || '';
		const defaultDarkImg =
			index % 3 === 0
				? defaultImg13
				: index % 3 === 1
				? defaultImg9
				: defaultImg7;
		return (
			<div
				className={
					editable
						? 'honor-main honor-main--dark'
						: 'honor-main honor-main--dark honor-preview'
				}
			>
				<div className="honor-img honor-img--dark">
					{this.renderCropUploader(
						elm,
						fileId,
						newOriFile,
						imageUpload,
						index,
						editable,
						newFileUrlMapW600,
						defaultDarkImg,
						fileUrlMap,
						500,
						280
					)}
				</div>
				<div className="honor-content honor-content--dark">
					{this.renderEditableText(title, feildOnChange, index, editable)}
					<div className="honor-time">
						<span className="honor-time__ball">●</span>
						<span className="honor-time__con">
							{this.renderDatePicker(
								startYear,
								startMonth,
								endYear,
								endMonth,
								index,
								editable
							)}
						</span>
					</div>
					<div className="honor-bottom-line">
						{this.renderDraftEditor(
							description,
							feildOnChange,
							index,
							editable
						)}
					</div>
					{this.renderTag(talentList, editable, feildOnChange, index)}
				</div>
			</div>
		);
	};

	// 第五個模板
	renderTextTemplate = (elm, index) => {
		const { feildOnChange, editable } = this.props.meta;
		const {
			title,
			description,
			talentList,
			startYear,
			startMonth,
			endYear,
			endMonth,
		} = elm;
		return (
			<div
				className={
					editable
						? 'honor-main honor-main--text'
						: 'honor-main honor-main--text honor-preview'
				}
			>
				{this.renderEditableText(title, feildOnChange, index, editable)}
				<div className="honor-time">
					<span className="honor-time__ball">●</span>
					<span className="honor-time__con">
						{this.renderDatePicker(
							startYear,
							startMonth,
							endYear,
							endMonth,
							index,
							editable
						)}
					</span>
				</div>
				<div className="honor-bottom-line">
					{this.renderDraftEditor(description, feildOnChange, index, editable)}
				</div>
				{this.renderTag(talentList, editable, feildOnChange, index)}
			</div>
		);
	};

	// 顯示模板
	renderTemplate = (elm, index) => {
		const { templateType } = this.props.config;
		const template = {
			card: this.renderCardTemplate(elm, index),
			dou: this.renderDouTemplate(elm, index),
			dark: this.renderDarkTemplate(elm, index),
			text: this.renderTextTemplate(elm, index),
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
					'honor-displayFlex'
				)[fromTop].offsetHeight,
				dndElementFromBottomHeight: document.getElementsByClassName(
					'honor-displayFlex'
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
		return (
			<div className={`honor-container honor-container--${templateType}`}>
				{data.map((elm, index) => {
					const isUnSaved = /tmp-/.test(elm.honorId);
					return editable ? (
						<DndElement
							{...{ blockType, uniKey, index }}
							{...elm}
							canDrag={true}
							key={elm.honorId}
							dndElementClass={`honor-main--${templateType} honor-preview`}
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
										? elmDragPreview(this.renderTemplate(elm, index))
										: this.renderTemplate(elm, index)
								}
							</Toolbar>
						</DndElement>
					) : (
						<Fragment key={elm.honorId}>
							{this.renderTemplate(elm, index)}
						</Fragment>
					);
				})}
			</div>
		);
	}
}

export default {
	def: HonorAch,
	card: HonorAch,
	dou: HonorAch,
	dark: HonorAch,
	text: HonorAch,
};
