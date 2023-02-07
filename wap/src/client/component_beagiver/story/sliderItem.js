import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class SliderItem extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { count, item } = this.props;
		const width = `${100 / count}%`;
		return (
			<li styleName="slider-item" style={ {width} }>
				<a href={ `/activity/${item.aid}` } title={ item.title } target="_blank">
					<img data-gtm-giver="他們的故事-推薦故事" src={ item.src } alt={ item.alt } />
				</a>
				{/* <div styleName="slider-item-giver">
					Giver
				</div>
				<div styleName="slider-item-taker">
					Taker
				</div> */}
			</li>
		);
	}
}

export default CSSModules(SliderItem, css, {allowMultiple: true});
