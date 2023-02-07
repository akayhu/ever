import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { LightBox } from 'c_wap_module';
import gtmDataLayer from 'src/util/gtmDataLayer';
import parseStrToElements from 'src/util/parseStrToElements';
// components
import Header from 'src/client/component_activities/activity/header';
import Title from 'src/client/component_activities/activity/title';
import Browse from 'src/client/component_activities/activity/browse';
import Tag from 'src/client/component_activities/activity/tag';
import Endorse from 'src/client/component_activities/activity/endorse';
import Behavior from 'src/client/component_activities/activity/behavior';
import Comment from 'src/client/component_activities/activity/comment/comment';
import Relative from 'src/client/component_activities/activity/relative';
import $ from 'jquery';
// actions
// import { getMoreComment, getRelativeActivity } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activityLog.js';
import { viewActivity } from 'src/client/actions/activity';

/**
 * 未登入會出現
 */
class ActivitySinglePageComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hintMsgLightbox: false
		};
	}
	componentDidMount() {
		const itemData = this.props.itemData;
		const viewActivityLog = { page: 'activity' };

		this.props.viewActivity(this.props.itemData);
		activityLog(itemData, viewActivityLog);

		// 傳送開啟的文章到 GTM DataLayer
		gtmDataLayer.sendToDataLayer('Activity', itemData);
	}
	alertHint() {
		this.setState({
			hintMsgLightbox: !this.state.hintMsgLightbox
		});
	}
	redirect() {
		const url = `/sso/saml-login?r=/activity/${this.props.itemData.aid}`;
		location.href = url;
	}
	scrollToTarget(target) {
		const element = ReactDOM.findDOMNode(this.comment);
		var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
		$body.animate({
			scrollTop: $(element).offset().top
		}, 500);
	}
	render() {
		const lightboxOption = { closeIcon: false };
		const { itemData, index } = this.props;
		const isChannel = itemData.channelInfo && itemData.channelInfo.type === 10;
		return (
			<div styleName="activity_single_page_unlogin" className="clearfix">
				<div styleName="main">
					<Header itemData={ itemData } user={ this.props.user } />
					<article>
						<Title itemData={ itemData } user={ this.props.user } />
						<Browse itemData={ itemData } user={ this.props.user } showHint={ this.alertHint.bind(this) } scrollToTarget={ this.scrollToTarget.bind(this) } />
						<div styleName="activity_content">
							<div className="list" styleName="content_main">
								{ parseStrToElements(this.props.itemData.content) }
							</div>
						</div>
						<Tag itemData={ itemData } user={ this.props.user } />
					</article>
					{
						!isChannel &&
						<Endorse itemData={ itemData } user={ this.props.user } showHint={ this.alertHint.bind(this) } />
					}
					<Behavior itemData={ this.props.itemData } user={ this.props.user } index={ this.props.index } showHint={ this.alertHint.bind(this) } />
					<Comment itemData={ itemData } user={ this.props.user } index={ index } showHint={ this.alertHint.bind(this) } ref={(_ref)=>this.comment=_ref} />
					<Relative itemData={ itemData } user={ this.props.user } type="singlepage" />
				</div>
				<div styleName="ad">
					{ this.props.children }
				</div>
				{
					this.state.hintMsgLightbox &&
					<LightBox option={ lightboxOption } onClose={ this.alertHint.bind(this) } >
						<h3>此為會員功能，請先登入</h3>
						<button className="ui primary button" data-gtm-common="Dialog - 我要登入" onClick={ this.redirect.bind(this) }>我要登入</button>
						<button onClick={ this.alertHint.bind(this) } data-gtm-common="Dialog - 稍後再說">稍後再說</button>
					</LightBox>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		user: state.user,
		activity: state.activity,
	};
}
// const ActivitySinglePageComponentCss = CSSModules(ActivitySinglePageComponent, style, { allowMultiple: true });
// const ActivitySinglePageComponentTranslate = translate([])(ActivitySinglePageComponentCss);
//
// export default connect(mapStateToProps, { getMoreComment, getRelativeActivity })(ActivitySinglePageComponentTranslate);

export default compose(
	connect(mapStateToProps, { viewActivity }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ActivitySinglePageComponent);
