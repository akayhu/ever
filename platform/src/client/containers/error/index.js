"use strict";

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import ViewWrapper from '../ViewWrapper';

class ErrorView extends Component {
	constructor( props, context ) {
		super( props, context );
	}
	
	render() {
		return (
			<ViewWrapper {...this.props} >
				<div className="container-wrap">
					<h1>Error</h1>
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps (state, props) {
	return {error: state.error};
}
	
//const ErrorViewCss = CSSModules( ErrorView, css, { allowMultiple : true } )
//const ErrorViewTranslate = translate( [] )( ErrorViewCss );
export default connect(mapStateToProps, null)(ErrorView);
