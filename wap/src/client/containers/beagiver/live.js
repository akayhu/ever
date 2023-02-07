import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import BeAGiverLiveCom from 'src/client/component_beagiver/live';

class BeAGiverLive extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<BeAGiverLiveCom />
		);
	}
}

export default CSSModules(BeAGiverLive, css, {allowMultiple: true});
