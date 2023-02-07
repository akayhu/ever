import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { requestLoginStatus } from 'actions/user';
import Editor from 'containers/editor';
import PreviewDesk from 'containers/previewDesk';
import Profile from 'containers/profile';
import ErrorPage from 'components/errorPage';
import PreLogin from 'containers/preLogin';
import SearchPage from 'containers/search';
import SearchList from 'containers/search/list';
import MyCollect from 'containers/myCollect';
// import Survey from 'containers/survey';
import CustomDragPreviewLayer from 'containers/customDragPreview';
import { withSystemMessage } from 'containers/systemMessage';

class Default extends Component {
	componentDidMount = () => {
		// 偵測 route 改變，檢查登入狀態
		// https://github.com/ReactTraining/react-router/issues/3554#issuecomment-299626161
		this.props.history.listen((location, action) => {
			this.props.requestLoginStatus();
		});
	};

	componentDidCatch(error, info) {
		console.error(error, info);
	}

	renderSearch = ({ location }) =>
		location.search.indexOf('q') !== -1 ? (
			<SearchList /> // 搜尋列表
		) : (
			<SearchPage />
		); // 搜尋首頁

	// renderSurvey = ({ location }) =>
	// 	/commonMode/gi.test(location.pathname) ? null : <Survey />;

	render() {
		return (
			<Fragment>
				<CustomDragPreviewLayer />
				<Switch>
					{/* 登入首頁 */}
					<Route path="/" exact component={PreLogin} />
					{/* 編輯器 */}
					<Route path="/editor" exact component={Editor} />
					{/* Freebird專案嵌入iframe使用編輯器，無Header與tag連結 */}

					<Route
						path="/editor/commonMode"
						exact
						render={props => <Editor {...props} commonMode={true} />}
					/>
					{/* 首頁點體驗後經 AC 導回編輯頁面 */}
					<Route
						path="/editor/:mode"
						exact
						render={props => <Editor {...props} />}
					/>
					{/* 預覽頁 */}
					<Route path="/preview/:previewName" exact component={PreviewDesk} />
					{/* 觀看個人頁 */}
					<Route
						path="/profile/:pid"
						exact
						render={props => <Profile {...props} source="publish" />}
					/>
					{/* Freebird專案嵌入iframe使用觀看個人頁，無左側互動區 */}
					<Route
						path="/profile/:pid/commonMode"
						exact
						render={props => (
							<Profile {...props} source="publish" commonMode={true} />
						)}
					/>
					{/* Plus event-site POC專案觀看個人頁職能觀點，Header為104職涯社群 - 網址1 */}
					<Route
						path="/profile/:pid/plusMode"
						exact
						render={props => (
							<Profile {...props} source="publish" plusMode={true} />
						)}
					/>
					{/* Plus event-site POC專案觀看個人頁職能觀點，Header為104職涯社群 - 網址2 */}
					<Route
						path="/profile/:pid/plusMode-2"
						exact
						render={props => (
							<Profile {...props} source="publish" plusMode={true} />
						)}
					/>
					{/* 平板、手機預覽頁iframe */}
					<Route
						path="/profile/:pid/preview"
						exact
						render={props => (
							<Profile {...props} source="editor" commonMode={true} />
						)}
					/>
					{/* error頁 */}
					<Route path="/error/:code" exact component={ErrorPage} />
					{/* 搜尋 */}
					<Route path="/search" exact render={this.renderSearch} />
					{/* 我的收藏 */}
					<Route path="/collection" exact component={MyCollect} />
					{/* 原plus職場動態 */}
					<Route path="/topic" exact component={PreLogin} />
					{/* 原plus講座活動 */}
					<Route path="/event" exact component={PreLogin} />
					{/* 原plus單一則活動講座 */}
					<Route path="/event/:eventId" exact component={PreLogin} />
					{/* 原plus頻道 */}
					<Route path="/channel" exact component={PreLogin} />
					{/* 原plus文章 */}
					<Route path="/activity/:aid" exact component={PreLogin} />
					{/* 原plus社團 */}
					<Route path="/group" exact component={PreLogin} />
					{/* 讓搜尋引擎檢索網站的檔案，告訴搜尋引擎網站哪些內容可以被檢索，哪些內容可以不用被檢索 */}
					<Route path="/robots.txt" exact />
					{/* 404頁 */}
					<Redirect to="/error/404" />
				</Switch>
				{/* <Route render={this.renderSurvey} /> */}
			</Fragment>
		);
	}
}

export default compose(
	withRouter,
	withSystemMessage,
	DragDropContext(HTML5Backend),
	connect(
		null,
		{ requestLoginStatus },
		null,
		{ forwardRef: true }
	)
)(Default);
