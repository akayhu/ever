import { connect } from 'react-redux';
import update from 'react-addons-update';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { Link } from 'react-router';
import { searchMediaByKeyword, subscribeMedia } from 'src/client/actions/search';
import Image from 'src/client/component_common/image';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import highlight from 'src/util/StringUtil';
import DOMPurify from 'dompurify';
import SubscribeBtn from 'src/client/component_channel/buttons/subscribeBtn';
import { ChannelCard } from 'src/client/component_common/card';

class SearchChannel extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			offset: 0,
			limit: 20,
			keyword: props.keyword || '',
			splat: props.splat || '',
			channel: {
				dataList: []
			},
			loading: true
		};
		this.more = this.more.bind(this);
		// this.subscribeMedia = (channelId, key) => this.subscribe(channelId, key);
	}
	componentDidMount() {
		this.searchChannel();
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.keyword !== nextProps.keyword) {
			this.state.keyword = nextProps.keyword;
			this.clearSearch();
			this.searchChannel();
			return;
		}
	}
	clearSearch() {
		this.state.offset = 0;
		this.setState({ channel: {
			dataList: update(this.state.channel.dataList, { $set: [] })
		} });
	}
	searchChannel() {
		const { splat, keyword, offset, limit } = this.state;
		const params = {};
		params.keyword = splat ? `${keyword}/${splat}` : keyword;
		params.offset = offset;
		params.limit = limit;
		this.setState({ loading: true });
		this.props.searchMediaByKeyword(params).then((res) => {
			this.setState({ loading: false });
			if (res.response && res.response.dataList !== null) {
				this.setState({ channel: {
					dataList: update(this.state.channel.dataList, { $push: res.response.dataList })
				} });
			}
		});
	}
	more() {
		if (!this.props.search.channel.hasNext) {
			return;
		}
		this.state.offset += 20;
		this.searchChannel();
	}
	subscribe(channelId, index) {
		this.props.subscribeMedia({ channelId, index });
	}
	render() {
		const { loading } = this.state;
		const { search, splat, keyword } = this.props;
		return (
			<div styleName="wrapper">
				{
					!loading &&
					search.channel &&
					search.channel.total === 0 &&
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
					search.channel &&
					search.channel.total > 0 &&
					<div styleName="total_count">共{ search.channel.total } 個媒體頻道符合搜尋結果</div>
				}
				<LazyLoading body loadingAct={ this.more }>
					<dl styleName="search_block">
						{
							this.state.channel.dataList.map((item, key) =>
								(
									<dd key={ key } styleName="search_channel">
										<Link to={ `/channel/${item.id}` }>
											<Image
												styleName="imgComponent"
												type={ 'avatar' }
												domain={ 'channel' }
												src={ item.avatarWebUrl }
											/>
										</Link>
										<div styleName="channel_main">
											<div styleName="channel_title">
												<ChannelCard name={ item.name } id={ item.id } textMode />
											</div>
											<div
												styleName="channel_content"
												dangerouslySetInnerHTML={ { __html: highlight(DOMPurify.sanitize(item.description), keyword) } }
											/>
											<div styleName="channel_position">
												<div styleName="channel_people">{ item.subscribeCount } 位關注</div>
												{
													!item.subscribe &&
													<SubscribeBtn
														isAdmin={ item.isAdmin }
														isLogin={ this.props.isLogin }
														channelId={ item.id }
														subscribeSetting={ item.subscribe }
														haveReload
													/>
												}
											</div>
										</div>
									</dd>
								)
							)
						}
						{
							loading &&
							<div className="ui loading">&nbsp;</div>
						}
					</dl>
				</LazyLoading>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLogin: state.user.isLogin,
		user: state.user,
		search: state.search,
	};
}

export default compose(
	connect(mapStateToProps, {
		searchMediaByKeyword,
		subscribeMedia
	}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SearchChannel);
