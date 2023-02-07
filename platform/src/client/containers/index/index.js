"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import ViewWrapper from '../ViewWrapper';
import css from './index.css';

class Index extends Component {
	constructor( props, context ){
		super( props, context );
	}

	render() {
		return (
			<ViewWrapper {...this.props} >
				<div className="index_wrap" styleName="wrapper">
				</div>
			</ViewWrapper>
		);
	}
}

const IndexCss = CSSModules( Index, css, { allowMultiple : true } )
//const IndexTranslate = translate( [] )( IndexCss );
//export default connect(null, null)(IndexTranslate);
export default IndexCss;
