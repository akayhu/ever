"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import Promise from 'bluebird';
import $ from "jquery";

import Survey from 'src/client/component_common/survey';
import BusinessCard from 'src/client/component_index/businessCard';
import SocialInfo from 'src/client/component_index/social';
import AD300pxBanner from 'src/client/component_common/ad/ad300pxBanner';
import PeopleList from 'src/client/component_index/people';
import ADAppBanner from 'src/client/component_common/ad/adAppBanner';
import License from 'src/client/component_common/license';
import PostActivity from 'src/client/component_common/postActivity';
import Tasks from 'src/client/component_index/tasks';
import AD640pxBanner from 'src/client/component_common/ad/ad640pxBanner';
import ActivityRiver from 'src/client/component_common/activityRiver';

import { viewAs, loadProfile, loadUserConfigByType, updatePersonalConfig } from 'src/client/actions/profile';
import { loadDataByCategory as groupLoadDataByCategory } from 'src/client/actions/group';
import { getSubscribeList } from 'src/client/actions/topic';
import { loadDataCenter } from 'src/client/actions/channel';
import { loadDataByCategory as connectionLoadDataByCategory} from 'src/client/actions/connection';
import { getPersonalWall } from 'src/client/actions/activity';
import {components as CPlatformComponents, actions as CPlatformActions} from 'c_platform';
import clientConfig from 'src/configs/client';
import scrollFixedUtil from 'src/client/services/scrollFixedUtil';
import css from './index.css';
import { LightBox } from 'c_wap_module';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class Index extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			showSatisfaction: null,
			category: 'NEW'
		};
		this.streamClasses = {
			HOT: '熱門動態',
			NEW: '最新動態',
			ALL: '訂閱的動態',
		};	
	}

	componentDidMount() {
		this.props.loadProfile({pid: this.props.user.pid});
		this.props.viewAs('self', 0);
		const params = {
			pid: this.props.user.pid,
			typeList: 'cb7c5df0-d577-40f1-bc00-12fb1bbfff7f',
		};
		params.pid && this.props.loadUserConfigByType(params).then(function (res) {
			if ( res.response.length > 0 ) {
				const value = res.response[0].value;
				let category;
				switch( value ) {
					case '最新動態' : 
						category = 'NEW';
						break;
					case '訂閱的動態' : 
						category = 'ALL';
						break;
					case '熱門動態' : 
						category = 'HOT';
						break;
					default:
						category = 'NEW';
						this.props.updatePersonalConfig({
							pid: this.props.user.pid,
							updateData: JSON.stringify([{
								type: 'cb7c5df0-d577-40f1-bc00-12fb1bbfff7f',
								value: '最新動態'
							}])
						});
						break;
				}
				this.setState({category: category});
			}
		}.bind(this));
		
		this.props.groupLoadDataByCategory('joined');
		this.props.getSubscribeList({pid: this.props.user.pid});
		this.props.loadDataCenter('joined', 'init');
		this.props.getPersonalWall('MYCOLLECT', {targetPid: this.props.user.pid, limit: 4});

		this.props.connectionLoadDataByCategory('excellentPeopleList', {
			pid: this.props.user.pid,
			mediaLimit: 0,
			mediaOffset: 0,
			peopleLimit: 20,
			peopleOffset: 0
		});

		this.props.connectionLoadDataByCategory('mayKnowPeopleList', {
			pid: this.props.user.pid,
			limit: 10,
			offset: 0
		});

		window.elogPage = 'index';

		if (this.refs.social_main && this.refs.license) {
			//scrollFixedUtil("[class*='license_content']", ".fix-wrap", 50);
		}
	}
	loadData(streamClass) {
		return this.props.getPersonalWall(streamClass);
	}
	setShowSatisfaction(showSatisfaction) {
		if(this.state.showSatisfaction !== showSatisfaction){
			this.setState({
				showSatisfaction: showSatisfaction
			});
		}
	}
	render() {
		return (
			<ViewWrapper { ...this.props } >
				<div className="container_wrap">
					<div className="wrap_w300_m20_w640">
						<div className="left_side" styleName="social-info" ref="social_main">
							<div className="fix-wrap">
								<BusinessCard
									profile={ this.props.profile }
								/>
								<SocialInfo
									pid={ this.props.user.pid }
									group={ this.props.group }
									subscribeFunction={ this.props.subscribeFunction }
									channel={ this.props.channel }
									myCollect={ this.props.activity.personalStream.MYCOLLECT[this.props.user.pid] }
									activityPool={ this.props.activity.activityPool }
									pagaName="indexSave"
								/>
								{/* <AD300pxBanner /> */}
								<PeopleList
									pid={ this.props.user.pid }
									connection={ this.props.connection }
								/>
								{/* <ADAppBanner /> */}
								<License ref="license" />
							</div>
						</div>
						<div className="right_side">
							{/* <div styleName="index_component">
								<PostActivity
									placeholder={ '發表文章' }
								/>
							</div> */}
							<div styleName="index_component">
								<AD640pxBanner
									showSatisfaction={ this.state.showSatisfaction }
								/>
							</div>
							<div styleName="index_component">
								<Tasks />
							</div>
							<div styleName="index_component">
								<Survey
									setShowSatisfaction={ this.setShowSatisfaction.bind(this) }
								/>
							</div>
							<div styleName="index_component">
								<ActivityRiver
									category={ this.state.category }
									categoryMap={ this.streamClasses }
									loadData={ this.loadData.bind(this) }
									pageName="index"
								/>
							</div>
						</div>
					</div>
				</div>

			</ViewWrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		profile: state.profile.user_info,
		user: state.user,
		group: state.group,
		subscribeFunction: state.subscribeFunction,
		channel: state.channel,
		activity: state.activity,
		connection: state.connection,
	};
}

export default compose(
		connect(mapStateToProps, { ...CPlatformActions.user, loadProfile, viewAs, groupLoadDataByCategory, loadUserConfigByType, updatePersonalConfig, getSubscribeList, loadDataCenter, connectionLoadDataByCategory, getPersonalWall }),
		//translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Index);
