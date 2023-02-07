import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import JoinGroupBtn from 'src/client/component_common/joinGroupBtn';
import Image from 'src/client/component_common/image';
import { Link } from 'react-router';

// components

const CardBody = ({
	id,
	isHead,
	isMember,
	isApplying,
	joinSetting,
	name,
	memberCount,
	activityCount,
	noticeStatus,
	type,
	memberInfo: [head],
	coverWebUrl,
	category
}) =>
	<div styleName="card_wrap">
		<div styleName="pic_wrap">
			<div styleName="group_info_top">
				<div styleName="group_name">
					<Link
						href={ `/group/${id}` }
						data-gtm-bzcard="顯示名稱"
					>{ name }</Link>
				</div>
				<div styleName="group_privacy">{type === 8 ? '公開社團' : '私人社團'}</div>
				<div styleName="group_head">團長:{head.userName}</div>
			</div>
			<Image
				type={ 'cover' }
				domain={ 'group' }
				src={ coverWebUrl }
			/>
		</div>
		<div styleName="group_info_bot">
			<div styleName="group_members">{ memberCount || 0 }名成員</div>
			<div styleName="group_activities">{ activityCount || 0 }篇文章</div>
			<div styleName="setting">
				<JoinGroupBtn
					buttonStyle="primary"
					channelId={ id }
					category={ category }
					isHead={ isHead }
					isMember={ isMember }
					isApplying={ isApplying }
					joinSetting={ joinSetting || 0 }
					noticeStatus={ noticeStatus }
				/>
			</div>
		</div>
	</div>;

export default CSSModules(CardBody, css);
