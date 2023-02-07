import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import Promise from 'bluebird';
// actions
import * as bcCommunicationActionCreators from 'src/client/actions/bcCommunication';
// components
import LazyLoading from 'src/client/component_common/lazyLoad/list';
//import DefaultView from './defaultView';
import RejectView from './rejectView';
import ReplyPanel from './replyPanel';
import BackToMy104 from './backToMy104';
import MessageList from './messageList';
import MessageItem from './messageItem';
import clientConfig from 'src/configs/client';
import { isWrong } from 'src/util/tools';

class MessageRightHalf extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			//fileLoading: false,
			logo: '',
			first: true,
			//bcMsg: '',
			custNo: '',
			//nowJobNo: '',
			custName: '',
			jobName: '',
			inputDate: '',
			msgDetailData: [],
			// attachmentStatus: {
			// 	empty: true,
			// 	filename: '',
			// 	error: false,
			// 	errorMessage: '',
			// 	uuid: ''
			// }
		};
		this.content_main = null;
		//this.keepLoad = false;
		//this.hasAttachment = false;
		this.currentContentHeight = 0;
		this.jobNo = 0;
		this.loadMoreTimer = null;
		this.actionParameters = null;

		this.loadMsgData = this.loadMsgData.bind(this);
		this.loadMore = this.loadMore.bind(this);
		// this.onChange = this.onChange.bind(this);
		// this.onBlur = this.onBlur.bind(this);
		this.sendMsg = this.sendMsg.bind(this);
		this.handleSetContactInfo = this.handleSetContactInfo.bind(this);
		//this.uploadFile = this.uploadFile.bind(this);
		//this.deleteAttachment = this.deleteAttachment.bind(this);
	}
	componentDidMount() {
		//load first
	}
	componentWillReceiveProps(nextProps) {
		// 判斷是否載入對話資料
		if(this.props.readingJobNo !== nextProps.readingJobNo) {
			//this.keepLoad = true;
			this.jobNo = nextProps.readingJobNo;
			this.props.baseConvert({ jobNo: this.jobNo }).then((res) => {
				this.convertJobNo = res.response;
			})
			this.actionParameters = this.getInitParameters();

			this.setState({
				first: false,
				loading: true,
				msgDetailData: []
			}, this.loadMsgData);
		}
	}
	getInitParameters() {
		return {
			jobNo: this.jobNo,
			updateRead: 1, // 0: 不更新，1:更新已讀
			pageNo: 1, // 頁次
			pageRow: 50, // 一頁幾筆
			asc: 0 // 0: 新到舊，1: 舊到新
		};
	}
	loadMsgData() {
		//if (this.keepLoad) return;
		this.props.getMsgDetail(this.actionParameters).then((res) => {
			if (isWrong(res.response)) return;
			const {msgDetailList} = res.response;
			this.setMsgData(this.actionParameters, msgDetailList);
			if (msgDetailList) {
				this.props.getCompanyLogo({custNo: msgDetailList[0].custNo}).then(res => {
					if (isWrong(res.response)) return;
					this.setState({logo: res.response.logo});
				});
			}
			//this.keepLoad = false;
		});
	}
	loadMore() {
		this.loadMoreTimer = setTimeout(() => {
			this.actionParameters.pageNo = this.actionParameters.pageNo + 1;
			this.actionParameters.pageRow = 50;
			this.loadMsgData();
		}, 500);
	}
	setMsgData(parameters, msgDetailList) {
		if( !msgDetailList ) return null;
		const { pageNo } = parameters;
		// 第一次載入更多時要做的
		if (pageNo === 1) {
			this.setState({
				first: false,
				loading: false,
				custNo: msgDetailList[0].custNo,
				custName: msgDetailList[0].custName,
				jobName: msgDetailList[0].jobName,
				inputDate: msgDetailList[0].inputDate,
				msgDetailData: msgDetailList.reverse()
			}, this.scrollToBottom);
		}else{
			this.setState({
				first: false,
				loading: false,
				msgDetailData: msgDetailList.reverse().concat(this.state.msgDetailData)
			}, this.keepScrollBarPos);
		}
	}
	sendMsg(bcMsg, extra, accept, withPhone) {
		let status = 3;

		if (typeof accept !== 'undefined' && typeof withPhone !== 'undefined') {
			status = accept ? (withPhone ? 6 : 5) : 4;
		}

		const { custNo, custName, jobName} = this.state;
		const { user, addAcceptCustNo, sendMsg, setContactInfo } = this.props;
		const parameters= {
			pid: user.pid, // pid
			custNo: custNo, // 公司代碼
			custName: custName, // 公司名稱
			jobNo: this.jobNo, // 職務代碼
			jobName: jobName, // 職務名稱
			profileStatus: 1, // profile狀態，0: off	1: on
			status: status, // 訊息狀態，3: 回復兩次以上 4: 不同意附上profile	5: 同意附上profile	6: 同意附上profile跟電話
			content: bcMsg, // 訊息內容
			attachment: '', // 附件檔名，多筆時以逗號分隔
			attachmentId: '', // 附件代碼
			insertSource: 5 // 訊息來源 5: 104 plus( default )
		};

		if(extra.attachmentList.length > 0){
			parameters.attachment = extra.attachmentList[0].name;
			parameters.attachmentId = extra.attachmentList[0].fid;
		}

		if (accept === true) {
			addAcceptCustNo(custNo);
		}

		// setContactInfo({
		// 	pid: user.pid,
		// 	cellphone: withPhone,
		// 	custNo: custNo,
		// 	isAgree: accept ? 1 : -1,
		// 	jobNo: this.jobNo
		// });

		return sendMsg(parameters).then((msg) => {
			const msg_id = msg.response.msg_id;
			this.addFakeMsg(msg_id, parameters);
		});
	}
	handleSetContactInfo(accept, withPhone) {
		let status = 3;
		if (typeof accept !== 'undefined' && typeof withPhone !== 'undefined') {
			status = accept ? (withPhone ? 6 : 5) : 4;
		}
		const { custNo } = this.state;
		const { user, setContactInfo } = this.props;
		setContactInfo({
			pid: user.pid,
			cellphone: withPhone,
			custNo: custNo,
			isAgree: accept ? 1 : -1,
			jobNo: this.jobNo
		});
	}
	addFakeMsg(msgId, parameters) {
		const nowTime = nowTimeObj();
		const { msgDetailData } = this.state;
		const newUserData = [{
			source: 1,
			content: parameters.content,
			inputDate: nowTime,
			custNo: parameters.custNo,
			msgId: msgId,
			attachmentId: parameters.attachmentId,
			attachmentList: parameters.attachment ? [parameters.attachment] : []
		}];

		this.setState({
			msgDetailData: msgDetailData.concat(newUserData)
		}, this.scrollToBottom);
	}
	scrollToBottom() {
		const scrollHeight = this.content_main.scrollHeight;
		this.content_main.scrollTop = scrollHeight;
		this.currentContentHeight = scrollHeight;
	}
	keepScrollBarPos() {
		const scrollHeight = this.content_main.scrollHeight
		this.content_main.scrollTop = scrollHeight - this.currentContentHeight;
		this.currentContentHeight = scrollHeight;
	}
	render() {
		const { preCheckData, acceptedCustNo } = this.props;
		const { first, jobName, custName, inputDate, loading/*, fileLoading*/, msgDetailData, custNo/*, bcMsg, attachmentStatus*/, logo } = this.state;
		const accepted = (preCheckData.isProfileOn === 1) || acceptedCustNo.includes(custNo);

		return (
			<div styleName="bccommunication_content_right">
				{
					first === true &&
					<div styleName="bccommunication_first">
				    多數企業求才若渴，或者正在搜尋未來的夥伴<br/>
				    他們知道許多人才隱身在各行各業中<br/>
				    因此期望透過104探詢人才的聯繫意願，為未來的合作留下可能性<br/>
				    如果你願意讓更多的機會找上你，你也可以做自己的貴人
				  </div>
				}
				{
					first === false &&
					<div>
						<div styleName="bccommunication_title_main">
							<div styleName="bccommunication_right_job_title">{ jobName }</div>
							<a href={clientConfig.params.e104Url+"/jobbank/custjob/index.php?r=cust&j="+ custNo +"&jobsource="} styleName="bccommunication_right_company_title">{ custName }</a>
						</div>
						<LazyLoading reverseMode loadingAct={ this.loadMore }>
							<div ref={ n => (this.content_main = n) } styleName={"bccommunication_message bccommunication_message_bc" + (accepted ? ' bccommunication_message_bc_accept':'')}>
								<div styleName="bccommunication_invite">{ inputDate } 廠商邀請你加入對話</div>
								{
									loading &&
									<div style={ {width: '100%', height: '25px', marginBottom: '15px'} }>
										<div className="ui loading" />
									</div>
								}
								<MessageList data={ msgDetailData } logo={ logo } />
							</div>
						</LazyLoading>
						{
							preCheckData.semion !== 4 // 履歷狀態為4則出現返回My104的panel
							? <BackToMy104 jobNo={this.convertJobNo}/>
							: <ReplyPanel
									accepted={ accepted }
									// accepted={ acceptedCustNo.includes(custNo) }
									acceptStatus={ preCheckData }
									//bcMsg={ bcMsg }
									user={this.props.user}
									handleSendMsg={ this.sendMsg }
									handleSetContactInfo={ this.handleSetContactInfo }
									//handleUpload={ this.uploadFile }
									//handleDeleteAttachment={ this.deleteAttachment }
									//attachmentStatus={ attachmentStatus }
									//loading={ fileLoading }
								/>
							/* BIGC-1133 決議，C拒絕B之後訊息傳遞不擋
								: preCheckData.isProfileOn === 2 // 不同意附上profile出現拒絕panel
								? <RejectView />
								: <ReplyPanel
									accepted={ accepted }
									// accepted={ acceptedCustNo.includes(custNo) }
									acceptStatus={ preCheckData }
									//bcMsg={ bcMsg }
									user={this.props.user}
									handleSendMsg={ this.sendMsg }
									//handleUpload={ this.uploadFile }
									//handleDeleteAttachment={ this.deleteAttachment }
									//attachmentStatus={ attachmentStatus }
									//loading={ fileLoading }
								/>*/
						}
					</div>
				}
			</div>
		);
	}
}

function nowTimeObj() {
	const date = new Date();
	const	year = date.getFullYear(); // 年
	const	month = date.getMonth() + 1; // 月
	const	day = date.getDate(); // 日
	const	hours = date.getHours(); // 時
	const	minutes = date.getMinutes(); // 分
	const	seconds = date.getSeconds(); // 秒

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 年-月-日 時:分:秒
}

function preCheckDataSelector(state) {
	const targetData = state.bcMsgList.msgListData.filter(item => item.jobNo === state.readingJobNo)[0];

	if (!targetData) {
		return {};
	}

	return {
		status: targetData.status,
		semion: targetData.switchStatusView,
		isProfileOn: targetData.isProfileOn
	};
}

function mapStateToProps(state) {
	return {
		acceptedCustNo: state.bcCommunication.acceptedCustNo,
		bcMsgDetail: state.bcCommunication.bcMsgDetail,
		readingJobNo: state.bcCommunication.readingJobNo,
		preCheckData: preCheckDataSelector(state.bcCommunication)
	};
}

export default compose(
	connect(mapStateToProps, bcCommunicationActionCreators),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MessageRightHalf);
