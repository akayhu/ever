import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import Drawer from 'material-ui/Drawer';
import styled from 'styled-components';
import { Icon } from 'antd';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { fromJS, List, Map } from 'immutable';
import { Helmet } from 'react-helmet';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import Template from 'templates';
import {
	WebAppBody,
	WebAppContainer,
	FullLoading,
	Loading,
	SubmitButton,
} from 'share/styledComponents';
import {
	FETCH_PUBLISH,
	FETCH_NAMECARD,
	isUnknownUser,
	isPrivateProfile,
	hasAnyError,
} from 'config/graphql';
import generalConfig from 'config/general';
import nameMap from 'config/nameMap';
import githubLogo from 'components/defaultSmallImage/PbyGithub.png';
import behanceLogo from 'components/defaultSmallImage/PbyBehance-horizontal.png';
import LightboxWrongCopy from 'components/lightboxWrongCopy';
import MobileDrawer from 'components/mobileDrawer';
import TalentRatingDescription from 'components/talentRatingDescription';
import Header from 'containers/header';
import MobilePersonalInformation from 'containers/mobilePersonalInformation';
import PersonalInformation from 'containers/personalInformation';
import { printStart } from 'actions/ui/print';
import { fetchAllDataProcessStart } from 'actions/blocks';
import { mobileDrawerOpen, mobileDrawerClose } from 'actions/ui/mobileDrawer';
import {
	clearPreviousSimilar,
	requestAddProfileVisitCount,
} from 'actions/profile';
import {
	profileDrawerOpen,
	profileDrawerClose,
} from 'actions/ui/profileDrawer';
import { checkProcessIsLoading, checkProcessIsDone } from 'utils/process';
import getURLQuery from 'utils/getURLQuery';
import { stripIncompleteData } from 'utils/selector';
import './style.css';

const FullContainer = styled(FullLoading)`
	top: 35%;
	h3 {
		margin: 1em auto;
	}
`;

/**
 * 個人檔案
 */
class Profile extends Component {
	static propTypes = {
		/** 檔案資料來源，分成編輯器、已發佈資料 */
		source: PropTypes.oneOf(['editor', 'publish']).isRequired,
		/** 是否為元件模式 (沒有 header 與左側個人資訊面板)，方便其他產品用 iframe 嵌入個人檔案 */
		commonMode: PropTypes.bool.isRequired,
		/** 是否為 Plus 職涯社群 poc 模式 (換成 plus header) */
		plusMode: PropTypes.bool.isRequired,
		/** RSAA，更新檔案瀏覽次數 */
		requestAddProfileVisitCount: PropTypes.func.isRequired,
		/** Action，觸發列印 PDF 預處理 */
		printStart: PropTypes.func.isRequired,
		/** Action，清除先前相似的人列表 */
		clearPreviousSimilar: PropTypes.func.isRequired,
		/** HOC，react-router */
		history: PropTypes.object.isRequired,
		/** HOC，react-router */
		match: PropTypes.object.isRequired,
		/** 使用者資訊 */
		user: PropTypes.object.isRequired,
		/** 當前主題 */
		theme: PropTypes.string,
		/** 個人資訊面板是否可見 */
		profileDrawerVisible: PropTypes.bool.isRequired,
	};

	static defaultProps = {
		commonMode: false,
		plusMode: false,
	};

	constructor(props) {
		super(props);
		this.state = {
			printStart: false,
			visited: false,
		};
	}

	componentDidMount = () => {
		const {
			user,
			source,
			match,
			history,
			fetchAllDataProcessStart,
			printStart,
			requestAddProfileVisitCount,
			profileDrawerOpen,
		} = this.props;
		const { visited } = this.state;

		const userToJS = user.toJS();

		// for publish
		if (source === 'publish' && userToJS.status === 'done') {
			// 記錄來訪數
			if (!visited) {
				requestAddProfileVisitCount({
					pid: match.params.pid,
					uuid: getURLQuery().t,
				});
				this.setState({ visited: true });
			}

			// 下載自己的頁面
			if (
				userToJS.pid === parseInt(match.params.pid, 10) &&
				!this.state.printStart
			) {
				printStart(this.print);
				this.setState({ printStart: true });
			}
		}

		profileDrawerOpen();

		// for editor
		if (source !== 'editor') return;
		if (userToJS.status === 'done' || userToJS.status === 'error') {
			if (!userToJS.login || userToJS.pid !== parseInt(match.params.pid, 10))
				return history.push('/error/404');
		}
		fetchAllDataProcessStart(match.params.pid);
	};

	componentDidUpdate = (prevProps, prevState) => {
		const { user, source, history, match, fetchNamecard } = this.props;

		// for publish
		if (source === 'publish' && user.get('status') === 'done') {
			// 未啟用過的 pid
			if (!fetchNamecard.loading && isUnknownUser(fetchNamecard.error)) {
				return match.params.pid === user.get('pid')
					? history.push('/editor')
					: history.push('/error/404');
			}

			// 記錄來訪數
			if (!this.state.visited) {
				this.props.requestAddProfileVisitCount({
					pid: match.params.pid,
					uuid: getURLQuery().t,
				});
				this.setState({ visited: true });
			}

			// 下載自己的頁面
			if (
				user.get('pid') === parseInt(match.params.pid, 10) &&
				!this.state.printStart
			) {
				this.props.printStart(this.print);
				this.setState({ printStart: true });
			}
		}

		// for editor
		if (source !== 'editor') return;
		if (user.get('status') === 'done' || user.get('status') === 'error') {
			if (
				!user.get('login') ||
				user.get('pid') !== parseInt(match.params.pid, 10)
			)
				return history.push('/error/404');
		}
	};

	componentWillUnmount = () => {
		this.props.clearPreviousSimilar();
	};

	errorHandler = () => {
		this.props.history.push('/search');
	};

	handleToggle = () => {
		const {
			profileDrawerClose,
			profileDrawerOpen,
			profileDrawerVisible,
		} = this.props;
		if (profileDrawerVisible) {
			profileDrawerClose();
		} else {
			profileDrawerOpen();
		}
	};

	mobileHandleToggle = () => {
		const {
			mobileDrawervisible,
			mobileDrawerClose,
			mobileDrawerOpen,
		} = this.props;
		if (mobileDrawervisible) {
			mobileDrawerClose();
		} else {
			mobileDrawerOpen();
		}
	};

	getDrawerHeight = (targetPid, userPid) => {
		const drawerClass = isMobile
			? 'mobile-personal-information-main'
			: 'personal-information-main';
		const drawer = document.getElementsByClassName(drawerClass)[0];
		if (!drawer) return;
		return drawer.offsetHeight;
	};

	renderBlock = (key, profile = Map()) => {
		const blockConfig = profile
			.get('blocks', List())
			.find(block => block.get('uniKey') === key);
		if (!blockConfig) return null;

		const blockType = blockConfig.get('blockType');
		if (!blockType) return null;

		const blockData =
			blockType === 'custom'
				? profile
						.get('custom', List())
						.find(block => block.get('customId') === key, this, Map())
				: profile.get(blockType, Map());

		const mask =
			this.props.source === 'publish'
				? // REFACTOR: 因無法用 graphql alias 處理，故手動重新 mapping mask 欄位名稱
				  (blockConfig.get('mask') || Map()).map(elm =>
						Map({ maskName: elm.get('name'), maskAlpha: elm.get('alpha') })
				  )
				: blockConfig.get('mask', Map());

		// 要傳給 template 的 props
		const config = {
			...blockConfig.toJS(),
			mask,
		};
		// 過濾未儲存的資料
		let data = stripIncompleteData(blockType, blockData, config);
		if (!data) return null;
		if (blockType === 'basic')
			return (
				<Template
					data={data.toJS()}
					config={config}
					commonMode={this.props.commonMode}
				/>
			);

		return (
			<div key={key} style={{ marginBottom: '25px' }}>
				<div
					className={`block-wrapper ${blockType}-${blockConfig.get(
						'templateType'
					)}`}
				>
					{blockType !== 'custom' && (
						<div className="block-title">
							<span className="block-title-dash" />
							<h3>{nameMap[blockType].name}</h3>
							{blockType === 'talent' && <TalentRatingDescription />}
							{blockType === 'github' && (
								<BrowserView>
									<img
										src={githubLogo}
										className="github-banner"
										alt="github"
									/>
								</BrowserView>
							)}
							{blockType === 'behance' && (
								<BrowserView>
									<img
										src={behanceLogo}
										className="behance-banner"
										alt="Behance"
									/>
								</BrowserView>
							)}
						</div>
					)}
					<Template
						data={data.toJS()}
						config={config}
						commonMode={this.props.commonMode}
					/>
				</div>
			</div>
		);
	};

	renderProfile = (
		profile = {},
		loading = false,
		error = {},
		showUnPublish = false
	) => {
		const data = fromJS(profile);
		const userToJS = this.props.user.toJS();
		const { commonMode } = this.props;

		if (loading) {
			return (
				<FullLoading>
					<h3>正在讀取中 ...</h3>
					<Loading />
				</FullLoading>
			);
		}

		if (hasAnyError(error)) {
			return (
				<FullContainer>
					<LightboxWrongCopy />
				</FullContainer>
			);
		}

		// 未公開
		if (showUnPublish) {
			const isUserProfile = userToJS.pid === parseInt(profile.pid, 10);
			return (
				<FullContainer>
					{/* <img src={ isUserProfile ? file : farEye } alt="發佈" width="480" /> */}
					<h3
						style={{
							fontSize: '36px',
							marginBottom: '10px',
							fontWeight: '400',
						}}
						id="profile_content_message"
					>
						{isUserProfile ? '你的個人檔案尚未公開' : '此用戶尚未公開檔案'}
					</h3>
					<p style={{ fontSize: '16px', color: '#666', marginBottom: '35px' }}>
						{isUserProfile
							? '到編輯頁按下『發佈檔案』即可讓大家看到你！'
							: '這個用戶的檔案還在建構中，先去『瞧瞧別人』吧！'}
					</p>
					{!commonMode && (
						<div>
							{isUserProfile ? (
								<SubmitButton
									onClick={() => this.props.history.push('/editor')}
								>
									立刻前往編輯器
								</SubmitButton>
							) : (
								<SubmitButton onClick={this.errorHandler}>
									立刻去瞧瞧別人
								</SubmitButton>
							)}
						</div>
					)}
				</FullContainer>
			);
		}

		const basicConfig = data
			.get('blocks', List())
			.find(block => block.get('blockType') === 'basic', this, Map());
		const blocksList = data
			.get('blocks', List())
			.filter(block => block.get('blockType') !== 'basic')
			.map(block => block.get('uniKey', Map()));

		const menubarStatus =
			this.props.profileDrawerVisible && !this.props.commonMode
				? 'profile-personal-information-open'
				: 'profile-personal-information-close';

		return (
			<WebAppContainer style={this.props.commonMode ? { paddingTop: '0' } : {}}>
				<div className={`paint-wrapper ${this.props.theme} ${menubarStatus}`}>
					<div
						className={`user-data user-${basicConfig.get('templateType')}`}
						id="basic"
					>
						{this.renderBlock(basicConfig.get('uniKey'), data)}
					</div>
					<div className="paint-container">
						{blocksList.map(key => this.renderBlock(key, data))}
					</div>
				</div>
			</WebAppContainer>
		);
	};

	renderSEOMeta = (profile, shareType) => {
		// for SEO Meta
		const basicData = fromJS(profile) || Map();
		const metaText = {
			title: `${basicData.getIn(
				['basic', 'userName'],
				'使用者'
			)}的個人檔案 - 104個人檔案`,
			url: `https:${generalConfig.siteUrl}/profile/${basicData.get('pid')}`,

			// 去除 html tag 並最多取 150 字，中文字 length 也是算 1
			description: DOMPurify.sanitize(
				basicData.getIn(
					['basic', 'introduction'],
					'104個人檔案，打造你最亮眼的專業形象，顛覆你對履歷表的想像。'
				),
				{
					ALLOWED_TAGS: [],
					KEEP_CONTENT: true,
				}
			).slice(0, 150),
			avatar: basicData.getIn(
				['basic', 'avatarFileUrls', 'w600'],
				`https:${generalConfig.siteUrl}/images/avatarDef.png`
			),
			avatarSize: basicData.getIn(['basic', 'avatarFileUrls', 'w600'])
				? 300
				: 412,
		};

		return (
			<Helmet>
				<title>{metaText.title}</title>
				<meta name="description" content={metaText.description} />
				<meta property="og:title" content={metaText.title} />
				<meta property="og:url" content={metaText.url} />
				<meta property="og:description" content={metaText.description} />
				<meta property="og:image" content={metaText.avatar} />
				<meta property="og:image:width" content={metaText.avatarSize} />
				<meta property="og:image:height" content={metaText.avatarSize} />
				<meta
					name="robots"
					content={`${
						shareType !== 'PUBLIC' ? 'noindex, nofollow' : 'index, follow'
					}`}
				/>
			</Helmet>
		);
	};

	render() {
		const {
			user,
			match,
			source,
			editor,
			fetchNamecard,
			fetchPublish,
			profileDrawerVisible,
			mobileDrawervisible,
			commonMode,
			plusMode,
		} = this.props;

		let mainContent = null;

		if (source === 'editor') {
			mainContent = this.renderProfile(
				editor.profile,
				editor.loading,
				editor.error,
				editor.showUnPublish
			);
		}

		if (source === 'publish') {
			mainContent = (
				<Fragment>
					{this.renderSEOMeta(
						fetchPublish.ShareProfile,
						(fetchNamecard &&
							fetchNamecard.Namecard &&
							fetchNamecard.Namecard.shareType) ||
							'PRIVATE'
					)}
					<BrowserView>
						<div ref={el => (this.print = el)}>
							{this.renderProfile(
								fetchPublish.ShareProfile,
								fetchPublish.loading,
								fetchPublish.error,
								isPrivateProfile(fetchPublish.error)
							)}
						</div>
						{fetchNamecard &&
							fetchNamecard.Namecard &&
							fetchPublish &&
							fetchPublish.ShareProfile &&
							(fetchNamecard.Namecard.shareType === 'PUBLIC' ||
								fetchNamecard.Namecard.shareType === 'LINK') &&
							!commonMode && (
								<Drawer
									width={310}
									open={profileDrawerVisible}
									className="profile-personal-information"
									containerClassName="profile-personal-information-container"
								>
									<div
										className="profile-personal-information-switch"
										onClick={this.handleToggle}
									>
										<Icon
											type={profileDrawerVisible ? 'close' : 'right'}
											style={
												profileDrawerVisible ? { margin: '17px 0 0 22px' } : {}
											}
											theme="outlined"
										/>
									</div>
									<PersonalInformation
										data={fetchPublish.ShareProfile}
										visitCountData={fetchNamecard.Namecard}
										graphql={fetchNamecard}
									/>
								</Drawer>
							)}
					</BrowserView>
					<MobileView>
						{this.renderProfile(
							fetchPublish.ShareProfile,
							fetchPublish.loading,
							fetchPublish.error,
							isPrivateProfile(fetchPublish.error)
						)}
						{fetchNamecard &&
							fetchNamecard.Namecard &&
							fetchPublish &&
							fetchPublish.ShareProfile &&
							(fetchNamecard.Namecard.shareType === 'PUBLIC' ||
								fetchNamecard.Namecard.shareType === 'LINK') &&
							!commonMode && (
								<MobileDrawer
									height={this.getDrawerHeight(
										fetchNamecard.Namecard.pid,
										user.get('pid')
									)}
								>
									<span
										className="profile-personal-information-mobile-bottom"
										onClick={this.mobileHandleToggle}
									>
										<Icon
											type={mobileDrawervisible ? 'close' : 'up'}
											theme="outlined"
										/>
									</span>
									<MobilePersonalInformation
										data={fetchPublish.ShareProfile}
										visitCountData={fetchNamecard.Namecard}
										height={344}
										graphql={fetchNamecard}
									/>
								</MobileDrawer>
							)}
					</MobileView>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<WebAppBody>
					{!commonMode && (
						<Header
							optionRightList={
								match.params.pid === user.get('pid')
									? ['search', 'login']
									: ['search', 'login']
							}
							profilePage={true}
							mobileLogo={true}
							plusMode={plusMode}
						/>
					)}
					{mainContent}
				</WebAppBody>
			</Fragment>
		);
	}
}

const mapStateToPorps = (state, props) => ({
	// 為了讓 editor 與 publish 資料格式相同
	editor: {
		profile: {
			pid: props.match.params.pid,
			blocks: state
				.get('blocksList')
				.map(blockId => state.getIn(['config', blockId]))
				.unshift(
					state.get('config').find(block => block.get('blockType') === 'basic')
				)
				.toJS(),
			...state
				.get('config')
				.map(block =>
					Map({
						[block.get('blockType')]: state.getIn([
							'data',
							block.get('uniKey'),
						]),
					})
				)
				.reduce(
					(data, current) =>
						current.has('custom')
							? data.updateIn(['custom'], List(), list =>
									list.push(current.get('custom'))
							  )
							: data.mergeDeep(current),
					Map()
				)
				.toJS(),
		},
		loading:
			checkProcessIsLoading(state.getIn(['process']), 'fetchAllData') ||
			!checkProcessIsDone(state.getIn(['process']), 'fetchAllData'),
		error: false,
		showUnPublish: false,
	},
	theme: state.getIn(['ui', 'factory', 'theme']),
	user: state.get('user'),
	print: state.getIn(['ui', 'print', 'printStart']),
	mobileDrawervisible: state.getIn(['ui', 'mobileDrawer', 'visible']),
	profileDrawerVisible: state.getIn(['ui', 'ProfileDrawer', 'visible']),
});

export default compose(
	withRouter,
	connect(
		mapStateToPorps,
		{
			printStart,
			mobileDrawerOpen,
			mobileDrawerClose,
			clearPreviousSimilar,
			fetchAllDataProcessStart,
			requestAddProfileVisitCount,
			profileDrawerOpen,
			profileDrawerClose,
		}
	),
	graphql(FETCH_NAMECARD, {
		name: 'fetchNamecard',
		skip: ({ source }) => source !== 'publish',
		options: ({ match }) => ({
			variables: {
				pid: match.params.pid,
			},
			fetchPolicy: 'network-only',
		}),
	}),
	graphql(FETCH_PUBLISH, {
		name: 'fetchPublish',
		skip: ({ source }) => source !== 'publish',
		options: ({ match }) => ({
			variables: {
				pid: match.params.pid,
				uuid: getURLQuery().t || '',
			},
			fetchPolicy: 'network-only',
		}),
	})
)(Profile);
