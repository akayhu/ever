import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { canUseDOM } from 'exenv';

import css from './index.css';
import SubNav from 'src/client/component_common/subNav';

import { loadProfile } from 'src/client/actions/profile';

import { bindActionCreators } from 'redux';
import clientConfig from 'src/configs/client';
import {components as CPlatformComponents} from 'c_platform';
const ViewWrapper = CPlatformComponents.ViewWrapper;

class Test extends Component {
	constructor( props, context ){
		super( props, context );
		this.state = {};
	}
	// componentWillReceiveProps(nextProps) {

	// }
	// componentDidUpdate( prevProps, prevState ) {
	// 	if ( document.body.classList.contains('dimmed') ) {
	// 		document.body.classList.remove('dimmed');
	// 	}
	// }

	render() {
		return (
			<ViewWrapper {...this.props} >
				<div className="container_wrap" styleName="wrapper">
					<SubNav navSetting={this.props.navSetting} />
					{this.props.children}
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps (state, props) {
	const testStr = props.location.pathname.replace(/\/$/,"");
	const result = new RegExp("/test/(\\w+)", "gi").exec(testStr);
	if(!result && canUseDOM) props.router.replace('/error/500');
	const active = result && result[1]||"job";
	const navSetting = {
		active: active,
		tagName: 'job',
		navList: [
			{
				title: "職務適性",
				itemKey: "job",
				count: 0,
				url: '/test/job'
			},
			{
				title: "組織適性",
				itemKey: "org",
				count: 0,
				url: '/test/org'
			},
			{
				title: "產業適性",
				itemKey: "industry",
				count: 0,
				url: '/test/industry'
			}
		]
	};

	return {
		user: state.user,
		navSetting: navSetting
	}
}

export default compose(
		connect(mapStateToProps, null),
		//translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Test);
