import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './formUnit/formunit.css';
import { TextField } from 'c_wap_module';
import { initData, autoComplete } from './formUnit/util.js';
import DatePicker from './formUnit/datePicker';
import clientConfig from 'src/configs/client';

class FormExp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ACData: ACDataInit,
			data: initData(this.props.itemData, this.props.createMode),
			errorMessage: errorMessageInit,
			finishCallback: props.changeStatus,
			editCompanyNameAc: 0,
			editCompanyAreaAc: 0,
			editJobTitleAc: 0
		};
		this.dateSelect = (selector, selectData) => this.dateStatusChange(selector, selectData);
		this.updateTrigger = (key, value) => this.dataHandler(key, value);
		this.errorTrigger = (key, errorMessage) => this.errorMessageHandle(key, errorMessage);
		this.cancelTrigger = () => this.props.cancelTrigger();
	}
	dataHandler(key, data) {
		const newDataObj = {};
		newDataObj[key] = data;
		this.setState({ data: Object.assign(this.state.data, newDataObj) });
		this.acdataHandler(key, data);
	}
	acdataHandler(key, value) {
		autoComplete(key, value, (res) => {
			this.setState({ ACData: Object(ACDataInit, res) });
		});
	}
	errorMessageHandle(key, error) {
		const newErrorObj = {};
		newErrorObj[key] = error;
		this.setState({ errorMessage: Object.assign(this.state.errorMessage, newErrorObj) });
	}
	submit() {
	}
	render() {
		const { data, ACData, errorMessage } = this.state;
		return (
			<div styleName="form_edit_main" className={ (this.props.simpleMode) ? css.simple_mode : '' }>
				<div styleName="row_block">
					<div styleName="title">公司名稱<span styleName="star">*</span></div>
					<div>
						<TextField
							name="companyName"
							value={ data.companyName }
							placeHolder="公司名稱"
							ACData={ ACData.companyName }
							errorMessage={ errorMessage.companyName }
							onChange={ this.updateTrigger }
							styleName="textField"
						/>
					</div>
				</div>
				<div styleName="row_block" className={ (this.props.simpleMode) ? css.simple_mode : '' }>
					<div styleName="title">地區</div>
					<div>
						<TextField
							name="expAreaInput"
							value={ data.expAreaInput }
							placeHolder="公司地區"
							ACData={ ACData.expAreaInput }
							onChange={ this.updateTrigger }
							styleName="textField"
						/>
					</div>
				</div>
				<div styleName="row_block">
					<div styleName="title">職務名稱<span styleName="star">*</span></div>
					<div>
						<TextField
							name="jobTitle"
							value={ data.jobTitle }
							placeHolder="職務名稱"
							ACData={ ACData.jobTitle }
							errorMessage={ errorMessage.jobTitle }
							onChange={ this.updateTrigger }
							styleName="textField"
						/>
					</div>
				</div>
				<DatePicker
					text="在職期間"
					data={ data }
					updateTrigger={ this.updateTrigger }
					errorMessage={ errorMessage }
					errorTrigger={ this.errorTrigger }
					experienceMode
					disabled={ this.state.data.stillWork }
				/>
				<div styleName="row_block" className={ (this.props.mode === 'simple') ? css.simple_mode : '' }>
					<div styleName="title">
						工作內容：你可以參考<a href={ `${clientConfig.params.e104Url}/jb/jobwiki/nav` } target="_blank" rel="noopener noreferrer">職務內容</a>填寫
					</div>
					<div styleName="description">
						<TextField
							name="jobNote"
							value={ this.state.data.jobNote }
							maxWords={ 1000 }
							allowMultiLine
						/>
					</div>
				</div>
				<div styleName="btn_row action_btn">
					<button className="mini ui primary button" data-gtm-index="儲存 經歷" onClick={ this.submit.bind(this) }>儲存</button>
					{
						this.props.simpleMode &&
						<button className="mini ui button" data-gtm-index="略過 經歷">略過</button>
					}
					{
						!this.props.simpleMode &&
						<button className="mini ui button" onClick={ this.cancelTrigger }>取消</button>
					}
				</div>
			</div>
		);
	}
}

const errorMessageInit = {
	companyName: '',
	jobTitle: '',
	startYear: 'dropList',
	startMonth: 'dropList',
	endYear: 'dropList',
	endMonth: 'dropList',
	period: ''
};

const ACDataInit = {
	companyName: [],
	jobTitle: [],
	expAreaInput: [],
};

FormExp.propTypes = {
	itemData: PropTypes.object,
	createMode: PropTypes.bool,
	simpleMode: PropTypes.bool,
};

FormExp.defaultProps = {
	itemData: { type: 'exp' },
	createMode: false,
	simpleMode: false
};

export default CSSModules(FormExp, css, { allowMultiple: true });
