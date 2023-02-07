import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import MBeAGiverStoryCom from 'src/client/components/beagiver/story';


class MBeagiverStory extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<MBeAGiverStoryCom />
		);
	}
}

export default CSSModules(MBeagiverStory, css, {allowMultiple: true});
