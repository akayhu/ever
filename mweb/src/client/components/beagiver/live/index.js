import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import TopVideo from './topVideo';
import ListVideo from './listVideo';
import { LIVE_DATA } from './live_data.js';

class MBeAGiverLiveCom extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const [first, ...list] = LIVE_DATA;
		return (
			<div>
				<TopVideo
					data={ first }
				/>
				<ListVideo
					data={ list }
				/>
			</div>
		);
	}
}

export default CSSModules(MBeAGiverLiveCom, css, {allowMultiple: true});
