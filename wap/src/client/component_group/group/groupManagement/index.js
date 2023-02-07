import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'src/util/compose';

// components
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import SetUp from 'src/client/component_group/group/groupManagement/setUp';
import ArticleManager from 'src/client/component_group/group/groupManagement/articleManager';
import MembersJoin from 'src/client/component_group/group/groupManagement/membersJoin';
import { getGroupInfoData, getDataTotal } from 'src/client/reducers/group/selectors';

function parseTabProp(tab) {
	if (typeof tab === 'boolean') return null;
	if (typeof tab === 'string') return tab;
	return false;
}

class GroupManagement extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: props.location.query.mode || 'setUp'
		};
	}
	componentWillReceiveProps(nextProps) {
		const deftab = 'setUp';
		const activeTab = nextProps.location.query.mode || deftab;

		if (!nextProps.canManage) {
			this.props.router.push('/error/404');
			return;
		}

		if (this.state.activeTab !== activeTab) {
			this.setState({
				activeTab
			});
			return;
		}
	}
	createLeftSideNavigation() {
		return {
			activeTab: this.state.activeTab,
			navList: [
				{
					title: '管理社團設定',
					itemKey: 'setUp',
					count: 0,
					url: `/group/${this.props.params.gid}/management?mode=setUp`,
					subItems: []
				},
				{
					title: '管理社團文章',
					itemKey: 'article',
					count: 0,
					url: `/group/${this.props.params.gid}/management?mode=article`,
					subItems: []
				},
				{
					title: '審核新成員加入',
					itemKey: 'membersJoin',
					count: 0,
					url: `/group/${this.props.params.gid}/management?mode=membersJoin`,
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
					{this.state.activeTab === 'article' && <ArticleManager />}
					{this.state.activeTab === 'membersJoin' && <MembersJoin />}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const nowState = state.group;
	const {isHead, isAdmin} = getGroupInfoData(nowState);
	const canManage = isHead || isAdmin;

	return {
		dataInfo: getGroupInfoData(nowState),
		canManage
	};
}

export default compose(
	connect(mapStateToProps),
)(GroupManagement);
