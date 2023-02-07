import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { activityLightboxOpen } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activityLog.js';

// components
import { NameCard, ChannelCard } from 'src/client/component_common/card';
import clientConfig from 'src/configs/client';
import DOMPurify from 'dompurify';

function handleError(e) {
	e.target.classList.add('hide');
}

const ChoiceList = ({listData, activityLightboxOpen, userId, topicNow}) =>
	<ul styleName="choiceList">
		{listData.map((obj, index) => {
			const {extraInfo: {attachmentList}, channelInfo, channelId} = obj;
			let coverImg = attachmentList.length > 0 ? attachmentList[0].activityFileUrl : `${clientConfig.params.staticWapUrl}/images/topic/defaultTopicGallery.png`;
			const isChannelActivity = channelId !== null && typeof (channelId) !== 'undefined' && channelInfo.type === 10;
			const viewActivityLog = { pid: userId, page: 'occupa', filter: topicNow};

			if( !coverImg || coverImg.length <= 0 ) coverImg = `${clientConfig.params.staticWapUrl}/images/topic/defaultTopicGallery.png`;
			return (
				<li
					key={ index }
					styleName="activityBlock"
					onClick={ (e) => {
						activityLightboxOpen(obj), activityLog(obj, viewActivityLog)
						// 讓點擊頭像時 不會繼續跳轉頁面至profile頁
						e.preventDefault();
						}
					}
				>
					<div styleName="bgImg">
						<img src={ coverImg } onError={ handleError.bind(this) } />
					</div>
					<div styleName="userImg">
						{
							isChannelActivity
								?
									<ChannelCard
										imgSrc={ channelInfo.avatarWebUrl }
										name={ channelInfo.name }
										id={ channelInfo.id }
										avatarSize={ 75 }
									/>
								:
									<NameCard
										targetPid={ obj.userInfo.pid }
										href={ `/profile/${obj.userInfo.pid}` }
										imgSrc={ obj.userInfo.userFileUrl }
										name={ obj.userInfo.userName }
										avatarSize={ 75 }
									/>
						}
					</div>
					<div styleName="mainInfo">
						<p styleName="title" className="h3">{ obj.title }</p>
						<p
							styleName="content"
							dangerouslySetInnerHTML={ {
								__html: DOMPurify.sanitize(obj.content, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
							} } 
						/>

						{/* <div styleName="layer" /> */}
					</div>
				</li>
			);
		})}
	</ul>;


ChoiceList.propTypes = {
	listData: PropTypes.array.isRequired
};

export default compose(
	connect(null, {activityLightboxOpen}),
	[CSSModules, '_', css]
)(ChoiceList);
