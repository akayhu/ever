import React, { Component, Fragment } from 'react';
import DOMPurify from 'dompurify';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Icon } from 'antd';
import { WebAppBody } from 'share/styledComponents';
import { menubarClose } from 'actions/ui/menubar';
import Header from 'containers/header';
import LazyLoading from 'components/lazyLoading';
import SearchNewBlock from 'components/searchNewBlock';
import { Loading, Hint } from 'share/styledComponents';
import { submitSearchQuery, clearPreviousSearch } from 'actions/profile';
import getURLQuery from 'utils/getURLQuery';
import { ListSearchMain, SearchNoDataMain } from './styledComponents';
import './style.css';

class SearchList extends Component {
	constructor(props) {
		super(props);
		// this.props.menubarClose();
		this.props.clearPreviousSearch();
	}

	componentDidMount = () => {
		const { submitSearchQuery, location, history } = this.props;
		const { status, initial } = this.props.user.toJS();

		// 帳號未啟用，自動轉導到404
		if (!initial && (status === 'done' || status === 'error')) {
			return this.props.history.push('/error/404');
		}

		const query = getURLQuery(location.search);
		if (!query.q) return history.push('/search');
		submitSearchQuery(
			DOMPurify.sanitize(query.q, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
		);
	};

	componentDidUpdate = () => {
		const { status, initial } = this.props.user.toJS();
		// 帳號未啟用，自動轉導到404
		if (!initial && (status === 'done' || status === 'error')) {
			return this.props.history.push('/error/404');
		}
	};

	loadMore = () => {
		const { keyword, hasNext, status } = this.props.searchUI.toJS();
		if (hasNext && status !== 'loading') {
			this.props.submitSearchQuery(keyword);
		}
	};

	renderList = () => {
		const list = this.props.searchList.toJS();
		const { status, hasNext, keyword, total } = this.props.searchUI.toJS();

		if (!list.length) {
			switch (status) {
				case 'idle':
					return (
						<SearchNoDataMain>
							<div className="search-noData-name">
								抱歉，找不到任何有關「
								<span className="searchTag">{keyword || ''}</span>」的結果
							</div>
							<div className="search-noData-prompt">
								請確認關鍵字是否拼寫正確，或嘗試輸入其他關鍵字
							</div>
						</SearchNoDataMain>
					);

				case 'initial':
				case 'loading':
					return (
						<SearchNoDataMain>
							<div className="search-noData-name">搜尋中...</div>
							<Loading />
						</SearchNoDataMain>
					);

				case 'error':
				default:
					return (
						<SearchNoDataMain>
							<div className="search-noData-name">發生錯誤，請再試一次！</div>
							<div className="search-noData-prompt">
								<Icon
									type="reload"
									theme="outlined"
									style={{ fontSize: 20 }}
									onClick={this.props.submitSearchQuery.bind(this, keyword)}
								/>
							</div>
						</SearchNoDataMain>
					);
			}
		}

		let loadMoreHint = null;
		switch (status) {
			case 'idle':
				loadMoreHint = hasNext ? <Hint>向下捲動載入更多資料</Hint> : null;
				break;

			case 'initial':
			case 'loading':
				loadMoreHint = <Loading />;
				break;

			case 'error':
			default:
				loadMoreHint = (
					<Hint>
						<span>發生錯誤，請再試一次！</span>
						<Icon
							type="reload"
							theme="outlined"
							style={{ fontSize: 16 }}
							onClick={this.props.submitSearchQuery.bind(this, keyword)}
						/>
					</Hint>
				);
		}

		return (
			<ListSearchMain className="searchListMain">
				<div className="searcTitle">
					為您尋找到 {total} 筆關於
					<span className="searchTag">{keyword || ''}</span>
					的結果
				</div>
				<LazyLoading body loadingAct={this.loadMore}>
					<Fragment>
						<div className="searcLayer">
							{list.map(profile => (
								<SearchNewBlock key={profile.pid} data={profile} />
							))}
						</div>
						{loadMoreHint}
					</Fragment>
				</LazyLoading>
			</ListSearchMain>
		);
	};

	render() {
		return (
			<Fragment>
				{/* TODO: 補上各種 meta 資訊 */}
				<Helmet>
					<title>個人檔案 - 人才搜尋</title>
					<meta name="description" content="快速建立你的個人檔案" />
				</Helmet>
				<WebAppBody background="#f6f6f6">
					<Header
						optionLeftList={['searchBar']}
						optionRightList={['search', 'login']}
						mobileLogo={false}
					/>
					{this.renderList()}
				</WebAppBody>
			</Fragment>
		);
	}
}

const matStateToProps = (state, props) => ({
	user: state.get('user'),
	visible: state.getIn(['ui', 'menubar', 'visible']),
	preview: state.getIn(['ui', 'menubar', 'preview']),
	printData: state.getIn(['ui', 'print', 'printData']),
	searchUI: state.getIn(['ui', 'profile', 'search']),
	searchList: state.getIn(['profile', 'search']),
});

export default compose(
	withRouter,
	connect(
		matStateToProps,
		{
			menubarClose,
			submitSearchQuery,
			clearPreviousSearch,
		}
	)
)(SearchList);
