import React, { Component, Fragment } from 'react';
import Toolbar from 'containers/toolbar/element';
import DndElement from 'components/dnd-element';
import Star from 'components/star';
import ACInput from 'components/autoComplete';
import DraftEditor from 'components/draft-md-editor';
import { talent as placeHolder } from 'config/placeholder';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import loremIpsum from 'lorem-ipsum';
import { isMobile } from 'react-device-detect';
import './style.scss';

class TalentAch extends Component {
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
		if (prevProps.data[position].tagId !== data[position].tagId) {
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

	_gradeChange = (index, value) => {
		const { feildOnChange } = this.props.meta;
		feildOnChange(index, [index, 'grade'], value);
	};

	// 技能標題
	renderACInput = (tag, feildOnChange, index, editable, propsClassName) => {
		const { blockType } = this.props.config;
		return (
			<ACInput
				value={tag}
				blockType={blockType}
				placeHolder={placeHolder.tag}
				onUpdateData={feildOnChange.bind(this, index, [index, 'tag'])}
				editable={editable}
				autoCompleteName="ability"
				wrapperClassName={`tag-input--${propsClassName}`}
				inputClassName={`tag-input--${propsClassName}`}
				isRequired={true}
			/>
		);
	};

	// 技能星星
	renderStar = (index, grade, editable) => {
		return (
			<Star
				gradeChange={this._gradeChange.bind(this, index)}
				grade={grade || 0}
				disabled={!editable}
			/>
		);
	};

	// 第一個模板
	renderDefTemplate = (elm, index) => {
		const { editable, feildOnChange } = this.props.meta;
		const { grade, tag } = elm;
		return (
			<div
				className={
					editable ? 'talent-main-tem1' : 'talent-main-tem1 talent-preview'
				}
			>
				<div className="content">
					<div className="content-top">
						<span className="span-icon" />
						{this.renderACInput(tag, feildOnChange, index, editable, 'def')}
					</div>
					<div className="talent-star">
						{this.renderStar(index, grade, editable)}
					</div>
				</div>
			</div>
		);
	};

	// 第二個模板
	renderDarkTemplate = (elm, index) => {
		const { editable, feildOnChange } = this.props.meta;
		const { grade, tag, description } = elm;
		return (
			<div
				className={
					editable ? 'talent-main-tem2' : 'talent-main-tem2 talent-preview'
				}
			>
				<span className="span-icon" />
				<div className="content">
					{this.renderACInput(tag, feildOnChange, index, editable, 'dark')}
					<div className="talent-star">
						{this.renderStar(index, grade, editable)}
					</div>
					<DraftEditor
						html={description}
						placeHolder={placeHolder.description}
						showFirstUseSample={true}
						sampleText={this.sampleText}
						onUpdateContent={feildOnChange.bind(this, index, [
							index,
							'description',
						])}
						editable={editable}
					/>
				</div>
			</div>
		);
	};

	// 呈現模板
	_renderTemplate = (elm, index) => {
		const { templateType } = this.props.config;
		const template = {
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
					'talent-displayFlex'
				)[fromTop].offsetHeight,
				dndElementFromBottomHeight: document.getElementsByClassName(
					'talent-displayFlex'
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
		const { data, config, meta, commonMode } = this.props;
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
			dark: 'talent-main-tem2 talent-preview',
			def: 'talent-main-tem1 talent-preview',
		};
		const dndElementClass = elementClass[templateType] || elementClass['def'];

		return (
			<section className="talent-container">
				{data.map((elm, index) => {
					const isUnSaved = /tmp-/.test(elm.tagId);
					return editable ? (
						<DndElement
							{...{ blockType, uniKey, index }}
							{...elm}
							canDrag={true}
							key={elm.tagId}
							dndElementClass={dndElementClass}
							fromTop={fromTop}
							fromBottom={fromBottom}
							dndElementFromTopHeight={dndElementFromTopHeight}
							dndElementFromBottomHeight={dndElementFromBottomHeight}
						>
							<Toolbar
								toolBarType={
									templateType === 'dark' ? 'blockElemRimless' : 'blockElem'
								}
								key={`${uniKey}-${index}`}
								dataLength={dataLength}
								displayFlex={true}
								isUnSaved={isUnSaved}
								editable={editable}
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
						<Fragment key={elm.tagId}>
							{this._renderTemplate(elm, index)}
						</Fragment>
					);
				})}
			</section>
		);
	}
}

export default DragDropContext(HTML5Backend)({
	def: TalentAch,
	dark: TalentAch,
});
