import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { Link, browserHistory} from 'react-router';

import clientConfig from "src/configs/client";
import { NameCard } from 'src/client/component_common/card';
import SubscribePeople from 'src/client/component_common/subscribePeople';
import ChangeCard from 'src/client/component_common/changeCard';

class PeopleList extends Component {
	constructor( props, context ){
		super( props, context );
	}
	render() {
		if (
			(this.props.connection.mayKnowPeopleList && this.props.connection.mayKnowPeopleList.dataList.length === 0) &&
			(this.props.connection.excellentPeopleList && this.props.connection.excellentPeopleList.dataList.length === 0)
		) {
			return null;
		}

		return (
			<div styleName="personal_social_content">
				<div styleName="mayknow_note">
					<dl>
						{  
							this.props.connection.mayKnowPeopleList && this.props.connection.mayKnowPeopleList.dataList.length > 0 &&
							<dd>
								<div className="h3" styleName="mayknow_note_title">你可能認識的人</div>
								<ul>
									{
										this.props.connection.mayKnowPeopleList.dataList.filter(function(item) {
											if (item.connectionStatus === 0) {
												return item;
											}
										}).slice(0,2).map(function (item, key) {
											var job = (item.title!==null)? item.title+"　" : "";
											job += (item.company !== null)? item.company: "";
											
											return(
												<li key={key} styleName="people">
													<span styleName="left">
														<NameCard
															page="indexPushConnect"
															targetPid={ item.pid }
															key={ key }
															href={`/profile/${item.pid}`}
															imgSrc={ item.avatarWebUrl }
															name={ item.userName }
															gtm={{ "data-gtm-recommend": "可能認識" }}
														/>
														<a styleName="left_name" href={`/profile/${item.pid}`} data-gtm-recommend="可能認識">{item.name}</a>
														{
															item.mutualFriendCount > 0 &&
															<span styleName="left_detail">{item.mutualFriendCount}位共同朋友</span>
														}
														{
															item.mutualFriendCount <= 0 &&
															<span styleName="left_detail">{job}</span>
														}
													</span>
													<span styleName="right">
														<ChangeCard
															pid={this.props.pid}
															targetPid={item.pid}
															connectionStatus={item.connectionStatus}
															mutualFriendCount={item.mutualFriendCount}
															normal
															small
														/>
													</span>
												</li>
											)
										}.bind(this))
									}
									<li styleName="more">
										<span styleName="left"></span>
										<span styleName="all">
											<Link to={`/profile/${this.props.pid}/connection?mode=mayKnowPeopleList`}>看更多人</Link>
										</span>
									</li>
								</ul>
							</dd>
						}
						{
							this.props.connection.excellentPeopleList &&
							this.props.connection.excellentPeopleList.dataList.length >0 &&
							<dd>
								<div className="h3" styleName="mayknow_note_title">值得關注的人</div>
								<ul>
									{
										this.props.connection.excellentPeopleList.dataList.slice(0,2).map(function (item, key) {
											var job = (item.desc2!==null)? item.desc2+"　" : "";
											job += (item.desc1 !== null)? item.desc1: "";
											
											return (
												<li styleName="people" key={key}>
													<span styleName="left">
														<NameCard
															page="indexPushFollow"
															targetPid={ item.pid }
															key={ key }
															href={`/profile/${item.pid}`}
															imgSrc={ item.avatarWebUrl }
															name={ item.userName }
															gtm={{ "data-gtm-recommend": "值得關注" }}
														/>
														<a styleName="left_name" href={`/profile/${item.pid}`} data-gtm-recommend="值得關注">{item.name}</a>
														{
															item.subscribeCount > 0 &&
															<span styleName="left_detail">{item.subscribeCount}位在關注</span>
														}
														{
															item.subscribeCount <= 0 &&
															<span styleName="left_detail">{job}</span>
														}
													</span>
													<span styleName="right">
														<SubscribePeople
															pid={this.props.pid}
															targetPid={item.pid}
															subscribeStatus={item.subscribeStatus}
															normal
															small
														/>
													</span>
												</li>
											)
										}.bind(this))
									}
									<li styleName="more">
										<span styleName="left"></span>
										<span styleName="all">
											<Link to={`/profile/${this.props.pid}/connection?mode=excellentPeopleList`}>看更多人</Link>
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

export default compose(
	//connect(mapStateToProps, actions),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(PeopleList);
