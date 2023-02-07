import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { loadDataByCategory } from 'src/client/actions/group';
// selectors
import {
	getObserverRule,
	getDataTotal,
	getDataList,
	getIsLoading,
	getGroupMemberSearchKey } from 'src/client/reducers/group/selectors';
// components
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import SearchPerson from 'src/client/component_search/searchlist/person';

import { HaveCountTemplate } from 'src/client/component_common/contactTemplate';
import ChangeCard from 'src/client/component_common/changeCard';
import { Setting } from 'src/client/component_group/buttons';
// import { NameCard } from 'src/client/component_common/card';

class MemberList extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.loadMore = this.loadMore.bind(this);
	}
	loadMore() {
		const { listType, keyword, channelId, loadDataByCategory } = this.props;
		loadDataByCategory(listType, { channelId, name: keyword });
	}
	getlistTitle() {
		const { listType, listTotal } = this.props;
		if (listType === 'searchMembers') {
			return <div styleName="group_right_people">{ listTotal }筆查詢結果</div>;
		}
		if (listType === 'groupMembers') {
			return <div styleName="group_right_people">社團成員({ listTotal })</div>;
		}
		if (listType === 'groupAdmins') {
			return <div styleName="group_right_people">社團管理者({ listTotal })</div>;
		}
		return null;
	}
	render() {
		const { listData, loading, userPid, userRule, keyword, channelId } = this.props;
		return (
			<div styleName="list_box">
				{ this.getlistTitle() }
				<div styleName="list_bg">
					{
						!keyword &&
						<LazyLoading body loadingAct={ this.loadMore.bind(this) }>
							<dl>
								{
									listData.map(member =>
										<HaveCountTemplate
											key={ `memberItem${member.pid}` }
											pid={ userPid }
											targetPid={ member.pid }
											avatarWebUrl={ member.avatarWebUrl }
											userName={ member.userName }
											companyName={ member.companyName }
											jobTitle={ member.jobTitle }
											count={ member.count }
											major={ member.major }
											schoolName={ member.schoolName }
											keyword={ keyword }
											extra={ getUserTitle(member.isAdmin, member.isHead) }
											hiddenStatus
										>
											<div styleName="list_button">
												<ChangeCard
													pid={ userPid }
													category="groupMembers"
													targetPid={ member.pid }
													connectionStatus={ member.connectionStatus }
												/>
											</div>
											<div styleName="list_setting">
												{
													(userPid !== member.pid) &&
													<Setting
														pid={ userPid }
														targetPid={ member.pid }
														observerRule={ userRule }
														channelId={ channelId }
														head={ member.isHead }
														admin={ member.isAdmin }
													/>
												}
											</div>
										</HaveCountTemplate>
									)
								}
								{
									loading &&
									<div className="ui loading" style={ {top: '-25px'} } />
								}
							</dl>
						</LazyLoading>
					}
					{
						keyword &&
						<SearchPerson
							pid={ userPid }
							channelId={ channelId }
							mode="channel"
							keyword={ keyword }
						/>
					}
				</div>
			</div>
		);
	}
}

function getUserTitle(isAdmin, isHead) {
	if (isHead) return '團長';
	if (isAdmin) return '管理者';
	return '團員';
}

function mapStateToProps(state, { listType }) {
	const nowState = state.group;
	return {
		userPid: state.user.pid,
		userRule: getObserverRule(nowState),
		listData: getDataList(nowState, listType),
		listTotal: getDataTotal(nowState, listType),
		loading: getIsLoading(nowState, listType),
		keyword: getGroupMemberSearchKey(nowState),
	};
}

export default compose(
	connect(mapStateToProps, { loadDataByCategory }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MemberList);

/* <MemberItem
	key={ index }
	{ ...member }
	searchWord={ keyword }
	observerPid={ userPid }
	observerRule={ userRule }
	channelId={ channelId }
/> */
