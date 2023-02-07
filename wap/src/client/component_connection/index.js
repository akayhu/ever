import React, {Component} from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Promise from 'bluebird';
import compose from 'src/util/compose';

import { getActive, getDataList } from 'src/client/reducers/connection';
// actions
import { checkIdentity } from 'src/client/actions/profile';
import { initConnectionPage, changeActive, getGroupItemList } from 'src/client/actions/connection';
// components
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import Info from 'src/client/component_profile/info';
import Cover from 'src/client/component_profile/cover';
import ConnectionBase from 'src/client/component_connection/connectionBase';
import SearchBar from 'src/client/component_common/searchBar';
import { bindActionCreators } from 'redux';
import clientConfig from 'src/configs/client';
import {components as CPlatformComponents} from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;
const cateMap = {
	1: 'colleagues',
	2: 'classmate',
	3: 'friend',
	colleagues: 1,
	classmate: 2,
	friend: 3
};

class Connection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mode: props.location.query.mode || 'friend'
		};
	}

	componentDidMount() {
		const { initConnectionPage, changeActive, params, active, viewas} = this.props;
		const targetPid = params.pid;
		// if( viewas === 'self' || parseInt(targetPid) !== parseInt(this.props.pid)) {
			initConnectionPage(targetPid)
				.then(res => this.checkUrlQuery(res))
				.then(category => {
					this.verifyMode(this.props);
				});
		// }

		
		
	}

	componentWillReceiveProps(nextProps) {
    // 切換角度


		const { changeActive, viewas, active } = this.props;

		if (nextProps.viewas !== viewas) {
			if (nextProps.viewas !== 'self') {
				if( active !== 'following' && nextProps.location.query.mode !== 'following') changeActive('nonSelf');
			} else {
				changeActive((active === 'nonSelf') ? 3 : 'following');
			}

			return;
		}

		if (this.state.mode !== nextProps.location.query.mode) {
			this.verifyMode(nextProps);
		}
	}

	verifyMode(nextProps) {
		const { viewas, changeActive } = this.props;
		this.state.mode = nextProps.location.query.mode;

		let activeType = cateMap[this.state.mode] || this.state.mode;
		activeType = activeType || 'friend';

		// 若非本人，切換到朋友列表時應該要載入的資料是state.connection.nonSelf裡的資料
		if (viewas !== 'self' && (activeType === 3 || activeType === 'friend')) {
			changeActive('nonSelf');
		} else {
			changeActive(activeType);
		}
	}
	
	checkUrlQuery({nonSelf}) {

		if (nonSelf) {
			return Promise.resolve('nonSelf');
		}

		let category = 3;
		const tab = this.props.location.query.mode;
		if (tab) {
			if (tab === 'friend') {
				category = 3;
			} else if (tab === 'classmate') {
				category = 2;
			} else if (tab === 'colleague') {
				category = 1;
			} else {
				category = tab;
			}
		}

		return Promise.resolve(category);
	}

	render() {
		const { active } = this.props;
		return (
			<div styleName="connection-list">
				{/*
					<SearchBar
						handleSearch={ keyword => this.searchActivity(keyword) }
						searchKeyword={ this.state.keyword }
						placeholder="搜尋文章"
					/>
				*/}
				<div className="wrap_w200_m20_w760">
					<div className="left_side">
						<LeftSideNavigation navSetting={ this.props.navSetting } />
					</div>
					<div className="right_side">
						<ConnectionBase category={ active } />
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const nowState = state.connection;
	const groupItems = getDataList(nowState, 'groupItems');
	const groupItemList = [];
	const activeTab = props.location.query.mode || 'friend';

	groupItems.sort((a, b) => b.groupId - a.groupId).map((item) => {
		groupItemList.push({
			title: item.groupName,
			itemKey: cateMap[item.groupId],
			count: 0,
			url: `/profile/${props.params.pid}/connection?mode=${cateMap[item.groupId]}`,
			subItems: []
		});
	});

	const navSetting = {
		activeTab,
		navList: [
			{
				title: '我的朋友',
				itemKey: '',
				count: 0,
				url: '',
				subItems: groupItemList
			},
			{
				title: '待確認的邀請',
				itemKey: '',
				count: 0,
				url: '',
				subItems: [
					{
						title: '我收到的邀請',
						itemKey: 'invitations',
						count: 0,
						url: `/profile/${props.params.pid}/connection?mode=invitations`,
						subItems: []
					},
					{
						title: '待對方確認的邀請',
						itemKey: 'unconfirmed',
						count: 0,
						url: `/profile/${props.params.pid}/connection?mode=unconfirmed`,
						subItems: []
					}
				]
			},
			{
				title: '我關注的',
				itemKey: 'following',
				count: 0,
				url: `/profile/${props.params.pid}/connection?mode=following`,
				subItems: []
			},
			{
				title: '關注我的人',
				itemKey: 'myfollowers',
				count: 0,
				url: `/profile/${props.params.pid}/connection?mode=myfollowers`,
				subItems: []
			},
			{
				title: '可能認識的人',
				itemKey: 'mayKnowPeopleList',
				count: 0,
				url: `/profile/${props.params.pid}/connection?mode=mayKnowPeopleList`,
				subItems: []
			},
			{
				title: '值得關注的對象',
				itemKey: 'excellentPeopleList',
				count: 0,
				url: `/profile/${props.params.pid}/connection?mode=excellentPeopleList`,
				subItems: []
			}
		]
	};

	if (state.profile.viewas !== 'self') {
		navSetting.navList = [
			{
				title: '朋友列表',
				itemKey: 'friend',
				count: 0,
				url: `/profile/${props.params.pid}/connection?mode=friend`,
				subItems: []
			}
		];

		if (state.privacy.subscribe !== 0) {
			navSetting.navList.push({
				title: '關注列表',
				itemKey: 'following',
				count: 0,
				url: `/profile/${props.params.pid}/connection?mode=following`,
				subItems: []
			});
		}
	}

	return {
		active: getActive(nowState),
		viewas: state.profile.viewas,
		subscribePrivacy: state.privacy.subscribe,
		navSetting,
		pid: state.user.pid
	};
}

const actions = {
	initConnectionPage, changeActive, getGroupItemList, checkIdentity
};

export default compose(
	connect(mapStateToProps, actions),
	[CSSModules, '_', css]
)(Connection);
