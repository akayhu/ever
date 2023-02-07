import { connect } from 'react-redux';
import React from 'react';
// import { Link } from 'react-router';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import SocialSubtitle from 'src/client/component_profile/title/socialSubtitle';
import { getPersonalWall, activityLightboxOpen } from 'src/client/actions/activity';
import clientConfig from 'src/configs/client';
import compose from 'src/util/compose';

class CollectArticle extends React.Component {
	constructor() {
		super();
		this.state = {
			collectCount: 0,
		};
	}
	componentDidMount() {
		window.elogPage = "myCollect";
		this.props.getPersonalWall('MYCOLLECT', {targetPid: this.props.params.pid});
	}
	lightboxOpen(itemData) {
		this.props.activityLightboxOpen(itemData);
	}
	render() {
		if(!this.props.activity.personalStream.MYCOLLECT[this.props.params.pid]){
			return null;
		}
		
		const activityPool = this.props.activity.activityPool;
		const myCollectWall = this.props.activity.personalStream.MYCOLLECT[this.props.params.pid];
		const count = myCollectWall.total;
		
		return (
			<div>
				{
					myCollectWall.dataList.length !== 0 &&
					<div>
						<SocialComponentTitle	maintitle="收藏的文章" privacySettingSwitch={ this.props.viewas === 'self' }	privacyText="collectActivity" privacy={ this.props.privacy } gtmTitleName={ this.props.gtmTitleName }>
							<SocialSubtitle link={ `/profile/${this.props.params.pid}/activity?mode=collect` } gtm="收藏文章 - 總數" count={ count } unit="篇" />
						</SocialComponentTitle>
						<div className="h4" styleName="collect_article_main">
							<ul styleName="collectUl">
								{
									myCollectWall.dataList.slice(0, 5).map((aid, index) => {
										if (activityPool.hasOwnProperty(aid)) {
											const itemData = activityPool[aid];
											
											return (
												<li key={ aid } styleName="collectLi">
													<a onClick={ this.lightboxOpen.bind(this, itemData) } href="javascript:;" className="artcle_link" data-gtm-profile-social="收藏文章 - 開啟">{ itemData.title }</a>
												</li>
											);
										}
									})
								}
							</ul>
						</div>
					</div>
				}
			</div>
		);
	}
}

export default compose(
	connect(null, { getPersonalWall, activityLightboxOpen }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(CollectArticle);
