import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField, NewRadioGroup, DropList, LightBox } from 'c_wap_module';
import chronicleUtil from './chronicleUtil';
import dateUnit from 'src/util/date';
import { addChronicleHonor, updateChronicleHonor } from 'src/client/actions/chronicle';
import { loadProfile } from 'src/client/actions/profile';
import { createFromPromotion, onchangeFromPromotion, initialFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

class chronicleEditFormHonor extends React.Component {
	constructor(props) {
		super();
		this.state = {
			data: {},
			errorMessage: {title: '', startYear: 'dropList', startMonth: 'dropList', endYear: 'dropList', endMonth: 'dropList', period: '', description: '', relation: ''},
			radioData: [{label: '管理', value: '管理'}, {label: '專案', value: '專案'}, {label: '競賽', value: '競賽'}, {label: '顧問', value: '顧問'}, {label: '學術', value: '學術'}],
			radioIndex: 0,
			privacySettingData: [{ label: '公開', value: 1, iconFont: 'world icon'}, { label: '只限本人', value: 0, iconFont: 'lock icon'}],
			privacySettingIndex: 1,
			relationOptionData: chronicleUtil.relationListInit(props.chronicle.exp.concat(props.chronicle.edu)),
			relationIndex: 0,
			relationStartTime: '',
			relationEndTime: '',
			tagListCustomText: '',
			yearData: dateUnit.getYearOption(),
			monthData: dateUnit.getMonthOption(),
			finishCallback: props.changeStatus,
			showErrorAlert: false,
		}
		this.dateSelect = (selector, selectData) => { this.dateStatusChange(selector, selectData); };
	}
	componentWillMount() {
		this.props.editformClass === "add" ? this.state.data = chronicleUtil.init('honor', this.props.user.pid) : this.state.data = chronicleUtil.mapping('honor', this.props.itemData, this.props.user.pid);
		this.state.radioIndex += parseInt((chronicleUtil.radioDefaultMapping(this.state.data.tagList[0], this.state.radioData)), 10);
		if (this.state.radioIndex === this.state.radioData.length) {
			this.state.tagListCustomText = this.state.data.tagList[0];
		}
		// else {
		// 	this.state.radioData[this.state.radioIndex].checked = true;
		// }
		this.state.privacySettingIndex = chronicleUtil.dropListDefaultIndex(this.state.data.privacySetting, this.state.privacySettingData);
		this.state.relationIndex = chronicleUtil.dropListDefaultIndex(this.state.data.relationId, this.state.relationOptionData);
		if (this.props.editformClass === 'edit' && this.props.itemData.hasOwnProperty('relation') && this.props.itemData.relation !== null) {
			this.state.relationStartTime = JSON.stringify(this.props.itemData.relation.startYear) +  JSON.stringify(this.props.itemData.relation.startMonth);
			this.state.relationEndTime = JSON.stringify(this.props.itemData.relation.endYear) +  JSON.stringify(this.props.itemData.relation.endMonth);
		}
	}
	componentDidMount() {
		const scrollNode = document.scrollingElement || document.documentElement || document.body;
		if (!this.props.simpleMode) {
			this.refs.form_edit_main_honor.scrollIntoView();
			scrollNode.scrollTop -= 100;
		}
	}
	onChange(key, value) {
		this.props.onchangeFromPromotion();
		this.state.data[key] = value;
		this.setState({ data: this.state.data });
	}
	onBlur(key, value) {
		this.state.data[key] = value;
		this.setState({	data: this.state.data });
	}
	privacySettingChange(data) {
		this.state.data.privacySetting = data.value;
	}
	radioSelect(value, index) {
		let tag = [];
		tag[0] = value;
		this.state.data.tagList = tag;
		this.setState({
			data: this.state.data,
			radioIndex: index
		});
	}
	periodCheck(){
		const startTime = this.state.data.startYear.toString() + ((this.state.data.startMonth.toString().length === 1) ? `0${this.state.data.startMonth.toString()}` : this.state.data.startMonth.toString());
		const endTime = this.state.data.endYear.toString() + ((this.state.data.endMonth.toString().length === 1) ? `0${this.state.data.endMonth.toString()}` : this.state.data.endMonth.toString());
		if (startTime.length > 4 && endTime.length > 4 && parseInt(startTime, 10) > parseInt(endTime, 10)) {
			this.state.errorMessage.period = '開始時間不得超過結束時間';
		} else if (startTime.length > 4 && endTime.length > 4 && this.state.relationStartTime.length > 4 && this.state.relationEndTime.length > 4 && (parseInt(startTime, 10)) <= (parseInt(endTime, 10))) {
			if (parseInt(this.state.relationStartTime, 10) <= (parseInt(startTime, 10)) && (parseInt(endTime, 10)) <= parseInt(this.state.relationEndTime, 10)) {
				this.state.errorMessage.period = '';
			} else {
				this.state.errorMessage.period = '所屬連結的學經歷與職涯成就的時間不符';
			}
		}	else {
			this.state.errorMessage.period = '';
		}
		this.setState({errorMessage: this.state.errorMessage});
	}
	relationChange(data) {
		if (data.value != null) {
			this.state.data.relationId = data.value;
			this.state.relationStartTime = (data.startTime.length === 5) ? data.startTime.slice(0, 4) + '0' + data.startTime.slice(4) : data.startTime;
			this.state.relationEndTime = (data.endTime.length === 5) ? data.endTime.slice(0, 4) + '0' + data.endTime.slice(4) : data.endTime;
			this.periodCheck();
		} else {
			this.state.data.relationId = '';
			this.state.relationIndex = chronicleUtil.dropListDefaultIndex(this.state.data.relationId, this.state.relationOptionData);
			this.state.errorMessage.period = '';
			this.state.relationStartTime = '';
			this.state.relationEndTime = '';
			this.setState({relationIndex: this.state.relationIndex, errorMessage: this.state.errorMessage});
		}
	}
	dateStatusChange(selector, selectData) {
		this.state.data[selector] = selectData.value;
		this.state.errorMessage[selector] = 'dropList';
		this.periodCheck();
		this.setState({errorMessage: this.state.errorMessage, data: this.state.data});
	}
	cancelEdit() {
		this.props.createFromPromotion({ promotion: 'none' });
		if (typeof this.state.finishCallback !== 'undefined') {
			this.state.finishCallback();
		}
	}
	handleLightBoxCancel() {
		this.setState({showErrorAlert: false});
	}
	submit() {
		if (this.state.data.tagList[0] === '') {
			this.state.tagListCustomText = '';
			this.setState({	showErrorAlert: true });
			return false;
		}
		if (this.state.data.tagList[0].length >= 11) {
			this.state.tagListCustomText = this.state.data.tagList[0];
			this.setState({	showErrorAlert: true });
			return false;
		}
		const checkStatus = chronicleUtil.businessLogicCheck('honor', this.state.data);
		if (checkStatus.result) {
			this.props.editformClass === 'add' ?
				this.props.addChronicleHonor(this.state.data).then(() => {
					this.props.loadProfile({ pid: this.props.user.pid });
				})
				:
				this.props.updateChronicleHonor(this.state.data).then(() => {
					this.props.loadProfile({ pid: this.props.user.pid });
				});
			this.props.initialFromPromotion();
			if (typeof this.state.finishCallback !== 'undefined') {
				this.state.finishCallback();
			}
		} else {
			this.state.errorMessage = checkStatus.errorMessage;
			this.setState({errorMessage: this.state.errorMessage});
		}
	}

	render() {
		const lightboxOption = {
			title: '錯誤提示',
			closeIcon: true  // 有無close ICON,
		};
		const errorMsg = (this.state.data.tagList[0].length === 0) ? '自訂標籤請填寫內容，欄位不可為空' : '自訂標籤內容過長，上限為10字。';
		return (
			<div ref="form_edit_main_honor" styleName="form_edit_main_honor" className={ (this.props.simpleMode) ? css.simple_mode : '' }>
				<div styleName="row_block">
					<div styleName="title">主題名稱<span styleName="star">*</span></div>
					<div>
						<TextField
							name="title"
							value={ this.state.data.title }
							placeHolder="主題名稱"
							onChange={ this.onChange.bind(this) }
							onBlur={ this.onBlur.bind(this) }
							errorMessage={ this.state.errorMessage.title }
							styleName="textField"
						/>
					</div>
				</div>
				<div styleName="row_block">
					<div styleName="title">標籤<span styleName="star">*</span></div>
					<div>
						<NewRadioGroup
							group={ this.state.radioData }
							name="radio"
							onSelected={ this.radioSelect.bind(this) }
							customValue={ this.state.tagListCustomText }
							defaultChecked={ this.state.radioIndex }
							custom
						/>
					</div>
				</div>
				<div styleName="row_block">
					<div styleName="title">發生期間<span styleName="star">*</span></div>
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
								width={ 65 }
							/>
						</div>
						<div styleName="dateItem"></div>
					</div>
					{
						(this.state.errorMessage.period !== '' || this.state.errorMessage.period !== null) &&
						<div styleName="errormessage">{this.state.errorMessage.period}</div>
					}
				</div>
				<div styleName="row_block" className={ (this.props.simpleMode) ? 'hide' : '' }>
					<div styleName="title">所屬單位</div>
					<div>
						<DropList
							listContent={ this.state.relationOptionData }
							onSelected={ this.relationChange.bind(this) }
							defaultIndex={ this.state.relationIndex }
							disabled={ this.state.relationOptionData.length === 0 }
							styleName="dropList"
							placeHolder="請填寫對應的學經歷"
							width="290px"
						/>
					</div>
					{
						(this.state.errorMessage.relation != '' || this.state.errorMessage.relation != null) &&
						<div styleName="errormessage">{this.state.errorMessage.relation}</div>
					}
				</div>
				<div styleName="row_block">
					<div styleName="title">內容描述<span styleName="star">*</span></div>
					<div styleName="description">
						<TextField
							name="description"
							value={ this.state.data.description }
							onChange={ this.onChange.bind(this) }
							onBlur={ this.onBlur.bind(this) }
							allowMultiLine
							maxWords={ 1000 }
							errorMessage={ this.state.errorMessage.description }
						/>
					</div>
				</div>
				{/*
				<span className={ (this.props.mode === 'simple') ? 'hide' : '' }>
					<span className="dropListSpan">
						<DropList
							listContent={ this.state.privacySettingData }
							onSelected={ this.privacySettingChange.bind(this)}
							defaultIndex={ this.state.privacySettingIndex }
							width="125px"
							styleName="dropList"
						/>
					</span>
				</span>
				*/}
				<div styleName="btn_row action_btn">
					<button className="mini ui primary button" onClick={ this.submit.bind(this) } data-gtm-index="儲存 職涯成就">儲存</button>
					<button className="mini ui button" onClick={ this.cancelEdit.bind(this) } data-gtm-index="略過 職涯成就">
						{ this.props.cancelButtonText }
					</button>
				</div>
				{
					this.state.showErrorAlert &&
					<LightBox refs="lightbox" option={ lightboxOption } onClose={ this.handleLightBoxCancel.bind(this) } >
						{errorMsg}
					</LightBox>
				}
			</div>
		);
	}
}

chronicleEditFormHonor.propTypes = {
	editformClass: PropTypes.string,
	cancelButtonText: PropTypes.string,
	simpleMode: PropTypes.bool,
	changeStatus: PropTypes.func,
	user: PropTypes.object,
	chronicle: PropTypes.object
};

chronicleEditFormHonor.defaultProps = {
	editformClass: 'add',
	cancelButtonText: '取消',
	simpleMode: false
};

const action = { addChronicleHonor, updateChronicleHonor, loadProfile, createFromPromotion, onchangeFromPromotion, initialFromPromotion };

export default compose(
	connect(null, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(chronicleEditFormHonor);
