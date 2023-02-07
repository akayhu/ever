import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { withRouter } from 'react-router';
import css from './master.css';
import ReactHtmlParser from 'react-html-parser';
import { has } from 'lodash/object';
import compose from 'src/util/compose';
import { Tab, Tabs } from 'c_wap_module';
import gtmDataLayer from 'src/util/gtmDataLayer';
// components
import Title from '../unit/title';
import Header from '../unit/header';
import Counter from '../unit/counter';
import SocialShare from '../unit/socialShare';
import Comment from '../unit/comment';
import RelatedList from '../unit/relatedList';
import { triggerLike, triggerCollect } from 'src/client/actions/activity';
import { CoolBtn, CollectBtn } from 'src/client/components/button';
import PeopleList from 'src/client/components/peopleList';
import ActivityEndorse from '../unit/activityEndorse';
import computeCount from 'src/client/utils/computeCount';
import { viewActivity } from 'src/client/actions/activity/activity_api';
import { activityLog } from 'src/client/actions/activity/activity_log.js';
import clientConfig from 'src/configs/client';
// import checkRescrape from 'src/util/fbRescrape';

class ActivityMaster extends Component {
	constructor(props) {
		super(props);
		this.goBack = true;
		this.state = {
			currentUrl: '',
			itemData: props.itemData,
		};
	}
	componentDidMount() {
		if (!/\/m\/activity\//g.test(document.location.pathname) && document.location.pathname !== `/m/activity/${this.props.aid}`) {
			this.state.currentUrl = document.location.pathname;
			window.history.pushState({aid: this.props.aid}, this.props.itemData.title, `/m/activity/${this.props.aid}`);
		}

		const aid = this.props.aid;
		const viewActivityLog = { pid: this.props.user ? this.props.user.pid : '', page: 'activity' };

		this.props.viewActivity(aid);
		activityLog(this.props.activitiesPool[aid], viewActivityLog);

		// 傳送開啟的文章到 GTM DataLayer
		gtmDataLayer.sendToDataLayer('Activity', this.props.activitiesPool[aid]);

		// 公開文章檢查 FB 分享快取狀態
		const activityInfo = this.props.activitiesPool[aid];
		// if (aid && activityInfo && (activityInfo.privacySetting === 0)) {
		// 	checkRescrape(
		// 		`https://${document.location.hostname}${this.state.currentUrl}`,
		// 		clientConfig.params.fbEToken,
		// 		clientConfig.params.fbPrvKeyPem,
		// 		1000 * 3600 * 6,
		// 	);
		// }
	}
	componentWillReceiveProps(nextProps) {
		if (has(nextProps.itemData, 'fail')) this.props.router.push('/m/error/404');
		// 當router改變時將關注點回到最上方
		if (this.props.itemData.aid !== nextProps.itemData.aid) {
			window.history.replaceState({ aid: nextProps.itemData.aid }, nextProps.itemData.title, `/m/activity/${nextProps.itemData.aid}`);

			const target = document.getElementById('main_layer');

			if (target) {
				target.scrollTop = 0;
			} else {
				window.scrollTo(0, 0);
			}
		}
	}
	renderCool(likeCount, likeList, aid) {
		const { triggerLike } = this.props;
		if (likeCount > 0) {
			return (
				<PeopleList
					dataList={ likeList }
					haveSubKey="userInfo"
					itemWrapStyle={ { border: 'none' } }
				/>
			);
		}

		return (
			<p styleName="first_section">
				還沒有人說這篇文章酷，
				<span styleName="first_btn" onClick={ () => triggerLike(true, { aidParent: aid, aid}) }>
					成為第一個說酷的人
				</span>
			</p>
		);
	}
	renderCollect(collectCount, collectList, aid) {
		const { triggerCollect } = this.props;
		if (collectCount > 0) {
			return (
				<PeopleList
					dataList={ collectList }
					haveSubKey="userInfo"
					itemWrapStyle={ { border: 'none' } }
				/>
			);
		}

		return (
			<p styleName="first_section">
				還沒有人收藏這篇文章，
				<span styleName="first_btn" onClick={ () => triggerCollect(true, { aid }) }>
					成為第一個收藏的人
				</span>
			</p>
		);
	}
	renderShowEndorse(channelInfo, user, aid, endorseHoneyPot) {
		if (vaildShowEndorse(channelInfo)) { // 頻道文章不顯示肯定
			return (
				<Tab name="肯定" text={ `肯定${computeCount(endorseHoneyPot ? endorseHoneyPot.length : 0)}` } gtmName="肯定 Tab">
					<ActivityEndorse user={ user } aid={ aid } />
				</Tab>
			);
		}
	}
	renderRelatedList(aid, itemData, isLayer, user) {
		if (aid) {
			return (
				<RelatedList
					aid={ aid }
					from={ itemData.title }
					isLayer={ isLayer }
					userPid={ user.pid }
				/>
			);
		}
	}
	renderAD(isLogin) {
		if (!isLogin) {
			return (
				<div styleName="e104_ad">
					<a href="/activity/b2044dab-3833-4bdc-989c-e264ea39b6bb" target="_self">
						<img
							className="banner"
							src="//static.104.com.tw/plus/m/img/other/banner_1020x320.jpg"
							data-gtm-activity="行銷區塊"
						/>
					</a>
				</div>
			);
		}
	}
	renderGoogleAD(isLogin) {
		if (!isLogin) {
			return (
				<div styleName="google_ad">
					<ins
						className="adsbygoogle"
						style="display: block; height: 280px"
						data-ad-client="ca-pub-5821762530473338"
						data-ad-slot="2833836202"
						data-ad-format="auto"
					/>
				</div>
			);
		}
	}
	render() {
		const { rootStyle, itemData, user, pageName, filter } = this.props;
		const {
			aid,
			userInfo,
			channelId,
			channelInfo,
			createDateStr,
			privacySetting,
			title,
			content,
			collectCount,
			collectList,
			commentCount,
			endorseHoneyPot,
			likeCount,
			likeList,
		} = itemData;

		if (has(itemData, 'fail')) return null;
		if (!aid) return null;
		const isLayer = rootStyle ? false : true;
		return (
			<div>
				<div
					styleName="master"
					style={ rootStyle }
					ref={ _ref => this.master = _ref }
				>
					<Header
						userInfo={ userInfo }
						channelId={ channelId }
						channelInfo={ channelInfo }
						createDateStr={ createDateStr }
						privacySetting={ setPrivacyIcon(privacySetting) }
					/>
					<div>
						<article styleName="article">
							<Title title={ title } />
							{ ReactHtmlParser(content) }
							<Counter itemData={ itemData } mode="master" />
						</article>
						<SocialShare user={ user } itemData={ itemData } mode="master" />
					</div>
				</div>
				<div styleName="bottom">
					<CoolBtn
						propsSource={ itemData }
						pid={ user.pid }
						pageName={ pageName }
						filter={ filter }
					/>
					<CollectBtn
						propsSource={ itemData }
						pid={ user.pid }
						pageName={ pageName }
						filter={ filter }
					/>
				</div>
				<div>
					<Tabs>
						<Tab name="酷" text={ `酷${computeCount(likeCount)}` } gtmName="酷 Tab">
							{ this.renderCool(likeCount, likeList, aid) }
						</Tab>
						{ /* 肯定 Tab */ }
						{ this.renderShowEndorse(channelInfo, user, aid, endorseHoneyPot) }
						<Tab name="留言" text={ `留言${computeCount(commentCount)}` } gtmName="留言 Tab">
							<Comment
								itemData={ itemData }
								aid={ aid }
								commentCount={ commentCount }
								pageName={ pageName }
								filter={ filter }
							/>
						</Tab>
						<Tab name="收藏" text={ `收藏${computeCount(collectCount)}` } gtmName="收藏 Tab">
							{ this.renderCollect(collectCount, collectList, aid) }
						</Tab>
					</Tabs>
					{ this.renderRelatedList(aid, itemData, isLayer, user) }
					{ /* 行銷區塊 */ }
					{ /* this.renderAD(user.isLogin) */ }
					{ /* google 廣告 */ }
					{ /* this.renderGoogleAD(user.isLogin) */ }
				</div>
			</div>
		);
	}
}

function vaildShowEndorse(channelInfo) {
	if (!channelInfo) return true;
	return channelInfo && channelInfo.type !== 10;
}

function setPrivacyIcon(setting) {
	switch (setting) {
		case 0:
			return 'world icon';
		case 1:
			return 'friends icon';
		case 2:
			return 'lock icon';
		default:
			return 'world icon';
	}
}

ActivityMaster.defaultProps = {
	itemData: {},
};

ActivityMaster.propTypes = {
	itemData: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	// console.log(state);
	return {
		user: state.user,
		activitiesPool: state.entities.activities,
	};
}

export default compose(
	connect(mapStateToProps, { triggerLike, triggerCollect, viewActivity }),
	withRouter,
	[CSSModules, '_', css, { allowMultiple: true }],
)(ActivityMaster);
