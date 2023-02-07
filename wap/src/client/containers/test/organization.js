import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import { Link, browserHistory } from 'react-router';
import { LightBox } from 'c_wap_module';
import { toggleIsChecked, toggleIsAnswered, readyCheckPoAPI, randomPoData, toggleLightbox } from 'src/client/actions/test/po';
import { selectPage } from 'src/client/reducers/test/po';
import { Answer, Option, Report } from 'src/client/component_test/organization';

import { bindActionCreators } from 'redux';
import clientConfig from 'src/configs/client';

const question_data = require('src/client/component_test/organization/po_data.js').PO_DATA;

class Organization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAnswering: false,
			nextLocationPathName: undefined
		};
		this.onUnload = this.onUnload.bind(this);
	}
	componentDidMount() {
		this.props.readyCheckPoAPI({
			pid: this.props.pid
		}, this.props.location.query);
		this.props.randomPoData(question_data);
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
	}
	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.onUnload);
	}
	onUnload(event) {
		// chrome 51之後不再支援dialog顯示文字
		// https://www.chromestatus.com/feature/5349061406228480
		event.returnValue = '';
	}
	routerWillLeave(nextLocation) {
		if (this.state.isAnswering
			&& this.state.nextLocationPathName === undefined
			&& this.props.page !== 4) {
			this.props.toggleLightbox(true, '您還在作答中，確定離開嗎?');
			this.setState({
				nextLocationPathName: nextLocation
			});
			return false;
		}
		return true;
	}
	goOutSide() {
		this.props.toggleLightbox(false);
		this.props.router.push(this.state.nextLocationPathName);
	}
	handleIsChecked(e) {
		const { value, checked } = e.target;
		this.props.toggleIsChecked(value, checked);
		// 當是作答狀態時才擋dialog，提醒使用者即將跳出作答頁面
		window.addEventListener('beforeunload', this.onUnload);		
		this.setState({
			isAnswering: true
		});
	}
	handleIsAnswered(e) {
		const { value, checked } = e.target;
		this.props.toggleIsAnswered(value, checked);
	}
	closeLightBox() {
		this.setState({
			nextLocationPathName: undefined,
		});
		this.props.toggleLightbox(false);
	}
	render() {
		const { datas, page, pid, report, config, chart, lightboxStatus, status } = this.props;
		if (page === 4) {
			window.removeEventListener('beforeunload', this.onUnload);
		}
		return (
			<div>
				{
					page !== 4 && page !== 0 &&
					<Answer
						datas={ datas }
						page={ page }
					>
						{
							datas.map(data =>
								<Option
									key={ data.id }
									value={ data.id }
									isChecked={ page === 1 ? data.isChecked : data.isAnswered }
									text={ data.text }
									onChange={ page === 1 ? this.handleIsChecked.bind(this) : this.handleIsAnswered.bind(this) }
								/>
							)
						}
					</Answer>
				}
				{
					page === 4 &&
					<Report
						pid={ pid }
						report={ report }
						config={ config }
						chart={ chart }
						status={ status }
					/>
				}
				{
					lightboxStatus.isShow &&
					<LightBox
						option={ {
							closeIcon: true,
							submit: {
								text: '確定',
								action: this.state.nextLocationPathName ? this.goOutSide.bind(this) : this.closeLightBox.bind(this)
							},
							cancel: this.state.nextLocationPathName ? {text: '取消'} : null
						} }
						onClose={ this.closeLightBox.bind(this) }
					>
						<div>{ lightboxStatus.text }</div>
					</LightBox>
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
			id: item.dmsId,
			order: index,
			score: item.userScore,
			weight: 1,
			color: temp_color,
			label: item.dmsName
		});
	});
	return data;
};

function mapStateToProps(state) {
	const nowState = state.test.po;
	const page = nowState.page;
	return {
		pid: state.user.pid,
		page,
		datas: selectPage(nowState.answer, page),
		report: nowState.report,
		status: nowState.status,
		chart: transformChartData(nowState.report.dmsDet),
		config: state.profile.config,
		lightboxStatus: nowState.lightboxStatus
	};
}

const actions = {toggleIsChecked, toggleIsAnswered, readyCheckPoAPI, randomPoData, toggleLightbox};
export default compose(
		connect(mapStateToProps, actions),
		// translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Organization);
