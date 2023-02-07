import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Checkbox } from 'antd';
import { fromJS } from 'immutable';
import uuidv4 from 'uuid/v4';
import Lightbox from '../lightbox';
import './style.css';
import {
	requestFetchConnectorRawData,
	requestCreateConnectorSnapshot,
} from 'actions/blocks/connector';
import { lightboxClose } from 'actions/ui/lightbox';
import { addCard, updateCard } from 'actions/ui/card';
import { changeShowTag } from 'actions/ui/factory';
import generalConfig from 'config/general';
import {
	LightboxLoading,
	Loading,
	SubmitButton,
	DisabledSubmitButton,
	GrayBorderButtonWhiteBackground,
} from 'share/styledComponents';
import { PusherConnectAction } from 'actions/pusher';
import { checkProcessIsLoading } from 'utils/process';
import LightboxWrongCopy from 'components/lightboxWrongCopy';
import withScrollAnchor from 'containers/scrollAnchor';
import { compose } from 'recompose';

// antd Icon 的 API 只支援 style，無支援 className
const check_icon = {
	width: '26px',
	height: '26px',
	boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.5)',
	backgroundColor: '#f5b523',
	border: 'solid 1px #fff',
	color: '#fff',
	borderRadius: '50%',
	fontSize: '18px',
	lineHeight: '1.5',
	right: '5px',
	top: '2px',
	position: 'absolute',
};

let defaultGithubModule = {
	createTimestamp: 0,
	githubURL: '',
	pid: -3,
	followersCount: 0,
	publicGistCount: 0,
	publicRepoCount: 0,
	repoList: [
		{
			repoName: '',
			repoDescription: '',
			repoURL: '',
			repoForks: 0,
			repoStargazers: 0,
			repoWatchers: 0,
			repoLanguages: [],
		},
	],
	type: 'GITHUB',
};

class GithubRepo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRepos: fromJS([]), // 已選擇的 repo
			selectAllRepos: false, // 全選
		};
	}

	componentDidMount = () => {
		const {
			user,
			PusherConnectAction,
			requestFetchConnectorRawData,
		} = this.props;
		const pid = user.get('pid');
		const pusherStatus = user.get('pusher');

		if (pusherStatus === 'initial' || pusherStatus === 'error') {
			PusherConnectAction({
				key: generalConfig.pusher.key,
				options: {
					cluster: generalConfig.pusher.cluster,
					authEndpoint: generalConfig.endpoints.pusher,
					encrypted: true,
				},
			});
		}

		// 因為可以重匯，所以有無hasToken都去抓RawData
		requestFetchConnectorRawData('github', { pid });
	};

	/* 全部選取Checkbox */
	_toggleSelectAll = e => {
		const { rawData } = this.props;
		this.setState({
			selectedRepos: e.target.checked
				? rawData.get('repoList').map((list, index) => index)
				: fromJS([]),
			selectAllRepos: e.target.checked,
		});
	};

	/* 單選取github區塊 */
	_toggleSelectOne = (index, e) => {
		const { rawData } = this.props;
		const { selectedRepos } = this.state;
		const checkedArray = selectedRepos.includes(index)
			? selectedRepos.filter(arr => arr !== index)
			: selectedRepos.push(index);

		this.setState({
			selectedRepos: checkedArray,
			selectAllRepos: checkedArray.size === rawData.get('repoList').size,
		});
	};

	/* 選取確認 */
	_submitSelection = () => {
		const { selectedRepos } = this.state;
		const {
			uniKey,
			data,
			rawData,
			config,
			blocksList,
			user,
			addCard,
			updateCard,
			lightboxClose,
			requestCreateConnectorSnapshot,
			changeShowTag,
		} = this.props;
		const pid = user.get('pid');
		const insertIndex = blocksList.toJS().length;
		const repoList = rawData
			.get('repoList')
			.filter((elm, idx) => selectedRepos.includes(idx));
		const githubModule = data
			.merge(rawData)
			.set('pid', pid)
			.set('repoList', repoList)
			.toJS();

		requestCreateConnectorSnapshot('github', githubModule);
		addCard('github', uniKey, insertIndex, 'def', !config);
		updateCard(uniKey, githubModule);
		changeShowTag('github');
		lightboxClose();
		setTimeout(() => {
			this.props.scrollToAnchor(uniKey);
		}, 100);
	};

	// 導向認證視窗
	_renderCertification = () => {
		const pusherStatus = this.props.user.get('pusher');
		let content = null;
		switch (pusherStatus) {
			case 'initial':
			case 'pending':
				content = (
					<LightboxLoading>
						<h4 style={{ marginBottom: '30px' }}>建立連線中 ...</h4>
						<Loading />
					</LightboxLoading>
				);
				break;
			case 'success':
				content = this.props.isFetchingRawData ? (
					<LightboxLoading>
						<h4 style={{ marginBottom: '30px' }}>取得 Github 服務資料中 ...</h4>
						<Loading />
					</LightboxLoading>
				) : (
					<div className="certified_main">
						<Icon type="github" style={{ fontSize: 100, color: '#000' }} />
						<div className="not_certified_yet">唔，我們尚未取得你的授權</div>
						<div className="please_verify">
							請授權你的 GitHub 帳號，以匯入你在 GitHub 所經營的成果，在
							104個人檔案 完整呈現你的個人經歷！
						</div>
						<SubmitButton
							onClick={() =>
								window.open(generalConfig.endpoints.github, 'linkGithub')
							}
						>
							授權我的帳號
						</SubmitButton>
					</div>
				);
				break;
			case 'error':
			default:
				content = (
					<LightboxLoading>
						<LightboxWrongCopy text="處理過程發生錯誤，請稍後再試一次！" />
					</LightboxLoading>
				);
		}

		return (
			<Lightbox
				onCancel={this.props.lightboxClose}
				title=""
				cssClassName="githubLightbox"
				afterClose={this.props.closeGithubRepo}
				width="600px"
			>
				{content}
			</Lightbox>
		);
	};

	// 選擇 github repo 視窗
	_renderSelection = () => {
		const {
			rawData,
			isFetchingRawData,
			lightboxClose,
			closeGithubRepo,
		} = this.props;
		const { selectAllRepos, selectedRepos } = this.state;
		const rawDataRepoList = rawData && rawData.get('repoList');

		if (isFetchingRawData || !rawDataRepoList) {
			return (
				<Lightbox
					onCancel={lightboxClose}
					title="選取 Github 要顯示的專案"
					cssClassName="githubLightbox"
					afterClose={closeGithubRepo}
					width="600px"
				>
					<LightboxLoading>
						<Loading />
					</LightboxLoading>
				</Lightbox>
			);
		}

		if (!rawDataRepoList.size) {
			return (
				<Lightbox
					onCancel={lightboxClose}
					title="選取 Github 要顯示的專案"
					cssClassName="githubLightbox"
					afterClose={closeGithubRepo}
					width="600px"
				>
					<p className="github-empty">
						你在 GitHub 上目前沒有專案資料可匯入，請先到 GitHub
						上傳你的成果再回來吧！
					</p>
					<div className="github-button">
						<GrayBorderButtonWhiteBackground onClick={lightboxClose}>
							我知道了
						</GrayBorderButtonWhiteBackground>
					</div>
				</Lightbox>
			);
		}

		return (
			<Lightbox
				onCancel={lightboxClose}
				title="選取 Github 要顯示的專案"
				cssClassName="githubLightbox"
				afterClose={closeGithubRepo}
				width="977px"
			>
				<Checkbox onChange={this._toggleSelectAll} checked={selectAllRepos}>
					全部選取
				</Checkbox>
				<div className="github_outer_layer">
					{rawDataRepoList &&
						rawDataRepoList.toJS().map((elm, index) => (
							<div
								key={index}
								className={
									selectedRepos.includes(index)
										? 'github-block-main isCheck'
										: 'github-block-main'
								}
								onClick={this._toggleSelectOne.bind(this, index)}
							>
								{selectedRepos.includes(index) && (
									<Icon type="check" style={check_icon} />
								)}
								<div className="github-block-title">{elm.repoName}</div>
								<div className="github-block-content">
									<div className="github-block-description">
										{elm.repoDescription}
									</div>
									<div className="github-block-hide-footer" />
								</div>
								<div className="github-block-footer">
									<span>
										<i className="icon-icon_favorite" /> {elm.repoStargazers}
									</span>
									<span>
										<i className="icon-icon_dialogue" /> {elm.repoForks}
									</span>
									<span>
										<i className="icon-icon-icon_watching" /> {elm.repoWatchers}
									</span>
								</div>
							</div>
						))}
				</div>
				<div className="white_gradient" />
				<div className="github-button">
					{selectedRepos.toJS().length > 0 ? (
						<SubmitButton onClick={this._submitSelection}>確認</SubmitButton>
					) : (
						<DisabledSubmitButton>確認</DisabledSubmitButton>
					)}
				</div>
			</Lightbox>
		);
	};

	render() {
		return this.props.hasToken
			? this._renderSelection()
			: this._renderCertification();
	}
}

const mapStateToPorps = (state, props) => {
	const config = state
		.get('config')
		.find(elm => elm.get('blockType') === 'github');
	const uniKey = config ? config.get('uniKey') : uuidv4();
	return {
		uniKey,
		blocksList: state.get('blocksList'),
		template: state.getIn(['templates', 'github']).toArray(),
		user: state.get('user'),
		data: state.getIn(['data', uniKey]) || fromJS(defaultGithubModule),
		rawData: state.getIn(['connector', 'github', 'rawData']),
		hasToken: state.getIn(['connector', 'github', 'hasToken']),
		config,
		isFetchingRawData: checkProcessIsLoading(
			state.getIn(['process']),
			'fetchConnectorRawData',
			'github'
		),
	};
};

export default compose(
	connect(
		mapStateToPorps,
		{
			requestFetchConnectorRawData,
			requestCreateConnectorSnapshot,
			addCard,
			updateCard,
			lightboxClose,
			changeShowTag,
			PusherConnectAction,
		}
	),
	withScrollAnchor
)(GithubRepo);
