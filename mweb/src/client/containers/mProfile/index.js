import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { Tab, Tabs } from 'c_wap_module';
import { has } from 'lodash/object';
// actions
import { initProfilePage, changeProfilePage } from 'src/client/actions/profile';
import { loadListDataCenter } from 'src/client/actions/general';
// selectors
import { getProfiles, getProfileIsEmpty } from 'src/client/selectors';
// components
import BigCard from 'src/client/components/profile/bigCard';
import EmptyProfilePrompt from 'src/client/components/profile/emptyProfilePrompt';
import Summary from 'src/client/components/profile/summary';
import Exp from 'src/client/components/profile/exp';
import Edu from 'src/client/components/profile/edu';
import Honor from 'src/client/components/profile/honor';
import Gallery from 'src/client/components/profile/gallery';
import Endorse from 'src/client/components/profile/endorse';
import Appraise from 'src/client/components/profile/appraise';
import Colleague from 'src/client/components/profile/colleague';
import NoActionActivityList from 'src/client/components/activity/list';

class MProfile extends Component {
	constructor(props, context) {
		super(props, context);
		
		this.state = {
			mark: 'profile',
			noData: false,
		};
		this.tab = '個人檔案';
		this.checkHaveGetData = this.checkHaveGetData.bind(this);
	}
	componentWillMount() {
		const {targetPid, initProfilePage} = this.props;
		initProfilePage(targetPid);
	}
	componentWillReceiveProps(nextProps) {
		const {targetPid, initProfilePage, router, connectionStatus, error} = this.props;
		if (targetPid !== nextProps.targetPid) {
			return initProfilePage(nextProps.targetPid);
		}
		// getProfile api error
		if (nextProps.error) router.push('/m/error/404');
		// 黑名單時導向至404
		if (connectionStatus !== nextProps.connectionStatus && nextProps.connectionStatus === 4) {
			router.push('/m/error/404');
		}
	}
	checkHaveGetData(state, key) {
		return has(state, key) && !has(state[key], 'warning') && state[key].length !== 0;
	}
	checkHaveDataList(state) {
		return has(state, 'dataList') && state.dataList.length !== 0;
	}
	tabChange(prevTab, nextTab) {
		this.tab = nextTab;
		this.props.changeProfilePage({
			tab: matchName(this.tab),
			targetPid: this.props.targetPid,
		});
	}
	loadMoreActivity() {
		if (this.tab !== '動態') {
			return;
		}
		const { targetPid, loadListDataCenter } = this.props;
		loadListDataCenter({
			domain: 'profile',
			key: 'activity',
			targetPid,
		});
	}
	render() {
		const {
			profileIsEmpty,
			gallery,
			userInfo,
			viewAs,
			targetPid,
			event,
			endorse,
			appraise,
			colleague,
			activity,
			layerActivity,
			user,
			activitiesPool,
			error,
			router
		} = this.props;

		return (
			<main styleName="wrap">
				<BigCard
					viewAs={ viewAs }
					targetPid={ targetPid }
				/>
				<Tabs onChange={ this.tabChange.bind(this) }>
					<Tab name="個人檔案">
						<div className="wrapper" styleName="m_block">
							{
								profileIsEmpty &&
									<EmptyProfilePrompt />
							}
							<Summary userInfo={ userInfo } />
							{
								this.checkHaveGetData(event, 'exp') &&
									<Exp exp={ event.exp } />
							}
							{
								this.checkHaveGetData(event, 'edu') &&
									<Edu edu={ event.edu } />
							}
							{
								this.checkHaveGetData(event, 'honor') &&
									<Honor honor={ event.honor } />
							}
							{
								this.checkHaveDataList(gallery) &&
									<Gallery
										user={ user }
										gallery={ gallery }
										activitiesPool={ activitiesPool }
										layerActivity={ layerActivity }
									/>
							}
							{
								this.checkHaveDataList(endorse) &&
									<Endorse endorse={ endorse } />
							}
							{
								this.checkHaveDataList(appraise) &&
									<Appraise appraise={ appraise } />
							}
							{
								this.checkHaveDataList(colleague) &&
									<Colleague colleague={ colleague } />
							}
						</div>
					</Tab>
					<Tab name="動態">
						<div className="wrapper">
							{
								activity &&
								<NoActionActivityList
									loading={ activity.loading }
									error={ activity.error }
									end={ activity.end }
									dataList={ activity.dataList }
									loadingAct={ this.loadMoreActivity.bind(this) }
									from="動態"
									pageName="user"
									filter={ userInfo ? userInfo.pid : '' }
								/>
							}
						</div>
					</Tab>
				</Tabs>
			</main>
		);
	}
}

function matchName(tab) {
	switch (tab) {
		case '個人檔案':
			return 'profile';
		case '動態':
			return 'activity';
		default:
			return '';
	}
}

function selector(state, props) {
	const targetPid = props.routeParams.pid;
	return {
		pid: state.user.pid,
		viewAs: state.profile.viewAs,
		targetPid,
		connectionStatus: state.profile.connectionStatus,
		userInfo: getProfiles({state, targetPid, key: 'userInfo'}),
		event: getProfiles({state, targetPid, key: 'event'}),
		gallery: getProfiles({state, targetPid, key: 'gallery'}),
		endorse: getProfiles({state, targetPid, key: 'endorse'}),
		appraise: getProfiles({state, targetPid, key: 'appraise'}),
		colleague: getProfiles({state, targetPid, key: 'colleague'}),
		activity: getProfiles({state, targetPid, key: 'activity'}),
		profileIsEmpty: getProfileIsEmpty({state, targetPid}),
		error: state.profile.error,
		user: state.user,
		activitiesPool: state.entities.activities,
		layerActivity: state.layerActivity,
	};
}

export default compose(
	connect(selector, { initProfilePage, changeProfilePage, loadListDataCenter }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(MProfile);
