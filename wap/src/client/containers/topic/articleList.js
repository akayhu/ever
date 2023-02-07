import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import {components as CPlatformComponents} from 'c_platform';
import {findIndex} from 'lodash/array';
import css from './index.css';
// selectors
import {getInfoByKey, getDataByIdsAndKey, getFunc} from 'src/client/reducers/topic/selectors';
// actions
import { initArticleList, loadDataCenter } from 'src/client/actions/topic';
// components
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import TopicMenu from 'src/client/component_topic/topicMenu';
import { ListBase } from 'src/client/component_activities/activity/activityList';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.navListArray = [
			{
				title: '熱門動態',
				itemKey: 'hots',
				count: 0,
				url: '/topic/hots/articleList',
				subItems: []
			},
			{
				title: '趨勢新知',
				itemKey: 'new',
				count: 0,
				url: '/topic/new/articleList',
				subItems: []
			},
			{
				title: '職場心得',
				itemKey: 'experience',
				count: 0,
				url: '/topic/experience/articleList',
				subItems: []
			},
			{
				title: '專業作品',
				itemKey: 'profession',
				count: 0,
				url: '/topic/profession/articleList',
				subItems: []
			},
			{
				title: '學習進修',
				itemKey: 'learn',
				count: 0,
				url: '/topic/learn/articleList',
				subItems: []
			},
			{
				title: '職涯人物',
				itemKey: 'person',
				count: 0,
				url: '/topic/person/articleList',
				subItems: []
			},
			{
				title: '勵志小品',
				itemKey: 'inspirational',
				count: 0,
				url: '/topic/inspirational/articleList',
				subItems: []
			},
			{
				title: '書籍評論',
				itemKey: 'book',
				count: 0,
				url: '/topic/book/articleList',
				subItems: []
			},
			{
				title: '理財投資',
				itemKey: 'invest',
				count: 0,
				url: '/topic/invest/articleList',
				subItems: []
			},
			{
				title: '健康養身',
				itemKey: 'health',
				count: 0,
				url: '/topic/health/articleList',
				subItems: []
			},
			{
				title: '休閒旅行',
				itemKey: 'travel',
				count: 0,
				url: '/topic/travel/articleList',
				subItems: []
			},
			{
				title: '居家生活',
				itemKey: 'life',
				count: 0,
				url: '/topic/life/articleList',
				subItems: []
			},
			{
				title: '影劇觀點',
				itemKey: 'movie',
				count: 0,
				url: '/topic/movie/articleList',
				subItems: []
			}
		];
	}
	componentDidMount() {
		const { location, initArticleList } = this.props;
		const activeTab = getActiveTab(location.pathname);
		window.elogPage = "occupaList";
		// 執行當前init
		initArticleList('news', activeTab, {offset: 0, limit: 10, topic: this.getTopicName(activeTab)});
	}
	componentWillReceiveProps(nextProps) {
		// tab有切換時再打api
		const { location, initArticleList, func } = this.props;
		// func 初始空值時不進去
		if (!func) return;
		if (location.pathname !== nextProps.location.pathname || func !== nextProps.func) {
			if (nextProps.isEnd) return;
			const activeTab = getActiveTab(nextProps.location.pathname);
			// 不能用loadDataCenter，因為在切職能時的store會還沒建立
			initArticleList('news', activeTab, {offset: 0, limit: 10, topic: this.getTopicName(activeTab)});
		}
	}
	getTopicName(activeTab) {
		if (activeTab === 'hots') return null;
		return this.navListArray[findIndex(this.navListArray, item => item.itemKey === activeTab)].title;
	}
	loadMore() {
		const { dataList, isEnd, offset, location, loadDataCenter } = this.props;
		if (isEnd || dataList.length === 0) return;
		const activeTab = getActiveTab(location.pathname);
		loadDataCenter({
			key: 'news',
			subkey: activeTab,
			options: {offset, limit: 10, topic: this.getTopicName(activeTab)}
		});
	}
	createLeftSideNavigation() {
		const tab = getActiveTab(this.props.location.pathname);
		const activeTab = tab || 'hots';
		return {
			activeTab,
			navList: this.navListArray
		};
	}
	render() {
		const navSetting = this.createLeftSideNavigation();
		const { dataList, isLoading, func, activeTab } = this.props;
		const activeTabName = activeTabToCht(activeTab, this.navListArray);
		const activeTag = activeTab === 'hots' ? 'occupaList' : 'occupaTopic';
		return (
			<ViewWrapper { ...this.props } >
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
						{
							(dataList.length > 0 || isLoading) ?	
							<ListBase
								dataList={ dataList }
								loading={ isLoading }
								user={this.props.user}
								loadMore={ this.loadMore.bind(this) }
								pageName={activeTag}
								filterName='occupaTag'
								activeTab={activeTab}
							/> :
							<div styleName="no_result">
								目前{func}沒有{activeTabName}的文章
							</div>
						}
						</div>
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

function activeTabToCht(tab, mappingArr) {
	const result = mappingArr.find(item => item.itemKey === tab) || {};
	return result.title || tab;
}

function getTabFromUrl(pathname) {
	return pathname.replace(/\/$/, '').split('/')[2];
}
function getActiveTab(pathname) {
	const allTabs = ['hots', 'new', 'experience', 'profession', 'learn', 'person', 'inspirational', 'book', 'invest', 'health', 'travel', 'life', 'movie'];
	const tab = getTabFromUrl(pathname);
	return (allTabs.indexOf(tab) !== -1) ? tab : 'hots';
}

function mapStateToProps(state, props) {
	const activeTab = getActiveTab(props.location.pathname);
	const ids = getInfoByKey(state, 'news', activeTab)('ids');
	return {
		user: state.user,
		dataList: getDataByIdsAndKey(state, ids, 'news', activeTab),
		isEnd: getInfoByKey(state, 'news', activeTab)('isEnd'),
		isLoading: getInfoByKey(state, 'news', activeTab)('isLoading'),
		offset: getInfoByKey(state, 'news', activeTab)('offset'),
		func: getFunc(state),
		activeTab,
	};
}

export default compose(
	connect(mapStateToProps, { initArticleList, loadDataCenter }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ArticleList);
