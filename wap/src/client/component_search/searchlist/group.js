import { connect } from 'react-redux';
import update from 'react-addons-update';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { searchGroupByKeyword } from 'src/client/actions/search';
import highlight from 'src/util/StringUtil';
import DOMPurify from 'dompurify';
import JoinGroupBtn from 'src/client/component_common/joinGroupBtn';
import { GroupCard } from 'src/client/component_common/card';
import LazyLoading from 'src/client/component_common/lazyLoad/list';

class SearchGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			offset: 0,
			limit: 20,
			group: {
				dataList: []
			},
			loading: true,
			keyword: props.keyword || '',
			splat: props.splat || ''
		};
		this.more = this.more.bind(this);
	}
	componentDidMount() {
		this.searchGroup();
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.keyword !== nextProps.keyword) {
			this.state.keyword = nextProps.keyword;
			this.clearSearch();
			this.searchGroup();
			return;
		}
	}
	clearSearch() {
		this.state.offset = 0;
		this.setState({ group: {
			dataList: update(this.state.group.dataList, { $set: [] })
		} });
	}
	searchGroup() {
		if (this.props.keyword === '') {
			return;
		}
		const { splat, keyword, offset, limit } = this.state;
		const params = {};
		params.keyword = splat ? `${keyword}/${splat}` : keyword;
		params.offset = offset;
		params.limit = limit;
		this.setState({ loading: true });
		this.props.searchGroupByKeyword(params).then((res) => {
			this.setState({ loading: false });
			if (res.response) {
				this.setState({ group: {
					dataList: update(this.state.group.dataList, { $push: res.response.dataList })
				} });
			}
		});
	}
	more() {
		if (!this.props.search.group.hasNext) {
			return;
		}
		this.state.offset += 20;
		this.searchGroup();
	}
	render() {
		const { loading } = this.state;
		const { search, keyword, splat } = this.props;
		return (
			<div styleName="wrapper">
				{
					!loading &&
					search.group &&
					search.group.total === 0 &&
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
					search.group &&
					search.group.total > 0 &&
					<div styleName="total_count">共{ search.group.total } 個社團符合搜尋結果</div>
				}
				<LazyLoading body loadingAct={ this.more }>
					<dl styleName="search_block">
						{
							this.state.group.dataList.map((item, key) => (
								<dd key={ key } styleName="search_item search_group">
									<div>
										<div styleName="group_title">
											<GroupCard name={ item.name } id={ item.id } pass textMode />
											<span styleName="group_classification">{ item.categoryName }</span>
										</div>
									</div>
									<div
										styleName="group_content"
										dangerouslySetInnerHTML={ { __html: highlight(DOMPurify.sanitize(item.description), this.props.keyword) } }
									/>
									<div styleName="group_position" className="clearfix">
										<div styleName="group_position_left">
											<div styleName="group_tag">
												{
													item.tags &&
													item.tags.length > 0 &&
													<i className="tag icon" />
												}
												{
													item.tags === null &&
													<span>&nbsp;</span>
												}
												{
													item.tags &&
													item.tags.map((tag, tagIndex) => {
														let seperator = ' ';
														if (tagIndex < 5) {
															if (item.tags.length - 1 === tagIndex || tagIndex > 4) {
																seperator = '';
															}
															return (
																<span key={ tagIndex }>
																	<a href={ `/search/group/${tag}` }>{ tag }</a>{ seperator }
																</span>
															);
														} else if (tagIndex === 5) {
															return '...';
														}
														return null;
													})
												}
											</div>
											<div styleName="group_people">
												{
													item.memberCount > 0 &&
													<span>{ item.memberCount }位成員</span>
												}
												{
													item.activityCount > 0 &&
													<span>{ item.activityCount }篇文章</span>
												}
											</div>
										</div>
										<div>
											{ '' }
										</div>
										<JoinGroupBtn
											simple
											buttonStyle="line"
											channelId={ item.id }
											isMember={ item.isMember }
											isApplying={ item.isApplying }
											joinSetting={ item.joinSetting || 0 }
										/>
									</div>
								</dd>
								)
							)
						}
					</dl>
				</LazyLoading>
				{
					this.state.loading &&
					<div className="ui loading">&nbsp;</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		search: state.search,
	};
}

export default compose(
	connect(mapStateToProps, {
		searchGroupByKeyword
	}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SearchGroup);
