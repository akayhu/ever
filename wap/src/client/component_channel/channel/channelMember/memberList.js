import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// import { orderBy } from 'lodash/collection';
import ChangeCard from 'src/client/component_common/changeCard';
import { Setting } from '../../buttons';
import { HaveCountTemplate } from 'src/client/component_common/contactTemplate';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import SearchPerson from 'src/client/component_search/searchlist/person';
import { loadDataCenter } from 'src/client/actions/channel';
import {
	getChannelId,
	getIsAdmin,
	getIsEditor,
	getDataList,
	filterMember,
	getIsLoading,
	getDataByKey,
	getTab,
	getCurrentCount
} from 'src/client/reducers/channel';

class MemberList extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.loadMore = this.loadMore.bind(this);
	}
	loadMore() {
		const { channelId, loadDataCenter, listType } = this.props;
		loadDataCenter(listType, false, { channelId });
	}
	getlistTitle() {
		const { listType, listTotal } = this.props;
		if (listType === 'channelMember') {
			return <div styleName="channel_right_people">頻道成員({ listTotal })</div>;
		}
		if (listType === 'channelAdmin') {
			return <div styleName="channel_right_people">頻道管理員({ listTotal })</div>;
		}
		return null;
	}
	render() {
		const { channelId, memberList, searchKeyword, userPid, loading, isAdmin } = this.props;
		return (
			<div styleName="list_box">
				{ this.getlistTitle() }
				<div styleName="list_bg">
					{
						!searchKeyword &&
						<LazyLoading body loadingAct={ this.loadMore }>
							<dl>
								{
									memberList.map(member =>
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
											keyword={ searchKeyword }
											hiddenStatus
										>
											<ChangeCard
												pid={ userPid }
												targetPid={ member.pid }
												connectionStatus={ member.connectionStatus }
												mutualFriendCount={ member.count }
												inNameCard
											/>
											{
												(isAdmin && userPid !== member.pid) &&
												<Setting
													pid={ userPid }
													targetPid={ member.pid }
													channelId={ channelId }
													role={ member.role }
												/>
											}
										</HaveCountTemplate>
									)
								}
								{
									loading &&
									<div className="ui loading" style={ { top: '-25px' } } />
								}
							</dl>
						</LazyLoading>
					}
					{
						searchKeyword &&
						<SearchPerson
							pid={ userPid }
							channelId={ channelId }
							mode="channel"
							keyword={ searchKeyword }
						/>
					}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, { listType }) {
	const nowState = state.channel;
	return {
		userPid: state.user.pid,
		connectionStatus: state.user.connectionStatus,
		channelId: getChannelId(nowState),
		isAdmin: getIsAdmin(nowState),
		isEditor: getIsEditor(nowState),
		memberList: getDataList(nowState, listType),
		listTotal: getCurrentCount(nowState, listType),
		searchKeyword: getDataByKey(nowState, 'searchKeyword'),
		loading: getIsLoading(nowState, listType),
	};
}

export default compose(
	connect(mapStateToProps, { loadDataCenter }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MemberList);
