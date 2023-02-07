import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { has } from 'lodash/object';
// actions
import { viewAs, getUserInfo } from 'src/client/actions/profile';
import { loadDataByCategory, block, getConnectionStatus} from 'src/client/actions/connection';
// components
import { TextField, LightBox } from 'c_wap_module';
import AddBlockAlert from './addBlockAlert';
import RemoveblockAlert from './removeBlockAlert';
import Alert from './alert';

import $ from 'jquery';

class BlockPrivacy extends Component {
	constructor(props) {
		super(props);
		this.state = {
			targetPid: '',
			loading: false,
			showAddBlock: false,
			showMore: false,
			showLightbox: false,
			removeIndex: 0,
			lightboxStatus: '',
			lightboxTitle: '',
			closeIcon: '',
			blockItem: {},
			errorMessage: '',
		};
	}
	componentWillMount() {
		this.props.loadDataByCategory('blockListItem');
		// 從其他地方黑名單之後直接自動開啟編輯狀態
		if (has(this.props.location.state, 'autoOpenEditor')) {
			this.setState(
				{
					showAddBlock: true
				},
				() => this.blockEditSection.scrollIntoView()
			);
		}
	}
	componentDidUpdate(prevProps, { showAddBlock }) {
		// 當開啟黑名單編輯時滾至定點
		if (this.state.showAddBlock !== showAddBlock) {
			this.blockEditSection.scrollIntoView();
		}
	}
	setTargetPid(key, value) {
		// 當onChange 及 onBlur時吃值
		this.setState({
			targetPid: value
		});
	}
	openAddBlockSection() {
		// 擋住隱身狀態
		// const { privacy, pid, handleStealthLockShow } = this.props;
		// if (has(privacy, pid) && privacy[pid].identity.code === 201) {
		// 	handleStealthLockShow();
		// 	return;
		// }
		this.setState({
			showAddBlock: true
		});
	}
	openMore() {
		this.setState({
			showMore: true
		});
	}
	blockSet() {
		const connectionStatusApi = $.get(`/ajax/connection/getConnectionStatus?targetPid=${this.state.targetPid}`, (res) => {
			this.state.blockItem.connectionStatus = res.response;
		});
		const	nameCardApi = $.get(`/ajax/profile/profileNameCard/getNameCard?pid=${this.props.pid}&targetPid=${this.state.targetPid}`, (res) => {
			this.state.blockItem.nameCard = res.response;
		});
		const	userInfoApi = $.get(`/ajax/profile/profilePersonal/getUserInfo?pid=${this.props.pid}&targetPid=${this.state.targetPid}`, (res) => {
			this.state.blockItem.userInfo = res.response;
		});
		$.when(connectionStatusApi, nameCardApi, userInfoApi).then(() => {
			let lightboxTitle = '';
			let lightboxStatus = '';

			// 為不存在使用者
			if (this.state.blockItem.userInfo === null) {
				lightboxTitle = null;
				lightboxStatus = 'notFound';
			}

			if (this.state.blockItem.userInfo !== null) {
				// connectionStatus 0=無、1=邀請中、2=待審核、3=朋友、4=封鎖
				// 已為黑名單
				if (this.state.blockItem.connectionStatus[this.state.targetPid].connectionStatus === 4) {
					lightboxTitle = null;
					lightboxStatus = 'alreadyIsBlock';
				} else {
					// 可以加入黑名單
					lightboxTitle = `你確定要把${this.state.blockItem.nameCard.userName}加入黑名單嗎？`;
					lightboxStatus = 'addBlock';
				}
			}

			this.setState({
				showLightbox: true,
				closeIcon: false,
				lightboxTitle,
				lightboxStatus,
				loading: false,
				blockItem: this.state.blockItem // 怕了吧ㄏㄏ
			});
		});
	}
	handleLightBoxOpen(title, index, event, name) {
		if (title === 'addBlock') {
			// 防止按下enter後去載入action的url 拿來做form表單按下enter即送出的onSubmit事件
			event.preventDefault();
		}
		this.setState({loading: true});
		switch (title) {
			// 開啟 新增黑名單前的警告
			case 'addBlock':
				// 擋空值狀態
				if (!this.state.targetPid) {
					this.setState({
						errorMessage: '欄位不得為空',
						loading: false
					});
					return;
				}
				this.blockSet();
				break;
			// 開啟 刪除黑名單前的警告
			case 'removeBlock':
				this.setState({
					removeIndex: index,
					showLightbox: true,
					closeIcon: true,
					lightboxStatus: title,
					lightboxTitle: `你確定把 ${name} 從黑名單移除嗎？`,
					loading: false
				});
				break;
			default:
				break;
		}
	}
	handleOnClose() {
		// 關閉lightbox
		this.setState({
			showLightbox: false,
			errorMessage: '',
			targetPid: '',
			loading: false,
		});
	}
	handleOnSubmit(value, targetPid) {
		// 新增黑名單 或 刪除黑名單
		this.setState({loading: true});
		this.props.block({
			pid: this.props.pid,
			targetPid,
			blockStatus: value
		}).then(() => {
			this.props.loadDataByCategory('blockListItem', {offset: 0});
			this.handleOnClose();
		});
	}
	render() {
		const lightboxOption = {
			closeIcon: this.state.closeIcon, // 有無close ICON
			contentHeight: '600px', // 決定content區塊有無最小高度，有設定的話會出現scroll bar
			title: this.state.lightboxTitle
		};
		return (
			<div styleName="block">
				<div styleName="block_desc_conatiner">
					<div styleName={ this.state.showMore ? '' : 'max_height' }>
						<p styleName="title">黑名單</p>
						<ul styleName="desc">
							<li>設定黑名單後只有自己會看見，也不會發送任何通知給對方或你的朋友們。</li>
							<li>不會在首頁或推廌內容看到對方的動態、文章，對方也會從你的好友名單中移除。</li>
							<li>但是以下情境你仍有可能看到對方發表的內容：</li>
						</ul>
						<ol styleName="desc_more">
							<li>你們加入了同一個社團<br />
								你不會收到任何通知，但在社團中仍看得到他的文章和留言。
							</li>
							<li>對方在其他的文章中互動<br />
								你仍看得到他的留言互動。如果你在文章留言，對方隨後也同篇文章留言時<br />
								你將不會收到相關通知，但回該篇文章你仍可看到他留言的內容。
							</li>
							<li>你的朋友把對方加入聊天室<br />
								因為其他朋友不會知道你的黑名單有誰，可能會出現朋友在不知情的情況下<br />
								把你加入黑名單的會員加入聊天室。
							</li>
						</ol>
						{
							!this.state.showMore &&
							<button
								className="ui labeled button"
								styleName="more"
								onClick={ this.openMore.bind(this) }
							>
								更多
							</button>
						}
					</div>
					{
						!this.state.showAddBlock &&
						<button styleName="edit" onClick={ this.openAddBlockSection.bind(this) }>編輯</button>
					}
				</div>
				{
					this.state.showAddBlock &&
					<div ref={ (i) => { this.blockEditSection = i; } }>
						<div styleName="block_add_container">
							<p styleName="title">黑名單對象</p>
							<form
								styleName="block_form"
								onSubmit={ event => this.handleLightBoxOpen('addBlock', 0, event) }
							>
								<TextField
									name="editor"
									styleName="block_input"
									allowMultiLine={ false }
									value={ this.state.targetPid }
									onBlur={ this.setTargetPid.bind(this) }
									onChange={ this.setTargetPid.bind(this) }
									placeHolder="請輸入對方的會員編號"
									errorMessage={ this.state.errorMessage }
								/>
								<button
									className={ `ui primary button ${this.state.loading ? 'loading' : ''}` }
									styleName="block_btn"
									type="submit"
								>
									加入
								</button>
							</form>
							<div styleName="example">
								會員編號範例：https:&#47;/plus.104.com.tw/
								<span styleName="number">12345678</span>
							</div>
							<div styleName="block_lists_container">
								<p styleName="title">已加入黑名單：</p>
								{
									this.props.blockListItem.dataList &&
									<div styleName="lists">
										<dl>
											{
												this.props.blockListItem.dataList.map((item, index) => (
													<dd key={ `block-${item.pid}` }>
														{ `${item.name} (${item.pid})` }
														<button
															className="ui labeled button"
															styleName="remove"
															onClick={ this.handleLightBoxOpen.bind(this, 'removeBlock', index, '', item.name) }
														>
															移除
														</button>
													</dd>
												))
											}
											{
												(this.props.blockListItem.loading && this.props.blockListItem.dataList.length !== 0) &&
												<i className="ui loading" styleName="lists_loading" />
											}
										</dl>
									</div>
								}
							</div>
						</div>
					</div>
				}
				{
					this.state.showLightbox &&
					<LightBox option={ lightboxOption } onClose={ this.handleOnClose.bind(this) }>
						{
							this.state.lightboxStatus === 'addBlock' &&
							<AddBlockAlert
								pid={ this.props.pid }
								targetPid={ this.state.blockItem.nameCard.pid }
								userName={ this.state.blockItem.nameCard.userName }
								avatarWebUrl={ this.state.blockItem.nameCard.avatarWebUrl }
								connect={ this.state.blockItem.nameCard.connectionStatus }
								handleOnClose={ this.handleOnClose.bind(this) }
								haveDoubleLightbox={ false }
							/>
						}
						{ this.state.lightboxStatus === 'removeBlock' &&
							<RemoveblockAlert
								dataList={ this.props.blockListItem.dataList[this.state.removeIndex] }
								loading={ this.state.loading }
								handleOnSubmit={ this.handleOnSubmit.bind(this) }
								handleOnClose={ this.handleOnClose.bind(this) }
							/>
						}
						{
							(this.state.lightboxStatus === 'alreadyIsBlock' || this.state.lightboxStatus === 'notFound') &&
							<Alert
								which={ this.state.lightboxStatus }
								targetPid={ this.state.targetPid }
								handleOnClose={ this.handleOnClose.bind(this) }
							/>
						}
					</LightBox>
				}
			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		pid: state.user.pid,
		blockListItem: state.connection.blockListItem,
	};
}

const actions = {
	loadDataByCategory,
	viewAs,
	getUserInfo,
	block,
	getConnectionStatus
};

export default compose(
		connect(mapStateToProps, actions),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(BlockPrivacy);
