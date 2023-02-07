import React, { Component } from 'react';
import Toolbar from 'containers/toolbar/element';
import SelectMenu from 'components/selectMenu';
import DndElement from 'components/dnd-element';
import ACInput from 'components/autoComplete';
import DatePicker from 'components/datePicker';
import educationConfig from 'config/education';
import { education as placeHolder } from 'config/placeholder';
import './style.scss';

class EduAch extends Component {
	// 時間儲存
	handleTimeSubmit = (index, startYear, startMonth, endYear, endMonth) => {
		// NOTE: 學歷的 status 固定都為 1
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

	// 學歷、科系
	renderACInput = (
		value,
		index,
		feildOnChangeName,
		autoCompleteName,
		wrapperClassName,
		inputClassName
	) => {
		const { config, meta } = this.props;
		const { blockType } = config;
		const { feildOnChange, editable } = meta;
		return (
			<ACInput
				value={value}
				blockType={blockType}
				placeHolder={
					feildOnChangeName === 'schoolName'
						? placeHolder.schoolName
						: placeHolder.majorName
				}
				onUpdateData={feildOnChange.bind(this, index, [
					index,
					feildOnChangeName,
				])}
				editable={editable}
				autoCompleteName={autoCompleteName}
				wrapperClassName={wrapperClassName}
				inputClassName={inputClassName}
				isRequired={true}
			/>
		);
	};

	// 時間模板
	renderDatePicker = (elm, index, dashClassName = '') => {
		const { meta } = this.props;
		const { editable } = meta;
		const { startYear, startMonth, endYear, endMonth } = elm;
		return (
			<DatePicker
				startYear={startYear}
				startMonth={startMonth}
				endYear={endYear}
				endMonth={endMonth}
				onUpdateData={this.handleTimeSubmit.bind(this, index)}
				editable={editable}
				dashClassName={dashClassName}
				title="就學期間"
			/>
		);
	};

	// 學歷
	renderSelectMenu = (elm, index) => {
		const { meta } = this.props;
		const { feildOnChange, editable } = meta;
		const { degree } = elm;
		return (
			<SelectMenu
				itemList={educationConfig.degree}
				value={degree}
				defaultValue={6}
				placeholder={placeHolder.degree}
				onUpdateData={feildOnChange.bind(this, index, [index, 'degree'])}
				editable={editable}
				isRequired={true}
			/>
		);
	};

	// 第一個模板
	renderDefTemplate = (elm, index) => {
		const { meta } = this.props;
		const { editable } = meta;
		return (
			<div
				key={`edu-def-${index}`}
				className={
					editable
						? 'edu-main edu-main--def'
						: 'edu-main edu-main--def edu-preview'
				}
			>
				<div className="edu-title edu-title--def">
					{this.renderACInput(
						elm.schoolName,
						index,
						'schoolName',
						'schoolName',
						'edu-title',
						'edu-title__school edu-title__school--def'
					)}
					{this.renderACInput(
						elm.majorName,
						index,
						'majorName',
						'major',
						'edu-title',
						'edu-title__major'
					)}
					<div className="edu-time edu-time--def">
						{this.renderDatePicker(elm, index)}
					</div>
					<div className="edu-degree">{this.renderSelectMenu(elm, index)}</div>
				</div>
			</div>
		);
	};

	// 第二個模板
	renderRaeTemplate = (elm, index) => {
		const { meta } = this.props;
		const { editable } = meta;
		return (
			<div
				key={`edu-raw-${index}`}
				className={
					editable
						? 'edu-main edu-main--raw'
						: 'edu-main edu-main--raw edu-preview'
				}
			>
				<div className="edu-content edu-content--raw">
					{this.renderACInput(
						elm.schoolName,
						index,
						'schoolName',
						'schoolName',
						'edu-title edu-title__wrapper--raw',
						'edu-title__school'
					)}
					{this.renderACInput(
						elm.majorName,
						index,
						'majorName',
						'major',
						'edu-title edu-title__wrapper--raw',
						'edu-title__major'
					)}
					<div className="edu-bottom-line edu-bottom-line--raw edu-time--raw">
						<div className="edu-time">{this.renderDatePicker(elm, index)}</div>
						<div className="edu-degree">
							{this.renderSelectMenu(elm, index)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	// 第三個模板
	renderDarkTemplate = (elm, index) => {
		const { meta } = this.props;
		const { editable } = meta;
		return (
			<div
				key={`edu-dark-${index}`}
				className={
					editable
						? 'edu-main edu-main--dark'
						: 'edu-main edu-main--dark edu-preview'
				}
			>
				<div className="edu-content edu-content--dark">
					{this.renderACInput(
						elm.schoolName,
						index,
						'schoolName',
						'schoolName',
						'edu-title',
						'edu-title__school'
					)}
					{this.renderACInput(
						elm.majorName,
						index,
						'majorName',
						'major',
						'edu-title',
						'edu-title__major'
					)}
					<span className="edu-time edu-time--dark">
						{this.renderDatePicker(elm, index)}
					</span>
					<div className="edu-bottom-line edu-bottom-line--dark">
						<div className="edu-degree">
							{this.renderSelectMenu(elm, index)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	// 第四個模板
	renderNewTemplate = (elm, index) => {
		const { meta } = this.props;
		const { editable } = meta;
		return (
			<div
				key={`edu-new-${index}`}
				className={
					editable
						? 'edu-main edu-main--new'
						: 'edu-main edu-main--new edu-preview'
				}
			>
				<span className="edu-time edu-time--new">
					{this.renderDatePicker(elm, index, 'edu-new-dash')}
				</span>
				<div className="edu-content edu-content--new">
					{this.renderACInput(
						elm.schoolName,
						index,
						'schoolName',
						'schoolName',
						'edu-title',
						'edu-title__school'
					)}
					{this.renderACInput(
						elm.majorName,
						index,
						'majorName',
						'major',
						'edu-title',
						'edu-title__major edu-title__major--new'
					)}
					<div className="edu-bottom-line edu-bottom-line--new">
						<div className="edu-degree">
							{this.renderSelectMenu(elm, index)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	renderTemplate = (elm, index) => {
		const { config } = this.props;
		const { templateType } = config;
		const template = {
			raw: this.renderRaeTemplate(elm, index),
			dark: this.renderDarkTemplate(elm, index),
			new: this.renderNewTemplate(elm, index),
			def: this.renderDefTemplate(elm, index),
		};
		return template[templateType] || template['def'];
	};

	shouldComponentUpdate = (nextProps, nextState) => {
		if (nextProps.data === this.props.data) return false;
		return true;
	};

	render() {
		const { data, config, meta, commonMode } = this.props;
		const { blockType, uniKey, templateType } = config;
		const { editable } = meta;
		const dataLength = data.length;
		return (
			<div className={`edu-container edu-container--${templateType}`}>
				{data.map((elm, index) => {
					const isUnSaved = /tmp-/.test(elm.eduId);
					return (
						<DndElement
							{...{ blockType, uniKey, index }}
							{...elm}
							canDrag={true}
							key={elm.eduId}
						>
							<Toolbar
								toolBarType={
									templateType === 'new' ? 'blockElemRimless' : 'blockElem'
								}
								key={elm.eduId}
								dataLength={dataLength}
								displayFlex={true}
								editable={editable}
								isUnSaved={isUnSaved}
								index={index}
								{...{ blockType, uniKey, elm, templateType }}
								commonMode={commonMode}
							>
								{this.renderTemplate(elm, index)}
							</Toolbar>
						</DndElement>
					);
				})}
			</div>
		);
	}
}

export default {
	def: EduAch,
	raw: EduAch,
	dark: EduAch,
};
