import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import compose from 'src/util/compose';
import css from './index.css';

import Image from 'src/client/component_common/image';
import Indepent from 'src/client/component_channel/buttons/indepent';

const CardBody = ({
	id,
	coverWebUrl,
	avatarWebUrl,
	name,
	subscribeCount,
	subscribe,
	isAdmin,
	isEditor
}) =>
	<div styleName="card_wrap">
		<div styleName="top">
			<div styleName="cover">
				<Image
					type={ 'cover' }
					src={ coverWebUrl }
					domain="channel"
				/>
			</div>
			{/*<div styleName="avatar">
				<Image
					type={ 'avatar' }
					domain={ 'channel' }
					src={ avatarWebUrl }
				/>
			</div>*/}
			<div styleName="info">
				<Link
						href={ `/group/${id}` }
						data-gtm-bzcard="顯示名稱"
					>{ name }</Link>
			</div>
		</div>

		<div styleName="bot">
			<div styleName="sub_count">{ subscribeCount }人已加入此頻道</div>
			<div styleName="sub_button">
				<Indepent
					isEditor={ isEditor }
					isAdmin={ isAdmin }
					channelId={ id }
					subscribeSetting={ subscribe }
				/>
			</div>
		</div>
	</div>;

export default compose(
	//connect(mapStateToProps),
	//translate([]),
	[CSSModules, '_', css]
)(CardBody);
