import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {isEqual} from 'lodash/lang';
import compose from 'src/util/compose';
import css from './index.css';
// components
import { Tabs, Tab } from 'c_wap_module';
import {PeopleList, CompanyList} from 'src/client/components/profile/guestBlock/list';
import Layer from 'src/client/components/layer';
// actions
import {
	getGuestRecordOfUser,
	getGuestRecordOfComp,
} from 'src/client/actions/profile';
// selectors
import {getGuestDataOfUser, getGuestDataOfComp} from 'src/client/selectors';

class GuestRecord extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showTab: false,
			loading: true,
		};
		// 用來紀錄取過資料了沒有
		this.loadedData = false;
		this.handleClick = this.handleClick.bind(this);
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
	}
	handleClick() {
		const {total} = this.props;
		// 訪客總數為0，點下時不做任何事情
		if (total === 0) return;
		// 去抓訪客資料
		if (!this.loadedData) {
			this.fetchData();
		}
		// 開關
		this.setState({
			showTab: !this.state.showTab,
		});
	}
	fetchData() {
		const {targetPid, compData, userData, getGuestRecordOfUser, getGuestRecordOfComp} = this.props;
		const tasks = [];
		if (compData.count > 0) tasks.push(getGuestRecordOfComp(targetPid));
		if (userData.count > 0) tasks.push(getGuestRecordOfUser(targetPid));
		Promise.all(tasks).then(() => {
			this.loadedData = true;
			this.setState({
				loading: false,
			});
		});
	}
	getUserTab() {
		// 產生會員Tab
		const {loading} = this.state;
		const {userData: {count, dataList}} = this.props;
		const content = loading ? <div styleName="loading" className="loading-box"><div className="loading-animate gray">	<i></i><i></i><i></i></div><span>載入中</span></div> : <PeopleList userList={ dataList } />;
		return <Tab name={ `會員(${count})` }>{content}</Tab>;
	}
	getCompTab() {
		// 產生公司Tab
		const {loading} = this.state;
		const {compData: {count, dataList}} = this.props;
		const content = loading ? <div styleName="loading" className="loading-box"><div className="loading-animate gray">	<i></i><i></i><i></i></div><span>載入中</span></div> : <CompanyList compList={ dataList } />;
		return 	<Tab name={ `公司(${count})` }>{content}</Tab>;
	}
	render() {
		const {showTab} = this.state;
		const {total, compData, userData} = this.props;
		return (
			<div>
				<div
					styleName="main"
					onClick={ this.handleClick }
					data-gtm-profile="訪客記錄"
				>
					{`訪客紀錄: ${total}`}
				</div>
				<Layer
					backBtnText="個人檔案"
					open={ showTab }
					onRequestClose={ this.handleClick }
				>
					<Tabs>
						{userData.count > 0 && this.getUserTab()}
						{compData.count > 0 && this.getCompTab()}
					</Tabs>
				</Layer>
			</div>
		);
	}
}

GuestRecord.defaultProps = {
	total: 0,
	userData: {count: 0},
	compData: {count: 0},
};

GuestRecord.propTypes = {
	total: PropTypes.number.isRequired,
	targetPid: PropTypes.string.isRequired,
	compData: PropTypes.object,
	userData: PropTypes.object,
};

function mapStateToProps(state, props) {
	return {
		userData: getGuestDataOfUser(state, props.targetPid),
		compData: getGuestDataOfComp(state, props.targetPid),
	};
}

export default compose(
	connect(mapStateToProps, {
		getGuestRecordOfUser,
		getGuestRecordOfComp,
	}),
	[CSSModules, '_', css],
)(GuestRecord);
