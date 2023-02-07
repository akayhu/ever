import { connect } from 'react-redux';
import React, { Component } from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { loadDataByCategory } from 'src/client/actions/connection';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import SocialSubtitle from 'src/client/component_profile/title/socialSubtitle';
import { NameCard } from 'src/client/component_common/card';
import compose from 'src/util/compose';

// 朋友
class MutualFriends extends Component {
	constructor() {
		super();
		this.state = {};
	}
	componentDidMount() {
		const targetPid = this.props.params.pid;
		this.props.loadDataByCategory('mutualFriends', {targetPid});
	}
	render() {
		const friend = this.props.connection.mutualFriends[this.props.params.pid];
		if (!friend || friend.total === 0) return false;
		return (
			// <div>
			// 	{
			// 		(friend && friend.total !== 0 ) &&
			<div>
				<SocialComponentTitle	maintitle="共同朋友">
					<SocialSubtitle link={ `/profile/${this.props.params.pid}/connection` } gtm="共同朋友 - 總數" count={ friend.total } unit="位" />
				</SocialComponentTitle>
				<div styleName="friend_main">
					{
						friend.dataList.map((item, key) => {
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
									/>
								);
							}
						})
					}
				</div>
			</div>
			// 	}
			// </div>
		);
	}
}

export default compose(
	connect(null, { loadDataByCategory }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MutualFriends);
