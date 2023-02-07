import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField, RadioGroup, DropList } from 'c_wap_module';
import dateUnit from 'src/util/date';
import chronicleUtil from './chronicleUtil';
import { addChronicleEdu, updateChronicleEdu, loadChronicleHonor } from 'src/client/actions/chronicle';
import { loadProfile } from 'src/client/actions/profile';
import { createFromPromotion, onchangeFromPromotion, initialFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

class chronicleEditFormEdu extends React.Component {
	constructor(props){
		super();
		this.state = {
			ACData: {
				schoolName: [],
				major: [],
				eduAreaInput: []
			},
			data: {},
			errorMessage: { schoolName: '', major: '', startYear: 'dropList', startMonth: 'dropList', endYear: 'dropList', endMonth: 'dropList', period: '', degree: 'dropList', degreeError: ''},
			radioData: [{label: '畢業', value: 1}, {label: '肄業', value: 2}, {label: '在學中', value: 3}],
			privacySettingData: [{ label: '公開', value: 1, iconFont: 'world icon'}, { label: '只限本人', value: 0, iconFont: 'lock icon'}],
			privacySettingIndex: 1,
			degreeData: [{ label: '博士', value: 32}, { label: '碩士', value: 16},	{ label: '大學', value: 8}, { label: '專科', value: 4}, { label: '高中職', value: 2}, { label: '高中以下', value: 1}],
			yearData: dateUnit.getYearOption(),
			monthData: dateUnit.getMonthOption(),
			finishCallback: props.changeStatus,
			editSchoolNameAc: 0,
			editSchoolAreaAc: 0,
			editMajorNameAc: 0,
		}
		this.dateSelect = (selector, selectData) => { this.dateStatusChange(selector, selectData); };
	}
	componentWillMount() {
		this.state.data = (this.props.editformClass === 'add') ?
			chronicleUtil.init('edu', this.props.user.pid)
			:
			chronicleUtil.mapping('edu', this.props.itemData, this.props.user.pid);
		this.state.radioData[this.state.data.degreeStatus - 1].checked = true;
	}
	componentDidMount() {
		const scrollNode = document.scrollingElement || document.documentElement || document.body;
		if (this.props.mode !== 'simple') {
			this.refs.edu_edit_main.scrollIntoView();
			scrollNode.scrollTop -= 100;
		}
	}
	onChange(key, value) {
		this.props.onchangeFromPromotion();
		this.state.data[key] = value;
		if (value.length === 0) {
			if (this.state.ACData.hasOwnProperty(key)) {
				this.state.ACData[key] = [];
			}
		} else if ((value.length !== 0 && key === 'schoolName') || (value.length !== 0 && key === 'major')) {
			chronicleUtil.autoComplete(key, value, (e) => {
				this.state.ACData[key] = chronicleUtil.ACData(key, e.Result);
				this.setState({	data: this.state.data});
			});
			if (key === 'schoolName')	this.state.editSchoolNameAc = 0;
			if (key === 'major') this.state.editMajorNameAc = 0;
		} else if (value.length !== 0 && key === 'eduAreaInput') {
			chronicleUtil.autoComplete('area', value, (e) => {
				this.state.ACData[key] = e.hasOwnProperty('LIST') ? chronicleUtil.ACData('area', e.LIST.ITEM) : [];
				this.setState({	data: this.state.data});
			});
			this.state.editSchoolAreaAc = 0;
		}
		this.setState({	data: this.state.data});
		if (key === 'eduAreaInput') this.state.data.eduArea = '';
	}
	onBlur(key) {
		if (key === 'schoolName' || key === 'major' || key === 'eduAreaInput') this.setState({ACData: { companyName: [], jobTitle: [], eduAreaInput: [] }});
	}
	schoolNameACItemSelected(value, index) {
		if (this.state.ACData.schoolName[index-1].hasOwnProperty('area')) {
			this.state.data.eduArea = this.state.ACData.schoolName[index - 1].area;
			chronicleUtil.getDesc(this.state.ACData.schoolName[index - 1].area, (e) => {
				this.state.data.eduAreaInput = e.content[0].descript;
				this.setState({	data: this.state.data });
			});
		}
		if (this.state.ACData.schoolName[index - 1].hasOwnProperty('sid')) {
			this.state.data.schoolId = this.state.ACData.schoolName[index - 1].sid;
		}
		this.state.data['schoolName'] = value;
		this.state.editSchoolNameAc = 1;
		this.setState({ACData: { schoolName: [], major: [], eduAreaInput: [] }});
	}
	areaACItemSelected(value, index) {
		this.state.data['eduAreaInput'] = value;
		if (this.state.ACData.eduAreaInput[index - 1].hasOwnProperty('PRIMARYKEY104')) {
			this.state.data.eduArea = this.state.ACData.eduAreaInput[index - 1].PRIMARYKEY104;
		}
		this.setState({ACData: { schoolName: [], major: [], eduAreaInput: [] }});
		this.state.editSchoolAreaAc = 1;
	}
	majorACItemSelected(value, index) {
		if (this.state.ACData.major[index - 1].hasOwnProperty('fun_no')) {
			this.state.data.majorCat = this.state.ACData.major[index - 1].fun_no;
		}
		if (this.state.ACData.major[index-1].hasOwnProperty('mid')){
			this.state.data.majorId = this.state.ACData.major[index - 1].mid;
		}
		this.state.data['major'] = value;
		this.setState({ACData: { schoolName: [], major: [], eduAreaInput: [] }});
		this.state.editMajorNameAc = 1;
	}
	radioSelect(obj) {
		this.state.data.degreeStatus = obj[0].value;
		if (this.state.data.degreeStatus === 3 || this.state.data.degreeStatus === '3') {
			this.state.errorMessage.endYear = 'dropList';
			this.state.errorMessage.endMonth = 'dropList';
			this.state.errorMessage.period = '';
		}
		this.state.endYearDefaultIndex = chronicleUtil.dropListDefaultIndex(this.state.data.endYear, this.state.yearData);
		this.state.endMonthDefaultIndex = chronicleUtil.dropListDefaultIndex(this.state.data.endMonth, this.state.monthData);
		this.setState({data: this.state.data, errorMessage: this.state.errorMessage});
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
	degreeStatusChange(selectData) {
		this.state.data.degree = selectData.value;
		this.state.errorMessage.degree = 'dropList';
		if (selectData.value == 2 && this.state.data.major == '') this.state.data.major = '普通科';
		this.state.errorMessage.degreeError = '';
		this.setState({data: this.state.data, errorMessage: this.state.errorMessage});
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

		const checkStatus = chronicleUtil.businessLogicCheck('edu', this.state.data);
		if (checkStatus.result) {
			if (this.state.data.degreeStatus === 3 || this.state.data.degreeStatus === '3') {
				this.state.data.endYear = '';
				this.state.data.endMonth = '';
			}
			if (this.state.data.degree === 1 || this.state.data.degree === '1') this.state.data.major = '';
			(this.props.editformClass === "add") ?
				this.props.addChronicleEdu(this.state.data).then(() => {
					this.props.loadProfile({pid: this.props.user.pid});
					this.props.loadChronicleHonor({pid: this.props.user.pid, targetPid: this.props.user.pid});
				})
				:
				this.props.updateChronicleEdu(this.state.data).then(() => {
					this.props.loadProfile({pid: this.props.user.pid});
					this.props.loadChronicleHonor({pid: this.props.user.pid, targetPid: this.props.user.pid});
				});

			this.props.initialFromPromotion();
			if (typeof this.state.finishCallback !== 'undefined') {
				this.state.finishCallback();
			}
			window._elog.push({
				web    : "plus",
				track  : ["editSchoolName"],
				ext    : {
					schoolName : this.state.data.schoolName,
					pid :this.props.user.pid,
					ac: this.state.editSchoolNameAc,
					ts:(new Date()).getTime()
				}
			});
			window._elog.push({
				web    : "plus",
				track  : ["editSchoolArea"],
				ext    : {
					schoolName : this.state.data.schoolName,
					pid :this.props.user.pid,
					ac: this.state.editSchoolAreaAc,
					area: this.state.data.eduArea,
					ts:(new Date()).getTime()
				}
			});
			window._elog.push({
				web    : "plus",
				track  : ["editMajorName"],
				ext    : {
					majorName:this.state.data.major,
					pid :this.props.user.pid,
					ac: this.state.editMajorNameAc,
					ts:(new Date()).getTime()
				}
			});

		}else{
			this.setState({errorMessage: checkStatus.errorMessage});
		}
	}
	render() {
		return (
			<div ref="edu_edit_main" styleName="form_edit_main" className={ (this.props.mode === 'simple') ? css.simple_mode : '' }>
				<div styleName="row_block">
					<div styleName="title">
						學校名稱<span styleName="star">*</span>
					</div>
					<div styleName="textItem">
						<TextField
							name="schoolName"
							value={ this.state.data.schoolName }
							placeHolder="學校名稱"
							onChange={ this.onChange.bind(this) }
							onBlur={ this.onBlur.bind(this) }
							ACData={ this.state.ACData.schoolName }
							onSelected={ this.schoolNameACItemSelected.bind(this) }
							errorMessage={ this.state.errorMessage.schoolName }
							styleName="textField"
						/>
					</div>
					<div styleName="textItem">
						<DropList
							listContent={ this.state.degreeData }
							onSelected={ this.degreeStatusChange.bind(this) }
							defaultIndex={ chronicleUtil.dropListDefaultIndex(this.state.data.degree, this.state.degreeData) }
							styleName={ this.state.errorMessage.degree }
							placeHolder="請選擇學歷"
						/>
						{
							((this.state.errorMessage.degreeError !== '') || (this.state.errorMessage.degreeError !== null)) &&
							<div styleName="errormessage">{this.state.errorMessage.degreeError}</div>
						}
					</div>
				</div>
				{
					this.props.mode !== 'simple' &&
					<div styleName="row_block">
						<div styleName="title">地區</div>
						<div>
							<TextField
								name="eduAreaInput"
								value={ this.state.data.eduAreaInput }
								placeHolder="學校地區"
								onChange={ this.onChange.bind(this) }
								onBlur={ this.onBlur.bind(this) }
								ACData={ this.state.ACData.eduAreaInput }
								onSelected={ this.areaACItemSelected.bind(this) }
								styleName="textField"
							/>
						</div>
					</div>
				}
				{
					this.state.data.degree != 1 &&
					<div styleName="row_block">
						<div styleName="title">科系名稱<span styleName="star">*</span></div>
						<div>
							<TextField
								name="major"
								value={ this.state.data.major }
								placeHolder="科系名稱"
								onChange={ this.onChange.bind(this) }
								onBlur={ this.onBlur.bind(this) }
								ACData={ this.state.ACData.major }
								onSelected={ this.majorACItemSelected.bind(this) }
								errorMessage={ this.state.errorMessage.major }
								styleName="textField"
							/>
						</div>
					</div>
				}
				<div styleName="row_block">
					<div styleName="title">就學狀態<span styleName="star">*</span></div>
					<div>
						<div styleName="drgreeItem">
							<RadioGroup
								group={ this.state.radioData }
								name="radio"
								onSelected={ this.radioSelect.bind(this) }
								custom={ false }
							/>
						</div>
					</div>
				</div>
				<div styleName="row_block">
					<div styleName="title">就學期間<span styleName="star">*</span></div>
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
								disabled={ this.state.data.degreeStatus === 3 || this.state.data.degreeStatus === '3' }
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
								disabled={ this.state.data.degreeStatus === 3 || this.state.data.degreeStatus === '3' }
								width={ 65 }
							/>
						</div>
						<div styleName="dateItem"></div>
					</div>
					{
						((this.state.errorMessage.period !== '') || (this.state.errorMessage.period !== null)) &&
						<div styleName="errormessage">{this.state.errorMessage.period}</div>
					}
				</div>
				{/*
				<span className={ (this.props.mode === 'simple') ? 'hide' : '' }>
					<span className="dropListSpan">
						<DropList
							listContent={ this.state.privacySettingData }
							onSelected={ this.privacySettingChange.bind(this) }
							defaultIndex={ chronicleUtil.dropListDefaultIndex(this.state.data.privacySetting, this.state.privacySettingData) }
							width="125px"
							styleName="dropList"
						/>
					</span>
				</span>
				*/}
				<div styleName="btn_row action_btn">
					<button className="mini ui primary button" onClick={ this.submit.bind(this) } data-gtm-index="儲存 學歷">儲存</button>
					<button className="mini ui button" onClick={ this.cancelEdit.bind(this) } data-gtm-index="略過 學歷">
						{ this.props.cancelButtonText }
					</button>
				</div>
			</div>
		);
	}
}

chronicleEditFormEdu.propTypes = {
	editformClass: PropTypes.string,
	cancelButtonText: PropTypes.string,
	mode: PropTypes.string,
	changeStatus: PropTypes.func
};

chronicleEditFormEdu.defaultProps = {
	editformClass: 'add',
	cancelButtonText: '取消',
	mode: 'normal'
};

const action = {
	addChronicleEdu,
	updateChronicleEdu,
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
)(chronicleEditFormEdu);
