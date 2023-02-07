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
				showMore: height >= 110,
			});
		}
	}

	render() {
		if (!has(this.props.userInfo, 'introduction')) return null;
		if (!this.props.userInfo.introduction) return null;
		return (
			<ProfileCommonBlock handleShowMore={ this.state.showMore } gtmName="個人簡介看更多">
				<div styleName="summary">
					<span styleName="title">個人簡介</span>
					<div styleName="container" ref={ (i) => { this.container = i; } }>
						<p>
							{ this.props.userInfo.introduction }
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
