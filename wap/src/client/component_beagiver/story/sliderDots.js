import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class SliderDots extends Component {
	constructor(props) {
		super(props);
	}
	handleDotClick(i) {
		const option = i - this.props.nowLocal;
		this.props.turn(option);
	}
	render() {
		const dotNodes = [];
		const { count, nowLocal } = this.props;
		for (let i = 0; i < count; i++) {
			dotNodes[i] = (
				<span
					key={ `dot${i}` }
					styleName={ `slider-dot${i === this.props.nowLocal ? ' slider-dot-selected' : ''}` }
					onClick={ this.handleDotClick.bind(this, i) }
				/>
			);
		}
		return (
			<div styleName="slider-dots-wrap">
				{dotNodes}
			</div>
		);
	}
}

export default CSSModules(SliderDots, css, {allowMultiple: true});
