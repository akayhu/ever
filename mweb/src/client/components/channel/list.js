import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './list.css';
import compose from 'src/util/compose';
import Image from 'src/client/components/image';
import ListItem from 'src/client/components/channel/module/listItem';
import { changeGroupTab } from 'src/client/actions/group';
import LazyLoading from 'src/util/lazyLoading.js';
import { Link } from 'react-router';

class MGroupMain extends Component {
	constructor( props, context ){
		super( props, context );
	}
	render() {
		const {group, loadingAct, dataList, total, loading, error, end, history} = this.props;

		return (
			<div>
				<LazyLoading loadingAct={ loadingAct }>
					<dl styleName="group_list">
						{
							dataList.map(function(gid, index){
								const itemData = group[gid] ? group[gid].channelInfo : null;
								// console.log(itemData);
								if( itemData ) {
									return(
										<ListItem data={itemData} />
									);
								}
								else {
									return false;
								}
							})
						}
					</dl>
				</LazyLoading>
				{
					loading && 
					<div styleName="loading" className="loading-box">
						<div className="loading-animate gray">
							<i></i><i></i><i></i>
						</div>
						<span>載入中</span>
					</div>
				}
				{
					!loading && error && 
					<div styleName="error">
						Oops～載入資料發生錯誤！<a href={history.currentUrl}>點我重整</a>
					</div>
				}
				{
					!loading && end && 
					<div styleName="end">
						沒資料了！<a href="/m">回首頁</a>
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		group: state.entities.channels,
		history: state.history,
		// dataList: state.group[props.type].byGroup[props.tabName].dataList,
		// total: state.group[props.type].byGroup[props.tabName].total,
		// loading: state.group[props.type].byGroup[props.tabName].loading,
		// error: state.group[props.type].byGroup[props.tabName].error,
		// end: state.group[props.type].byGroup[props.tabName].end
	};
}

export default compose(
	connect( mapStateToProps, { changeGroupTab }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MGroupMain);

