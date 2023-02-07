import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { isEmpty } from 'lodash/lang';
import { Tab, Tabs } from 'c_wap_module';
// actions
import { initGroupActivityPage, initGroupMemberPage, initSingleGroupInfo } from 'src/client/actions/group';
import { loadListDataCenter, initialEntity } from 'src/client/actions/general';
import { changeSSRStatus } from 'src/client/actions/ssrStatusCode';
import { getChannel } from 'src/client/selectors';
// components
import BigCard from 'src/client/components/channel/groupBigCard';
import Summary from 'src/client/components/channel/summary';
import JoinGroupBtn from 'src/client/components/channel/joinGroupBtn';
import HaveActionActivityList from 'src/client/components/activity/river';
import PeopleList from 'src/client/components/peopleList';
import clientConfig from 'src/configs/client';
// import checkRescrape from 'src/util/fbRescrape';
import Announcement from 'src/client/components/announcement/index';

class MGroup extends Component {
	constructor(props) {
		super(props);
		this.tab = '社團動態';
		this.tabChange = this.tabChange.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (Object.keys(nextProps.channelInfo).length === 0) this.props.router.push('/m/error/404');
	}
	componentWillMount() {
		const {
			channelId,
			initSingleGroupInfo,
			isLogin,
			initGroupActivityPage,
			initGroupMemberPage,
		} = this.props;

		initSingleGroupInfo(channelId).then((channelInfo) => {
			// console.log(channelInfo);
			if (
				channelInfo &&
				(
					(channelInfo.joinSetting === 0) ||
					(channelInfo.joinSetting === 1 && (isLogin === true || channelInfo.isMember === true))
				)
			) {
				initGroupActivityPage(channelId);
				initGroupMemberPage(channelId);
			} else {
				this.props.changeSSRStatus(404);
			}
		});
	}
	// componentDidMount() {
	// 	const currentPath = this.props.location.pathname;
	// 	// 公開社團才檢查 FB 快取
	// 	if (this.props.channelInfo.type === 8) {
	// 		checkRescrape(
	// 			`https://${document.location.hostname}${currentPath}`,
	// 			clientConfig.params.fbEToken,
	// 			clientConfig.params.fbPrvKeyPem,
	// 			1000 * 3600 * 6,
	// 		);
	// 	}
	// }
	tabChange(prevTab, nextTab) {
		this.tab = nextTab;
	}
	loadActivityMore() {
		const { channelId, channelInfo, isLogin, loadListDataCenter } = this.props;

		if (this.tab !== '社團動態') {
			return;
		}

		if (
			channelInfo &&
			(
				(channelInfo.joinSetting === 0) ||
				(channelInfo.joinSetting === 1 && (isLogin === true || channelInfo.isMember === true))
			)
		) {
			loadListDataCenter({
				domain: 'group',
				key: 'activity',
				channelId,
			});
		}
	}
	loadMemberMore() {
		const { channelId, channelInfo, isLogin, loadListDataCenter } = this.props;

		if (this.tab !== '社團成員') {
			return;
		}

		if (
			channelInfo &&
			(
				(channelInfo.joinSetting === 0) ||
				(channelInfo.joinSetting === 1 && (isLogin === true || channelInfo.isMember === true))
			)
		) {
			loadListDataCenter({
				domain: 'group',
				key: 'member',
				channelId,
			});
		}
	}
	render() {
		const { channelId, channelInfo, isLogin, activity, member } = this.props;
		if (isEmpty(this.props.channelInfo)) return null;
		return (
			<main styleName="wrap">
				<Announcement />
				<BigCard channelId={ channelId } />
				<Tabs onChange={ this.tabChange }>
					<Tab name="社團動態">
						<div className="wrapper" styleName="m_block">
							<Summary channelInfo={ channelInfo } />
							<div styleName="tags">
								社團類型：
								{ channelInfo && channelInfo.categoryName }
							</div>
							<div styleName="tags">
								社團標籤：
								{
									channelInfo &&
									channelInfo.tags &&
									channelInfo.tags.map((tag) => {
										return (
											<span key={ tag }>{ tag }</span>
										);
									})
								}
							</div>
							<div styleName="buttons">
								{
									channelInfo &&
									<JoinGroupBtn
										isLogin={ isLogin }
										buttonStyle="primary"
										channelId={ channelId }
										isHead={ channelInfo.isHead }
										isMember={ channelInfo.isMember }
										isApplying={ channelInfo.isApplying }
										joinSetting={ channelInfo.joinSetting || 0 }
										noticeStatus={ channelInfo.noticeStatus }
									/>
								}
							</div>
							{
								channelInfo && activity &&
								(
									(channelInfo.joinSetting === 0) ||
									(channelInfo.joinSetting === 1 && (isLogin === true || channelInfo.isMember === true))
								) &&
								<div styleName="activity_list">
									<HaveActionActivityList
										loading={ activity.loading }
										error={ activity.error }
										end={ activity.end }
										dataList={ activity.dataList }
										loadingAct={ this.loadActivityMore.bind(this) }
										from={ channelInfo.name }
										pageName="group"
										filter={ channelId }
									/>
								</div>
							}
						</div>
					</Tab>
					<Tab name="社團成員">
						<div className="wrapper" styleName="m_block">
							{
								channelInfo && member &&
								(
									(channelInfo.joinSetting === 0) ||
									(channelInfo.joinSetting === 1 && (isLogin === true || channelInfo.isMember === true))
								) &&
								<div styleName="people_list">
									<PeopleList
										loading={ member.loading }
										error={ member.error }
										end={ member.end }
										dataList={ member.dataList }
										hasButton={ true }
										loadingAct={ this.loadMemberMore.bind(this) }
									/>
								</div>
							}
						</div>
					</Tab>
				</Tabs>
			</main>
		);
	}
}

function selector(state, props) {
	const channelId = props.params.gid;
	return {
		isLogin: state.user.isLogin,
		pid: state.user.pid,
		channelId,
		channelInfo: getChannel({ state, channelId, key: 'channelInfo' }),
		activity: getChannel({ state, channelId, key: 'activity' }),
		member: getChannel({ state, channelId, key: 'member' }),
	};
}

const actions = {
	initGroupActivityPage,
	initGroupMemberPage,
	loadListDataCenter,
	initSingleGroupInfo,
	initialEntity,
	changeSSRStatus,
};

export default compose(
	connect(selector, actions),
	[CSSModules, '_', css, { allowMultiple: true }],
)(MGroup);
