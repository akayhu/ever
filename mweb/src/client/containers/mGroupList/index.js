import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';

import { initGroupPage, changeGroupTab } from 'src/client/actions/group';
import { Tabs, Tab } from 'c_wap_module';
import compose from 'src/util/compose';

import GroupList from 'src/client/components/groupList';
import Announcement from 'src/client/components/announcement/index';
// import {loadListDataCenter} from 'src/client/actions/general';

class MGroup extends Component {
	constructor(props){
		super(props);
		
		this.tab = '知識技術';
		this.type = 'all';
	}
	componentWillMount() {
		this.props.initGroupPage().then(() => {
			this.props.changeGroupTab(this.tab, this.type);
		});
	}
	// loadMore() {
	// 	this.props.loadListDataCenter({
	// 		domain: 'group',
	// 		key: this.tab,
	// 	});
	// }
	tabChange(prevTab, nextTab) {
		this.tab = nextTab;
		this.props.changeGroupTab(this.tab, this.type);
	}
	render() {
		const {groupTab, loading} = this.props;
		
		return (
			<main styleName="wrap">
				<Announcement />
				{ 
					Object.keys(groupTab).length > 0 &&
					<Tabs onChange={this.tabChange.bind(this)}>
						{
							Object.keys(groupTab).map((key, id) => {
								return (
									<Tab name={key}>
										<GroupList
											currentTab={this.tab}
											type='all' 
											tabName={key} 
										/>
									</Tab>
								);
							})
						}
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
	return {
		groupTab: state.group.all.byGroup,
		loading: state.group.all.loading
	};
}

export default compose(
	connect( mapStateToProps, { initGroupPage, changeGroupTab }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MGroup);
