import { connect } from 'react-redux';
import React, {Component} from 'react';
import {components as CPlatformComponents} from 'c_platform';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { has } from 'lodash/object';
import css from './index.css';
import { LightBox } from 'c_wap_module';

import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import SearchActivity from 'src/client/component_search/searchlist/activity';
import SearchBar from 'src/client/component_common/searchBar';
import { ListBase } from 'src/client/component_activities/activity/activityList';
import PostActivity from 'src/client/component_common/postActivity';
import { getPersonalWall } from 'src/client/actions/activity';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class PersonalActivityList extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			mode: props.location.query.mode || 'all', // all, search, collect
			keyword: props.location.query.keyword || '',
			showInteractionLightbox: false,
		};
	}
	componentWillMount() {
		const qs = this.props.location.query;
		if (typeof qs.mode !== 'undefined') {
			this.setState({mode: qs.mode});
		};
	}
	componentDidMount() {
		window.elogPage = "user";
		this.loadPeronalWall();
		this.loadMyCollect();
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.mode !== nextProps.location.query.mode) {
			this.state.mode = nextProps.location.query.mode || "all";
			return;
		}

		if (this.state.keyword !== nextProps.location.query.keyword) {
			this.state.keyword = nextProps.location.query.keyword;
			return;
		}
	}
	loadPeronalWall() {
		this.props.getPersonalWall('PERSONALWALL', {targetPid: this.props.params.pid});
	}
	loadMyCollect() {
		this.props.getPersonalWall('MYCOLLECT', {targetPid: this.props.params.pid});
	}
	searchActivity(keyword) {
		if (!keyword) {
			this.setState({mode: 'all', keyword: ''});
			this.props.router.push(`/profile/${this.props.params.pid}/activity?mode=all`);
		} else {
			this.setState({mode: 'search', keyword});
			this.props.router.push(`/profile/${this.props.params.pid}/activity?mode=search&keyword=${keyword}`);
		}
	}
	handleInteractionLock() {
		if (this.props.interactionLock === 1) {
			this.setState({showInteractionLightbox: true});
			return true;
		}
		return false;
	}
	closeLightbox() {
		this.setState({showInteractionLightbox: false});
	}
	createLeftSideNavigation() {
		const activeTab = this.state.mode || 'all';
		return {
			activeTab,
			navList: [
				{
					title: '所有文章',
					itemKey: 'all',
					count: 0,
					url: `/profile/${this.props.params.pid}/activity?mode=all`,
					subItems: []
				},
				{
					title: '收藏文章',
					itemKey: 'collect',
					count: 0,
					url: `/profile/${this.props.params.pid}/activity?mode=collect`,
					subItems: []
				}
			]
		};
	}
	renderAll() {
		const allCount = this.props.activity.personalStream.PERSONALWALL[this.props.params.pid] ? this.props.activity.personalStream.PERSONALWALL[this.props.params.pid].total : 0;
		const loading = this.props.activity.personalStream.PERSONALWALL[this.props.params.pid] ? this.props.activity.personalStream.PERSONALWALL[this.props.params.pid].loading : false;
		const dataList = [];

		if (has(this.props.activity.personalStream.PERSONALWALL, this.props.params.pid)) {
			for (const aid of this.props.activity.personalStream.PERSONALWALL[this.props.params.pid].dataList) {
				dataList.push(this.props.activity.activityPool[aid]);
			}
		}
		return (
			<div>
				{
					allCount > 0 &&
					<div styleName="totalCount">
						文章{ allCount }筆
						{
							dataList.length < 1 && 
							<span>(用戶文章未公開)</span>
						}
					</div>
				}
				{/* {
					this.props.params.pid / 1 === this.props.pid / 1 && this.props.interactionLock !== 1 &&
					<PostActivity
						placeholder={ '發表文章' }
						route={ this.props.route }
						router={ this.props.router }
					/>
				} */}
				<ListBase
					dataList={ dataList }
					loading={ loading }
					user={ this.props.user }
					loadMore={ this.loadPeronalWall.bind(this) }
					pageName='user'
					filterName={ this.props.params.pid }
					interactionLock={ this.props.interactionLock }
					handleInteractionLock={ this.handleInteractionLock.bind(this) }
				/>
			</div>
		);
	}
	renderCollect() {
		const collectCount = this.props.activity.personalStream.MYCOLLECT[this.props.params.pid] ? this.props.activity.personalStream.MYCOLLECT[this.props.params.pid].total : 0;
		const loading = this.props.activity.personalStream.MYCOLLECT[this.props.params.pid] ? this.props.activity.personalStream.MYCOLLECT[this.props.params.pid].loading : false;
		const dataList = [];

		if (has(this.props.activity.personalStream.MYCOLLECT, this.props.params.pid)) {
			for (const aid of this.props.activity.personalStream.MYCOLLECT[this.props.params.pid].dataList) {
				dataList.push(this.props.activity.activityPool[aid]);
			}
		}

		return (
			<div>
				{
					collectCount > 0 &&
					<div styleName="totalCount">文章{ collectCount }筆</div>
				}
				<ListBase
					dataList={ dataList }
					loading={ loading }
					user={ this.props.user }
					loadMore={ this.loadMyCollect.bind(this) }
					pageName='myCollect'
					filterName={ this.props.params.pid }
					interactionLock={ this.props.interactionLock }
					handleInteractionLock={ this.handleInteractionLock.bind(this) }
				/>
			</div>
		);
	}
	renderSearch() {
		return (
			<SearchActivity
				mode="author"
				keyword={ this.state.keyword }
				pid={ this.props.pid }
				targetPid={ this.props.params.pid }
			/>
		);
	}
	render() {
		const navSetting = this.createLeftSideNavigation();
		const content = this.state.mode === 'all'
										? this.renderAll()
										: (this.state.mode === 'collect' ? this.renderCollect() : this.renderSearch());
		const interactionOption = {
			submit: {
				text: '確定',
				action: this.closeLightbox.bind(this)
			},
			closeIcon: true
		};
		return (
			<div styleName="personal-list">
				{
					this.state.mode !== 'collect' &&
					<SearchBar
						handleSearch={ keyword => this.searchActivity(keyword) }
						searchKeyword={ this.state.keyword }
						placeholder="搜尋文章"
					/>
				}
				<div className="wrap_w200_m20_w760">
					<div className="left_side">
						<LeftSideNavigation navSetting={ navSetting } />
					</div>
					<div className="right_side">
						{content}
					</div>
				</div>
				{
					this.state.showInteractionLightbox &&
					<LightBox option={ interactionOption } onClose={ this.closeLightbox.bind(this) }>
						<div className="h3">
						預覽模式不提供使用
						</div>
					</LightBox>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		pid: state.user.pid,
		user: state.user,
		activity: state.activity,
		interactionLock: state.profile.interactionLock
	};
}

export default compose(
	connect(mapStateToProps, { getPersonalWall }),
	[CSSModules, '_', css]
)(PersonalActivityList);
