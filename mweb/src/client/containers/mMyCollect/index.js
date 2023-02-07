import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { initCollectionPage } from 'src/client/actions/collection';
import { loadListDataCenter } from 'src/client/actions/general';
import NoActionActivityList from 'src/client/components/activity/list';
import Announcement from 'src/client/components/announcement/index';

class MMyCollect extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.props.initCollectionPage().then(() => {
			window.scrollTo(0, 0);
		});
	}
	loadMore() {
		const { targetPid } = this.props;

		this.props.loadListDataCenter({
			domain: 'collection',
			key: 'activity',
			targetPid,
		});
	}
	render() {
		const { loading, error, end, dataList } = this.props;

		return (
			<main styleName="wrap">
				<Announcement />
				<h2 styleName="title">我的收藏</h2>
				<NoActionActivityList
					loading={ loading }
					error={ error }
					end={ end }
					dataList={ dataList }
					loadingAct={ this.loadMore.bind(this) }
					from="我的收藏"
					pageName="myCollect"
				/>
			</main>
		);
	}
}

function mapStateToProps(state) {
	return {
		targetPid: state.user.pid,
		dataList: state.collection.dataList,
		loading: state.collection.loading,
		error: state.collection.error,
		end: state.collection.end,
	};
}

export default compose(
	connect(mapStateToProps, {initCollectionPage, loadListDataCenter}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(MMyCollect);
