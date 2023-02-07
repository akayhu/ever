import React, { Component } from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { activityLightboxOpen } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activityLog.js';
// components
import { NameCard, ChannelCard } from 'src/client/component_common/card';
import DOMPurify from 'dompurify';
import clientConfig from 'src/configs/client';

const ChoiceTop = ({data, activityLightboxOpen, userId, topicNow }) => {
	const {tagList, extraInfo: {attachmentList}, channelInfo, channelId} = data;
	let coverImg = attachmentList.length > 0 ? attachmentList[0].activityFileUrl : `${clientConfig.params.staticWapUrl}/images/topic/defaultTopicGallery.png`;
	const contentStyle = {maxHeight: tagList.length > 0 ? '100px' : '128px'};
	const isChannelActivity = channelId !== null && typeof (channelId) !== 'undefined' && channelInfo.type === 10;
	const viewActivityLog = { pid: userId, page: 'occupa', filter: topicNow};

	if( !coverImg || coverImg.length <= 0 ) coverImg = `${clientConfig.params.staticWapUrl}/images/topic/defaultTopicGallery.png`;

	return (
		<div styleName="choice_top">
			<div styleName="pic" style={{
				background: `url(${coverImg}) 100% center`,
				backgroundSize: 'cover'
			}}>
			</div>
			<div styleName="activity_block">
				{tagList.length > 0 &&
					<div styleName="tags">
						{tagList.map((tag, index) => (
							<span styleName="tag" key={ index }>{tag}</span>
						))}
					</div>
				}
				<div
					styleName="activity_content"
					onClick={ () => { activityLightboxOpen(data), activityLog(data, viewActivityLog) } }
				>
					<div styleName="activity_title">
						<p styleName="title" className="h1">
							{data.title}
							<i styleName="icon" className="world icon" />
						</p>
					</div>
					<p
						styleName="content"
						dangerouslySetInnerHTML={ {
							__html: DOMPurify.sanitize(data.content, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
						} }
					/>
				</div>
				{
					isChannelActivity
					? renderChannelCard(channelInfo)
					: renderProfileCard(data)
				}
			</div>
		</div>
	);
};

function renderChannelCard(channelInfo) {
	return (
		<div styleName="userMain">
			<div styleName="userImg">
				<ChannelCard
					imgSrc={ channelInfo.avatarWebUrl }
					name={ channelInfo.name }
					id={ channelInfo.id }
				/>
			</div>
			<div styleName="userInfo">
				<a styleName="userName" href={ `/channel/${channelInfo.id}` }>{ channelInfo.name }</a>
			</div>
		</div>
	);
}

function renderProfileCard(data) {

	const company = data.userInfo.userCompany || '';
	const JobTitle = data.userInfo.userJobTitle || '';

	return (
		<div styleName="userMain">
			<div styleName="userImg">
				<NameCard
					targetPid={ data.userInfo.pid }
					href={ `/profile/${data.userInfo.pid}` }
					imgSrc={ data.userInfo.userFileUrl }
					name={ data.userInfo.userName }
				/>
			</div>
			<div styleName="userInfo">
				<a styleName="userName" href={ `/profile/${data.userInfo.pid}` }>{ data.userInfo.userName }</a>
				<p>{company + ' ' + JobTitle}</p>
			</div>
		</div>
	);
}

export default compose(
	connect(null, {activityLightboxOpen}),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ChoiceTop);
