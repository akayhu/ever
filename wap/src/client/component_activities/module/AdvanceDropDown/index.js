import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import { hasIn, get } from 'lodash/object';

import SubmitButton from 'src/client/component_activities/module/SubmitButton';

// actions

import {
	deleteArticle,
	deleteGallery,
	subscribeUnsubscribe,
	activityLightboxOpen,
	ignoreActivity,
	notInterested
} from 'src/client/actions/activity';
import { accuseTrigger } from 'src/client/actions/accuse';
import { deleteActivity } from 'src/client/actions/group';
import { triggerSubscribeMedia } from 'src/client/actions/channel';
import { activityEventLog } from 'src/client/actions/activity/activityLog.js';

class AdvanceDropDown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			confirmDeleteLightBox: false,
			isSubmit: false
		};
		
		this.config = {};
		// 不管頻道或社團 只要以下值其一為true，就是admin權限
		this.isAdmin = props.isAdmin || props.isHead || props.isEditor ? 'isAdmin' : 'notAdmin';
		this.isBlock = props.itemData.userInfo.connectionStatus === 4 ? 'isBlock' : 'notBlock';

		// 此篇activity為何種類型
		// person group channel
		this.activityType = '';
		this.hasChannelInfo = (!props.inChannel && props.itemData.channelId !== null && typeof (props.itemData.channelId) !== 'undefined');
		if (this.hasChannelInfo) {
			if (props.itemData.channelInfo.type === 10) {
				this.activityType = 'channel';
			} else if (props.itemData.channelInfo.type === 7 || props.itemData.channelInfo.type === 8) {
				this.activityType = 'group';
			}
		} else {
			this.activityType = 'person';
		}

		// 顯示規則： http://jira.104.com.tw/browse/BIGC-1569
		// line的顯示規則就是 好的跟壞 的區分線
		this.showModal = {
			stream: {
				CHANNEL: {
					isAdmin: ['editable'],
					notAdmin: ['allHide']
				},
				GROUP: {
					isAdmin: {
						isBlock: ['accuse', 'removeGroupActivity'],
						notBlock: ['toggleSubscribe', 'endorse', 'accuse', 'removeGroupActivity', 'line']
					},
					notAdmin: ['toggleSubscribe', 'endorse', 'accuse', 'line']
				},
				HOT: {
					person: ['toggleSubscribe', 'endorse', 'notInterestedForActivity', 'notInterestedForPerson', 'accuse', 'line'],
					group: {
						isAdmin: ['editable'],
						notAdmin: {
							isBlock: ['allHide'],
							notBlock: ['toggleSubscribe', 'endorse', 'notInterestedForActivity', 'accuse', 'line']
						}
					},
					channel: {
						isAdmin: ['editable'],
						notAdmin: ['notInterestedForActivity']
					}
				},
				NEW: {
					person: ['toggleSubscribe', 'endorse', 'notInterestedForActivity', 'notInterestedForPerson', 'accuse', 'line'],
					group: {
						isAdmin: ['editable'],
						notAdmin: {
							isBlock: ['allHide'],
							notBlock: ['toggleSubscribe', 'endorse', 'notInterestedForActivity', 'accuse', 'line']
						}
					},
					channel: {
						isAdmin: ['editable'],
						notAdmin: ['notInterestedForActivity']
					}
				},
				ALL: {
					person: ['toggleSubscribe', 'endorse', 'accuse', 'line'],
					group: {
						isAdmin: ['editable'],
						notAdmin: {
							isBlock: ['allHide'],
							notBlock: ['toggleSubscribe', 'endorse', 'accuse', 'line']
						}
					},
					channel: {
						isAdmin: ['editable'],
						notAdmin: ['allHide']
					}
				}
			},
			singlePage: {
				person: {
					isBlock: ['allHide'],
					notBlock: ['toggleSubscribe', 'endorse', 'accuse', 'line']
				},
				group: {
					isBlock: ['allHide'],
					notBlock: ['toggleSubscribe', 'endorse', 'accuse', 'line']
				},
				channel: {
					isAdmin: ['editable'],
					notAdmin: ['toggleSubscribe', 'endorse', 'accuse', 'line']
				}
			},
			lightbox: {
				person: {
					isBlock: ['allHide'],
					notBlock: ['toggleSubscribe', 'endorse', 'accuse', 'line']
				},
				group: {
					isAdmin: {
						isBlock: ['accuse', 'removeGroupActivity'],
						notBlock: ['toggleSubscribe', 'endorse', 'accuse', 'removeGroupActivity', 'line']
					},
					notAdmin: {
						isBlock: ['allHide'],
						notBlock: ['toggleSubscribe', 'endorse', 'accuse', 'line']
					}
				},
				channel: {
					isAdmin: ['editable'],
					notAdmin: ['allHide']
				}
			}
		};

		this.showComponent();

		this.switchDeleteLightbox = this.switchDeleteLightbox.bind(this);
		this.triggerDelete = this.triggerDelete.bind(this);
		this.triggerSubscribe = this.triggerSubscribe.bind(this);
		this.triggerLightboxOpenForEndorse = this.triggerLightboxOpenForEndorse.bind(this);
		this.triggerIgnore = this.triggerIgnore.bind(this);
		this.triggerNotInterested = this.triggerNotInterested.bind(this);
		this.triggerAccuse = this.triggerAccuse.bind(this);
		this.triggerRemoveFromGroup = this.triggerRemoveFromGroup.bind(this);
		this.triggerLog = this.triggerLog.bind(this);
		this.showComponent = this.showComponent.bind(this);
		this.tryKeys = this.tryKeys.bind(this);
	}
	switchDeleteLightbox() {
		this.setState({
			confirmDeleteLightBox: !this.state.confirmDeleteLightBox
		});
	}
	triggerDelete() {
		const {itemData, handleDeleteActivity, deleteArticle, deleteGallery} = this.props;
		if (typeof handleDeleteActivity === 'function') handleDeleteActivity();

		this.setState({ isSubmit: true });

		if (itemData.extra.hasOwnProperty('source') && itemData.extra.source === 'gallery') {
			// const params = {};
			// params.pid = itemData.userInfo.pid;
			// params.galleryId = itemData.aid;

			deleteGallery(itemData).then(() => {
				this.setState({ isSubmit: false });
				this.switchDeleteLightbox();
				this.props.handleDelete();
			});
		} else {
			deleteArticle(itemData).then(() => {
				this.setState({ isSubmit: false });
				this.switchDeleteLightbox();
				// this.props.handleDelete();
			});
		}
	}
	triggerSubscribe() {
		const {itemData, handleSubscribe, subscribeUnsubscribe} = this.props;
		if (typeof handleSubscribe === 'function') handleSubscribe();
		subscribeUnsubscribe(itemData);
	}
	triggerLightboxOpenForEndorse() {
		const {itemData, handleLightboxOpen, activityLightboxOpen} = this.props;
		if (typeof handleLightboxOpen === 'function') handleLightboxOpen();
		activityLightboxOpen(itemData);
	}
	triggerLog(txt) {
		const clickActivityLog = {
			pid: this.props.userPid,
			page: this.props.pageName,
			filter: this.props.filterName,
			event: txt
		};
		activityEventLog(this.props.itemData, clickActivityLog);
	}
	triggerIgnore() {
		const {itemData, handleIgnore, ignoreActivity} = this.props;
		if (typeof handleIgnore === 'function') handleIgnore();
		ignoreActivity(itemData);
		this.triggerLog('rejectActivity');
	}
	triggerNotInterested() {
		const {itemData, handleNotInterested, notInterested} = this.props;
		if (typeof handleNotInterested === 'function') handleNotInterested();
		notInterested(itemData);
		this.triggerLog('rejectPeople');
	}
	triggerAccuse() {
		const {itemData, handleAccuse, accuseTrigger} = this.props;
		if (typeof handleAccuse === 'function') handleAccuse();
		accuseTrigger('activity', itemData);
	}
	triggerRemoveFromGroup() {
		const {itemData: {channelId, aid}, handleRemove, deleteActivity} = this.props;
		if (typeof handleRemove === 'function') handleRemove();
		this.setState({ isSubmit: true });
		deleteActivity({channelId, aidList: [aid]});
		this.setState({ isSubmit: false });
	}
	tryKeys(...theArgs) {
		const keyArray = [];
		for (const key of theArgs) {
			// 將照傳入theArgs的陣列照順序去試是否再showModal裡面有此路徑
			keyArray.push(key);
			if (!hasIn(this.showModal, keyArray)) {
				// 如果嘗試有的時候將刪除最後一筆，因為嘗試是否有key值前會先組合此路徑，當此路徑為false時回覆正確路徑
				keyArray.pop();
			}
		}
		// 將路徑傳入取得config
		this.config = get(this.showModal, keyArray);
	}
	showComponent() {
		/*
			要掌握一個原則，showModal上的key值順序，所以路徑都要按照以下
			mode => category => activityType => isAdmin => isBlock
			可隨意將任意值抽掉，但先後順序不能改變，依照BIGC-1569身份優先順序
			「文章作者 > 社團管理者 > 黑名單」
			所以未來若有必須先判斷黑名單再判斷管理者之類的，只能拍拍你了，請重寫呵呵
		*/
		switch (this.props.mode) {
			// 請看下方propTypes上簡介值
			case 'stream': {
				this.tryKeys(this.props.mode, this.props.category, this.activityType, this.isAdmin, this.isBlock);
				break;
			}
			case 'singlePage': {
				this.tryKeys(this.props.mode, this.activityType, this.isAdmin, this.isBlock);
				break;
			}
			case 'lightbox': {
				this.tryKeys(this.props.mode, this.activityType, this.isAdmin, this.isBlock);
				break;
			}
			default:
				break;
		}
	}
	render() {
		const { author, itemData, handleEdit } = this.props;
		const deleteLightboxOption = {
			closeIcon: true,
			title: '確認刪除文章'
		};
		const deleteAction = author ? this.triggerDelete : this.triggerRemoveFromGroup;
		const dataGtmActivity = author ? '刪除文章' : '移出社團';
		const subscribeText = itemData.userInfo.subscribeStatus ? '取消關注他' : '關注他';
		// 當是allHide時，三角形也不該出現
		if (this.config.indexOf('allHide') !== -1) return null;
		return (
			<div>
				<DropdownMenu>
					<DropdownTarget>
						<i className="dropdown icon" />
					</DropdownTarget>
					<DropdownList>
						{
							(author || this.showComponent('editable')) && !itemData.extra.hasOwnProperty('source') &&
							<ul className="dropdown">
								<li onClick={ handleEdit }>編輯文章</li>
								<li onClick={ this.switchDeleteLightbox }>刪除文章</li>
							</ul>
						}
						{
							author && itemData.extra.hasOwnProperty('source') && itemData.extra.source === 'gallery' &&
							<ul className="dropdown">
								<li onClick={ handleEdit }>編輯作品</li>
								<li onClick={ this.switchDeleteLightbox }>刪除作品</li>
							</ul>
						}
						{
							!author &&
							<ul className="dropdown" styleName="stream_ul">
								{
									this.config.indexOf('toggleSubscribe') !== -1 &&
									<li onClick={	this.triggerSubscribe }>
										{ subscribeText }
									</li>
								}
								{
									this.config.indexOf('endorse') !== -1 &&
									<li onClick={ this.triggerLightboxOpenForEndorse } data-gtm-endorse="肯定這篇文章">
										肯定這篇文章
									</li>
								}
								{
									this.config.indexOf('line') !== -1 &&
									<div styleName="line" />
								}
								{
									this.config.indexOf('removeGroupActivity') !== -1 &&
									<li onClick={ this.switchDeleteLightbox }>
										將這篇文章移出社團
									</li>
								}
								{
									this.config.indexOf('notInterestedForActivity') !== -1 &&
									<li onClick={ this.triggerIgnore } data-gtm-activity="對文章沒興趣">
										對這篇文章沒興趣
									</li>
								}
								{
									this.config.indexOf('notInterestedForPerson') !== -1 &&
									<li onClick={ this.triggerNotInterested } data-gtm-activity="對會員沒興趣">
										對他的文章沒興趣
									</li>
								}
								{
									this.config.indexOf('accuse') !== -1 &&
									<li onClick={ this.triggerAccuse }>
										檢舉這篇文章
									</li>
								}
							</ul>
						}
					</DropdownList>
				</DropdownMenu>
				{
					this.state.confirmDeleteLightBox &&
					<LightBox option={ deleteLightboxOption } onClose={ this.switchDeleteLightbox }>
						<div>{author ? '請問確定要刪除此文章?' : '請問確定要將這篇文章移出社團'}</div>
						<SubmitButton
							onClick={ deleteAction.bind(this) }
							isLoading={ this.state.isSubmit }
							dataGtmActivity={ dataGtmActivity }
							buttonValue={ '確定' }
						/>
						<button onClick={ this.switchDeleteLightbox.bind(this) }>{ '取消' }</button>
					</LightBox>
				}
			</div>
		);
	}
}

AdvanceDropDown.defaultProps = {
	isAdmin: false,
};

AdvanceDropDown.propTypes = {
	author: PropTypes.bool.isRequired,
	/*
	 開啟的模式
	 singlePage： 獨立頁
	 stream: 河道上顯示
	 lightbox： 跳出的視窗
	*/
	mode: PropTypes.string.isRequired,
	/*
		只有當mode為stream時(是從其中ㄧ個河道點擊的)才會有category

		CHANNEL： 從頻道頁的河道來的
		GROUP： 從社團頁的河道的
		NEW： 首頁河道選擇最新動態
		HOT： 首頁河道選擇熱門動態
		ALL： 首頁河道選擇訂閱的動態
	*/
	category: PropTypes.string,
	// 頻道河道 與 社團河道會有 isAdmin
	isAdmin: PropTypes.bool,
	// 頻道河道 會有 isEditor (小編)
	isEditor: PropTypes.bool,
	// 社團河道 會有 isHead (團長)
	isHead: PropTypes.bool,
	itemData: PropTypes.object.isRequired,
	handleEdit: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleDeleteActivity: PropTypes.func,
	handleSubscribe: PropTypes.func,
	handleLightboxOpen: PropTypes.func,
	handleIgnore: PropTypes.func,
	handleNotInterested: PropTypes.func,
	handleAccuse: PropTypes.func,
};

const actions = {
	deleteArticle,
	subscribeUnsubscribe,
	activityLightboxOpen,
	ignoreActivity,
	notInterested,
	accuseTrigger,
	deleteGallery,
	deleteActivity
};

export default compose(
	connect(null, actions),
	translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(AdvanceDropDown);
