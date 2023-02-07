import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { isEmpty } from 'lodash/lang';

// actions
import { answerPoAPI, reportBrandPoAPI, toAnswerPage, changePoReportAuthority } from 'src/client/actions/test/po';
import { loadUserConfigByType, updatePersonalConfig } from 'src/client/actions/profile';

// components
import { DropList } from 'c_wap_module';
import Chart from 'src/client/component_test/chart';

class Report extends Component {
	constructor(props) {
		super(props);
		this.state = {
			poConfigType: 'e860d463-f17e-460f-b4f8-155be2a70120',
			poConfigResponse: false,
			loading: false
		};

		this.props.loadUserConfigByType({
			pid: this.props.pid,
			typeList: this.state.poConfigType
		}).then(() => {
			this.props.reportBrandPoAPI({
				pid: this.props.pid,
				// 這邊打開就是固定給client端看的資料
				source: 'C'
			}).then(() => {
				this.setState({
					loading: true,
					poConfigResponse: true
				});
			});
		});

		this.handleOnSelected = this.handleOnSelected.bind(this);
	}
	handleOnSelected(data) {
		const {
			pid,
			type,
			createDate,
			updateDate
		} = this.props.config[this.state.poConfigType];

		this.props.updatePersonalConfig({
			pid: this.props.pid,
			updateData: JSON.stringify([{
				value: data.value === 1,
				pid,
				type,
				createDate,
				updateDate,
			}])
		});

		// 當是給企業看時就打B  自己看打C
		this.props.changePoReportAuthority({
			pid: this.props.pid,
			source: data.value === 1 ? 'B' : 'C'
		});
	}
	render() {
		const { report: { conformSimDesc, conformDetDesc } } = this.props;
		return (
			<div className="original_panel">
				<div className="header clearfix">
					<div className="title">
						<h2>組織適性報告</h2>
					</div>
					<div className="options">
						{
							this.props.status.status === 3 &&
							<button
								styleName="report_more"
								className="ui line button"
								onClick={ () => this.props.toAnswerPage() }
							>
								重新測驗
							</button>
						}
						{
							this.state.poConfigResponse &&
							<DropList
								listContent={[
									{label: '給企業看', value: 1},
									{label: '只限本人', value: 2}
								]}
								defaultIndex={this.props.config[this.state.poConfigType].value ? 1 : 2}
								onSelected={ this.handleOnSelected }
								styleName="report_more"
								className="dropListSpan"
								width="125px"
							/>
						}
					</div>
				</div>
				{
					this.state.loading &&
					<div className="body" styleName="test_content flex_content">
						<div styleName="chart">
							{
								this.props.chart.length > 0 &&
								<Chart
									data={ this.props.chart }
									text="組織"
								/>
							}
						</div>
						{
							(!isEmpty(conformSimDesc) && conformDetDesc.length !== 0) &&
							<div styleName="text">
								你的價值觀適合在
								<span>{conformSimDesc[0]}</span>
								的公司工作，因為
								<br /><br />
								<span>你適合的組織類型:</span>
								<br />
								• {conformDetDesc.detFitArr[0]}
								<br /><br />
								{
									conformDetDesc.detRemindArr.length !== 0 &&
									<div>
										<span>提醒你:</span>
										<br />
										• {conformDetDesc.detRemindArr[0]}
									</div>
								}
							</div>
						}
					</div>
				}
			</div>
		);
	}
}

const actions = {
	answerPoAPI,
	reportBrandPoAPI,
	loadUserConfigByType,
	updatePersonalConfig,
	toAnswerPage,
	changePoReportAuthority
};

export default compose(
	connect(null, actions),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Report);
