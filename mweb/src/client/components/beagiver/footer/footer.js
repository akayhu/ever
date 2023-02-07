import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

import clientConfig from 'src/configs/client';

class MBeAGiverFooter extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<footer styleName="giver_footer">
				<div styleName="giver_content">
					Be A Giver 由 104 希望基金會發起<br />
					一零四資訊科技股份有限公司
				</div>
			</footer>
		);
	}
}

export default CSSModules(MBeAGiverFooter, css, {allowMultiple: true});
