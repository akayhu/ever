import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { canUseDOM } from 'exenv';
// import { changeMemberTab, loadDataCenter, triggetSearch } from 'src/client/actions/channel';
import { changeChannelTab, loadDataCenter, triggetSearch, clearSearch } from 'src/client/actions/channel';
import { changeSSRStatus } from 'src/client/actions/ssrStatusCode';
import { getChannelInfoData, getIsLoading, getDataByKey } from 'src/client/reducers/channel';

import Cover from 'src/client/component_channel/cover';
import SearchBar from 'src/client/component_common/searchBar';
import ChannelMain from 'src/client/component_channel/channel/channelMain';
import {
	components as CPlatformComponents,
	actions as CPlatformActions
} from 'c_platform';
import clientConfig from 'src/configs/client';
// import checkRescrape from 'src/util/fbRescrape';

const { setMetadata } = CPlatformActions.metadata;
const ViewWrapper = CPlatformComponents.ViewWrapper;

class ChannelIndex extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			isShow: (!canUseDOM),
			searchKeyword: '',
			activeTab: '',
			pathname: props.location.pathname,
		};

		this.mounted = false;
		this.detectCurrentTab = this.detectCurrentTab.bind(this);
	}
	componentWillMount() {
		const { loadDataCenter, params: { cid }, userPid } = this.props;
		loadDataCenter('mediaInfo', 'init', { channelId: cid }).then((res) => {
			if (!res) {
				// 如果沒資料則吐500並導回error 500頁
				this.props.changeSSRStatus(500);
				this.props.router.push('/error/500');
			} else if (res.warning) {
				// 如果沒此頻道吐404並導回error 404頁
				this.props.changeSSRStatus(404);
				this.props.router.push('/error/404/channel');
			}
			if (res) {
				this.props.setMetadata('channel', {
					pid: userPid,
					title: `${res.response.name.substring(0, 49)} - 104 職涯社群`,
					name: res.response.name,
					image: {
						url: `https:${res.response.coverWebUrl}`,
						width: 960,
						height: 350
					},
					description: `${res.response.description.substring(0, 149)} - 104 職涯社群`,
					url: `https:${clientConfig.params.wapUrl}/channel/${cid}`,
					mUrl: `https:${clientConfig.params.wapUrl}/m/channel/${cid}`,
				});
			}
		});
	}
	componentDidMount() {
		const currentPath = this.props.location.pathname || 'activity';
		const activeTab = this.detectCurrentTab(currentPath);
		this.props.changeChannelTab(activeTab);
		this.props.clearSearch();
		this.setState({
			activeTab,
			isShow: true
		});
		// 頻道一律公開，檢查 FB 快取
		// checkRescrape(
		// 	`https://${document.location.hostname}${currentPath}`,
		// 	clientConfig.params.fbEToken,
		// 	clientConfig.params.fbPrvKeyPem,
		// 	1000 * 3600 * 6
		// );
		window.elogPage = 'channel';
	}
	componentWillReceiveProps(nextProps) {
		const currentPath = nextProps.location.pathname;
		// 路徑不一樣才進行偵測
		if (this.state.pathname !== currentPath) {
			const activeTab = this.detectCurrentTab(currentPath);
			if (activeTab && this.state.activeTab !== activeTab) {
				this.props.changeChannelTab(activeTab);
				this.props.clearSearch();
				this.setState({
					activeTab,
					pathname: currentPath,
				});
			}
		}
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	search(searchKeyword) {
		const { router, tab, triggetSearch, params: {cid} } = this.props;
		if (tab === 'management') {
			router.push({
				pathname: `/channel/${cid}`
			});
		}
		triggetSearch(searchKeyword);
	}
	/**
	 * [偵測路徑，決定當前tab]
	 *  頻道文章：/channel/:cid
	 *  頻道成員：/channel/:cid/member
	 *  頻道設定：/channel/:cid/management or /channel/:cid/management?mode=....
	 *  頻道管理員：/channel/:cid/member/admin
	 */
	detectCurrentTab(path = '') {
		if (!path) return false;

		const pathTestStrs = {
			activity: /\/channel\/\d+$/i,
			member: /\/channel\/\d+\/member$/i,
			management: /\/channel\/\d+\/management.*$/i,
			admin: /\/channel\/\d+\/member\/admin$/i,
		};
		let activeTab = false;

		Object.keys(pathTestStrs).forEach((tabName) => {
			if (pathTestStrs[tabName].test(path)) {
				activeTab = tabName;
			}
		});
		return activeTab;
	}
	render() {
		const { dataInfo, tab, dataInfoLoading, searchKeyword } = this.props;

		return (
			<ViewWrapper { ...this.props } >
				{
					this.state.isShow &&
					<div className="container_wrap">
						<Cover
							dataInfo={ dataInfo }
							dataInfoLoading={ dataInfoLoading }
							location={ this.props.location }
							params={ this.props.params }
						/>
						<SearchBar
							placeholder={ (tab === 'member') || (tab === 'admin') ? '搜尋頻道成員' : '搜尋頻道文章' }
							handleSearch={ keyword => this.search(keyword) }
							searchKeyword={ searchKeyword }
							allowEmpty
						/>
						{this.props.children ? this.props.children : <ChannelMain params={ this.props.params } />}
					</div>
				}
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state) {
	const nowState = state.channel;
	return {
		userPid: state.user.pid,
		tab: nowState.channelInfo.tab,
		dataInfo: getChannelInfoData(nowState),
		dataInfoLoading: getIsLoading(nowState, 'mediaInfo'),
		searchKeyword: getDataByKey(nowState, 'searchKeyword')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadDataCenter: (tab, isInit, options) => dispatch(loadDataCenter(tab, isInit, options)),
		triggetSearch: text => dispatch(triggetSearch(text)),
		changeChannelTab: tab => dispatch(changeChannelTab(tab)),
		clearSearch: () => dispatch(clearSearch()),
		setMetadata: (key = 'channel', params = {}) => dispatch(setMetadata(key, params)),
		changeSSRStatus: status => dispatch(changeSSRStatus(status))
	};
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	// translate([]),
	// [CSSModules, '_', css, { allowMultiple: true }]
)(ChannelIndex);
