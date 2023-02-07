import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import MBeAGiverLiveCom from 'src/client/components/beagiver/live';

class MBeagiverLive extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<MBeAGiverLiveCom />
		);
	}
}

export default CSSModules(MBeagiverLive, css, {allowMultiple: true});
