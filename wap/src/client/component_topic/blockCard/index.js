import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { browserHistory } from 'react-router';

// components
import More from 'src/client/component_topic/more';
import Image from 'src/client/component_common/image';
import {NameCard} from 'src/client/component_common/card';
import {SubscribeBtn} from 'src/client/component_channel/buttons';
import JoinGroupBtn from 'src/client/component_common/joinGroupBtn';

const BlockCard = ({
	id,
	domain,
	blockBg,
	blockMaster,
	// blockMasterName,
	blockTit,
	// subscriberList,
	blockMemberInfo,
	blockView,
	btnPropInfo,
	activityList = [],
	setDirectPanel,
	checkLogin
}) => {
	const domainName = domain === 'channel' ? '頻道' : '社團';

	const checkLoginCallback = () => {
		browserHistory.push(`/${domain}/${id}`);
	};

	const handleClick = () => {
		checkLogin(checkLoginCallback);
	};

	return (
		<div styleName="topMain">
			<div styleName="blockCard">
				<div styleName="index_img" onClick={ handleClick } >
					<div styleName="bg" />
					<Image
						type="cover"
						domain={ domain }
						src={ blockBg }
					/>
					{	renderBlockMaster(blockMemberInfo, domain, blockTit, blockMaster) }
				</div>
				{ renderMemberList(blockMemberInfo, blockView, domainName, domain, btnPropInfo) }
			</div>

			<div styleName="activityBlock">
				<ul>
					{activityList && activityList.slice(0, 5).map((item, index) =>
						<li key={ index } styleName="listItem">
							<i styleName="icon" className="radio icon" />
							<a
								href={ `/activity/${item.aid}` }
								target={ '_blank' }
							>
								{ item.title }
							</a>
						</li>
					)}
				</ul>
				{ activityList && activityList.length > 5 &&
					<More text="看更多" linkUrl={ `/${domain}/${btnPropInfo.channelId}` } />
				}
			</div>
		</div>
	);
};

const renderBlockMaster = (blockMemberInfo, domain, blockTit, blockMaster) => {
	const masterInfo = {
		userName: '',
		avatarWebUrl: ''
	};

	if (blockMemberInfo) {
		masterInfo.userName = blockMemberInfo[0].userName;
		masterInfo.avatarWebUrl = blockMemberInfo[0].avatarWebUrl;
	}

	return (
		<div styleName={ `index_master ${!masterInfo.userName ? 'title' : 'name'}` }>
			<Image
				type="avatar"
				domain={ domain === 'channel' ? domain : 'profile' }
				src={ blockMaster }
			/>
			<div styleName="master_title">
				{blockTit}
			</div>
			<div styleName="master_name">
				{/*團長 / {masterInfo.userName}*/}
			</div>
		</div>
	);
};

const renderMemberList = (blockMemberInfo, blockView, domainName, domain, btnPropInfo) => {
	if (!blockMemberInfo) return null;

	const subscriberList = blockMemberInfo;

	btnPropInfo.subscribeSetting = btnPropInfo.subscribe;

	return (
		<div styleName="index_introduction_main">
			<div styleName="index_people">
				<ul>
					<li styleName="name_card_image">
						<ul>
							{subscriberList.slice(0, 3).map((item, index) => (
								<li key={ index }>
									<NameCard
										targetPid={ item.pid }
										href={ `profile/${item.pid}` }
										imgSrc={ item.avatarWebUrl }
										name={ item.userName }
										textMode={ false }
									/>
								</li>
							))}
						</ul>
					</li>
					<li styleName="number"> &nbsp;已有 {blockView} 人已加入{domainName}</li>
					<li styleName="button">
						{domain === 'channel'
							? <SubscribeBtn { ...btnPropInfo } />
							: <JoinGroupBtn
								simple
								buttonStyle="line"
								{ ...btnPropInfo }
							/>
						}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default compose(
	connect(null),
	[CSSModules, '_', css, {allowMultiple: true}]
)(BlockCard);
