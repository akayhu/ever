import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import {
	searchByKeyword,
	searchByTag,
	searchByKeywordAtPublicChannel,
	searchByKeywordAtPrivateChannel,
	searchByKeywordAtAuthor
} from 'src/client/actions/search';
import { ListItem } from 'src/client/component_activities/activity/activityList';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import update from 'react-addons-update';
import { Link } from 'react-router';
import ActivityLightbox from 'src/client/component_activities/module/Lightbox';

class SearchActivity extends Component {
	constructor(props) {
		super(props);
		// mode activity, tag, public, private
		this.state = {
			limit: props.limit || 10,
			stickey: '',
			oriQuery: '',
			search: {
				activityList: []
			},
			mode: props.mode || 'activity',
			loading: true,
			keyword: props.keyword || '',
			splat: props.splat || ''
		};
		this.more = this.more.bind(this);
	}
	componentDidMount() {
		this.searchActivity();
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.stickey !== nextProps.search.stickey) {
			this.state.stickey = nextProps.search.stickey;
		}
		if (this.state.oriQuery !== nextProps.search.oriQuery) {
			this.state.oriQuery = nextProps.search.oriQuery;
		}
		if (this.state.mode !== nextProps.mode) {
			this.state.mode = nextProps.mode;
			this.clearSearch();
			this.searchActivity();
			return;
		}
		if (this.state.keyword !== nextProps.keyword) {
			this.state.keyword = nextProps.keyword;
			this.clearSearch();
			this.searchActivity();
			return;
		}
	}
	clearSearch() {
		this.state.search.activityList = [];
		this.state.stickey = '';
		this.state.oriQuery = '';
		this.setState({
			search: {
				activityList: update(this.state.search.activityList, { $set: [] })
			}
		});
	}
	handleSearch(res) {
		this.setState({ loading: false });
		if (res.response) {
			const newArray = res.response.activityList.map(obj => obj.aid);
			this.setState({
				search: {
					activityList: update(this.state.search.activityList, { $push: newArray })
				}
			});
		}
	}
	searchActivity() {
		const { keyword, stickey, oriQuery, splat } = this.state;
		let params;
		if (splat) {
			params = {
				keyword: `${keyword}/${splat}`,
				stickey,
				oriQuery
			};
		} else {
			params = {
				keyword,
				stickey,
				oriQuery
			};
		}
		this.setState({ loading: true });
		switch (this.state.mode) {
			case 'activity':
				this.props.searchByKeyword(params).then(res => this.handleSearch(res));
				break;
			case 'tag':
				params.tag = params.keyword;
				delete params.keyword;
				this.props.searchByTag(params).then(res => this.handleSearch(res));
				break;
			case 'public':
				params.channelId = this.props.channelId;
				this.props.searchByKeywordAtPublicChannel(params).then(res => this.handleSearch(res));
				break;
			case 'private':
				params.channelId = this.props.channelId;
				this.props.searchByKeywordAtPrivateChannel(params).then(res => this.handleSearch(res));
				break;
			case 'author':
				params.targetPid = this.props.targetPid;
				this.props.searchByKeywordAtAuthor(params).then(res => this.handleSearch(res));
				break;
			default:
				break;
		}
	}
	more() {
		if (!this.props.search.nextPage) {
			return;
		}
		this.searchActivity();
	}
	render() {
		const { loading } = this.state;
		const { search, keyword, splat, mode, user } = this.props;
		return (
			<div styleName="wrapper">
				{
					!loading &&
					search &&
					search.totalHits === 0 &&
					<div styleName="no_result">
						<div styleName="no_result_1">
							找不到符合「
							{
								splat &&
								<span className="search_hightlight">{ keyword }/{ splat }</span>
							}
							{
								!splat &&
								<span className="search_hightlight">{ keyword }</span>
							}
							」的搜尋結果
						</div>
						<div styleName="no_result_2">建議：檢查有沒有錯別字、或試試搜尋其他的字詞</div>
					</div>
				}
				{
					!loading &&
					search &&
					search.totalHits > 0 &&
					<div styleName="total_count">共{ search.totalHits }篇文章符合搜尋結果</div>
				}
				{
					!loading &&
					search &&
					search.totalHits > 0 &&
					mode === 'tag' &&
					<div styleName="total_count">
						以下是具有「
						{
							splat &&
							<span className="search_hightlight">{ keyword }/{ splat }</span>
						}
						{
							!splat &&
							<span className="search_hightlight">{ keyword }</span>
						}
						」標籤的文章，
						你也可以改用「
						{
							splat &&
							<span className="search_hightlight">
								<Link to={ `/search/activity/${keyword}/${splat}` }>{ keyword }/{ splat }</Link>
							</span>
						}
						{
							!splat &&
							<span className="search_hightlight">
								<Link to={ `/search/activity/${keyword}` }>{ keyword }</Link>
							</span>
						}
						」進行全站關鍵字搜尋。
					</div>
				}
				<LazyLoading body loadingAct={ this.more }>
					<dl styleName="search_block">
						{
							this.state.search.activityList &&
							this.state.search.activityList.map((item) => {
								if (typeof item === 'undefined' || item === null) {
									return null;
								}
								if (this.props.activity.activityPool.hasOwnProperty(item)) {
									const itemData = this.props.activity.activityPool[item];
									return (<ListItem
										searchKeyword={ this.state.keyword }
										searchSplat={ this.state.splat }
										itemData={ itemData }
										user={ user }
										key={ itemData.aid }
										author={ itemData.editable }
										pageName="search"
										filterName={ this.state.keyword }
									/>);
								}
								return null;
							})
						}
					</dl>
				</LazyLoading>
				{
					loading &&
					<div className="ui loading">&nbsp;</div>
				}
				{
					typeof (this.props.activity.lightbox) === 'string' &&
					<ActivityLightbox
						itemData={ this.props.activity.activityPool[this.props.activity.lightbox] }
						index={ 0 }
						author={ this.props.activity.activityPool[this.props.activity.lightbox].editable }
						pageName="search"
						filterName={ this.state.keyword }
					/>
				}
			</div>
		);
	}
}
function mapStateToProps(state) {
	return {
		user: state.user,
		search: state.search.activity,
		activity: state.activity,
	};
}

export default compose(
	connect(mapStateToProps, {
		searchByKeyword,
		searchByTag,
		searchByKeywordAtPublicChannel,
		searchByKeywordAtPrivateChannel,
		searchByKeywordAtAuthor
	}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SearchActivity);
