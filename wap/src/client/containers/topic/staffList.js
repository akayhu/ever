import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
//import CSSModules from 'react-css-modules';
//import css from './index.css';
import {components as CPlatformComponents} from 'c_platform';
import compose from 'src/util/compose';
import { has } from 'lodash/object';

import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import TopicMenu from 'src/client/component_topic/topicMenu';
import RightBlock from 'src/client/component_topic/rightBlock';
import ActivityLightbox from 'src/client/component_activities/module/Lightbox';

import { initStaffList, loadDataCenter } from 'src/client/actions/topic';

import { getLightBoxActivity } from 'src/client/reducers/activity/selectors';
import {getInfoByKey, getDataByIdsAndKey, getFunc, getNestedDataByKey, getByFunc} from 'src/client/reducers/topic/selectors';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class StaffList extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		const { location, initStaffList } = this.props;
		const activeTab = getActiveTab(location.pathname);
		initStaffList(activeTab);
	}
	componentDidMount() {
		if(!this.props.isLogin) location.href="/topic";
	}
	componentWillReceiveProps(nextProps) {
		// tab有切換時再打api
		const { location, initStaffList, func, router, loadDataCenter } = this.props;
		const activeTab = getActiveTab(nextProps.location.pathname);
		// func 初始空值時不進去
		if (!func) return;
		if (nextProps.isEnd) return;

		// 切換職能
		if (func !== nextProps.func) {
			// 不能用loadDataCenter，因為在切職能時的store會還沒建立
			router.push('/topic/followed/staffList');
			initStaffList('followed');
			return;
		}
		// 切換tab
		if (location.pathname !== nextProps.location.pathname) {
			switch (activeTab) {
				case 'gallery':
				case 'honor':
				case 'followed': {
					loadDataCenter({key: activeTab});
					break;
				}
				case 'endorse': {
					break;
				}
				default:
					return;
			}
		}
	}
	loadMore() {
		const { location, loadDataCenter } = this.props;
		const activeTab = getActiveTab(location.pathname);
		const activeSubTab = (activeTab === 'endorse')
			? location.pathname.replace(/\/$/, '').split('/')[4]
			: '';
		loadDataCenter({key: activeTab, subkey: activeSubTab});
	}
	render() {
		const { pid, isLoading, dataList, navSetting, location, lbActivity } = this.props;
		const activeTab = getActiveTab(location.pathname);
		return (
			<ViewWrapper { ...this.props }>
				<div className="container_wrap">
					<TopicMenu />
					<div className="wrap_w200_m20_w760">
						<div className="left_side">
							<LeftSideNavigation
								navSetting={ navSetting }
								propsCss={ { margin: '0 20px 0 0' } }
							/>
						</div>
						<div className="right_side">
							<RightBlock
								pid={ pid }
								isLoading={ isLoading }
								dataList={ dataList }
								loadMore={ this.loadMore.bind(this) }
								activeTab={ activeTab }
							/>
						</div>
					</div>
					{ 
						lbActivity &&
						<ActivityLightbox
							itemData={ lbActivity }
							index={ 0 }
							author={ lbActivity.editable }
						/>
					}
				</div>
			</ViewWrapper>
		);
	}
}

function getActiveTab(pathname, routeJudge) {
	const allTabs = ['followed', 'gallery', 'honor', 'endorse', 'new', 'all'];
	const tab = pathname.replace(/\/$/, '').split('/')[2];
	return (allTabs.indexOf(tab) !== -1) ? tab
																			 : routeJudge ? null
																										: 'followed';
}

function mapStateToProps(state, props) {
	let activeTab = getActiveTab(props.location.pathname);
	let ids;
	let dataList;
	let isEnd;
	let isLoading;

	switch (activeTab) {
		case 'endorse': {
			let activeSubTab = props.location.pathname.replace(/\/$/, '').split('/')[4];
			// 切職能時 byFunc裡面尚未有新的職能 所以先跳過change function所觸發的mapStateToProps
			if (!has(getByFunc(state), getFunc(state))) {
				break;
			}
			// 切職能時 尚未切route，會對應錯的activeSubTab，所以拿第一筆
			if (!has(getNestedDataByKey(state, 'endorse'), activeSubTab)) {
				activeSubTab = Object.keys(getNestedDataByKey(state, 'endorse'))[0];
			}
			const activeEndorseIds = getInfoByKey(state, activeTab, activeSubTab)('ids');
			dataList = getDataByIdsAndKey(state, activeEndorseIds, 'endorse', activeSubTab);
			isEnd = getInfoByKey(state, activeTab, activeSubTab)('isEnd');
			isLoading = getInfoByKey(state, activeTab, activeSubTab)('isLoading');
			activeTab = activeSubTab;
			break;
		}
		default: {
			ids = getInfoByKey(state, activeTab)('ids');
			dataList = getDataByIdsAndKey(state, ids, activeTab);
			isEnd = getInfoByKey(state, activeTab)('isEnd');
			isLoading = getInfoByKey(state, activeTab)('isLoading');
		}
	}
	const navSetting = {
		activeTab,
		navList: [
			{
				title: '最多人關注',
				itemKey: 'followed',
				count: 0,
				url: '/topic/followed/staffList',
				subItems: []
			},
			{
				title: '展示櫥窗最豐富',
				itemKey: 'gallery',
				count: 0,
				url: '/topic/gallery/staffList',
				subItems: []
			},
			{
				title: '職涯成就好精彩',
				itemKey: 'honor',
				count: 0,
				url: '/topic/honor/staffList',
				subItems: []
			}
		]
	};

	// 判斷此職能的肯定是否有子項 才需要建立navList
	const endorseObject = Object.keys(getNestedDataByKey(state, 'endorse'));
	if (endorseObject.length !== 0) {
		navSetting.navList.push(
			{
				title: '最多人肯定榜',
				itemKey: 'endorse',
				count: 0,
				url: `/topic/endorse/staffList/${endorseObject[0]}`,
				subItems: Object.keys(getNestedDataByKey(state, 'endorse')).map(subItems => (
					{
						title: subItems,
						itemKey: subItems,
						count: 0,
						url: `/topic/endorse/staffList/${subItems}`,
						subItems: []
					}
				))
			}
		);
	}

	return {
		lbActivity: getLightBoxActivity(state.activity),
		navSetting,
		pid: state.user.pid,
		dataList,
		isEnd,
		isLoading,
		func: getFunc(state),
		isLogin: state.user.isLogin
	};
}

export default compose(
	connect(mapStateToProps, { initStaffList, loadDataCenter }),
	//translate([]),
	//[CSSModules, '_', css, { allowMultiple: true }]
)(StaffList);
