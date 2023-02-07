import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { getMyFollowLimit } from 'src/client/actions/connection';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import SocialSubtitle from 'src/client/component_profile/title/socialSubtitle';
import { NameCard } from 'src/client/component_common/card';
import compose from 'src/util/compose';

// 關注
class Attention extends React.Component {
	constructor() {
		super();
		this.state = {
			lightbox: false,
			attentionDataList: [],
			attentionDataListItem: []
		};
		this.lightboxTrigger = this.handleLightbox.bind(this);
	}
	componentDidMount() {
		const params = {
			pid: this.props.user.pid,
			targetPid: this.props.params.pid,
			direction: 1,
			limit: 10,
			offset: 0,
		};
		this.props.getMyFollowLimit(params);
	}
	handleLightbox() {
		if (this.props.attention.length !== 0) {
			this.setState({ lightbox: (this.state.lightbox === false) });
		}
	}
	render() {
		const { attention } = this.props;
		if (attention && attention.length === 0) return false;
		return (
			// <div>
			// 	{
			// 		this.props.attention.length !== 0 &&
			<div>
				<SocialComponentTitle
					maintitle="我的關注"
					privacySettingSwitch={ this.props.viewas === 'self' }
					privacyText="subscribe" privacy={ this.props.privacy }
					gtmTitleName={ this.props.gtmTitleName }
				>
					<SocialSubtitle
						link={ `/profile/${this.props.params.pid}/connection?mode=following` }
						gtm="關注 - 總數"
						count={ this.props.attention.length }
						unit="位"
					/>
				</SocialComponentTitle>
				<div styleName="attention_main">
					{
						this.props.attention &&
						!this.props.attention.hasOwnProperty('warning') &&
						!this.props.attention.hasOwnProperty('errorCode') &&
						this.props.attention.slice(0, 5).map((item, index) => {
							const url = `/profile/${item.pid}`;
							return (
								<figure styleName="namecard_box" data-index={ index } key={ `${item.pid}_${index}` }>
									<NameCard
										filter={ this.props.params.pid }
										targetPid={ item.pid }
										key={ `${item.pid}_${index}` }
										href={ url }
										imgSrc={ item.avatarWebUrl }
										name={ item.name }
										gtm={ { 'data-gtm-profile-social': '關注 - avatar' } }
									/>
								</figure>
							);
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
	connect(null, { getMyFollowLimit }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Attention);
