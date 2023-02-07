import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField, RadioGroup, DropList } from 'c_wap_module';
import chronicleUtil from './chronicleUtil';
import dateUnit from 'src/util/date';
import { addChronicleExp, updateChronicleExp, loadChronicleHonor } from 'src/client/actions/chronicle';
import { loadProfile } from 'src/client/actions/profile';
import { createFromPromotion, onchangeFromPromotion, initialFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';

class chronicleEditFormExp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ACData: {
				companyName: [],
				jobTitle: [],
				expAreaInput: []
			},
			data: {},
			errorMessage: { companyName: '', jobTitle: '', startYear: 'dropList', startMonth: 'dropList', endYear: 'dropList', endMonth: 'dropList', period: '' },
			privacySettingData: [{ label: '公開', value: 1, iconFont: 'world icon'}, { label: '只限本人', value: 0, iconFont: 'lock icon'}],
			privacySettingIndex: 1, // phase 2 for each item privacy
			yearData: dateUnit.getYearOption(),
			monthData: dateUnit.getMonthOption(),
			finishCallback: props.changeStatus,
			editCompanyNameAc: 0,
			editCompanyAreaAc: 0,
			editJobTitleAc: 0
		};
		this.dateSelect = (selector, selectData) => { this.dateStatusChange(selector, selectData); };
	}
	componentWillMount() {
		this.state.data = this.props.editformClass === 'add' ?
			chronicleUtil.init('exp', this.props.user.pid)
			:
			chronicleUtil.mapping(this.props.itemData.type, this.props.itemData, this.props.user.pid);
	}
	componentDidMount() {
		const scrollNode = document.scrollingElement || document.documentElement || document.body;
		if (this.props.mode !== 'simple') {
			this.refs.exp_edit_main.scrollIntoView();
			scrollNode.scrollTop -= 150;
		}
	}
	onChange(key, value) {
		this.props.onchangeFromPromotion();
		this.state.data[key] = value;
		if (value.length === 0) {
			if (this.state.ACData.hasOwnProperty(key)) {
				this.state.ACData[key] = [];
			}
		} else if ((value.length !== 0 && key === 'companyName') || (value.length !== 0 && key === 'jobTitle')) {
			chronicleUtil.autoComplete(key, value, (e) => {
				this.state.ACData[key] = chronicleUtil.ACData(key, e.Result);
				this.setState({data: this.state.data});
			});
			if (key === 'companyName') {
				this.state.editCompanyNameAc = 0;
			}
			if (key === 'jobTitle') {
				this.state.editJobTitleAc = 0;
			}

		} else if (value.length !== 0 && key === 'expAreaInput') {
			chronicleUtil.autoComplete('area', value, (e) => {
				this.state.ACData[key] = e.hasOwnProperty('LIST') ? chronicleUtil.ACData('area', e.LIST.ITEM) : [];
				this.setState({data: this.state.data});
			});
			if (key === 'expAreaInput') {
				this.state.editCompanyAreaAc = 0;
			}
		}
		this.setState({data: this.state.data});
		if (key === 'expAreaInput') {
			this.state.data.expArea = '';
		}
	}
	onBlur(key, value) {
		if (key === 'companyName' || key === 'jobTitle' || key === 'expAreaInput') {
			this.setState({ACData: { companyName: [], jobTitle: [], expAreaInput: [] }});
		}
	}
	companyNameACItemSelected(value, index) {
		if (this.state.ACData.companyName[index - 1].hasOwnProperty('area')) {
			chronicleUtil.getDesc(this.state.ACData.companyName[index - 1].area, (e) => {

				this.state.data.expAreaInput = e.content[0].descript;
				this.setState({ data: this.state.data });
			});
		}
		if (this.state.ACData.companyName[index - 1].hasOwnProperty('invoice')) {
			this.state.data.invoice = this.state.ACData.companyName[index - 1].invoice;
		}
		if (this.state.ACData.companyName[index - 1].hasOwnProperty('emp_no')) {
			this.state.data.companySize = this.state.ACData.companyName[index - 1].emp_no;
		}
		if (this.state.ACData.companyName[index - 1].hasOwnProperty('industry')) {
			this.state.data.indCat = this.state.ACData.companyName[index - 1].industry;
		}
		if (this.state.ACData.companyName[index - 1].hasOwnProperty('zone')) {
			this.state.data.publicStock = this.state.ACData.companyName[index - 1].zone;
		}
		this.state.data.companyName = value;
		this.state.editCompanyNameAc = 1;

		this.setState({ACData: { companyName: [], jobTitle: [], expAreaInput: [] }});
	}
	areaACItemSelected(value, index) {
		if (this.state.ACData.expAreaInput[index - 1].hasOwnProperty('PRIMARYKEY104')) {
			this.state.data.expArea = this.state.ACData.expAreaInput[index - 1].PRIMARYKEY104;
		}
		this.state.data.expAreaInput = value;
		this.setState({ACData: { companyName: [], jobTitle: [], expAreaInput: [] }});
		this.state.editCompanyAreaAc = 1;
	}
	jobTitleACItemSelected(value, index) {
		if (this.state.ACData.jobTitle[index - 1].hasOwnProperty('job_cat')) {
			this.state.data.jobCat = this.state.ACData.jobTitle[index - 1].job_cat;
		}
		this.state.data.jobTitle = value;
		this.setState({ACData: { companyName: [], jobTitle: [], expAreaInput: [] }});
		this.state.editJobTitleAc = 1;
	}
	dateStatusChange(selector, selectData) {
		this.state.data[selector] = selectData.value;
		this.state.errorMessage[selector] = 'dropList';
		const startTime = this.state.data.startYear.toString() + ((this.state.data.startMonth.toString().length === 1) ? `0${this.state.data.startMonth.toString()}` : this.state.data.startMonth.toString());
		const endTime = this.state.data.endYear.toString() + ((this.state.data.endMonth.toString().length === 1) ? `0${this.state.data.endMonth.toString()}` : this.state.data.endMonth.toString());
		if (startTime.length > 4 && endTime.length > 4 && parseInt(startTime, 10) > parseInt(endTime, 10)) {
			this.state.errorMessage.period = '開始時間不得超過結束時間';
		} else {
			this.state.errorMessage.period = '';
		}
		this.setState({errorMessage: this.state.errorMessage, data: this.state.data});
	}
	checkboxSelect(key, obj) {
		this.state.data[key] = chronicleUtil.checkboxChange(key, obj);
		const startTime = this.state.data.startYear.toString() + ((this.state.data.startMonth.toString().length === 1) ? `0${this.state.data.startMonth.toString()}` : this.state.data.startMonth.toString());
		const endTime = this.state.data.endYear.toString() + ((this.state.data.endMonth.toString().length === 1) ? `0${this.state.data.endMonth.toString()}` : this.state.data.endMonth.toString());
		if (startTime.length > 4 && endTime.length > 4 && parseInt(startTime, 10) > parseInt(endTime, 10)) {
			this.state.errorMessage.period = '開始時間不得超過結束時間';
		} else {
			this.state.errorMessage.period = '';
		}
		this.setState({errorMessage: this.state.errorMessage, data: this.state.data});
	}
	privacySettingChange(data) {
		this.state.data.privacySetting = data.value;
	}
	cancelEdit() {
		this.props.createFromPromotion({ promotion: 'none' });
		if (typeof this.state.finishCallback !== 'undefined') {
			this.state.finishCallback();
		}
	}
	submit() {
		const checkStatus = chronicleUtil.businessLogicCheck('exp', this.state.data);
		if (checkStatus.result) {
			if (this.state.data.stillWork) {
				this.state.data.endYear = '';
				this.state.data.endMonth = '';
			}
			this.props.editformClass === 'add' ?
			this.props.addChronicleExp(this.state.data).then(() => {
				this.props.loadProfile({ pid: this.props.user.pid });
				this.props.loadChronicleHonor({pid: this.props.user.pid, targetPid: this.props.params.pid });
			})
			:
			this.props.updateChronicleExp(this.state.data).then(() => {
				this.props.loadProfile({ pid: this.props.user.pid });
				this.props.loadChronicleHonor({pid: this.props.user.pid, targetPid: this.props.params.pid });
			});

			this.props.initialFromPromotion();
			if (typeof this.state.finishCallback !== 'undefined') {
				this.state.finishCallback();
			}
			window._elog.push({
				web: 'plus',
				track: ['editCompanyName'],
				ext: {
					companyName: this.state.data.companyName,
					companyId: this.state.data.invoice,
					pid: this.props.user.pid,
					ac: this.state.editCompanyNameAc,
					ts: (new Date()).getTime()
				}
			});
			window._elog.push({
				web: 'plus',
				track: ['editCompanyArea'],
				ext: {
					companyName: this.state.data.companyName,
					companyId: this.state.data.invoice,
					pid: this.props.user.pid,
					ac: this.state.editCompanyNameAc,
					area: this.state.data.expArea,
					ts: (new Date()).getTime()
				}
			});
			window._elog.push({
				web: 'plus',
				track: ['editJobTitle'],
				ext: {
					jobTitle: this.state.data.jobTitle,
					jobcat: this.state.data.jobCat,
					pid: this.props.user.pid,
					ac: this.state.editCompanyNameAc,
					ts: (new Date()).getTime()
				}
			});
		} else {
			this.setState({errorMessage: checkStatus.errorMessage});
		}
	}
	render() {
		return (
			<div ref="exp_edit_main" styleName="form_edit_main" className={ (this.props.mode === 'simple') ? css.simple_mode : '' }>
				<div styleName="row_block">
					<div styleName="title">公司名稱<span styleName="star">*</span></div>
					<div>
						<TextField
							name="companyName"
							value={ this.state.data.companyName }
							placeHolder="公司名稱"
							onChange={ this.onChange.bind(this) }
							onBlur={ this.onBlur.bind(this) }
							ACData={ this.state.ACData.companyName }
							onSelected={ this.companyNameACItemSelected.bind(this) }
							errorMessage={ this.state.errorMessage.companyName }
							styleName="textField"
						/>
					</div>
				</div>
				<div styleName="row_block" className={ (this.props.mode === 'simple') ? css.simple_mode : '' }>
					<div styleName="title">地區</div>
					<div>
						<TextField
							name="expAreaInput"
							value={ this.state.data.expAreaInput }
							placeHolder="公司地區"
							onChange={ this.onChange.bind(this) }
							onBlur={ this.onBlur.bind(this) }
							onSelected={ this.areaACItemSelected.bind(this) }
							ACData={ this.state.ACData.expAreaInput }
							styleName="textField"
						/>
					</div>
				</div>
				<div styleName="row_block">
					<div styleName="title">職務名稱<span styleName="star">*</span></div>
					<div>
						<TextField
							name="jobTitle"
							value={ this.state.data.jobTitle }
							placeHolder="職務名稱"
							onChange={ this.onChange.bind(this) }
							onBlur={ this.onBlur.bind(this) }
							ACData={ this.state.ACData.jobTitle }
							onSelected={ this.jobTitleACItemSelected.bind(this) }
							errorMessage={ this.state.errorMessage.jobTitle }
							styleName="textField"
						/>
					</div>
				</div>
				<div styleName="row_block">
					<div styleName="title">在職期間<span styleName="star">*</span></div>
					<div styleName="date_row">
						<div styleName="dateItem">
							<DropList
								listContent={ this.state.yearData }
								onSelected={ this.dateSelect.bind(this, 'startYear') }
								defaultIndex={ chronicleUtil.dropListDefaultIndex(this.state.data.startYear, this.state.yearData) }
								styleName={ this.state.errorMessage.startYear }
								placeHolder="起始年"
								width={ 85 }
							/>
						</div>
						<div styleName="dateItem">
							<DropList
								listContent={ this.state.monthData }
								onSelected={ this.dateSelect.bind(this, 'startMonth') }
								defaultIndex={ chronicleUtil.dropListDefaultIndex(this.state.data.startMonth, this.state.monthData) }
								styleName={ this.state.errorMessage.startMonth }
								placeHolder="月"
								width={ 65 }
							/>
						</div>
						<div styleName="dateItem">
						-
						</div>
						<div styleName="dateItem">
							<DropList
								listContent={ this.state.yearData }
								onSelected={ this.dateSelect.bind(this, 'endYear') }
								defaultIndex={ chronicleUtil.dropListDefaultIndex(this.state.data.endYear, this.state.yearData) }
								styleName={ this.state.errorMessage.endYear }
								placeHolder="結束年"
								disabled={ this.state.data.stillWork }
								width={ 85 }
							/>
						</div>
						<div styleName="dateItem">
							<DropList
								listContent={ this.state.monthData }
								onSelected={ this.dateSelect.bind(this, 'endMonth') }
								defaultIndex={ chronicleUtil.dropListDefaultIndex(this.state.data.endMonth, this.state.monthData) }
								styleName={ this.state.errorMessage.endMonth }
								placeHolder="月"
								disabled={ this.state.data.stillWork }
								width={ 65 }
							/>
						</div>
						<div styleName="dateItem">
							<RadioGroup
								group={ [{label: '仍在職', value: true, checked: this.state.data.stillWork}] }
								name="checkbox"
								checkedIndex={ this.state.data.stillWork ? 1 : 0 }
								onSelected={ this.checkboxSelect.bind(this, 'stillWork') }
								checkBox
							/>
						</div>
					</div>
					{
						(this.state.errorMessage.period !== '' || this.state.errorMessage.period != null) &&
						<div styleName="errormessage">{ this.state.errorMessage.period }</div>
					}
				</div>
				<div styleName="row_block" className={ (this.props.mode === 'simple') ? css.simple_mode : '' }>
					<div styleName="title">
						工作內容：你可以參考<a href={ `${clientConfig.params.e104Url}/jb/jobwiki/nav` } target="_blank" rel="noopener noreferrer">職務內容</a>填寫
					</div>
					<div styleName="description">
						<TextField
							name="jobNote"
							value={ this.state.data.jobNote }
							onChange={ this.onChange.bind(this) }
							onBlur={ this.onBlur.bind(this) }
							maxWords={ 1000 }
							allowMultiLine
						/>
					</div>
				</div>
				{/* for phase 2 each item privacy setting
				<span className={(this.props.mode === 'simple')? 'hide' : '' }>
					<span className="dropListSpan">
						<DropList
							listContent={ this.state.privacySettingData }
							onSelected={ this.privacySettingChange.bind(this)}
							defaultIndex={ chronicleUtil.dropListDefaultIndex(this.state.data.privacySetting, this.state.privacySettingData) }
							width="125px"
							styleName="dropList">
						</DropList>
					</span>
				</span>
				*/}
				<div styleName="btn_row action_btn">
					<button className="mini ui primary button" onClick={ this.submit.bind(this) } data-gtm-index="儲存 經歷">儲存</button>
					<button className="mini ui button" onClick={ this.cancelEdit.bind(this) } data-gtm-index="略過 經歷">
						{ this.props.cancelButtonText }
					</button>
				</div>
			</div>
		);
	}
}

chronicleEditFormExp.propTypes = {
	editformClass: PropTypes.string,
	cancelButtonText: PropTypes.string,
	mode: PropTypes.string,
};

chronicleEditFormExp.defaultProps = {
	editformClass: 'add',
	cancelButtonText: '取消',
	mode: 'normal'
};

const action = {
	addChronicleExp,
	updateChronicleExp,
	loadChronicleHonor,
	loadProfile,
	createFromPromotion,
	onchangeFromPromotion,
	initialFromPromotion
};

export default compose(
	connect(null, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(chronicleEditFormExp);
