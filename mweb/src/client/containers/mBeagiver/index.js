import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';

import MBeAGiverNav from 'src/client/components/beagiver/nav';
import MBeAGiverMain from 'src/client/containers/mBeagiver/main';
import MBeAGiverFooterMain from 'src/client/components/beagiver/footer';
import Announcement from 'src/client/components/announcement/index';

class MBeagiver extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<main styleName="giver_main">
				<Announcement />
				<div styleName="header">
					<a href="/104beagiver" title="Be A Giver">
						<img 
							src={ `${clientConfig.params.staticWapUrl}/images/beagiver/header_main.png` } 
							alt="Be A Giver" 
						/>
					</a>
					<MBeAGiverNav navSetting={ this.props.navSetting } />
				</div>
				<div styleName="giver_containers">
					{ this.props.children ? this.props.children : <MBeAGiverMain /> }
				</div>
				<MBeAGiverFooterMain />
			</main>
		);
	}
}

function mapStateToProps(state, props) {
	const giverStr = props.location.pathname.replace(/\/$/, '');
	const result = new RegExp('/m/104beagiver/(\\w+)', 'gi').exec(giverStr);
	const giverLink = () => {
		if (result !== null) {
			return result[1];
		}
		return '/m/104beagiver';
	};
	const active = giverLink();
	const navSetting = {
		active,
		navList: [
			{
				title: '最新動態',
				itemKey: '/m/104beagiver',
				url: '/m/104beagiver'
			},
			// {
			// 	title: '履歷診療室',
			// 	itemKey: 'resumeclinic',
			// 	url: '/m/104beagiver/resumeclinic'
			// },
			{
				title: '他們的故事',
				itemKey: 'story',
				url: '/m/104beagiver/story'
			},
			{
				title: '活動剪影',
				itemKey: 'live',
				url: '/m/104beagiver/live'
			}
		]
	};
	return {
		user: state.user,
		navSetting
	};
}

export default compose(
	connect(mapStateToProps, null),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MBeagiver);
