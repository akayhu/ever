import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import ReactHtmlParser from 'react-html-parser';
import css from './index.css';
import moment from 'moment';
// components
import ChannelItem from 'src/client/components/channelItem';
import PeopleItem from 'src/client/components/peopleItem';
import CoolBtn from 'src/client/components/button/coolBtn';
// actions
import { fetchCommentList } from 'src/client/actions/activity';
import Attachment from './attachment';

class CommentItem extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.getComment(5);
	}
	getComment(limit) {
		const { aid, fetchCommentList } = this.props;
		fetchCommentList(aid, limit);
	}
	render() {
		const { aid, activitiesPool } = this.props;
		if (activitiesPool[aid].commentList.length === 0) return null;
		return (
			<div styleName="comment">
				{
					activitiesPool[aid].commentCount > activitiesPool[aid].commentList.length &&
					<div styleName="see_more" onClick={ this.getComment.bind(this, 5) }>看更多的留言</div>
				}
				<div>
					{
						activitiesPool[aid].commentList.map((commentAid) => {
							const itemData = activitiesPool[commentAid];
							// const itemParentData = itemData.aidParent ? activitiesPool[itemData.aidParent] : {};
							
							// itemData.channelId = itemParentData.channelId;
							// itemData.channelInfo = itemParentData.channelInfo
							
							const userObj = {
								pid: itemData.userInfo.pid,
								userName: itemData.userInfo.userName,
								avatarWebUrl: itemData.userInfo.userFileUrl,
								companyName: itemData.userInfo.userCompany,
								jobTitle: itemData.userInfo.userJobTitle,
							}
							
							// console.log(itemData);
							
							return (
								<div
									key={ commentAid }
									styleName="comment_item"
								>
									<div styleName="people_item">
										{
											itemData.channelInfo && itemData.channelId && itemData.channelInfo.type === 10// && itemData.pid === itemData.channelInfo.pid
											 ? <ChannelItem
													channelInfo={ itemData.channelInfo }
												/>
											 : <PeopleItem
													userObj={ userObj }
												/>
										}
										<span styleName="time">{ moment(itemData.createDate, 'x').format('YYYY-MM-DD') }</span>
									</div>
									<div styleName="main">
										{ReactHtmlParser(itemData.content)}
										{
											itemData.representativeFile !== null && !itemData.extra.hasOwnProperty('accuseStatus') && 
											<Attachment attachment={ itemData.representativeFile } />
										}
										<CoolBtn
											likeIt={ itemData.likeIt }
											aidParent={ aid }
											aid={ itemData.aid }
											mode="comment"
										/>
										{
											itemData.likeCount > 0 &&
											<span
												styleName="likeCount"
												style={ itemData.likeIt ? { color: '#0192B5' } : null }
											>{ itemData.likeCount }
											</span>
										}
									</div>
								</div>
							);
						})
					}
				</div>
			</div>
		);
	}
}

function selector(state) {
	return {
		activitiesPool: state.entities.activities,
	};
}

export default compose(
	connect(selector, { fetchCommentList }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(CommentItem);
