import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
// import hasPermission from 'src/client/services/viewas.js';
import { getTopic, getTopicFunc } from 'src/client/selectors';
import { initTopicPage } from 'src/client/actions/topic';
import { loadListDataCenter } from 'src/client/actions/general';
import HaveActionActivityList from 'src/client/components/activity/river';
import compose from 'src/util/compose';
import {topicConfig} from 'src/client/components/leftSideMenu/menu';
import Announcement from 'src/client/components/announcement/index';

class MTopic extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.keyword = props.params.keyword;
	}
	componentWillMount() {
		this.props.router.push(`/m/topic/${this.keyword}`);
		// var count = topicConfig.submenu.filter((item) => item.title === this.keyword).length;
		
		// if(count === 0){
		// 	this.props.router.push(topicConfig.submenu[0].link);
		// }
	}
	componentDidMount() {
		const {initTopicPage} = this.props;
		initTopicPage(this.keyword);
	}
	componentWillReceiveProps(nextProps) {
		const {initTopicPage} = this.props;
		
		if(nextProps.params.keyword && this.keyword !== nextProps.params.keyword){
			this.keyword = nextProps.params.keyword;
			initTopicPage(this.keyword);
		}
	}
	loadMore() {
		if(this.keyword){
			const {loadListDataCenter} = this.props;
			loadListDataCenter({domain:'topic' , key: 'hots', func: this.keyword});
		}
	}
	render() {
		const {dataList, loading, error, end} = this.props;
		
		return (
			<main styleName="wrap">
				<Announcement />
				<h2 styleName="topic_name">{this.keyword}</h2>
				<div styleName="activity_list">
					<HaveActionActivityList 
						loading={ loading }
						error={ error }
						end={ end }
						dataList={dataList} 
						loadingAct={this.loadMore.bind(this)}
						from={this.keyword}
						pageName="occupaList"
					/>
				</div>
			</main>
		);
	}
}

function mapStateToProps(state) {
	const func = getTopicFunc(state);
	
	return {
		user: state.user,
		func,
		dataList: getTopic({state, func, key: 'dataList'}),
		loading: getTopic({state, func, key: 'loading'}),
		error: getTopic({state, func, key: 'error'}),
		end: getTopic({state, func, key: 'end'})
	};
}

export default compose(
	connect(mapStateToProps, { initTopicPage, loadListDataCenter }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MTopic);
