"use strict";

import { connect } from 'react-redux';
//import { translate } from 'react-i18next';
import React, { Component } from 'react';
//import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
//import $ from "jquery";
import { LightBox } from 'c_wap_module';
import clientConfig from 'src/configs/client';
import {actions as CPlatformActions, components as CPlatformComponents} from "c_platform";

const CPlatformActionsAlert = CPlatformActions.alert;
const ViewWrapper = CPlatformComponents.ViewWrapper;
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

class Done extends Component {
	constructor( props, context ){
		super( props, context );
	}
	componentWillMount() {
		if(canUseDOM && (!this.props.global.done.msg || !this.props.global.done.to)){
			location.href = "/";
		}
	}
	closeLightBox() {
		location.href = this.props.global.done.to;
	}
	render() {
		if(!canUseDOM){
			return null;
		}
		
		return (
			<ViewWrapper {...this.props} >
				<LightBox option={{
					onClose: this.closeLightBox.bind(this),
					closeIcon: true
				}} onClose={ this.closeLightBox.bind(this) }>
					{this.props.global.done.msg}
				</LightBox>
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state){
	return {
		global: state.global
	}
}

export default connect(mapStateToProps)(Done);
