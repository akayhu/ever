import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
// import { translate } from 'react-i18next';
import DOMPurify from 'dompurify';

class Tooltip extends Component {
	constructor(props) {
		super(props);
		this.state = {
			icon: props.icon || 'help circle icon',
			content: props.content || '',
			width: props.width || '250px'
		};
	}
	handleHover() {
		setTimeout(() => {
			const documentHeight = document.documentElement.offsetHeight;
			const tooltopBottom = this.refs.tooltip.getBoundingClientRect().bottom;
			if (documentHeight < tooltopBottom) {
				this.refs.tooltip.classList.add(css.top);
			} else {
				this.refs.tooltip.classList.remove(css.top);
			}
		}, 100);
	}

	render() {
		return (
			<a href="javascript:;" styleName="tooltip_container">
				<i onMouseOver={ this.handleHover.bind(this) } className={ this.state.icon } />
				<div ref="tooltip" styleName="tooltip" style={ { width: this.state.width } }>
					<span
						dangerouslySetInnerHTML={ {
						__html: DOMPurify.sanitize(this.state.content, { ALLOWED_TAGS: ['a', 'br'], KEEP_CONTENT: true })} } />
				</div>
			</a>
		);
	}
}

export default CSSModules(Tooltip, css, { allowMultiple: true });
