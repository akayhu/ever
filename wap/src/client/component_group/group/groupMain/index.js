import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import SearchActivity from 'src/client/component_search/searchlist/activity';
// actions
import { inviteFriend, loadDataByCategory } from 'src/client/actions/group';
import { getPersonalWall } from 'src/client/actions/activity';
// selectors
import { getDataList, getChannelId, getGroupInfoData, getGroupActivitySearchKey } from 'src/client/reducers/group/selectors';
import { getActivitiesByType, getLightBoxActivity } from 'src/client/reducers/selectors';
// components
import ADAppBanner from 'src/client/component_common/ad/adAppBanner';
import PostActivity from 'src/client/component_common/postActivity';
import ActivityRiver from 'src/client/component_common/activityRiver';
import Stream from 'src/client/component_activities/module/Stream';
import { NameCard } from 'src/client/component_common/card';
import JoinGroupBtn from 'src/client/component_common/joinGroupBtn';
import AutoCompleteFriendToWhere from 'src/client/component_common/autoCompleteFriendToWhere';
import License from 'src/client/component_common/license';


class GroupMain extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		// this.setElogPage(this.props.groupInfo.type);
	}
	// setElogPage(type) {
	// 	if( parseInt(type) === 8 ) window.elogPage = 'publicGroup';
	// 	else if ( parseInt(type) === 7 ) window.elogPage = 'privateGroup';
	// }
	loadData() {
		return this.props.getPersonalWall('GROUP', {channelId: this.props.params.gid});
	}
	addFriendToGroup(friend) {
		return this.props.inviteFriend({
			targetPid: friend.data.id,
			channelId: this.props.params.gid
		});
	}
	renderGroupMemberBlock() {
		const { groupInfo, adminList, user } = this.props;

		if (!groupInfo.hasOwnProperty('memberInfo')) {
			return null;
		}

		const { type, isMember } = groupInfo;
		const groupHead = groupInfo.memberInfo[0];

		if (!isMember && type === 7) {
			return null;
		}

		return (
			<div styleName="group_member">
				{
					groupHead.pid &&
					<div styleName="group_member_top">
						<span className="h2">團長</span>
						<div styleName="group_member_top_img">
							<div styleName="group_namecard_img">
								<NameCard
									page="groupMember"
									targetPid={ groupHead.pid }
									href={ `/profile/${groupHead.pid}` }
									imgSrc={ groupHead.avatarWebUrl }
									name={ groupHead.userName }
								/>
							</div>
							<span styleName="group_namecard_name"><a href={ `/profile/${groupHead.pid}` }>{ groupHead.userName }</a></span>
						</div>
					</div>
				}
				<div styleName="group_member_main">
					<span className="h2">社團管理員</span>
					<div styleName="group_member_main_img">
						{
							adminList.filter(admin => !admin.isHead).map((admin, index) => (
								<NameCard
									page="groupMember"
									key={ index }
									targetPid={ admin.pid }
									href={ `/profile/${admin.pid}` }
									imgSrc={ admin.avatarWebUrl }
									name={ admin.userName }
								/>
							))
						}
					</div>
				</div>
				{ isMember && this.props.user.isLogin === true &&
					<div styleName="group_member_buttom">
						<span className="h2">新增成員</span>
						<div>
							<AutoCompleteFriendToWhere onChoise={ this.addFriendToGroup.bind(this) } />
						</div>
					</div>
				}
			</div>
		);
	}

	renderActivityBlock() {
		const { groupInfo, lbActivity, user, channelId, keyword } = this.props;
		const { id, type, isMember, isApplying, joinSetting, isHead, isAdmin, noticeStatus } = groupInfo;
		if (!isMember && type === 7) {
			return (
				<div styleName="forbidden">
					<span>文章僅供社團成員瀏覽</span>
					<JoinGroupBtn
						buttonStyle="primary"
						channelId={ this.props.params.gid }
						isHead={ isHead }
						isMember={ isMember }
						isApplying={ isApplying }
						joinSetting={ joinSetting || 0 }
						noticeStatus={ noticeStatus }
					/>
				</div>
			);
		}

		if (type === 7) var mode = 'private';
		else if (type === 8) var mode = 'public';

		return (
			<div styleName="group_personal_info_main">
				{/* {
					isMember &&
					<PostActivity
						channelId={ this.props.params.gid }
						channelInfo={ this.props.groupInfo }
						placeholder={ '發表文章' }
					/>
				} */}
				<div styleName="group_article_list">
					{
						!keyword && !(type === 7 && !isMember) &&
						<ActivityRiver
							category="GROUP"
							channelId={ this.props.params.gid }
							loadData={ this.loadData.bind(this) }
							isAdmin={ isAdmin }
							isHead={ isHead }
							pageName='group'
							filterName={ this.props.params.gid }
						/>
					}
					{
						keyword &&
						<SearchActivity
							mode={ mode }
							channelId={ this.props.params.gid }
							keyword={ this.props.keyword }
							pid={ this.props.user.pid }
						/>
					}
				</div>
			</div>
		);
	}

	render() {
		const { groupInfo } = this.props;
		return (
			<div styleName="group_personal_main">
				<div styleName="group_social_main">
					<div styleName="group_introduction">
						<span className="h2">社團簡介</span>
						<div styleName="group_introduction_content">{ groupInfo.description }</div>
						<div styleName="group_introduction_types">
							<dl>
								<dd>
									社團類型：{ groupInfo.categoryName }
								</dd>
								<dd>
									<div styleName="group_tag">社團標籤：</div>
									<div styleName="group_tag_content">
										{
											groupInfo.tags && groupInfo.tags.filter(tag => tag).map((tag, index) => (
												<span>
													<a href={ `/search/group/${tag}` } key={ index }>{ tag }</a>
													{ index < groupInfo.tags.length - 1 && '、' }
												</span>
											))
										}
									</div>
								</dd>
							</dl>
						</div>
					</div>
					{this.renderGroupMemberBlock()}
					<div styleName="group_content">
						{/* <ADAppBanner /> */}
						<License />
					</div>
				</div>
				{this.renderActivityBlock()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const nowState = state.group;

	return {
		user: state.user,
		groupInfo: getGroupInfoData(nowState),
		channelId: getChannelId(nowState),
		adminList: getDataList(nowState, 'groupAdmins'),
		lbActivity: getLightBoxActivity(state),
		keyword: getGroupActivitySearchKey(nowState)
	};
}

export default compose(
	connect(mapStateToProps, {inviteFriend, loadDataByCategory, getPersonalWall}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(GroupMain);
