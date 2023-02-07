import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
//import CSSModules from 'react-css-modules';
//import css from './index.css';
import compose from 'src/util/compose';
import cx from 'classnames';
import { changeListTab } from 'src/client/actions/channel';
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import IndexContent from 'src/client/component_channel/indexContent';
import { loadDataCenter } from 'src/client/actions/channel';
import { getDataList, getIsLoading } from 'src/client/reducers/channel';
import clientConfig from 'src/configs/client';
import { 
	components as CPlatformComponents,
	actions as CPlatformActions
} from 'c_platform';

const { setMetadata } = CPlatformActions.metadata;
const ViewWrapper = CPlatformComponents.ViewWrapper;

class ChannelList extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {};
		//this.state.defSCategory = "recommend";
		this.state.category = 'recommend';//props.location.query.category;
	}
	componentDidMount() {
		const { loadDataCenter } = this.props;
		loadDataCenter('recommend', 'init');
		loadDataCenter('all', 'init');
		loadDataCenter('joined', 'init');
		this.props.setMetadata('channel');
		window.elogPage = "channel";
	}
	componentWillReceiveProps(nextProps) {
		const deftab = "recommend";
		const activeTab = nextProps.location.query.category||deftab;
		
		if(this.state.category !== activeTab){
			this.setState({category: activeTab} );
			this.props.changeListTab(activeTab);
			return;
		}
	}
	createLeftSideNavigation() {
		const navSetting = {
			activeTab: this.state.category,
			navList: [
				{
					title: "推薦頻道",
					itemKey: "recommend",
					count: 0,
					url: "/channel?category=recommend",
					subItems:[]
				},
				{
					title: "全部頻道",
					itemKey: "all",
					count: 0,
					url: "/channel?category=all",
					subItems:[]
				}
			]
		};

		if(this.props.channel.channelList.joined.total > 0){
			navSetting.navList.splice(1, 0, {
				title: "已關注頻道",
				itemKey: "joined",
				count: 0,
				url: "/channel?category=joined",
				subItems:[]
			})
		}
		
		return navSetting;
	}
	render() {
		const navSetting = this.createLeftSideNavigation();

		return (
			<ViewWrapper {...this.props} >
				<div className="container_wrap">
					<div className="wrap_w200_m20_w760">
						<div className="left_side">
							<LeftSideNavigation navSetting={navSetting} />
						</div>
						<div className="right_side">
							<IndexContent activeTab={ navSetting.activeTab } />
						</div>
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state){
	return {
		channel: state.channel
	}
}

function mapDispatchToProps(dispatch) {
	return {
		changeListTab: params => dispatch(changeListTab(params)),
		loadDataCenter: (tab, isInit, options) => dispatch(loadDataCenter(tab, isInit, options)),
		setMetadata: (key = 'channel') => dispatch(setMetadata(key))
	};
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	//translate([]),
	//[CSSModules, '_', css, { allowMultiple: true }]
)(ChannelList);
