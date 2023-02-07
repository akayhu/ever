import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { browserHistory } from 'react-router';

// components
import Image from 'src/client/component_common/image';
import {SubscribeBtn} from 'src/client/component_channel/buttons';
import JoinGroupBtn from 'src/client/component_common/joinGroupBtn';

const ListBlock = ({
	id,
	domain,
	itemImg,
	itemTit,
	itemView,
	itemContent,
	subscribeInfo,
	// setDirectPanel,
	checkLogin
}) => {
	const checkLoginCallback = () => {
		browserHistory.push(`/${domain}/${id}`);
	};
	const handleClick = () => {
		checkLogin(checkLoginCallback);
	};

	return (
		<li styleName="listItem">
			<div onClick={ handleClick }>
				<div styleName="item_img">
					<Image
						type="cover"
						domain={ domain }
						src={ itemImg }
					/>
				</div>
				<div styleName="listContent">
					<h3>{itemTit}</h3>
					<span>{itemView}</span>
					<p>{itemContent}</p>
				</div>
			</div>
			<div styleName="listBtn">
				{domain === 'channel'
					? <SubscribeBtn { ...subscribeInfo } />
					:	<JoinGroupBtn
						buttonStyle="line"
						{ ...subscribeInfo }
					/>
				}
			</div>
		</li>
	);
};

export default compose(
	connect(null),
	[CSSModules, '_', css]
)(ListBlock);
