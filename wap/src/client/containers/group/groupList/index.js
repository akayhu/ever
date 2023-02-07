import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import compose from 'src/util/compose';
import isEqual from 'lodash/isEqual';
import css from './index.css';
// selectors
import { inAllGroup, inMyGroup, getDataList } from 'src/client/reducers/group/selectors';
// actions
import { initGroupIndex, changeTab } from 'src/client/actions/group';
// components
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import IndexContent from 'src/client/component_group/indexContent';
import clientConfig from 'src/configs/client';
import { 
	components as CPlatformComponents,
	actions as CPlatformActions
} from 'c_platform';

const { setMetadata } = CPlatformActions.metadata;
const ViewWrapper = CPlatformComponents.ViewWrapper;
const myGroupTitleMap = {
	joined: '我加入的',
	waitForJoin: '等待加入的',
	managed: '我管理的',
	checking: '審核中的',
	rejected: '被駁回的',
	我加入的: 'joined',
	等待加入的: 'waitForJoin',
	我管理的: 'managed',
	審核中的: 'checking',
	被駁回的: 'rejected'
};
const allGroupTitleMap = {
	knowAndTech: '知識技術',
	lifestyle: '品味生活',
	healthAndLeisure: '健康休閒',
	artAndDesign: '藝術設計',
	知識技術: 'knowAndTech',
	品味生活: 'lifestyle',
	健康休閒: 'healthAndLeisure',
	藝術設計: 'artAndDesign'
};

class GroupList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: props.location.query.category || (props.isLogin ? 'recommend' : 'knowAndTech')
		};
	}
	componentDidMount() {
		const { initGroupIndex } = this.props;
		initGroupIndex(this.getQueryInfo());
		this.props.setMetadata('group');
	}
	componentWillReceiveProps(nextProps) {
		const activeTab = nextProps.location.query.category;

		if (activeTab && this.state.category !== activeTab) {
			this.setState({ category: activeTab });
			this.props.changeTab(activeTab);
			return;
		}
	}
	getQueryInfo() {
		const { query: { category, ...rest } } = this.props.location;
		const mustLoginMap = [
			'recommend',
			'joined',
			'managed',
			'reject',
			'waitForJoin',
			'checking'
		];

		if (!this.props.isLogin && mustLoginMap.indexOf(category) >= 0) {
			browserHistory.push('/group');
			return {category: 'knowAndTech', ...rest};
		}

		this.props.changeTab(this.state.category);
		return { category, ...rest };
	}
	shouldComponentUpdate(nextProps, nextState) {
		// render 次數 15 -> 2
		const oldState = this.state;
		const oldProps = this.props;
		if (oldState.category !== nextState.category) return true;
		if (!isEqual(nextProps, oldProps)) return true;
		return false;
	}
	render() {
		const { mainTab, activeTab } = this.props;
		return (
			<ViewWrapper { ...this.props } >
				<div className="container_wrap">
					<div className="wrap_w200_m20_w760">
						<div className="left_side">
							<LeftSideNavigation navSetting={ this.props.navSetting } />
						</div>
						<div className="right_side">
							<IndexContent mainTab={ mainTab } activeTab={ activeTab } />
						</div>
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

const getTabType = (tab) => {
	if (inAllGroup(tab)) return 'all';
	if (inMyGroup(tab)) return 'myGroup';
	return 'recommend';
};

function mapStateToProps(state, props) {

	/**
	 * 這段的效能很不好
	 * 當每次store 更新的時候就會觸發mapStateToProps
	 * 導致這邊的運算全部都會全部重做一次
	 * 造成不必要的效能跟記憶體的浪費
	 * 未來如果有優化的buffer去做的話這邊要優先進行優化
	 * by Derek
	 */

	const nowState = state.group;
	const myGroupTitles = getDataList(nowState, 'myGroupTitle').filter(item => item.total > 0);
	const categoryTitles = getDataList(nowState, 'categoryTitles');
	const myGroupTitleData = [];
	const allGroupTitleData = [];
	const deftab = state.user.isLogin ? 'recommend' : 'knowAndTech';

	myGroupTitles.forEach(({ title, total }, index) => {
		myGroupTitleData.push({
			title: myGroupTitleMap[title] || title,
			itemKey: title,
			count: total,
			url: `/group?category=${title}`,
			subItems: []
		});
	});

	myGroupTitleData.push({
		title: '+ 建立新社團',
		itemKey: 'applyform',
		count: 0,
		url: '/group/applyform',
		className: css.add_new_group,
		isShow: !!state.user.isLogin,
		subItems: []
	});

	categoryTitles.forEach(({categoryId, categoryName, total}, index) => {
		allGroupTitleData.push({
			title: categoryName,
			itemKey: allGroupTitleMap[categoryName],
			count: total,
			url: `/group?category=${allGroupTitleMap[categoryName]}`,
			subItems: []
		});
	});

	const activeTab = props.location.query.category || deftab;
	const navSetting = {
		activeTab,
		navList: [{
			title: '全部社團',
			itemKey: '',
			count: 0,
			url: '',
			subItems: allGroupTitleData
		}]
	};

	if (state.user.isLogin) {
		navSetting.navList = [{
			title: '推薦的社團',
			itemKey: 'recommend',
			count: 0,
			url: '/group?category=recommend',
			subItems: []
		}, {
			title: '我的社團',
			itemKey: '',
			count: 0,
			url: '',
			subItems: myGroupTitleData
		}].concat(navSetting.navList);
	}

	return {
		mainTab: getTabType(activeTab),
		activeTab,
		navSetting,
		isLogin: state.user.isLogin
	};
}

export default compose(
	connect(mapStateToProps, { initGroupIndex, changeTab, setMetadata }),
)(GroupList);
