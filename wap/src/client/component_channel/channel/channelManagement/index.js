import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
//import CSSModules from 'react-css-modules';
//import css from './index.css';
import compose from 'src/util/compose';
import { getChannelInfo, getChannelInfoData } from 'src/client/reducers/channel';
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import SetUp from './setUp';

class ChannelManagement extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			activeTab: 'setUp'
		};
	}
	componentWillReceiveProps(nextProps) {
		if (!nextProps.canManage) {
			this.props.router.push('/error/404');
			return;
		}
	}
	createLeftSideNavigation() {
		return {
			activeTab: 'setUp',
			navList: [
				{
					title: '頻道設定',
					itemKey: 'setUp',
					count: 0,
					url: `/channel/${this.props.params.cid}/management?mode=setUp`,
					subItems: []
				}
			]
		};
	}
	render() {
		if (!this.props.canManage) {
			if (this.props.router) {
				this.props.router.push('/error/404');
			}
			return null;
		}

		const navSetting = this.createLeftSideNavigation();

		return (
			<div className="wrap_w200_m20_w760">
				<div className="left_side">
					<LeftSideNavigation navSetting={ navSetting } />
				</div>
				<div className="right_side">
					{this.state.activeTab === 'setUp' && <SetUp dataInfo={ this.props.dataInfo } />}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const nowState = state.channel;
	const { isAdmin, isEditor } = getChannelInfoData(nowState);
	const canManage = isAdmin || isEditor;

	return {
		dataInfo: getChannelInfoData(nowState),
		canManage,
		tab: nowState.channelInfo.tab
	};
}

export default compose(
	connect(mapStateToProps),
	// translate([]),
	// [CSSModules, '_', css, { allowMultiple: true }]
)(ChannelManagement);
