import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// components
import GroupList from 'src/client/component_group/groupList';
import GroupItem from 'src/client/component_group/groupList/groupItem';
import SettingBlock from 'src/client/component_group/groupList/settingBlock';
import { getDataList, getIsLoading } from 'src/client/reducers/group/selectors';
import CardListItem from 'src/client/component_common/cardListItem';
import JoinGroupBtn from 'src/client/component_common/joinGroupBtn';

class IndexContent extends Component {
	constructor(props) {
		super(props);
	}
	shouldComponentUpdate(nextProps) {
		// render times: 16 -> 2
		const oldProps = this.props;
		return !isEqual(nextProps, oldProps);
	}
	render() {
		const { mainTab, activeTab, groupDataList, listLoading } = this.props;
		return (
			<div styleName="index_wrapper">
				{
					mainTab === 'myGroup' &&
					<GroupList
						mainTab={ mainTab }
						activeTab={ activeTab }
						groupDataList={ groupDataList }
						listLoading={ listLoading }
					>
						{
							groupDataList.map(data => (
								<GroupItem
									key={ data.id }
									mode={ activeTab }
									groupInfo={ data }
								>
									<SettingBlock
										mode={ activeTab }
										groupInfo={ data }
									/>
								</GroupItem>
							))
						}
					</GroupList>
				}
				{
					(mainTab === 'all' || mainTab === 'recommend') &&
					<GroupList
						gutter
						activeTab={ activeTab }
						groupDataList={ groupDataList }
						listLoading={ listLoading }
					>
						{
							groupDataList.map(data => (
								<CardListItem
									key={ data.id }
									id={ data.id }
									domain={ 'group' }
									cover={ data.coverWebUrl }
									title={ data.name }
									subCategory={ data.category }
									tagList={ data.tags }
									description={ data.description }
									statCount={ { activityCount: data.activityCount, memberCount: data.memberCount } }
									avatarList={ data.memberInfo }
								>
									<JoinGroupBtn
										simple
										buttonStyle="line"
										channelId={ data.id }
										isMember={ data.isMember }
										isApplying={ data.isApplying }
										joinSetting={ data.joinSetting || 0 }
									/>
								</CardListItem>
							))
						}
					</GroupList>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const nowState = state.group;

	return {
		groupDataList: getDataList(nowState, props.activeTab),
		listLoading: getIsLoading(nowState, props.activeTab),
	};
}

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css, { allowMultiple: true }]
)(IndexContent);
