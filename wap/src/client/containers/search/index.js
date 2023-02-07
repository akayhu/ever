// import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import { components as CPlatformComponents } from 'c_platform';
const ViewWrapper = CPlatformComponents.ViewWrapper;

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '',
			// type: 'keyword' //for activity
		};
	}
	componentWillMount() {
		const activeTab = getActiveTab(this.props.location.pathname);
		this.setState({
			activeTab
		});
	}
	componentDidMount() {
		window.elogPage = 'search';
	}
	componentWillReceiveProps(nextProps) {
		const activeTab = getActiveTab(nextProps.location.pathname);
		if (this.props.activeTab !== activeTab) {
			this.setState({
				activeTab
			});
		}
	}
	createLeftSideNavigation() {
		const { keyword, splat } = this.props.params;
		let keywords = encodeURIComponent(keyword);
		if (splat) {
			keywords = `${keywords}/${splat}`;
		}
		return {
			activeTab: this.state.activeTab,
			navList: [
				{
					title: '文章',
					itemKey: 'activity',
					count: 0,
					url: `/search/activity/${keywords}`,
					subItems: [
						{
							title: '只搜尋文章標籤',
							itemKey: 'tag',
							count: 0,
							url: `/search/tag/${keywords}`,
							subItems: []
						}
					]
				},
				{
					title: '人物',
					itemKey: 'person',
					count: 0,
					url: `/search/person/${keywords}`,
					subItems: []
				},
				{
					title: '社團',
					itemKey: 'group',
					count: 0,
					url: `/search/group/${keywords}`,
					subItems: []
				},
				{
					title: '頻道',
					itemKey: 'channel',
					count: 0,
					url: `/search/channel/${keywords}`,
					subItems: []
				}
			]
		};
	}
	render() {
		const { children } = this.props;
		const navSetting = this.createLeftSideNavigation();
		return (
			<ViewWrapper { ...this.props } >
				<div className="container_wrap">
					<div className="wrap_w200_m20_w760">
						<div className="left_side">
							<LeftSideNavigation navSetting={ navSetting } />
						</div>
						<div className="right_side">
							{ children }
						</div>
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

function getActiveTab(pathname) {
	return pathname.replace(/\/$/, '').split('/')[2];
}

export default compose(
	// connect(mapStateToProps, { addEndorsement }),
	// translate([]),
	//[CSSModules, '_', css, { allowMultiple: true }]
)(Search);
