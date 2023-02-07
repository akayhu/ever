import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import css from './index.css';
import compose from 'src/util/compose';
// action
import {
	updateEndorseDesc,
	deleteEndorse,
	deleteEndorseInState,
	removeEndorseForUser,
	removeEndorseForUserInState,
	addEndorseForUser,
	addEndorseForUserInState,
	getEndorseUserList,
	initEndorseUserList,
	getEndorseList,
	getEndorseSortList
} from 'src/client/actions/endorse';
import { loadProfile } from 'src/client/actions/profile';
import { createFromPromotion } from 'src/client/actions/global';
//  components
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import EndorseListNameCard from './endorseListNameCard';
import EndorsePanel from './endorsePanel';
import UserInfoItem from './userInfoItem';
import MyShelfies from './myShelfies';


class EndorseItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lightboxLook: false,
			lightboxDel: false,
			lightboxUser: false,
			lightboxLock: false,
			loading: false,
			isEdit: false,
			lightboxOption: {},
			done: false,
			deleteMessage: '確定要刪除這筆專長特質與證照？'
		};
		this.handleLookEndorse = this.handleLookEndorse.bind(this);
		this.handleLightBoxSubmit = this.handleLightBoxSubmit.bind(this);
		this.handleLightBoxCancel = this.handleLightBoxCancel.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handlePanelSubmit = this.handlePanelSubmit.bind(this);
		this.handlePanelCancel = this.handlePanelCancel.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleDeleteUser = this.handleDeleteUser.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
		this.handleShowUser = this.handleShowUser.bind(this);
		this.handleAddEndorse = this.handleAddEndorse.bind(this);
		this.handleMinusEndorse = this.handleMinusEndorse.bind(this);
		this.loadMore = this.loadMore.bind(this);
		this.setUserInfo = this.setUserInfo.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.isEdit) {
			this.setState({isEdit: false});
		}
	}

	handleEdit() {
		this.setState({isEdit: true});
		this.props.createBoxHide(); // 把新增的EndorsePanel關閉
	}

	handlePanelCancel() {
		this.setState({isEdit: false});
	}

	handleShowUser(e) {
		e.preventDefault();
		this.setState({loading: true});
		const {getEndorseUserList, pid, userPid, item, initEndorseUserList, endorseUserList} = this.props;
		if (this.state.done) {
			this.setUserInfo();
			return;
		}
		getEndorseUserList({
			targetPid: pid,
			pid: userPid,
			item,
			limit: 10,
			offset: endorseUserList.item ? endorseUserList.item.offset : 0
		}).then((res) => {
			const { dataList, hasNext, offset, total } = res.response;
			initEndorseUserList({item, offset, total, hasNext, dataList});
			this.setUserInfo();
		});
	}
	setUserInfo() {
		this.setState({
			lightboxUser: true,
			lightboxOption: {
				title: `肯定${this.props.userName}【${this.props.item}】能力的人`,
				closeIcon: true
			},
			loading: false
		});
	}
	loadMore() {
		const {getEndorseUserList, pid, userPid, item, initEndorseUserList, endorseUserList} = this.props;
		if (this.state.loading) return;
		if (!endorseUserList[item].hasNext) {
			this.setState({ done: true });
			return;
		}
		this.setState({loading: true});
		getEndorseUserList({
			targetPid: pid,
			pid: userPid,
			item,
			limit: 10,
			offset: endorseUserList[item] ? endorseUserList[item].offset : 0
		}).then((res) => {
			const { dataList, hasNext, offset, total } = res.response;
			initEndorseUserList({item, offset, total, hasNext, dataList});
			this.setState({loading: false});
		});
	}

	handleLookEndorse(e) {
		e.preventDefault();
		const { userName, item } = this.props;
		this.setState({
			lightboxLook: true,
			lightboxOption: {
				title: `${userName}對於【${item}】的自我描述`,
				closeIcon: true
			}
		});
	}

	handleLightBoxSubmit() {
		this.setState({
			lightboxLook: false,
			lightboxDel: false
		});
	}

	handleLightBoxCancel() {
		this.setState({
			lightboxLook: false,
			lightboxDel: false,
			lightboxUser: false,
			lightboxLock: false,
			deleteMessage: '確定要刪除這筆專長特質與證照？'
		});
	}

	handleDelete() {
		this.setState({
			lightboxDel: true,
			lightboxOption: {
				submit: {
					text: '確定',
					action: this.confirmDelete.bind(this)
				},
				cancel: {
					text: '取消',
					action: this.handleLightBoxCancel.bind(this)
				},
			}
		});
	}

	confirmDelete() {
		const {srcUserInfo} = this.props;
		if (srcUserInfo.length === 0) {
			this.handleDeleteEndorse(false);
		} else {
			this.setState({
				lightboxOption: {
					submit: {
						text: '保留',
						action: this.handleDeleteEndorse.bind(this, false)
					},
					cancel: {
						text: '刪除',
						action: this.handleDeleteEndorse.bind(this, true)
					},
				},
				deleteMessage: '是否要保留肯定此專長特質與證照的人物？下次新增同樣項目時，系統會自動幫您帶回這些資料'
			});
		}
	}

	handlePanelSubmit({ desc }) {
		const { updateEndorseDesc, pid, item } = this.props;
		updateEndorseDesc({	pid, item, desc	}).then(() => {
			this.setState({	isEdit: false	});
		});
	}
	handleDeleteEndorse(delSource = false) {
		const {
			pid,
			userPid,
			item,
			getEndorseList,
			getEndorseSortList,
			deleteEndorse,
			deleteEndorseInState,
			loadProfile,
			createFromPromotion,
			toggleLoading
		} = this.props;
		toggleLoading(true);
		deleteEndorse({	pid, item, delSource }).then((res) => {
			if (res.response === true) {
				getEndorseList({
					targetPid: pid,
					pid: userPid,
					limit: this.props.dataLength,
					offset: 0,
					avatarLimit: 5
				}).then(() => {
					toggleLoading(false);
				});
				getEndorseSortList({ pid });
				deleteEndorseInState({item});
				createFromPromotion('none');
				loadProfile({ pid });
			}
		});
		this.setState({
			lightboxDel: false,
			deleteMessage: '確定要刪除這筆專長特質與證照？'
		});
	}

	handleDeleteUser({creator}) {
		const { item, pid, removeEndorseForUser, removeEndorseForUserInState, interactionLock } = this.props;
		if (interactionLock > 0) {
			this.setState({lightboxLock: true});
			return;
		}
		removeEndorseForUser({
			targetPid: pid,
			item,
			pid: creator
		}).then(() => {
			removeEndorseForUserInState({
				item,
				pid: creator
			});
		});
	}

	handleAddEndorse() {
		const { pid, userPid, item, addEndorseForUser, addEndorseForUserInState, interactionLock } = this.props;
		if (interactionLock > 0) {
			this.setState({lightboxLock: true});
			return;
		}
		addEndorseForUser({
			targetPid: pid,
			item,
			pid: userPid
		}).then((res) => {
			if (res.response.hasOwnProperty('pid')) {
				addEndorseForUserInState({ item	});
			}
		});
	}

	handleMinusEndorse() {
		const {userPid} = this.props;
		this.handleDeleteUser({creator: userPid});
	}

	toggleOpen() {}
	render() {
		const { item, count, srcUserInfo, userName, desc, viewas, userPid, endorseUserList, endorsed, avatarWebUrl } = this.props;
		const interactionOption = {
			submit: {
				text: '確定',
				action: this.handleLightBoxCancel
			},
			closeIcon: true
		};
		return (
			<div>
				{ !this.state.isEdit
					?	<dd styleName="endorse_item">
						{ desc
								?	<span
									styleName="content_left"
									style={ { cursor: 'pointer' } }
									onClick={ this.handleLookEndorse }
									title={ item }
								>
									{ item }
									<i className="detail outline icon" />
								</span>
								:	<span
									styleName="content_left"
									title={ item }
								>
									{ item }
								</span>
							}
						<span styleName="content_right">
							<a href="javascript: void(0);" className="body_text" styleName="count" onClick={ this.handleShowUser }>
								{ count > 1000 ? '999+' : count || 0 }
							</a>
							{ srcUserInfo.map((obj, key) => {
								key < (viewas === 'self' ? 5 : 4)
									? <EndorseListNameCard
										key={ key }
										myPid={ obj.pid }
										url={ `/profile/${obj.pid}` }
										avatarWebUrl={ obj.avatarWebUrl }
										{ ...obj }
									/>
									: null;
							})
							}
							{	(viewas !== 'self' && userPid !== -3) &&
								<MyShelfies
									selfImg={ avatarWebUrl }
									endorsed={ endorsed }
									handleAddEndorseForUser={ this.handleAddEndorse }
									handleDeleteEndorseForUser={ this.handleMinusEndorse }
								/>
							}
							{/* {	viewas === 'self' &&
								<DropdownMenu toggleOpen={ this.toggleOpen.bind(this) } styleName="ui_edit_font_size">
									<DropdownTarget>
										<i className="edit icon" />
									</DropdownTarget>
									<DropdownList >
										<ul className="dropdown">
											<li onClick={ this.handleEdit }>
												<i />
														編輯
													</li>
											<li onClick={ this.handleDelete }>
												<i />
														刪除
													</li>
										</ul>
									</DropdownList>
								</DropdownMenu>
							} */}
						</span>
					</dd>
					: <EndorsePanel
						isEdit={ this.state.isEdit }
						username={ userName }
						title={ item }
						desc={ desc || '' }
						viewas={ viewas }
						handleSubmit={ this.handlePanelSubmit }
						handleCancel={ this.handlePanelCancel }
					/>
				}
				{/* LightBox顯示肯定敘述*/}
				{ this.state.lightboxLook &&
					<LightBox option={ this.state.lightboxOption } onClose={ this.handleLightBoxCancel }>
						<div styleName="look_desc">
							{desc}
						</div>
					</LightBox>
				}
				{/* LightBox顯示刪除訊息*/}
				{ this.state.lightboxDel &&
					<LightBox option={ this.state.lightboxOption } onClose={ this.state.lightboxOption.cancel.action }>
						<div>{this.state.deleteMessage}</div>
					</LightBox>
				}
				{/* LightBox顯示User*/}
				{ this.state.lightboxUser &&
					<LightBox option={ this.state.lightboxOption } onClose={ this.handleLightBoxCancel }>
						<LazyLoading loadingAct={ this.loadMore }>
							<div styleName="user_list">
								{ endorseUserList[item].dataList.map((obj, key) => (
									<UserInfoItem
										key={ key }
										url={ `/profile/${obj.pid}` }
										viewas={ viewas }
										handleDelete={ this.handleDeleteUser }
										{ ...obj }
									/>
								))}
								{
									this.state.loading &&
									<div className="ui loading">&nbsp;</div>
								}	
							</div>
						</LazyLoading>
					</LightBox>
				}
				{ this.state.lightboxLock &&
					<LightBox option={ interactionOption } onClose={ this.handleLightBoxCancel }>
						<div className="h3">
						預覽模式不提供使用
						</div>
					</LightBox>
				}
			</div>
		);
	}
}

EndorseItem.propTypes = {
	count: PropTypes.number,
	creator: PropTypes.number,
	desc: PropTypes.string,
	item: PropTypes.string,
	pid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	srcUserInfo: PropTypes.array,
	endorsed: PropTypes.bool,
	type: PropTypes.string,
	userName: PropTypes.string,
	viewas: PropTypes.string,
	updateEndorseDesc: PropTypes.func,
	deleteEndorse: PropTypes.func,
	removeEndorseForUser: PropTypes.func,
	createBoxHide: PropTypes.func,
	toggleLoading: PropTypes.func
};

const mapStateToProps = state => ({
	endorseUserList: state.endorse.endorseUserList,
});
const actions = {
	updateEndorseDesc,
	deleteEndorse,
	removeEndorseForUser,
	removeEndorseForUserInState,
	deleteEndorseInState,
	addEndorseForUser,
	addEndorseForUserInState,
	getEndorseUserList,
	initEndorseUserList,
	loadProfile,
	createFromPromotion,
	getEndorseList,
	getEndorseSortList
};

export default compose(
	connect(mapStateToProps, actions),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(EndorseItem);
