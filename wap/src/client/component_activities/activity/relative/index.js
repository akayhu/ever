import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { activityLightboxOpen, getRelativeActivity } from 'src/client/actions/activity';
import RelativeItem from 'src/client/component_activities/activity/relative/relativeItem';
import compose from 'src/util/compose';
import { getActivitiesByAids } from 'src/client/reducers/activity/selectors';
import { activityLog } from 'src/client/actions/activity/activityLog.js';

class Relative extends React.Component {
	constructor(props) {
		super(props);
		this.itemClick = this.itemClick.bind(this);
	}
	componentDidMount() {
		this.props.getRelativeActivity(this.props.itemData);
		window.elogPage = 'pushA';
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.itemData.aid !== nextProps.itemData.aid) {
			this.props.getRelativeActivity(nextProps.itemData);
		}
	}
	itemClick(itemData) {
		const userPid = this.props.user.pid;
		const viewActivityLog = { pid: userPid === -3 ? '' : userPid, page: 'pushA' };
		if (this.props.type === 'lightbox') {
			this.props.activityLightboxOpen(itemData);
			activityLog(itemData, viewActivityLog);
		}
		if (this.props.type === 'singlepage') {
			location.href = `/activity/${itemData.aid}`;
			activityLog(itemData, viewActivityLog);
		}
	}
	render() {
		const { itemData, relativeActivity } = this.props;
		return (
			<div>
				{
					itemData.hasOwnProperty('relativeList') && itemData.relativeList.length > 0 &&
					<div styleName="relative_block">
						<h2 styleName="title">你可能有興趣的文章：</h2>
						{
							relativeActivity.map((item) => {
								const { channelId, channelInfo } = item;
								const isChannel = channelId !== null && typeof (channelId) !== 'undefined' && channelInfo.type === 10;
								return (
									<RelativeItem
										key={ item.aid }
										title={ item.title }
										name={ isChannel ? channelInfo.name : item.userInfo.userName }
										itemClick={ () => this.itemClick(item) }
									/>
								);
							})
						}
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		relativeActivity: getActivitiesByAids(state.activity, props.itemData.relativeList || [])
	};
}

export default compose(
	connect(mapStateToProps, {
		activityLightboxOpen,
		getRelativeActivity
	}),
	[CSSModules, '_', css]
)(Relative);
