import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './formunit.css';
import { RadioGroup, DropList } from 'c_wap_module';
import { dropListDefault, checkboxSelect } from './util';
import dateUnit from 'src/util/date';

class DatePicker extends React.Component {
	constructor(props) {
		super(props);
		this.selectStartYear = obj => this.dateSelect('startYear', obj.value);
		this.selectEndYear = obj => this.dateSelect('startMonth', obj.value);
		this.selectStartMonth = obj => this.dateSelect('endYear', obj.value);
		this.selectEndMonth = obj => this.dateSelect('endMonth', obj.value);
		this.selectWorkStatus = obj => this.dateSelect('stillWork', checkboxSelect('stillWork', obj));
	}
	dateSelect(key, value) {
		const { data } = this.props;
		this.props.updateTrigger(key, value);
		const startTime = data.startYear.toString() + ((data.startMonth.toString().length === 1) ? `0${data.startMonth.toString()}` : data.startMonth.toString());
		const endTime = data.endYear.toString() + ((data.endMonth.toString().length === 1) ? `0${data.endMonth.toString()}` : data.endMonth.toString());
		if (startTime.length > 4 && endTime.length > 4 && (parseInt(startTime, 10) > parseInt(endTime, 10)) && !data.stillWork) {
			this.props.errorTrigger('period', '開始時間不得超過結束時間');
		} else {
			this.props.errorTrigger('period', '');
		}
	}
	render() {
		const { disabled, experienceMode, data, errorMessage, text } = this.props;
		return (
			<div styleName="row_block">
				<div styleName="title">{text}<span styleName="star">*</span></div>
				<div styleName="date_row">
					<div styleName="dateItem">
						<DropList
							listContent={ dateUnit.getYearOption() }
							onSelected={ this.selectStartYear }
							defaultIndex={ dropListDefault(data.startYear, dateUnit.getYearOption()) }
							styleName={ errorMessage.startYear }
							placeHolder="起始年"
							width={ 85 }
						/>
					</div>
					<div styleName="dateItem">
						<DropList
							listContent={ dateUnit.getMonthOption() }
							onSelected={ this.selectEndYear }
							defaultIndex={ dropListDefault(data.startMonth, dateUnit.getMonthOption()) }
							styleName={ errorMessage.startMonth }
							placeHolder="月"
							width={ 65 }
						/>
					</div>
					<div styleName="dateItem">-</div>
					<div styleName="dateItem">
						<DropList
							listContent={ dateUnit.getYearOption() }
							onSelected={ this.selectStartMonth }
							defaultIndex={ dropListDefault(data.endYear, dateUnit.getYearOption()) }
							styleName={ errorMessage.endYear }
							placeHolder="結束年"
							disabled={ disabled }
							width={ 85 }
						/>
					</div>
					<div styleName="dateItem">
						<DropList
							listContent={ dateUnit.getMonthOption() }
							onSelected={ this.selectEndMonth }
							defaultIndex={ dropListDefault(data.endMonth, dateUnit.getMonthOption()) }
							styleName={ errorMessage.endMonth }
							placeHolder="月"
							disabled={ disabled }
							width={ 65 }
						/>
					</div>
					<div styleName="dateItem">
						{
							experienceMode &&
							<RadioGroup
								group={ [{label: '仍在職', value: true, checked: data.stillWork}] }
								name="checkbox"
								checkedIndex={ data.stillWork ? 1 : 0 }
								onSelected={ this.selectWorkStatus }
								checkBox
							/>
						}
					</div>
				</div>
				{
					((errorMessage.period !== '') || (errorMessage.period !== null)) &&
					<div styleName="errormessage">{errorMessage.period}</div>
				}
			</div>
		);
	}
}

DatePicker.propTypes = {
	experienceMode: PropTypes.bool,
	disabled: PropTypes.bool,
	text: PropTypes.string.isRequired,
};

DatePicker.defaultProps = {
	experienceMode: false,
	disabled: false,
	text: '就職期間'
};

export default CSSModules(DatePicker, css, { allowMultiple: true });
