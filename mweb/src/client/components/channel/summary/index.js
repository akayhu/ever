import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { has } from 'lodash/object';
// components
import ProfileCommonBlock from 'src/client/components/profileCommonBlock';

class Summary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: null,
		};
	}
	componentWillReceiveProps() {
		if (this.container) {
			const height = findDOMNode(this.container).clientHeight;
			this.setState({
				showMore: height >= 105,
			});
		}
	}

	render() {
		if (!has(this.props.channelInfo, 'description')) return null;
		if (!this.props.channelInfo.description) return null;
		return (
			<ProfileCommonBlock backBtnText="頻道檔案" handleShowMore={ this.state.showMore }>
				<div styleName="summary">
					<span styleName="title">頻道簡介</span>
					<div styleName="container" ref={ (i) => { this.container = i; } }>
						<p>
							{ this.props.channelInfo.description }
						</p>
					</div>
				</div>
			</ProfileCommonBlock>
		);
	}
}


export default compose(
	[CSSModules, '_', css, { allowMultiple: true }],
)(Summary);
