import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'src/util/compose';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import css from './index.css';
// actions
import { layerActivityOpen } from 'src/client/actions/activity';
import { fetchRelatedList } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activity_log.js';
class RelatedList extends Component {
	constructor(props) {
		super(props);
		this.getRelatedList = this.getRelatedList.bind(this);
	}
	componentDidMount() {
		this.getRelatedList();
	}
	getRelatedList() {
		const { aid, fetchRelatedList } = this.props;
		fetchRelatedList(aid);
	}
	handleShowActivity(itemData, viewActivityLog) {
		// console.log(this.props.isLayer);
		activityLog(itemData, viewActivityLog);
		this.props.layerActivityOpen({
			aid: itemData.aid,
			from: this.props.from,
		});
	}
	render() {
		const { aid, activitiesPool, isLayer, userPid } = this.props;
		const isShow = activitiesPool[aid] && activitiesPool[aid].hasOwnProperty("relatedList") && activitiesPool[aid].relatedList.length > 0 ? true : false;
		const viewActivityLog = { pid: userPid, page: 'pushA', filter: '' };
		if(!isShow){
			return null;
		}

		return (
			<div id="related" styleName="related">
				<span styleName="title">你可能會有興趣的文章：</span>
				<div styleName="main">
					<ul>
						{
							activitiesPool[aid].relatedList.map((relatedAid) => {
								const itemData = activitiesPool[relatedAid];
								return (
									<li styleName="item">
										{
											isLayer &&
											<p styleName="sub_title" onClick={ this.handleShowActivity.bind(this, itemData, viewActivityLog) } data-gtm-recommend="文推文 - 文章">
												{ itemData.title }
											</p>
										}
										{
											!isLayer &&
											<Link styleName="sub_title" to={"/m/activity/"+itemData.aid} onClick={ () => { activityLog(itemData, viewActivityLog) }} data-gtm-recommend="文推文 - 文章">
												{ itemData.title }
											</Link>
										}
										{
											itemData.channelInfo && itemData.channelInfo.type === 10
											?	<p styleName="name" data-gtm-recommend="文推文 - 頻道">{ itemData.channelInfo.name }</p> 
											: <p styleName="name" data-gtm-recommend="文推文 - 人">{ itemData.userInfo.userName }</p>
										}
									</li>
								)
							})
						}
					</ul>
				</div>
			</div>
		);
	}
}

function selector(state) {
	return {
		activitiesPool: state.entities.activities,
	};
}

export default compose(
	connect(selector, { fetchRelatedList, layerActivityOpen }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(RelatedList);
