import { connect } from 'react-redux';
import React from 'react';
// import { Link } from 'react-router';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import RecentArticleList from './recentArticleList';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import SocialSubtitle from 'src/client/component_profile/title/socialSubtitle';
import { getPersonalWall } from 'src/client/actions/activity';
import clientConfig from 'src/configs/client';
import compose from 'src/util/compose';

class RecentArticle extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		this.props.getPersonalWall('PERSONALWALL', {targetPid: this.props.params.pid});
	}
	render() {
		if(!this.props.activity.personalStream.PERSONALWALL[this.props.params.pid]){
			return null;
		}
		
		const activityPool = this.props.activity.activityPool;
		const personalWall = this.props.activity.personalStream.PERSONALWALL[this.props.params.pid];
		const count = personalWall.total;
		
		return (
			<div>
				{
					personalWall.dataList.length !== 0 &&
					<div>
						<SocialComponentTitle	maintitle="最新的文章">
							<SocialSubtitle link={ `/profile/${this.props.params.pid}/activity` } gtm="最新文章 - 總數" count={ count } unit="篇" />
						</SocialComponentTitle>
						<div className="body_text" styleName="recent_article_main">
							<ul>
								{
									personalWall.dataList.slice(0, 2).map((aid, index) => {
										if (activityPool.hasOwnProperty(aid)) {
											const itemData = activityPool[aid];
											
											return <RecentArticleList	
												itemData={ itemData }	
												key={ itemData.aid } 
												viewas={ this.props.viewas } 
												user={ this.props.user } 
											/>;
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
	connect(null, { getPersonalWall }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(RecentArticle);
