import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// import classNames from 'classnames';
// actions
import { initMembersPage, clearSearch, changeGroupTab } from 'src/client/actions/group';
// selectors
import { getGroupInfo } from 'src/client/reducers/group/selectors';
// components
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import MemberList from './memberList';

const keyMap = {
	member: 'groupMembers',
	admin: 'groupAdmins',
};

class GroupMember extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.activeTab = props.groupInfo.tab;
		this.state.groupOptions = 'groupMembers';
	}
	componentDidMount() {
		const { params: { gid }, initMembersPage } = this.props;
		initMembersPage({ channelId: gid });

		this.componentWillReceiveProps(this.props);
	}
	componentWillReceiveProps(nextProps) {
		/* const testStr = nextProps.location.pathname.replace(/\/$/,"")+"/member";
		const result = new RegExp("/group/\\d+/member/(\\w+)($|/.+)", "gi").exec(testStr);
		const activeTab = result[1]||"member"; */

		const activeTab = nextProps.groupInfo.tab;
		if (this.state.activeTab !== activeTab) {
			this.props.clearSearch();
			this.props.changeGroupTab(activeTab);
			this.setState({
				activeTab,
				groupOptions: keyMap[activeTab]
			});
			return;
		}
	}
	createLeftSideNavigation() {
		return {
			activeTab: this.state.activeTab,
			navList: [
				{
					title: '社團成員',
					itemKey: 'member',
					count: 0,
					url: `/group/${this.props.params.gid}/member`,
					subItems: []
				},
				{
					title: '社團管理員',
					itemKey: 'admin',
					count: 0,
					url: `/group/${this.props.params.gid}/member/admin`,
					subItems: []
				}
			]
		};
	}
	render() {
		const { groupOptions } = this.state;
		const navSetting = this.createLeftSideNavigation();

		return (
			<div className="wrap_w200_m20_w760">
				<div className="left_side">
					<LeftSideNavigation navSetting={ navSetting } />
				</div>
				<div className="right_side">
					<MemberList
						listType={ groupOptions }
						channelId={ this.props.params.gid }
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const nowState = state.group;
	return {
		groupInfo: getGroupInfo(nowState),
	};
};

export default compose(
	connect(mapStateToProps, { initMembersPage, clearSearch, changeGroupTab }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(GroupMember);
