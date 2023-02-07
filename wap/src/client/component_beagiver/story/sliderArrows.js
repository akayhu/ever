import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class SliderArrows extends Component {
	constructor(props) {
		super(props);
	}
	handleArrowClick(option) {
		this.props.turn(option);
	}
	render() {
		return (
			<div>
				<span
					styleName="slider-arrow slider-arrow-left"
					onClick={ this.handleArrowClick.bind(this, -1) }
				>
					&lt;
				</span>
				<span
					styleName="slider-arrow slider-arrow-right"
					onClick={ this.handleArrowClick.bind(this, 1) }
				>
					&gt;
				</span>
			</div>
		);
	}
}

export default CSSModules(SliderArrows, css, {allowMultiple: true});
