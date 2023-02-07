import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { initMembersJoinPage, loadDataByCategory, checkAllApplicants, verifyBatchMember } from 'src/client/actions/group';
// selectors
import { getGroupInfoData, getIsLoading, getDataList } from 'src/client/reducers/group/selectors';
// components
import MemberItem from 'src/client/component_group/group/groupManagement/membersJoin/memberItem';
import { CheckBox } from 'src/client/component_group/buttons';
import LazyLoading from 'src/client/component_common/lazyLoad/list';

class MembersJoin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showBatchLoading: false,
			message: '',
			batchLoading: false
		};
		this.loadMore = this.loadMore.bind(this);
		this.batchAction = this.batchAction.bind(this);
		this.handleSingleVerify = this.handleSingleVerify.bind(this);
	}
	componentDidMount() {
		const { groupInfo: { id }, initMembersJoinPage } = this.props;
		initMembersJoinPage({ channelId: id });
	}
	loadMore() {
		const { groupInfo: { id }, loadDataByCategory } = this.props;
		loadDataByCategory('applyList', { channelId: id });
	}
	batchAction(channelId, isPass) {
		const { unCheckedList, verifyBatchMember } = this.props;
		if (!unCheckedList.filter(item => item.checked).length) return;

		this.setState({
			showBatchLoading: true,
			message: '',
			batchLoading: true
		});
		verifyBatchMember(channelId, isPass)
			.then(success => {
				this.setState({
					showBatchLoading: false,
					message: success ? '批次處理成功' : '批次處理失敗',
					batchLoading: false
				});
			});
	}
	handleSingleVerify(result) {
		if (result === undefined) this.setState({message: ''});
		if (result === false) this.setState({message: '處理失敗'});
	}
	render() {
		const { showBatchLoading, message, batchLoading } = this.state;
		const { loading, unCheckedList, groupInfo: { id }, checkAllApplicants } = this.props;
		const dataIsEmpty = unCheckedList.length === 0;
		const checkAll = unCheckedList.every(item => item.checked) && !dataIsEmpty;

		return (
			<div styleName="list_box">
				<div styleName="group_right_people">{unCheckedList.length}名審核申請</div>
				{(dataIsEmpty && loading) &&
					<div className="ui loading" style={ {top: '45px'} } />
				}
				{!dataIsEmpty &&
					<div styleName="list_bg">
						<div styleName="all">
							<CheckBox
								label={ '全選' }
								value={ 'all' }
								toggled={ checkAll }
								toggleAction={ checkAllApplicants }
							/>
							{showBatchLoading &&
								<div className="ui loading" styleName="batch_act_block" />
							}
							{message &&
								<div styleName="batch_act_block">
									{ message }
								</div>
							}
							<button
								className="ui primary button"
								style={ {marginLeft: 'auto'} }
								onClick={ this.batchAction.bind(this, id, true) }
								disabled={ batchLoading }
							>
								批次核准
							</button>
							<button
								className="ui normal button"
								onClick={ this.batchAction.bind(this, id, false) }
								disabled={ batchLoading }
							>
								批次拒絕
							</button>
						</div>
						<LazyLoading body loadingAct={ this.loadMore }>
							<dl>
								{unCheckedList.map(applicant => (
									<MemberItem
										key={ applicant.pid }
										channelId={ id }
										triggerSingle={ this.handleSingleVerify }
										{ ...applicant }
									/>
								))}
								{loading &&
									<div className="ui loading" style={ {top: '25px'} } />
								}
							</dl>
						</LazyLoading>
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const nowState = state.group;
	return {
		groupInfo: getGroupInfoData(nowState),
		loading: getIsLoading(nowState, 'applyList'),
		unCheckedList: getDataList(nowState, 'applyList')
	};
}

export default compose(
	connect(mapStateToProps, {initMembersJoinPage, loadDataByCategory, checkAllApplicants, verifyBatchMember}),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MembersJoin);
