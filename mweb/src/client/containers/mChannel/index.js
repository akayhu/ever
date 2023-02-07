import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { isEmpty } from 'lodash/lang';
import { Tab, Tabs } from 'c_wap_module';
import { has } from 'lodash/object';
// actions
import { initChannelMainPage, initChannelMemberPage } from 'src/client/actions/channel';
import { loadListDataCenter } from 'src/client/actions/general';
import { getChannel } from 'src/client/selectors';

// components
import ChannelBigCard from 'src/client/components/channel/channelBigCard';
import Summary from 'src/client/components/channel/summary';
import HaveActionActivityList from 'src/client/components/activity/river';
import clientConfig from 'src/configs/client';
// import checkRescrape from 'src/util/fbRescrape';

class MChannel extends Component {
	constructor(props, context) {
		super(props, context);

		this.tab = '關於';
	}
	componentWillMount() {
		const {channelId, initChannelMainPage, initChannelMemberPage} = this.props;
		initChannelMainPage(channelId);
		initChannelMemberPage(channelId);
	}
	// componentDidMount(){
	// 	const currentPath = this.props.location.pathname;
	// 	// 頻道一律公開，檢查 FB 快取
	// 	checkRescrape(
	// 		`https://${document.location.hostname}${currentPath}`,
	// 		clientConfig.params.fbEToken,
	// 		clientConfig.params.fbPrvKeyPem,
	// 		1000 * 3600 * 6
	// 	);
	// }
	componentWillReceiveProps(nextProps) {
		const {channelId, initChannelMainPage, initChannelMemberPage} = this.props;
		if (Object.keys(nextProps.channelInfo).length === 0) this.props.router.push('/m/error/404');
		if (channelId !== nextProps.channelId) {
			initChannelMainPage(nextProps.channelId);
			initChannelMemberPage(nextProps.channelId);
		}
	}
	tabChange(prevTab, nextTab) {
		this.tab = nextTab;
	}
	loadActivityMore() {
		if(this.tab !== '文章'){
			return;
		}

		const {channelId, loadListDataCenter} = this.props;
		loadListDataCenter({
			domain: 'channel',
			key: 'activity',
			channelId,
		});
	}
	render() {
		const { channelId, channelInfo, isLogin, activity, member } = this.props;
		if (isEmpty(this.props.channelInfo)) return null;
		return (
			<main styleName="wrap">
				<ChannelBigCard
					channelId={ channelId }
				/>
				
				<Tabs onChange={this.tabChange.bind(this)}>
					<Tab name="關於">
						<div className="wrapper" styleName="m_block">
							<Summary channelInfo={ channelInfo } />
							
						</div>
					</Tab>
					<Tab name="文章">
						<div className="wrapper">
							{
								activity &&
								<div styleName="activity_list">
									<HaveActionActivityList
										loading={ activity.loading }
										error={ activity.error }
										end={ activity.end }
										dataList={ activity.dataList }
										loadingAct={ this.loadActivityMore.bind(this) }
										from={channelInfo.name}
										pageName="mediaContent"
										filter={ channelId }
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
	const channelId = props.params.cid;
	// console.log(state);
	return {
		isLogin: state.user.isLogin,
		pid: state.user.pid,
		channelId,
		channelInfo: getChannel({state, channelId, key: 'channelInfo'}),
		activity: getChannel({state, channelId, key: 'activity'}),
		member: getChannel({state, channelId, key: 'member'})
	};
}

export default compose(
	connect(selector, { initChannelMainPage, initChannelMemberPage, loadListDataCenter }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(MChannel);
