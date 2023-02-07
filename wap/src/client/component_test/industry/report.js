import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from '../organization/index.css';

import { DropList } from 'c_wap_module';
import { Link } from 'react-router';

import Chart from 'src/client/component_test/chart';

import { reportBrandPiAPI, checkPiAPI, changePiReportAuthority } from 'src/client/actions/test/pi';
import { loadUserConfigByType, updatePersonalConfig } from 'src/client/actions/profile';

class Report extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			poConfigType: '6f332b66-f287-481f-8510-a306993122b0',
			poConfigResponse: false,
			privacy: 0,
			loading: false
		};
	}
	componentDidMount() {
		this.props.loadUserConfigByType({
			pid: this.props.user.pid,
			typeList: this.state.poConfigType
		}).then((res) => {
			this.props.reportBrandPiAPI({
				pid: this.props.user.pid,
				// 這邊打開就是固定給client端看的資料
				source: 'C'
			}).then((res) => {
				this.setState({
					loading: true,
					poConfigResponse: true
				});
			});
		});

		this.props.checkPiAPI({ // 刷新store裡的值 因為入口判斷是用store裡的值
			pid: this.props.user.pid
		});
	}
	handleOnSelected(data) {
		const { pid, type, createDate, updateDate } = this.props.config[this.state.poConfigType];

		this.props.updatePersonalConfig({
			pid: this.props.user.pid,
			updateData: JSON.stringify([{
				value: data.value === 1,
				pid,
				type,
				createDate,
				updateDate,
			}])
		});

		// 當是給企業看時就打B  自己看打C
		this.props.changePiReportAuthority({
			pid: this.props.user.pid,
			source: data.value === 1 ? 'B' : 'C'
		});
	}
	render() {
		return (
			<div className="original_panel">
				<div className="header clearfix">
					<div className="title">
						<h2>產業適性測驗報告</h2>
					</div>
					<div className="options">
						{
							this.props.status === 3 &&
							<Link styleName="report_more" className="ui line button" to="/test/industry?step=answer">重新測驗</Link>
						}
						{
							this.state.poConfigResponse &&
							<DropList
								listContent={ [
									{label: '給企業看', value: 1},
									{label: '只限本人', value: 2}
								] }
								defaultIndex={ this.props.config[this.state.poConfigType].value ? 1 : 2 }
								onSelected={ this.handleOnSelected.bind(this) }
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
									text="產業"
								/>
							}
						</div>
						<div styleName="text">
							你的興趣適合在
							【{this.props.report.conformSimDesc[0]}】
							工作，因為
							<br /><br />
							<span>你適合的產業類型:</span>
							<br />
							• {this.props.report.conformDetDesc.detFitArr[0]}
							<br /><br />
							{
								this.props.report.conformDetDesc.detRemindArr.length !== 0 &&
								<div>
									<span>提醒你:</span>
									<br />
									• {this.props.report.conformDetDesc.detRemindArr[0]}
								</div>
							}
						</div>
					</div>
				}
			</div>
		);
	}
}

const transformChartData = (rawData = []) => {
	let data = [],
		temp_color;
	rawData.forEach((item, index) => {
		switch (index) {
			case 0:
				temp_color = '#f9e000 ';
				break;
			case 1:
				temp_color = '#635586 ';
				break;
			case 2:
				temp_color = '#8fe6d5 ';
				break;
			case 3:
				temp_color = '#f75a51 ';
				break;
			default:
				temp_color = '#fff ';
				break;
		}
		data.push({
			id: item.jobIndustryId,
			order: index,
			score: item.userScore,
			weight: 1,
			color: temp_color,
			label: item.dmsName
		});
	});
	return data;
};

function mapStateToProps(state, props) {
	return {
		report: state.test.pi.report,
		status: state.test.pi.status.status,
		chart: transformChartData(state.test.pi.report.dmsDet)
	};
}

export default compose(
	connect(mapStateToProps, { reportBrandPiAPI, checkPiAPI, loadUserConfigByType, updatePersonalConfig, changePiReportAuthority }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Report);
