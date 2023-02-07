import React, { Component } from 'react';
import { connect } from 'react-redux';
//import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
//import css from './index.css';
import Headline from 'src/client/component_topic/title/headline';
import Choice from 'src/client/component_topic/choice';
import RecommendPerson from 'src/client/component_topic/recommendPerson';
import Carousel from 'src/client/component_topic/carousel';
import Achievements from 'src/client/component_topic/achievements';
import Group from 'src/client/component_topic/group';
import Channel from 'src/client/component_topic/channel';
import Devlop from 'src/client/component_topic/devlop';
// selecrots
import { getFunc } from 'src/client/reducers/topic/selectors';
import { getLightBoxActivity } from 'src/client/reducers/activity/selectors';
// actions
import { initTopicPage } from 'src/client/actions/topic';
import { setDirectPanel } from 'src/client/actions/alert';
// components
import ActivityLightbox from 'src/client/component_activities/module/Lightbox';
import TopicMenu from 'src/client/component_topic/topicMenu';
import { components as CPlatformComponents } from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class Topic extends Component {
	constructor(props) {
		super(props);
		this.directToLogin = this.directToLogin.bind(this);
	}
	directToLogin() {
		this.props.setDirectPanel(true);
		return false;
	}
	componentDidMount() {
		const { topic } = this.props.params;
		this.props.initTopicPage(topic);
		this.scrollToAnchor();
	}
	componentWillReceiveProps(nextProps) {
		const oldProps = this.props;
		const { params: { topic }, topicNow } = oldProps;

		if (topic !== nextProps.params.topic) {
			// 這我不知道是給什麼情境用的誒QQ
			this.props.initTopicPage(nextProps.params.topic)
				.then(() => window.scrollTo(0, 0));
		} else if (topicNow && topicNow !== nextProps.topicNow) {
			// 切換func
			// 多加 topicNow && 去判斷是為了當第一次進入topic會重複打兩次 didmount和這邊
			this.props.initTopicPage(nextProps.topicNow)
				.then(() => window.scrollTo(0, 0));
		}
	}
	scrollToAnchor() {
		let anchorName = this.props.location.hash;
		if (anchorName) {
			anchorName = anchorName.replace('#', '');
			const anchorElement = document.getElementById(anchorName);
			if (anchorElement) {
				setTimeout(() => { // 約1.5秒，才讀完資料
					anchorElement.scrollIntoView();
				}, 1500);
			}
		}
	}
	render() {
		const { userPid, lbActivity, topicNow } = this.props;
		return (
			<ViewWrapper { ...this.props }>
				<div className="container_wrap">
					<TopicMenu directToLogin={ this.directToLogin } />
					<Choice topicNow={ topicNow } />
					<RecommendPerson />
					<Achievements userPid={ userPid } />
					{ /* <Headline headline="進行中活動" /> */ }
					{ /*
						<Carousel
							width={ 800 }
							data={ this.state.workData }
						/>
					*/ }
					<Group />
					<Channel />
					{ /* <Devlop /> */ }
					{
						lbActivity &&
						<ActivityLightbox
							itemData={ lbActivity }
							index={ 0 }
							author={ lbActivity.editable }
							pageName="occupa"
							filterName={ topicNow }
						/>
					}
				</div>
			</ViewWrapper>
		);
	}
}

const actions = {
	initTopicPage,
	setDirectPanel
};

function mapStateToProps(state) {
	return {
		topicNow: getFunc(state),
		lbActivity: getLightBoxActivity(state.activity),
		userPid: state.user.pid,
	};
}

export default compose(
	connect(mapStateToProps, actions),
	// [CSSModules, '_', css, { allowMultiple: true }]
)(Topic);
