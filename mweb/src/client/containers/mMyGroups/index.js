import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';

import { initMyGroupPage, changeGroupTab } from 'src/client/actions/group';
import { Tabs, Tab } from 'c_wap_module';
import compose from 'src/util/compose';
import Announcement from 'src/client/components/announcement/index';

import GroupList from 'src/client/components/groupList';
// import {loadListDataCenter} from 'src/client/actions/general';

class MGroup extends Component {
	constructor(props){
		super(props);
		
		this.tab="我加入的";
		this.tabEng="joined";
		this.type = 'self';
		this.map = {
			"我加入的": 'joined',
			"我管理的": 'managed'
		}
	}
	componentWillMount() {
		this.props.initMyGroupPage().then(() => {
			this.props.changeGroupTab(this.map[this.tab], this.type);
		});
	}
	tabChange(prevTab, nextTab) {
		this.tab = nextTab;
		this.tabEng=this.map[nextTab];
		this.props.changeGroupTab(this.map[this.tab], this.type);
	}
	// loadMore() {
	// 	this.props.loadListDataCenter({
	// 		domain: 'group',
	// 		key: 'joined',
	// 	});
	// }
	render() {
		const { joined, loading } = this.props;
		
		return (
			<main styleName="wrap">
				<Announcement />
				{
					joined &&
					<Tabs onChange={this.tabChange.bind(this)}>
						<Tab name="我加入的">
							<GroupList 
								type='self'
								currentTab={this.tabEng}
								tabName='joined' 
							/>
						</Tab>
						<Tab name="我管理的">
							<GroupList 
								type='self'
								currentTab={this.tabEng}
								tabName='managed' 
							/>
						</Tab>
					</Tabs>
				}
				{
					loading &&
					<div styleName="loading" className="loading-box">
						<div className="loading-animate gray">
							<i></i><i></i><i></i>
						</div>
						<span>載入中</span>
					</div>
				}
			</main>
		);
	}
}

function mapStateToProps(state) {
	// console.log(state);
	return {
		joined: state.group.self.byGroup.joined,
		loading: state.group.self.loading
	};
}

export default compose(
	connect( mapStateToProps, { initMyGroupPage, changeGroupTab }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MGroup);
