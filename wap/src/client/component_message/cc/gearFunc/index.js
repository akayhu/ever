import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { deleteChatroomContent, deleteChatroomByIdFromList, triggerSetChatroomMute } from 'src/client/actions/message';
import { getConnectionStatus } from 'src/client/actions/connection';
import { exclude } from 'src/client/actions/connection';

// components
import { LightBox, DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import ConfirmLightBox from './confirmLightBox';

class Gear extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: '',
			lightbox: false
		};
		this.openMuteMessageLB = this.openMuteMessageLB.bind(this);
		// this.openBlockMessageLB = this.openBlockMessageLB.bind(this);
		this.openDeleteMessageLB = this.openDeleteMessageLB.bind(this);
		this.handleSubmitAction = this.handleSubmitAction.bind(this);
		this.handleLightBoxCancel = this.handleLightBoxCancel.bind(this);
	}

	openMuteMessageLB() {
		this.setState({
			active: 'mute',
			lightbox: true
		});
	}
	// openBlockMessageLB() {
	// 	this.setState({
	// 		active: 'block',
	// 		lightbox: true
	// 	});
	// }
	openDeleteMessageLB() {
		this.setState({
			active: 'delete',
			lightbox: true
		});
	}

	handleSubmitAction() {
		const { active } = this.state;
		switch (active) {
			case 'mute':
				this.muteMessage();
				break;
			case 'delete':
				this.deleteMessage();
				break;
			case 'block':
				// this.blockMessage();
				break;
			default:
				break;
		}
	}

	handleLightBoxCancel() {
		this.setState({ lightbox: false });
	}

	muteMessage() {
		const { chatId, muteFlag } = this.props.chatRoomData;
		const str = muteFlag ? '接收訊息通知' : '停止接收訊息';

		const parameters = {
			chatId,
			muteFlag: !muteFlag
		};
		this.props.triggerSetChatroomMute(parameters).then((msg) => {
			this.setState({
				active: '',
				lightbox: false,
			});
		});
	}

	/**
	 * 
	 * 5/22 新增規則，由於多人聊天室的封鎖設計不周全，因此拔除封鎖功能，此function保留但不應有任何作用
	 * 
	 * @memberOf Gear
	 */


	// blockMessage() {
	// 	const { blockMsg } = this.props;
	// 	const { other: [targetPid] } = this.props.chatRoomData;
	// 	const parameters = {
	// 		targetPid,
	// 		status: !blockMsg
	// 	};

	// 	this.props.exclude(parameters).then((msg) => {
	// 		if (msg.response === true) {
	// 			this.setState({
	// 				active: '',
	// 				lightbox: false,
	// 			});
	// 			this.props.onChangeBlockStatus(!blockMsg);
	// 		} else {
	// 			this.setState({
	// 				active: '',
	// 				lightbox: false,
	// 			});
	// 		}
	// 	});
	// }

	deleteMessage() {
		const { deleteChatroomContent, handleClearData } = this.props;
		const parameters = {
			chatId: this.props.chatRoomData.chatId
		};

		deleteChatroomContent(parameters).then((msg) => {
			if (msg.response === true) {
				handleClearData();
				this.props.deleteChatroomByIdFromList(this.props.chatRoomData.chatId);
				
				// this.setState({
				// 	active: '',
				// 	lightbox: false,
				// });
			} else {
				// this.setState({
				// 	active: '',
				// 	lightbox: false,
				// });
			}
		});
	}

	getLightBoxText() {
		const { active } = this.state;
		const { oname, muteFlag } = this.props.chatRoomData;

		switch (active) {
			case 'mute':
				return (
					<div>
						<h2>{muteFlag ? '接收訊息通知' : '取消訊息通知'}</h2>
						<p>{muteFlag ? '開始接收' : '停止接收'} 來自{oname.join(',')} 的訊息</p>
					</div>
				);
			case 'block':
				return false;
				/*(
					<div>
						<h2>{this.props.blockMsg ? '解除封鎖訊息' : '封鎖訊息'}</h2>
						<p>{this.props.blockMsg ? '開始接收' : '停止接收'} 來自{oname.join(',')} 的訊息</p>
					</div>
				);*/
			case 'delete':
				return (
					<div>
						<h2>對話刪除後無法回復</h2>
						<h2 style={ {margin: '10px 0 50px 0'} }>是否確定刪除?</h2>
					</div>
				);
			default:
				return null;
		}
	}

	render() {
		const { lightbox } = this.state;
		const { member, muteFlag } = this.props.chatRoomData;
		const lightboxText = this.getLightBoxText();
		
		return (
			<div styleName="dropdownMenuStyle">
				<DropdownMenu toggleOpen={ _ => _ }>
					<DropdownTarget>
						<i className="setting icon" />
					</DropdownTarget>
					<DropdownList>
						<ul className="dropdown">
							<li onClick={ this.openMuteMessageLB }>{ muteFlag ? '接收訊息通知' : '取消訊息通知'}</li>
							{/*{
								member.length === 2 &&
								<li onClick={ this.openBlockMessageLB }>
									{ this.props.blockMsg ? '解除封鎖訊息' : '封鎖訊息'}
								</li>
							}*/}
							<li onClick={ this.openDeleteMessageLB }>刪除對話紀錄</li>
						</ul>
					</DropdownList>
				</DropdownMenu>
				<ConfirmLightBox
					show={ lightbox }
					text={ lightboxText }
					handleCancel={ this.handleLightBoxCancel }
					handleSubmit={ this.handleSubmitAction }
				/>
			</div>
		);
	}
}
export default compose(
	connect(null, { deleteChatroomContent, deleteChatroomByIdFromList, triggerSetChatroomMute, exclude, getConnectionStatus }),
	//translate([]),
	[CSSModules, '_', css]
)(Gear);
