import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { Link, browserHistory} from 'react-router';
import Stream from 'src/client/component_activities/module/Stream';
import ActivityLightbox from 'src/client/component_activities/module/Lightbox';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import AccuseActivity from 'src/client/component_common/accuse/activity';
import { updatePersonalConfig } from 'src/client/actions/profile';

import css from './index.css';

class ActivityRiver extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			streamClass: null,
			streamClassName: null
		};

		if (props.categoryMap) {
			this.state.streamClass = props.category || Object.keys(props.categoryMap)[0];
			this.state.streamClassName = props.categoryMap[this.state.streamClass];
		} else {
			this.state.streamClass = props.category;
			this.state.streamClassName = '';
		}

		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
		this.getMoreActivity(this.state.streamClass);
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.category !== nextProps.category) {
			this.changeStreamClass(nextProps.category);
		}
	}
	changeStreamClass(status) {
		if (this.state.streamClass !== status && this.mounted === true) {
			const streamClassName = this.props.categoryMap[status];

			// this.state.streamClass = status;
			// this.state.streamClassName = streamClassName;

			this.setState({
				streamClass: status,
				streamClassName: streamClassName
			}, () => {
				this.saveCategory(this.props.categoryMap[status]);
				this.getMoreActivity(status);
			});
		}
	}
	getMoreActivity() {
		// this.enableLoading();
		this.props.loadData(this.state.streamClass);
		// .then(() => {
		// 	this.disableLoading();
		// });
	}
	saveCategory(status) {
		this.props.updatePersonalConfig({
			pid: this.props.pid,
			updateData: JSON.stringify([{
				type: 'cb7c5df0-d577-40f1-bc00-12fb1bbfff7f',
				value: status
			}])
		});
	}
	// enableLoading(){
	// 	if(this.state.loading === false && this.mounted === true){
	// 		this.setState({loading : true});
	// 	}
	// }
	// disableLoading(){
	// 	if(this.state.loading === true && this.mounted === true){
	// 		this.setState({loading : false});
	// 	}
	// }
	render() {
		//let activityLength = this.props.activity.personalStream[this.state.streamClass].dataList.length;
		const streamCategory = this.props.activity.personalStream[this.state.streamClass];
		const streamTarget = this.props.channelId ? streamCategory[this.props.channelId] : this.props.targetPid ? streamCategory[this.props.targetPid] : streamCategory;
		const _hasActivityLightbox = () => { return this.props.activity.activityPool[this.props.activity.lightbox] !== undefined; }
		if (!streamTarget) {
			return null;
		}
		return (
			<div>
				{ // 首頁河道才有下拉選擇 「最新動態、熱門動態、訂閱的動態」
					this.props.categoryMap &&
					<div styleName="latest_news">
						<DropdownMenu>
							<DropdownTarget>
								<span>{ this.state.streamClassName }</span><i className="dropdown icon" />
							</DropdownTarget>
							<DropdownList>
								<ul className="dropdown">
									{
										Object.keys(this.props.categoryMap).map((key, index) => {
											return (
												<li
													onClick={ this.changeStreamClass.bind(this, key) }
													data-gtm-index={ this.props.categoryMap[key] }
													key={ index }
												>
													<i />{this.props.categoryMap[key]}
												</li>
											);
										})
									}
								</ul>
							</DropdownList>
						</DropdownMenu>
					</div>
				}
				<LazyLoading body loadingAct={ this.getMoreActivity.bind(this, this.state.streamClass) }>
					<div>
						{
							streamTarget.dataList.map((aid, index) => {
								if (this.props.activity.activityPool.hasOwnProperty(aid)) {
									const itemData = this.props.activity.activityPool[aid];
									return (
										<Stream
											key={ aid }
											itemData={ itemData }
											index={ index }
											author={ itemData.pid === this.props.pid }
											/*
												首頁河道的時候：
													category為 HOT or NEW or NEW
												頻道河道的時候：
													category為 CHANNEL
												社團河道的時候：
													category為 GROUP
											*/
											category={ this.props.categoryMap ? this.state.streamClass : this.props.category }
											// 頻道河道 與 社團河道會有 isAdmin
											isAdmin={ this.props.isAdmin }
											// 社團河道 會有 isHead (團長)
											isHead={ this.props.isHead }
											// 頻道河道 會有 isEditor (小編)
											isEditor={ this.props.isEditor }
											pageName={this.props.pageName}
											filterName={this.props.filterName}
										/>);
								}
							})
						}
					</div>
				</LazyLoading>
				{
					streamTarget.loading &&
					<div className="ui loading" />
				}
				{
					typeof this.props.activity.lightbox === 'string' && _hasActivityLightbox() &&
					<ActivityLightbox
						itemData={ this.props.activity.activityPool[this.props.activity.lightbox] }
						index={ 0 }
						author={ this.props.activity.activityPool[this.props.activity.lightbox].editable }
						/*
							首頁河道的時候：
								category為 HOT or NEW or NEW
							頻道河道的時候：
								category為 CHANNEL
							社團河道的時候：
								category為 GROUP
						*/
						category={ this.props.categoryMap ? this.state.streamClass : this.props.category }
						// 頻道河道 與 社團河道會有 isAdmin
						isAdmin={ this.props.isAdmin }
						// 社團河道 會有 isHead (團長)
						isHead={ this.props.isHead }
						// 頻道河道 會有 isEditor (小編)
						pageName={this.props.pageName}
						filterName={this.props.filterName}
					/>
				}
				{ // 由於ActivityLightbox裡面就會有一個AccuseActivity（是給開啟ActivityLightbox後點擊右上角檢舉文章時用的）
					// 下面這個是在河道直接檢舉（不開啟ActivityLightbox）用的
					// 所以當ActivityLightbox開啟時下面這個AccuseActivity是不render的，不然會有兩個AccuseActivity
					typeof this.props.activity.lightbox !== 'string' &&
					<AccuseActivity />
				}
			</div>
		);
	}
}

ActivityRiver.defaultProps = {
	category: null,
	categoryMap: null,
	channelId: null,
	targetPid: null,
	loadData() { return; }
};

function mapStateToProps(state) {
	return {
		pid: state.user.pid,
		activity: state.activity
	};
}

export default compose(
	connect(mapStateToProps, { updatePersonalConfig }),
	//translate([]),
	[CSSModules, '_', css]
)(ActivityRiver);
