import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { loadDataByCategory } from 'src/client/actions/connection';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import SocialSubtitle from 'src/client/component_profile/title/socialSubtitle';
import { NameCard } from 'src/client/component_common/card';
import compose from 'src/util/compose';

// 朋友
class Friend extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		const params = {
			targetPid: this.props.params.pid,
			limit: 5,
			offset: 0,
		};
		this.props.loadDataByCategory('friend', params);
	}
	render() {
		const { total } = this.props.friend;
		if (total === 0) return false;
		return (
			<div>
				<SocialComponentTitle
					maintitle="我的朋友"
					privacySettingSwitch={ this.props.viewas === 'self' }
					privacyText="mutualFriend"
					privacy={ this.props.privacy }
					advancenSetting
					gtmTitleName={ this.props.gtmTitleName }
				>
					<SocialSubtitle link={ `/profile/${this.props.params.pid}/connection` } gtm="朋友 - 總數" count={ this.props.friend.total } unit="位" />
				</SocialComponentTitle>
				<div styleName="friend_main">
					{
						this.props.friend &&
						this.props.friend.dataList.map((item, key) => {
							const link = `/profile/${item.pid}`;
							if (key < 5) {
								return (
									<NameCard
										filter={ this.props.params.pid }
										targetPid={ item.pid }
										key={ item.pid }
										href={ link }
										imgSrc={ item.avatarWebUrl }
										name={ item.userName }
										company={ item.company }
										title={ item.title }
										gtm={ { 'data-gtm-profile-social': '朋友 - avatar' } }
									/>
								);
							}
						})
					}
				</div>
			</div>
		);
	}
}

export default compose(
	connect(null, { loadDataByCategory }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Friend);
