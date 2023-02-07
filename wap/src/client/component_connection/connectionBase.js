import React, {Component} from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

import { getActive, getDataList, getIsLoading, getTotal } from 'src/client/reducers/connection';

// actions
import { checkIdentity } from 'src/client/actions/profile';
import * as connectionActionCreators from 'src/client/actions/connection';
// components
import PageWrapper from './pageWraper';
import LazyLoading from 'src/client/component_common/lazyLoad/list';

class ConnectionBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
		this.loadMore = this.loadMore.bind(this);
	}
	loadMore() {
		const { loadDataByCategory, category } = this.props;
		loadDataByCategory(category);
	}
	render() {
		const { category, data, viewas, loading, total, viewasInfo } = this.props;
		return (
			<div>
				<LazyLoading body loadingAct={ this.loadMore }>
					<PageWrapper data={ data } total={ total } mode={ category } viewas={ viewas } viewasInfo={ viewasInfo } />
				</LazyLoading>
				{
					loading &&
					<div style={ {width: '100%', height: '25px', marginBottom: '15px'} }>
						<div className="ui loading" />
					</div>
				}
			</div>
		);
	}
}

const dataSelector = (state, mode) => {
	if (!parseInt(mode)) {
		return state[mode];
	}
	const initState = {offset: 0, total: 0, hasNext: true, dataList: []};
	return state.groupFriend[mode] || initState;
};

function mapStateToProps(state, {category}) {
	const nowState = state.connection;
	return {
		data: getDataList(nowState, category),
		loading: getIsLoading(nowState, category),
		total: getTotal(nowState, category),
		user: state.user,
		mutualFriendPrivacy: state.privacy.mutualFriend,
		viewas: state.profile.viewas,
		viewasInfo: state.profile.viewasInfo
	};
}

export default compose(
	connect(mapStateToProps, connectionActionCreators),
	[CSSModules, '_', css]
)(ConnectionBase);
