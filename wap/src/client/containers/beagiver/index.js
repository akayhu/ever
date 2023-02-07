import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import BeAGiverNav from 'src/client/component_beagiver/nav';
import BeAGiverMain from 'src/client/containers/beagiver/main';
import BeAGiverFooter from 'src/client/component_beagiver/footer';

import clientConfig from 'src/configs/client';
import {components as CPlatformComponents} from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class BeAGiverIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<ViewWrapper { ...this.props }>
				<div className="container_wrap">
					<div styleName="header">
						<a href="/104beagiver" title="Be A Giver">
							<img 
								src={ `${clientConfig.params.staticWapUrl}/images/beagiver/header_main.png` } 
								alt="Be A Giver" 
							/>
						</a>
						<BeAGiverNav navSetting={ this.props.navSetting } />
					</div>
					<div styleName="main">
							{ this.props.children ? this.props.children : <BeAGiverMain /> }
					</div>
					<BeAGiverFooter />
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state, props) {
	const giverStr = props.location.pathname.replace(/\/$/, '');
	const result = new RegExp('/104beagiver/(\\w+)', 'gi').exec(giverStr);
	const giverLink = () => {
		if (result !== null) {
			return result[1];
		}
		return '/104beagiver';
	};
	const active = giverLink();
	const navSetting = {
		active,
		navList: [
			{
				title: '最新動態',
				itemKey: '/104beagiver',
				url: '/104beagiver'
			},
			// {
			// 	title: '履歷診療室',
			// 	itemKey: 'resumeclinic',
			// 	url: '/104beagiver/resumeclinic'
			// },
			{
				title: '他們的故事',
				itemKey: 'story',
				url: '/104beagiver/story'
			},
			{
				title: '活動剪影',
				itemKey: 'live',
				url: '/104beagiver/live'
			}
		]
	};
	return {
		user: state.user,
		navSetting
	};
}

// export default connect(mapStateToProps)(BeAGiverIndex);
// export default CSSModules(BeAGiverIndex, css, {allowMultiple: true});
export default compose(
	connect(mapStateToProps, null),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(BeAGiverIndex);
