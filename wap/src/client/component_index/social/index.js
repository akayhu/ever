import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { Link} from 'react-router';

import { activityLightboxOpen } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activityLog.js';

class SocialInfo extends Component {
	constructor(props, context) {
		super(props, context);
	}
	lightboxOpen(itemData) {
		const pageName = this.props.pagaName;
		const viewActivityLog = { pid: this.props.pid, page: 'indexSave'};
		activityLog(itemData, viewActivityLog);
		this.props.activityLightboxOpen(itemData);
	}
	render() {
		return (
			<div styleName="personal_social_content">
				<div styleName="group_follow">
					<dl>
						{
							this.props.group.joined && this.props.group.joined.dataList && this.props.group.joined.total > 0 &&
							<dd>
								<div className="h3" styleName="group_follow_title">我的社團</div>
								<ul>
									{
										this.props.group.joined.dataList && this.props.group.joined.dataList.slice(0,3).map((item, key) => {
											return (
												<li key={ key }>
													<span styleName="left">
														<i className="group icon" />
														<Link to={ `/group/${item.id}` } data-gtm-index="參加的社團">{item.name}</Link>
													</span>
												</li>
											)
										})
									}
									{
										this.props.group.joined.dataList && this.props.group.joined.total > 3 &&
										<li>
											<span styleName="left"></span>
											<span styleName="all">
												<Link to={ `/group?category=joined` }>全部</Link>
											</span>
										</li>
									}
								</ul>
							</dd>
						}
						{
							this.props.subscribeFunction.subscribeInfo && this.props.subscribeFunction.subscribeInfo.length >0 &&
							<dd>
								<div className="h3" styleName="group_follow_title">關注的職場動態</div>
								<ul>
									{
										this.props.subscribeFunction.subscribeInfo.slice(0,3).map((item, index) => {
											return (
												<li key={index}>
													<span styleName="left">
														<i className="topic icon" />
														<Link to={ `/topic/${item.function}` } data-gtm-index="關注的職場動態">{item.function}</Link>
													</span>
												</li>
											)
										})
									}
								</ul>
							</dd>
						}
						{
							this.props.channel.channelList.joined.total > 0 &&
							<dd>
								<div className="h3" styleName="group_follow_title">關注的頻道</div>
								<ul>
									{
										this.props.channel.channelList.joined.dataList.slice(0,3).map((item, index) => {
											return (
												<li key={ index }>
													<span styleName="left">
														<i className="star icon"/>
														<Link to={ `/channel/${item.id}` } data-gtm-index="關注的頻道">{item.name}</Link>
													</span>
												</li>)
										})
									}
									<li>
										<span styleName="left"></span>
										<span styleName="all">
											<Link to={ `/channel?category=joined` }>全部</Link>
										</span>
									</li>
								</ul>
							</dd>
						}
						{
							this.props.myCollect && this.props.myCollect.dataList.length > 0 &&
							<dd>
								<div className="h3" styleName="group_follow_title">收藏的文章</div>
								<ul>
									{
										this.props.myCollect.dataList.slice(0,3).map((aid, index) => {
											const itemData = this.props.activityPool[aid];
											return (
												<li key={ aid }>
													<span styleName="left">
														<i className="bookmark icon" />
														<a onClick={ this.lightboxOpen.bind(this, itemData) } href="javascript:;" data-gtm-index="收藏文章 - 開啟">{ itemData.title }</a>
													</span>
												</li>)
										})
									}
									<li>
										<span styleName="left"></span>
										<span styleName="all">
											<Link to={ `/profile/${this.props.pid}/activity?mode=collect` } data-gtm-index="收藏的文章">全部文章</Link>
										</span>
									</li>
								</ul>
							</dd>
						}
					</dl>
				</div>
			</div>
		);
	}
}

const actions = {activityLightboxOpen};

export default compose(
	connect(null, actions),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SocialInfo);
