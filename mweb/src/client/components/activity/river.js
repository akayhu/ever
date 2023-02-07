import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import LazyLoading from 'src/util/lazyLoading';
import compose from 'src/util/compose';
import css from './river.css';
// actions
import { layerActivityClose } from 'src/client/actions/activity';
// components
import Layer from 'src/client/components/layer';
import ActivityStream from 'src/client/components/activity/module/stream';
import ActivityMaster from 'src/client/components/activity/module/master';

class HaveActionActivityList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { layerActivity, activitiesPool, layerActivityClose, loadingAct, dataList, loading, error, end, user, history } = this.props;
		// console.log(this.props);
		return (
			<div>
				<LazyLoading loadingAct={ loadingAct }>
					{
						dataList &&
						dataList.map((aid) => {
							const itemData = activitiesPool[aid];
							return (
								<ActivityStream
									itemData={ itemData }
									from={ this.props.from }
									loginUser={ user }
									pageName={ this.props.pageName }
									filter={ this.props.filter }
								/>
							);
						})
					}
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
				<Layer
					backBtnText={ layerActivity.from }
					open={ layerActivity.isShow }
					onRequestClose={ layerActivityClose }
				>
					<ActivityMaster
						user={ user }
						aid={layerActivity.aid}
						itemData={ activitiesPool[layerActivity.aid] }
						pageName={ this.props.pageName }
						filter={ this.props.filter }
					/>
				</Layer>
			</div>
		);
	}
}

HaveActionActivityList.defaultProps = {
	dataList: [],
};

HaveActionActivityList.propTypes = {
	dataList: PropTypes.array.isRequired,
	loadingAct: PropTypes.func,
};

function mapStateToProps(state) {
	return {
		user: state.user,
		history: state.history,
		activitiesPool: state.entities.activities,
		layerActivity: state.layerActivity,
	};
}

export default compose(
	connect(mapStateToProps, { layerActivityClose }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(HaveActionActivityList);
