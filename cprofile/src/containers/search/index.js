import React, { Component, Fragment } from 'react';
import DOMPurify from 'dompurify';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { Icon } from 'antd';
import {
	WebAppBody,
	Hint,
	Loading,
	SubmitButton,
} from 'share/styledComponents';
import { searchOpen } from 'actions/ui/menubar';
import {
	clearPreviousSimilar,
	requestFetchSearchProfileList,
	requestFetchMySimilarProfileList,
	requestFetchFeaturedProfileList,
} from 'actions/profile';
import Header from 'containers/header';
import SearchNewBlock from 'components/searchNewBlock';
import LazyLoading from 'components/lazyLoading';
import { SearchTop, SearchMain, Category } from './styledComponents';
import './style.css';

class Search extends Component {
	constructor(props) {
		super(props);
		this.searchInput = '';
	}

	componentDidMount = () => {
		const { login, status, initial } = this.props.user.toJS();
		const featuredList = this.props.profileData.get('featured');

		this.props.searchOpen();

		// 未登入，自動轉導首頁
		if (!login && (status === 'done' || status === 'error')) {
			return this.props.history.push('/');
		}

		// 帳號未啟用，自動轉導到404
		if (!initial && (status === 'done' || status === 'error')) {
			return this.props.history.push('/error/404');
		}

		if (!featuredList.size) {
			this.props.requestFetchFeaturedProfileList();
		}

		if (login) {
			this.props.clearPreviousSimilar();
			this.props.requestFetchMySimilarProfileList({ offset: 0, limit: 10 });
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		const { login, status, initial } = this.props.user.toJS();
		const similarListStatus = this.props.profileUI.getIn(['similar', 'status']);

		// 未登入，自動轉導首頁
		if (!login && (status === 'done' || status === 'error')) {
			return this.props.history.push('/');
		}
		// 帳號未啟用，自動轉導到404
		if (!initial && (status === 'done' || status === 'error')) {
			return this.props.history.push('/error/404');
		}
		if (similarListStatus === 'initial' && login) {
			this.props.requestFetchMySimilarProfileList({ offset: 0, limit: 10 });
		}
	};

	_handleSubmit = (trigger = 'click', e) => {
		if (trigger === 'click' || (trigger === 'keyboard' && e.keyCode === 13)) {
			e.preventDefault();
			this.props.history.push(
				`/search?q=${DOMPurify.sanitize(this.searchInput.value, {
					ALLOWED_TAGS: [],
					KEEP_CONTENT: true,
				})}`
			);
		}
	};

	loadMore = () => {
		const hasNext = this.props.profileUI.getIn(['similar', 'hasNext']);
		const offset = this.props.profileUI.getIn(['similar', 'offset']);
		const status = this.props.profileUI.getIn(['similar', 'status']);
		const list = this.props.profileData.get('similar');
		const limit = 10;
		if (hasNext && status !== 'loading' && list.size > 0) {
			this.props.requestFetchMySimilarProfileList({ offset, limit });
		}
	};

	_renderListByCategory = name => {
		const validCategories = List(['featured', 'similar']);
		if (!validCategories.includes(name)) {
			console.error('Invalid category name in Search Page', name);
			return null;
		}

		const status = this.props.profileUI.getIn([name, 'status']);

		const list = this.props.profileData.get(name);

		let reloadHandler;
		if (name === 'featured')
			reloadHandler = this.props.requestFetchFeaturedProfileList.bind(this);
		if (name === 'similar') {
			const offset = this.props.profileUI.getIn(['similar', 'offset']);
			reloadHandler = this.props.requestFetchMySimilarProfileList.bind(this, {
				offset,
				limit: 10,
			});
		}

		if (!list.size) {
			switch (status) {
				case 'idle':
					if (name === 'similar') return null;
					return (
						<Hint>
							<span>目前沒有任何資料喔！</span>
							<Icon
								type="reload"
								theme="outlined"
								style={{ fontSize: 16 }}
								onClick={reloadHandler}
							/>
						</Hint>
					);
				case 'initial':
				case 'loading':
					return <Loading />;
				case 'error':
				default:
					return (
						<Hint>
							<span>發生錯誤，請再試一次！</span>
							<Icon
								type="reload"
								theme="outlined"
								style={{ fontSize: 16 }}
								onClick={reloadHandler}
							/>
						</Hint>
					);
			}
		}

		const renderList = list.map((profile, index) => (
			<SearchNewBlock
				key={`${profile.get('pid')}-${Date.now()}-${index}`}
				data={profile.toJS()}
			/>
		));

		let loadMoreHint = null;
		if (name === 'similar') {
			const hasNext = this.props.profileUI.getIn([name, 'hasNext']);
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
								onClick={reloadHandler}
							/>
						</Hint>
					);
			}
		}

		return (
			<Fragment>
				{renderList}
				{loadMoreHint}
			</Fragment>
		);
	};

	render() {
		const similarList = this.props.profileData.get('similar');
		const similarHasNext = this.props.profileUI.getIn(['similar', 'hasNext']);
		return (
			<Fragment>
				<Helmet>
					<title>個人檔案 - 人才搜尋</title>
					<meta name="description" content="快速建立你的個人檔案" />
				</Helmet>
				<WebAppBody background="#f6f6f6">
					<Header
						mobileLogo={true}
						optionRightList={['search', 'login']}
						searchIndex={true}
					/>
					<SearchTop>
						<div className="searchTopMain">
							<div className="searchTopContent">
								<div className="searchTitle">茫茫人海中，尋找你的萬中選一</div>
								<div className="searchP">快速找到一份耀眼的檔案</div>
								<div className="searchInput">
									<input
										ref={input => {
											this.searchInput = input;
										}}
										type="text"
										placeholder="搜尋職稱、科系、技能名稱..."
										name="search"
										onKeyDown={this._handleSubmit.bind(this, 'keyboard')}
									/>
									<button
										type="submit"
										onClick={this._handleSubmit.bind(this, 'click')}
									>
										<Icon type="search" theme="outlined" />
									</button>
								</div>
							</div>
						</div>
					</SearchTop>
					<SearchMain>
						<Category>
							<div className="searcTitle">值得你一看的精選特輯</div>
							<div className="searcLayer">
								{this._renderListByCategory('featured')}
							</div>
						</Category>
						{similarList.size > 0 && (
							<Category>
								<div className="searcTitle">根據你的資料，我們推薦給你</div>
								<LazyLoading body loadingAct={this.loadMore}>
									<div className="searcLayer">
										{this._renderListByCategory('similar')}
									</div>
								</LazyLoading>
							</Category>
						)}
						{// 不超過一行（4 個）時顯示
						!similarHasNext && similarList.size <= 4 && (
							<Category>
								<div className="searcTitle">想查看更多人嗎？</div>
								<p className="searchRemind">
									你發佈的資料越豐富，便能看到更多你感興趣或是與你相似的人。編輯完後別忘了發佈哦！
								</p>
								<SubmitButton
									style={{ marginBottom: '100px' }}
									onClick={() => this.props.history.push('/editor')}
								>
									編輯我的檔案
								</SubmitButton>
							</Category>
						)}
					</SearchMain>
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
	profileUI: state.getIn(['ui', 'profile']),
	profileData: state.getIn(['profile']),
});

export default compose(
	withRouter,
	connect(
		matStateToProps,
		{
			searchOpen,
			clearPreviousSimilar,
			requestFetchSearchProfileList,
			requestFetchMySimilarProfileList,
			requestFetchFeaturedProfileList,
		}
	),
	withRouter
)(Search);
