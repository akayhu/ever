import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import compose from 'src/util/compose';
import { canUseDOM } from 'exenv';
// actions
import { initGroupPage, triggerSearch, clearSearch, changeGroupTab } from 'src/client/actions/group';
import { changeSSRStatus } from 'src/client/actions/ssrStatusCode';
// selectors
import { getGroupInfoData, getIsLoading, getGroupActivitySearchKey, getGroupMemberSearchKey } from 'src/client/reducers/group/selectors';
// components
import GroupMain from 'src/client/component_group/group/groupMain';
// import GroupMember from 'src/client/component_group/group/groupMember';
// import GroupManagement from 'src/client/component_group/group/groupManagement';
import Cover from 'src/client/component_group/cover';
import SearchBar from 'src/client/component_common/searchBar';
// import GroupSearch from 'src/client/component_group/groupSearch';

import {
	components as CPlatformComponents,
	actions as CPlatformActions
} from 'c_platform';

import clientConfig from 'src/configs/client';
// import checkRescrape from 'src/util/fbRescrape';

const { setMetadata } = CPlatformActions.metadata;
const ViewWrapper = CPlatformComponents.ViewWrapper;

class GroupIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: (!canUseDOM),
			mounted: false,
			activeTab: props.groupInfo.tab,
			pathname: props.location.pathname,
		};
		this.search = this.search.bind(this);
	}
	componentWillMount() {
		const { params: { gid }, initGroupPage, userPid } = this.props;
		initGroupPage({ channelId: gid })
			.then((res) => {
				if (!res) {
					// 如果沒資料則吐500並導回error 500頁
					this.props.changeSSRStatus(500);
					this.props.router.push('/error/500');
				} else if (res.warning) {
					// 如果沒此社團吐404並導回error 404頁
					this.props.changeSSRStatus(404);
					this.props.router.push('/error/404/group');
				}
				if (res) {
					this.props.setMetadata('group', {
						pid: userPid,
						title: `${res.name.substring(0, 49)} - 104 職涯社群`,
						name: res.name,
						image: {
							url: `https:${res.coverWebUrl}`,
							width: 960,
							height: 350
						},
						description: `${res.description.substring(0, 149)} - 104 職涯社群`,
						url: `https${clientConfig.params.wapUrl}/group/${gid}`,
						mUrl: `https${clientConfig.params.wapUrl}/m/group/${gid}`
					});
				}
			});
	}
	componentDidMount() {
		const currentPath = this.props.location.pathname;
		const activeTab = this.detectCurrentTab(currentPath) || 'activity';
		this.props.changeGroupTab(activeTab);
		this.props.clearSearch();
		this.setState({
			activeTab,
			isShow: true
		});

		// 公開社團才檢查 FB 快取
		// if (this.props.groupInfo.type === 8) {
		// 	checkRescrape(
		// 		`https://${document.location.hostname}${currentPath}`,
		// 		clientConfig.params.fbEToken,
		// 		clientConfig.params.fbPrvKeyPem,
		// 		1000 * 3600 * 6
		// 	);
		// }
	}
	componentWillReceiveProps(nextProps) {
		// 狀態 0:正常 1:審核中 2:審核不過 3:凍結中 4:已廢社.
		const { status, pid } = nextProps.groupInfo;
		switch (status) {
			// 當社團被駁回時
			case 2:
				// 為被駁回社團的申請人
				if (pid === this.props.myPid) {
					this.props.router.push({
						pathname: '/group/applyform',
						state: {
							groupInfo: nextProps.groupInfo,
							step: 'step3'
						}
					});
				} else {
					this.props.router.push('/error/404/group');
				}
				break;
			default:
				break;
		}
		const currentPath = nextProps.location.pathname;
		// 路徑不一樣才進行偵測
		if (this.props.pathname !== currentPath) {
			const activeTab = this.detectCurrentTab(currentPath);
			if (activeTab && this.state.activeTab !== activeTab) {
				this.props.clearSearch();
				this.props.changeGroupTab(activeTab);
				this.setState({
					activeTab,
					pathname: currentPath,
				});
			}
		}
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	search(searchKeyword) {
		const { router, tab, triggerSearch, params: {gid} } = this.props;
		if (tab === 'management') {
			router.push({
				pathname: `/group/${gid}`
			});
		}
		triggerSearch({
			channelId: gid,
			keyword: searchKeyword,
			category: (tab === 'member') || (tab === 'admin') ? 'searchMembers' : 'searchActivity'
		});
	}
	/**
	 * [偵測路徑，決定當前tab]
	 *  社團文章：/group/:cid
	 *  社團成員：/group/:cid/member
	 *  社團設定：/group/:cid/management or /group/:cid/management?mode=....
	 *  社團管理員：/group/:cid/member/admin
	 */
	detectCurrentTab(path = '') {
		if (!path) return false;

		const pathTestStrs = {
			activity: /\/group\/\d+$/i,
			member: /\/group\/\d+\/member$/i,
			management: /\/group\/\d+\/management.*$/i,
			admin: /\/group\/\d+\/member\/admin$/i,
		};
		let activeTab = false;

		Object.keys(pathTestStrs).forEach((tabName) => {
			if (pathTestStrs[tabName].test(path)) {
				activeTab = tabName;
			}
		});
		return activeTab;
	}
	render() {
		const { activityKeyWord, memberKeyWord, groupInfo, isLoading, location: { state: toManagement }, tab } = this.props;
		const showSearchBar = !(groupInfo.isMember === false && groupInfo.type === 7);
		return (
			<ViewWrapper { ...this.props } >
				{
					this.state.isShow &&
					<div className="container_wrap">
						<Cover
							dataInfo={ groupInfo }
							dataInfoLoading={ isLoading }
							location={ this.props.location }
							params={ this.props.params }
						/>
						{ showSearchBar &&
							<SearchBar
								placeholder={ (tab === 'member') || (tab === 'admin') ? '搜尋社團成員' : '搜尋社團文章' }
								handleSearch={ this.search }
								searchKeyword={ (tab === 'member') || (tab === 'admin') ? memberKeyWord : activityKeyWord }
								allowEmpty
							/>
						}
						{this.props.children ? this.props.children : <GroupMain params={ this.props.params } />}
					</div>
				}
			</ViewWrapper>
		);
	}
}


function mapStateToProps(state) {
	const nowState = state.group;
	return {
		groupInfo: getGroupInfoData(nowState),
		isLoading: getIsLoading(nowState, 'groupInfo'),
		activityKeyWord: getGroupActivitySearchKey(nowState),
		memberKeyWord: getGroupMemberSearchKey(nowState),
		tab: state.group.groupInfo.tab,
		myPid: state.user.pid
	};
}

const actions = {
	initGroupPage,
	triggerSearch,
	clearSearch,
	changeGroupTab,
	setMetadata,
	changeSSRStatus
};

/**
 * 不用下面這種方式
 *  export default compose(
 *		connect(mapStateToProps, actions),
 *		withRouter
 *	)(GroupIndex);
 * 是因為不明原因導致在server-side會出錯
 */
const wrapperComponent = canUseDOM ? withRouter(GroupIndex) : GroupIndex;

export default compose(
	connect(mapStateToProps, actions),
)(wrapperComponent);
