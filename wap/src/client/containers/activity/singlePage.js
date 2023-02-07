import { connect } from 'react-redux';
import React, { Component } from 'react';
import compose from 'src/util/compose';
import { components as CPlatformComponents } from 'c_platform';
import SinglePageComponent from 'src/client/component_activities/module/SinglePage';
import SinglePageUnlogin from 'src/client/component_activities/module/SinglePageUnlogin';
import AD243pxBanner from 'src/client/component_common/ad/ad243pxBanner';
// import AD300pxBanner from 'src/client/component_common/ad/ad300pxBanner';
// import ADAppBanner from 'src/client/component_common/ad/adAppBanner';
import AccuseActivity from 'src/client/component_common/accuse/activity';
import { getArticle, toggleLightbox } from 'src/client/actions/activity';
import { changeSSRStatus } from 'src/client/actions/ssrStatusCode';
import clientConfig from 'src/configs/client';
// import checkRescrape from 'src/util/fbRescrape';
 
const ViewWrapper = CPlatformComponents.ViewWrapper;

class ActivitySinglePage extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		this.props.getArticle(this.props.params.aid);
	}
	componentDidMount() {
		const aid = this.props.params.aid;
		const currentPath = this.props.location.pathname;
		const activityInfo = this.props.activity.activityPool[aid] || {};
		// 公開文章才檢查 FB 快取
		// if (aid && activityInfo && (activityInfo.privacySetting === 0)) {
		// 	checkRescrape(
		// 		`https://${document.location.hostname}${currentPath}`,
		// 		clientConfig.params.fbEToken,
		// 		clientConfig.params.fbPrvKeyPem,
		// 		1000 * 3600 * 6
		// 	);
		// }
	}
	componentWillReceiveProps(nextProps) {
		const { aid } = this.props.params;
		if (!nextProps.activity.activityPool.hasOwnProperty(aid)) this.props.getArticle(aid);
		if (nextProps.activity.activityPool.hasOwnProperty(aid) && nextProps.activity.activityPool[this.props.params.aid].fail) {
			this.props.router.replace('/error/404');
		}
	}
	render() {
		return (
			<ViewWrapper { ...this.props }>
				<div className="container_wrap">
					{
						this.props.activity.activityPool.hasOwnProperty(this.props.params.aid) &&
						this.props.activity.activityPool[this.props.params.aid].userInfo &&
						this.props.user.pid !== -3 &&
						<SinglePageComponent
							itemData={ this.props.activity.activityPool[this.props.params.aid] }
							author={ this.props.activity.activityPool[this.props.params.aid].editable }
						/>
					}
					{
						this.props.activity.activityPool.hasOwnProperty(this.props.params.aid) &&
						this.props.activity.activityPool[this.props.params.aid].userInfo &&
						this.props.user.pid === -3 &&
						<SinglePageUnlogin
							itemData={ this.props.activity.activityPool[this.props.params.aid] }
							author={ false }
						>
							<AD243pxBanner />
							{/* <AD300pxBanner /> */}
							{ /* <ins className="adsbygoogle"
								style={{display: "inline-block", width: "280px", height: "250px" }}
								data-ad-client="ca-pub-5821762530473338"
								data-ad-slot="1253802201"></ins> */ }
							{/* <ADAppBanner /> */}
						</SinglePageUnlogin>
					}
					<AccuseActivity />
				</div>
			</ViewWrapper>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		activity: state.activity
	};
};

export default compose(
	connect(mapStateToProps, { getArticle, toggleLightbox, changeSSRStatus }),
	// translate([]),
	// [CSSModules, '_', css, { allowMultiple: true }]
)(ActivitySinglePage);
