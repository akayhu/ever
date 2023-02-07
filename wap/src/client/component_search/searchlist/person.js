import { connect } from 'react-redux';
import update from 'react-addons-update';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import ChangeCard from 'src/client/component_common/changeCard';
import { searchPerson } from 'src/client/actions/search';
import { searchGroupMember } from 'src/client/actions/group';
import { searchMediaMember } from 'src/client/actions/channel/channel_api';
import { loadDataByCategory } from 'src/client/actions/connection';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import { HaveCountTemplate } from 'src/client/component_common/contactTemplate';

class SearchPerson extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			offset: 0,
			limit: 20,
			person: {
				dataList: []
			},
			targetPid: '',
			loading: true,
			keyword: props.keyword || '',
			splat: props.splat || ''
		};
	}
	componentDidMount() {
		this.searchPerson();
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.keyword !== nextProps.keyword) {
			this.state.keyword = nextProps.keyword;
			this.clearSearch();
			this.searchPerson();
			return;
		}
	}
	clearSearch() {
		this.state.offset = 0;
		this.setState({ person: {
			dataList: update(this.state.person.dataList, { $set: [] })
		} });
	}
	searchPerson() {
		const { keyword, offset, limit, person, splat } = this.state;
		const { mode, user, channelId } = this.props;
		if (keyword === '') {
			return;
		}
		if (mode === 'group') { // FOR 社團
			const params = {
				pid: user.pid || -3,
				channelId,
				offset,
				limit,
				name: keyword
			};
			this.setState({loading: true});
			this.props.searchGroupMember(params).then((res) => {
				if (res.response) {
					this.setState({ person: {
						dataList: update(person.dataList, { $push: res.response.dataList })
					} });
				}
				this.setState({ loading: false });
			});
		} else if (this.props.mode === 'channel') { // FOR 頻道
			const params = {
				channelId,
				offset,
				limit,
				name: splat ? `${keyword}/${splat}` : keyword
			};
			this.setState({ loading: true });
			this.props.searchMediaMember(params).then((res) => {
				if (res.response) {
					this.setState({ person: {
						dataList: update(person.dataList, { $push: res.response.dataList })
					} });
				}
				this.setState({ loading: false });
			});
		} else {
			const params = {
				pid: user.pid || -3,
				condition: JSON.stringify({ keyword }),
				offset,
				limit
			};
			this.setState({ loading: true });
			this.props.searchPerson(params).then((res) => {
				if (res.response) {
					this.setState({ person: {
						dataList: update(person.dataList, { $push: res.response.dataList })
					} });
				}
				this.setState({ loading: false });
			});
		}
	}
	more() {
		if (!this.props.search.person.hasNext) {
			return;
		}
		this.state.offset += 20;
		this.searchPerson();
	}
	render() {
		const { loading } = this.state;
		const { search, keyword, splat, mode, pid } = this.props;
		return (
			<div styleName="wrapper">
				{
					!loading &&
					search.person &&
					search.person.total === 0 &&
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
				<LazyLoading body loadingAct={ this.more.bind(this) }>
					<div>
						{
							mode !== 'p' &&
							!loading &&
							search.person &&
							search.person.total > 0 &&
							<div styleName="total_count">共{ search.person.total } 個人物符合搜尋結果</div>
						}
						{
						search.person &&
						search.person.total > 0 &&
						<dl styleName="search_block_person">
							{
								this.state.person.dataList.map(item =>
									<HaveCountTemplate
										key={ `search_${item.pid}` }
										pid={ pid }
										targetPid={ item.pid }
										avatarWebUrl={ item.avatarWebUrl }
										userName={ item.userName }
										companyName={ item.companyName }
										jobTitle={ item.jobTitle }
										count={ item.count }
										major={ item.major }
										schoolName={ item.schoolName }
										keyword={ this.state.keyword }
										hiddenStatus
									>
										{
											(item.connectionStatus === 0 || item.connectionStatus === 1 || item.connectionStatus === 2) &&
											<ChangeCard
												pid={ pid }
												targetPid={ item.pid }
												connectionStatus={ item.connectionStatus }
												mutualFriendCount={ item.count }
											/>
										}
									</HaveCountTemplate>
								)
							}
						</dl>
						}
					</div>
				</LazyLoading>
				{
					loading &&
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
		loadDataByCategory,
		searchPerson,
		searchGroupMember,
		searchMediaMember
	}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SearchPerson);
