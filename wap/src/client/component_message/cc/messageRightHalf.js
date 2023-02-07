import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import without from 'lodash/without';

// actions
import { loadDataByCategory, getChatList, newMessageWithFile, postMessage, clearChat } from 'src/client/actions/message';
import { getConnectionStatus } from 'src/client/actions/connection';
// selectors
import { getIsNewMessage, getIsLoading, getDataList, getReadingChatId } from 'src/client/reducers/message/selectors';
// components
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import ReplyPanel from './replyPanel';
import MessageList from './messageList';
// import DefaultView from './defaultView';
import Gear from './gearFunc';
import NewMessage from './newMessage';
import { LightBox } from 'c_wap_module';
import MemberList from './memberList';

class MessageRightHalf extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			lightbox: false,
			disableAction: false,
			blockMsg: false
		};

		this.content_main = null;
		this.currentContentHeight = 0;
		this.actionParameters = null;

		this.loadMsgData = this.loadMsgData.bind(this);
		this.loadMore = this.loadMore.bind(this);
		this.clearData = this.clearData.bind(this);
		this.sendMsg = this.sendMsg.bind(this);
		this.openLightBox = this.openLightBox.bind(this);
		this.handleLightBoxCancel = this.handleLightBoxCancel.bind(this);
		this.onChangeBlockStatus = this.onChangeBlockStatus.bind(this);

		this.renderMessageBlock = this.renderMessageBlock.bind(this);
		this.renderInitialBlock = this.renderInitialBlock.bind(this);
		this.renderCreateNewMessage = this.renderCreateNewMessage.bind(this);
		this.renderMainBlock = this.renderMainBlock.bind(this);
	}
	componentDidMount() {
		this.checkDisabled(this.props);
	}
	componentWillReceiveProps(nextProps) {
		
		if( !nextProps.isNewMessage && nextProps.readingChatId !== 0 ) {
			if( this.props.readingChatId !== nextProps.readingChatId ) {
				this.checkDisabled(nextProps);
				this.loadMsgData();
			}
			this.scrollToBottom();
		}
	}
	checkDisabled(props){
		const { chatData, chatRoomData } = props;
		const [targetPid] = chatRoomData.member.filter(i => i !== this.props.user.pid);
		const parameters = { targetPid };

		if( chatRoomData.member.length === 0 ) return false;

		if(chatRoomData.member.length > 2) {
			const authority = (chatData && chatData.length > 0 && chatData[0].authority) || chatRoomData.authority ;
			this.setState({ disableAction: !authority});
		}else {
			this.props.getConnectionStatus(parameters)
			.then((res) => {
				const { [targetPid]: { connectionStatus } } = res.response;
				this.setState({
					// disableAction: connectionStatus !== 3 ? true : excludeStatus
					disableAction: connectionStatus !== 3
				});
			});
		}

		
		
	}
	sendMsg(ccMsg, extra) {
		const { chatRoomData: { member }, postMessage, user: { pid }, chatData } = this.props;
		if(member.length === 0) {
			const myChatData = chatData.filter((object) => object.sid === parseInt(pid));
			var memberList = myChatData[0].rid.join(',');
		}else {
			var memberList = without(member, pid).join(',')
		}

		const parameters = {
			memberList: memberList,
			text: ccMsg,
			extraJson: JSON.stringify(extra)
		};

		return postMessage(parameters)
			.then(() => this.scrollToBottom());
	}
	loadMore() {

		/**
		 * 由於時程考量，loadmore的結構不佳導致容易產生bug 先行註解
		 */

		// const { chatData } = this.props;
		// // 這個判斷是因為，切換到不同訊息時`，因為還沒載入所以chatData會為空
		// // 會導致content_main觸發scroll到底端的事件
		// // 進而觸發loadMore
		// // 因此多加這個 chatData.length === 0 時就直接返回
		// if (!chatData.length) return;
		// this.actionParameters.count += 50;
		// setTimeout(() => this.loadMsgData(true), 500);
	}
	loadMsgData(byLoadMore = false) {
		const { loadDataByCategory } = this.props;
		this.setState({
			loading: true,
		});
		loadDataByCategory('chatList', {count: 1000})
			.then(() => this.setScrollPosition(byLoadMore));
	}
	setScrollPosition(keepPosition = true) {
		this.setState({
			loading: false,
		}, keepPosition ? this.keepScrollBarPos : this.scrollToBottom);
	}
	scrollToBottom() {
		if (!this.content_main) return;
		setTimeout(() => {
			const scrollHeight = this.content_main.scrollHeight;
			this.content_main.scrollTop = scrollHeight;
			this.currentContentHeight = scrollHeight;
		}, 50);
	}
	keepScrollBarPos() {
		if (!this.content_main) return;
		setTimeout(() => {
			const scrollHeight = this.content_main.scrollHeight;
			const postionShouldBe = scrollHeight - this.currentContentHeight;

			this.currentContentHeight = scrollHeight;

			if (this.content_main.scrollTop > postionShouldBe) return;

			this.content_main.scrollTop = postionShouldBe;
		}, 50);
	}
	clearData() {
		const {readingChatId, clearChat} = this.props;
		clearChat(readingChatId);
	}
	openLightBox() {
		this.setState({ lightbox: true });
	}
	handleLightBoxCancel() {
		this.setState({ lightbox: false });
	}
	onChangeBlockStatus(blockStatus){
		this.setState({
			disableAction: blockStatus
		})
	}
	/**
	 * Render Function
	 * 條件判斷比較複雜，將 template 抽離出來比較好維護
	 */
	renderMessageBlock() {
		const { loading, blockMsg, disableAction } = this.state;
		const { user, chatRoomData, chatData } = this.props;

		// 直接衝網址會沒有chatRoomData但會有chatData。要取得成員名稱資料一個用oname一個用rname
		// 成員名稱資料在chatRoomData裡的oname 或 chatData裡的rname
		// 最好是可以改整個架構QQ
		const {oname = []} = chatRoomData;
		const [{rname = []} = {}] = chatData.slice(-1); // 拿chatData陣列裡的最後一個item裡面的rname
		const memberInfo = oname.length > 0 ? oname : rname;
		
		return (
			<div>
				<div styleName="bccommunication_title_main">
					<Gear
						chatRoomData={chatRoomData}
						handleClearData={ this.clearData }
						blockMsg={disableAction}
						pid={this.props.user.pid}
						onChangeBlockStatus={this.onChangeBlockStatus}
					/>
					<div styleName="bccommunication_right_job_title">
						{memberInfo.length === 1 && memberInfo.join(',')}&nbsp;&nbsp;
						{memberInfo.length > 1 && `你、${memberInfo.join(',')}`}&nbsp;&nbsp;
						{memberInfo.length > 1 && `共${memberInfo.length + 1}人`}
					</div>
					{memberInfo.length > 1 &&
						<div
							styleName="bccommunication_right_people_title"
							onClick={ this.openLightBox }
						>
							{`${memberInfo.length + 1}個成員`}
						</div>
					}
				</div>
				<LazyLoading reverseMode loadingAct={ this.loadMore }>
					<div ref={ _ref => (this.content_main = _ref) } styleName="bccommunication_message bccommunication_message_cc" >
						{
							chatData && chatData.length > 0 &&
							<div styleName="bccommunication_invite"> 對話開始於 { chatData[0].inputDate } </div>
						}
						{ loading &&
							<div style={ {width: '100%', height: '25px', marginBottom: '15px'} }>
								<div className="ui loading" />
							</div>
						}
						<MessageList
							data={ chatData } // .slice(Math.max(msgDetailData.length - this.actionParameters.count, 0)) }
							pid={ user.pid }
						/>
					</div>
				</LazyLoading>
				<ReplyPanel
					user={ this.props.user }
					handleSendMsg={ this.sendMsg }
					disableAction={ disableAction }
				/>
			</div>
		);
	}
	renderInitialBlock() {
		return (
			<div styleName="bccommunication_first">
				和朋友說說話吧！
			</div>
		);
	}
	renderCreateNewMessage() {
		return <NewMessage location={ this.props.location } />
	}
	renderMainBlock( isNewMessage, readingChatId ) {
		if( isNewMessage ) return this.renderCreateNewMessage(); 
		else if( parseInt(readingChatId) === 0 ) return this.renderInitialBlock(); 
		else return this.renderMessageBlock(); 
	}
	/**
	 * React main render function
	 */
	render() {
		const { lightbox } = this.state;
		const { chatRoomData, isNewMessage, chatData, readingChatId } = this.props;

		return (
			<div styleName="bccommunication_content_right">
				{ /* 聊天室人數大於兩人時，才會有lightbox出現 */ }
				{	chatRoomData.other.length > 2 && lightbox &&
					<LightBox
						option={ {
							closeIcon: true,
							title: '聊天室成員'
						} }
						onClose={ this.handleLightBoxCancel }
					>
						<MemberList
							userPid={ chatRoomData.sid }
							memberPids={ chatRoomData.other }
						/>
					</LightBox>
				}

				{ this.renderMainBlock( isNewMessage, readingChatId ) }

			</div>
		);
	}
}

function chatRoomDataSelector(state) {
	const messageList = getDataList(state, 'messageList');
	const temp = {
		chatId: 0,
		oname: [],
		member: [],
		other: []
	};
	return messageList.find(l => parseInt(l.chatId) === parseInt(state.readingChatId)) || temp;
}

function mapStateToProps(state) {
	const nowState = state.message;
	return {
		chatRoomData: chatRoomDataSelector(nowState),
		readingChatId: getReadingChatId(nowState),
		loading: getIsLoading(nowState, 'chatList'),
		chatData: getDataList(nowState, 'chatList'),
		isNewMessage: getIsNewMessage(nowState)
	};
}

const actions = {
	loadDataByCategory,
	getChatList,
	newMessageWithFile,
	getConnectionStatus,
	postMessage,
	clearChat
};

export default compose(
	connect(mapStateToProps, actions),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MessageRightHalf);
