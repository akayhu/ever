import { connect } from 'react-redux';
import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import css from './list.css';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import ga from 'react-ga';
import ListItem from 'src/client/components/activity/module/listItem';
import LazyLoading from 'src/util/lazyLoading';
// actions
import { layerActivityClose } from 'src/client/actions/activity';
// components
import Layer from 'src/client/components/layer';
import ActivityMaster from 'src/client/components/activity/module/master';

class NoActionActivityList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { activitiesPool, layerActivity, loadingAct, dataList, loading, error, end, user, history } = this.props;
		
		return (
			<div>
				<LazyLoading loadingAct={ loadingAct }>
					{
						dataList.length > 0 &&
						<dl styleName="list">
							{
								dataList.map((aid) => {
									const itemData = activitiesPool[aid];
									if (!itemData) return null;
									return (
										<ListItem
											data={ itemData }
											from={ this.props.from }
											loginUser={ user }
											pageName={ this.props.pageName }
											filter={ this.props.filter }
										/>
									);
								})
							}
						</dl>
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
					onRequestClose={ this.props.layerActivityClose }
				>
					<ActivityMaster 
						user={user}
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
	[CSSModules, '_', css, { allowMultiple: true }],
)(NoActionActivityList);
