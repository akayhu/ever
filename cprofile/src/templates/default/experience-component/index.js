import React, { Component } from 'react';
import Toolbar from 'containers/toolbar/element';
import DatePicker from 'components/datePicker';
import ACInput from 'components/autoComplete';
import DraftEditor from 'components/draft-md-editor';
import Tags from 'components/tags';
import { experience as placeHolder } from 'config/placeholder';
import loremIpsum from 'lorem-ipsum';
import './style.scss';
import { experience } from '../../../config/placeholder';

class ExpAch extends Component {
	constructor(props) {
		super(props);
		this.sampleText = experience.sampleText;
		this.state = {
			invalidText: false,
		};
	}

	// 時間儲存
	_handleTimeSubmit = (
		index,
		startYear,
		startMonth,
		endYear,
		endMonth,
		stillWorking
	) => {
		const { meta } = this.props;
		const { feildOnChange } = meta;
		const multiFeildsUpdate = true;
		const values = {
			startYear,
			startMonth,
			endYear,
			endMonth,
			status: stillWorking ? 1 : 0,
		};
		feildOnChange(index, [index], values, {}, multiFeildsUpdate);
	};

	// 更新公司資訊
	_handleCompanySubmit = (index, value) => {
		const { meta } = this.props;
		const { feildOnChange } = meta;
		const multiFeildsUpdate = true;
		const values = {
			companyName: value,
		};
		feildOnChange(index, [index], values, {}, multiFeildsUpdate);
	};

	// 標籤
	renderTags = (talentList, index) => {
		const { meta, commonMode } = this.props;
		const { editable, feildOnChange } = meta;
		return (
			<Tags
				tagsData={talentList} // tags array格式資料
				edit={editable} // true = 編輯tags; false = 只做呈現
				onTagsSubmit={feildOnChange.bind(this, index, [index, 'talentList'])} // 要送出的func
				commonMode={commonMode}
			/>
		);
	};

	// 經歷描述
	renderDraftEditor = (description, index) => {
		const { meta, config } = this.props;
		const { blockType } = config;
		const { editable, feildOnChange } = meta;
		return (
			<DraftEditor
				html={description}
				md={description}
				blockType={blockType}
				drafEditorName="description"
				placeHolder={placeHolder.description}
				showFirstUseSample={true}
				sampleText={this.sampleText}
				onUpdateContent={feildOnChange.bind(this, index, [
					index,
					'description',
				])}
				editable={editable}
			/>
		);
	};

	// 時間
	renderDatePicker = (
		elm,
		index,
		seniorityClassName = '',
		popoverClassName = '',
		dashClassName = ''
	) => {
		const { meta } = this.props;
		const { editable } = meta;
		const { startYear, startMonth, endYear, endMonth, status } = elm;

		return (
			<DatePicker
				startYear={startYear}
				startMonth={startMonth}
				endYear={endYear}
				endMonth={endMonth}
				stillWorking={status}
				showStillWorking={true}
				showSeniority={true}
				seniorityClassName={seniorityClassName}
				onUpdateData={this._handleTimeSubmit.bind(this, index)}
				editable={editable}
				title="在職期間"
				popoverClassName={popoverClassName}
				dashClassName={dashClassName}
			/>
		);
	};

	// 職業名稱、公司名稱
	renderACInput = (value, index, name, acMeta = {}, inputClassName) => {
		const { meta, config } = this.props;
		const { blockType } = config;
		const { editable, feildOnChange } = meta;

		if (name === 'jobName') {
			return (
				<ACInput
					meta={acMeta}
					value={value}
					blockType={blockType}
					placeHolder={placeHolder.jobName}
					onUpdateData={feildOnChange.bind(this, index, [index, 'jobName'])}
					editable={editable}
					autoCompleteName="jobTitle"
					wrapperClassName="jobTitle _lr-hide"
					inputClassName={inputClassName}
					isRequired={true}
				/>
			);
		}

		return (
			<ACInput
				value={value}
				blockType={blockType}
				meta={acMeta}
				placeHolder={placeHolder.companyName}
				onUpdateData={this._handleCompanySubmit.bind(this, index)}
				onSaveFreeKeyItem={this._handleCompanySubmit.bind(this, index)}
				editable={editable}
				autoCompleteName="companyName"
				wrapperClassName="companyName"
				inputClassName={inputClassName}
				isRequired={true}
			/>
		);
	};

	// 第一個模板
	_expDarkTemplate = () => {
		const { data, meta, config, commonMode } = this.props;
		const { blockType, uniKey } = config;
		const { editable } = meta;
		const dataLength = data.length;
		return (
			<div className="exp-dark-timeline">
				<div className="exp-dark-timeline-bar" />
				<div className="exp-dark-timeline-inner clearfix">
					{data.map((elm, index) => {
						const { expId, description, talentList } = elm;
						const isUnSaved = /tmp-/.test(expId);
						return (
							<div className="exp-dark-timeline-box" key={expId}>
								<span className="dot" />
								<div
									className={
										editable
											? 'exp-dark-timeline-box-inner animated'
											: 'exp-dark-timeline-box-inner animated exp-dark-preview'
									}
								>
									<Toolbar
										toolBarType="blockElemRimless"
										dataLength={dataLength}
										editable={editable}
										isUnSaved={isUnSaved}
										{...{ blockType, uniKey, elm }}
										index={index}
										commonMode={commonMode}
									>
										<div className="exp-dark-content">
											<span className="arrow" />
											<div className="date">
												{this.renderDatePicker(
													elm,
													index,
													'exp-dark-timeline-seniority-style'
												)}
											</div>
											{this.renderACInput(
												elm.jobName,
												index,
												'jobName',
												{},
												'jobTitle__input--dark'
											)}
											{this.renderACInput(
												elm.companyName,
												index,
												'companyName',
												{ companyName: elm.companyName, align: 'center' },
												'companyName__input--dark'
											)}
											<div className="exp-dark-jobNote">
												{this.renderDraftEditor(description, index)}
											</div>
											<div className="exp-dark-tag">
												{this.renderTags(talentList, index)}
											</div>
										</div>
									</Toolbar>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	// 第二個模板
	_expDefTemplate = () => {
		const { data, meta, config, commonMode } = this.props;
		const { blockType, uniKey } = config;
		const { editable } = meta;
		const dataLength = data.length;
		return (
			<div className="list-wrapper">
				<div className="exp-timeline">
					<ul>
						{data.map((elm, index) => {
							const { expId, description, talentList } = elm;
							const isUnSaved = /tmp-/.test(expId);
							return (
								<li className="exp-def-li" key={expId}>
									<div className="exp-def-content">
										<Toolbar
											toolBarType="blockElem"
											dataLength={dataLength}
											editable={editable}
											isUnSaved={isUnSaved}
											{...{ blockType, uniKey, elm }}
											index={index}
											commonMode={commonMode}
										>
											<div
												className={
													editable ? 'exp-def-main' : 'exp-def-main exp-preview'
												}
											>
												{this.renderDatePicker(elm, index)}
												<div className="exp-def-input">
													{this.renderACInput(
														elm.companyName,
														index,
														'companyName',
														{
															companyName: elm.companyName,
															align: index % 2 ? 'left' : 'right',
														},
														'companyName__input--def'
													)}
												</div>
												<div className="exp-def-input">
													{this.renderACInput(
														elm.jobName,
														index,
														'jobName',
														{ align: index % 2 ? 'left' : 'right' },
														'jobTitle__input--def'
													)}
												</div>
												<div className="exp-def-jobNote">
													{this.renderDraftEditor(description, index)}
												</div>
												<div className="exp-def-tag">
													{this.renderTags(talentList, index)}
												</div>
											</div>
										</Toolbar>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	};

	// 第三個模板
	_expNewTemplate = () => {
		const { data, meta, config, commonMode } = this.props;
		const { blockType, uniKey } = config;
		const { editable } = meta;
		const dataLength = data.length;
		return (
			<div className="exp-new-timeline">
				{data.map((elm, index) => {
					const { expId, description, talentList } = elm;
					const isUnSaved = /tmp-/.test(expId);
					return (
						<div className="exp-new-entry" key={expId}>
							<Toolbar
								toolBarType="blockElemRimless"
								dataLength={dataLength}
								editable={editable}
								isUnSaved={isUnSaved}
								{...{ blockType, uniKey, elm }}
								index={index}
								commonMode={commonMode}
							>
								<div
									className={
										editable ? 'exp-new-title' : 'exp-new-title exp-new-preview'
									}
								>
									{this.renderDatePicker(
										elm,
										index,
										'exp-new-template-seniority-style',
										'exp-new-template-popover-style',
										'exp-new-template-dash-style'
									)}
								</div>
								<div className="exp-new-body">
									{this.renderACInput(
										elm.jobName,
										index,
										'jobName',
										{},
										'jobTitle__input--new'
									)}
									{this.renderACInput(
										elm.companyName,
										index,
										'companyName',
										{ companyName: elm.companyName },
										'companyName__input--new'
									)}
									<div className="exp-new-jobNote">
										{this.renderDraftEditor(description, index)}
									</div>
									<div className="exp-new-tag">
										{this.renderTags(talentList, index)}
									</div>
								</div>
								<div style={{ clear: 'both' }} />
							</Toolbar>
						</div>
					);
				})}
			</div>
		);
	};

	// 第四個模板
	_expListTemplate = () => {
		const { data, meta, config, commonMode } = this.props;
		const { blockType, uniKey, templateType } = config;
		const { editable } = meta;
		const dataLength = data.length;
		return (
			<div className="exp-list-container">
				{data.map((elm, index) => {
					const { expId, description, talentList } = elm;
					const isUnSaved = /tmp-/.test(expId);
					return (
						<Toolbar
							toolBarType="blockElem"
							key={expId}
							dataLength={dataLength}
							editable={editable}
							isUnSaved={isUnSaved}
							{...{ blockType, uniKey, elm, templateType }}
							displayFlex={true}
							index={index}
							commonMode={commonMode}
						>
							<div
								className={
									editable ? 'exp-list-main' : 'exp-list-main exp-preview'
								}
							>
								<div className="exp-list-input">
									{this.renderACInput(
										elm.companyName,
										index,
										'companyName',
										{ companyName: elm.companyName, align: 'left' },
										'companyName__input--list'
									)}
								</div>
								<div className="exp-list-input">
									{this.renderACInput(
										elm.jobName,
										index,
										'jobName',
										{},
										'jobTitle__input--list'
									)}
								</div>
								<div className="exp-list-time">
									<span className="exp-list-time-ball">●</span>
									<span className="exp-list-time-con">
										{this.renderDatePicker(elm, index)}
									</span>
								</div>
								<div className="exp-list-border-bottom-line">
									{this.renderDraftEditor(description, index)}
								</div>
								{this.renderTags(talentList, index)}
							</div>
						</Toolbar>
					);
				})}
			</div>
		);
	};

	shouldComponentUpdate = (nextProps, nextState) => {
		if (nextProps.data === this.props.data) return false;
		return true;
	};

	render() {
		const { templateType } = this.props.config;
		const template = {
			new: this._expNewTemplate(),
			dark: this._expDarkTemplate(),
			list: this._expListTemplate(),
			def: this._expDefTemplate(),
		};
		return template[templateType] || template['def'];
	}
}

export default {
	dark: ExpAch,
	def: ExpAch,
	list: ExpAch,
	new: ExpAch,
};
