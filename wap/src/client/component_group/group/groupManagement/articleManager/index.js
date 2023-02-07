import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';

// selectors
import { getIsLoading, getVerifyStatus, getChannelId } from 'src/client/reducers/group/selectors';
import { getSortableActivities } from 'src/client/reducers/selectors';
// actions
import { getPersonalWall, initPersonalWall } from 'src/client/actions/activity';
import { checkAllActivities, deleteBatchActivity, closeActivityAlert, triggerSort, loadDataByCategory, initTriggerSort } from 'src/client/actions/group';
// components
import TopPanel from './topPanel';
import TableList from './tableList';
import LazyLoading from 'src/client/component_common/lazyLoad/list';

class ArticleManager extends Component {
	constructor(props) {
		super(props);
		this.handleTitleClick = this.handleTitleClick.bind(this);
		this.loadMore = this.loadMore.bind(this);
	}
	componentDidMount() {
		if(!this.props.activity.personalStream.GROUP[this.props.channelId] || this.props.activity.personalStream.GROUP[this.props.channelId].status === 'init'){
			return this.loadMore();
		}
	}
	componentWillUnmount() {
		this.props.initTriggerSort();
		this.props.initPersonalWall('GROUP', {
			channelId: this.props.channelId
		})
	}
	handleTitleClick(sortField) {
		this.props.triggerSort(sortField);
	}
	loadMore() {
		const { sortField, sortOrder } = this.props.verifyStatus;
		return this.props.getPersonalWall('GROUP', {
			channelId: this.props.channelId,
			sortField: sortField,
			order: sortOrder
		});
	}
	render() {
		const lightboxOption = {
			closeIcon: true,	// 有無close ICON,
			contentHeight: 'auto'
		};
		const { verifyStatus, deleteBatchActivity, channelId, closeActivityAlert} = this.props;
		const { alert, batchLoading, msg, sortField, sortOrder } = verifyStatus;
		const streamTarget = this.props.activity.personalStream.GROUP[channelId];

		if(!streamTarget){
			return null;
		}
		
		const activityList = streamTarget.dataList.map((aid) => this.props.activity.activityPool[aid]);

		return (
			<div>
				<div styleName="total">共{ activityList.length }篇文章</div>
				<div styleName="list_bg">
					<TopPanel
						isLoading={ batchLoading }
						message={ msg }
						showAlertLB={ alert }
						closeLB={ closeActivityAlert }
						onButtonClick={ deleteBatchActivity }
						params={ channelId }
					/>
					<LazyLoading body loadingAct={ this.loadMore }>
						<TableList
							listData={ activityList }
							sortInfo={ {sortField, sortOrder} }
							tableHead={ [
								{name: ''},
								{name: '作者標題', sortBy: 'pid'},
								{name: '標題'},
								{name: '時間', sortBy: 'createDate'},
								{name: ''}
							] }
							onTitleClick={ this.handleTitleClick }
							isLoading={ streamTarget.loading }
						/>
					</LazyLoading>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const nowState = state.group;
	return {
		activity: state.activity,
		channelId: getChannelId(nowState),
		verifyStatus: getVerifyStatus(nowState),
		//listLoading: getIsLoading(nowState, 'groupActivityForCheck'),
	};
}

export default compose(
	connect(mapStateToProps, { 
		checkAllActivities, deleteBatchActivity, closeActivityAlert, triggerSort, 
		loadDataByCategory, getPersonalWall, initPersonalWall, initTriggerSort, closeActivityAlert
	}),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ArticleManager);
