import update from 'react-addons-update';
import { merge, omit} from 'lodash/object';
import * as ActivityActionType from '../../actions/activity';
import * as SearchActionType from '../../actions/search';
import {GET_DATA as TOPIC_GET_DATA} from '../../actions/topic';
import {CHECK_ACTIVITY, DELETING_ACTIVITIES, DELETE_ACTIVITY_SUCCESS, DELETE_ACTIVITY_ERROR} from '../../actions/group';

export const initState = {
	personalStream: {
		PERSONALWALL: {
			0: {
				dataList: [],
				status: 'init',
				ts: 0,
				loading: false,
				end: false,
				total: 0
			}
		},
		MYCOLLECT: {
			0: {
				dataList: [],
				status: 'init',
				ts: 0,
				loading: false,
				end: false,
				total: 0
			}
		},
		GALLERY: {
			0: {
				dataList: [],
				status: 'init',
				offset: 0,
				loading: false,
				end: false,
				total: 0
			}
		},
		GROUP: {
			0: {
				dataList: [],
				status: 'init',
				offset: 0,
				loading: false,
				end: false,
				total: 0,
				sortField: null,
				order: null
			}
		},
		CHANNEL: {
			0: {
				dataList: [],
				status: 'init',
				offset: 0,
				loading: false,
				end: false,
				total: 0
			}
		},
		HOT: {
			dataList: [],
			status: 'init',
			stickey: '',
			oriQuery: '',
			loading: false,
			end: false
		},
		NEW: {
			dataList: [],
			status: 'init',
			stickey: '',
			oriQuery: '',
			loading: false,
			end: false
		},
		ALL: {
			dataList: [],
			status: 'init',
			ts: 0,
			loading: false,
			end: false
		}
	},

	// 所有的 activity model
	activityPool: {},

	// 單則 lightbox
	lightbox: null,

  // 警告視窗 lightbox
	lightboxStatus: {
		isShow: false,
		text: ''
	},

	// 展示櫥窗置頂排序
	gallerysort: {
		loading: false,
		end: false,
		top: [],
		other: []
	},
};

function getAidsByActivityList(activityList) {
	if (!activityList) {
		return [];
	}

	return activityList.map((activity) => activity.aid);
}

function getMapByActivityList(activityList) {
	if (!activityList) {
		return [];
	}

	return activityList.reduce((newObj, activity, index) => {
		if (activity.commentList) {
			// 這邊可以做留言巢狀
			activity.commentList.map((comment) => {
				newObj[comment.aid] = fixArrayProperty(comment);
			});
		}

		newObj[activity.aid] = fixArrayProperty(activity);

		return newObj;
	}, {});
}

function fixArrayProperty(activity) {
	const commentList = activity.commentList || [];
	const aidList = getAidsByActivityList(commentList);

	activity = Object.assign(activity, {
		commentList: aidList,
		commentLoading: false,
		commentEnd: false,
		getCommentListTs: 0,
		relativeList: activity.relativeList || [],
		relativeLoading: false,
		relativeEnd: false,
		endorseHoneyPot: activity.endorseHoneyPot || [],
		tagList: activity.tagList || [],
		ignore: false,
		loading: false
	});

	return activity;
}

const getInitialState = () => JSON.parse(JSON.stringify(initState));

export default function activityReducer(state = getInitialState(), action) {

	try {
		switch (action.type) {
			/**
			 * 請求資料
			 */
			case ActivityActionType.REQUST_ACTIVITY_DATA: {
				const newState = {
					...state
				};

				switch (action.category) {
					case 'GALLERYSORT': {
						newState.gallerysort.loading = true;
						newState.gallerysort = {...newState.gallerysort};

						return newState;
					}
					case 'COMMENT': {
						newState.activityPool[action.params.aid].commentLoading = true;
						newState.activityPool[action.params.aid] = {...newState.activityPool[action.params.aid]};
						return newState;
					}
					case 'RELATIVE_ACTIVITY': {
						newState.activityPool[action.params.aid].relativeLoading = true;
						newState.activityPool[action.params.aid] = {...newState.activityPool[action.params.aid]};
						return newState;
					}
					case 'PERSONALWALL':
					case 'MYCOLLECT':
					case 'GALLERY': {
						newState.personalStream[action.category][action.params.targetPid].loading = true;
						newState.personalStream[action.category][action.params.targetPid] = {...newState.personalStream[action.category][action.params.targetPid]};
						return newState;
					}
					case 'GROUP':
					case 'CHANNEL': {
						newState.personalStream[action.category][action.params.channelId].loading = true;
						newState.personalStream[action.category][action.params.channelId] = {...newState.personalStream[action.category][action.params.channelId]};
						return newState;
					}
					case 'HOT':
					case 'NEW':
					case 'ALL':
					default: {
						newState.personalStream[action.category].loading = true;
						newState.personalStream[action.category] = {...newState.personalStream[action.category]};
						return newState;
					}
				}
			}
			/**
			 * 河道列表取得資料成功
			 */
			case ActivityActionType.RECEIVE_ACTIVITY_LIST_DATA: {
				// 共同部分
				const aidList = getAidsByActivityList(action.response.activityList);
				const activityList = getMapByActivityList(action.response.activityList);
				const newState = {
					...state,
					activityPool: {
						...state.activityPool,
						...activityList
					}
				};

				switch (action.category) {
					/**
					 * 最新文章牆
					 */
					case ActivityActionType.GET_PERSONAL_RIVER_NEW: {
						newState.personalStream.NEW = {
							dataList: state.personalStream.NEW.dataList.concat(aidList),
							status: 'normal',
							stickey: action.response.stickey,
							oriQuery: action.response.oriQuery,
							loading: false,
							end: action.response.touchEnd === true
						};

						return newState;
					}
					/**
					 * 熱門文章牆
					 */
					case ActivityActionType.GET_PERSONAL_RIVER_HOT: {
						newState.personalStream.HOT = {
							dataList: state.personalStream.HOT.dataList.concat(aidList),
							status: 'normal',
							stickey: action.response.stickey,
							oriQuery: action.response.oriQuery,
							loading: false,
							end: action.response.touchEnd === true
						};

						return newState;
					}
					/**
					 * 全部文章牆
					 */
					case ActivityActionType.GET_PERSONAL_RIVER_ALL: {
						newState.personalStream.ALL = {
							dataList: state.personalStream.ALL.dataList.concat(aidList),
							status: 'normal',
							ts: action.response.ts,
							loading: false,
							end: aidList.length === 0
						};

						return newState;
					}
					/**
					 * 個人文章牆
					 */
					case ActivityActionType.GET_PERSONAL_WALL: {
						newState.personalStream.PERSONALWALL[action.params.targetPid] = {
							dataList: state.personalStream.PERSONALWALL[action.params.targetPid].dataList.concat(aidList),
							status: 'normal',
							ts: action.response.ts,
							loading: false,
							end: aidList.length === 0,
							total: state.personalStream.PERSONALWALL[action.params.targetPid].total
						};

						if (action.response.totalCount !== 0) {
							newState.personalStream.PERSONALWALL[action.params.targetPid].total = action.response.totalCount;
						}

						return newState;
					}
					/**
					 * 個人收藏牆文章
					 */
					case ActivityActionType.GET_PERSONAL_COLLECT: {
						newState.personalStream.MYCOLLECT[action.params.targetPid] = {
							dataList: state.personalStream.MYCOLLECT[action.params.targetPid].dataList.concat(aidList),
							status: 'normal',
							ts: action.response.ts,
							loading: false,
							end: aidList.length === 0,
							total: state.personalStream.MYCOLLECT[action.params.targetPid].total
						};

						if (action.response.totalCount !== 0) {
							newState.personalStream.MYCOLLECT[action.params.targetPid].total = action.response.totalCount;
						}

						return newState;
					}
					/**
					 * 個人展示櫥窗
					 */
					case ActivityActionType.GET_PERSONAL_GALLERY: {
						newState.personalStream.GALLERY[action.params.targetPid] = {
							dataList: state.personalStream.GALLERY[action.params.targetPid].dataList.concat(aidList),
							status: 'normal',
							offset: action.response.offset,
							loading: false,
							end: action.response.hasNext === false,
							total: action.response.total
						};

						return newState;
					}
					/**
					 * 文章留言牆
					 */
					case ActivityActionType.GET_COMMENT_LIST: {
						newState.activityPool[action.params.aid].commentList = aidList.concat(newState.activityPool[action.params.aid].commentList);
						newState.activityPool[action.params.aid].getCommentListTs = action.response.ts;
						newState.activityPool[action.params.aid].commentLoading = false;
						newState.activityPool[action.params.aid].commentEnd = aidList.length === 0;

						return newState;
					}
					/**
					 * 有興趣文章
					 */
					case ActivityActionType.GET_RELATIVE_ACTIVITY: {
						newState.activityPool[action.params.aid].relativeList = newState.activityPool[action.params.aid].relativeList || [];
						newState.activityPool[action.params.aid].relativeList = newState.activityPool[action.params.aid].relativeList.concat(aidList);

						return newState;
					}
					/**
					 * 頻道牆
					 */
					case ActivityActionType.GET_CHANNEL_WALL: {
						newState.personalStream.CHANNEL[action.params.channelId] = {
							dataList: state.personalStream.CHANNEL[action.params.channelId].dataList.concat(aidList),
							status: 'normal',
							offset: action.response.nextFrom || state.personalStream.CHANNEL[action.params.channelId].nextFrom,
							loading: false,
							end: action.response.hasNext === false || aidList.length === 0,
							total: 0// action.response.total
						};

						return newState;
					}
					/**
					 * 社團牆
					 */
					case ActivityActionType.GET_GROUP_WALL: {
						newState.personalStream.GROUP[action.params.channelId] = {
							dataList: state.personalStream.GROUP[action.params.channelId].dataList.concat(aidList),
							status: 'normal',
							offset: action.response.nextFrom || state.personalStream.GROUP[action.params.channelId].nextFrom,
							loading: false,
							end: action.response.hasNext === false || aidList.length === 0,
							total: 0// action.response.total
						};

						return newState;
					}
					/**
					 * 單純加入pool
					 */
					case SearchActionType.SEARCH_BY_TAG:
					case SearchActionType.SEARCH_BY_KEYWORD:
					case SearchActionType.SEARCH_BY_KEYWORD_AT_PUBLIC_CHANNEL:
					case SearchActionType.SEARCH_BY_KEYWORD_AT_PRIVAYE_CHANNEL:
					case SearchActionType.SEARCH_BY_KEYWORD_AT_AUTHOR:
					default: {
						return newState;
					}
				}
			}
			/**
			 * 取得資料成功
			 */
			case ActivityActionType.RECEIVE_ACTIVITY_DATA: {
				const newState = {
					...state
				};

				function addToRiver(activity) {
					// 展示櫥窗
					if (activity.extra.hasOwnProperty('source') && activity.extra.source === 'gallery') {
						newState.personalStream.GALLERY[activity.pid].dataList.unshift(activity.aid);
						return;
					}

					// newState.personalStream.ALL.dataList.unshift(action.itemData.aid);
					// newState.personalStream.HOT.dataList.unshift(action.itemData.aid);
					newState.personalStream.NEW.dataList.unshift(activity.aid);

					if (newState.personalStream.PERSONALWALL.hasOwnProperty(activity.pid)) {
						newState.personalStream.PERSONALWALL[activity.pid].dataList.unshift(activity.aid);
					}

					if (activity.hasOwnProperty('channelId') && activity.channelId !== null && activity.channelInfo !== null) {
						if (activity.channelInfo.type === 7 || activity.channelInfo.type === 8) { // verb === 1
							// Group
							newState.personalStream.GROUP[activity.channelId].dataList.unshift(activity.aid);
						} else if (activity.channelInfo.type === 10) {
							// Channel
							newState.personalStream.CHANNEL[activity.channelId].dataList.unshift(activity.aid);
						}
					}
				}

				function deleteFromRiver(activity) {
					// 展示櫥窗
					if (activity.extra.hasOwnProperty('source') && activity.extra.source === 'gallery') {
						newState.personalStream.GALLERY[activity.pid].dataList = newState.personalStream.GALLERY[activity.pid].dataList.filter(aid => aid !== activity.aid);
						return;
					}

					for (const category in newState.personalStream) {
						if (newState.personalStream[category].hasOwnProperty('dataList')) {
							newState.personalStream[category].dataList = newState.personalStream[category].dataList.filter(aid => aid !== activity.aid);

							if (newState.personalStream[category].hasOwnProperty('total') && newState.personalStream[category].total > 0) {
								newState.personalStream[category].total -= 1;
							}
						}else {
							for (const targetId in newState.personalStream[category]) {
								newState.personalStream[category][targetId].dataList = newState.personalStream[category][targetId].dataList.filter(aid => aid !== activity.aid);

								if (newState.personalStream[category][targetId].hasOwnProperty('total') && newState.personalStream[category][targetId].total > 0) {
									newState.personalStream[category][targetId].total -= 1;
								}
							}
						}
					}
				}

				function addToAidParent(activity) {
					// unshift 可以用在新規格，例如不一樣的類型留言排序可以倒置
					newState.activityPool[activity.aidParent].commentList.push(activity.aid);
					newState.activityPool[activity.aidParent].commentCount += 1;
				}

				function deleteFromAidParent(activity) {
					newState.activityPool[activity.aidParent].commentList = newState.activityPool[activity.aidParent].commentList.filter(aid => aid !== activity.aid);
					newState.activityPool[activity.aidParent].commentCount -= 1;
				}

				switch (action.category) {
					/**
					 * 建立單則文章
					 */
					case ActivityActionType.BROADCAST_CREATE_ACTIVITY: {
						newState.activityPool[action.response.aid] = fixArrayProperty(action.response);

						// 更新河道
						addToRiver(action.response);

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/**
					 * 更新單則文章
					 */
					case ActivityActionType.BROADCAST_UPDATE_ACTIVITY: {
						newState.activityPool[action.response.aid] = fixArrayProperty(action.response);
						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};
						return newState;
					}
					/**
					 * 取得單則文章
					 */
					case ActivityActionType.GET_ACTIVITY: {
						newState.activityPool[action.params.aid] = fixArrayProperty(action.response);
						newState.activityPool[action.params.aid] = {...newState.activityPool[action.params.aid]};
						return newState;
					}
					/**
					 * 移除單則文章
					 */
					case ActivityActionType.BROADCAST_DELETE_ACTIVITY: {
						delete newState.activityPool[action.response.aid];

						// 更新河道
						deleteFromRiver(action.response);

						return newState;
					}
					/**
					 * 交換單則文章
					 */
					case ActivityActionType.BROADCAST_SWITCH_ACTIVITY: {
						newState.activityPool[action.params.newActivity.aid] = fixArrayProperty(action.params.newActivity);
						delete newState.activityPool[action.params.oldActivity.aid];

						// 更新河道
						addToRiver(action.params.newActivity);
						deleteFromRiver(action.params.oldActivity);

						newState.activityPool[action.params.newActivity.aid] = {...newState.activityPool[action.params.newActivity.aid]};

						return newState;
					}
					/**
					 * 建立單則留言
					 */
					case ActivityActionType.BROADCAST_CREATE_COMMENT: {
						newState.activityPool[action.response.aid] = fixArrayProperty(action.response);

						// 更新父層文章
						addToAidParent(action.response);

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/**
					 * 更新單則文章
					 */
					case ActivityActionType.BROADCAST_UPDATE_COMMENT: {
						newState.activityPool[action.response.aid] = fixArrayProperty(action.response);

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/**
					 * 移除單則文章
					 */
					case ActivityActionType.BROADCAST_DELETE_COMMENT: {
						delete newState.activityPool[action.response.aid];

						// 更新河道
						deleteFromAidParent(action.response);

						return newState;
					}
					/**
					 * 交換單則留言
					 */
					case ActivityActionType.BROADCAST_SWITCH_COMMENT: {

						newState.activityPool[action.params.newActivity.aid] = fixArrayProperty(action.params.newActivity);
						delete newState.activityPool[action.params.oldActivity.aid];

						// 更新河道
						addToAidParent(action.params.newActivity);
						deleteFromAidParent(action.params.oldActivity);

						newState.activityPool[action.params.newActivity.aid] = {...newState.activityPool[action.params.newActivity.aid]};

						return newState;
					}
					/**
					 * 建立單個肯定
					 */
					case ActivityActionType.BROADCAST_CREATE_ENDORSE: {
						const endorseHoneyPot = newState.activityPool[action.params.aid].endorseHoneyPot;
						const result = endorseHoneyPot.filter(endorse => endorse.item === action.response.item);

						if (result.length === 0) {
							endorseHoneyPot.push(action.response);
						} else {
							for (let index = 0; index < endorseHoneyPot.length; index += 1) {
								if (endorseHoneyPot[index].item === action.response.item) {
									endorseHoneyPot[index].count += 1;
									endorseHoneyPot[index].endorseIt = true;
								}
							}
						}

						const user = action.params.user;
						// 我有沒有在清單內
						const amIHere = newState.activityPool[action.params.aid].endorseList.filter(endorseUser => endorseUser.pid === user.pid).length > 0;

						newState.activityPool[action.params.aid].endorseHoneyPot = endorseHoneyPot;
						newState.activityPool[action.params.aid].endorseItemCount = newState.activityPool[action.params.aid].endorseHoneyPot.length;
						newState.activityPool[action.params.aid].endorseCount += 1;
						newState.activityPool[action.params.aid].endorseIt = true;

						if (!amIHere) {
							newState.activityPool[action.params.aid].endorseList.push({
								createDate: new Date().getTime(),
								pid: user.pid,
								userInfo: {
									...user,
									userFileUrl: user.avatarWebUrl
								}
							});
						}

						newState.activityPool[action.params.aid] = {...newState.activityPool[action.params.aid]};

						return newState;
					}
					/**
					 * 移除單個肯定
					 */
					case ActivityActionType.BROADCAST_DELETE_ENDORSE: {
						let endorseHoneyPot = newState.activityPool[action.params.aid].endorseHoneyPot;
						const expectEndorseList = newState.activityPool[action.params.aid].expectEndorseList;
						const expectEndorseCheck = expectEndorseList.filter(endorse => endorse === action.response.item);

						// 作者要強制刪除
						if (action.response.forceDelete === true) {
							endorseHoneyPot = endorseHoneyPot.filter(endorse => endorse.item !== action.response.item);
							newState.activityPool[action.params.aid].endorseHoneyPot = endorseHoneyPot;

							if (newState.activityPool[action.params.aid].endorseCount >= action.response.count) {
								newState.activityPool[action.params.aid].endorseCount -= action.response.count;
							} else {
								newState.activityPool[action.params.aid].endorseCount = 0;
							}
						} else {
							// 該肯定項不是原作者期待的(expectEndorseList裡面的值)
							if (expectEndorseCheck.length === 0) {
								if (action.response.count <= 0) {
									// 小於零時則把整個肯定項給filter掉
									endorseHoneyPot = endorseHoneyPot.filter(endorse => endorse.item !== action.response.item);
								} else {
									// 一般刪除時則就數量減一及是否有肯定他改成false
									for (let index = 0; index < endorseHoneyPot.length; index += 1) {
										if (endorseHoneyPot[index].item === action.response.item) {
											endorseHoneyPot[index].count -= 1;
											endorseHoneyPot[index].endorseIt = false;
										}
									}
								}
							} else {
							// 該肯定項是原作者期待的(expectEndorseList裡面的值)
								for (let index = 0; index < endorseHoneyPot.length; index += 1) {
									if (endorseHoneyPot[index].item === action.response.item) {
										if (endorseHoneyPot[index].count >= 1) {
											// 移除肯定時，減一肯定數量
											endorseHoneyPot[index].count -= 1;
										} else {
											// 移除肯定時，若是作者期待的(expectEndorseList裡面的值)肯定項，則歸零
											endorseHoneyPot[index].count = 0;
										}
										endorseHoneyPot[index].endorseIt = false;
									}
								}
							}

							const user = action.params.user;
							// 有沒有我肯定過的
							const hadEndorseIDid = endorseHoneyPot.filter(endorse => endorse.endorseIt === true).length > 0;
							// 我有沒有在清單內
							const amIHere = newState.activityPool[action.params.aid].endorseList.filter(endorseUser => endorseUser.pid === user.pid).length > 0;

							newState.activityPool[action.params.aid].endorseHoneyPot = endorseHoneyPot;
							newState.activityPool[action.params.aid].endorseItemCount = newState.activityPool[action.params.aid].endorseHoneyPot.length;

							if (newState.activityPool[action.params.aid].endorseCount >= 1) {
								newState.activityPool[action.params.aid].endorseCount -= 1;
							} else {
								newState.activityPool[action.params.aid].endorseCount = 0;
							}

							if (!hadEndorseIDid) {
								newState.activityPool[action.params.aid].endorseIt = false;

								if (amIHere) {
									newState.activityPool[action.params.aid].endorseList = newState.activityPool[action.params.aid].endorseList.filter(endorseUser => endorseUser.pid !== user.pid);
								}
							}
						}

						newState.activityPool[action.params.aid] = {...newState.activityPool[action.params.aid]};

						return newState;
					}
					/**
					 * 讚 不讚
					 */
					case ActivityActionType.LIKE_THIS_ACTIVITY: {
						const user = action.params.user;

						const targetAid = action.response.aid;

						if (!newState.activityPool[targetAid].likeList) newState.activityPool[targetAid].likeList = [];
						const amIHere = newState.activityPool[targetAid].likeList.filter(likeUser => likeUser.pid === user.pid).length > 0;

						if (action.response.isLike) {
							newState.activityPool[action.response.aid].likeIt = true;
							newState.activityPool[action.response.aid].likeCount += 1;

							if (!amIHere) {
								newState.activityPool[action.response.aid].likeList.push({
									createDate: new Date().getTime(),
									pid: user.pid,
									userInfo: user
								});
							}
						} else{
							newState.activityPool[action.response.aid].likeIt = false;

							if (newState.activityPool[action.response.aid].likeCount >= 1) {
								newState.activityPool[action.response.aid].likeCount -= 1;
							}else {
								newState.activityPool[action.response.aid].likeCount = 0;
							}

							if (amIHere) {
								newState.activityPool[action.response.aid].likeList = newState.activityPool[action.response.aid].likeList.filter(likeUser => likeUser.pid !== user.pid);
							}
						}

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};
						return newState;
					}
					/**
					 * 收藏 不收藏
					 */
					case ActivityActionType.COLLECT_THIS_ACTIVITY: {
						const user = action.params.user;
						const amIHere = newState.activityPool[action.response.aid].collectList.filter(likeUser => likeUser.pid === user.pid).length > 0;

						if (action.response.isCollect) {
							newState.activityPool[action.response.aid].collectIt = true;
							newState.activityPool[action.response.aid].collectCount += 1;

							if (!amIHere) {
								newState.activityPool[action.response.aid].collectList.push({
									createDate: new Date().getTime(),
									pid: user.pid,
									userInfo: user
								});
							}
						} else{
							newState.activityPool[action.response.aid].collectIt = false;

							if (newState.activityPool[action.response.aid].collectCount >= 1) {
								newState.activityPool[action.response.aid].collectCount -= 1;
							}else {
								newState.activityPool[action.response.aid].collectCount = 0;
							}

							if (amIHere) {
								newState.activityPool[action.response.aid].collectList = newState.activityPool[action.response.aid].collectList.filter(likeUser => likeUser.pid !== user.pid);
							}
						}

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/**
					 * ˊ追蹤 不追蹤
					 */
					case ActivityActionType.SUBSCRIBE_SOMEBODY: {
						if (action.response.isSubscribeStatus) {
							newState.activityPool[action.response.aid].userInfo.subscribeStatus = true;
						}else {
							newState.activityPool[action.response.aid].userInfo.subscribeStatus = false;
						}

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/*
					 * 對文章沒興趣 取消對文章沒興趣
					 */
					case ActivityActionType.IGNORE_ACTIVITY: {
						if (action.response.ignore) {
							newState.activityPool[action.response.aid].ignore = 'article';
						} else{
							newState.activityPool[action.response.aid].ignore = false;
						}

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/*
					 * 對作者沒興趣 取消對作者沒興趣
					 */
					case ActivityActionType.NOT_INTERESTED_SOMEBODY: {
						if (action.response.ignore) {
							newState.activityPool[action.response.aid].ignore = 'person';
						}else {
							newState.activityPool[action.response.aid].ignore = false;
						}

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/*
					 * 瀏覽數
					 */
					case ActivityActionType.VIEW_ACYIVITY: {
						newState.activityPool[action.response.aid].viewCount += 1;

						newState.activityPool[action.response.aid] = {...newState.activityPool[action.response.aid]};

						return newState;
					}
					/**
					 * 展示櫥窗排序
					 */
					case ActivityActionType.LOADED_PROFILE_GALLERY_SORT: {
						newState.gallerysort = {
							...action.response,
							loading: false,
							end: true
						};


						if (action.params && action.params.dataList) {
							newState.personalStream.GALLERY[action.params.targetPid].dataList = [...action.params.dataList];
							newState.personalStream.GALLERY[action.params.targetPid] = {...newState.personalStream.GALLERY[action.params.targetPid]};
							
						}

						return newState;
					}
				}
			}
			/**
			 * 取得文章失敗
			 **/
			case ActivityActionType.RECEIVE_ACTIVITY_FAIL: {
				const newState = {
					...state
				};
				switch (action.category) {
					case ActivityActionType.GET_ACTIVITY: {
						newState.activityPool[action.errorMsg.aid] = Object.assign(newState.activityPool[action.errorMsg.aid], { loading: false, fail: true });
						return newState;
					}
					default:
						return newState;
				}
			}
			/**
			 * 文章取得數量成功
			 */
			case ActivityActionType.RECEIVE_ACTIVITY_COUNT: {
				const newState = {
					...state
				};

				switch (action.category) {
					/**
					 * 個人文章總數
					 */
					case ActivityActionType.GET_ACTIVITY_COUNT_BY_PIDS: {
						for (const pid in action.response) {
							if (newState.personalStream.PERSONALWALL[pid]) {
								newState.personalStream.PERSONALWALL[pid].total = action.response[pid];
							}
						}

						return newState;
					}
					/**
					 * 個人收藏文章總數
					 */
					case ActivityActionType.GET_COLLECT_COUNT: {
						newState.personalStream.MYCOLLECT[action.params.targetPid].total = action.response;

						return newState;
					}
					default:
						return newState;
				}
			}
			/**
			 * 文章初始化
			 */
			case ActivityActionType.INIT_ACTIVITY: {
				const newState = {
					...state
				};

				newState.activityPool[action.params.aid] = {
					loading: true
				};

				return newState;
			}
			/**
			 * 個人牆文章初始化
			 */
			case ActivityActionType.INIT_PERSONAL_WALL: {
				const newState = {
					...state
				};

				newState.personalStream.PERSONALWALL[action.params.targetPid] = {
					dataList: [],
					status: 'init',
					ts: 0,
					loading: false,
					end: false,
					total: 0
				};

				return newState;
			}
			/**
			 * 個人收藏牆文章初始化
			 */
			case ActivityActionType.INIT_MYCOLLECT_WALL: {
				const newState = {
					...state
				};

				newState.personalStream.MYCOLLECT[action.params.targetPid] = {
					dataList: [],
					status: 'init',
					ts: 0,
					loading: false,
					end: false,
					total: 0
				};

				return newState;
			}
			/**
			 * 個人收藏牆文章初始化
			 */
			case ActivityActionType.INIT_GALLERY_WALL: {
				const newState = {
					...state
				};

				newState.personalStream.GALLERY[action.params.targetPid] = {
					dataList: [],
					status: 'init',
					offset: 0,
					loading: false,
					end: false,
					total: 0
				};

				return newState;
			}
			/**
			 * 	頻道文章初始化
			 */
			case ActivityActionType.INIT_CHANNEL_WALL: {
				const newState = {
					...state
				};

				newState.personalStream.CHANNEL[action.params.channelId] = {
					dataList: [],
					status: 'init',
					offset: 0,
					loading: false,
					end: false,
					total: 0
				};

				return newState;
			}
			/**
			 * 	社團文章初始化
			 */
			case ActivityActionType.INIT_GROUP_WALL: {
				const newState = {
					...state
				};

				newState.personalStream.GROUP[action.params.channelId] = {
					dataList: [],
					status: 'init',
					offset: 0,
					loading: false,
					end: false,
					total: 0,
					sortField: null,
					order: null
				};

				return newState;
			}
			/**
			 * 打開文章lightbox
			 */
			case ActivityActionType.OPEN_ACTIVITY_LIGHTBOX: {
				return {
					...state,
					lightbox: action.aid
				};
			}
			/**
			 * 關閉文章lightbox
			 */
			case ActivityActionType.COLSE_ACTIVITY_LIGHTBOX: {
				return {
					...state,
					lightbox: null
				};
			}
			/**
			 * 職場動態
			 */
			case TOPIC_GET_DATA: {
				const {key, byIds} = action.payload;
				if (['gallery', 'news'].indexOf(key) === -1)
					return state;

				for (const aid in byIds) {
					byIds[aid].ignore = 'none';
				}

				return merge({}, state,
					{activityPool: byIds}
				);
			}
			/**
			 * 社團文章管理 標記
			 * @type {Object}
			 */
			case CHECK_ACTIVITY: {
				const newState = {
					...state
				};
				const { aid } = action;
				newState.activityPool[aid].checked = !newState.activityPool[aid].checked;
				newState.activityPool[aid] = {...newState.activityPool[aid]};

				return newState;
			}
			/**
			 * 社團文章管理 刪除中
			 */
			case DELETING_ACTIVITIES: {
				const newState = {
					...state
				};
				const {aidList} = action;

				aidList.map((aid) => {
					newState.activityPool[aid].loading = false;
					newState.activityPool[aid] = {...newState.activityPool[aid]};
				});

				return newState;
			}
			/**
			 * 社團文章管理 刪除成功
			 */
			case DELETE_ACTIVITY_SUCCESS: {
				const newState = {
					...state
				};
				const {channelId, aidList} = action;
				const dataList = newState.personalStream.GROUP[channelId].dataList.filter(aid => aidList.indexOf(aid) === -1);
				const filteredPool = omit(state.activityPool, aidList);

				newState.personalStream.GROUP[channelId].dataList = dataList;
				newState.personalStream.GROUP[channelId] = {...newState.personalStream.GROUP[channelId]};
				newState.activityPool = {...filteredPool};

				return newState;
			}
			/**
			 * 社團文章管理 刪除失敗
			 */
			case DELETE_ACTIVITY_ERROR: {
				const newState = {
					...state
				};
				const {channelId, aidList} = action;

				aidList.map((aid) => {
					newState.activityPool[aid].checked = false;
					newState.activityPool[aid].loading = false;
					newState.activityPool[aid].error = true;
				});

				newState.activityPool = {...filteredPool};

				return newState;
			}
			/**
			 * 返回預設
			 */
			default:
				return {...state};
		}
	}catch (e) {
		console.log(e);
		return {...state};
	}
}
