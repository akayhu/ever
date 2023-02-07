import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
// import css from './index.css';
import compose from 'src/util/compose';
import Image from 'src/client/components/image';
import GroupList from 'src/client/components/channel/list';
import { changeGroupTab } from 'src/client/actions/group';
import { Link } from 'react-router';
import {loadListDataCenter} from 'src/client/actions/general';

class GroupDataList extends Component {
	constructor( props, context ){
		super( props, context );
	}
	// componentDidMount() {
	// 	this.props.changeGroupTab(this.props.tabName, this.props.type);
	// }
	loadMore() {
		if(this.props.currentTab && this.props.currentTab === this.props.tabName){
			this.props.loadListDataCenter({
				domain: 'group',
				key: this.props.tabName,
			});
		}
	}
	render() {
		const {dataList, total, loading, error, end} = this.props;
		// console.log(group, dataList, total, loading, error, end);
		return (
			<GroupList 
				loading={ loading }
				error={ error }
				end={ end }
				total={ total }
				dataList={ dataList } 
				loadingAct={ this.loadMore.bind(this) } 
			/>
		);
	}
}

function mapStateToProps(state, props) {
	const byGroup = state.group[props.type].byGroup[props.tabName];
	// console.log(state);
	return {
		// group: state.entities.channels,
		dataList: byGroup.dataList,
		total: byGroup.total,
		loading: byGroup.loading,
		error: byGroup.error,
		end: byGroup.end
	};
}

export default compose(
	connect( mapStateToProps, { changeGroupTab, loadListDataCenter }),
	// translate([]),
	// [CSSModules, '_', css, { allowMultiple: true }]
)(GroupDataList);

