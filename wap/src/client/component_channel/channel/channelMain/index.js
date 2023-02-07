import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

import PostActivity from 'src/client/component_common/postActivity';
import ActivityRiver from 'src/client/component_common/activityRiver';
import SearchActivity from 'src/client/component_search/searchlist/activity';
// import ActivityStream from 'src/client/component_channel/activity';
import Stream from 'src/client/component_activities/module/Stream';
import License from 'src/client/component_common/license';

import { NameCard } from 'src/client/component_common/card';

import { getPersonalWall } from 'src/client/actions/activity';
import { inviteSubscribeMedia } from 'src/client/actions/channel';
import { getChannelId, getDataList, getChannelInfoData, getDataByKey } from 'src/client/reducers/channel';
import { getActivitiesByType, getLightBoxActivity } from 'src/client/reducers/activity/selectors';
import AutoCompleteFriendToWhere from 'src/client/component_common/autoCompleteFriendToWhere';

class ChannelMain extends Component {
	constructor(props, context) {
		super(props, context);
	}
	loadData() {
		return this.props.getPersonalWall('CHANNEL', {channelId: this.props.params.cid});
	}
	addFriendToChannel(friend) {
		return this.props.inviteSubscribeMedia({
			targetPid: friend.data.id,
			channelId: this.props.params.cid
		})
	}
	renderChannelMemberBlock() {
		const { dataInfo, userPid } = this.props;
		return (
			<div styleName="channel_member">
				<div styleName="channel_member_main">
					<div styleName="channel_member_main_title">
						<div><span className="h3">關注此頻道的人</span></div>
						<div>共<a>{ dataInfo.subscribeCount }</a>人</div>
					</div>
					<div styleName="channel_member_main_img">
						{
							dataInfo.subscriberList && dataInfo.subscriberList.map(subscriber => (
							<NameCard
								page="channelSubscriber"
								key={ `subscriberList${subscriber.pid}` }
								targetPid={ subscriber.pid }
								href={ `/profile/${subscriber.pid}` }
								imgSrc={ subscriber.avatarWebUrl }
								name={ subscriber.userName }
							/>
						))}
					</div>
				</div>
				{
					this.props.user.isLogin === true &&
					<div styleName="channel_member_buttom">
						<span className="h3">新增成員</span>
						<div>
							<AutoCompleteFriendToWhere onChoise={this.addFriendToChannel.bind(this)} />
						</div>
					</div>
				}
			</div>
		);
	}
	renderActivityBlock() {
		const { dataInfo,
						searchKeyword,
						channelId,
						user,
					} = this.props;
		const { isAdmin, isEditor } = dataInfo;

		return (
			<div styleName="channel_personal_info_main">
				{/* {
					(isAdmin || isEditor) &&
					<PostActivity
						channelId={ this.props.params.cid }
						channelInfo={ this.props.dataInfo }
						placeholder={ '發表文章' }
					/>
				} */}
				<div>
					{
						!searchKeyword &&
						<ActivityRiver
							category="CHANNEL"
							channelId={ this.props.params.cid }
							loadData={ this.loadData.bind(this) }
							isAdmin={ isAdmin }
							isEditor={ isEditor }
							pageName='mediaContent'
							filterName={ this.props.params.cid }
						/>
					}
					{
						searchKeyword &&
						<SearchActivity
							mode="public"
							channelId={ this.props.params.cid }
							keyword={ searchKeyword }
							pid={ user.pid }
						/>
					}
				</div>
			</div>
		);
	}
	render() {
		const { dataInfo } = this.props;

		return (
			<div styleName="channel_personal_main">
				<div styleName="channel_social_main">
					<div styleName="channel_introduction">
						<span className="h3">頻道簡介</span>
						<div styleName="channel_introduction_content">
							{ dataInfo.description }
						</div>
					</div>
					{this.renderChannelMemberBlock()}
					{
						/* 關注此頻道的人也關注 為第二包範疇
						<div styleName="channel_list">
							<span className="h3">關注此頻道的人也關注</span>
							<ul>
								{
									Array.apply( 0, Array( 5 ) ).map( function ( x, i ) {
										return (
											<li key={i}>
												<a styleName="list_img" href="#">
													<img src="//topic.cheers.com.tw/issue/2015/the-job-in/home/img/pg_logo.png" />
												</a>
												<div styleName="list_main">
													<div styleName="title" className="h4">Cheers雜誌</div>
													<span styleName="viewer">3345678 關注</span>
													<button className="ui line button">關注</button>
												</div>
											</li>
										);
									})
								}
							</ul>
						</div>
						*/
					}
					<License />
				</div>
				{this.renderActivityBlock()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const nowState = state.channel;
	return {
		user: state.user,
		dataInfo: getChannelInfoData(nowState),
		channelId: getChannelId(nowState),
		searchKeyword: getDataByKey(nowState, 'searchKeyword')
	};
}

export default compose(
	connect(mapStateToProps, { inviteSubscribeMedia, getPersonalWall }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ChannelMain);
