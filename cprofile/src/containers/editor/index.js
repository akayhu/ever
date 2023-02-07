import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { initialProfileProcessStart } from 'actions/user';
import { moveCard, updateCard } from 'actions/ui/card';
import { fetchAllDataProcessStart } from 'actions/blocks';
import Header from 'containers/header';
import EditorMain from 'containers/editor/main';
import Import from 'containers/import';
import Statute from 'containers/statute';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { withRouter } from 'react-router-dom';
import BrowserPrompt from 'components/browserPrompt';
import {
	WebAppBody,
	WebAppContainer,
	FullLoading,
	Loading,
} from 'share/styledComponents';
import {
	checkProcessIsLoading,
	checkProcessIsDone,
	hasAnyProcessing,
} from 'utils/process';
import { BrowserView, MobileView } from 'react-device-detect';
import { noviceGuideStart, toolbarPromptStart } from 'actions/ui/noviceGuide';
import { changeToNewVisitor } from 'actions/ui/activationGuide';
import SaveLoadingBar from 'containers/saveLoadingBar';
import MobilePrompt from 'containers/mobilePrompt';
import './style.css';

class Editor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstUse: false,
			firstFinishImport: false,
		};
	}

	componentDidMount() {
		const { user, fetchAllDataProcessStart, process } = this.props;
		const userToJS = user.toJS();
		if (userToJS.initial && !checkProcessIsDone(process, 'fetchAllData'))
			return fetchAllDataProcessStart(userToJS.pid);
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { user, process, fetchAllDataProcessStart } = this.props;
		const { firstUse, firstFinishImport } = this.state;
		const userToJS = user.toJS();

		// 只有第一次使用 & 未完成匯入時，才不會取區塊資料
		if (
			!checkProcessIsDone(process, 'fetchAllData') &&
			!checkProcessIsLoading(process, 'fetchAllData')
		) {
			if (userToJS.initial && !firstUse) fetchAllDataProcessStart(userToJS.pid);
			if (
				userToJS.initial &&
				firstUse &&
				firstFinishImport &&
				!checkProcessIsLoading(process, 'importProcess')
			) {
				fetchAllDataProcessStart(userToJS.pid);
			}
		}
	};

	// 接受條款
	_handleStatuteRead = () => {
		const { initialProfileProcessStart } = this.props;
		initialProfileProcessStart(); // 啟用服務
		// 配合 c profile 上線，把匯入口移除
		// this.setState({ firstUse: true });
	};

	// 完成匯入作業
	_handleFinishImport = () => {
		this.setState({ firstFinishImport: true });
	};

	// 關閉 lightbox
	_redirectToIndex = () => {
		this.props.history.push('/');
	};

	// 按步驟 render
	_renderByStage = (stage = '') => {
		const { firstUse } = this.state;
		const {
			isLoading,
			commonMode,
			noviceGuideStart,
			toolbarPromptStart,
		} = this.props;

		switch (stage) {
			// 檢查登入啟用狀態 loading
			case 'fetchingLoginStatus':
				return (
					<FullLoading>
						<h3>檢查登入與啟用資訊中 ...</h3>
						{/* <LinearProgress mode="indeterminate" /> */}
						<Loading />
					</FullLoading>
				);

			// 轉導登入
			case 'redirectToLogin':
				return (
					<FullLoading>
						<h3>正在轉導至登入頁 ...</h3>
						{/* <LinearProgress mode="indeterminate" /> */}
						<Loading />
					</FullLoading>
				);

			// 未啟用的條款頁
			case 'statue':
				noviceGuideStart(); // 教學導引開啟
				toolbarPromptStart(); // 提醒使用者可以使用工具列開啟
				return (
					<WebAppBody>
						<Header
							mobileLogo={false}
							optionRightList={['search', 'login']}
							editable={true}
						/>
						<WebAppContainer>
							<Fragment>
								<Statute
									handleCancel={this._redirectToIndex}
									handleStatuteRead={this._handleStatuteRead}
								/>
							</Fragment>
						</WebAppContainer>
					</WebAppBody>
				);

			// 服務啟用 loading
			case 'initializing':
				return (
					<FullLoading>
						<h3>服務啟用中 ...</h3>
						{/* <LinearProgress mode="indeterminate" /> */}
						<Loading />
					</FullLoading>
				);

			// 選擇要匯入的服務、區塊資料
			case 'chooseImportFromSource':
				return (
					<WebAppBody>
						<Header
							mobileLogo={false}
							optionRightList={['search', 'login']}
							editable={true}
						/>
						<WebAppContainer>
							<Fragment>
								<Import
									onFinishImport={this._handleFinishImport}
									firstUse={firstUse}
								/>
							</Fragment>
						</WebAppContainer>
					</WebAppBody>
				);

			// 匯入資料處理 loading
			case 'importing':
				return (
					<FullLoading>
						<h3>正在匯入您的資料 ...</h3>
						{/* <LinearProgress mode="indeterminate" /> */}
						<Loading />
					</FullLoading>
				);

			// 取得區塊資料 loading
			case 'fetchingBlocksData':
				return (
					<FullLoading>
						<h3>請稍後，樣板正在建置中 ... </h3>
						{/* <LinearProgress mode="indeterminate" /> */}
						<Loading />
					</FullLoading>
				);

			case 'editor':
				return (
					<WebAppBody>
						{/* 儲存bar */}
						{isLoading && <SaveLoadingBar />}
						{/* PC Header */}
						{!commonMode && (
							<BrowserView>
								<Header
									optionLeftList={['preview']}
									optionRightList={['publish', 'search', 'login']}
									editable={true}
								/>
							</BrowserView>
						)}
						{/* Moble Header */}
						{!commonMode && (
							<MobileView>
								<Header
									optionLeftList={['preview', 'spacer_1', 'publish']}
									optionRightList={['login']}
									editable={true}
									mobileLogo={false}
								/>
							</MobileView>
						)}
						<WebAppContainer style={commonMode ? { paddingTop: '0' } : null}>
							{/* PC */}
							<BrowserView>
								<EditorMain commonMode={commonMode} />
							</BrowserView>
							{/* Moble */}
							<MobileView>
								<MobilePrompt commonMode={commonMode} />
								<EditorMain commonMode={commonMode} />
							</MobileView>
						</WebAppContainer>
						<BrowserPrompt
							when={isLoading}
							message="似乎還有資料還沒儲存好喔！確定要離開編輯器？"
						/>
					</WebAppBody>
				);

			// 所有例外錯誤畫面
			case 'error':
				return (
					<FullLoading>
						<h3>處理過程發生錯誤，請重新再試一次！</h3>
					</FullLoading>
				);

			default:
				console.warn('invalid stage in editor container', stage);
				return (
					<FullLoading>
						<h3>請稍後，資料正在處理中 ...</h3>
						{/* <LinearProgress mode="indeterminate" /> */}
						<Loading />
					</FullLoading>
				);
		}
	};

	render() {
		const { user, process } = this.props;
		const { firstUse, firstFinishImport } = this.state;
		const userToJS = user.toJS();

		if (userToJS.status === 'error') return this._renderByStage('error');
		if (
			userToJS.status === 'initial' ||
			checkProcessIsLoading(process, 'accountProcess')
		)
			return this._renderByStage('fetchingLoginStatus');
		if (userToJS.status === 'done' && !userToJS.login)
			return this._renderByStage('redirectToLogin');
		if (userToJS.status === 'done' && userToJS.login && !userToJS.initial)
			return this._renderByStage('statue');
		if (checkProcessIsLoading(process, 'initialProfile'))
			return this._renderByStage('initializing');
		if (checkProcessIsLoading(process, 'importProcess'))
			return this._renderByStage('importing');
		if (firstUse && !firstFinishImport)
			return this._renderByStage('chooseImportFromSource');
		if (checkProcessIsLoading(process, 'fetchAllData'))
			return this._renderByStage('fetchingBlocksData');

		if (
			userToJS.login &&
			userToJS.initial &&
			checkProcessIsDone(process, 'fetchAllData')
		)
			return this._renderByStage('editor');

		console.warn('例外情境', { state: this.state, props: this.props });

		return this._renderByStage();
	}
}

const mapStateToPorps = state => ({
	user: state.get('user'),
	process: state.getIn(['process']),
	isLoading: hasAnyProcessing(state.get('process')),
	pid: state.getIn(['user', 'pid']),
});

const actions = {
	moveCard,
	updateCard,
	initialProfileProcessStart,
	fetchAllDataProcessStart,
	lightboxOpen,
	lightboxClose,
	changeToNewVisitor,
	noviceGuideStart,
	toolbarPromptStart,
};

export default withRouter(
	connect(
		mapStateToPorps,
		actions
	)(Editor)
);
