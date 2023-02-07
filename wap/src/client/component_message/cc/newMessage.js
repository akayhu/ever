import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

// actions
import {postMessage, deleteReceiver} from 'src/client/actions/message';
import { loadProfile } from 'src/client/actions/profile';
// components
import Tag from 'src/client/component_common/tag';
import ReplyPanel from './replyPanel';


class MessageRightHalf extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userTags: []
		};

		this.keepList = [];
		this.keepAlreadyAddList = [];
		this.sendMsg = this.sendMsg.bind(this);
	}

	componentDidMount() {
		if (this.props.location.query && this.props.location.query.newMessage) {
			this.props.deleteReceiver();
			this.props.loadProfile({pid: this.props.location.query.newMessage}).then((res) => {
				const result = res.response.response;
				const model = {
					text: result.userName,
					avatar: result.avatarWebUrl,
					id: result.pid,
					pid: result.pid,
					link: '/profile/' + result.pid,
					name: result.userName
				}
				this.setState({
					userTags: [model]
				});
			});
		}

		if (this.keepList.length === 0 && this.props.myFriendList.length > 0) {
			this.keepList = this.props.myFriendList.reduce((newAry, item, index) => {
				newAry.push({
					value: item.userName || item.name,
					data: item
				});

				return newAry;
			}, []);
		}
	}

	sendMsg(ccMsg, extra) {
		const receivers = this.state.userTags.map(user => user.pid).join(',');
		const { postMessage } = this.props;
		const parameters = {
			memberList: receivers,
			text: ccMsg,
			extraJson: JSON.stringify(extra)
		};

		return postMessage(parameters).then(msg => 'success');
	}
	setTag(value) {
		this.setState({ userTags: value });
	}
	autocomplete(text) {
		const re = new RegExp(text);
		const afterFilterList = this.keepList.filter(item => re.test(item.value) && this.keepAlreadyAddList.indexOf(item.value) === -1);

		return afterFilterList;
	}
	render() {
		const disableAction = this.state.userTags.length > 0 ? false : true;
		return (
			<div styleName="bccommunication_content_right">
				<div>
					<div styleName="new_message_title">
						新訊息
					</div>
					<div styleName="add_receiver_main">
						<span styleName="reciver_label">收件人：</span>
						<Tag
							tagList={ this.state.userTags }
							placeHolder="+"
							forceFromAc
							autocomplete={ this.autocomplete.bind(this) }
							activitySetTag={ this.setTag.bind(this) }
						/>
					</div>
					<div ref="content_main" styleName="bccommunication_message bccommunication_message_new" />
					<ReplyPanel
						user={ this.props.user }
						placeHolder="留個話吧......"
						handleSendMsg={ this.sendMsg }
						disableAction={disableAction}
					/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		user: state.user,
		myFriendList: state.global.myFriendList.list
	};
}

export default compose(
	connect(mapStateToProps, {postMessage, deleteReceiver, loadProfile }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MessageRightHalf);
