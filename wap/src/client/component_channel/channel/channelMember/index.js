import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
// import css from './index.css';
import compose from 'src/util/compose';
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import MemberList from './memberList';

// actions
import { changeTab, loadDataCenter, clearSearch } from 'src/client/actions/channel';

const keyMap = {
	member: 'channelMember',
	admin: 'channelAdmin',
};

class ChannelMember extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		const { loadDataCenter, params: { cid } } = this.props;

		loadDataCenter('channelMember', 'init', {channelId: cid});
		loadDataCenter('channelAdmin', 'init', {channelId: cid});
	}
	createLeftSideNavigation() {
		const navList = [{
			title: '頻道成員',
			itemKey: 'member',
			count: 0,
			url: `/channel/${this.props.params.cid}/member`,
			subItems: []
		}];

		/**
		 * 如果是管理員才顯示這個tab
		 */

		if (this.props.channelInfo && this.props.channelInfo.isAdmin) {
			navList.push({
				title: '頻道管理員',
				itemKey: 'admin',
				count: 0,
				url: `/channel/${this.props.params.cid}/member/admin`,
				subItems: []
			});
		}

		return {
			activeTab: this.props.activeTab,
			navList,
		};
	}
	render() {
		const navSetting = this.createLeftSideNavigation();
		const { activeTab } = this.props;
		return (
			<div className="wrap_w200_m20_w760">
				<div className="left_side">
					<LeftSideNavigation navSetting={ navSetting } />
				</div>
				<div className="right_side">
					<MemberList listType={ keyMap[activeTab] } />
				</div>
			</div>
		);
	}
}
function mapStateToProps(state) {
	const nowState = state.channel;
	return {
		channelInfo: nowState.channelInfo.mediaInfo.dataInfo,
		activeTab: nowState.channelInfo.tab,
	};
}
export default compose(
	connect(mapStateToProps, { changeTab, loadDataCenter, clearSearch }),
	// translate([]),
	// [CSSModules, '_', css, { allowMultiple: true }]
)(ChannelMember);
